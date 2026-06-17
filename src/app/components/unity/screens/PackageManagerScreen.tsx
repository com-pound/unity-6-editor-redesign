import { useState } from "react";
import { Search, Package, RefreshCw, Download, Check, ChevronDown, Star, ExternalLink, X } from "lucide-react";
import { TopMenuBar } from "../TopMenuBar";
import { BottomStatusBar } from "../BottomStatusBar";

interface Pkg {
  id: string;
  name: string;
  displayName: string;
  version: string;
  latestVersion?: string;
  author: string;
  description: string;
  status: "installed" | "available" | "update" | "builtin";
  category: string;
  stars?: number;
  verified?: boolean;
}

const packages: Pkg[] = [
  { id: "cinemachine", name: "com.unity.cinemachine", displayName: "Cinemachine", version: "3.1.2", author: "Unity Technologies", description: "A powerful and flexible camera system for Unity. Create complex cinematic shots with ease.", status: "installed", category: "Camera", stars: 4.8, verified: true },
  { id: "input", name: "com.unity.inputsystem", displayName: "Input System", version: "1.8.1", latestVersion: "1.9.0", author: "Unity Technologies", description: "A new, flexible Input System that allows you to create robust input handlers.", status: "update", category: "Input", stars: 4.6, verified: true },
  { id: "urp", name: "com.unity.render-pipelines.universal", displayName: "Universal RP", version: "17.0.3", author: "Unity Technologies", description: "Scalable, multi-platform rendering solution for your project.", status: "installed", category: "Rendering", stars: 4.7, verified: true },
  { id: "textmeshpro", name: "com.unity.textmeshpro", displayName: "TextMeshPro", version: "3.2.0-pre.4", author: "Unity Technologies", description: "Text rendering with dynamic font assets and advanced text formatting.", status: "builtin", category: "UI", stars: 4.9, verified: true },
  { id: "addressables", name: "com.unity.addressables", displayName: "Addressables", version: "2.2.1", author: "Unity Technologies", description: "Asset management allowing content loading by address, enabling dynamic content loading.", status: "available", category: "Asset Management", stars: 4.3, verified: true },
  { id: "burst", name: "com.unity.burst", displayName: "Burst Compiler", version: "1.8.15", author: "Unity Technologies", description: "A compiler that translates IL/.NET bytecode to native code using LLVM.", status: "installed", category: "Performance", stars: 4.8, verified: true },
  { id: "jobs", name: "com.unity.jobs", displayName: "Jobs", version: "0.70.0", author: "Unity Technologies", description: "Multithreaded job system for high performance computing.", status: "installed", category: "Performance", stars: 4.5, verified: true },
  { id: "probuilder", name: "com.unity.probuilder", displayName: "ProBuilder", version: "6.0.2", author: "Unity Technologies", description: "3D level design, prototyping, and mesh editing right in the Unity Editor.", status: "available", category: "Modeling", stars: 4.4 },
  { id: "timeline", name: "com.unity.timeline", displayName: "Timeline", version: "1.8.7", author: "Unity Technologies", description: "Create cinematic content, gameplay sequences, audio sequences and complex particle effects.", status: "builtin", category: "Animation", stars: 4.2, verified: true },
  { id: "services", name: "com.unity.services.core", displayName: "Unity Services Core", version: "1.13.0", author: "Unity Technologies", description: "Core package for Unity Gaming Services integration.", status: "available", category: "Services", stars: 3.9 },
];

const statusLabel: Record<string, string> = {
  installed: "Installed",
  available: "Install",
  update: "Update",
  builtin: "Built-in",
};

const statusColor: Record<string, string> = {
  installed: "#34d399",
  available: "var(--unity-accent)",
  update: "#fbbf24",
  builtin: "var(--unity-text-secondary)",
};

