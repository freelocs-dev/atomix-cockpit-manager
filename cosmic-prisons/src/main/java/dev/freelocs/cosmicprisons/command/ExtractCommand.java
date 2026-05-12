package dev.freelocs.cosmicprisons.command;

import com.mojang.brigadier.CommandDispatcher;
import dev.freelocs.cosmicprisons.component.CosmicEnergyComponent;
import dev.freelocs.cosmicprisons.item.CosmicPickaxeItem;
import dev.freelocs.cosmicprisons.system.CosmicEnergySystem;
import dev.freelocs.cosmicprisons.system.PlayerDataState;
import net.minecraft.item.ItemStack;
import net.minecraft.server.command.ServerCommandSource;
import net.minecraft.server.network.ServerPlayerEntity;
import net.minecraft.text.Text;
import net.minecraft.util.Formatting;

import static net.minecraft.server.command.CommandManager.literal;

public final class ExtractCommand {

    public static void register(CommandDispatcher<ServerCommandSource> dispatcher) {
        dispatcher.register(
            literal("extract")
                .requires(src -> src.getPlayer() != null)
                .executes(ctx -> extract(ctx.getSource()))
        );
    }

    private static int extract(ServerCommandSource source) throws com.mojang.brigadier.exceptions.CommandSyntaxException {
        ServerPlayerEntity player = source.getPlayerOrThrow();
        ItemStack mainHand = player.getMainHandStack();

        if (!(mainHand.getItem() instanceof CosmicPickaxeItem)) {
            source.sendFeedback(() -> Text.translatable("command.cosmicprisons.extract.nopickaxe")
                .formatted(Formatting.RED), false);
            return 0;
        }

        long extracted = CosmicEnergySystem.extractFromPickaxe(mainHand, player);
        if (extracted <= 0) {
            source.sendFeedback(() -> Text.translatable("command.cosmicprisons.extract.empty")
                .formatted(Formatting.YELLOW), false);
            return 0;
        }

        String formatted = CosmicEnergyComponent.formatCE(extracted);
        source.sendFeedback(() -> Text.literal(
            "§aExtracted §e" + formatted + " CE §afrom your pickaxe!"
        ), false);

        // Show updated account balance
        PlayerDataState state = PlayerDataState.getServerState(source.getServer());
        PlayerDataState.PlayerData data = state.getOrCreate(player.getUuid());
        source.sendFeedback(() -> Text.literal(
            "§7Account balance: §e" + CosmicEnergyComponent.formatCE(data.cosmicEnergy) + " CE"
        ), false);

        return 1;
    }

    private ExtractCommand() {}
}
