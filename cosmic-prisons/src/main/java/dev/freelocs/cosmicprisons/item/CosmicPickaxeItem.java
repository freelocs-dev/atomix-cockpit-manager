package dev.freelocs.cosmicprisons.item;

import dev.freelocs.cosmicprisons.component.CosmicEnergyComponent;
import dev.freelocs.cosmicprisons.registry.ModComponents;
import net.minecraft.block.BlockState;
import net.minecraft.entity.player.PlayerEntity;
import net.minecraft.item.ItemStack;
import net.minecraft.item.PickaxeItem;
import net.minecraft.item.ToolMaterial;
import net.minecraft.item.tooltip.TooltipType;
import net.minecraft.text.Text;
import net.minecraft.util.Formatting;
import net.minecraft.util.math.BlockPos;
import net.minecraft.world.World;

import java.util.function.Consumer;

public class CosmicPickaxeItem extends PickaxeItem {

    public CosmicPickaxeItem(ToolMaterial material, Settings settings) {
        super(material, settings);
    }

    @Override
    public void appendTooltip(ItemStack stack, TooltipContext context, Consumer<Text> textConsumer, TooltipType type) {
        super.appendTooltip(stack, context, textConsumer, type);

        CosmicEnergyComponent energy = stack.get(ModComponents.COSMIC_ENERGY);
        if (energy != null) {
            textConsumer.accept(
                Text.translatable("item.cosmicprisons.cosmic_pickaxe.energy",
                    energy.formattedStored(), energy.formattedCapacity())
                    .formatted(Formatting.AQUA)
            );
            textConsumer.accept(buildEnergyBar(energy).formatted(Formatting.DARK_AQUA));
        } else {
            textConsumer.accept(
                Text.translatable("item.cosmicprisons.cosmic_pickaxe.no_energy")
                    .formatted(Formatting.GRAY)
            );
        }
        textConsumer.accept(Text.translatable("item.cosmicprisons.cosmic_pickaxe.lore2").formatted(Formatting.DARK_GRAY));
    }

    @Override
    public boolean postMine(ItemStack stack, World world, BlockState state, BlockPos pos, PlayerEntity miner) {
        return super.postMine(stack, world, state, pos, miner);
    }

    @Override
    public boolean hasGlint(ItemStack stack) {
        CosmicEnergyComponent energy = stack.get(ModComponents.COSMIC_ENERGY);
        return (energy != null && energy.stored() > 0) || super.hasGlint(stack);
    }

    private static Text buildEnergyBar(CosmicEnergyComponent energy) {
        int barWidth = 20;
        int filled = (int) (energy.fillPercent() * barWidth);
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < barWidth; i++) {
            sb.append(i < filled ? "|" : " ");
        }
        sb.append("]");
        return Text.literal(sb.toString());
    }
}
