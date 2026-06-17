import { useState } from "react";
import { TopMenuBar } from "./TopMenuBar";
import { MainToolbar } from "./MainToolbar";
import { HierarchyPanel } from "./HierarchyPanel";
import { SceneView } from "./SceneView";
import { InspectorPanel } from "./InspectorPanel";
import { ProjectWindow } from "./ProjectWindow";
import { ConsolePanel } from "./ConsolePanel";
import { BottomStatusBar } from "./BottomStatusBar";
import { CommandPalette } from "./CommandPalette";

interface MainEditorLayoutProps {
  theme?: "dark" | "light" | "oled";
}

export function MainEditorLayout({ theme = "dark" }: MainEditorLayoutProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  return (
    <div
      className="flex flex-col w-full h-full overflow-hidden"
      style={{ background: "var(--unity-bg-base)", fontFamily: "var(--font-family)" }}
    >
      {cmdOpen && <CommandPalette onClose={() => setCmdOpen(false)} />}

      <TopMenuBar />
      <MainToolbar isPlaying={isPlaying} onPlayToggle={() => setIsPlaying(!isPlaying)} onCommandPalette={() => setCmdOpen(true)} />

      {/* Main 3-column layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left panel: Hierarchy + Project */}
        <div
          className="flex flex-col shrink-0"
          style={{ width: "230px", borderRight: "1px solid var(--unity-border)" }}
        >
          {/* Hierarchy - top 55% */}
          <div style={{ flex: "0 0 55%", borderBottom: "1px solid var(--unity-border)", overflow: "hidden" }}>
            <HierarchyPanel />
          </div>
          {/* Project - bottom 45% */}
          <div style={{ flex: 1, overflow: "hidden" }}>
            <ProjectWindow />
          </div>
        </div>

        {/* Center: Scene View */}
        <div className="flex-1 min-w-0">
          <SceneView isPlaying={isPlaying} />
        </div>

        {/* Right: Inspector */}
        <div
          className="flex flex-col shrink-0 overflow-hidden"
          style={{ width: "270px", borderLeft: "1px solid var(--unity-border)" }}
        >
          <InspectorPanel />
        </div>
      </div>

      {/* Bottom: Console + status */}
      <div
        style={{
          height: "140px",
          borderTop: "1px solid var(--unity-border)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div style={{ flex: 1, overflow: "hidden" }}>
          <ConsolePanel />
        </div>
        <BottomStatusBar />
      </div>
    </div>
  );
}
