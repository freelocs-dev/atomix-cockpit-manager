package dev.freelocs.cosmicprisons.system;

import dev.freelocs.cosmicprisons.component.CosmicEnergyComponent;
import dev.freelocs.cosmicprisons.registry.ModComponents;
import net.minecraft.block.Block;
import net.minecraft.block.BlockState;
import net.minecraft.item.ItemStack;
import net.minecraft.registry.tag.BlockTags;
import net.minecraft.server.network.ServerPlayerEntity;
import net.minecraft.text.Text;
import net.minecraft.util.Formatting;
import net.minecraft.util.math.BlockPos;
import net.minecraft.world.World;

public final class CosmicEnergySystem {

    /**
     * Returns CE value per block broken, factoring in ore tier.
     * Values are deliberately generous to feel rewarding.
     */
    public static long getCEValue(BlockState state) {
        Block block = state.getBlock();
        String id = net.minecraft.registry.Registries.BLOCK.getId(block).getPath();

        if (id.contains("ancient_debris"))    return 50_000L;
        if (id.contains("diamond"))           return 10_000L;
        if (id.contains("emerald"))           return 8_000L;
        if (id.contains("gold"))              return 3_000L;
        if (id.contains("iron"))              return 1_500L;
        if (id.contains("redstone"))          return 1_200L;
        if (id.contains("lapis"))             return 1_000L;
        if (id.contains("coal"))              return 500L;
        if (id.contains("quartz"))            return 800L;
        if (id.contains("copper"))            return 600L;
        if (state.isIn(BlockTags.PICKAXE_MINEABLE)) return 100L;
        return 50L;
    }

    /**
     * Applies Token Greed enchantment multiplier (1 + 0.25 per level).
     */
    public static long applyTokenGreed(long base, int tokenGreedLevel) {
        if (tokenGreedLevel <= 0) return base;
        return (long) (base * (1.0 + 0.25 * tokenGreedLevel));
    }

    /**
     * Adds CE to the pickaxe. Returns overflow amount that could not be stored.
     */
    public static long addCEToPickaxe(ItemStack pickaxe, long amount) {
        CosmicEnergyComponent current = pickaxe.getOrDefault(ModComponents.COSMIC_ENERGY,
            new CosmicEnergyComponent());

        if (current.isFull()) return amount;

        long canStore = Math.min(amount, current.available());
        pickaxe.set(ModComponents.COSMIC_ENERGY, current.addEnergy(canStore));
        return amount - canStore;
    }

    /**
     * Extracts all CE from the pickaxe and credits it to the player's account.
     * Returns the amount extracted.
     */
    public static long extractFromPickaxe(ItemStack pickaxe, ServerPlayerEntity player) {
        CosmicEnergyComponent energy = pickaxe.get(ModComponents.COSMIC_ENERGY);
        if (energy == null || energy.stored() <= 0) return 0;

        long extracted = energy.stored();
        pickaxe.set(ModComponents.COSMIC_ENERGY, energy.removeEnergy(extracted));

        PlayerDataState state = PlayerDataState.getServerState(player.getServer());
        PlayerDataState.PlayerData data = state.getOrCreate(player.getUuid());
        data.cosmicEnergy += extracted;
        state.markDirty();

        return extracted;
    }

    /**
     * Checks if the player's total CE qualifies for a rank-up and applies it.
     */
    public static boolean tryRankUp(ServerPlayerEntity player, PlayerDataState state) {
        PlayerDataState.PlayerData data = state.getOrCreate(player.getUuid());
        PlayerDataState.CosmicRank currentRank = PlayerDataState.CosmicRank.fromOrdinal(data.rank);
        PlayerDataState.CosmicRank nextRank = currentRank.next();

        if (nextRank == currentRank) return false;
        if (data.cosmicEnergy < nextRank.ceRequired) return false;

        data.cosmicEnergy -= nextRank.ceRequired;
        data.rank++;

        // Prestige if at max rank
        if (PlayerDataState.CosmicRank.fromOrdinal(data.rank) == PlayerDataState.CosmicRank.PRESTIGE) {
            data.rank = 0;
            data.prestige++;
            state.markDirty();
            player.sendMessage(
                Text.literal(String.format(
                    "§d§lPRESTIGE! §5You've reached Prestige §d%d§5!", data.prestige
                )),
                false
            );
            return true;
        }

        state.markDirty();
        player.sendMessage(
            Text.literal(String.format(
                "§6§lRANK UP! §eYou are now rank §6%s§e!", nextRank.displayName
            )),
            false
        );
        return true;
    }

    /**
     * Sends an action-bar CE notification without spamming on every block.
     * Call when pickaxe becomes full or at milestone percentages.
     */
    public static void notifyEnergyStatus(ServerPlayerEntity player, ItemStack pickaxe) {
        CosmicEnergyComponent energy = pickaxe.get(ModComponents.COSMIC_ENERGY);
        if (energy == null) return;

        if (energy.isFull()) {
            player.sendMessage(
                Text.literal("§c§lPICKAXE FULL! §fUse §e/extract §fto collect your CE"),
                true
            );
        } else {
            player.sendMessage(
                Text.literal("§bCE: §f" + energy.formattedStored() + " §7/ §f" + energy.formattedCapacity()),
                true
            );
        }
    }

    private CosmicEnergySystem() {}
}
