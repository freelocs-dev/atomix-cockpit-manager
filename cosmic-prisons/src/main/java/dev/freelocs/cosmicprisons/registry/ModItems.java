package dev.freelocs.cosmicprisons.registry;

import dev.freelocs.cosmicprisons.CosmicPrisonsCore;
import dev.freelocs.cosmicprisons.item.CosmicEnergyTokenItem;
import dev.freelocs.cosmicprisons.item.CosmicPickaxeItem;
import dev.freelocs.cosmicprisons.item.OreSatchelItem;
import net.fabricmc.fabric.api.itemgroup.v1.FabricItemGroup;
import net.fabricmc.fabric.api.itemgroup.v1.ItemGroupEvents;
import net.minecraft.item.Item;
import net.minecraft.item.ItemGroup;
import net.minecraft.item.ItemStack;
import net.minecraft.item.ToolMaterial;
import net.minecraft.registry.Registries;
import net.minecraft.registry.Registry;
import net.minecraft.registry.RegistryKey;
import net.minecraft.text.Text;
import net.minecraft.util.Identifier;

public final class ModItems {

    public static Item COSMIC_PICKAXE;
    public static Item ORE_SATCHEL;
    public static Item DIAMOND_SATCHEL;
    public static Item COSMIC_ENERGY_TOKEN;

    public static final RegistryKey<ItemGroup> GROUP_KEY = RegistryKey.of(
        Registries.ITEM_GROUP.getKey(),
        Identifier.of(CosmicPrisonsCore.MOD_ID, "cosmic_prisons")
    );

    public static void initialize() {
        COSMIC_PICKAXE = register("cosmic_pickaxe",
            new CosmicPickaxeItem(ToolMaterial.DIAMOND,
                new Item.Settings()
                    .maxCount(1)
                    .registryKey(itemKey("cosmic_pickaxe"))
            )
        );

        ORE_SATCHEL = register("ore_satchel",
            new OreSatchelItem(OreSatchelItem.Tier.IRON,
                new Item.Settings()
                    .maxCount(1)
                    .registryKey(itemKey("ore_satchel"))
            )
        );

        DIAMOND_SATCHEL = register("diamond_satchel",
            new OreSatchelItem(OreSatchelItem.Tier.DIAMOND,
                new Item.Settings()
                    .maxCount(1)
                    .registryKey(itemKey("diamond_satchel"))
            )
        );

        COSMIC_ENERGY_TOKEN = register("cosmic_energy_token",
            new CosmicEnergyTokenItem(
                new Item.Settings()
                    .maxCount(1)
                    .registryKey(itemKey("cosmic_energy_token"))
            )
        );

        ItemGroup group = FabricItemGroup.builder()
            .icon(() -> new ItemStack(COSMIC_PICKAXE))
            .displayName(Text.translatable("itemGroup.cosmicprisons.cosmic_prisons"))
            .build();

        Registry.register(Registries.ITEM_GROUP, GROUP_KEY, group);

        ItemGroupEvents.modifyEntriesEvent(GROUP_KEY).register(entries -> {
            entries.add(COSMIC_PICKAXE);
            entries.add(ORE_SATCHEL);
            entries.add(DIAMOND_SATCHEL);
            entries.add(COSMIC_ENERGY_TOKEN);
        });
    }

    private static Item register(String name, Item item) {
        return Registry.register(Registries.ITEM, Identifier.of(CosmicPrisonsCore.MOD_ID, name), item);
    }

    private static RegistryKey<Item> itemKey(String name) {
        return RegistryKey.of(Registries.ITEM.getKey(), Identifier.of(CosmicPrisonsCore.MOD_ID, name));
    }

    private ModItems() {}
}
