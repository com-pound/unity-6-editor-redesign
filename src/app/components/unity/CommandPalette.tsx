import { useState, useEffect } from "react";
import { Search, Command, ArrowRight, Play, Layers, Box, FileText, Settings, Sparkles, X } from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  category: string;
  shortcut?: string;
  icon: React.ReactNode;
  accent?: string;
}

const commands: CommandItem[] = [
  { id: "play", label: "Play Scene", category: "Scene", shortcut: "Ctrl+P", icon: <Play size={12} />, accent: "var(--unity-accent)" },
  { id: "bake", label: "Bake Lighting", category: "Lighting", shortcut: "Ctrl+L", icon: <Sparkles size={12} />, accent: "#fbbf24" },
  { id: "build", label: "Build & Run", category: "Build", shortcut: "Ctrl+B", icon: <Box size={12} /> },
  { id: "save", label: "Save Scene", category: "File", shortcut: "Ctrl+S", icon: <FileText size={12} /> },
  { id: "prefs", label: "Preferences", category: "Edit", shortcut: "Ctrl+,", icon: <Settings size={12} /> },
  { id: "new-go", label: "Create Empty GameObject", category: "GameObject", icon: <Box size={12} /> },
  { id: "new-cam", label: "Create Camera", category: "GameObject", icon: <Layers size={12} />, accent: "var(--unity-camera)" },
  { id: "pkg", label: "Open Package Manager", category: "Window", icon: <Box size={12} /> },
  { id: "ai", label: "Open AI Assistant", category: "Window", icon: <Sparkles size={12} />, accent: "var(--unity-accent)" },
  { id: "reload", label: "Reimport All Assets", category: "Assets", icon: <ArrowRight size={12} /> },
];

interface CommandPaletteProps {
  onClose: () => void;
}

export function CommandPalette({ onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(0);

  const filtered = commands.filter(
    (c) => !search || c.label.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setSelected(0);
  }, [search]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") setSelected((s) => Math.min(s + 1, filtered.length - 1));
      if (e.key === "ArrowUp") setSelected((s) => Math.max(s - 1, 0));
      if (e.key === "Enter" && filtered[selected]) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [filtered, selected, onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} onClick={onClose} />

      {/* Palette */}
      <div
        className="relative w-full max-w-lg rounded-[14px] overflow-hidden shadow-2xl"
        style={{
          background: "var(--unity-bg-surface)",
          border: "1px solid var(--unity-border)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid var(--unity-border)" }}>
          <Search size={15} style={{ color: "var(--unity-accent)", flexShrink: 0 }} />
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search commands, assets, GameObjects..."
            className="flex-1 bg-transparent outline-none"
            style={{ fontSize: "13px", color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ color: "var(--unity-text-secondary)" }}>
              <X size={13} />
            </button>
          )}
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md" style={{ background: "var(--unity-bg-elevated)", border: "1px solid var(--unity-border)" }}>
            <span style={{ fontSize: "9px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-mono)" }}>ESC</span>
          </div>
        </div>

        {/* Results */}
        <div className="py-1.5 max-h-64 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {filtered.length === 0 && (
            <div className="px-4 py-6 text-center" style={{ fontSize: "12px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)" }}>
              No commands found for "{search}"
            </div>
          )}
          {filtered.map((cmd, i) => (
            <div
              key={cmd.id}
              className="flex items-center gap-3 px-4 py-2 cursor-pointer transition-all"
              style={{
                background: i === selected ? "var(--unity-bg-elevated)" : "transparent",
                borderLeft: i === selected ? "2px solid var(--unity-accent)" : "2px solid transparent",
              }}
              onMouseEnter={() => setSelected(i)}
              onClick={onClose}
            >
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                style={{ background: "var(--unity-bg-elevated)", color: cmd.accent || "var(--unity-text-secondary)" }}
              >
                {cmd.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: "12px", color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}>
                  {cmd.label}
                </div>
                <div style={{ fontSize: "10px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)" }}>
                  {cmd.category}
                </div>
              </div>
              {cmd.shortcut && (
                <div className="flex items-center gap-0.5">
                  {cmd.shortcut.split("+").map((k, ki) => (
                    <span
                      key={ki}
                      className="px-1 py-0.5 rounded"
                      style={{ fontSize: "9px", color: "var(--unity-text-secondary)", background: "var(--unity-bg-elevated)", border: "1px solid var(--unity-border)", fontFamily: "var(--font-mono)" }}
                    >
                      {k}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="flex items-center gap-3 px-4 py-2"
          style={{ borderTop: "1px solid var(--unity-border)", background: "var(--unity-bg-panel)" }}
        >
          <span style={{ fontSize: "9px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)" }}>
            ↑↓ navigate · ↵ select · esc close
          </span>
          <div className="flex-1" />
          <Sparkles size={10} style={{ color: "var(--unity-accent)" }} />
          <span style={{ fontSize: "9px", color: "var(--unity-accent)", fontFamily: "var(--font-family)" }}>AI-enhanced search</span>
        </div>
      </div>
    </div>
  );
}
