type Props = {
  checked: boolean;
  onChange: (v: boolean) => void;
  accent: string;
};

export function Toggle({ checked, onChange, accent }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
      style={{
        backgroundColor: checked ? accent : "rgba(255,255,255,0.1)",
      }}
    >
      <span
        className="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
        style={{ transform: checked ? "translateX(20px)" : "translateX(4px)" }}
      />
    </button>
  );
}