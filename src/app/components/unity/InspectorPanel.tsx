import { useState, useRef } from "react";
import {
  ChevronDown, ChevronRight, MoreHorizontal, Mountain,
  Box, Settings, Plus, RefreshCw, Sparkles, BookOpen, Search, Copy, Trash2,
  Move, Lock, Eye, Waves, Circle, Wind, X, Boxes, Sun, Camera, Activity, Volume2, Zap
} from "lucide-react";

/* ---------- Number field with drag-to-scrub ---------- */
function NumberField({ value, onChange, axisColor, suffix }: { value: number; onChange: (n: number) => void; axisColor?: string; suffix?: string }) {
  const dragging = useRef(false);
  const startX = useRef(0);
  const startVal = useRef(0);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    startVal.current = value;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const delta = Math.round((e.clientX - startX.current) / 3);
    onChange(startVal.current + delta);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    dragging.current = false;
    try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
  };

  return (
    <input
      value={value}
      onChange={(e) => {
        const raw = e.target.value.replace(/[^0-9.\-]/g, "");
        const n = parseFloat(raw);
        onChange(Number.isFinite(n) ? n : 0);
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className="flex-1 text-right bg-transparent outline-none rounded-md px-1.5 h-5 w-0 focus:ring-1"
      style={{
        fontSize: "10px",
        color: "var(--unity-text-primary)",
        fontFamily: "var(--font-mono)",
        background: "var(--unity-bg-elevated)",
        border: "1px solid var(--unity-border)",
        minWidth: 0,
        cursor: "ew-resize",
        // @ts-ignore
        "--tw-ring-color": axisColor || "var(--unity-accent)",
      }}
    />
  );
}

interface ComponentCardProps {
  icon: React.ReactNode;
  title: string;
  enabled?: boolean;
  accent?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  onRemove?: () => void;
}

function ComponentCard({ icon, title, enabled = true, accent = "var(--unity-accent)", children, defaultOpen = true, onRemove }: ComponentCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [menuOpen, setMenuOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden mb-2 group/card unity-fade-in"
      style={{
        background: "var(--unity-bg-surface)",
        border: "1px solid var(--unity-border)",
        boxShadow: "var(--unity-shadow)",
        opacity: isEnabled ? 1 : 0.6,
      }}
    >
      {/* Card Header */}
      <div
        className="flex items-center gap-2 px-2.5 h-10 cursor-pointer transition-all"
        style={{ borderBottom: open ? "1px solid var(--unity-border)" : "none" }}
        onClick={() => setOpen(!open)}
      >
        {/* drag handle */}
        <span className="opacity-0 group-hover/card:opacity-100 transition-opacity -mr-1" style={{ color: "var(--unity-text-tertiary)", cursor: "grab" }} title="Reorder">
          <Move size={10} />
        </span>
        <span style={{ color: "var(--unity-text-tertiary)", transition: "transform 0.15s" }}>
          {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </span>
        <div className="flex items-center justify-center w-6 h-6 rounded-lg" style={{ background: "var(--unity-accent-soft)" }}>
          <span style={{ color: accent }}>{icon}</span>
        </div>
        <span style={{ flex: 1, fontSize: "12px", fontWeight: 600, color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}>
          {title}
        </span>

        <div className="flex items-center gap-0.5 opacity-0 group-hover/card:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); setAiOpen(!aiOpen); }}
            className="w-6 h-6 flex items-center justify-center rounded-md unity-press"
            style={{ color: aiOpen ? "var(--unity-accent)" : "var(--unity-text-secondary)", background: aiOpen ? "var(--unity-accent-soft)" : "transparent" }}
            title="Explain with AI"
          >
            <Sparkles size={12} />
          </button>
          <button onClick={(e) => e.stopPropagation()} className="w-6 h-6 flex items-center justify-center rounded-md unity-press" style={{ color: "var(--unity-text-secondary)" }} title="Documentation">
            <BookOpen size={12} />
          </button>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); setIsEnabled(!isEnabled); }}
          className="rounded-full flex items-center transition-all shrink-0 unity-press"
          style={{ background: isEnabled ? "var(--unity-accent)" : "var(--unity-bg-elevated)", padding: "2px", width: "30px", height: "17px", boxShadow: isEnabled ? "0 0 8px var(--unity-accent-glow)" : "none" }}
        >
          <div className="rounded-full transition-all" style={{ width: "13px", height: "13px", background: isEnabled ? "var(--unity-accent-foreground)" : "var(--unity-text-secondary)", transform: isEnabled ? "translateX(13px)" : "translateX(0)" }} />
        </button>
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="w-6 h-6 flex items-center justify-center rounded-md transition-all"
            style={{ color: "var(--unity-text-secondary)", background: menuOpen ? "var(--unity-bg-elevated)" : "transparent" }}
          >
            <MoreHorizontal size={13} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }} />
              <div
                className="absolute top-full right-0 mt-1 py-1.5 rounded-xl z-50 min-w-[150px] unity-fade-in"
                style={{ background: "var(--unity-bg-elevated)", border: "1px solid var(--unity-border-strong)", boxShadow: "var(--unity-shadow-lg)" }}
                onClick={(e) => e.stopPropagation()}
              >
                {[
                  { icon: <RefreshCw size={11} />, label: "Reset", action: () => {} },
                  { icon: <Copy size={11} />, label: "Copy Component", action: () => {} },
                  { icon: <BookOpen size={11} />, label: "Open Reference", action: () => {} },
                  { icon: <Trash2 size={11} />, label: "Remove Component", danger: true, action: onRemove },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-2 px-3 py-1.5 transition-colors"
                    style={{ fontSize: "11px", color: item.danger ? "var(--destructive)" : "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = item.danger ? "rgba(248,113,113,0.1)" : "var(--unity-accent-soft)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    onClick={() => { item.action?.(); setMenuOpen(false); }}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {aiOpen && open && (
        <div className="px-2.5 pt-2.5 unity-fade-in">
          <div className="p-2.5 rounded-lg" style={{ background: "var(--unity-accent-soft)", border: "1px solid var(--unity-accent-glow)" }}>
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles size={10} style={{ color: "var(--unity-accent)" }} />
              <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--unity-accent)", fontFamily: "var(--font-family)" }}>What does this do?</span>
            </div>
            <p style={{ fontSize: "10px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)", lineHeight: 1.6 }}>
              The {title} component defines how this object behaves in the scene. Adjust its properties below to control appearance and physics.
            </p>
          </div>
        </div>
      )}

      {open && isEnabled && <div className="px-3 py-2.5">{children}</div>}
    </div>
  );
}

/* ---------- Vector3 row with controlled state ---------- */
function Vector3Row({ label, defaultValue = [0, 0, 0] }: { label: string; defaultValue?: number[] }) {
  const [vals, setVals] = useState(defaultValue);
  const axes = [{ l: "X", c: "#f87171" }, { l: "Y", c: "#4ade80" }, { l: "Z", c: "#60a5fa" }];
  return (
    <div className="flex items-center gap-2 mb-1.5 group">
      <span className="shrink-0" style={{ fontSize: "11px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)", width: "88px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
      <div className="flex gap-1 flex-1">
        {axes.map((ax, i) => (
          <div key={ax.l} className="flex items-center gap-0.5 flex-1">
            <span style={{ fontSize: "10px", fontWeight: 700, color: ax.c, fontFamily: "var(--font-mono)", width: "8px", cursor: "ew-resize" }}>{ax.l}</span>
            <NumberField value={vals[i]} axisColor={ax.c} onChange={(n) => setVals((v) => v.map((x, idx) => (idx === i ? n : x)))} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Slider row, NaN-safe ---------- */
function SliderRow({ label, min = 0, max = 100, defaultValue = 50 }: { label: string; min?: number; max?: number; defaultValue?: number }) {
  const [sliderVal, setSliderVal] = useState(defaultValue);
  const pct = ((sliderVal - min) / (max - min)) * 100;
  return (
    <div className="flex items-center gap-2 mb-1.5 group">
      <span className="shrink-0" style={{ fontSize: "11px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)", width: "88px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
      <div className="flex items-center gap-2 flex-1">
        <div className="relative flex-1 h-4 flex items-center">
          <div className="absolute inset-x-0 h-1.5 rounded-full" style={{ background: "var(--unity-bg-elevated)" }} />
          <div className="absolute left-0 h-1.5 rounded-full" style={{ width: `${pct}%`, background: "var(--unity-accent)" }} />
          <input type="range" min={min} max={max} value={sliderVal} onChange={(e) => setSliderVal(Number(e.target.value))} className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" />
          <div className="absolute w-3 h-3 rounded-full" style={{ left: `calc(${pct}% - 6px)`, background: "#ffffff", boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }} />
        </div>
        <input
          value={sliderVal}
          onChange={(e) => {
            const n = parseFloat(e.target.value.replace(/[^0-9.\-]/g, ""));
            if (!Number.isFinite(n)) { setSliderVal(min); return; }
            setSliderVal(Math.max(min, Math.min(max, n)));
          }}
          className="h-5 rounded-md text-right px-1.5 outline-none"
          style={{ width: "38px", fontSize: "10px", color: "var(--unity-text-primary)", fontFamily: "var(--font-mono)", background: "var(--unity-bg-elevated)", border: "1px solid var(--unity-border)" }}
        />
      </div>
    </div>
  );
}

function DropdownRow({ label, value, options }: { label: string; value: string; options: string[] }) {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState(value);
  return (
    <div className="flex items-center gap-2 mb-1.5 group">
      <span className="shrink-0" style={{ fontSize: "11px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)", width: "88px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
      <div className="relative flex-1">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 w-full px-2 h-5 rounded-md unity-press"
          style={{ background: "var(--unity-bg-elevated)", border: "1px solid var(--unity-border)", fontSize: "10px", color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}
        >
          <span className="flex-1 text-left truncate">{val}</span>
          <ChevronDown size={9} style={{ color: "var(--unity-text-secondary)", flexShrink: 0 }} />
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute top-full left-0 right-0 mt-1 py-1 rounded-lg z-50 unity-fade-in" style={{ background: "var(--unity-bg-elevated)", border: "1px solid var(--unity-border-strong)", boxShadow: "var(--unity-shadow-lg)" }}>
              {options.map((o) => (
                <button key={o} onClick={() => { setVal(o); setOpen(false); }} className="w-full text-left px-2.5 py-1" style={{ fontSize: "10px", color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--unity-accent-soft)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  {o}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ColorRow({ label, defaultColor }: { label: string; defaultColor: string }) {
  const [color, setColor] = useState(defaultColor);
  return (
    <div className="flex items-center gap-2 mb-1.5 group">
      <span className="shrink-0" style={{ fontSize: "11px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)", width: "88px" }}>{label}</span>
      <div className="flex items-center gap-1.5 flex-1">
        <label className="w-5 h-5 rounded-md cursor-pointer relative overflow-hidden" style={{ background: color, border: "1px solid var(--unity-border)" }}>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
        </label>
        <span style={{ fontSize: "10px", color: "var(--unity-text-primary)", fontFamily: "var(--font-mono)" }}>{color}</span>
      </div>
    </div>
  );
}

function ObjectRow({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex items-center gap-2 mb-1.5 group">
      <span className="shrink-0" style={{ fontSize: "11px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)", width: "88px" }}>{label}</span>
      <button className="flex items-center gap-1 flex-1 px-2 h-5 rounded-md" style={{ background: "var(--unity-bg-elevated)", border: "1px solid var(--unity-border)", fontSize: "10px", color: accent || "var(--unity-prefab)", fontFamily: "var(--font-family)" }}>
        <Box size={9} />
        <span className="flex-1 text-left truncate">{value}</span>
        <Circle size={6} style={{ color: "var(--unity-text-tertiary)" }} />
      </button>
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 my-2">
      <div style={{ flex: 1, height: "1px", background: "var(--unity-border)" }} />
      <span style={{ fontSize: "9px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</span>
      <div style={{ flex: 1, height: "1px", background: "var(--unity-border)" }} />
    </div>
  );
}

/* ---------- Add Component popover ---------- */
const ADDABLE = [
  { cat: "Mesh", items: [{ icon: <Boxes size={12} />, name: "Mesh Renderer" }, { icon: <Box size={12} />, name: "Mesh Filter" }] },
  { cat: "Physics", items: [{ icon: <Box size={12} />, name: "Rigidbody" }, { icon: <Box size={12} />, name: "Box Collider" }, { icon: <Circle size={12} />, name: "Sphere Collider" }] },
  { cat: "Rendering", items: [{ icon: <Sun size={12} />, name: "Light" }, { icon: <Camera size={12} />, name: "Camera" }, { icon: <Sparkles size={12} />, name: "Particle System" }] },
  { cat: "Audio", items: [{ icon: <Volume2 size={12} />, name: "Audio Source" }, { icon: <Activity size={12} />, name: "Audio Listener" }] },
  { cat: "Scripts", items: [{ icon: <Zap size={12} />, name: "PlayerController" }, { icon: <Zap size={12} />, name: "EnemyAI" }] },
];

function AddComponentPopover({ onClose, onAdd }: { onClose: () => void; onAdd: (name: string) => void }) {
  const [q, setQ] = useState("");
  const flat = ADDABLE.flatMap((g) => g.items.map((it) => ({ ...it, cat: g.cat })));
  const filtered = flat.filter((it) => !q || it.name.toLowerCase().includes(q.toLowerCase()));
  const grouped = ADDABLE.map((g) => ({ ...g, items: g.items.filter((it) => !q || it.name.toLowerCase().includes(q.toLowerCase())) })).filter((g) => g.items.length);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="absolute bottom-full left-0 right-0 mb-2 rounded-xl z-50 overflow-hidden unity-slide-up"
        style={{ background: "var(--unity-bg-elevated)", border: "1px solid var(--unity-border-strong)", boxShadow: "var(--unity-shadow-lg)" }}
      >
        <div className="flex items-center gap-2 px-2.5 h-9" style={{ borderBottom: "1px solid var(--unity-border)" }}>
          <Search size={12} style={{ color: "var(--unity-accent)" }} />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search components..." className="flex-1 bg-transparent outline-none" style={{ fontSize: "11px", color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }} />
          <button onClick={onClose}><X size={12} style={{ color: "var(--unity-text-secondary)" }} /></button>
        </div>
        <div className="max-h-56 overflow-y-auto py-1" style={{ scrollbarWidth: "none" }}>
          {grouped.length === 0 && <div className="px-3 py-4 text-center" style={{ fontSize: "11px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)" }}>No components found</div>}
          {grouped.map((g) => (
            <div key={g.cat}>
              <div className="px-3 py-1" style={{ fontSize: "8px", fontWeight: 700, color: "var(--unity-text-tertiary)", fontFamily: "var(--font-family)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{g.cat}</div>
              {g.items.map((it) => (
                <button key={it.name} onClick={() => { onAdd(it.name); onClose(); }} className="w-full flex items-center gap-2 px-3 py-1.5" style={{ fontSize: "11px", color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--unity-accent-soft)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <span style={{ color: "var(--unity-accent)" }}>{it.icon}</span>
                  {it.name}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

interface Comp { id: string; title: string; }

export function InspectorPanel() {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [extraComps, setExtraComps] = useState<Comp[]>([]);
  const [active, setActive] = useState(true);

  const baseTitles = ["Transform", "Terrain", "Terrain Collider"];
  const matches = (title: string) => !search || title.toLowerCase().includes(search.toLowerCase());

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--unity-bg-panel)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 h-9 shrink-0" style={{ borderBottom: "1px solid var(--unity-border)", background: "var(--unity-bg-surface)" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--unity-text-primary)", fontFamily: "var(--font-family)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Inspector</span>
        <div className="flex items-center gap-1">
          <button className="w-6 h-6 rounded-md flex items-center justify-center unity-press" style={{ color: "var(--unity-text-secondary)" }} title="Lock Inspector"><Lock size={12} /></button>
          <button className="w-6 h-6 rounded-md flex items-center justify-center unity-press" style={{ color: "var(--unity-text-secondary)" }} title="Refresh"><RefreshCw size={12} /></button>
          <button className="w-6 h-6 rounded-md flex items-center justify-center unity-press" style={{ color: "var(--unity-text-secondary)" }} title="Settings"><Settings size={12} /></button>
        </div>
      </div>

      {/* Object Header */}
      <div className="px-3 py-2.5 shrink-0" style={{ borderBottom: "1px solid var(--unity-border)" }}>
        <div className="flex items-center gap-2 mb-2">
          <button onClick={() => setActive(!active)} className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 unity-press" style={{ background: "var(--unity-accent-soft)", border: "1px solid var(--unity-border)" }} title="Toggle active">
            <Mountain size={17} style={{ color: active ? "var(--unity-accent)" : "var(--unity-text-tertiary)" }} />
          </button>
          <div className="flex-1 min-w-0">
            <input defaultValue="Terrain" className="bg-transparent outline-none w-full" style={{ fontSize: "14px", fontWeight: 600, color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }} />
            <span style={{ fontSize: "10px", color: "var(--unity-text-tertiary)", fontFamily: "var(--font-mono)" }}>{baseTitles.length + extraComps.length} components</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button onClick={() => setActive(!active)} className="rounded flex items-center justify-center" style={{ width: 15, height: 15, background: active ? "var(--unity-accent)" : "var(--unity-bg-elevated)", border: "1px solid var(--unity-border)" }} title="Active">
              {active && <Eye size={9} style={{ color: "var(--unity-accent-foreground)" }} />}
            </button>
            <button className="px-2 h-6 rounded-md unity-press" style={{ fontSize: "10px", background: "var(--unity-bg-elevated)", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)", border: "1px solid var(--unity-border)" }}>Static ▾</button>
          </div>
        </div>
        <div className="flex gap-1.5">
          {[["Tag", "Untagged"], ["Layer", "Default"]].map(([k, v]) => (
            <button key={k} className="flex-1 flex items-center justify-between px-2.5 h-6 rounded-lg unity-press" style={{ background: "var(--unity-bg-elevated)", border: "1px solid var(--unity-border)", fontSize: "10px", fontFamily: "var(--font-family)" }}>
              <span style={{ color: "var(--unity-text-secondary)" }}>{k}</span>
              <span style={{ color: "var(--unity-text-primary)" }}>{v}</span>
              <ChevronDown size={9} style={{ color: "var(--unity-text-secondary)" }} />
            </button>
          ))}
        </div>
      </div>

      {/* Search inside inspector */}
      <div className="px-2 pt-2 shrink-0">
        <div className="flex items-center gap-2 px-2.5 h-7 rounded-lg" style={{ background: "var(--unity-bg-surface)", border: "1px solid var(--unity-border)" }}>
          <Search size={11} style={{ color: "var(--unity-text-secondary)", flexShrink: 0 }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search components..." className="flex-1 bg-transparent outline-none" style={{ fontSize: "11px", color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }} />
          {search && <button onClick={() => setSearch("")}><X size={11} style={{ color: "var(--unity-text-secondary)" }} /></button>}
        </div>
      </div>

      {/* Components */}
      <div className="flex-1 overflow-y-auto px-2 py-2 relative" style={{ scrollbarWidth: "none" }}>
        {matches("Transform") && (
          <ComponentCard icon={<Settings size={12} />} title="Transform" accent="#a78bfa">
            <Vector3Row label="Position" defaultValue={[0, 0, 0]} />
            <Vector3Row label="Rotation" defaultValue={[0, 0, 0]} />
            <Vector3Row label="Scale" defaultValue={[1, 1, 1]} />
          </ComponentCard>
        )}

        {matches("Terrain") && (
          <ComponentCard icon={<Mountain size={12} />} title="Terrain" accent="var(--unity-terrain)">
            <SectionDivider label="Paint Texture" />
            <DropdownRow label="Material" value="Built-in Standard" options={["Built-in Standard", "URP Terrain Lit", "HDRP Terrain", "Custom"]} />
            <DropdownRow label="Reflection" value="Blend Probes" options={["Blend Probes", "Simple", "Off"]} />
            <SectionDivider label="Tree & Detail" />
            <DropdownRow label="Draw" value="Enabled" options={["Enabled", "Disabled"]} />
            <SliderRow label="Detail Distance" min={0} max={200} defaultValue={80} />
            <SliderRow label="Tree Distance" min={0} max={2000} defaultValue={1200} />
            <SectionDivider label="Wind" />
            <SliderRow label="Speed" min={0} max={100} defaultValue={50} />
            <SliderRow label="Size" min={0} max={100} defaultValue={50} />
            <SliderRow label="Bending" min={0} max={100} defaultValue={50} />
            <ColorRow label="Grass Tint" defaultColor="#4ade80" />
          </ComponentCard>
        )}

        {matches("Terrain Collider") && (
          <ComponentCard icon={<Box size={12} />} title="Terrain Collider" accent="#fbbf24" defaultOpen={false}>
            <DropdownRow label="Material" value="Built-in Standard" options={["Built-in Standard", "Ice", "Wood", "Metal"]} />
            <ObjectRow label="Terrain Data" value="New Terrain 2" />
            <div className="flex items-center gap-2 mt-1.5">
              <input type="checkbox" defaultChecked style={{ accentColor: "var(--unity-accent)", width: 11, height: 11 }} />
              <span style={{ fontSize: "10px", color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}>Enable Tree Colliders</span>
            </div>
          </ComponentCard>
        )}

        {/* Dynamically added components */}
        {extraComps.filter((c) => matches(c.title)).map((c) => (
          <ComponentCard key={c.id} icon={<Box size={12} />} title={c.title} accent="#60a5fa" onRemove={() => setExtraComps((p) => p.filter((x) => x.id !== c.id))}>
            <Vector3Row label="Center" defaultValue={[0, 0, 0]} />
            <Vector3Row label="Size" defaultValue={[1, 1, 1]} />
          </ComponentCard>
        ))}

        {search && ![...baseTitles, ...extraComps.map((c) => c.title)].some(matches) && (
          <div className="text-center py-6" style={{ fontSize: "11px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)" }}>
            No components match "{search}"
          </div>
        )}

        {/* Add Component Button + popover */}
        <div className="relative mt-1">
          {addOpen && <AddComponentPopover onClose={() => setAddOpen(false)} onAdd={(name) => setExtraComps((p) => [...p, { id: `c${Date.now()}`, title: name }])} />}
          <button
            onClick={() => setAddOpen(!addOpen)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-[10px] transition-all"
            style={{ background: addOpen ? "var(--unity-accent-soft)" : "transparent", border: "1px dashed var(--unity-border-strong)", color: "var(--unity-accent)", fontSize: "11px", fontFamily: "var(--font-family)", fontWeight: 500 }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--unity-accent-soft)")}
            onMouseLeave={(e) => { if (!addOpen) e.currentTarget.style.background = "transparent"; }}
          >
            <Plus size={12} />
            Add Component
          </button>
        </div>
      </div>
    </div>
  );
}
