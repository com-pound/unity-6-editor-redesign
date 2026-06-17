import { TopMenuBar } from "../TopMenuBar";
import { ProjectWindow } from "../ProjectWindow";
import { BottomStatusBar } from "../BottomStatusBar";

export function FocusedProjectScreen() {
  return (
    <div className="flex flex-col w-full h-full" style={{ background: "var(--unity-bg-base)" }}>
      <TopMenuBar />
      <div className="flex-1 overflow-hidden">
        <ProjectWindow />
      </div>
      <BottomStatusBar />
    </div>
  );
}
