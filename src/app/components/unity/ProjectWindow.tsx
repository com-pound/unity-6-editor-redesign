import { useState } from "react";
import {
  Search, Grid, List, Star, ChevronRight,
  Folder, FolderOpen, Image, Box, Music, FileText,
  Code, Layers, Plus, SlidersHorizontal, X, Clock, HardDrive, Tag, Trash2, Copy, ExternalLink
} from "lucide-react";

interface Asset {
  id: string;
  name: string;
  type: "folder" | "texture" | "mesh" | "audio" | "script" | "material" | "prefab" | "scene";
  size?: string;
  modified?: string;
  favorite?: boolean;
  dims?: string;
}

const assets: Asset[] = [
  { id: "f1", name: "Audio", type: "folder", modified: "2 days ago" },
  { id: "f2", name: "Managers", type: "folder", modified: "5 hours ago" },
  { id: "f3", name: "Prefabs", type: "folder", modified: "1 hour ago" },
  { id: "f4", name: "Resources", type: "folder", modified: "3 days ago" },
  { id: "f5", name: "Save Data", type: "folder", modified: "1 week ago" },
  { id: "f6", name: "Scenes", type: "folder", modified: "20 min ago" },
  { id: "f7", name: "Scripts", type: "folder", modified: "12 min ago" },
  { id: "f8", name: "Visual Assets", type: "folder", modified: "1 day ago" },
  { id: "f9", name: "Packages", type: "folder", modified: "2 weeks ago" },
  { id: "a1", name: "TerrainTex_01", type: "texture", size: "4.2 MB", favorite: true, dims: "2048×2048", modified: "3 hours ago" },
  { id: "a2", name: "TerrainTex_02", type: "texture", size: "3.8 MB", dims: "2048×2048", modified: "3 hours ago" },
  { id: "a3", name: "Rock_A", type: "mesh", size: "1.1 MB", modified: "yesterday" },
  { id: "a4", name: "Tree_Pine", type: "prefab", size: "320 KB", favorite: true, modified: "2 days ago" },
  { id: "a5", name: "GameManager", type: "script", size: "8 KB", modified: "12 min ago" },
  { id: "a6", name: "PlayerController", type: "script", size: "12 KB", modified: "8 min ago" },
  { id: "a7", name: "TerrainMat", type: "material", size: "2 KB", modified: "1 hour ago" },
  { id: "a8", name: "Ambient_Forest", type: "audio", size: "8.4 MB", modified: "1 week ago" },
  { id: "a9", name: "SampleScene", type: "scene", size: "420 KB", modified: "20 min ago" },
  { id: "a10", name: "UI_Atlas", type: "texture", size: "6.1 MB", dims: "4096×4096", modified: "4 days ago" },
  { id: "a11", name: "EnemyAI", type: "script", size: "18 KB", modified: "1 hour ago" },
  { id: "a12", name: "Player_Rig", type: "mesh", size: "2.4 MB", favorite: true, modified: "3 days ago" },
];

const typeColors: Record<string, string> = {
  folder: "#fbbf24",
  texture: "#a78bfa",
  mesh: "#60a5fa",
  audio: "#34d399",
  script: "#4FC3F7",
  material: "#f87171",
  prefab: "#7dd3fc",
  scene: "#fb923c",
};

const TypeIcon = ({ type, size = 16 }: { type: string; size?: number }) => {
  const color = typeColors[type] || "var(--unity-text-secondary)";
  const props = { size, color };
  switch (type) {
    case "folder": return <Folder {...props} />;
    case "texture": return <Image {...props} />;
    case "mesh": return <Box {...props} />;
    case "audio": return <Music {...props} />;
    case "script": return <Code {...props} />;
    case "material": return <Layers {...props} />;
    case "prefab": return <Box {...props} style={{ color: typeColors.prefab }} />;
    case "scene": return <FileText {...props} />;
    default: return <FileText {...props} />;
  }
};

