import { useState } from "react";
import {
  Move, RotateCcw, Maximize2, Grid3x3, Sun, Camera,
  Layers, ChevronDown, Play, ZoomIn, ZoomOut,
  Crosshair, Box, Volume2, Sparkles, Maximize, Gamepad2, Check
} from "lucide-react";

interface SceneViewProps {
  isPlaying?: boolean;
}

const VIEW_MODES = ["Shaded", "Wireframe", "Shaded Wireframe", "Albedo", "Normals", "Overdraw"];
const ASPECTS = ["Free Aspect", "16:9", "16:10", "5:4", "4:3", "1920×1080"];

export function SceneView({ isPlaying = false }: SceneViewProps) {
  const [activeTab, setActiveTab] = useState<"scene" | "game">("scene");
  const [showStats, setShowStats] = useState(true);
  const [activeTool, setActiveTool] = useState("move");
  const [is2D, setIs2D] = useState(false);
  const [lighting, setLighting] = useState(true);
  const [audio, setAudio] = useState(false);
  const [fx, setFx] = useState(true);
  const [gizmos, setGizmos] = useState(true);
  const [viewMode, setViewMode] = useState("Shaded");
  const [viewMenuOpen, setViewMenuOpen] = useState(false);
  const [aspect, setAspect] = useState("16:9");
  const [aspectOpen, setAspectOpen] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [projection, setProjection] = useState<"persp" | "iso">("persp");
  const [zoom, setZoom] = useState(100);

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
              className="flex items-center gap-1.5 px-3 h-6 rounded-md unity-press"
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
              {tab === "game" && <Gamepad2 size={11} />}
              {tab === "scene" ? "Scene" : "Game"}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Scene Controls — only in Scene tab */}
        {activeTab === "scene" ? (
          <div className="flex items-center gap-0.5">
            {/* View mode dropdown */}
            <div className="relative">
              <button
                onClick={() => { setViewMenuOpen(!viewMenuOpen); setAspectOpen(false); }}
                className="flex items-center gap-1 px-2 h-7 rounded-lg unity-press"
                style={{ fontSize: "10px", fontFamily: "var(--font-family)", color: "var(--unity-text-secondary)", background: viewMenuOpen ? "var(--unity-bg-hover)" : "transparent" }}
              >
                <Layers size={11} />
                {viewMode}
                <ChevronDown size={9} />
              </button>
              {viewMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setViewMenuOpen(false)} />
                  <div className="absolute top-full right-0 mt-1 py-1.5 rounded-xl z-50 min-w-[150px] unity-fade-in" style={{ background: "var(--unity-bg-elevated)", border: "1px solid var(--unity-border-strong)", boxShadow: "var(--unity-shadow-lg)" }}>
                    {VIEW_MODES.map((m) => (
                      <button
                        key={m}
                        onClick={() => { setViewMode(m); setViewMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-1.5"
                        style={{ fontSize: "11px", color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--unity-accent-soft)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <span style={{ width: 12 }}>{viewMode === m && <Check size={10} style={{ color: "var(--unity-accent)" }} />}</span>
                        {m}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {[
              { label: "2D", state: is2D, set: setIs2D, icon: null },
              { label: "Light", state: lighting, set: setLighting, icon: <Sun size={11} /> },
              { label: "Audio", state: audio, set: setAudio, icon: <Volume2 size={11} /> },
              { label: "FX", state: fx, set: setFx, icon: <Sparkles size={11} /> },
            ].map((ctrl) => (
              <button
                key={ctrl.label}
                onClick={() => ctrl.set(!ctrl.state)}
                className="flex items-center gap-1 px-2 h-7 rounded-lg unity-press"
                style={{
                  fontSize: "10px",
                  fontFamily: "var(--font-family)",
                  color: ctrl.state ? "var(--unity-accent)" : "var(--unity-text-secondary)",
                  background: ctrl.state ? "var(--unity-accent-soft)" : "transparent",
                  border: "none",
                }}
              >
                {ctrl.icon}
                {ctrl.label}
              </button>
            ))}

            <button
              onClick={() => setGizmos(!gizmos)}
              className="flex items-center gap-1 px-2 h-7 rounded-lg unity-press"
              style={{
                fontSize: "10px",
                color: gizmos ? "var(--unity-accent)" : "var(--unity-text-secondary)",
                background: gizmos ? "var(--unity-accent-soft)" : "transparent",
                fontFamily: "var(--font-family)",
              }}
            >
              <Grid3x3 size={11} />
              Gizmos
            </button>
          </div>
        ) : (
          /* Game tab controls */
          <div className="flex items-center gap-0.5">
            <div className="relative">
              <button
                onClick={() => setAspectOpen(!aspectOpen)}
                className="flex items-center gap-1 px-2 h-7 rounded-lg unity-press"
                style={{ fontSize: "10px", fontFamily: "var(--font-family)", color: "var(--unity-text-secondary)", background: aspectOpen ? "var(--unity-bg-hover)" : "transparent" }}
              >
                {aspect}
                <ChevronDown size={9} />
              </button>
              {aspectOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setAspectOpen(false)} />
                  <div className="absolute top-full right-0 mt-1 py-1.5 rounded-xl z-50 min-w-[140px] unity-fade-in" style={{ background: "var(--unity-bg-elevated)", border: "1px solid var(--unity-border-strong)", boxShadow: "var(--unity-shadow-lg)" }}>
                    {ASPECTS.map((a) => (
                      <button
                        key={a}
                        onClick={() => { setAspect(a); setAspectOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-1.5"
                        style={{ fontSize: "11px", color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--unity-accent-soft)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <span style={{ width: 12 }}>{aspect === a && <Check size={10} style={{ color: "var(--unity-accent)" }} />}</span>
                        {a}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-1 px-2 h-7 rounded-lg unity-press"
              style={{ fontSize: "10px", color: showStats ? "var(--unity-accent)" : "var(--unity-text-secondary)", background: showStats ? "var(--unity-accent-soft)" : "transparent", fontFamily: "var(--font-family)" }}
            >
              Stats
            </button>
            <button
              onClick={() => setMaximized(!maximized)}
              className="flex items-center gap-1 px-2 h-7 rounded-lg unity-press"
              style={{ fontSize: "10px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)" }}
              title="Maximize on Play"
            >
              <Maximize size={11} />
            </button>
          </div>
        )}
      </div>

      {/* Main Viewport */}
      <div className="flex-1 relative overflow-hidden">
        {activeTab === "game" ? (
          <GameViewport aspect={aspect} showStats={showStats} isPlaying={isPlaying} />
        ) : (
          <SceneViewport
            tool={activeTool}
            tools={tools}
            setActiveTool={setActiveTool}
            showStats={showStats}
            setShowStats={setShowStats}
            isPlaying={isPlaying}
            gizmos={gizmos}
            is2D={is2D}
            viewMode={viewMode}
            projection={projection}
            setProjection={setProjection}
            zoom={zoom}
            setZoom={setZoom}
          />
        )}
      </div>
    </div>
  );
}

/* ---------- Scene viewport ---------- */
function SceneViewport({
  tool, tools, setActiveTool, showStats, setShowStats, isPlaying, gizmos, is2D, viewMode, projection, setProjection, zoom, setZoom,
}: any) {
  const wireframe = viewMode === "Wireframe" || viewMode === "Shaded Wireframe";

  return (
    <>
      {/* Terrain Background — stylized gradient landscape */}
      <div className="absolute inset-0" style={{
        background: is2D
          ? "linear-gradient(180deg, #16161a 0%, #1c1c22 100%)"
          : "linear-gradient(180deg, #1a2535 0%, #1e3550 30%, #243d4a 50%, #2d5a3d 65%, #3d7a50 75%, #4a8f5e 82%, #5aaf70 88%, #7acc8a 93%, #8ad498 97%, #9ddaaa 100%)",
      }} />

      {!is2D && (
        <>
          <div className="absolute inset-0" style={{
            background: "linear-gradient(180deg, rgba(15,30,60,0.9) 0%, rgba(20,45,80,0.6) 25%, rgba(30,60,100,0.2) 45%, transparent 60%)",
          }} />
          <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 300" preserveAspectRatio="none" style={{ height: "55%", opacity: wireframe ? 0.15 : 0.6 }}>
            <path d="M0,300 L0,180 L80,140 L160,170 L220,110 L300,150 L380,90 L460,130 L520,80 L600,110 L660,70 L740,105 L820,60 L900,95 L980,55 L1060,85 L1140,50 L1200,80 L1200,300 Z" fill="#1e3d2e" />
            <path d="M0,300 L0,210 L100,180 L200,200 L280,160 L360,185 L440,155 L520,175 L600,145 L680,168 L760,140 L840,162 L920,138 L1000,158 L1100,132 L1200,150 L1200,300 Z" fill="#265c38" />
            <path d="M0,300 L0,240 L120,220 L240,235 L340,210 L440,228 L540,205 L640,222 L740,198 L840,215 L940,192 L1040,210 L1140,188 L1200,205 L1200,300 Z" fill="#327048" />
            <path d="M0,300 L0,265 L150,252 L300,260 L450,248 L600,255 L750,244 L900,252 L1050,242 L1200,250 L1200,300 Z" fill="#3d8458" />
          </svg>
          <div className="absolute bottom-0 left-0 right-0" style={{ height: "35%", background: "linear-gradient(180deg, #4a9960 0%, #3d8050 30%, #326840 60%, #285534 100%)", opacity: wireframe ? 0.2 : 1 }} />
        </>
      )}

      {/* Grid overlay */}
      {gizmos && (
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none", opacity: is2D ? 0.18 : 0.1 }}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#4FC3F7" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      )}

      {/* Selected object bounding box */}
      {gizmos && (
        <div className="absolute" style={{ left: "calc(42% - 70px)", top: "calc(52% - 48px)", width: "140px", height: "96px", border: "1px dashed rgba(79,195,247,0.5)", borderRadius: "2px", pointerEvents: "none" }}>
          {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([x, y], i) => (
            <span key={i} className="absolute" style={{ width: 5, height: 5, background: "var(--unity-accent)", left: x ? "calc(100% - 2.5px)" : "-2.5px", top: y ? "calc(100% - 2.5px)" : "-2.5px" }} />
          ))}
        </div>
      )}

      {/* Transform Gizmo (center of terrain) — reflects active tool */}
      {gizmos && (
        <div className="absolute" style={{ left: "42%", top: "52%", transform: "translate(-50%,-50%)", pointerEvents: "none" }}>
          <ToolGizmo tool={tool} />
        </div>
      )}

      {/* Left tool sidebar */}
      <div
        className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-1 p-1.5 rounded-2xl"
        style={{ background: "rgba(16,16,18,0.7)", border: "1px solid var(--unity-border-strong)", backdropFilter: "blur(16px)", boxShadow: "var(--unity-shadow-lg)" }}
      >
        {tools.map((t: any) => (
          <button
            key={t.id}
            onClick={() => setActiveTool(t.id)}
            title={t.title}
            className="w-8 h-8 rounded-xl flex items-center justify-center unity-press"
            style={{
              background: tool === t.id ? "var(--unity-accent)" : "transparent",
              color: tool === t.id ? "var(--unity-accent-foreground)" : "var(--unity-text-secondary)",
              boxShadow: tool === t.id ? "0 0 12px var(--unity-accent-glow)" : "none",
            }}
          >
            {t.icon}
          </button>
        ))}
        <div style={{ height: "1px", background: "var(--unity-border)", margin: "2px 4px" }} />
        <button onClick={() => setZoom((z: number) => Math.min(400, z + 25))} className="w-8 h-8 rounded-xl flex items-center justify-center unity-press" style={{ color: "var(--unity-text-secondary)" }} title="Zoom In">
          <ZoomIn size={14} />
        </button>
        <button onClick={() => setZoom((z: number) => Math.max(25, z - 25))} className="w-8 h-8 rounded-xl flex items-center justify-center unity-press" style={{ color: "var(--unity-text-secondary)" }} title="Zoom Out">
          <ZoomOut size={14} />
        </button>
        <button onClick={() => setZoom(100)} className="w-8 h-8 rounded-xl flex items-center justify-center unity-press" style={{ color: "var(--unity-text-secondary)" }} title="Frame Selected (F)">
          <Camera size={14} />
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

      {/* Stats overlay */}
      {showStats && <PerfHud onClose={() => setShowStats(false)} />}

      {/* Orientation gizmo (Unity-style view cube) — bottom-left */}
      <div className="absolute bottom-4 left-16">
        <ViewCube projection={projection} />
      </div>

      {/* Camera controls (bottom-right) */}
      <div
        className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1.5 rounded-xl"
        style={{ background: "rgba(16,16,18,0.7)", border: "1px solid var(--unity-border-strong)", backdropFilter: "blur(16px)", boxShadow: "var(--unity-shadow-lg)" }}
      >
        {(["persp", "iso"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setProjection(v)}
            className="px-2 py-0.5 rounded-md unity-press"
            style={{
              fontSize: "10px",
              fontFamily: "var(--font-family)",
              fontWeight: projection === v ? 600 : 400,
              background: projection === v ? "var(--unity-accent-soft)" : "transparent",
              color: projection === v ? "var(--unity-accent)" : "var(--unity-text-secondary)",
            }}
          >
            {v === "persp" ? "Persp" : "Iso"}
          </button>
        ))}
        <div style={{ width: "1px", height: "14px", background: "var(--unity-border)" }} />
        <span style={{ fontSize: "10px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-mono)", minWidth: "34px", textAlign: "right" }}>{zoom}%</span>
      </div>

      {/* Snapping overlay */}
      <div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
        style={{ background: "rgba(16,16,18,0.7)", border: "1px solid var(--unity-border-strong)", backdropFilter: "blur(16px)", boxShadow: "var(--unity-shadow-lg)" }}
      >
        <Grid3x3 size={11} style={{ color: "var(--unity-accent)" }} />
        <span style={{ fontSize: "10px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)" }}>Snap</span>
        <span style={{ fontSize: "10px", color: "var(--unity-text-primary)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>1m</span>
      </div>
    </>
  );
}

/* Tool-aware gizmo */
function ToolGizmo({ tool }: { tool: string }) {
  if (tool === "scale") {
    return (
      <svg width="80" height="80" viewBox="-40 -40 80 80">
        <line x1="0" y1="0" x2="0" y2="-30" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="-3.5" y="-37" width="7" height="7" fill="#60a5fa" />
        <line x1="0" y1="0" x2="30" y2="8" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="30" y="5" width="7" height="7" fill="#f87171" />
        <line x1="0" y1="0" x2="-22" y2="18" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="-28" y="16" width="7" height="7" fill="#4ade80" />
        <rect x="-3.5" y="-3.5" width="7" height="7" fill="rgba(255,255,255,0.9)" />
      </svg>
    );
  }
  if (tool === "rotate") {
    return (
      <svg width="84" height="84" viewBox="-42 -42 84 84">
        <ellipse cx="0" cy="0" rx="32" ry="14" fill="none" stroke="#60a5fa" strokeWidth="2" />
        <ellipse cx="0" cy="0" rx="14" ry="32" fill="none" stroke="#f87171" strokeWidth="2" />
        <circle cx="0" cy="0" r="32" fill="none" stroke="#4ade80" strokeWidth="1.5" opacity="0.7" />
        <circle cx="0" cy="0" r="3" fill="rgba(255,255,255,0.9)" />
      </svg>
    );
  }
  // move / default
  return (
    <svg width="80" height="80" viewBox="-40 -40 80 80">
      <line x1="0" y1="0" x2="0" y2="-30" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="0,-38 -4,-28 4,-28" fill="#60a5fa" />
      <line x1="0" y1="0" x2="30" y2="8" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="38,10 29,4 27,12" fill="#f87171" />
      <line x1="0" y1="0" x2="-22" y2="18" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="-28,23 -20,15 -15,22" fill="#4ade80" />
      <circle cx="0" cy="0" r="4" fill="rgba(255,255,255,0.9)" />
    </svg>
  );
}

/* Unity orientation view cube */
function ViewCube({ projection }: { projection: "persp" | "iso" }) {
  return (
    <div
      className="flex items-center gap-2 p-2 rounded-2xl"
      style={{ background: "rgba(16,16,18,0.7)", border: "1px solid var(--unity-border-strong)", backdropFilter: "blur(16px)", boxShadow: "var(--unity-shadow-lg)" }}
    >
      <svg width="48" height="48" viewBox="0 0 56 56">
        {/* iso cube faces */}
        <polygon points="28,8 46,18 28,28 10,18" fill="rgba(96,165,250,0.5)" stroke="#60a5fa" strokeWidth="1" />
        <polygon points="10,18 28,28 28,48 10,38" fill="rgba(248,113,113,0.35)" stroke="#f87171" strokeWidth="1" />
        <polygon points="46,18 28,28 28,48 46,38" fill="rgba(74,222,128,0.35)" stroke="#4ade80" strokeWidth="1" />
        {/* axis pips */}
        <circle cx="46" cy="18" r="3" fill="#f87171" />
        <text x="48" y="16" fill="#f87171" fontSize="7" fontFamily="var(--font-mono)">X</text>
        <circle cx="10" cy="18" r="3" fill="#4ade80" />
        <text x="2" y="16" fill="#4ade80" fontSize="7" fontFamily="var(--font-mono)">Y</text>
        <circle cx="28" cy="50" r="3" fill="#60a5fa" />
      </svg>
      <span style={{ fontSize: "9px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {projection === "persp" ? "Persp" : "Iso"}
      </span>
    </div>
  );
}

/* Performance HUD */
function PerfHud({ onClose }: { onClose: () => void }) {
  return (
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
      <div className="flex items-baseline gap-1.5 mb-2">
        <span style={{ fontSize: "26px", fontWeight: 700, color: "var(--unity-text-primary)", fontFamily: "var(--font-mono)", lineHeight: 1 }}>144</span>
        <span style={{ fontSize: "10px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-mono)" }}>FPS</span>
        <span className="ml-auto" style={{ fontSize: "10px", color: "var(--unity-text-tertiary)", fontFamily: "var(--font-mono)" }}>6.9ms</span>
      </div>
      <svg width="100%" height="22" viewBox="0 0 160 22" preserveAspectRatio="none" className="mb-2">
        <polyline points="0,16 16,12 32,14 48,8 64,11 80,6 96,9 112,5 128,8 144,4 160,7" fill="none" stroke="var(--unity-accent)" strokeWidth="1.5" strokeLinejoin="round" />
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
  );
}

/* ---------- Game viewport ---------- */
function GameViewport({ aspect, showStats, isPlaying }: { aspect: string; showStats: boolean; isPlaying: boolean }) {
  const ratioMap: Record<string, number> = {
    "Free Aspect": 0, "16:9": 16 / 9, "16:10": 16 / 10, "5:4": 5 / 4, "4:3": 4 / 3, "1920×1080": 16 / 9,
  };
  const ratio = ratioMap[aspect] ?? 16 / 9;

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4" style={{ background: "#050507" }}>
      <div
        className="relative overflow-hidden rounded-md"
        style={{
          aspectRatio: ratio ? `${ratio}` : undefined,
          width: ratio ? undefined : "100%",
          height: ratio ? "100%" : "100%",
          maxWidth: "100%",
          maxHeight: "100%",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Rendered game scene — first-person-ish HUD scene */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, #0b1c33 0%, #14365c 28%, #2a6b7a 48%, #3f8a55 60%, #2f6b40 78%, #1d4429 100%)",
        }} />
        <div className="absolute inset-x-0 top-0" style={{ height: "55%", background: "radial-gradient(120% 90% at 70% 0%, rgba(255,214,140,0.5), transparent 55%)" }} />
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 800 200" preserveAspectRatio="none" style={{ height: "45%" }}>
          <path d="M0,200 L0,110 L120,70 L240,100 L360,55 L480,90 L600,50 L720,85 L800,60 L800,200 Z" fill="#16331f" />
          <path d="M0,200 L0,140 L150,115 L300,135 L450,105 L600,128 L800,100 L800,200 Z" fill="#214d2c" />
        </svg>

        {/* Game HUD */}
        <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-lg" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}>
          <div className="flex items-center gap-1">
            <span style={{ fontSize: "10px", color: "#fff", fontFamily: "var(--font-mono)", fontWeight: 700 }}>HP</span>
            <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.2)" }}>
              <div className="h-full" style={{ width: "72%", background: "#4ade80" }} />
            </div>
          </div>
        </div>
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}>
          <span style={{ fontSize: "11px", color: "#fbbf24", fontFamily: "var(--font-mono)", fontWeight: 700 }}>$ 1,240</span>
        </div>
        {/* Crosshair */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: 18, height: 18 }}>
          <span className="absolute left-1/2 top-0 -translate-x-1/2" style={{ width: 2, height: 6, background: "rgba(255,255,255,0.8)" }} />
          <span className="absolute left-1/2 bottom-0 -translate-x-1/2" style={{ width: 2, height: 6, background: "rgba(255,255,255,0.8)" }} />
          <span className="absolute top-1/2 left-0 -translate-y-1/2" style={{ height: 2, width: 6, background: "rgba(255,255,255,0.8)" }} />
          <span className="absolute top-1/2 right-0 -translate-y-1/2" style={{ height: 2, width: 6, background: "rgba(255,255,255,0.8)" }} />
        </div>

        {/* Not-playing hint */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.35)" }}>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(79,195,247,0.18)", border: "1px solid var(--unity-accent)" }}>
                <Play size={18} fill="var(--unity-accent)" color="var(--unity-accent)" />
              </div>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-family)" }}>Press Play to enter Game view</span>
            </div>
          </div>
        )}

        {/* Game stats */}
        {showStats && (
          <div className="absolute bottom-3 left-3 px-2.5 py-2 rounded-lg unity-fade-in" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Statistics</span>
            {[["Graphics", "144.0 FPS (6.9ms)"], ["Batches", "312"], ["Tris", "2.4M  Verts 3.1M"], ["Screen", aspect === "Free Aspect" ? "1600×900" : "1920×1080"]].map(([k, v]) => (
              <div key={k} className="flex items-center gap-3 mt-1" style={{ fontSize: "9px", fontFamily: "var(--font-mono)" }}>
                <span style={{ color: "rgba(255,255,255,0.5)", width: 52 }}>{k}</span>
                <span style={{ color: "#fff" }}>{v}</span>
              </div>
            ))}
          </div>
        )}

        {/* Aspect badge */}
        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md" style={{ background: "rgba(0,0,0,0.5)" }}>
          <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-mono)" }}>{aspect}</span>
        </div>
      </div>
    </div>
  );
}
