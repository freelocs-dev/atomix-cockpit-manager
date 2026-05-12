package dev.freelocs.cosmicprisons.command;

import com.mojang.brigadier.CommandDispatcher;
import com.mojang.brigadier.arguments.LongArgumentType;
import com.mojang.brigadier.arguments.StringArgumentType;
import dev.freelocs.cosmicprisons.item.CosmicEnergyTokenItem;
import dev.freelocs.cosmicprisons.item.OreSatchelItem;
import dev.freelocs.cosmicprisons.registry.ModItems;
import net.minecraft.command.CommandRegistryAccess;
import net.minecraft.command.argument.EntityArgumentType;
import net.minecraft.item.ItemStack;
import net.minecraft.server.command.CommandManager;
import net.minecraft.server.command.ServerCommandSource;
import net.minecraft.server.network.ServerPlayerEntity;
import net.minecraft.text.Text;
import net.minecraft.util.Formatting;

import java.util.Collection;

import static net.minecraft.server.command.CommandManager.argument;
import static net.minecraft.server.command.CommandManager.literal;

public final class AdminGiveCommand {

    public static void register(CommandDispatcher<ServerCommandSource> dispatcher) {
        dispatcher.register(
            literal("admingive")
                .requires(src -> src.hasPermissionLevel(2))
                .then(literal("cosmic_pickaxe")
                    .then(argument("target", EntityArgumentType.players())
                        .executes(ctx -> givePickaxe(ctx.getSource(),
                            EntityArgumentType.getPlayers(ctx, "target")))
                    )
                    .executes(ctx -> givePickaxe(ctx.getSource(),
                        java.util.List.of(ctx.getSource().getPlayerOrThrow())))
                )
                .then(literal("ore_satchel")
                    .then(argument("target", EntityArgumentType.players())
                        .executes(ctx -> giveSatchel(ctx.getSource(),
                            EntityArgumentType.getPlayers(ctx, "target"),
                            OreSatchelItem.Tier.IRON))
                    )
                    .executes(ctx -> giveSatchel(ctx.getSource(),
                        java.util.List.of(ctx.getSource().getPlayerOrThrow()),
                        OreSatchelItem.Tier.IRON))
                )
                .then(literal("diamond_satchel")
                    .then(argument("target", EntityArgumentType.players())
                        .executes(ctx -> giveSatchel(ctx.getSource(),
                            EntityArgumentType.getPlayers(ctx, "target"),
                            OreSatchelItem.Tier.DIAMOND))
                    )
                    .executes(ctx -> giveSatchel(ctx.getSource(),
                        java.util.List.of(ctx.getSource().getPlayerOrThrow()),
                        OreSatchelItem.Tier.DIAMOND))
                )
                .then(literal("ce_token")
                    .then(argument("amount", LongArgumentType.longArg(1))
                        .then(argument("target", EntityArgumentType.players())
                            .executes(ctx -> giveCEToken(ctx.getSource(),
                                EntityArgumentType.getPlayers(ctx, "target"),
                                LongArgumentType.getLong(ctx, "amount")))
                        )
                        .executes(ctx -> giveCEToken(ctx.getSource(),
                            java.util.List.of(ctx.getSource().getPlayerOrThrow()),
                            LongArgumentType.getLong(ctx, "amount")))
                    )
                )
                .executes(ctx -> showHelp(ctx.getSource()))
        );
    }

    private static int givePickaxe(ServerCommandSource source, Collection<ServerPlayerEntity> targets) {
        for (ServerPlayerEntity player : targets) {
            ItemStack stack = new ItemStack(ModItems.COSMIC_PICKAXE);
            stack.set(dev.freelocs.cosmicprisons.registry.ModComponents.COSMIC_ENERGY,
                new dev.freelocs.cosmicprisons.component.CosmicEnergyComponent());
            if (!player.getInventory().insertStack(stack)) {
                player.dropItem(stack, false);
            }
            source.sendFeedback(() -> Text.literal("Gave Cosmic Pickaxe to " + player.getName().getString())
                .formatted(Formatting.GREEN), true);
        }
        return targets.size();
    }

    private static int giveSatchel(ServerCommandSource source, Collection<ServerPlayerEntity> targets,
                                    OreSatchelItem.Tier tier) {
        for (ServerPlayerEntity player : targets) {
            ItemStack stack = new ItemStack(tier == OreSatchelItem.Tier.DIAMOND
                ? ModItems.DIAMOND_SATCHEL : ModItems.ORE_SATCHEL);
            stack.set(dev.freelocs.cosmicprisons.registry.ModComponents.SATCHEL_DATA,
                OreSatchelItem.initForTier(tier));
            if (!player.getInventory().insertStack(stack)) {
                player.dropItem(stack, false);
            }
            source.sendFeedback(() -> Text.literal(
                "Gave " + tier.name() + " Satchel to " + player.getName().getString()
            ).formatted(Formatting.GREEN), true);
        }
        return targets.size();
    }

    private static int giveCEToken(ServerCommandSource source, Collection<ServerPlayerEntity> targets, long amount) {
        for (ServerPlayerEntity player : targets) {
            ItemStack token = CosmicEnergyTokenItem.createWithEnergy(amount);
            if (!player.getInventory().insertStack(token)) {
                player.dropItem(token, false);
            }
            source.sendFeedback(() -> Text.literal(
                "Gave CE Token (" + dev.freelocs.cosmicprisons.component.CosmicEnergyComponent.formatCE(amount)
                    + ") to " + player.getName().getString()
            ).formatted(Formatting.GREEN), true);
        }
        return targets.size();
    }

    private static int showHelp(ServerCommandSource source) {
        source.sendFeedback(() -> Text.literal(
            "§6/admingive §ecosmic_pickaxe§7 | §eore_satchel§7 | §ediamond_satchel§7 | §ece_token <amount>§7 [player]"
        ), false);
        return 1;
    }

    private AdminGiveCommand() {}
}
