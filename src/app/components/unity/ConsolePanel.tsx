import { useState, useMemo } from "react";
import {
  Search, XCircle, AlertTriangle, Info, Trash2,
  ChevronDown, ChevronRight, Sparkles, X, Layers, Copy, Pause, Play
} from "lucide-react";

type Severity = "error" | "warning" | "info";

interface LogEntry {
  id: string;
  severity: Severity;
  message: string;
  source: string;
  count: number;
  stack?: string[];
  timestamp: string;
}

const initialLogs: LogEntry[] = [
  {
    id: "e1", severity: "error", count: 3,
    message: "NullReferenceException: Object reference not set to an instance of an object",
    source: "PlayerController.cs:142", timestamp: "12:34:01",
    stack: [
      "PlayerController.Update () (at Assets/Scripts/PlayerController.cs:142)",
      "UnityEngine.InputSystem.InputAction+CallbackContext.ReadValue[TValue] ()",
      "UnityEngine.EventSystems.EventSystem:Update()",
    ],
  },
  {
    id: "w1", severity: "warning", count: 1,
    message: "Shader 'Hidden/BlitAdd' has been replaced by 'Hidden/BlitCopy'",
    source: "Terrain.cs:38", timestamp: "12:33:55",
    stack: ["UnityEngine.Shader:Find(String)"],
  },
  {
    id: "i1", severity: "info", count: 1,
    message: "Successfully baked lightmap for scene 'SampleScene' — 2.4 seconds",
    source: "LightBaking.cs:77", timestamp: "12:33:40",
  },
  {
    id: "e2", severity: "error", count: 1,
    message: "IndexOutOfRangeException: Index was outside the bounds of the array",
    source: "EnemyAI.cs:89", timestamp: "12:33:20",
    stack: [
      "EnemyAI.FindTarget () (at Assets/Scripts/EnemyAI.cs:89)",
      "EnemyAI.Update () (at Assets/Scripts/EnemyAI.cs:56)",
    ],
  },
  {
    id: "w2", severity: "warning", count: 4,
    message: "Assets/Visual Assets/Terrain/Rock_Normal.png: Texture compression may not be optimal for this platform",
    source: "TextureImporter:0", timestamp: "12:32:58",
  },
  {
    id: "i2", severity: "info", count: 1,
    message: "Compilation completed in 0.84s — 0 errors, 0 warnings",
    source: "EditorCompiler:0", timestamp: "12:32:44",
  },
  {
    id: "w3", severity: "warning", count: 2,
    message: "PerformanceBudget: Draw call count (312) exceeded recommended limit (256)",
    source: "RenderPipeline:0", timestamp: "12:32:31",
  },
  {
    id: "i3", severity: "info", count: 1,
    message: "Physics simulation resumed — fixed timestep: 0.02s",
    source: "PhysicsManager:0", timestamp: "12:32:10",
  },
];

const severityColor: Record<Severity, string> = {
  error: "#f87171",
  warning: "#fbbf24",
  info: "var(--unity-text-secondary)",
};

const SeverityIcon = ({ severity }: { severity: Severity }) => {
  const props = { size: 11, color: severityColor[severity] };
  switch (severity) {
    case "error": return <XCircle {...props} />;
    case "warning": return <AlertTriangle {...props} />;
    default: return <Info {...props} />;
  }
};

const aiText: Record<string, { body: React.ReactNode; fix: React.ReactNode }> = {
  e1: {
    body: <>This error occurs at line 142 of <code style={{ fontFamily: "var(--font-mono)", color: "var(--unity-accent)", fontSize: "9px" }}>PlayerController.cs</code> because an object reference is being accessed without first checking for null. This commonly happens when a component is missing from the GameObject, or when <code style={{ fontFamily: "var(--font-mono)", color: "var(--unity-accent)", fontSize: "9px" }}>GetComponent&lt;&gt;()</code> returns null.</>,
    fix: <>Add a null check before accessing the reference, or use <code style={{ fontFamily: "var(--font-mono)", color: "#4ade80", fontSize: "9px" }}>RequireComponent</code> attribute.</>,
  },
  e2: {
    body: <>An array was indexed beyond its valid range in <code style={{ fontFamily: "var(--font-mono)", color: "var(--unity-accent)", fontSize: "9px" }}>EnemyAI.cs:89</code>. The target list is likely empty when <code style={{ fontFamily: "var(--font-mono)", color: "var(--unity-accent)", fontSize: "9px" }}>FindTarget()</code> runs.</>,
    fix: <>Guard the access with <code style={{ fontFamily: "var(--font-mono)", color: "#4ade80", fontSize: "9px" }}>if (targets.Count {">"} 0)</code> before indexing.</>,
  },
};

