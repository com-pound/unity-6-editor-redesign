import { useState } from "react";
import {
  Search, Grid, List, Star, Filter, ChevronRight,
  Folder, FolderOpen, Image, Box, Music, FileText,
  Code, Layers, Plus, ChevronDown, SlidersHorizontal
} from "lucide-react";

interface Asset {
  id: string;
  name: string;
  type: "folder" | "texture" | "mesh" | "audio" | "script" | "material" | "prefab" | "scene";
  size?: string;
  modified?: string;
  favorite?: boolean;
  thumbnail?: string;
}

const assets: Asset[] = [
  { id: "f1", name: "Audio", type: "folder" },
  { id: "f2", name: "Managers", type: "folder" },
  { id: "f3", name: "Prefabs", type: "folder" },
  { id: "f4", name: "Resources", type: "folder" },
  { id: "f5", name: "Save Data", type: "folder" },
  { id: "f6", name: "Scenes", type: "folder" },
  { id: "f7", name: "Scripts", type: "folder" },
  { id: "f8", name: "Visual Assets", type: "folder" },
  { id: "f9", name: "Packages", type: "folder" },
  { id: "a1", name: "TerrainTex_01", type: "texture", size: "4.2 MB", favorite: true },
  { id: "a2", name: "TerrainTex_02", type: "texture", size: "3.8 MB" },
  { id: "a3", name: "Rock_A", type: "mesh", size: "1.1 MB" },
  { id: "a4", name: "Tree_Pine", type: "prefab", size: "320 KB", favorite: true },
  { id: "a5", name: "GameManager", type: "script", size: "8 KB" },
  { id: "a6", name: "PlayerController", type: "script", size: "12 KB" },
  { id: "a7", name: "TerrainMat", type: "material", size: "2 KB" },
  { id: "a8", name: "Ambient_Forest", type: "audio", size: "8.4 MB" },
  { id: "a9", name: "SampleScene", type: "scene", size: "420 KB" },
  { id: "a10", name: "UI_Atlas", type: "texture", size: "6.1 MB" },
  { id: "a11", name: "EnemyAI", type: "script", size: "18 KB" },
  { id: "a12", name: "Player_Rig", type: "mesh", size: "2.4 MB", favorite: true },
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

const folders = ["Assets", "Audio", "Prefabs", "Scenes", "Scripts", "Visual Assets"];

export function ProjectWindow() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [search, setSearch] = useState("");
  const [activeFolder, setActiveFolder] = useState("Assets");
  const [favorites, setFavorites] = useState<Set<string>>(new Set(["a1", "a4", "a12"]));
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Scripts", "Prefabs", "Textures", "Meshes", "Audio"];

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

  return (
    <div className="flex h-full" style={{ background: "var(--unity-bg-panel)" }}>
      {/* Left folder tree */}
      <div className="w-32 flex flex-col shrink-0" style={{ borderRight: "1px solid var(--unity-border)", background: "var(--unity-bg-surface)" }}>
        <div className="px-2 py-1.5" style={{ borderBottom: "1px solid var(--unity-border)" }}>
          <span style={{ fontSize: "9px", fontWeight: 700, color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Favorites
          </span>
        </div>
        <div className="py-1">
          {["All Materials", "All Scripts", "All Prefabs"].map((f) => (
            <button
              key={f}
              className="w-full text-left px-2 py-1 flex items-center gap-1.5 transition-all"
              style={{ fontSize: "10px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--unity-bg-elevated)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Star size={9} style={{ color: "#fbbf24" }} />
              {f}
            </button>
          ))}
        </div>
        <div className="px-2 py-1.5" style={{ borderBottom: "1px solid var(--unity-border)", borderTop: "1px solid var(--unity-border)" }}>
          <span style={{ fontSize: "9px", fontWeight: 700, color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Assets
          </span>
        </div>
        <div className="flex-1 overflow-y-auto py-1" style={{ scrollbarWidth: "none" }}>
          {folders.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFolder(f)}
              className="w-full text-left px-2 py-1 flex items-center gap-1.5 transition-all"
              style={{
                fontSize: "10px",
                fontFamily: "var(--font-family)",
                background: activeFolder === f ? "rgba(79,195,247,0.1)" : "transparent",
                color: activeFolder === f ? "var(--unity-accent)" : "var(--unity-text-secondary)",
                borderLeft: activeFolder === f ? "2px solid var(--unity-accent)" : "2px solid transparent",
              }}
            >
              {activeFolder === f ? <FolderOpen size={10} style={{ color: "#fbbf24" }} /> : <Folder size={10} style={{ color: "#fbbf24" }} />}
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Toolbar */}
        <div
          className="flex items-center gap-2 px-2 h-8 shrink-0"
          style={{ borderBottom: "1px solid var(--unity-border)", background: "var(--unity-bg-surface)" }}
        >
          {/* Tab bar */}
          <div className="flex items-center gap-0.5 mr-1">
            {["Project", "Library"].map((tab, i) => (
              <button
                key={tab}
                className="px-2 h-5 rounded-md transition-all"
                style={{
                  fontSize: "10px",
                  fontFamily: "var(--font-family)",
                  background: i === 0 ? "var(--unity-bg-elevated)" : "transparent",
                  color: i === 0 ? "var(--unity-text-primary)" : "var(--unity-text-secondary)",
                  fontWeight: i === 0 ? 600 : 400,
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ width: "1px", height: "14px", background: "var(--unity-border)" }} />

          {/* Breadcrumb */}
          <div className="flex items-center gap-0.5" style={{ fontSize: "10px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)" }}>
            <span>Assets</span>
            {activeFolder !== "Assets" && (
              <>
                <ChevronRight size={9} />
                <span style={{ color: "var(--unity-text-primary)" }}>{activeFolder}</span>
              </>
            )}
          </div>

          <div className="flex-1" />

          {/* Search */}
          <div
            className="flex items-center gap-1 px-2 h-5 rounded-md"
            style={{ background: "var(--unity-bg-elevated)", border: "1px solid var(--unity-border)", minWidth: "120px" }}
          >
            <Search size={9} style={{ color: "var(--unity-text-secondary)", flexShrink: 0 }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-transparent outline-none"
              style={{ fontSize: "10px", color: "var(--unity-text-primary)", fontFamily: "var(--font-family)", minWidth: 0 }}
            />
          </div>

          <button className="w-5 h-5 flex items-center justify-center rounded-md" style={{ color: "var(--unity-text-secondary)" }}>
            <SlidersHorizontal size={11} />
          </button>

          {/* View toggle */}
          <div className="flex items-center" style={{ background: "var(--unity-bg-elevated)", borderRadius: "6px", border: "1px solid var(--unity-border)", overflow: "hidden" }}>
            {([["list", <List size={10} />], ["grid", <Grid size={10} />]] as const).map(([mode, icon]) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className="w-5 h-5 flex items-center justify-center transition-all"
                style={{
                  background: viewMode === mode ? "var(--unity-accent)" : "transparent",
                  color: viewMode === mode ? "#0a0a0c" : "var(--unity-text-secondary)",
                }}
              >
                {icon}
              </button>
            ))}
          </div>

          <button className="w-5 h-5 flex items-center justify-center rounded-md" style={{ color: "var(--unity-accent)" }}>
            <Plus size={11} />
          </button>
        </div>

        {/* Filters */}
        <div
          className="flex items-center gap-1 px-2 py-1 shrink-0"
          style={{ borderBottom: "1px solid var(--unity-border)" }}
        >
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-2 py-0.5 rounded-full transition-all"
              style={{
                fontSize: "9px",
                fontFamily: "var(--font-family)",
                background: activeFilter === f ? "var(--unity-accent)" : "var(--unity-bg-elevated)",
                color: activeFilter === f ? "#0a0a0c" : "var(--unity-text-secondary)",
                border: "1px solid var(--unity-border)",
                fontWeight: activeFilter === f ? 600 : 400,
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Assets */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {viewMode === "list" ? (
            <div>
              {filtered.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center gap-2 px-3 h-7 cursor-pointer transition-all group"
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--unity-bg-elevated)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <TypeIcon type={asset.type} size={12} />
                  <span className="flex-1 truncate" style={{ fontSize: "11px", color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}>
                    {asset.name}
                  </span>
                  {asset.size && (
                    <span style={{ fontSize: "9px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-mono)" }}>
                      {asset.size}
                    </span>
                  )}
                  <button
                    onClick={() => {
                      const next = new Set(favorites);
                      if (next.has(asset.id)) next.delete(asset.id); else next.add(asset.id);
                      setFavorites(next);
                    }}
                    className="w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Star size={9} style={{ color: favorites.has(asset.id) ? "#fbbf24" : "var(--unity-text-secondary)", fill: favorites.has(asset.id) ? "#fbbf24" : "none" }} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid p-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))", gap: "8px" }}>
              {filtered.map((asset) => (
                <div
                  key={asset.id}
                  className="flex flex-col items-center gap-1 p-1.5 rounded-[8px] cursor-pointer transition-all"
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--unity-bg-elevated)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div
                    className="w-10 h-10 rounded-[6px] flex items-center justify-center"
                    style={{ background: "var(--unity-bg-elevated)", border: "1px solid var(--unity-border)" }}
                  >
                    <TypeIcon type={asset.type} size={20} />
                  </div>
                  <span className="text-center w-full truncate" style={{ fontSize: "9px", color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}>
                    {asset.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-2 h-5 shrink-0" style={{ borderTop: "1px solid var(--unity-border)", background: "var(--unity-bg-surface)" }}>
          <span style={{ fontSize: "9px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-font-family)" }}>
            {filtered.length} items
          </span>
          <div className="flex items-center gap-1">
            <span style={{ fontSize: "9px", color: "var(--unity-text-secondary)", fontFamily: "var(--font-family)" }}>Size:</span>
            <input type="range" min={1} max={5} defaultValue={2} className="w-14 h-2" style={{ accentColor: "var(--unity-accent)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
