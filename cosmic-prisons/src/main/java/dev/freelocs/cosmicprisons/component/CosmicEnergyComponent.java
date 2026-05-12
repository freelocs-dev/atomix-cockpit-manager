package dev.freelocs.cosmicprisons.component;

import com.mojang.serialization.Codec;
import com.mojang.serialization.codecs.RecordCodecBuilder;

public record CosmicEnergyComponent(long stored, long capacity) {

    public static final Codec<CosmicEnergyComponent> CODEC = RecordCodecBuilder.create(instance ->
        instance.group(
            Codec.LONG.fieldOf("stored").forGetter(CosmicEnergyComponent::stored),
            Codec.LONG.fieldOf("capacity").forGetter(CosmicEnergyComponent::capacity)
        ).apply(instance, CosmicEnergyComponent::new)
    );

    public static final long DEFAULT_CAPACITY = 1_000_000L;

    public CosmicEnergyComponent() {
        this(0L, DEFAULT_CAPACITY);
    }

    public CosmicEnergyComponent withStored(long newStored) {
        return new CosmicEnergyComponent(Math.clamp(newStored, 0, capacity), capacity);
    }

    public CosmicEnergyComponent withCapacity(long newCapacity) {
        return new CosmicEnergyComponent(Math.min(stored, newCapacity), newCapacity);
    }

    public CosmicEnergyComponent addEnergy(long amount) {
        return withStored(stored + amount);
    }

    public CosmicEnergyComponent removeEnergy(long amount) {
        return withStored(stored - amount);
    }

    public boolean isFull() {
        return stored >= capacity;
    }

    public long available() {
        return capacity - stored;
    }

    public double fillPercent() {
        if (capacity == 0) return 1.0;
        return (double) stored / (double) capacity;
    }

    public String formattedStored() {
        return formatCE(stored);
    }

    public String formattedCapacity() {
        return formatCE(capacity);
    }

    public static String formatCE(long value) {
        if (value >= 1_000_000_000_000L) return String.format("%.2fT", value / 1_000_000_000_000.0);
        if (value >= 1_000_000_000L)     return String.format("%.2fB", value / 1_000_000_000.0);
        if (value >= 1_000_000L)         return String.format("%.2fM", value / 1_000_000.0);
        if (value >= 1_000L)             return String.format("%.2fK", value / 1_000.0);
        return String.valueOf(value);
    }
}
