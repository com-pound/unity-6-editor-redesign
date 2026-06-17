import { useState } from "react";
import {
  Move, RotateCcw, Maximize2, Grid3x3, Sun, Camera,
  Layers, ChevronDown, Eye, Play, ZoomIn, ZoomOut,
  Crosshair, Box, Triangle
} from "lucide-react";

interface SceneViewProps {
  isPlaying?: boolean;
}

export function SceneView({ isPlaying = false }: SceneViewProps) {
  const [activeTab, setActiveTab] = useState<"scene" | "game">("scene");
  const [showStats, setShowStats] = useState(true);
  const [activeTool, setActiveTool] = useState("move");

  const tools = [
    { id: "hand", icon: <Move size={13} />, title: "Pan (Q)" },
    { id: "move", icon: <Crosshair size={13} />, title: "Move (W)" },
    { id: "rotate", icon: <RotateCcw size={13} />, title: "Rotate (E)" },
    { id: "scale", icon: <Maximize2 size={13} />, title: "Scale (R)" },
    { id: "rect", icon: <Box size={13} />, title: "Rect (T)" },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "#101012" }}>
      {/* Tab Bar */}
      <div
        className="flex items-center h-9 px-2 gap-1 shrink-0"
        style={{ background: "var(--unity-bg-surface)", borderBottom: "1px solid var(--unity-border)" }}
      >
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg" style={{ background: "var(--unity-bg-elevated)" }}>
          {(["scene", "game"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-3 h-6 rounded-md unity-press"
              style={{
                fontSize: "11px",
                fontFamily: "var(--font-family)",
                fontWeight: activeTab === tab ? 600 : 400,
                background: activeTab === tab ? "var(--unity-bg-panel)" : "transparent",
                color: activeTab === tab ? "var(--unity-text-primary)" : "var(--unity-text-secondary)",
                boxShadow: activeTab === tab ? "var(--unity-shadow)" : "none",
                textTransform: "capitalize",
              }}
            >
              {tab === "scene" ? "Scene" : "Game"}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Scene Controls */}
        <div className="flex items-center gap-0.5">
          {[
            { label: "Shaded", icon: <Layers size={11} /> },
            { label: "2D", icon: null },
            { label: "Lighting", icon: <Sun size={11} /> },
            { label: "Audio", icon: null },
            { label: "FX", icon: null },
          ].map((ctrl) => (
            <button
              key={ctrl.label}
              className="flex items-center gap-1 px-2 h-7 rounded-lg unity-press"
              style={{
                fontSize: "10px",
                fontFamily: "var(--font-family)",
                color: "var(--unity-text-secondary)",
                background: "transparent",
                border: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--unity-bg-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {ctrl.icon}
              {ctrl.label}
              <ChevronDown size={9} />
            </button>
          ))}

          <button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-1 px-2 h-7 rounded-lg unity-press"
            style={{
              fontSize: "10px",
              color: showStats ? "var(--unity-accent)" : "var(--unity-text-secondary)",
              background: showStats ? "var(--unity-accent-soft)" : "transparent",
              fontFamily: "var(--font-family)",
            }}
          >
            <Grid3x3 size={11} />
            Gizmos
            <ChevronDown size={9} />
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 relative overflow-hidden">
        {/* Terrain Background — stylized gradient landscape */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, #1a2535 0%, #1e3550 30%, #243d4a 50%, #2d5a3d 65%, #3d7a50 75%, #4a8f5e 82%, #5aaf70 88%, #7acc8a 93%, #8ad498 97%, #9ddaaa 100%)",
        }} />

        {/* Sky gradient overlay */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, rgba(15,30,60,0.9) 0%, rgba(20,45,80,0.6) 25%, rgba(30,60,100,0.2) 45%, transparent 60%)",
        }} />

        {/* Distant mountains silhouette */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 300" preserveAspectRatio="none" style={{ height: "55%", opacity: 0.6 }}>
          <path d="M0,300 L0,180 L80,140 L160,170 L220,110 L300,150 L380,90 L460,130 L520,80 L600,110 L660,70 L740,105 L820,60 L900,95 L980,55 L1060,85 L1140,50 L1200,80 L1200,300 Z" fill="#1e3d2e" />
          <path d="M0,300 L0,210 L100,180 L200,200 L280,160 L360,185 L440,155 L520,175 L600,145 L680,168 L760,140 L840,162 L920,138 L1000,158 L1100,132 L1200,150 L1200,300 Z" fill="#265c38" />
          <path d="M0,300 L0,240 L120,220 L240,235 L340,210 L440,228 L540,205 L640,222 L740,198 L840,215 L940,192 L1040,210 L1140,188 L1200,205 L1200,300 Z" fill="#327048" />
          <path d="M0,300 L0,265 L150,252 L300,260 L450,248 L600,255 L750,244 L900,252 L1050,242 L1200,250 L1200,300 Z" fill="#3d8458" />
        </svg>

        {/* Terrain ground */}
        <div className="absolute bottom-0 left-0 right-0" style={{ height: "35%", background: "linear-gradient(180deg, #4a9960 0%, #3d8050 30%, #326840 60%, #285534 100%)" }} />

        {/* Grid overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-10" style={{ pointerEvents: "none" }}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#4FC3F7" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Axis Gizmo (bottom-left) */}
        <div className="absolute bottom-4 left-4">
          <svg width="56" height="56" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="24" fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <line x1="28" y1="28" x2="46" y2="20" stroke="#f87171" strokeWidth="2" strokeLinecap="round" />
            <circle cx="46" cy="20" r="3" fill="#f87171" />
            <text x="49" y="22" fill="#f87171" fontSize="7" fontFamily="var(--font-mono)">X</text>
            <line x1="28" y1="28" x2="14" y2="18" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
            <circle cx="14" cy="18" r="3" fill="#4ade80" />
            <text x="6" y="16" fill="#4ade80" fontSize="7" fontFamily="var(--font-mono)">Y</text>
            <line x1="28" y1="28" x2="28" y2="46" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
            <circle cx="28" cy="46" r="3" fill="#60a5fa" />
            <text x="30" y="52" fill="#60a5fa" fontSize="7" fontFamily="var(--font-mono)">Z</text>
          </svg>
        </div>

        {/* Transform Gizmo (center of terrain) */}
        <div className="absolute" style={{ left: "42%", top: "52%", transform: "translate(-50%,-50%)", pointerEvents: "none" }}>
          <svg width="80" height="80" viewBox="-40 -40 80 80">
            {/* Z (blue) */}
            <line x1="0" y1="0" x2="0" y2="-30" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
            <polygon points="0,-38 -4,-28 4,-28" fill="#60a5fa" />
            {/* X (red) */}
            <line x1="0" y1="0" x2="30" y2="8" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
            <polygon points="38,10 29,4 27,12" fill="#f87171" />
            {/* Y (green) */}
            <line x1="0" y1="0" x2="-22" y2="18" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
            <polygon points="-28,23 -20,15 -15,22" fill="#4ade80" />
            {/* Center */}
            <circle cx="0" cy="0" r="4" fill="rgba(255,255,255,0.9)" />
          </svg>
        </div>

        {/* Top-center context toolbar */}
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-1.5 py-1 rounded-xl unity-fade-in"
          style={{ background: "rgba(16,16,18,0.7)", border: "1px solid var(--unity-border-strong)", backdropFilter: "blur(16px)", boxShadow: "var(--unity-shadow-lg)" }}
        >
          {[
            { icon: <Sun size={13} />, label: "Lighting", active: true },
            { icon: <Layers size={13} />, label: "Render" },
            { icon: <Grid3x3 size={13} />, label: "Grid" },
          ].map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-1.5 px-2.5 h-7 rounded-lg unity-press"
              style={{
                fontSize: "10px",
                fontFamily: "var(--font-family)",
                color: item.active ? "var(--unity-accent)" : "var(--unity-text-secondary)",
                background: item.active ? "var(--unity-accent-soft)" : "transparent",
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
          <div style={{ width: "1px", height: "16px", background: "var(--unity-border)", margin: "0 2px" }} />
          <button className="flex items-center gap-1.5 px-2.5 h-7 rounded-lg unity-press" style={{ fontSize: "10px", fontFamily: "var(--font-family)", color: "var(--unity-text-secondary)" }}>
            <Camera size={13} />
            Presets
            <ChevronDown size={9} />
          </button>
        </div>

        {/* Play mode overlay */}
        {isPlaying && (
          <div className="absolute inset-0 pointer-events-none" style={{ border: "2px solid var(--unity-accent)", boxShadow: "inset 0 0 30px rgba(79,195,247,0.08)" }}>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: "rgba(79,195,247,0.15)", border: "1px solid rgba(79,195,247,0.3)" }}>
              <Play size={10} fill="var(--unity-accent)" color="var(--unity-accent)" />
              <span style={{ fontSize: "10px", color: "var(--unity-accent)", fontFamily: "var(--font-family)", fontWeight: 600 }}>PLAY MODE</span>
            </div>
          </div>
        )}

        {/* Left tool sidebar */}
        <div
          className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-1 p-1.5 rounded-2xl"
          style={{ background: "rgba(16,16,18,0.7)", border: "1px solid var(--unity-border-strong)", backdropFilter: "blur(16px)", boxShadow: "var(--unity-shadow-lg)" }}
        >
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              title={tool.title}
              className="w-8 h-8 rounded-xl flex items-center justify-center unity-press"
              style={{
                background: activeTool === tool.id ? "var(--unity-accent)" : "transparent",
                color: activeTool === tool.id ? "var(--unity-accent-foreground)" : "var(--unity-text-secondary)",
                boxShadow: activeTool === tool.id ? "0 0 12px var(--unity-accent-glow)" : "none",
              }}
            >
              {tool.icon}
            </button>
          ))}
          <div style={{ height: "1px", background: "var(--unity-border)", margin: "2px 4px" }} />
          <button className="w-8 h-8 rounded-xl flex items-center justify-center unity-press" style={{ color: "var(--unity-text-secondary)" }} title="Camera">
            <Camera size={14} />
          </button>
          <button className="w-8 h-8 rounded-xl flex items-center justify-center unity-press" style={{ color: "var(--unity-text-secondary)" }} title="Zoom In">
            <ZoomIn size={14} />
          </button>
          <button className="w-8 h-8 rounded-xl flex items-center justify-center unity-press" style={{ color: "var(--unity-text-secondary)" }} title="Zoom Out">
            <ZoomOut size={14} />
          </button>
        </div>

        {/* Stats overlay — performance HUD */}
        {showStats && (
          <div
            className="absolute top-3 right-3 p-3 rounded-2xl unity-fade-in"
            style={{ background: "rgba(10,10,12,0.72)", border: "1px solid var(--unity-border-strong)", backdropFilter: "blur(16px)", minWidth: "186px", boxShadow: "var(--unity-shadow-lg)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: "9px", fontWeight: 700, color: "var(--unity-text-secondary)", fontFamily: "var(--font-mono)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Performance
              </span>
              <span className="flex items-center gap-1" style={{ fontSize: "9px", color: "var(--unity-terrain)", fontFamily: "var(--font-mono)" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--unity-terrain)" }} />
                Stable
              </span>
            </div>
            {/* FPS hero */}
            <div className="flex items-baseline gap-1.5 mb-2">
              <span style={{ fontSize: "26px", fontWeight: 700, color: "var(--unity-text-primary)", fontFamily: "var(--font-mono)", lineHeight: 1 }}>144</span>
              <span style={{ fontSize: "10px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-mono)" }}>FPS</span>
              <span className="ml-auto" style={{ fontSize: "10px", color: "var(--unity-text-tertiary)", fontFamily: "var(--font-mono)" }}>6.9ms</span>
            </div>
            {/* Mini sparkline */}
            <svg width="100%" height="22" viewBox="0 0 160 22" preserveAspectRatio="none" className="mb-2">
              <polyline
                points="0,16 16,12 32,14 48,8 64,11 80,6 96,9 112,5 128,8 144,4 160,7"
                fill="none" stroke="var(--unity-accent)" strokeWidth="1.5" strokeLinejoin="round"
              />
              <polygon points="0,16 16,12 32,14 48,8 64,11 80,6 96,9 112,5 128,8 144,4 160,7 160,22 0,22" fill="var(--unity-accent-soft)" />
            </svg>
            {[
              { label: "CPU", value: "4.2ms", pct: 42, color: "var(--unity-accent)" },
              { label: "GPU", value: "6.1ms", pct: 61, color: "#a78bfa" },
              { label: "Draw Calls", value: "312", pct: 50, color: "var(--unity-terrain)" },
              { label: "Tris", value: "2.4M", pct: 70, color: "var(--unity-light)" },
              { label: "VRAM", value: "1.2 GB", pct: 35, color: "#60a5fa" },
            ].map((stat) => (
              <div key={stat.label} className="mb-1.5">
                <div className="flex justify-between items-center" style={{ marginBottom: "3px" }}>
                  <span style={{ fontSize: "10px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-mono)" }}>{stat.label}</span>
                  <span style={{ fontSize: "10px", color: "var(--unity-text-primary)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>{stat.value}</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--unity-bg-elevated)" }}>
                  <div className="h-full rounded-full" style={{ width: `${stat.pct}%`, background: stat.color }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Camera controls (bottom-right) */}
        <div
          className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1.5 rounded-xl"
          style={{ background: "rgba(16,16,18,0.7)", border: "1px solid var(--unity-border-strong)", backdropFilter: "blur(16px)", boxShadow: "var(--unity-shadow-lg)" }}
        >
          {["Persp", "Iso"].map((v, i) => (
            <button
              key={v}
              className="px-2 py-0.5 rounded-md unity-press"
              style={{
                fontSize: "10px",
                fontFamily: "var(--font-family)",
                fontWeight: i === 0 ? 600 : 400,
                background: i === 0 ? "var(--unity-accent-soft)" : "transparent",
                color: i === 0 ? "var(--unity-accent)" : "var(--unity-text-secondary)",
              }}
            >
              {v}
            </button>
          ))}
          <div style={{ width: "1px", height: "14px", background: "var(--unity-border)" }} />
          <span style={{ fontSize: "10px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-mono)" }}>100%</span>
        </div>

        {/* Snapping overlay */}
        <div
          className="absolute bottom-3 left-14 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
          style={{ background: "rgba(16,16,18,0.7)", border: "1px solid var(--unity-border-strong)", backdropFilter: "blur(16px)", boxShadow: "var(--unity-shadow-lg)" }}
        >
          <Grid3x3 size={11} style={{ color: "var(--unity-accent)" }} />
          <span style={{ fontSize: "10px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)" }}>Snap</span>
          <span style={{ fontSize: "10px", color: "var(--unity-text-primary)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>1m</span>
        </div>
      </div>
    </div>
  );
}
