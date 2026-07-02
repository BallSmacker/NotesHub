export default function Logo({ size = 32 }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="relative grid place-items-center rounded-xl font-display font-black"
        style={{
          width: size,
          height: size,
          background: "var(--gradient-primary)",
          boxShadow: "var(--shadow-glow)",
        }}
      >
        <span
          style={{
            fontSize: size * 0.55,
            color: "var(--primary-foreground)",
          }}
        >
          N
        </span>

        <span
          className="absolute -right-1 -bottom-1 rounded-md px-1 font-black italic"
          style={{
            fontSize: size * 0.42,
            background: "var(--gradient-accent)",
            color: "var(--accent-foreground)",
          }}
        >
          h
        </span>
      </div>

      <div className="leading-tight">
        <div className="font-display text-lg font-extrabold tracking-tight">
          Notes<span className="text-gradient-primary">Hub</span>
        </div>
      </div>
    </div>
  );
}
