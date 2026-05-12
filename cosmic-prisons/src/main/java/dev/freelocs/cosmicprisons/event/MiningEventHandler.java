package dev.freelocs.cosmicprisons.event;

import dev.freelocs.cosmicprisons.component.CosmicEnergyComponent;
import dev.freelocs.cosmicprisons.component.SatchelDataComponent;
import dev.freelocs.cosmicprisons.item.CosmicPickaxeItem;
import dev.freelocs.cosmicprisons.item.OreSatchelItem;
import dev.freelocs.cosmicprisons.network.MiningAnimationPacket;
import dev.freelocs.cosmicprisons.registry.ModComponents;
import dev.freelocs.cosmicprisons.system.CosmicEnergySystem;
import dev.freelocs.cosmicprisons.system.MiningAnimationSystem;
import dev.freelocs.cosmicprisons.system.PlayerDataState;
import net.fabricmc.fabric.api.event.player.PlayerBlockBreakEvents;
import net.minecraft.block.BlockState;
import net.minecraft.block.entity.BlockEntity;
import net.minecraft.component.DataComponentTypes;
import net.minecraft.component.type.ItemEnchantmentsComponent;
import net.minecraft.enchantment.Enchantment;
import net.minecraft.enchantment.EnchantmentHelper;
import net.minecraft.entity.player.PlayerEntity;
import net.minecraft.item.ItemStack;
import net.minecraft.registry.RegistryKey;
import net.minecraft.registry.RegistryKeys;
import net.minecraft.registry.tag.BlockTags;
import net.minecraft.server.network.ServerPlayerEntity;
import net.minecraft.server.world.ServerWorld;
import net.minecraft.util.Identifier;
import net.minecraft.util.math.BlockPos;
import net.minecraft.world.World;

import java.util.Random;

public final class MiningEventHandler {

    private static final Random RANDOM = new Random();

    private static final Identifier EXPLOSIVE_ID = Identifier.of("cosmicprisons", "explosive_mining");
    private static final Identifier TOKEN_GREED_ID = Identifier.of("cosmicprisons", "token_greed");
    private static final Identifier LUCKY_STRIKE_ID = Identifier.of("cosmicprisons", "lucky_strike");
    private static final Identifier WORMHOLE_ID = Identifier.of("cosmicprisons", "wormhole");
    private static final Identifier SUPER_BREAKER_ID = Identifier.of("cosmicprisons", "super_breaker");

    public static void register() {
        PlayerBlockBreakEvents.AFTER.register(MiningEventHandler::onBlockBroken);
    }

