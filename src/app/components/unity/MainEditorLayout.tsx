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

      {/* Main 3-column layout — layered floating panels */}
      <div className="flex flex-1 min-h-0 gap-1.5 px-1.5 pt-1.5">
        {/* Left panel: Hierarchy + Project */}
        <div className="flex flex-col shrink-0 gap-1.5" style={{ width: "242px" }}>
          {/* Hierarchy - top 55% */}
          <div style={{ flex: "0 0 55%", overflow: "hidden", borderRadius: "10px", border: "1px solid var(--unity-border)", boxShadow: "var(--unity-shadow)" }}>
            <HierarchyPanel />
          </div>
          {/* Project - bottom 45% */}
          <div style={{ flex: 1, overflow: "hidden", borderRadius: "10px", border: "1px solid var(--unity-border)", boxShadow: "var(--unity-shadow)" }}>
            <ProjectWindow />
          </div>
        </div>

        {/* Center: Scene View */}
        <div className="flex-1 min-w-0" style={{ overflow: "hidden", borderRadius: "10px", border: "1px solid var(--unity-border)", boxShadow: "var(--unity-shadow)" }}>
          <SceneView isPlaying={isPlaying} />
        </div>

        {/* Right: Inspector */}
        <div
          className="flex flex-col shrink-0 overflow-hidden"
          style={{ width: "282px", borderRadius: "10px", border: "1px solid var(--unity-border)", boxShadow: "var(--unity-shadow)" }}
        >
          <InspectorPanel />
        </div>
      </div>

      {/* Bottom: Console + status */}
      <div
        style={{
          height: "150px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        className="gap-1.5 px-1.5 py-1.5"
      >
        <div style={{ flex: 1, overflow: "hidden", borderRadius: "10px", border: "1px solid var(--unity-border)", boxShadow: "var(--unity-shadow)" }}>
          <ConsolePanel />
        </div>
      </div>
      <BottomStatusBar />
    </div>
  );
}
