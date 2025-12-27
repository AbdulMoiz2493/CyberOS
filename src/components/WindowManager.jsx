import { useOSStore } from "../store/osStore";
import Window from "./Window";
import FileManager from "./apps/FileManager";
import Terminal from "./apps/Terminal";
import Browser from "./apps/Browser";
import Settings from "./apps/Settings";
import TextEditor from "./apps/TextEditor";
import Calculator from "./apps/Calculator";
import ImageViewer from "./apps/ImageViewer";
import MusicPlayer from "./apps/MusicPlayer";
import AppStore from "./apps/AppStore";
import TaskManager from "./apps/TaskManager";
import Notes from "./apps/Notes";
import Calendar from "./apps/Calendar";
import Weather from "./apps/Weather";
import ClockApp from "./apps/ClockApp";
import Trash from "./apps/Trash";
import { AnimatePresence } from "framer-motion";

const appComponents = {
  "file-manager": FileManager,
  terminal: Terminal,
  browser: Browser,
  settings: Settings,
  "text-editor": TextEditor,
  calculator: Calculator,
  "image-viewer": ImageViewer,
  "music-player": MusicPlayer,
  "app-store": AppStore,
  "task-manager": TaskManager,
  notes: Notes,
  calendar: Calendar,
  weather: Weather,
  clock: ClockApp,
  trash: Trash,
};

const WindowManager = () => {
  const { windows } = useOSStore();

  return (
    <div className="fixed inset-0 bottom-12 pointer-events-none z-10">
      <AnimatePresence>
        {windows.map((window) => {
          const AppComponent = appComponents[window.appId];
          if (!AppComponent) return null;

          return (
            <Window key={window.id} window={window}>
              <AppComponent window={window} />
            </Window>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default WindowManager;
