package dev.freelocs.cosmicprisons;

import dev.freelocs.cosmicprisons.command.AdminGiveCommand;
import dev.freelocs.cosmicprisons.command.CosmicEnchantCommand;
import dev.freelocs.cosmicprisons.command.ExtractCommand;
import dev.freelocs.cosmicprisons.event.MiningEventHandler;
import dev.freelocs.cosmicprisons.network.MiningAnimationPacket;
import dev.freelocs.cosmicprisons.registry.ModComponents;
import dev.freelocs.cosmicprisons.registry.ModItems;
import net.fabricmc.api.ModInitializer;
import net.fabricmc.fabric.api.command.v2.CommandRegistrationCallback;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CosmicPrisonsCore implements ModInitializer {

    public static final String MOD_ID = "cosmicprisons";
    public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);

    @Override
    public void onInitialize() {
        LOGGER.info("Initializing CosmicPrisons Core for Minecraft 1.21.11 (Fabric)");

        ModComponents.initialize();
        ModItems.initialize();
        MiningAnimationPacket.register();
        MiningEventHandler.register();

        CommandRegistrationCallback.EVENT.register((dispatcher, registryAccess, environment) -> {
            AdminGiveCommand.register(dispatcher);
            ExtractCommand.register(dispatcher);
            CosmicEnchantCommand.register(dispatcher, registryAccess);
        });

        LOGGER.info("CosmicPrisons Core ready.");
    }
}
