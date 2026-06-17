interface ScreenSwitcherProps {
  current: number;
  onChange: (n: number) => void;
}

const screens = [
  "Main Editor",
  "Scene View",
  "Inspector",
  "Hierarchy",
  "Project",
  "Console",
  "Build",
  "Packages",
  "Light Theme",
  "OLED Dark",
];

export function ScreenSwitcher({ current, onChange }: ScreenSwitcherProps) {
  return (
    <div
      className="fixed bottom-5 left-1/2 z-[200] flex items-center gap-1 px-2 py-1.5 rounded-full shadow-2xl"
      style={{
        transform: "translateX(-50%)",
        background: "rgba(20,20,22,0.92)",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
      }}
    >
      {screens.map((label, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          title={label}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all"
          style={{
            background: current === i ? "var(--unity-accent)" : "transparent",
            color: current === i ? "#0a0a0c" : "rgba(255,255,255,0.45)",
            fontSize: "10px",
            fontFamily: "var(--font-family)",
            fontWeight: current === i ? 700 : 400,
            minWidth: current === i ? undefined : undefined,
          }}
        >
          <span style={{
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            background: current === i ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "8px",
            fontWeight: 700,
            flexShrink: 0,
            fontFamily: "var(--font-mono)",
          }}>
            {i + 1}
          </span>
          {current === i && <span>{label}</span>}
        </button>
      ))}
    </div>
  );
}