    private static void onBlockBroken(World world, PlayerEntity player,
                                       BlockPos pos, BlockState state, BlockEntity blockEntity) {
        if (world.isClient) return;
        if (!(player instanceof ServerPlayerEntity serverPlayer)) return;

        ItemStack mainHand = player.getMainHandStack();
        if (!(mainHand.getItem() instanceof CosmicPickaxeItem)) return;
        if (!state.isIn(BlockTags.PICKAXE_MINEABLE)) return;

        ServerWorld serverWorld = (ServerWorld) world;
        ItemEnchantmentsComponent enchants = mainHand.getOrDefault(
            DataComponentTypes.ENCHANTMENTS, ItemEnchantmentsComponent.DEFAULT);

        int tokenGreedLevel   = getEnchantLevel(serverWorld, enchants, TOKEN_GREED_ID);
        int explosiveLevel    = getEnchantLevel(serverWorld, enchants, EXPLOSIVE_ID);
        int luckyLevel        = getEnchantLevel(serverWorld, enchants, LUCKY_STRIKE_ID);
        int wormholeLevel     = getEnchantLevel(serverWorld, enchants, WORMHOLE_ID);

        // --- Cosmic Energy ---
        long baseCE = CosmicEnergySystem.getCEValue(state);
        long finalCE = CosmicEnergySystem.applyTokenGreed(baseCE, tokenGreedLevel);

        CosmicEnergyComponent before = mainHand.getOrDefault(ModComponents.COSMIC_ENERGY, new CosmicEnergyComponent());
        CosmicEnergySystem.addCEToPickaxe(mainHand, finalCE);
        CosmicEnergyComponent after = mainHand.getOrDefault(ModComponents.COSMIC_ENERGY, new CosmicEnergyComponent());

        // Notify when pickaxe becomes full or on 10% milestones
        boolean justFull = !before.isFull() && after.isFull();
        if (justFull || (after.fillPercent() > 0 && Math.round(after.fillPercent() * 10) != Math.round(before.fillPercent() * 10))) {
            CosmicEnergySystem.notifyEnergyStatus(serverPlayer, mainHand);
        }

        // --- Ore Satchel auto-collect ---
        String blockId = net.minecraft.registry.Registries.BLOCK.getId(state.getBlock()).toString();
        if (isCollectableOre(state)) {
            for (ItemStack invStack : player.getInventory().main) {
                if (invStack.getItem() instanceof OreSatchelItem && !invStack.isEmpty()) {
                    SatchelDataComponent satchel = invStack.getOrDefault(
                        ModComponents.SATCHEL_DATA, new SatchelDataComponent());
                    if (satchel.isFull()) {
                        serverPlayer.sendMessage(
                            net.minecraft.text.Text.literal("§c§lSATCHEL FULL! §fEmpty your satchel."),
                            true
                        );
                        break;
                    }
                    invStack.set(ModComponents.SATCHEL_DATA, satchel.addOre(blockId, 1L));
                    break;
                }
            }
        }

        // --- Lucky Strike ---
        if (luckyLevel > 0) {
            double luckyChance = 0.05 * luckyLevel;
            if (RANDOM.nextDouble() < luckyChance) {
                long bonusCE = finalCE * (2L + luckyLevel);
                CosmicEnergySystem.addCEToPickaxe(mainHand, bonusCE);
                MiningAnimationSystem.playLuckyEffect(serverPlayer, pos);
                MiningAnimationPacket.send(serverPlayer, pos, MiningAnimationPacket.TYPE_LUCKY);
            }
        }

        // --- Wormhole (auto-smelt drops) ---
        if (wormholeLevel > 0) {
            MiningAnimationSystem.playWormholeEffect(serverPlayer, pos);
            MiningAnimationPacket.send(serverPlayer, pos, MiningAnimationPacket.TYPE_WORMHOLE);
        }

        // --- Explosive Mining (3x3 up to 5x5 area) ---
        if (explosiveLevel > 0) {
            int radius = Math.min(explosiveLevel, 2);
            handleExplosiveMining(serverPlayer, serverWorld, mainHand, pos, state, radius, enchants, tokenGreedLevel);
            MiningAnimationSystem.playExplosiveEffect(serverPlayer, pos, radius);
            MiningAnimationPacket.send(serverPlayer, pos, MiningAnimationPacket.TYPE_EXPLOSIVE);
        } else {
            MiningAnimationSystem.playMineEffect(serverPlayer, pos);
            MiningAnimationPacket.send(serverPlayer, pos, MiningAnimationPacket.TYPE_NORMAL);
        }

        // --- Player stat tracking & rank-up check ---
        PlayerDataState state2 = PlayerDataState.getServerState(serverPlayer.getServer());
        PlayerDataState.PlayerData pData = state2.getOrCreate(serverPlayer.getUuid());
        pData.totalBlocksMined++;
        state2.markDirty();

        CosmicEnergySystem.tryRankUp(serverPlayer, state2);
    }

    private static void handleExplosiveMining(ServerPlayerEntity player, ServerWorld world,
                                               ItemStack pickaxe, BlockPos center, BlockState triggerState,
                                               int radius, ItemEnchantmentsComponent enchants, int tokenGreedLevel) {
        for (int dx = -radius; dx <= radius; dx++) {
            for (int dy = -radius; dy <= radius; dy++) {
                for (int dz = -radius; dz <= radius; dz++) {
                    if (dx == 0 && dy == 0 && dz == 0) continue;
                    BlockPos target = center.add(dx, dy, dz);
                    BlockState targetState = world.getBlockState(target);
                    if (targetState.isAir()) continue;
                    if (!targetState.isIn(BlockTags.PICKAXE_MINEABLE)) continue;
                    if (targetState.getHardness(world, target) < 0) continue;

                    world.breakBlock(target, true, player);

                    long bonusCE = CosmicEnergySystem.applyTokenGreed(
                        CosmicEnergySystem.getCEValue(targetState), tokenGreedLevel);
                    CosmicEnergySystem.addCEToPickaxe(pickaxe, bonusCE);
                }
            }
        }
    }

    private static int getEnchantLevel(ServerWorld world, ItemEnchantmentsComponent enchants, Identifier enchId) {
        return world.getRegistryManager()
            .getOrThrow(RegistryKeys.ENCHANTMENT)
            .getOptional(RegistryKey.of(RegistryKeys.ENCHANTMENT, enchId))
            .map(enchants::getLevel)
            .orElse(0);
    }

    private static boolean isCollectableOre(BlockState state) {
        String path = net.minecraft.registry.Registries.BLOCK.getId(state.getBlock()).getPath();
        return path.contains("ore") || path.contains("ancient_debris");
    }

    private MiningEventHandler() {}
}
