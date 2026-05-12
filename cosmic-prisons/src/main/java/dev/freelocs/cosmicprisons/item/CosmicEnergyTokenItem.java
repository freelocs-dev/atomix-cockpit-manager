package dev.freelocs.cosmicprisons.item;

import dev.freelocs.cosmicprisons.component.CosmicEnergyComponent;
import dev.freelocs.cosmicprisons.registry.ModComponents;
import dev.freelocs.cosmicprisons.system.PlayerDataState;
import net.minecraft.entity.player.PlayerEntity;
import net.minecraft.item.Item;
import net.minecraft.item.ItemStack;
import net.minecraft.item.tooltip.TooltipType;
import net.minecraft.server.MinecraftServer;
import net.minecraft.text.Text;
import net.minecraft.util.Formatting;
import net.minecraft.util.Hand;
import net.minecraft.util.TypedActionResult;
import net.minecraft.world.World;

import java.util.function.Consumer;

public class CosmicEnergyTokenItem extends Item {

    public CosmicEnergyTokenItem(Settings settings) {
        super(settings);
    }

    @Override
    public void appendTooltip(ItemStack stack, TooltipContext context, Consumer<Text> textConsumer, TooltipType type) {
        CosmicEnergyComponent energy = stack.get(ModComponents.COSMIC_ENERGY);
        if (energy != null && energy.stored() > 0) {
            textConsumer.accept(
                Text.translatable("item.cosmicprisons.cosmic_energy_token.value",
                    CosmicEnergyComponent.formatCE(energy.stored()))
                    .formatted(Formatting.GOLD)
            );
        } else {
            textConsumer.accept(Text.literal("Empty token").formatted(Formatting.GRAY));
        }
    }

    @Override
    public TypedActionResult<ItemStack> use(World world, PlayerEntity player, Hand hand) {
        ItemStack stack = player.getStackInHand(hand);
        if (world.isClient) return TypedActionResult.success(stack);

        CosmicEnergyComponent energy = stack.get(ModComponents.COSMIC_ENERGY);
        if (energy == null || energy.stored() <= 0) {
            player.sendMessage(Text.literal("This token is empty.").formatted(Formatting.RED), true);
            return TypedActionResult.fail(stack);
        }

        MinecraftServer server = world.getServer();
        if (server == null) return TypedActionResult.fail(stack);

        PlayerDataState state = PlayerDataState.getServerState(server);
        PlayerDataState.PlayerData data = state.getOrCreate(player.getUuid());
        data.cosmicEnergy += energy.stored();
        state.markDirty();

        player.sendMessage(
            Text.literal("Deposited " + CosmicEnergyComponent.formatCE(energy.stored()) + " CE to your account!")
                .formatted(Formatting.GOLD),
            false
        );

        stack.set(ModComponents.COSMIC_ENERGY, new CosmicEnergyComponent(0, energy.capacity()));
        return TypedActionResult.success(stack);
    }

    @Override
    public boolean hasGlint(ItemStack stack) {
        CosmicEnergyComponent energy = stack.get(ModComponents.COSMIC_ENERGY);
        return energy != null && energy.stored() > 0;
    }

    public static ItemStack createWithEnergy(long amount) {
        ItemStack stack = new ItemStack(dev.freelocs.cosmicprisons.registry.ModItems.COSMIC_ENERGY_TOKEN);
        stack.set(ModComponents.COSMIC_ENERGY, new CosmicEnergyComponent(amount, amount));
        return stack;
    }
}
