import { useState } from "react";
import { Search, Plus, Filter, ChevronRight, ChevronDown as ChevronDownIcon, Camera, Sun, Mountain, Box, Globe, Layers, Eye, EyeOff } from "lucide-react";

interface HierarchyNode {
  id: string;
  name: string;
  type: "scene" | "camera" | "light" | "terrain" | "gameobject" | "prefab" | "ui" | "folder";
  children?: HierarchyNode[];
  isPrefab?: boolean;
  isActive?: boolean;
  tag?: string;
}

const hierarchyData: HierarchyNode[] = [
  {
    id: "scene", name: "SampleScene", type: "scene", isActive: true,
    children: [
      { id: "cameras", name: "Cameras", type: "folder",
        children: [
          { id: "main-camera", name: "Main Camera", type: "camera", isActive: true, tag: "MainCamera" },
          { id: "cutscene-cam", name: "CutsceneCamera", type: "camera" },
          { id: "dynamic-cams", name: "Dynamic Cameras", type: "folder",
            children: [
              { id: "cam1", name: "FollowCam_01", type: "camera", isPrefab: true },
              { id: "cam2", name: "OrbitCam_02", type: "camera", isPrefab: true },
            ]
          },
        ]
      },
      {
        id: "managers", name: "Managers", type: "folder",
        children: [
          { id: "gamemanager", name: "GameManager", type: "prefab", isPrefab: true },
          { id: "player", name: "Player", type: "prefab", isPrefab: true },
          {
            id: "level", name: "Level", type: "folder",
            children: [
              {
                id: "environment", name: "Environment", type: "folder",
                children: [
                  { id: "terrain", name: "Terrain", type: "terrain", isActive: true },
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

const TypeIcon = ({ type }: { type: string }) => {
  const props = { size: 11, color: typeColor[type] || "var(--unity-text-secondary)" };
  switch (type) {
    case "camera": return <Camera {...props} />;
    case "light": return <Sun {...props} />;
    case "terrain": return <Mountain {...props} />;
    case "prefab": return <Box {...props} style={{ color: "var(--unity-prefab)" }} />;
    case "scene": return <Globe {...props} />;
    case "folder": return <Layers {...props} />;
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
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selected === node.id;

  return (
    <div>
      <div
        className="group flex items-center gap-0.5 h-6 pr-2 cursor-pointer transition-all relative"
        style={{
          paddingLeft: `${8 + depth * 14}px`,
          background: isSelected ? "rgba(79,195,247,0.12)" : "transparent",
          borderLeft: isSelected ? "2px solid var(--unity-accent)" : "2px solid transparent",
        }}
        onClick={() => onSelect(node.id)}
        onMouseEnter={(e) => {
          if (!isSelected) e.currentTarget.style.background = "var(--unity-bg-elevated)";
        }}
        onMouseLeave={(e) => {
          if (!isSelected) e.currentTarget.style.background = "transparent";
        }}
      >
        {hasChildren ? (
          <button
            className="w-4 h-4 flex items-center justify-center shrink-0 transition-transform"
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            style={{ color: "var(--unity-text-tertiary)" }}
          >
            {expanded
              ? <ChevronDownIcon size={10} style={{ color: "var(--unity-text-secondary)" }} />
              : <ChevronRight size={10} style={{ color: "var(--unity-text-secondary)" }} />
            }
          </button>
        ) : (
          <span className="w-4 shrink-0" />
        )}

        <span className="shrink-0 mr-1">
          <TypeIcon type={node.isPrefab ? "prefab" : node.type} />
        </span>

        <span
          className="truncate flex-1"
          style={{
            fontSize: "12px",
            fontFamily: "var(--font-family)",
            color: node.isPrefab
              ? "var(--unity-prefab)"
              : node.type === "scene"
              ? "var(--unity-text-primary)"
              : isSelected
              ? "var(--unity-accent)"
              : "var(--unity-text-primary)",
            fontWeight: node.type === "scene" || node.type === "folder" ? 500 : 400,
            opacity: node.isActive === false ? 0.45 : 1,
          }}
        >
          {node.name}
          {node.tag && (
            <span className="ml-1.5" style={{ fontSize: "9px", color: "var(--unity-accent)", opacity: 0.7 }}>
              {node.tag}
            </span>
          )}
        </span>

        <button
          className="w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0"
          style={{ color: "var(--unity-text-secondary)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <Eye size={10} />
        </button>
      </div>

      {hasChildren && expanded && (
        <div>
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
        className="flex items-center justify-between px-3 h-8 shrink-0"
        style={{ borderBottom: "1px solid var(--unity-border)", background: "var(--unity-bg-surface)" }}
      >
        <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--unity-text-primary)", fontFamily: "var(--font-family)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Hierarchy
        </span>
        <div className="flex items-center gap-1">
          <button
            className="w-6 h-6 rounded-md flex items-center justify-center transition-all"
            style={{ color: "var(--unity-text-secondary)", background: "transparent" }}
            title="Filter"
          >
            <Filter size={11} />
          </button>
          <button
            className="w-6 h-6 rounded-md flex items-center justify-center transition-all"
            style={{ color: "var(--unity-accent)", background: "rgba(79,195,247,0.1)" }}
            title="Create"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-2 py-1.5 shrink-0" style={{ borderBottom: "1px solid var(--unity-border)" }}>
        <div
          className="flex items-center gap-2 px-2 h-6 rounded-lg"
          style={{ background: "var(--unity-bg-surface)", border: "1px solid var(--unity-border)" }}
        >
          <Search size={10} style={{ color: "var(--unity-text-secondary)", flexShrink: 0 }} />
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
      <div className="flex items-center gap-1 px-2 py-1 shrink-0" style={{ borderBottom: "1px solid var(--unity-border)" }}>
        {["All", "Static", "Prefabs"].map((f, i) => (
          <button
            key={f}
            className="px-2 py-0.5 rounded-full transition-all"
            style={{
              fontSize: "10px",
              fontFamily: "var(--font-family)",
              background: i === 0 ? "var(--unity-accent)" : "var(--unity-bg-surface)",
              color: i === 0 ? "#0a0a0c" : "var(--unity-text-secondary)",
              border: "1px solid var(--unity-border)",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto py-1" style={{ scrollbarWidth: "none" }}>
        {hierarchyData.map((node) => (
          <HierarchyItem key={node.id} node={node} depth={0} selected={selected} onSelect={setSelected} />
        ))}
      </div>
    </div>
  );
}
