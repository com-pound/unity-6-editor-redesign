import { TopMenuBar } from "../TopMenuBar";
import { MainToolbar } from "../MainToolbar";
import { SceneView } from "../SceneView";
import { BottomStatusBar } from "../BottomStatusBar";
import { useState } from "react";
import { CommandPalette } from "../CommandPalette";

export function FocusedSceneScreen() {
  const [playing, setPlaying] = useState(false);
  const [cmd, setCmd] = useState(false);
  return (
    <div className="flex flex-col w-full h-full" style={{ background: "var(--unity-bg-base)" }}>
      {cmd && <CommandPalette onClose={() => setCmd(false)} />}
      <TopMenuBar />
      <MainToolbar isPlaying={playing} onPlayToggle={() => setPlaying(!playing)} onCommandPalette={() => setCmd(true)} />
      <div className="flex-1 overflow-hidden">
        <SceneView isPlaying={playing} />
      </div>
      <BottomStatusBar />
    </div>
  );
}
