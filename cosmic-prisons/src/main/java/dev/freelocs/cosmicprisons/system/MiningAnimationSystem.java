package dev.freelocs.cosmicprisons.system;

import net.minecraft.particle.ParticleTypes;
import net.minecraft.server.network.ServerPlayerEntity;
import net.minecraft.server.world.ServerWorld;
import net.minecraft.sound.SoundCategory;
import net.minecraft.sound.SoundEvents;
import net.minecraft.util.math.BlockPos;

public final class MiningAnimationSystem {

    /**
     * Plays the standard mining animation: particles + sound at the mined block position.
     */
    public static void playMineEffect(ServerPlayerEntity player, BlockPos pos) {
        ServerWorld world = player.getServerWorld();
        double cx = pos.getX() + 0.5;
        double cy = pos.getY() + 0.5;
        double cz = pos.getZ() + 0.5;

        world.spawnParticles(ParticleTypes.CRIT, cx, cy, cz, 8, 0.3, 0.3, 0.3, 0.15);
        world.spawnParticles(ParticleTypes.ENCHANTED_HIT, cx, cy, cz, 4, 0.3, 0.3, 0.3, 0.1);

        world.playSound(null, pos,
            SoundEvents.ENTITY_EXPERIENCE_ORB_PICKUP,
            SoundCategory.PLAYERS, 0.3f, 1.2f + (float) (Math.random() * 0.4));
    }

    /**
     * Plays a large explosion-style effect for Explosive Mining.
     */
    public static void playExplosiveEffect(ServerPlayerEntity player, BlockPos center, int radius) {
        ServerWorld world = player.getServerWorld();
        double cx = center.getX() + 0.5;
        double cy = center.getY() + 0.5;
        double cz = center.getZ() + 0.5;

        world.spawnParticles(ParticleTypes.EXPLOSION, cx, cy, cz, 1 + radius, radius * 0.5, radius * 0.5, radius * 0.5, 0.05);
        world.spawnParticles(ParticleTypes.CRIT, cx, cy, cz, 12 + radius * 4, radius * 0.4, radius * 0.4, radius * 0.4, 0.2);

        world.playSound(null, center,
            SoundEvents.ENTITY_GENERIC_EXPLODE,
            SoundCategory.BLOCKS, 0.4f, 1.0f + (float) (Math.random() * 0.2 - 0.1));
    }

    /**
     * Plays Lucky Strike effect: golden sparkles.
     */
    public static void playLuckyEffect(ServerPlayerEntity player, BlockPos pos) {
        ServerWorld world = player.getServerWorld();
        double cx = pos.getX() + 0.5;
        double cy = pos.getY() + 1.0;
        double cz = pos.getZ() + 0.5;

        world.spawnParticles(ParticleTypes.HAPPY_VILLAGER, cx, cy, cz, 10, 0.4, 0.4, 0.4, 0.0);
        world.spawnParticles(ParticleTypes.TOTEM_OF_UNDYING, cx, cy, cz, 5, 0.2, 0.4, 0.2, 0.05);

        world.playSound(null, pos,
            SoundEvents.ENTITY_PLAYER_LEVELUP,
            SoundCategory.PLAYERS, 0.4f, 1.8f);
    }

    /**
     * Plays Wormhole (auto-smelt) effect: flame swirl.
     */
    public static void playWormholeEffect(ServerPlayerEntity player, BlockPos pos) {
        ServerWorld world = player.getServerWorld();
        double cx = pos.getX() + 0.5;
        double cy = pos.getY() + 0.5;
        double cz = pos.getZ() + 0.5;

        world.spawnParticles(ParticleTypes.FLAME, cx, cy, cz, 12, 0.3, 0.3, 0.3, 0.08);
        world.spawnParticles(ParticleTypes.LAVA, cx, cy, cz, 3, 0.2, 0.2, 0.2, 0.0);

        world.playSound(null, pos,
            SoundEvents.BLOCK_PORTAL_TRIGGER,
            SoundCategory.BLOCKS, 0.2f, 1.5f);
    }

    private MiningAnimationSystem() {}
}
