import { GitBranch, Wifi, Cpu, HardDrive, Bell } from "lucide-react";

interface BottomStatusBarProps {
  errorCount?: number;
  warningCount?: number;
  infoCount?: number;
}

export function BottomStatusBar({ errorCount = 0, warningCount = 0, infoCount = 0 }: BottomStatusBarProps) {
  return (
    <div
      className="flex items-center gap-3 px-3 h-5 shrink-0"
      style={{
        background: "var(--unity-bg-surface)",
        borderTop: "1px solid var(--unity-border)",
        fontSize: "9px",
        fontFamily: "var(--font-mono)",
        color: "var(--unity-text-secondary)",
      }}
    >
      <div className="flex items-center gap-1">
        <GitBranch size={9} />
        <span>main</span>
      </div>
      <div style={{ width: "1px", height: "10px", background: "var(--unity-border)" }} />
      <div className="flex items-center gap-1">
        <span style={{ color: "#f87171" }}>✕ {errorCount}</span>
        <span style={{ marginLeft: "6px", color: "#fbbf24" }}>⚠ {warningCount}</span>
        <span style={{ marginLeft: "6px", color: "var(--unity-text-secondary)" }}>ℹ {infoCount}</span>
      </div>
      <div style={{ width: "1px", height: "10px", background: "var(--unity-border)" }} />
      <span>Unity 6.5.0f1</span>
      <div className="flex-1" />
      <div className="flex items-center gap-1">
        <Cpu size={9} />
        <span>CPU 24%</span>
      </div>
      <div style={{ width: "1px", height: "10px", background: "var(--unity-border)" }} />
      <div className="flex items-center gap-1">
        <HardDrive size={9} />
        <span>VRAM 1.2 GB</span>
      </div>
      <div style={{ width: "1px", height: "10px", background: "var(--unity-border)" }} />
      <div className="flex items-center gap-1">
        <Wifi size={9} />
        <span style={{ color: "#34d399" }}>Connected</span>
      </div>
      <div style={{ width: "1px", height: "10px", background: "var(--unity-border)" }} />
      <button className="flex items-center gap-1" style={{ color: "var(--unity-text-secondary)" }}>
        <Bell size={9} />
      </button>
    </div>
  );
}
