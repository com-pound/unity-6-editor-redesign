import { useState } from "react";
import { Monitor, Smartphone, Globe, Gamepad2, Apple, Box, ChevronRight, Plus, Settings, Play, Package } from "lucide-react";
import { TopMenuBar } from "../TopMenuBar";
import { BottomStatusBar } from "../BottomStatusBar";

const platforms = [
  { id: "pc", name: "PC, Mac & Linux", sub: "Standalone", icon: <Monitor size={16} />, color: "#60a5fa", active: true },
  { id: "ios", name: "iOS", sub: "Apple Mobile", icon: <Apple size={16} />, color: "#a78bfa" },
  { id: "android", name: "Android", sub: "Google", icon: <Smartphone size={16} />, color: "#4ade80" },
  { id: "webgl", name: "WebGL", sub: "Browser", icon: <Globe size={16} />, color: "#fbbf24" },
  { id: "xbox", name: "Xbox", sub: "Microsoft GDK", icon: <Gamepad2 size={16} />, color: "#34d399" },
  { id: "ps5", name: "PlayStation 5", sub: "Sony", icon: <Gamepad2 size={16} />, color: "#f87171" },
  { id: "uwp", name: "Universal Windows", sub: "UWP", icon: <Box size={16} />, color: "#60a5fa" },
];

interface ToggleRowProps {
  label: string;
  checked?: boolean;
  description?: string;
}

function ToggleRow({ label, checked = false, description }: ToggleRowProps) {
  const [on, setOn] = useState(checked);
  return (
    <div className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--unity-border)" }}>
      <div>
        <div style={{ fontSize: "11px", color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}>{label}</div>
        {description && <div style={{ fontSize: "9px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)", marginTop: "1px" }}>{description}</div>}
      </div>
      <button
        onClick={() => setOn(!on)}
        className="w-8 h-4 rounded-full flex items-center transition-all shrink-0"
        style={{ background: on ? "var(--unity-accent)" : "var(--unity-bg-elevated)", padding: "2px", border: `1px solid ${on ? "var(--unity-accent)" : "var(--unity-border)"}` }}
      >
        <div className="w-3 h-3 rounded-full transition-all" style={{ background: on ? "#0a0a0c" : "var(--unity-text-secondary)", transform: on ? "translateX(16px)" : "translateX(0)" }} />
      </button>
    </div>
  );
}