/* Mini thumbnail visual per type */
const Thumb = ({ type, size }: { type: string; size: number }) => {
  const color = typeColors[type] || "var(--unity-text-secondary)";
  if (type === "texture") {
    return (
      <div className="w-full h-full rounded-[6px] overflow-hidden" style={{ background: `linear-gradient(135deg, ${color}, ${color}66)` }}>
        <div className="w-full h-full" style={{ backgroundImage: "linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%)", backgroundSize: `${size / 4}px ${size / 4}px` }} />
      </div>
    );
  }
  if (type === "material") {
    return <div className="w-full h-full rounded-full" style={{ background: `radial-gradient(circle at 32% 28%, #fff, ${color} 55%, ${color}33 100%)` }} />;
  }
  return (
    <div className="w-full h-full rounded-[6px] flex items-center justify-center" style={{ background: `${color}1a`, border: `1px solid ${color}40` }}>
      <TypeIcon type={type} size={Math.round(size * 0.42)} />
    </div>
  );
};

const folders = ["Assets", "Audio", "Prefabs", "Scenes", "Scripts", "Visual Assets"];

export function ProjectWindow() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [search, setSearch] = useState("");
  const [activeFolder, setActiveFolder] = useState("Assets");
  const [favorites, setFavorites] = useState<Set<string>>(new Set(["a1", "a4", "a12"]));
  const [activeFilter, setActiveFilter] = useState("All");
  const [selected, setSelected] = useState<string | null>("a1");
  const [showPreview, setShowPreview] = useState(false);
  const [thumbSize, setThumbSize] = useState(2);
  const [ctx, setCtx] = useState<{ id: string; x: number; y: number } | null>(null);

  const filters = ["All", "Scripts", "Prefabs", "Textures", "Meshes", "Audio"];
  const thumbPx = 28 + thumbSize * 14;

  const filtered = assets.filter((a) => {
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      activeFilter === "All" ||
      (activeFilter === "Scripts" && a.type === "script") ||
      (activeFilter === "Prefabs" && a.type === "prefab") ||
      (activeFilter === "Textures" && a.type === "texture") ||
      (activeFilter === "Meshes" && a.type === "mesh") ||
      (activeFilter === "Audio" && a.type === "audio");
    return matchSearch && matchFilter;
  });

  const selectedAsset = assets.find((a) => a.id === selected) || null;

  const toggleFav = (id: string) => {
    const next = new Set(favorites);
    if (next.has(id)) next.delete(id); else next.add(id);
    setFavorites(next);
  };

  return (
    <div className="flex h-full" style={{ background: "var(--unity-bg-panel)" }} onClick={() => setCtx(null)}>
      {/* Left folder tree */}
      <div className="w-32 flex flex-col shrink-0" style={{ borderRight: "1px solid var(--unity-border)", background: "var(--unity-bg-surface)" }}>
        <div className="px-2 py-1.5" style={{ borderBottom: "1px solid var(--unity-border)" }}>
          <span style={{ fontSize: "9px", fontWeight: 700, color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Favorites</span>
        </div>
        <div className="py-1">
          {["All Materials", "All Scripts", "All Prefabs"].map((f) => (
            <button key={f} className="w-full text-left px-2 py-1 flex items-center gap-1.5 transition-all" style={{ fontSize: "10px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--unity-bg-elevated)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              <Star size={9} style={{ color: "#fbbf24" }} />
              {f}
            </button>
          ))}
        </div>
        <div className="px-2 py-1.5" style={{ borderBottom: "1px solid var(--unity-border)", borderTop: "1px solid var(--unity-border)" }}>
          <span style={{ fontSize: "9px", fontWeight: 700, color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Assets</span>
        </div>
        <div className="flex-1 overflow-y-auto py-1" style={{ scrollbarWidth: "none" }}>
          {folders.map((f) => (
            <button key={f} onClick={() => setActiveFolder(f)} className="w-full text-left px-2 py-1 flex items-center gap-1.5 transition-all"
              style={{
                fontSize: "10px", fontFamily: "var(--font-family)",
                background: activeFolder === f ? "rgba(79,195,247,0.1)" : "transparent",
                color: activeFolder === f ? "var(--unity-accent)" : "var(--unity-text-secondary)",
                borderLeft: activeFolder === f ? "2px solid var(--unity-accent)" : "2px solid transparent",
              }}>
              {activeFolder === f ? <FolderOpen size={10} style={{ color: "#fbbf24" }} /> : <Folder size={10} style={{ color: "#fbbf24" }} />}
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-2 h-8 shrink-0" style={{ borderBottom: "1px solid var(--unity-border)", background: "var(--unity-bg-surface)" }}>
          <div className="flex items-center gap-0.5 mr-1">
            {["Project", "Library"].map((tab, i) => (
              <button key={tab} className="px-2 h-5 rounded-md transition-all" style={{ fontSize: "10px", fontFamily: "var(--font-family)", background: i === 0 ? "var(--unity-bg-elevated)" : "transparent", color: i === 0 ? "var(--unity-text-primary)" : "var(--unity-text-secondary)", fontWeight: i === 0 ? 600 : 400 }}>
                {tab}
              </button>
            ))}
          </div>
          <div style={{ width: "1px", height: "14px", background: "var(--unity-border)" }} />
          {/* Breadcrumb */}
          <div className="flex items-center gap-0.5" style={{ fontSize: "10px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)" }}>
            <button onClick={() => setActiveFolder("Assets")} style={{ color: activeFolder === "Assets" ? "var(--unity-text-primary)" : "var(--unity-text-secondary)" }}>Assets</button>
            {activeFolder !== "Assets" && (<><ChevronRight size={9} /><span style={{ color: "var(--unity-text-primary)" }}>{activeFolder}</span></>)}
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1 px-2 h-5 rounded-md" style={{ background: "var(--unity-bg-elevated)", border: "1px solid var(--unity-border)", minWidth: "120px" }}>
            <Search size={9} style={{ color: "var(--unity-text-secondary)", flexShrink: 0 }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="flex-1 bg-transparent outline-none" style={{ fontSize: "10px", color: "var(--unity-text-primary)", fontFamily: "var(--font-family)", minWidth: 0 }} />
            {search && <button onClick={() => setSearch("")}><X size={8} style={{ color: "var(--unity-text-secondary)" }} /></button>}
          </div>
          <button onClick={() => setShowPreview(!showPreview)} className="w-5 h-5 flex items-center justify-center rounded-md unity-press" style={{ color: showPreview ? "var(--unity-accent)" : "var(--unity-text-secondary)", background: showPreview ? "var(--unity-accent-soft)" : "transparent" }} title="Toggle preview">
            <SlidersHorizontal size={11} />
          </button>
          <div className="flex items-center" style={{ background: "var(--unity-bg-elevated)", borderRadius: "6px", border: "1px solid var(--unity-border)", overflow: "hidden" }}>
            {([["list", <List size={10} />], ["grid", <Grid size={10} />]] as const).map(([mode, icon]) => (
              <button key={mode} onClick={() => setViewMode(mode)} className="w-5 h-5 flex items-center justify-center transition-all" style={{ background: viewMode === mode ? "var(--unity-accent)" : "transparent", color: viewMode === mode ? "#0a0a0c" : "var(--unity-text-secondary)" }}>
                {icon}
              </button>
            ))}
          </div>
          <button className="w-5 h-5 flex items-center justify-center rounded-md unity-press" style={{ color: "var(--unity-accent)" }} title="Create asset"><Plus size={11} /></button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 px-2 py-1 shrink-0" style={{ borderBottom: "1px solid var(--unity-border)" }}>
          {filters.map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)} className="px-2 py-0.5 rounded-full transition-all unity-press" style={{ fontSize: "9px", fontFamily: "var(--font-family)", background: activeFilter === f ? "var(--unity-accent)" : "var(--unity-bg-elevated)", color: activeFilter === f ? "#0a0a0c" : "var(--unity-text-secondary)", border: "1px solid var(--unity-border)", fontWeight: activeFilter === f ? 600 : 400 }}>
              {f}
            </button>
          ))}
        </div>

        {/* Assets + preview drawer */}
        <div className="flex-1 flex min-h-0">
          <div className="flex-1 overflow-y-auto min-w-0" style={{ scrollbarWidth: "none" }}>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-2" style={{ color: "var(--unity-text-secondary)" }}>
                <Folder size={24} style={{ opacity: 0.4 }} />
                <span style={{ fontSize: "11px", fontFamily: "var(--font-family)" }}>No assets found</span>
              </div>
            ) : viewMode === "list" ? (
              <div>
                {filtered.map((asset) => {
                  const isSel = selected === asset.id;
                  return (
                    <div
                      key={asset.id}
                      onClick={() => setSelected(asset.id)}
                      onContextMenu={(e) => { e.preventDefault(); setSelected(asset.id); setCtx({ id: asset.id, x: e.clientX, y: e.clientY }); }}
                      className="flex items-center gap-2 px-3 h-7 cursor-pointer transition-all group"
                      style={{ background: isSel ? "var(--unity-accent-soft)" : "transparent", borderLeft: isSel ? "2px solid var(--unity-accent)" : "2px solid transparent" }}
                      onMouseEnter={(e) => { if (!isSel) e.currentTarget.style.background = "var(--unity-bg-elevated)"; }}
                      onMouseLeave={(e) => { if (!isSel) e.currentTarget.style.background = "transparent"; }}
                    >
                      <TypeIcon type={asset.type} size={12} />
                      <span className="flex-1 truncate" style={{ fontSize: "11px", color: isSel ? "var(--unity-accent)" : "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}>{asset.name}</span>
                      {asset.size && <span style={{ fontSize: "9px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-mono)" }}>{asset.size}</span>}
                      <button onClick={(e) => { e.stopPropagation(); toggleFav(asset.id); }} className="w-4 h-4 flex items-center justify-center transition-opacity" style={{ opacity: favorites.has(asset.id) ? 1 : undefined }}>
                        <Star size={9} className={favorites.has(asset.id) ? "" : "opacity-0 group-hover:opacity-100"} style={{ color: favorites.has(asset.id) ? "#fbbf24" : "var(--unity-text-secondary)", fill: favorites.has(asset.id) ? "#fbbf24" : "none" }} />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid p-2" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${thumbPx + 16}px, 1fr))`, gap: "8px" }}>
                {filtered.map((asset) => {
                  const isSel = selected === asset.id;
                  return (
                    <div
                      key={asset.id}
                      onClick={() => setSelected(asset.id)}
                      onContextMenu={(e) => { e.preventDefault(); setSelected(asset.id); setCtx({ id: asset.id, x: e.clientX, y: e.clientY }); }}
                      className="flex flex-col items-center gap-1 p-1.5 rounded-[8px] cursor-pointer transition-all relative group"
                      style={{ background: isSel ? "var(--unity-accent-soft)" : "transparent", boxShadow: isSel ? "inset 0 0 0 1px var(--unity-accent-glow)" : "none" }}
                      onMouseEnter={(e) => { if (!isSel) e.currentTarget.style.background = "var(--unity-bg-elevated)"; }}
                      onMouseLeave={(e) => { if (!isSel) e.currentTarget.style.background = "transparent"; }}
                    >
                      <div style={{ width: thumbPx, height: thumbPx }}>
                        {asset.type === "folder"
                          ? <div className="w-full h-full flex items-center justify-center"><Folder size={Math.round(thumbPx * 0.5)} color="#fbbf24" style={{ fill: "#fbbf2422" }} /></div>
                          : <Thumb type={asset.type} size={thumbPx} />}
                      </div>
                      <span className="text-center w-full truncate" style={{ fontSize: "9px", color: isSel ? "var(--unity-accent)" : "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}>{asset.name}</span>
                      {favorites.has(asset.id) && <Star size={8} className="absolute top-1 right-1" style={{ color: "#fbbf24", fill: "#fbbf24" }} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Preview / detail drawer */}
          {showPreview && selectedAsset && (
            <div className="w-44 shrink-0 flex flex-col unity-fade-in" style={{ borderLeft: "1px solid var(--unity-border)", background: "var(--unity-bg-surface)" }}>
              <div className="flex items-center justify-between px-2.5 h-7 shrink-0" style={{ borderBottom: "1px solid var(--unity-border)" }}>
                <span style={{ fontSize: "9px", fontWeight: 700, color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Preview</span>
                <button onClick={() => setShowPreview(false)}><X size={11} style={{ color: "var(--unity-text-secondary)" }} /></button>
              </div>
              <div className="p-3 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                <div className="w-full aspect-square mb-2.5">
                  {selectedAsset.type === "folder"
                    ? <div className="w-full h-full flex items-center justify-center rounded-lg" style={{ background: "var(--unity-bg-elevated)" }}><Folder size={48} color="#fbbf24" style={{ fill: "#fbbf2422" }} /></div>
                    : <Thumb type={selectedAsset.type} size={140} />}
                </div>
                <div className="flex items-center gap-1.5 mb-2">
                  <TypeIcon type={selectedAsset.type} size={13} />
                  <span className="truncate" style={{ fontSize: "12px", fontWeight: 600, color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}>{selectedAsset.name}</span>
                </div>
                {[
                  { icon: <Tag size={9} />, label: "Type", value: selectedAsset.type },
                  { icon: <HardDrive size={9} />, label: "Size", value: selectedAsset.size || "—" },
                  { icon: <Layers size={9} />, label: "Dims", value: selectedAsset.dims || "—" },
                  { icon: <Clock size={9} />, label: "Edited", value: selectedAsset.modified || "—" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-1.5 py-1" style={{ borderTop: "1px solid var(--unity-border)" }}>
                    <span style={{ color: "var(--unity-text-tertiary)" }}>{row.icon}</span>
                    <span style={{ fontSize: "9px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)", width: 36 }}>{row.label}</span>
                    <span className="flex-1 text-right truncate" style={{ fontSize: "9px", color: "var(--unity-text-primary)", fontFamily: "var(--font-mono)", textTransform: row.label === "Type" ? "capitalize" : "none" }}>{row.value}</span>
                  </div>
                ))}
                <button onClick={() => toggleFav(selectedAsset.id)} className="w-full flex items-center justify-center gap-1.5 mt-2.5 h-7 rounded-lg unity-press" style={{ background: favorites.has(selectedAsset.id) ? "rgba(251,191,36,0.12)" : "var(--unity-bg-elevated)", border: "1px solid var(--unity-border)", fontSize: "10px", color: favorites.has(selectedAsset.id) ? "#fbbf24" : "var(--unity-text-secondary)", fontFamily: "var(--font-family)" }}>
                  <Star size={10} style={{ fill: favorites.has(selectedAsset.id) ? "#fbbf24" : "none" }} />
                  {favorites.has(selectedAsset.id) ? "Favorited" : "Add to Favorites"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-2 h-5 shrink-0" style={{ borderTop: "1px solid var(--unity-border)", background: "var(--unity-bg-surface)" }}>
          <span style={{ fontSize: "9px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)" }}>
            {filtered.length} items{selected ? ` · ${selectedAsset?.name} selected` : ""}
          </span>
          <div className="flex items-center gap-1">
            <span style={{ fontSize: "9px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)" }}>Size:</span>
            <input type="range" min={1} max={5} value={thumbSize} onChange={(e) => setThumbSize(Number(e.target.value))} className="w-14 h-2" style={{ accentColor: "var(--unity-accent)" }} />
          </div>
        </div>
      </div>

      {/* Context menu */}
      {ctx && (
        <div className="fixed py-1.5 rounded-xl z-[100] min-w-[150px] unity-fade-in" style={{ left: ctx.x, top: ctx.y, background: "var(--unity-bg-elevated)", border: "1px solid var(--unity-border-strong)", boxShadow: "var(--unity-shadow-lg)" }} onClick={(e) => e.stopPropagation()}>
          {[
            { icon: <ExternalLink size={11} />, label: "Open" },
            { icon: <Copy size={11} />, label: "Duplicate" },
            { icon: <Star size={11} />, label: favorites.has(ctx.id) ? "Unfavorite" : "Favorite", action: () => toggleFav(ctx.id) },
            { icon: <Trash2 size={11} />, label: "Delete", danger: true },
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
