import { useState } from "react";
import { ChevronDown } from "lucide-react";

const menus = [
  { label: "File", items: ["New Scene", "Open Scene", "Save", "Save As...", "—", "Build Settings", "Build & Run", "—", "Exit"] },
  { label: "Edit", items: ["Undo", "Redo", "—", "Cut", "Copy", "Paste", "—", "Preferences", "Project Settings"] },
  { label: "Assets", items: ["Create", "Import Package", "Export Package", "—", "Reimport All", "Open C# Project"] },
  { label: "GameObject", items: ["Create Empty", "3D Object ▶", "2D Object ▶", "Light ▶", "—", "Align With View"] },
  { label: "Component", items: ["Mesh ▶", "Effects ▶", "Physics ▶", "—", "Add Component"] },
  { label: "Window", items: ["General ▶", "Rendering ▶", "Animation ▶", "—", "Package Manager", "Asset Store"] },
  { label: "Help", items: ["Unity Manual", "Scripting Reference", "—", "Check for Updates", "About Unity"] },
];

export function TopMenuBar() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div
      className="flex items-center h-9 px-2 select-none shrink-0 relative z-50"
      style={{ background: "var(--unity-bg-base)" }}
    >
      {/* Unity Logo */}
      <div className="flex items-center gap-2 px-1.5 mr-1">
        <div
          className="flex items-center justify-center rounded-lg"
          style={{ width: 22, height: 22, background: "var(--unity-accent-soft)", border: "1px solid var(--unity-border)" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="var(--unity-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {menus.map((menu) => (
        <div key={menu.label} className="relative">
          <button
            className="flex items-center gap-0.5 px-2.5 py-1 rounded-lg unity-press"
            style={{
              fontSize: "12px",
              color: open === menu.label ? "var(--unity-text-primary)" : "var(--unity-text-secondary)",
              background: open === menu.label ? "var(--unity-bg-elevated)" : "transparent",
              fontFamily: "var(--font-family)",
              fontWeight: 400,
            }}
            onMouseEnter={(e) => { if (open) setOpen(menu.label); else e.currentTarget.style.color = "var(--unity-text-primary)"; }}
            onMouseLeave={(e) => { if (open !== menu.label) e.currentTarget.style.color = "var(--unity-text-secondary)"; }}
            onClick={() => setOpen(open === menu.label ? null : menu.label)}
          >
            {menu.label}
          </button>
          {open === menu.label && (
            <div
              className="absolute top-full left-0 py-1.5 z-50 min-w-[200px] rounded-xl unity-fade-in"
              style={{ background: "var(--unity-bg-surface)", border: "1px solid var(--unity-border-strong)", marginTop: "4px", boxShadow: "var(--unity-shadow-lg)" }}
              onMouseLeave={() => setOpen(null)}
            >
              {menu.items.map((item, i) =>
                item === "—" ? (
                  <div key={i} className="my-1.5 mx-2" style={{ borderTop: "1px solid var(--unity-border)" }} />
                ) : (
                  <button
                    key={i}
                    className="w-full text-left mx-1 px-2.5 py-1.5 rounded-lg transition-colors"
                    style={{
                      fontSize: "12px",
                      color: "var(--unity-text-primary)",
                      fontFamily: "var(--font-family)",
                      width: "calc(100% - 8px)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--unity-accent-soft)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    onClick={() => setOpen(null)}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      ))}

      {/* Center project pill */}
      <div className="flex-1 flex items-center justify-center">
        <div
          className="flex items-center gap-2 px-3 h-6 rounded-full"
          style={{ background: "var(--unity-bg-surface)", border: "1px solid var(--unity-border)" }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--unity-terrain)" }} />
          <span style={{ fontSize: "11px", color: "var(--unity-text-primary)", fontFamily: "var(--font-family)", fontWeight: 500 }}>
            Project Helios
          </span>
          <span style={{ fontSize: "10px", color: "var(--unity-text-tertiary)", fontFamily: "var(--font-mono)" }}>
            Unity 7
          </span>
        </div>
      </div>

      {/* Right-side window meta */}
      <span className="px-2" style={{ fontSize: "10px", color: "var(--unity-text-tertiary)", fontFamily: "var(--font-mono)" }}>
        URP · DX12
      </span>

      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(null)} />
      )}
    </div>
  );
}
