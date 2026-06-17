export type Severity = "error" | "warning" | "info";

export interface LogEntry {
  id: string;
  severity: Severity;
  message: string;
  source: string;
  count: number;
  stack?: string[];
  timestamp: string;
}

export const initialLogs: LogEntry[] = [
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

export function countBySeverity(logs: LogEntry[]) {
  return {
    error: logs.filter((l) => l.severity === "error").reduce((a, b) => a + b.count, 0),
    warning: logs.filter((l) => l.severity === "warning").reduce((a, b) => a + b.count, 0),
    info: logs.filter((l) => l.severity === "info").reduce((a, b) => a + b.count, 0),
  };
}

export const severityColor: Record<Severity, string> = {
  error: "#f87171",
  warning: "#fbbf24",
  info: "var(--unity-text-secondary)",
};
