package dev.freelocs.cosmicprisons.command;

import com.mojang.brigadier.CommandDispatcher;
import com.mojang.brigadier.arguments.IntegerArgumentType;
import com.mojang.brigadier.arguments.StringArgumentType;
import dev.freelocs.cosmicprisons.item.CosmicPickaxeItem;
import net.minecraft.command.CommandRegistryAccess;
import net.minecraft.command.argument.EntityArgumentType;
import net.minecraft.component.DataComponentTypes;
import net.minecraft.component.type.ItemEnchantmentsComponent;
import net.minecraft.enchantment.Enchantment;
import net.minecraft.item.ItemStack;
import net.minecraft.registry.RegistryKey;
import net.minecraft.registry.RegistryKeys;
import net.minecraft.registry.RegistryWrapper;
import net.minecraft.server.command.ServerCommandSource;
import net.minecraft.server.network.ServerPlayerEntity;
import net.minecraft.text.Text;
import net.minecraft.util.Formatting;
import net.minecraft.util.Identifier;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static net.minecraft.server.command.CommandManager.argument;
import static net.minecraft.server.command.CommandManager.literal;

public final class CosmicEnchantCommand {

    private static final List<String> COSMIC_ENCHANTS = Arrays.asList(
        "explosive_mining", "token_greed", "lucky_strike", "wormhole", "super_breaker"
    );

    public static void register(CommandDispatcher<ServerCommandSource> dispatcher,
                                 CommandRegistryAccess registryAccess) {
        dispatcher.register(
            literal("cosmicenchant")
                .requires(src -> src.hasPermissionLevel(2))
                .then(argument("enchantment", StringArgumentType.word())
                    .suggests((ctx, builder) -> {
                        COSMIC_ENCHANTS.forEach(builder::suggest);
                        return builder.buildFuture();
                    })
                    .then(argument("level", IntegerArgumentType.integer(1, 10))
                        .then(argument("target", EntityArgumentType.player())
                            .executes(ctx -> applyEnchant(
                                ctx.getSource(),
                                EntityArgumentType.getPlayer(ctx, "target"),
                                StringArgumentType.getString(ctx, "enchantment"),
                                IntegerArgumentType.getInteger(ctx, "level")
                            ))
                        )
                        .executes(ctx -> applyEnchant(
                            ctx.getSource(),
                            ctx.getSource().getPlayerOrThrow(),
                            StringArgumentType.getString(ctx, "enchantment"),
                            IntegerArgumentType.getInteger(ctx, "level")
                        ))
                    )
                )
        );
    }

    private static int applyEnchant(ServerCommandSource source, ServerPlayerEntity target,
                                     String enchantName, int level)
        throws com.mojang.brigadier.exceptions.CommandSyntaxException {

        ItemStack stack = target.getMainHandStack();
        if (!(stack.getItem() instanceof CosmicPickaxeItem)) {
            source.sendFeedback(() -> Text.translatable("command.cosmicprisons.cosmicenchant.nopickaxe")
                .formatted(Formatting.RED), false);
            return 0;
        }

        if (!COSMIC_ENCHANTS.contains(enchantName)) {
            source.sendFeedback(() -> Text.literal(
                "Unknown cosmic enchantment: " + enchantName + ". Valid: " + String.join(", ", COSMIC_ENCHANTS)
            ).formatted(Formatting.RED), false);
            return 0;
        }

        Identifier enchId = Identifier.of("cosmicprisons", enchantName);
        RegistryWrapper.WrapperLookup registries = source.getServer().getRegistryManager();

        Optional<? extends net.minecraft.registry.entry.RegistryEntry<Enchantment>> enchEntry =
            registries.getOrThrow(RegistryKeys.ENCHANTMENT)
                .getOptional(RegistryKey.of(RegistryKeys.ENCHANTMENT, enchId));

        if (enchEntry.isEmpty()) {
            source.sendFeedback(() -> Text.literal(
                "Enchantment '" + enchantName + "' not found in registry. Ensure the data pack is loaded."
            ).formatted(Formatting.RED), false);
            return 0;
        }

        int maxLevel = enchEntry.get().value().getMaxLevel();
        int clampedLevel = Math.min(level, maxLevel);

        ItemEnchantmentsComponent.Builder builder = new ItemEnchantmentsComponent.Builder(
            stack.getOrDefault(DataComponentTypes.ENCHANTMENTS, ItemEnchantmentsComponent.DEFAULT)
        );
        builder.set(enchEntry.get(), clampedLevel);
        stack.set(DataComponentTypes.ENCHANTMENTS, builder.build());

        String displayName = enchantName.replace("_", " ");
        displayName = Character.toUpperCase(displayName.charAt(0)) + displayName.substring(1);
        final String finalName = displayName;
        final int finalLevel = clampedLevel;

        source.sendFeedback(() -> Text.literal(
            "§aApplied §e" + finalName + " " + toRoman(finalLevel)
                + " §ato §e" + target.getName().getString() + "§a's pickaxe!"
        ), true);
        return 1;
    }

    private static String toRoman(int n) {
        return switch (n) {
            case 1 -> "I"; case 2 -> "II"; case 3 -> "III"; case 4 -> "IV";
            case 5 -> "V"; case 6 -> "VI"; case 7 -> "VII"; case 8 -> "VIII";
            case 9 -> "IX"; case 10 -> "X";
            default -> String.valueOf(n);
        };
    }

    private CosmicEnchantCommand() {}
}
