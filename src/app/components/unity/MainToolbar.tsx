import { useState } from "react";
import {
  Play, Pause, SkipForward, Search, ChevronRight,
  Cloud, Sparkles, User, LayoutGrid, Command,
  ChevronDown, Check, GitBranch, Hammer, Bell, Package
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
      className="flex items-center h-12 px-3 gap-2 shrink-0"
      style={{ background: "var(--unity-bg-base)" }}
    >
      {/* Transform Tools — segmented */}
      <div
        className="flex items-center gap-0.5 p-0.5 rounded-xl"
        style={{ background: "var(--unity-bg-surface)", border: "1px solid var(--unity-border)" }}
      >
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
            className="w-7 h-7 rounded-lg flex items-center justify-center unity-press"
            style={{
              background: i === 1 ? "var(--unity-accent)" : "transparent",
              color: i === 1 ? "var(--unity-accent-foreground)" : "var(--unity-text-secondary)",
              fontSize: "10px",
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
              boxShadow: i === 1 ? "0 0 10px var(--unity-accent-glow)" : "none",
            }}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      {/* Pivot / Center — segmented */}
      <div
        className="flex items-center gap-0.5 p-0.5 rounded-xl"
        style={{ background: "var(--unity-bg-surface)", border: "1px solid var(--unity-border)" }}
      >
        <button
          className="flex items-center gap-1 px-2 h-7 rounded-lg unity-press"
          style={{ background: "transparent", color: "var(--unity-text-secondary)", fontSize: "11px", fontFamily: "var(--font-family)" }}
        >
          Pivot
          <ChevronDown size={9} />
        </button>
        <button
          className="flex items-center gap-1 px-2 h-7 rounded-lg unity-press"
          style={{ background: "transparent", color: "var(--unity-text-secondary)", fontSize: "11px", fontFamily: "var(--font-family)" }}
        >
          Global
          <ChevronDown size={9} />
        </button>
      </div>

      {/* Play Controls — segmented, centered emphasis */}
      <div
        className="flex items-center gap-0.5 p-0.5 rounded-xl mx-auto"
        style={{ background: "var(--unity-bg-surface)", border: "1px solid var(--unity-border)" }}
      >
        <button
          onClick={onPlayToggle}
          className="w-8 h-8 rounded-lg flex items-center justify-center unity-press"
          style={{
            background: isPlaying ? "var(--unity-accent)" : "transparent",
            color: isPlaying ? "var(--unity-accent-foreground)" : "var(--unity-text-primary)",
            boxShadow: isPlaying ? "0 0 14px var(--unity-accent-glow)" : "none",
          }}
          title="Play (Ctrl+P)"
        >
          <Play size={13} fill={isPlaying ? "var(--unity-accent-foreground)" : "none"} />
        </button>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="w-8 h-8 rounded-lg flex items-center justify-center unity-press"
          style={{
            background: isPaused ? "var(--unity-bg-elevated)" : "transparent",
            color: isPaused ? "var(--unity-accent)" : "var(--unity-text-secondary)",
          }}
          title="Pause (Ctrl+Shift+P)"
        >
          <Pause size={13} />
        </button>
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center unity-press"
          style={{ background: "transparent", color: "var(--unity-text-secondary)" }}
          title="Step (Ctrl+Alt+P)"
        >
          <SkipForward size={13} />
        </button>
      </div>

      {/* Command Palette */}
      <button
        onClick={onCommandPalette}
        className="flex items-center gap-2 px-3 h-8 rounded-xl unity-press"
        style={{
          background: "var(--unity-bg-surface)",
          border: "1px solid var(--unity-border)",
          color: "var(--unity-text-secondary)",
          fontSize: "11px",
          fontFamily: "var(--font-family)",
          minWidth: "210px",
        }}
      >
        <Search size={12} />
        <span>Search or run command...</span>
        <span
          className="ml-auto flex items-center gap-0.5 px-1.5 h-5 rounded-md"
          style={{ fontSize: "10px", background: "var(--unity-bg-elevated)", border: "1px solid var(--unity-border)" }}
        >
          <Command size={9} />K
        </span>
      </button>

      {/* Workspace Switcher */}
      <div className="relative">
        <button
          className="flex items-center gap-1 px-2.5 h-8 rounded-xl unity-press"
          style={{ background: "var(--unity-bg-surface)", border: "1px solid var(--unity-border)", color: "var(--unity-text-secondary)", fontSize: "11px", fontFamily: "var(--font-family)" }}
          onClick={() => setWsOpen(!wsOpen)}
        >
          <LayoutGrid size={12} />
          {workspace}
          <ChevronDown size={9} />
        </button>
        {wsOpen && (
          <div
            className="absolute top-full right-0 mt-1.5 py-1.5 rounded-xl z-50 min-w-[140px] unity-fade-in"
            style={{ background: "var(--unity-bg-surface)", border: "1px solid var(--unity-border-strong)", boxShadow: "var(--unity-shadow-lg)" }}
          >
            {workspaces.map((ws) => (
              <button
                key={ws}
                className="w-full text-left px-3 py-1.5 flex items-center gap-2 transition-colors"
                style={{ fontSize: "11px", color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--unity-accent-soft)")}
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

      {/* Git + Cloud status */}
      <div
        className="flex items-center gap-2 px-2.5 h-8 rounded-xl"
        style={{ background: "var(--unity-bg-surface)", border: "1px solid var(--unity-border)" }}
      >
        <span className="flex items-center gap-1" style={{ fontSize: "11px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)" }}>
          <GitBranch size={12} />
          main
        </span>
        <span style={{ fontSize: "10px", color: "var(--unity-terrain)", fontFamily: "var(--font-mono)" }}>↑2</span>
        <div style={{ width: "1px", height: "14px", background: "var(--unity-border)" }} />
        <Cloud size={13} style={{ color: "var(--unity-terrain)" }} />
      </div>

      {/* Build button */}
      <button
        className="flex items-center gap-1.5 px-3 h-8 rounded-xl unity-press"
        style={{ background: "var(--unity-accent-soft)", border: "1px solid var(--unity-accent)", color: "var(--unity-accent)", fontSize: "11px", fontFamily: "var(--font-family)", fontWeight: 600 }}
        title="Build & Run"
      >
        <Hammer size={12} />
        Build
      </button>

      {/* Right actions */}
      <div className="flex items-center gap-0.5">
        <button
          className="relative w-8 h-8 rounded-lg flex items-center justify-center unity-press"
          style={{ color: "var(--unity-text-secondary)" }}
          title="Package Updates"
        >
          <Package size={15} />
          <span className="absolute top-1.5 right-1.5" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--unity-light)", border: "1px solid var(--unity-bg-base)" }} />
        </button>
        <button
          className="relative w-8 h-8 rounded-lg flex items-center justify-center unity-press"
          style={{ color: "var(--unity-text-secondary)" }}
          title="Notifications"
        >
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--destructive)", border: "1px solid var(--unity-bg-base)" }} />
        </button>
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center unity-press"
          style={{ color: "var(--unity-accent)", background: "var(--unity-accent-soft)" }}
          title="AI Assistant"
        >
          <Sparkles size={15} />
        </button>
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center ml-1 unity-press"
          style={{ background: "var(--unity-bg-elevated)", color: "var(--unity-text-secondary)", border: "1px solid var(--unity-border)" }}
          title="Account"
        >
          <User size={14} />
        </button>
      </div>
    </div>
  );
}
