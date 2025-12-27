import { useEffect } from "react";
import Desktop from "./components/Desktop";
import Taskbar from "./components/Taskbar";
import WindowManager from "./components/WindowManager";
import ContextMenu from "./components/ContextMenu";
import LockScreen from "./components/LockScreen";
import { useOSStore } from "./store/osStore";

const App = () => {
  const { isLocked, bootOS, settings } = useOSStore();

  useEffect(() => {
    bootOS();
  }, [bootOS]);

  // Apply theme to body
  useEffect(() => {
    if (settings.theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [settings.theme]);

  if (isLocked) {
    return <LockScreen />;
  }

  return (
    <div className={`w-full h-full overflow-hidden relative ${settings.theme === 'light' ? 'bg-gray-100' : ''}`}>
      <Desktop />
      <WindowManager />
      <Taskbar />
      <ContextMenu />
    </div>
  );
};

export default App;
