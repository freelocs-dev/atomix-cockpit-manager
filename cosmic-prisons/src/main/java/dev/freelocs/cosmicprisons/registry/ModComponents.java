package dev.freelocs.cosmicprisons.registry;

import com.mojang.serialization.Codec;
import dev.freelocs.cosmicprisons.CosmicPrisonsCore;
import dev.freelocs.cosmicprisons.component.CosmicEnergyComponent;
import dev.freelocs.cosmicprisons.component.SatchelDataComponent;
import net.minecraft.component.DataComponentType;
import net.minecraft.registry.Registries;
import net.minecraft.registry.Registry;
import net.minecraft.util.Identifier;

public final class ModComponents {

    public static DataComponentType<CosmicEnergyComponent> COSMIC_ENERGY;
    public static DataComponentType<SatchelDataComponent> SATCHEL_DATA;

    public static void initialize() {
        COSMIC_ENERGY = Registry.register(
            Registries.DATA_COMPONENT_TYPE,
            Identifier.of(CosmicPrisonsCore.MOD_ID, "cosmic_energy"),
            DataComponentType.<CosmicEnergyComponent>builder()
                .codec(CosmicEnergyComponent.CODEC)
                .build()
        );

        SATCHEL_DATA = Registry.register(
            Registries.DATA_COMPONENT_TYPE,
            Identifier.of(CosmicPrisonsCore.MOD_ID, "satchel_data"),
            DataComponentType.<SatchelDataComponent>builder()
                .codec(SatchelDataComponent.CODEC)
                .build()
        );
    }

    private ModComponents() {}
}
