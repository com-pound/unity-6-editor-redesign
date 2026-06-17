import { useState } from "react";
import {
  ChevronDown, ChevronRight, MoreHorizontal, Mountain,
  Layers, Box, Settings, Plus, Minus, RefreshCw
} from "lucide-react";

interface ComponentCardProps {
  icon: React.ReactNode;
  title: string;
  enabled?: boolean;
  accent?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function ComponentCard({ icon, title, enabled = true, accent = "var(--unity-accent)", children, defaultOpen = true }: ComponentCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [isEnabled, setIsEnabled] = useState(enabled);

  return (
    <div
      className="rounded-[10px] overflow-hidden mb-2"
      style={{
        background: "var(--unity-bg-surface)",
        border: "1px solid var(--unity-border)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
      }}
    >
      {/* Card Header */}
      <div
        className="flex items-center gap-2 px-3 h-9 cursor-pointer transition-all"
        style={{
          background: open ? "var(--unity-bg-surface)" : "var(--unity-bg-surface)",
          borderBottom: open ? "1px solid var(--unity-border)" : "none",
        }}
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center justify-center w-5 h-5 rounded-md" style={{ background: "rgba(79,195,247,0.1)" }}>
          <span style={{ color: accent }}>{icon}</span>
        </div>
        <span style={{ flex: 1, fontSize: "12px", fontWeight: 600, color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}>
          {title}
        </span>
        {/* Enable toggle */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsEnabled(!isEnabled); }}
          className="w-7 h-4 rounded-full flex items-center transition-all shrink-0"
          style={{
            background: isEnabled ? "var(--unity-accent)" : "var(--unity-bg-elevated)",
            padding: "2px",
            position: "relative",
          }}
        >
          <div
            className="w-3 h-3 rounded-full transition-all"
            style={{
              background: isEnabled ? "#0a0a0c" : "var(--unity-text-secondary)",
              transform: isEnabled ? "translateX(12px)" : "translateX(0)",
            }}
          />
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className="w-6 h-6 flex items-center justify-center rounded-md transition-all"
          style={{ color: "var(--unity-text-secondary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--unity-bg-elevated)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <MoreHorizontal size={13} />
        </button>
        <span style={{ color: "var(--unity-text-secondary)", transition: "transform 0.15s" }}>
          {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </span>
      </div>

      {/* Card Body */}
      {open && isEnabled && (
        <div className="px-3 py-2.5">
          {children}
        </div>
      )}
    </div>
  );
}

interface PropRowProps {
  label: string;
  type?: "text" | "vector3" | "slider" | "dropdown" | "color" | "object";
  value?: string;
  min?: number;
  max?: number;
  colorVal?: string;
  accent?: string;
}

function PropRow({ label, type = "text", value = "—", min = 0, max = 100, colorVal = "#4FC3F7", accent }: PropRowProps) {
  const [sliderVal, setSliderVal] = useState(50);

  return (
    <div className="flex items-center gap-2 mb-1.5 group">
      <span
        className="shrink-0"
        style={{ fontSize: "11px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)", width: "88px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
      >
        {label}
      </span>

      {type === "vector3" && (
        <div className="flex gap-1 flex-1">
          {[{ l: "X", c: "#f87171" }, { l: "Y", c: "#4ade80" }, { l: "Z", c: "#60a5fa" }].map((ax) => (
            <div key={ax.l} className="flex items-center gap-0.5 flex-1">
              <span style={{ fontSize: "10px", fontWeight: 700, color: ax.c, fontFamily: "var(--font-mono)", width: "8px" }}>{ax.l}</span>
              <input
                defaultValue={ax.l === "X" ? "0" : ax.l === "Y" ? "0" : "0"}
                className="flex-1 text-right bg-transparent outline-none rounded-md px-1.5 h-5 w-0"
                style={{
                  fontSize: "10px",
                  color: "var(--unity-text-primary)",
                  fontFamily: "var(--font-mono)",
                  background: "var(--unity-bg-elevated)",
                  border: "1px solid var(--unity-border)",
                  minWidth: 0,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {type === "slider" && (
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 h-4 flex items-center">
            <div className="absolute inset-x-0 h-1.5 rounded-full" style={{ background: "var(--unity-bg-elevated)" }} />
            <div
              className="absolute left-0 h-1.5 rounded-full"
              style={{ width: `${sliderVal}%`, background: "var(--unity-accent)" }}
            />
            <input
              type="range"
              min={min}
              max={max}
              value={sliderVal}
              onChange={(e) => setSliderVal(Number(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
            />
            <div
              className="absolute w-3 h-3 rounded-full shadow-sm"
              style={{
                left: `calc(${sliderVal}% - 6px)`,
                background: "#ffffff",
                boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
              }}
            />
          </div>
          <input
            value={sliderVal}
            onChange={(e) => setSliderVal(Number(e.target.value))}
            className="h-5 rounded-md text-right px-1.5 outline-none"
            style={{
              width: "36px",
              fontSize: "10px",
              color: "var(--unity-text-primary)",
              fontFamily: "var(--font-mono)",
              background: "var(--unity-bg-elevated)",
              border: "1px solid var(--unity-border)",
            }}
          />
        </div>
      )}

      {type === "dropdown" && (
        <button
          className="flex items-center gap-1 flex-1 px-2 h-5 rounded-md"
          style={{
            background: "var(--unity-bg-elevated)",
            border: "1px solid var(--unity-border)",
            fontSize: "10px",
            color: "var(--unity-text-primary)",
            fontFamily: "var(--font-family)",
          }}
        >
          <span className="flex-1 text-left truncate">{value}</span>
          <ChevronDown size={9} style={{ color: "var(--unity-text-secondary)", flexShrink: 0 }} />
        </button>
      )}

      {type === "text" && (
        <div
          className="flex-1 h-5 rounded-md px-1.5 flex items-center"
          style={{
            background: "var(--unity-bg-elevated)",
            border: "1px solid var(--unity-border)",
            fontSize: "10px",
            color: "var(--unity-text-primary)",
            fontFamily: "var(--font-family)",
          }}
        >
          {value}
        </div>
      )}

      {type === "color" && (
        <div className="flex items-center gap-1.5 flex-1">
          <div className="w-5 h-5 rounded-md" style={{ background: colorVal, border: "1px solid var(--unity-border)" }} />
          <span style={{ fontSize: "10px", color: "var(--unity-text-primary)", fontFamily: "var(--font-mono)" }}>{colorVal}</span>
        </div>
      )}

      {type === "object" && (
        <button
          className="flex items-center gap-1 flex-1 px-2 h-5 rounded-md"
          style={{
            background: "var(--unity-bg-elevated)",
            border: "1px solid var(--unity-border)",
            fontSize: "10px",
            color: accent || "var(--unity-prefab)",
            fontFamily: "var(--font-family)",
          }}
        >
          <Box size={9} />
          <span className="flex-1 text-left truncate">{value}</span>
        </button>
      )}
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 my-2">
      <div style={{ flex: 1, height: "1px", background: "var(--unity-border)" }} />
      <span style={{ fontSize: "9px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: "1px", background: "var(--unity-border)" }} />
    </div>
  );
}

export function InspectorPanel() {
  return (
    <div className="flex flex-col h-full" style={{ background: "var(--unity-bg-panel)" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 h-8 shrink-0"
        style={{ borderBottom: "1px solid var(--unity-border)", background: "var(--unity-bg-surface)" }}
      >
        <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--unity-text-primary)", fontFamily: "var(--font-family)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Inspector
        </span>
        <div className="flex items-center gap-1">
          <button className="w-6 h-6 rounded-md flex items-center justify-center" style={{ color: "var(--unity-text-secondary)" }}>
            <RefreshCw size={11} />
          </button>
          <button className="w-6 h-6 rounded-md flex items-center justify-center" style={{ color: "var(--unity-text-secondary)" }}>
            <Settings size={11} />
          </button>
        </div>
      </div>

      {/* Object Header */}
      <div className="px-3 py-2.5 shrink-0" style={{ borderBottom: "1px solid var(--unity-border)" }}>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-8 h-8 rounded-[8px] flex items-center justify-center" style={{ background: "rgba(79,195,247,0.1)", border: "1px solid var(--unity-border)" }}>
            <Mountain size={16} style={{ color: "var(--unity-accent)" }} />
          </div>
          <div className="flex-1">
            <input
              defaultValue="Terrain"
              className="bg-transparent outline-none w-full"
              style={{ fontSize: "13px", fontWeight: 600, color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}
            />
          </div>
          <div className="flex items-center gap-1">
            <input type="checkbox" defaultChecked className="rounded" style={{ accentColor: "var(--unity-accent)", width: 12, height: 12 }} />
            <button className="px-2 py-0.5 rounded-md" style={{ fontSize: "10px", background: "var(--unity-bg-elevated)", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)", border: "1px solid var(--unity-border)" }}>
              Static ▾
            </button>
          </div>
        </div>
        <div className="flex gap-1">
          {[["Tag", "Untagged"], ["Layer", "Default"]].map(([k, v]) => (
            <button key={k} className="flex-1 flex items-center justify-between px-2 h-5 rounded-md" style={{ background: "var(--unity-bg-elevated)", border: "1px solid var(--unity-border)", fontSize: "10px", fontFamily: "var(--font-family)" }}>
              <span style={{ color: "var(--unity-text-secondary)" }}>{k}</span>
              <span style={{ color: "var(--unity-text-primary)" }}>{v}</span>
              <ChevronDown size={8} style={{ color: "var(--unity-text-secondary)" }} />
            </button>
          ))}
        </div>
      </div>

      {/* Components */}
      <div className="flex-1 overflow-y-auto px-2 py-2" style={{ scrollbarWidth: "none" }}>
        {/* Transform */}
        <ComponentCard icon={<Settings size={12} />} title="Transform" accent="#a78bfa">
          <PropRow label="Position" type="vector3" />
          <PropRow label="Rotation" type="vector3" />
          <PropRow label="Scale" type="vector3" />
        </ComponentCard>

        {/* Terrain */}
        <ComponentCard icon={<Mountain size={12} />} title="Terrain" accent="var(--unity-terrain)">
          <SectionDivider label="Paint Texture" />
          <PropRow label="Material" type="dropdown" value="Built-in Standard" />
          <PropRow label="Reflection" type="dropdown" value="Blend Probes" />
          <SectionDivider label="Tree & Detail" />
          <PropRow label="Draw" type="dropdown" value="Enabled" />
          <PropRow label="Detail Distance" type="slider" min={0} max={200} />
          <PropRow label="Tree Distance" type="slider" min={0} max={2000} />
          <SectionDivider label="Wind" />
          <PropRow label="Speed" type="slider" min={0} max={100} />
          <PropRow label="Size" type="slider" min={0} max={100} />
          <PropRow label="Bending" type="slider" min={0} max={100} />
          <PropRow label="Grass Tint" type="color" colorVal="#4ade80" />
        </ComponentCard>

        {/* Terrain Collider */}
        <ComponentCard icon={<Box size={12} />} title="Terrain Collider" accent="#fbbf24" defaultOpen={false}>
          <PropRow label="Material" type="dropdown" value="Built-in Standard" />
          <PropRow label="Terrain Data" type="object" value="New Terrain 2" />
          <div className="flex items-center gap-2 mt-1.5">
            <input type="checkbox" defaultChecked style={{ accentColor: "var(--unity-accent)", width: 11, height: 11 }} />
            <span style={{ fontSize: "10px", color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}>Enable Tree Colliders</span>
          </div>
        </ComponentCard>

        {/* Add Component Button */}
        <button
          className="w-full flex items-center justify-center gap-2 py-2 rounded-[10px] transition-all mt-1"
          style={{
            background: "transparent",
            border: "1px dashed var(--unity-border)",
            color: "var(--unity-accent)",
            fontSize: "11px",
            fontFamily: "var(--font-family)",
            fontWeight: 500,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(79,195,247,0.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <Plus size={12} />
          Add Component
        </button>
      </div>
    </div>
  );
}
