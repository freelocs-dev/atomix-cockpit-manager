package dev.freelocs.cosmicprisons.system;

import net.minecraft.datafixer.DataFixTypes;
import net.minecraft.nbt.NbtCompound;
import net.minecraft.nbt.NbtElement;
import net.minecraft.nbt.NbtList;
import net.minecraft.registry.RegistryWrapper;
import net.minecraft.server.MinecraftServer;
import net.minecraft.world.PersistentState;
import net.minecraft.world.PersistentStateManager;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class PlayerDataState extends PersistentState {

    private static final String STATE_KEY = "cosmicprisons_player_data";

    public static class PlayerData {
        public long cosmicEnergy = 0;
        public int rank = 0;
        public int prestige = 0;
        public long totalBlocksMined = 0;
        public int pickaxeLevel = 1;

        public static PlayerData fromNbt(NbtCompound nbt) {
            PlayerData d = new PlayerData();
            d.cosmicEnergy     = nbt.getLong("cosmicEnergy");
            d.rank             = nbt.getInt("rank");
            d.prestige         = nbt.getInt("prestige");
            d.totalBlocksMined = nbt.getLong("totalBlocksMined");
            d.pickaxeLevel     = nbt.getInt("pickaxeLevel");
            if (d.pickaxeLevel < 1) d.pickaxeLevel = 1;
            return d;
        }

        public NbtCompound toNbt() {
            NbtCompound nbt = new NbtCompound();
            nbt.putLong("cosmicEnergy", cosmicEnergy);
            nbt.putInt("rank", rank);
            nbt.putInt("prestige", prestige);
            nbt.putLong("totalBlocksMined", totalBlocksMined);
            nbt.putInt("pickaxeLevel", pickaxeLevel);
            return nbt;
        }

        public String rankName() {
            return CosmicRank.fromOrdinal(rank).displayName;
        }

        public long ceForNextRank() {
            return CosmicRank.fromOrdinal(rank).ceRequired;
        }
    }

    public enum CosmicRank {
        FREE      ("Free",      0L),
        WOOD      ("Wood",      10_000L),
        STONE     ("Stone",     50_000L),
        IRON      ("Iron",      200_000L),
        GOLD      ("Gold",      750_000L),
        DIAMOND   ("Diamond",   2_500_000L),
        EMERALD   ("Emerald",   10_000_000L),
        OBSIDIAN  ("Obsidian",  40_000_000L),
        COSMIC    ("Cosmic",    150_000_000L),
        LEGEND    ("Legend",    500_000_000L),
        PRESTIGE  ("Prestige",  Long.MAX_VALUE);

        public final String displayName;
        public final long ceRequired;

        CosmicRank(String displayName, long ceRequired) {
            this.displayName = displayName;
            this.ceRequired  = ceRequired;
        }

        public static CosmicRank fromOrdinal(int ordinal) {
            CosmicRank[] values = values();
            if (ordinal < 0) return FREE;
            if (ordinal >= values.length) return PRESTIGE;
            return values[ordinal];
        }

        public CosmicRank next() {
            CosmicRank[] values = values();
            int next = this.ordinal() + 1;
            return next < values.length ? values[next] : PRESTIGE;
        }
    }

    private final Map<UUID, PlayerData> players = new HashMap<>();

    public PlayerData getOrCreate(UUID uuid) {
        return players.computeIfAbsent(uuid, k -> new PlayerData());
    }

    public boolean hasData(UUID uuid) {
        return players.containsKey(uuid);
    }

    @Override
    public NbtCompound writeNbt(NbtCompound nbt, RegistryWrapper.WrapperLookup registries) {
        NbtList list = new NbtList();
        players.forEach((uuid, data) -> {
            NbtCompound entry = data.toNbt();
            entry.putUuid("uuid", uuid);
            list.add(entry);
        });
        nbt.put("players", list);
        return nbt;
    }

    private static PlayerDataState fromNbt(NbtCompound nbt, RegistryWrapper.WrapperLookup registries) {
        PlayerDataState state = new PlayerDataState();
        NbtList list = nbt.getList("players", NbtElement.COMPOUND_TYPE);
        for (int i = 0; i < list.size(); i++) {
            NbtCompound entry = list.getCompound(i);
            UUID uuid = entry.getUuid("uuid");
            state.players.put(uuid, PlayerData.fromNbt(entry));
        }
        return state;
    }

    public static PlayerDataState getServerState(MinecraftServer server) {
        PersistentStateManager manager = server.getOverworld().getPersistentStateManager();
        return manager.getOrCreate(
            new PersistentState.Type<>(
                PlayerDataState::new,
                PlayerDataState::fromNbt,
                DataFixTypes.LEVEL
            ),
            STATE_KEY
        );
    }
}