export function ConsolePanel() {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [filter, setFilter] = useState<Set<Severity>>(new Set(["error", "warning", "info"]));
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<string | null>("e1");
  const [aiExplaining, setAiExplaining] = useState<string | null>(null);
  const [collapse, setCollapse] = useState(true);
  const [paused, setPaused] = useState(false);
  const [ctx, setCtx] = useState<{ id: string; x: number; y: number } | null>(null);

  const toggleFilter = (s: Severity) => {
    const next = new Set(filter);
    if (next.has(s)) next.delete(s); else next.add(s);
    setFilter(next);
  };
  const toggleExpand = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpanded(next);
  };

  const counts = useMemo(() => ({
    error: logs.filter((l) => l.severity === "error").reduce((a, b) => a + b.count, 0),
    warning: logs.filter((l) => l.severity === "warning").reduce((a, b) => a + b.count, 0),
    info: logs.filter((l) => l.severity === "info").reduce((a, b) => a + b.count, 0),
  }), [logs]);

  const filtered = useMemo(() => logs.filter(
    (l) => filter.has(l.severity) && (!search || l.message.toLowerCase().includes(search.toLowerCase()) || l.source.toLowerCase().includes(search.toLowerCase()))
  ), [logs, filter, search]);

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--unity-bg-panel)" }} onClick={() => setCtx(null)}>
      {/* Header */}
      <div className="flex items-center gap-2 px-2 h-8 shrink-0" style={{ borderBottom: "1px solid var(--unity-border)", background: "var(--unity-bg-surface)" }}>
        <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--unity-text-primary)", fontFamily: "var(--font-family)", letterSpacing: "0.04em", textTransform: "uppercase" }}>Console</span>
        <div style={{ width: "1px", height: "14px", background: "var(--unity-border)" }} />

        <button onClick={() => setLogs([])} className="flex items-center gap-1 px-2 h-5 rounded-md unity-press" style={{ fontSize: "10px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)" }} title="Clear">
          <Trash2 size={10} /> Clear
        </button>
        <button onClick={() => setCollapse(!collapse)} className="flex items-center gap-1 px-2 h-5 rounded-md unity-press" style={{ fontSize: "10px", color: collapse ? "var(--unity-accent)" : "var(--unity-text-secondary)", background: collapse ? "var(--unity-accent-soft)" : "transparent", fontFamily: "var(--font-family)" }} title="Collapse duplicates">
          <Layers size={10} /> Collapse
        </button>
        <button onClick={() => setPaused(!paused)} className="flex items-center gap-1 px-2 h-5 rounded-md unity-press" style={{ fontSize: "10px", color: paused ? "var(--unity-accent)" : "var(--unity-text-secondary)", background: paused ? "var(--unity-accent-soft)" : "transparent", fontFamily: "var(--font-family)" }} title="Pause on error / clear on play">
          {paused ? <Play size={10} /> : <Pause size={10} />} {paused ? "Resume" : "Pause"}
        </button>

        <div style={{ width: "1px", height: "14px", background: "var(--unity-border)" }} />

        {/* Severity filters */}
        {([["error", counts.error, XCircle], ["warning", counts.warning, AlertTriangle], ["info", counts.info, Info]] as [Severity, number, any][]).map(([s, c, Icon]) => (
          <button key={s} onClick={() => toggleFilter(s)} className="flex items-center gap-1 px-2 h-5 rounded-md transition-all"
            style={{
              background: filter.has(s) ? (s === "error" ? "rgba(248,113,113,0.12)" : s === "warning" ? "rgba(251,191,36,0.12)" : "rgba(136,136,160,0.12)") : "transparent",
              border: `1px solid ${filter.has(s) ? severityColor[s] : "var(--unity-border)"}`,
              color: filter.has(s) ? severityColor[s] : "var(--unity-text-secondary)",
              opacity: filter.has(s) ? 1 : 0.45,
            }}>
            <Icon size={10} />
            <span style={{ fontSize: "10px", fontFamily: "var(--font-family)", fontWeight: 600 }}>{c}</span>
          </button>
        ))}

        <div className="flex-1" />

        {/* Search */}
        <div className="flex items-center gap-1 px-2 h-5 rounded-md" style={{ background: "var(--unity-bg-elevated)", border: "1px solid var(--unity-border)", minWidth: "140px" }}>
          <Search size={9} style={{ color: "var(--unity-text-secondary)" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter logs..." className="flex-1 bg-transparent outline-none" style={{ fontSize: "10px", color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }} />
          {search && <button onClick={() => setSearch("")}><X size={8} style={{ color: "var(--unity-text-secondary)" }} /></button>}
        </div>
      </div>

      {/* Log list */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2" style={{ color: "var(--unity-text-secondary)" }}>
            <Info size={22} style={{ opacity: 0.4 }} />
            <span style={{ fontSize: "11px", fontFamily: "var(--font-family)" }}>{logs.length === 0 ? "Console cleared" : "No logs match your filters"}</span>
          </div>
        )}
        {filtered.map((log) => {
          const isSelected = selected === log.id;
          const isExpanded = expanded.has(log.id);
          const isAI = aiExplaining === log.id;
          const ai = aiText[log.id] ?? aiText.e1;

          return (
            <div key={log.id} style={{ borderBottom: "1px solid var(--unity-border)" }}>
              <div
                className="flex items-start gap-2 px-3 py-1.5 cursor-pointer transition-all"
                style={{ background: isSelected ? (log.severity === "error" ? "rgba(248,113,113,0.08)" : log.severity === "warning" ? "rgba(251,191,36,0.06)" : "var(--unity-bg-elevated)") : "transparent", borderLeft: isSelected ? `2px solid ${severityColor[log.severity]}` : "2px solid transparent" }}
                onClick={() => setSelected(log.id)}
                onContextMenu={(e) => { e.preventDefault(); setSelected(log.id); setCtx({ id: log.id, x: e.clientX, y: e.clientY }); }}
              >
                <div className="mt-0.5 shrink-0"><SeverityIcon severity={log.severity} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-1.5">
                    <span className="flex-1 truncate" style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: log.severity === "error" ? "#f87171" : log.severity === "warning" ? "#fbbf24" : "var(--unity-text-primary)", lineHeight: 1.4 }}>{log.message}</span>
                    {collapse && log.count > 1 && (
                      <span className="shrink-0 px-1.5 py-0 rounded-full" style={{ fontSize: "9px", fontFamily: "var(--font-mono)", background: log.severity === "error" ? "rgba(248,113,113,0.2)" : "rgba(251,191,36,0.2)", color: severityColor[log.severity], fontWeight: 700 }}>×{log.count}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span style={{ fontSize: "10px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-mono)" }}>{log.source}</span>
                    <span style={{ fontSize: "9px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-mono)", opacity: 0.5 }}>{log.timestamp}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 mt-0.5">
                  {log.severity === "error" && (
                    <button onClick={(e) => { e.stopPropagation(); setAiExplaining(isAI ? null : log.id); }} className="flex items-center gap-1 px-1.5 h-5 rounded-md transition-all"
                      style={{ background: isAI ? "rgba(79,195,247,0.15)" : "transparent", border: `1px solid ${isAI ? "var(--unity-accent)" : "var(--unity-border)"}`, color: isAI ? "var(--unity-accent)" : "var(--unity-text-secondary)", fontSize: "9px", fontFamily: "var(--font-family)" }}>
                      <Sparkles size={8} /> AI
                    </button>
                  )}
                  {log.stack && (
                    <button onClick={(e) => { e.stopPropagation(); toggleExpand(log.id); }} style={{ color: "var(--unity-text-secondary)" }}>
                      {isExpanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                    </button>
                  )}
                </div>
              </div>

              {isAI && (
                <div className="px-3 pb-2" style={{ borderBottom: "1px solid var(--unity-border)" }}>
                  <div className="p-2.5 rounded-[8px]" style={{ background: "rgba(79,195,247,0.06)", border: "1px solid rgba(79,195,247,0.2)" }}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Sparkles size={10} style={{ color: "var(--unity-accent)" }} />
                      <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--unity-accent)", fontFamily: "var(--font-family)" }}>AI Explanation</span>
                    </div>
                    <p style={{ fontSize: "10px", color: "var(--unity-text-primary)", fontFamily: "var(--font-family)", lineHeight: 1.6 }}>{ai.body}</p>
                    <p className="mt-1.5" style={{ fontSize: "10px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)", lineHeight: 1.5 }}>
                      <strong style={{ color: "var(--unity-text-primary)" }}>Fix:</strong> {ai.fix}
                    </p>
                  </div>
                </div>
              )}

              {isExpanded && log.stack && (
                <div className="pb-1.5 px-3" style={{ background: "rgba(0,0,0,0.12)" }}>
                  {log.stack.map((line, i) => (
                    <div key={i} className="py-0.5" style={{ paddingLeft: "16px" }}>
                      <span style={{ fontSize: "10px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-mono)" }}>{line}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Context menu */}
      {ctx && (
        <div className="fixed py-1.5 rounded-xl z-[100] min-w-[150px] unity-fade-in" style={{ left: ctx.x, top: ctx.y, background: "var(--unity-bg-elevated)", border: "1px solid var(--unity-border-strong)", boxShadow: "var(--unity-shadow-lg)" }} onClick={(e) => e.stopPropagation()}>
          {[
            { icon: <Copy size={11} />, label: "Copy Message" },
            { icon: <Sparkles size={11} />, label: "Explain with AI", action: () => setAiExplaining(ctx.id) },
            { icon: <Trash2 size={11} />, label: "Remove", danger: true, action: () => setLogs((p) => p.filter((l) => l.id !== ctx.id)) },
          ].map((item) => (
            <button key={item.label} className="w-full flex items-center gap-2 px-3 py-1.5" style={{ fontSize: "11px", color: item.danger ? "var(--destructive)" : "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = item.danger ? "rgba(248,113,113,0.1)" : "var(--unity-accent-soft)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              onClick={() => { item.action?.(); setCtx(null); }}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
