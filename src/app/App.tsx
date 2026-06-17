import { useState, useEffect } from "react";
import { ScreenSwitcher } from "./components/unity/ScreenSwitcher";
import { MainEditorLayout } from "./components/unity/MainEditorLayout";
import { FocusedSceneScreen } from "./components/unity/screens/FocusedSceneScreen";
import { FocusedInspectorScreen } from "./components/unity/screens/FocusedInspectorScreen";
import { FocusedHierarchyScreen } from "./components/unity/screens/FocusedHierarchyScreen";
import { FocusedProjectScreen } from "./components/unity/screens/FocusedProjectScreen";
import { FocusedConsoleScreen } from "./components/unity/screens/FocusedConsoleScreen";
import { BuildSettingsScreen } from "./components/unity/screens/BuildSettingsScreen";
import { PackageManagerScreen } from "./components/unity/screens/PackageManagerScreen";

/* MARKER-MAKE-KIT-INVOKED */

export default function App() {
  const [screen, setScreen] = useState(0);

  useEffect(() => {
    applyTheme(screen);
  }, [screen]);

  // Apply dark mode on initial load
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="size-full flex items-center justify-center overflow-hidden" style={{ background: "#000" }}>
      <div className="w-full h-full relative overflow-hidden" style={{ fontFamily: "var(--font-family)" }}>
        <ScreenContent screen={screen} />
        <ScreenSwitcher current={screen} onChange={setScreen} />
      </div>
    </div>
  );
}

function applyTheme(screen: number) {
  const root = document.documentElement;
  // Remove previous theme classes
  root.classList.remove("dark", "oled-dark");
  // Screens 0–7 use dark, screen 8 uses light (no class), screen 9 uses oled-dark
  if (screen === 8) {
    // light mode — no class needed, :root is light
  } else if (screen === 9) {
    root.classList.add("dark", "oled-dark");
  } else {
    root.classList.add("dark");
  }
}

function ScreenContent({ screen }: { screen: number }) {
  switch (screen) {
    case 0: return <MainEditorLayout />;
    case 1: return <FocusedSceneScreen />;
    case 2: return <FocusedInspectorScreen />;
    case 3: return <FocusedHierarchyScreen />;
    case 4: return <FocusedProjectScreen />;
    case 5: return <FocusedConsoleScreen />;
    case 6: return <BuildSettingsScreen />;
    case 7: return <PackageManagerScreen />;
    case 8: return <MainEditorLayout theme="light" />;
    case 9: return <MainEditorLayout theme="oled" />;
    default: return <MainEditorLayout />;
  }
}
