package dev.freelocs.cosmicprisons.network;

import dev.freelocs.cosmicprisons.CosmicPrisonsCore;
import net.fabricmc.fabric.api.networking.v1.PayloadTypeRegistry;
import net.fabricmc.fabric.api.networking.v1.ServerPlayNetworking;
import net.minecraft.network.PacketByteBuf;
import net.minecraft.network.codec.PacketCodec;
import net.minecraft.network.codec.PacketCodecs;
import net.minecraft.network.packet.CustomPayload;
import net.minecraft.util.Identifier;
import net.minecraft.util.math.BlockPos;

/**
 * Server → Client packet that tells the client to play a custom mining
 * particle/sound effect. Requires a matching client-side handler when
 * deploying as a client+server mod; falls back to server-side effects
 * when running server-only.
 */
public record MiningAnimationPacket(BlockPos pos, int animationType) implements CustomPayload {

    public static final int TYPE_NORMAL    = 0;
    public static final int TYPE_EXPLOSIVE = 1;
    public static final int TYPE_LUCKY     = 2;
    public static final int TYPE_WORMHOLE  = 3;

    public static final CustomPayload.Id<MiningAnimationPacket> ID =
        new CustomPayload.Id<>(Identifier.of(CosmicPrisonsCore.MOD_ID, "mining_animation"));

    public static final PacketCodec<PacketByteBuf, MiningAnimationPacket> CODEC =
        PacketCodec.tuple(
            BlockPos.PACKET_CODEC,           MiningAnimationPacket::pos,
            PacketCodecs.INTEGER,            MiningAnimationPacket::animationType,
            MiningAnimationPacket::new
        );

    @Override
    public CustomPayload.Id<MiningAnimationPacket> getId() {
        return ID;
    }

    public static void register() {
        PayloadTypeRegistry.playS2C().register(ID, CODEC);
    }

    public static void send(net.minecraft.server.network.ServerPlayerEntity player, BlockPos pos, int type) {
        ServerPlayNetworking.send(player, new MiningAnimationPacket(pos, type));
    }
}
