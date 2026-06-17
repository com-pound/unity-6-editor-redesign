import { TopMenuBar } from "../TopMenuBar";
import { HierarchyPanel } from "../HierarchyPanel";
import { BottomStatusBar } from "../BottomStatusBar";

export function FocusedHierarchyScreen() {
  return (
    <div className="flex flex-col w-full h-full" style={{ background: "var(--unity-bg-base)" }}>
      <TopMenuBar />
      <div className="flex-1 flex overflow-hidden">
        <div style={{ width: "280px", borderRight: "1px solid var(--unity-border)", overflow: "hidden" }}>
          <HierarchyPanel />
        </div>
        <div className="flex-1 p-6 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--unity-text-primary)", fontFamily: "var(--font-family)", marginBottom: "8px" }}>Hierarchy Panel</h1>
          <p style={{ fontSize: "12px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)", lineHeight: 1.7, marginBottom: "24px" }}>
            The redesigned hierarchy features color-coded GameObjects, prefab indicators, component type icons, enhanced search, tags, filter chips, and improved hover states — all organized in a clean, information-dense tree view.
          </p>
          <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {[
              { color: "var(--unity-camera)", label: "Camera objects", desc: "Blue — Main/Cutscene cameras" },
              { color: "var(--unity-light)", label: "Light objects", desc: "Amber — Directional/Point/Spot" },
              { color: "var(--unity-terrain)", label: "Terrain objects", desc: "Green — Terrain + mesh" },
              { color: "var(--unity-prefab)", label: "Prefab instances", desc: "Sky blue — Prefab hierarchy" },
              { color: "var(--unity-ui)", label: "UI GameObjects", desc: "Purple — Canvas children" },
              { color: "var(--unity-accent)", label: "Scene root", desc: "Accent — Active scene" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-[10px]" style={{ background: "var(--unity-bg-panel)", border: "1px solid var(--unity-border)" }}>
                <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center" style={{ background: `${item.color}20`, border: `1px solid ${item.color}40` }}>
                  <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                </div>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}>{item.label}</div>
                  <div style={{ fontSize: "9px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomStatusBar />
    </div>
  );
}
