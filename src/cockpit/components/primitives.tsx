import { motion } from "framer-motion";
import { type ReactNode, type ButtonHTMLAttributes, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const cockpitColors = {
  bg: "#05080F",
  surface: "#0A0F1E",
  card: "#0D1526",
  elevated: "#111D35",
  sidebar: "#08101F",
  input: "#060D1A",
  border: "rgba(99, 179, 237, 0.08)",
  borderStrong: "rgba(59, 130, 246, 0.3)",
  accent: "#3B82F6",
  accentHover: "#2563EB",
  accentSoft: "#60A5FA",
  glow: "rgba(59, 130, 246, 0.15)",
  text: "#F0F4FF",
  muted: "#64748B",
};

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
  size?: "sm" | "md";
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: BtnProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none";
  const sizes = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  let variantCls = "";
  if (variant === "primary") {
    variantCls =
      "bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-[0_0_0_0_rgba(59,130,246,0)] hover:shadow-[0_0_18px_rgba(59,130,246,0.45)]";
  } else if (variant === "ghost") {
    variantCls =
      "border border-[rgba(59,130,246,0.3)] text-[#F0F4FF] hover:bg-[rgba(59,130,246,0.08)]";
  } else {
    variantCls =
      "border border-red-500/30 text-red-300 hover:bg-red-500/10";
  }
  return (
    <button className={cn(base, sizes, variantCls, className)} {...rest}>
      {children}
    </button>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-lg bg-[#060D1A] border border-[rgba(59,130,246,0.2)] px-3 py-2 text-sm text-[#F0F4FF] placeholder:text-[#64748B] focus:outline-none focus:border-[#3B82F6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] transition-all",
          className,
        )}
        {...rest}
      />
    );
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-lg bg-[#060D1A] border border-[rgba(59,130,246,0.2)] px-3 py-2 text-sm text-[#F0F4FF] placeholder:text-[#64748B] focus:outline-none focus:border-[#3B82F6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] transition-all resize-none",
          className,
        )}
        {...rest}
      />
    );
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...rest }, ref) {
    return (
      <select
        ref={ref}
        className={cn(
          "w-full rounded-lg bg-[#060D1A] border border-[rgba(59,130,246,0.2)] px-3 py-2 text-sm text-[#F0F4FF] focus:outline-none focus:border-[#3B82F6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] transition-all",
          className,
        )}
        {...rest}
      >
        {children}
      </select>
    );
  },
);

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 group"
    >
      <span
        className={cn(
          "relative inline-flex h-5 w-9 rounded-full transition-colors",
          checked ? "bg-[#3B82F6]" : "bg-[#1E2D45]",
        )}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow",
            checked ? "left-[18px]" : "left-0.5",
          )}
        />
      </span>
      {label && <span className="text-sm text-[#F0F4FF]">{label}</span>}
    </button>
  );
}

export function Pill({ children, color = "blue" }: { children: ReactNode; color?: "blue" | "green" | "gray" }) {
  const styles = {
    blue: "bg-[rgba(59,130,246,0.1)] text-[#60A5FA]",
    green: "bg-emerald-500/10 text-emerald-400",
    gray: "bg-white/5 text-[#64748B]",
  } as const;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", styles[color])}>
      {children}
    </span>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-[11px] uppercase tracking-widest font-semibold text-[#64748B] mb-3">
      {children}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-[#0D1526]",
        className,
      )}
      style={{ borderColor: cockpitColors.border }}
    >
      {children}
    </div>
  );
}

export function Divider() {
  return <div className="h-px w-full bg-white/[0.05]" />;
}

export function StatusDot({ on, color = "#3B82F6" }: { on: boolean; color?: string }) {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full"
      style={{
        backgroundColor: on ? color : "#475569",
        boxShadow: on ? `0 0 8px ${color}` : "none",
      }}
    />
  );
}