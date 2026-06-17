import { TopMenuBar } from "../TopMenuBar";
import { ConsolePanel } from "../ConsolePanel";
import { BottomStatusBar } from "../BottomStatusBar";

export function FocusedConsoleScreen() {
  return (
    <div className="flex flex-col w-full h-full" style={{ background: "var(--unity-bg-base)" }}>
      <TopMenuBar />
      <div className="flex-1 overflow-hidden">
        <ConsolePanel />
      </div>
      <BottomStatusBar />
    </div>
  );
}
