package dev.freelocs.cosmicprisons.component;

import com.mojang.serialization.Codec;
import com.mojang.serialization.codecs.RecordCodecBuilder;

import java.util.HashMap;
import java.util.Map;

public record SatchelDataComponent(Map<String, Long> storedOres, long maxOres) {

    public static final Codec<SatchelDataComponent> CODEC = RecordCodecBuilder.create(instance ->
        instance.group(
            Codec.unboundedMap(Codec.STRING, Codec.LONG).fieldOf("stored_ores").forGetter(SatchelDataComponent::storedOres),
            Codec.LONG.fieldOf("max_ores").forGetter(SatchelDataComponent::maxOres)
        ).apply(instance, SatchelDataComponent::new)
    );

    public static final long DEFAULT_CAPACITY = 10_000L;

    public SatchelDataComponent() {
        this(new HashMap<>(), DEFAULT_CAPACITY);
    }

    public long totalOres() {
        return storedOres.values().stream().mapToLong(Long::longValue).sum();
    }

    public boolean isFull() {
        return totalOres() >= maxOres;
    }

    public long spaceRemaining() {
        return Math.max(0, maxOres - totalOres());
    }

    public SatchelDataComponent addOre(String oreId, long amount) {
        long space = spaceRemaining();
        if (space <= 0) return this;
        long toAdd = Math.min(amount, space);
        Map<String, Long> newOres = new HashMap<>(storedOres);
        newOres.merge(oreId, toAdd, Long::sum);
        return new SatchelDataComponent(newOres, maxOres);
    }

    public SatchelDataComponent removeOre(String oreId, long amount) {
        Map<String, Long> newOres = new HashMap<>(storedOres);
        newOres.computeIfPresent(oreId, (k, v) -> v <= amount ? null : v - amount);
        return new SatchelDataComponent(newOres, maxOres);
    }

    public SatchelDataComponent clearOre(String oreId) {
        Map<String, Long> newOres = new HashMap<>(storedOres);
        newOres.remove(oreId);
        return new SatchelDataComponent(newOres, maxOres);
    }

    public long getOreCount(String oreId) {
        return storedOres.getOrDefault(oreId, 0L);
    }

    public double fillPercent() {
        if (maxOres == 0) return 1.0;
        return (double) totalOres() / (double) maxOres;
    }
}
