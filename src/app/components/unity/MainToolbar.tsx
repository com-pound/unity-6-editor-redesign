import { useState } from "react";
import {
  Play, Pause, SkipForward, Search, ChevronRight,
  Cloud, Sparkles, User, LayoutGrid, Command,
  ChevronDown, Check, Monitor, Layers
} from "lucide-react";

interface MainToolbarProps {
  isPlaying: boolean;
  onPlayToggle: () => void;
  onCommandPalette: () => void;
}

const workspaces = ["Default", "2D", "Tall", "Wide", "Custom"];

export function MainToolbar({ isPlaying, onPlayToggle, onCommandPalette }: MainToolbarProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [workspace, setWorkspace] = useState("Default");
  const [wsOpen, setWsOpen] = useState(false);

  return (
    <div
      className="flex items-center h-10 px-3 gap-2 shrink-0"
      style={{ background: "var(--unity-bg-panel)", borderBottom: "1px solid var(--unity-border)" }}
    >
      {/* Transform Tools */}
      <div className="flex items-center gap-0.5 mr-1">
        {[
          { icon: "Q", title: "Hand" },
          { icon: "W", title: "Move" },
          { icon: "E", title: "Rotate" },
          { icon: "R", title: "Scale" },
          { icon: "T", title: "Rect" },
          { icon: "Y", title: "Transform" },
        ].map((tool, i) => (
          <button
            key={tool.icon}
            title={tool.title}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: i === 1 ? "var(--unity-bg-elevated)" : "transparent",
              color: i === 1 ? "var(--unity-accent)" : "var(--unity-text-secondary)",
              fontSize: "10px",
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
              border: i === 1 ? "1px solid var(--unity-border)" : "1px solid transparent",
            }}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      <div style={{ width: "1px", height: "20px", background: "var(--unity-border)" }} />

      {/* Pivot / Center */}
      <div className="flex items-center gap-1">
        <button
          className="flex items-center gap-1 px-2 h-7 rounded-lg transition-all"
          style={{ background: "var(--unity-bg-surface)", border: "1px solid var(--unity-border)", color: "var(--unity-text-secondary)", fontSize: "11px", fontFamily: "var(--font-family)" }}
        >
          <Layers size={11} />
          Pivot
          <ChevronDown size={9} />
        </button>
        <button
          className="flex items-center gap-1 px-2 h-7 rounded-lg transition-all"
          style={{ background: "var(--unity-bg-surface)", border: "1px solid var(--unity-border)", color: "var(--unity-text-secondary)", fontSize: "11px", fontFamily: "var(--font-family)" }}
        >
          Global
          <ChevronDown size={9} />
        </button>
      </div>

      <div style={{ width: "1px", height: "20px", background: "var(--unity-border)" }} />

      {/* Play Controls */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={onPlayToggle}
          className="w-8 h-8 rounded-[10px] flex items-center justify-center transition-all"
          style={{
            background: isPlaying ? "var(--unity-accent)" : "var(--unity-bg-surface)",
            border: "1px solid var(--unity-border)",
            color: isPlaying ? "#0a0a0c" : "var(--unity-text-primary)",
            boxShadow: isPlaying ? "0 0 12px rgba(79,195,247,0.3)" : "none",
          }}
          title="Play (Ctrl+P)"
        >
          <Play size={13} fill={isPlaying ? "#0a0a0c" : "none"} />
        </button>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="w-8 h-8 rounded-[10px] flex items-center justify-center transition-all"
          style={{
            background: isPaused ? "var(--unity-bg-elevated)" : "var(--unity-bg-surface)",
            border: "1px solid var(--unity-border)",
            color: isPaused ? "var(--unity-accent)" : "var(--unity-text-secondary)",
          }}
          title="Pause (Ctrl+Shift+P)"
        >
          <Pause size={13} />
        </button>
        <button
          className="w-8 h-8 rounded-[10px] flex items-center justify-center transition-all"
          style={{ background: "var(--unity-bg-surface)", border: "1px solid var(--unity-border)", color: "var(--unity-text-secondary)" }}
          title="Step (Ctrl+Alt+P)"
        >
          <SkipForward size={13} />
        </button>
      </div>

      <div style={{ width: "1px", height: "20px", background: "var(--unity-border)" }} />

      {/* Breadcrumb */}
      <div className="flex items-center gap-1" style={{ fontSize: "11px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)" }}>
        <span>SampleScene</span>
        <ChevronRight size={11} />
        <span>Environment</span>
        <ChevronRight size={11} />
        <span style={{ color: "var(--unity-text-primary)" }}>Terrain</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Command Palette */}
      <button
        onClick={onCommandPalette}
        className="flex items-center gap-2 px-3 h-7 rounded-[10px] transition-all"
        style={{
          background: "var(--unity-bg-surface)",
          border: "1px solid var(--unity-border)",
          color: "var(--unity-text-secondary)",
          fontSize: "11px",
          fontFamily: "var(--font-family)",
          minWidth: "180px",
        }}
      >
        <Search size={11} />
        <span>Search or run command...</span>
        <span className="ml-auto flex items-center gap-0.5" style={{ fontSize: "10px", opacity: 0.5 }}>
          <Command size={9} />K
        </span>
      </button>

      {/* Workspace Switcher */}
      <div className="relative">
        <button
          className="flex items-center gap-1 px-2 h-7 rounded-[10px] transition-all"
          style={{ background: "var(--unity-bg-surface)", border: "1px solid var(--unity-border)", color: "var(--unity-text-secondary)", fontSize: "11px", fontFamily: "var(--font-family)" }}
          onClick={() => setWsOpen(!wsOpen)}
        >
          <LayoutGrid size={11} />
          {workspace}
          <ChevronDown size={9} />
        </button>
        {wsOpen && (
          <div
            className="absolute top-full right-0 mt-1 py-1 rounded-[10px] z-50 min-w-[130px] shadow-2xl"
            style={{ background: "var(--unity-bg-surface)", border: "1px solid var(--unity-border)" }}
          >
            {workspaces.map((ws) => (
              <button
                key={ws}
                className="w-full text-left px-3 py-1.5 flex items-center gap-2 transition-colors"
                style={{ fontSize: "11px", color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--unity-bg-elevated)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                onClick={() => { setWorkspace(ws); setWsOpen(false); }}
              >
                {workspace === ws && <Check size={10} style={{ color: "var(--unity-accent)" }} />}
                {workspace !== ws && <span style={{ width: 10 }} />}
                {ws}
              </button>
            ))}
          </div>
        )}
        {wsOpen && <div className="fixed inset-0 z-40" onClick={() => setWsOpen(false)} />}
      </div>

      <div style={{ width: "1px", height: "20px", background: "var(--unity-border)" }} />

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <button
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
          style={{ color: "var(--unity-text-secondary)" }}
          title="Cloud Sync"
        >
          <Cloud size={14} />
        </button>
        <button
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
          style={{ color: "var(--unity-accent)" }}
          title="AI Assistant"
        >
          <Sparkles size={14} />
        </button>
        <button
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: "var(--unity-bg-elevated)", color: "var(--unity-text-secondary)" }}
          title="Account"
        >
          <User size={13} />
        </button>
      </div>
    </div>
  );
}
