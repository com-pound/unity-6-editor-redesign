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
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "#1a1a1c" }}>
      {/* Tab Bar */}
      <div
        className="flex items-center h-8 px-2 gap-1 shrink-0"
        style={{ background: "var(--unity-bg-surface)", borderBottom: "1px solid var(--unity-border)" }}
      >
        {(["scene", "game"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-3 h-6 rounded-md transition-all"
            style={{
              fontSize: "11px",
              fontFamily: "var(--font-family)",
              fontWeight: activeTab === tab ? 600 : 400,
              background: activeTab === tab ? "var(--unity-bg-elevated)" : "transparent",
              color: activeTab === tab ? "var(--unity-accent)" : "var(--unity-text-secondary)",
              border: activeTab === tab ? "1px solid var(--unity-border)" : "1px solid transparent",
              textTransform: "capitalize",
            }}
          >
            {tab === "scene" ? "Scene*" : "Game"}
          </button>
        ))}

        <div className="flex-1" />

        {/* Scene Controls */}
        <div className="flex items-center gap-1">
          {[
            { label: "Shaded", icon: <Layers size={10} /> },
            { label: "2D", icon: null },
            { label: "Lighting", icon: <Sun size={10} /> },
            { label: "Audio", icon: null },
            { label: "FX", icon: null },
          ].map((ctrl) => (
            <button
              key={ctrl.label}
              className="flex items-center gap-1 px-2 h-6 rounded-md transition-all"
              style={{
                fontSize: "10px",
                fontFamily: "var(--font-family)",
                color: "var(--unity-text-secondary)",
                background: "transparent",
                border: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--unity-bg-elevated)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {ctrl.icon}
              {ctrl.label}
              <ChevronDown size={8} />
            </button>
          ))}

          <button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-1 px-2 h-6 rounded-md transition-all"
            style={{
              fontSize: "10px",
              color: showStats ? "var(--unity-accent)" : "var(--unity-text-secondary)",
              background: showStats ? "rgba(79,195,247,0.1)" : "transparent",
              fontFamily: "var(--font-family)",
            }}
          >
            <Grid3x3 size={10} />
            Gizmos
            <ChevronDown size={8} />
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
          className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 p-1 rounded-[10px]"
          style={{ background: "rgba(20,20,22,0.85)", border: "1px solid var(--unity-border)", backdropFilter: "blur(12px)" }}
        >
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              title={tool.title}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
              style={{
                background: activeTool === tool.id ? "var(--unity-accent)" : "transparent",
                color: activeTool === tool.id ? "#0a0a0c" : "var(--unity-text-secondary)",
              }}
            >
              {tool.icon}
            </button>
          ))}
          <div style={{ height: "1px", background: "var(--unity-border)", margin: "2px 0" }} />
          <button className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ color: "var(--unity-text-secondary)" }} title="Camera">
            <Camera size={13} />
          </button>
          <button className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ color: "var(--unity-text-secondary)" }} title="Zoom In">
            <ZoomIn size={13} />
          </button>
          <button className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ color: "var(--unity-text-secondary)" }} title="Zoom Out">
            <ZoomOut size={13} />
          </button>
        </div>

        {/* Stats overlay */}
        {showStats && (
          <div
            className="absolute top-2 right-2 p-2.5 rounded-[10px]"
            style={{ background: "rgba(13,13,15,0.82)", border: "1px solid var(--unity-border)", backdropFilter: "blur(12px)", minWidth: "150px" }}
          >
            <div className="mb-1.5" style={{ fontSize: "9px", fontWeight: 700, color: "var(--unity-text-secondary)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Statistics
            </div>
            {[
              { label: "FPS", value: "144" },
              { label: "Draw Calls", value: "312" },
              { label: "Triangles", value: "2.4M" },
              { label: "Vertices", value: "1.8M" },
              { label: "VRAM", value: "1.2 GB" },
            ].map((stat) => (
              <div key={stat.label} className="flex justify-between items-center" style={{ marginBottom: "2px" }}>
                <span style={{ fontSize: "10px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-mono)" }}>{stat.label}</span>
                <span style={{ fontSize: "10px", color: "var(--unity-accent)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>{stat.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Camera controls (bottom-right) */}
        <div
          className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1.5 rounded-[10px]"
          style={{ background: "rgba(20,20,22,0.82)", border: "1px solid var(--unity-border)", backdropFilter: "blur(12px)" }}
        >
          {["Persp", "iso"].map((v, i) => (
            <button
              key={v}
              className="px-2 py-0.5 rounded-md transition-all"
              style={{
                fontSize: "10px",
                fontFamily: "var(--font-family)",
                background: i === 0 ? "var(--unity-bg-elevated)" : "transparent",
                color: i === 0 ? "var(--unity-text-primary)" : "var(--unity-text-secondary)",
              }}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
          <div style={{ width: "1px", height: "14px", background: "var(--unity-border)" }} />
          <span style={{ fontSize: "10px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-mono)" }}>100%</span>
        </div>

        {/* Snapping overlay */}
        <div
          className="absolute bottom-3 left-10 flex items-center gap-1 px-2 py-1.5 rounded-[10px]"
          style={{ background: "rgba(20,20,22,0.82)", border: "1px solid var(--unity-border)", backdropFilter: "blur(12px)" }}
        >
          <Grid3x3 size={10} style={{ color: "var(--unity-text-secondary)" }} />
          <span style={{ fontSize: "10px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)" }}>Snap: 1m</span>
        </div>
      </div>
    </div>
  );
}
