import { TopMenuBar } from "../TopMenuBar";
import { InspectorPanel } from "../InspectorPanel";
import { BottomStatusBar } from "../BottomStatusBar";

export function FocusedInspectorScreen() {
  return (
    <div className="flex flex-col w-full h-full" style={{ background: "var(--unity-bg-base)" }}>
      <TopMenuBar />
      <div className="flex-1 flex overflow-hidden">
        {/* Wide inspector */}
        <div className="flex-1 overflow-hidden" style={{ maxWidth: "520px", margin: "0 auto" }}>
          <InspectorPanel />
        </div>
        {/* Side info */}
        <div className="flex-1 p-6 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--unity-text-primary)", fontFamily: "var(--font-family)", marginBottom: "8px" }}>Inspector Panel</h1>
          <p style={{ fontSize: "12px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)", lineHeight: 1.7, marginBottom: "24px" }}>
            Redesigned component cards feature clean headers with icon, title, enable toggle, and settings — all collapsible with smooth animation. Property fields feature modern sliders, clean number inputs, and color-coded axis indicators.
          </p>
          <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {[
              { title: "Component Cards", desc: "Rounded containers with icon, enable toggle, and context menu" },
              { title: "Axis Indicators", desc: "Color-coded X/Y/Z for transform fields (red, green, blue)" },
              { title: "Modern Sliders", desc: "Smooth range inputs with precise numeric input alongside" },
              { title: "Collapsible", desc: "Animated expand/collapse with persistent state" },
            ].map((f) => (
              <div key={f.title} className="p-3 rounded-[10px]" style={{ background: "var(--unity-bg-panel)", border: "1px solid var(--unity-border)" }}>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--unity-accent)", fontFamily: "var(--font-family)", marginBottom: "4px" }}>{f.title}</div>
                <div style={{ fontSize: "10px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)", lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomStatusBar />
    </div>
  );
}
