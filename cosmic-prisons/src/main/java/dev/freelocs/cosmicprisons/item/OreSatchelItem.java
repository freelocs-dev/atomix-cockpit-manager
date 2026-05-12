package dev.freelocs.cosmicprisons.item;

import dev.freelocs.cosmicprisons.component.SatchelDataComponent;
import dev.freelocs.cosmicprisons.registry.ModComponents;
import net.minecraft.entity.player.PlayerEntity;
import net.minecraft.item.Item;
import net.minecraft.item.ItemStack;
import net.minecraft.item.tooltip.TooltipType;
import net.minecraft.text.Text;
import net.minecraft.util.Formatting;
import net.minecraft.util.Hand;
import net.minecraft.util.TypedActionResult;
import net.minecraft.world.World;

import java.util.Map;
import java.util.function.Consumer;

public class OreSatchelItem extends Item {

    public enum Tier {
        IRON(10_000L, Formatting.WHITE),
        GOLD(25_000L, Formatting.GOLD),
        DIAMOND(100_000L, Formatting.AQUA),
        EMERALD(500_000L, Formatting.GREEN),
        COSMIC(5_000_000L, Formatting.LIGHT_PURPLE);

        public final long capacity;
        public final Formatting color;

        Tier(long capacity, Formatting color) {
            this.capacity = capacity;
            this.color = color;
        }
    }

    private final Tier tier;

    public OreSatchelItem(Tier tier, Settings settings) {
        super(settings);
        this.tier = tier;
    }

    public Tier getTier() {
        return tier;
    }

    @Override
    public void appendTooltip(ItemStack stack, TooltipContext context, Consumer<Text> textConsumer, TooltipType type) {
        SatchelDataComponent data = stack.get(ModComponents.SATCHEL_DATA);
        if (data == null) {
            textConsumer.accept(Text.translatable("item.cosmicprisons.ore_satchel.empty").formatted(Formatting.GRAY));
            return;
        }

        textConsumer.accept(
            Text.translatable("item.cosmicprisons.ore_satchel.stored",
                data.totalOres(), data.maxOres())
                .formatted(tier.color)
        );

        if (!data.storedOres().isEmpty()) {
            int shown = 0;
            for (Map.Entry<String, Long> entry : data.storedOres().entrySet()) {
                if (shown++ >= 5) {
                    textConsumer.accept(Text.literal("  ...").formatted(Formatting.DARK_GRAY));
                    break;
                }
                String label = entry.getKey().replace("minecraft:", "").replace("_", " ");
                label = Character.toUpperCase(label.charAt(0)) + label.substring(1);
                textConsumer.accept(
                    Text.literal("  " + label + ": " + entry.getValue()).formatted(Formatting.GRAY)
                );
            }
        }
    }

    @Override
    public TypedActionResult<ItemStack> use(World world, PlayerEntity player, Hand hand) {
        ItemStack stack = player.getStackInHand(hand);
        if (world.isClient) return TypedActionResult.success(stack);

        SatchelDataComponent data = stack.get(ModComponents.SATCHEL_DATA);
        if (data == null || data.storedOres().isEmpty()) {
            player.sendMessage(Text.literal("Satchel is empty.").formatted(Formatting.GRAY), true);
            return TypedActionResult.success(stack);
        }

        // Drop all stored ores as items into the player's inventory
        for (Map.Entry<String, Long> entry : data.storedOres().entrySet()) {
            net.minecraft.registry.Registries.ITEM.getOrEmpty(net.minecraft.util.Identifier.tryParse(entry.getKey()))
                .ifPresent(item -> {
                    long count = entry.getValue();
                    while (count > 0) {
                        int batchSize = (int) Math.min(count, item.getMaxCount());
                        ItemStack drop = new ItemStack(item, batchSize);
                        if (!player.getInventory().insertStack(drop)) {
                            player.dropItem(drop, false);
                        }
                        count -= batchSize;
                    }
                });
        }

        stack.set(ModComponents.SATCHEL_DATA, new SatchelDataComponent(
            new java.util.HashMap<>(), data.maxOres()
        ));
        player.sendMessage(Text.literal("Emptied satchel into inventory.").formatted(tier.color), true);
        return TypedActionResult.success(stack);
    }

    @Override
    public boolean hasGlint(ItemStack stack) {
        SatchelDataComponent data = stack.get(ModComponents.SATCHEL_DATA);
        return data != null && data.totalOres() > 0;
    }

    public static SatchelDataComponent initForTier(Tier tier) {
        return new SatchelDataComponent(new java.util.HashMap<>(), tier.capacity);
    }
}
