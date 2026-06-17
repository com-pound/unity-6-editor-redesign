import { useState } from "react";
import { Search, Plus, Filter, ChevronRight, ChevronDown as ChevronDownIcon, Camera, Sun, Mountain, Box, Globe, Folder, Eye, EyeOff, Lock } from "lucide-react";

interface HierarchyNode {
  id: string;
  name: string;
  type: "scene" | "camera" | "light" | "terrain" | "gameobject" | "prefab" | "ui" | "folder";
  children?: HierarchyNode[];
  isPrefab?: boolean;
  isActive?: boolean;
  tag?: string;
  folderColor?: string;
  recent?: boolean;
}

const hierarchyData: HierarchyNode[] = [
  {
    id: "scene", name: "SampleScene", type: "scene", isActive: true,
    children: [
      { id: "cameras", name: "Cameras", type: "folder", folderColor: "#60a5fa",
        children: [
          { id: "main-camera", name: "Main Camera", type: "camera", isActive: true, tag: "MainCamera", recent: true },
          { id: "cutscene-cam", name: "CutsceneCamera", type: "camera" },
          { id: "dynamic-cams", name: "Dynamic Cameras", type: "folder", folderColor: "#60a5fa",
            children: [
              { id: "cam1", name: "FollowCam_01", type: "camera", isPrefab: true },
              { id: "cam2", name: "OrbitCam_02", type: "camera", isPrefab: true },
            ]
          },
        ]
      },
      {
        id: "managers", name: "Managers", type: "folder", folderColor: "#fbbf24",
        children: [
          { id: "gamemanager", name: "GameManager", type: "prefab", isPrefab: true },
          { id: "player", name: "Player", type: "prefab", isPrefab: true, recent: true },
          {
            id: "level", name: "Level", type: "folder", folderColor: "#4ade80",
            children: [
              {
                id: "environment", name: "Environment", type: "folder", folderColor: "#4ade80",
                children: [
                  { id: "terrain", name: "Terrain", type: "terrain", isActive: true, recent: true },
                  { id: "terrain2", name: "Terrain (1)", type: "terrain" },
                  {
                    id: "buildings", name: "Buildings", type: "folder",
                    children: [
                      { id: "b1", name: "House_A", type: "prefab", isPrefab: true },
                      { id: "b2", name: "House_B", type: "prefab", isPrefab: true },
                      { id: "b3", name: "Tower", type: "prefab", isPrefab: true },
                    ]
                  },
                  { id: "dynamic-objs", name: "Dynamic Objects", type: "gameobject" },
                  { id: "skybox", name: "Dynamic Skybox", type: "prefab", isPrefab: true },
                  { id: "trigger", name: "Trigger Volumes", type: "gameobject" },
                ]
              }
            ]
          }
        ]
      },
    ]
  }
];

const typeColor: Record<string, string> = {
  camera: "var(--unity-camera)",
  light: "var(--unity-light)",
  terrain: "var(--unity-terrain)",
  prefab: "var(--unity-prefab)",
  ui: "var(--unity-ui)",
  scene: "var(--unity-accent)",
  folder: "var(--unity-text-secondary)",
  gameobject: "var(--unity-text-secondary)",
};

const TypeIcon = ({ type, folderColor }: { type: string; folderColor?: string }) => {
  const props = { size: 12, color: typeColor[type] || "var(--unity-text-secondary)" };
  switch (type) {
    case "camera": return <Camera {...props} />;
    case "light": return <Sun {...props} />;
    case "terrain": return <Mountain {...props} />;
    case "prefab": return <Box {...props} style={{ color: "var(--unity-prefab)" }} />;
    case "scene": return <Globe {...props} />;
    case "folder": return <Folder size={12} color={folderColor || "var(--unity-text-secondary)"} style={{ fill: folderColor ? `${folderColor}22` : "transparent" }} />;
    default: return <Box {...props} />;
  }
};