export function BuildSettingsScreen() {
  const [active, setActive] = useState("pc");

  return (
    <div className="flex flex-col w-full h-full" style={{ background: "var(--unity-bg-base)" }}>
      <TopMenuBar />
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: platform list */}
        <div className="flex flex-col w-56 shrink-0" style={{ background: "var(--unity-bg-panel)", borderRight: "1px solid var(--unity-border)" }}>
          <div className="flex items-center justify-between px-3 h-10 shrink-0" style={{ borderBottom: "1px solid var(--unity-border)", background: "var(--unity-bg-surface)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--unity-text-primary)", fontFamily: "var(--font-family)", letterSpacing: "0.04em", textTransform: "uppercase" }}>Build Settings</span>
          </div>
          <div className="flex-1 overflow-y-auto py-1.5" style={{ scrollbarWidth: "none" }}>
            <div className="px-3 mb-1" style={{ fontSize: "9px", fontWeight: 700, color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Platform</div>
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setActive(p.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 transition-all"
                style={{
                  background: active === p.id ? "rgba(79,195,247,0.1)" : "transparent",
                  borderLeft: active === p.id ? "2px solid var(--unity-accent)" : "2px solid transparent",
                }}
              >
                <div className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0" style={{ background: "var(--unity-bg-elevated)", color: p.color }}>
                  {p.icon}
                </div>
                <div className="text-left">
                  <div style={{ fontSize: "11px", color: active === p.id ? "var(--unity-accent)" : "var(--unity-text-primary)", fontFamily: "var(--font-family)", fontWeight: active === p.id ? 600 : 400 }}>{p.name}</div>
                  <div style={{ fontSize: "9px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)" }}>{p.sub}</div>
                </div>
                {p.active && <div className="ml-auto w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--unity-accent)" }} />}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: "none" }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 style={{ fontSize: "18px", fontWeight: 700, color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}>PC, Mac & Linux Standalone</h1>
                <p style={{ fontSize: "11px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)", marginTop: "2px" }}>Active platform · Unity 6.5.0f1</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 rounded-[10px] transition-all" style={{ background: "var(--unity-bg-surface)", border: "1px solid var(--unity-border)", color: "var(--unity-text-primary)", fontSize: "12px", fontFamily: "var(--font-family)" }}>
                  <Settings size={13} />
                  Player Settings
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-[10px] transition-all" style={{ background: "var(--unity-bg-surface)", border: "1px solid var(--unity-border)", color: "var(--unity-text-primary)", fontSize: "12px", fontFamily: "var(--font-family)" }}>
                  <Package size={13} />
                  Build
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-[10px] transition-all" style={{ background: "var(--unity-accent)", color: "#0a0a0c", fontSize: "12px", fontFamily: "var(--font-family)", fontWeight: 600 }}>
                  <Play size={13} fill="#0a0a0c" />
                  Build & Run
                </button>
              </div>
            </div>

            {/* Scenes in Build */}
            <div className="rounded-[10px] overflow-hidden mb-4" style={{ background: "var(--unity-bg-panel)", border: "1px solid var(--unity-border)" }}>
              <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: "1px solid var(--unity-border)", background: "var(--unity-bg-surface)" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}>Scenes In Build</span>
                <button className="flex items-center gap-1 px-2 py-1 rounded-md" style={{ background: "var(--unity-bg-elevated)", color: "var(--unity-accent)", fontSize: "10px", fontFamily: "var(--font-family)" }}>
                  <Plus size={10} /> Add Open Scenes
                </button>
              </div>
              <div>
                {["Scenes/SampleScene", "Scenes/MainMenu", "Scenes/GameOver"].map((s, i) => (
                  <div key={s} className="flex items-center gap-3 px-4 py-2" style={{ borderBottom: i < 2 ? "1px solid var(--unity-border)" : "none" }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: "var(--unity-accent)", width: 12, height: 12 }} />
                    <span style={{ flex: 1, fontSize: "11px", color: "var(--unity-text-primary)", fontFamily: "var(--font-mono)" }}>{s}</span>
                    <span style={{ fontSize: "10px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-mono)" }}>Scene {i}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Build Options */}
            <div className="rounded-[10px] overflow-hidden mb-4" style={{ background: "var(--unity-bg-panel)", border: "1px solid var(--unity-border)" }}>
              <div className="px-4 py-2.5" style={{ borderBottom: "1px solid var(--unity-border)", background: "var(--unity-bg-surface)" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}>Build Options</span>
              </div>
              <div className="px-4">
                <ToggleRow label="Development Build" description="Includes debug symbols and profiler" checked={true} />
                <ToggleRow label="Autoconnect Profiler" />
                <ToggleRow label="Deep Profiling Support" />
                <ToggleRow label="Script Debugging" checked={true} />
                <ToggleRow label="Wait For Managed Debugger" />
                <ToggleRow label="Compression Method" />
              </div>
            </div>

            {/* Target Architecture */}
            <div className="rounded-[10px] overflow-hidden" style={{ background: "var(--unity-bg-panel)", border: "1px solid var(--unity-border)" }}>
              <div className="px-4 py-2.5" style={{ borderBottom: "1px solid var(--unity-border)", background: "var(--unity-bg-surface)" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}>Target Architecture</span>
              </div>
              <div className="px-4 py-3 flex flex-col gap-2">
                {["x86 (32-bit)", "x86_64 (64-bit)", "ARM64"].map((a, i) => (
                  <label key={a} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked={i === 1} style={{ accentColor: "var(--unity-accent)", width: 12, height: 12 }} />
                    <span style={{ fontSize: "11px", color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}>{a}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomStatusBar />
    </div>
  );
}