export function PackageManagerScreen() {
  const [tab, setTab] = useState<"installed" | "available" | "builtin">("installed");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Pkg | null>(packages[0]);

  const filtered = packages.filter((p) => {
    const matchTab = tab === "installed" ? (p.status === "installed" || p.status === "update") : tab === "available" ? p.status === "available" : p.status === "builtin";
    const matchSearch = !search || p.displayName.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="flex flex-col w-full h-full" style={{ background: "var(--unity-bg-base)" }}>
      <TopMenuBar />
      <div className="flex-1 flex overflow-hidden">
        {/* Left list */}
        <div className="flex flex-col w-72 shrink-0" style={{ background: "var(--unity-bg-panel)", borderRight: "1px solid var(--unity-border)" }}>
          {/* Header + search */}
          <div className="px-3 py-2.5 shrink-0" style={{ borderBottom: "1px solid var(--unity-border)", background: "var(--unity-bg-surface)" }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--unity-text-primary)", fontFamily: "var(--font-family)", letterSpacing: "0.04em", textTransform: "uppercase" }}>Package Manager</span>
              <button style={{ color: "var(--unity-text-secondary)" }}><RefreshCw size={12} /></button>
            </div>
            <div className="flex items-center gap-1 px-2 h-6 rounded-lg" style={{ background: "var(--unity-bg-elevated)", border: "1px solid var(--unity-border)" }}>
              <Search size={10} style={{ color: "var(--unity-text-secondary)" }} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search packages..." className="flex-1 bg-transparent outline-none" style={{ fontSize: "10px", color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }} />
              {search && <button onClick={() => setSearch("")}><X size={8} style={{ color: "var(--unity-text-secondary)" }} /></button>}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex px-2 pt-1.5 gap-0.5 shrink-0" style={{ borderBottom: "1px solid var(--unity-border)" }}>
            {(["installed", "available", "builtin"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 py-1.5 rounded-t-md transition-all"
                style={{
                  fontSize: "10px",
                  fontFamily: "var(--font-family)",
                  fontWeight: tab === t ? 600 : 400,
                  background: tab === t ? "var(--unity-bg-elevated)" : "transparent",
                  color: tab === t ? "var(--unity-accent)" : "var(--unity-text-secondary)",
                  borderBottom: tab === t ? "2px solid var(--unity-accent)" : "2px solid transparent",
                  textTransform: "capitalize",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Package list */}
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            {filtered.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelected(pkg)}
                className="w-full text-left flex items-start gap-2.5 px-3 py-2.5 transition-all"
                style={{
                  background: selected?.id === pkg.id ? "rgba(79,195,247,0.08)" : "transparent",
                  borderLeft: selected?.id === pkg.id ? "2px solid var(--unity-accent)" : "2px solid transparent",
                  borderBottom: "1px solid var(--unity-border)",
                }}
              >
                <div className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 mt-0.5" style={{ background: "var(--unity-bg-elevated)", color: "var(--unity-accent)" }}>
                  <Package size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate" style={{ fontSize: "11px", fontWeight: 600, color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}>{pkg.displayName}</span>
                    {pkg.verified && <span style={{ fontSize: "8px", color: "var(--unity-accent)", background: "rgba(79,195,247,0.15)", padding: "0 4px", borderRadius: "3px", fontFamily: "var(--font-family)" }}>✓</span>}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span style={{ fontSize: "9px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-mono)" }}>{pkg.version}</span>
                    <div className="ml-auto shrink-0 px-1.5 py-0 rounded-full" style={{ fontSize: "8px", color: statusColor[pkg.status], background: `${statusColor[pkg.status]}18`, fontFamily: "var(--font-family)", fontWeight: 600 }}>
                      {statusLabel[pkg.status]}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: "none" }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: "var(--unity-bg-surface)", border: "1px solid var(--unity-border)", color: "var(--unity-accent)" }}>
                <Package size={28} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 style={{ fontSize: "18px", fontWeight: 700, color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}>{selected.displayName}</h1>
                  {selected.verified && <span className="px-2 py-0.5 rounded-full" style={{ fontSize: "9px", color: "var(--unity-accent)", background: "rgba(79,195,247,0.15)", fontFamily: "var(--font-family)", fontWeight: 600 }}>Unity Verified</span>}
                </div>
                <div style={{ fontSize: "11px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)" }}>
                  {selected.author} · {selected.category} · v{selected.version}
                  {selected.latestVersion && <span className="ml-2" style={{ color: "#fbbf24" }}>→ v{selected.latestVersion} available</span>}
                </div>
                {selected.stars && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={10} fill="#fbbf24" color="#fbbf24" />
                    <span style={{ fontSize: "10px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)" }}>{selected.stars}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {selected.status === "installed" && (
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px]" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", fontSize: "11px", fontFamily: "var(--font-family)" }}>
                    Remove
                  </button>
                )}
                {selected.status === "update" && (
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px]" style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", color: "#fbbf24", fontSize: "11px", fontFamily: "var(--font-family)", fontWeight: 600 }}>
                    <Download size={12} /> Update to {selected.latestVersion}
                  </button>
                )}
                {selected.status === "available" && (
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px]" style={{ background: "var(--unity-accent)", color: "#0a0a0c", fontSize: "11px", fontFamily: "var(--font-family)", fontWeight: 700 }}>
                    <Download size={12} /> Install
                  </button>
                )}
                {selected.status === "builtin" && (
                  <span className="flex items-center gap-1 px-3 py-1.5 rounded-[8px]" style={{ background: "var(--unity-bg-surface)", border: "1px solid var(--unity-border)", color: "var(--unity-text-secondary)", fontSize: "11px", fontFamily: "var(--font-family)" }}>
                    <Check size={12} /> Built-in
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="rounded-[10px] p-4 mb-4" style={{ background: "var(--unity-bg-panel)", border: "1px solid var(--unity-border)" }}>
              <h3 style={{ fontSize: "11px", fontWeight: 600, color: "var(--unity-text-primary)", fontFamily: "var(--font-family)", marginBottom: "8px" }}>Description</h3>
              <p style={{ fontSize: "11px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)", lineHeight: 1.6 }}>{selected.description}</p>
            </div>

            {/* Package details */}
            <div className="rounded-[10px] overflow-hidden" style={{ background: "var(--unity-bg-panel)", border: "1px solid var(--unity-border)" }}>
              <div className="px-4 py-2.5" style={{ borderBottom: "1px solid var(--unity-border)", background: "var(--unity-bg-surface)" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}>Package Details</span>
              </div>
              <div className="px-4 py-2">
                {[["Name", selected.name], ["Version", selected.version], ["Published by", selected.author], ["Category", selected.category]].map(([k, v]) => (
                  <div key={k} className="flex items-center py-1.5" style={{ borderBottom: "1px solid var(--unity-border)" }}>
                    <span className="w-28 shrink-0" style={{ fontSize: "10px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)" }}>{k}</span>
                    <span style={{ fontSize: "10px", color: "var(--unity-text-primary)", fontFamily: "var(--font-mono)" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <BottomStatusBar />
    </div>
  );
}