function HierarchyItem({
  node, depth, selected, onSelect,
}: {
  node: HierarchyNode;
  depth: number;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 2);
  const [visible, setVisible] = useState(node.isActive !== false);
  const [locked, setLocked] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selected === node.id;

  return (
    <div>
      <div
        className="group flex items-center gap-0.5 h-7 pr-1.5 cursor-pointer transition-all relative"
        style={{
          paddingLeft: `${8 + depth * 15}px`,
          background: isSelected ? "var(--unity-accent-soft)" : "transparent",
          borderRadius: "7px",
          margin: "1px 6px",
          boxShadow: isSelected ? "inset 0 0 0 1px var(--unity-accent-glow)" : "none",
        }}
        onClick={() => onSelect(node.id)}
        onMouseEnter={(e) => {
          if (!isSelected) e.currentTarget.style.background = "var(--unity-bg-hover)";
        }}
        onMouseLeave={(e) => {
          if (!isSelected) e.currentTarget.style.background = "transparent";
        }}
      >
        {/* Nesting guide line */}
        {depth > 0 && (
          <span
            className="absolute top-0 bottom-0"
            style={{ left: `${8 + (depth - 1) * 15 + 7}px`, width: "1px", background: "var(--unity-border)" }}
          />
        )}

        {hasChildren ? (
          <button
            className="w-4 h-4 flex items-center justify-center shrink-0"
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            style={{ color: "var(--unity-text-tertiary)", transition: "transform 0.15s ease", transform: expanded ? "rotate(0deg)" : "rotate(0deg)" }}
          >
            {expanded
              ? <ChevronDownIcon size={11} style={{ color: "var(--unity-text-secondary)" }} />
              : <ChevronRight size={11} style={{ color: "var(--unity-text-secondary)" }} />
            }
          </button>
        ) : (
          <span className="w-4 shrink-0" />
        )}

        <span className="shrink-0 mr-1 flex items-center justify-center">
          <TypeIcon type={node.isPrefab ? "prefab" : node.type} folderColor={node.folderColor} />
        </span>

        <span
          className="truncate flex-1 flex items-center gap-1.5"
          style={{
            fontSize: "12px",
            fontFamily: "var(--font-family)",
            color: node.isPrefab
              ? "var(--unity-prefab)"
              : node.type === "scene"
              ? "var(--unity-text-primary)"
              : isSelected
              ? "var(--unity-text-primary)"
              : "var(--unity-text-primary)",
            fontWeight: node.type === "scene" || node.type === "folder" ? 600 : 400,
            opacity: visible ? 1 : 0.4,
          }}
        >
          <span className="truncate">{node.name}</span>
          {node.recent && (
            <span title="Recently edited" style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--unity-accent)", flexShrink: 0 }} />
          )}
          {node.isPrefab && (
            <span
              className="shrink-0 px-1 rounded"
              style={{ fontSize: "8px", fontWeight: 700, color: "var(--unity-prefab)", background: "rgba(125,211,252,0.12)", fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}
            >
              PREFAB
            </span>
          )}
          {node.tag && (
            <span className="shrink-0" style={{ fontSize: "9px", color: "var(--unity-text-tertiary)" }}>
              {node.tag}
            </span>
          )}
        </span>

        {/* Hover controls: lock + visibility */}
        <div className="flex items-center gap-0.5 ml-auto shrink-0">
          <button
            className={`w-5 h-5 flex items-center justify-center rounded transition-opacity ${locked ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
            style={{ color: locked ? "var(--unity-accent)" : "var(--unity-text-tertiary)" }}
            onClick={(e) => { e.stopPropagation(); setLocked(!locked); }}
          >
            <Lock size={10} />
          </button>
          <button
            className={`w-5 h-5 flex items-center justify-center rounded transition-opacity ${!visible ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
            style={{ color: "var(--unity-text-secondary)" }}
            onClick={(e) => { e.stopPropagation(); setVisible(!visible); }}
          >
            {visible ? <Eye size={10} /> : <EyeOff size={10} />}
          </button>
        </div>
      </div>

      {hasChildren && expanded && (
        <div className="unity-expand">
          {node.children!.map((child) => (
            <HierarchyItem key={child.id} node={child} depth={depth + 1} selected={selected} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

export function HierarchyPanel() {
  const [selected, setSelected] = useState<string | null>("terrain");
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--unity-bg-panel)" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 h-9 shrink-0"
        style={{ borderBottom: "1px solid var(--unity-border)", background: "var(--unity-bg-surface)" }}
      >
        <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--unity-text-primary)", fontFamily: "var(--font-family)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Outliner
        </span>
        <div className="flex items-center gap-1">
          <button
            className="w-6 h-6 rounded-md flex items-center justify-center unity-press"
            style={{ color: "var(--unity-text-secondary)", background: "transparent" }}
            title="Filter"
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--unity-bg-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Filter size={12} />
          </button>
          <button
            className="w-6 h-6 rounded-md flex items-center justify-center unity-press"
            style={{ color: "var(--unity-accent)", background: "var(--unity-accent-soft)" }}
            title="Create"
          >
            <Plus size={13} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-2 py-2 shrink-0">
        <div
          className="flex items-center gap-2 px-2.5 h-7 rounded-lg"
          style={{ background: "var(--unity-bg-surface)", border: "1px solid var(--unity-border)" }}
        >
          <Search size={11} style={{ color: "var(--unity-text-secondary)", flexShrink: 0 }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hierarchy..."
            className="flex-1 bg-transparent outline-none"
            style={{ fontSize: "11px", color: "var(--unity-text-primary)", fontFamily: "var(--font-family)" }}
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-1 px-2 pb-2 shrink-0">
        {["All", "Static", "Prefabs", "Lights"].map((f, i) => (
          <button
            key={f}
            className="px-2 py-0.5 rounded-md unity-press"
            style={{
              fontSize: "10px",
              fontFamily: "var(--font-family)",
              fontWeight: i === 0 ? 600 : 400,
              background: i === 0 ? "var(--unity-accent-soft)" : "transparent",
              color: i === 0 ? "var(--unity-accent)" : "var(--unity-text-secondary)",
              border: i === 0 ? "1px solid var(--unity-accent-glow)" : "1px solid var(--unity-border)",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {hierarchyData.map((node) => (
          <HierarchyItem key={node.id} node={node} depth={0} selected={selected} onSelect={setSelected} />
        ))}
      </div>
    </div>
  );
}
