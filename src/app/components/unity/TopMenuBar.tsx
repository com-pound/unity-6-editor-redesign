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
      className="flex items-center h-8 px-1 select-none shrink-0 relative z-50"
      style={{ background: "var(--unity-bg-panel)", borderBottom: "1px solid var(--unity-border)" }}
    >
      {/* Unity Logo */}
      <div className="flex items-center gap-1.5 px-2 mr-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="var(--unity-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {menus.map((menu) => (
        <div key={menu.label} className="relative">
          <button
            className="flex items-center gap-0.5 px-2 py-0.5 rounded transition-colors"
            style={{
              fontSize: "12px",
              color: open === menu.label ? "var(--unity-accent)" : "var(--unity-text-secondary)",
              background: open === menu.label ? "var(--unity-bg-elevated)" : "transparent",
              fontFamily: "var(--font-family)",
              fontWeight: 400,
            }}
            onMouseEnter={() => open && setOpen(menu.label)}
            onClick={() => setOpen(open === menu.label ? null : menu.label)}
          >
            {menu.label}
          </button>
          {open === menu.label && (
            <div
              className="absolute top-full left-0 py-1 z-50 min-w-[180px] rounded-[10px] shadow-2xl"
              style={{ background: "var(--unity-bg-surface)", border: "1px solid var(--unity-border)", marginTop: "2px" }}
              onMouseLeave={() => setOpen(null)}
            >
              {menu.items.map((item, i) =>
                item === "—" ? (
                  <div key={i} className="my-1" style={{ borderTop: "1px solid var(--unity-border)" }} />
                ) : (
                  <button
                    key={i}
                    className="w-full text-left px-3 py-1 transition-colors"
                    style={{
                      fontSize: "12px",
                      color: "var(--unity-text-primary)",
                      fontFamily: "var(--font-family)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--unity-bg-elevated)")}
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

      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(null)} />
      )}
    </div>
  );
}
