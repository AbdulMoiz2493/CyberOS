import { create } from "zustand";
import { persist } from "zustand/middleware";

const defaultWallpapers = [
  "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80",
  "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1920&q=80",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
  "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1920&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80",
];

const defaultApps = [
  { id: "file-manager", name: "Files", icon: "Folder", type: "system" },
  { id: "terminal", name: "Terminal", icon: "Terminal", type: "system" },
  { id: "browser", name: "Browser", icon: "Globe", type: "system" },
  { id: "settings", name: "Settings", icon: "Settings", type: "system" },
  { id: "text-editor", name: "Text Editor", icon: "FileText", type: "system" },
  { id: "calculator", name: "Calculator", icon: "Calculator", type: "system" },
  { id: "image-viewer", name: "Photos", icon: "Image", type: "system" },
  { id: "music-player", name: "Music", icon: "Music", type: "system" },
  { id: "app-store", name: "App Store", icon: "Store", type: "system" },
  { id: "task-manager", name: "Task Manager", icon: "Activity", type: "system" },
  { id: "notes", name: "Notes", icon: "StickyNote", type: "system" },
  { id: "calendar", name: "Calendar", icon: "Calendar", type: "system" },
  { id: "weather", name: "Weather", icon: "Cloud", type: "system" },
  { id: "clock", name: "Clock", icon: "Clock", type: "system" },
  { id: "trash", name: "Trash", icon: "Trash2", type: "system" },
];

const defaultDesktopIcons = [
  { id: "file-manager", name: "Files", icon: "Folder", x: 20, y: 20 },
  { id: "terminal", name: "Terminal", icon: "Terminal", x: 20, y: 120 },
  { id: "browser", name: "Browser", icon: "Globe", x: 20, y: 220 },
  { id: "settings", name: "Settings", icon: "Settings", x: 20, y: 320 },
  { id: "trash", name: "Trash", icon: "Trash2", x: 20, y: 420 },
];

const defaultFileSystem = {
  "/": {
    type: "folder",
    children: ["home", "documents", "downloads", "pictures", "music", "videos", "applications"],
  },
  "/home": { type: "folder", children: ["user"] },
  "/home/user": { type: "folder", children: ["Desktop", "Documents", "Downloads", "Pictures", "Music", "Videos"] },
  "/home/user/Desktop": { type: "folder", children: [] },
  "/home/user/Documents": { type: "folder", children: ["readme.txt", "notes.txt"] },
  "/home/user/Downloads": { type: "folder", children: [] },
  "/home/user/Pictures": { type: "folder", children: ["wallpapers"] },
  "/home/user/Pictures/wallpapers": { type: "folder", children: [] },
  "/home/user/Music": { type: "folder", children: [] },
  "/home/user/Videos": { type: "folder", children: [] },
  "/documents": { type: "folder", children: [] },
  "/downloads": { type: "folder", children: [] },
  "/pictures": { type: "folder", children: [] },
  "/music": { type: "folder", children: [] },
  "/videos": { type: "folder", children: [] },
  "/applications": { type: "folder", children: [] },
  "/home/user/Documents/readme.txt": {
    type: "file",
    content: "Welcome to CyberOS!\n\nThis is a web-based operating system built with React.\n\nFeatures:\n- File Manager\n- Terminal\n- Browser\n- Settings\n- And more!\n\nDeveloped by Abdul Moiz\nEmail: abdulmoiz8895@gmail.com",
    size: 200,
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  },
  "/home/user/Documents/notes.txt": {
    type: "file",
    content: "My Notes\n=========\n\n- Learn React\n- Build awesome apps\n- Have fun coding!",
    size: 78,
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  },
};

export const useOSStore = create(
  persist(
    (set, get) => ({
      // System state
      isLocked: true,
      isBooted: false,
      username: "User",
      
      // Windows
      windows: [],
      activeWindowId: null,
      windowZIndex: 100,
      
      // Desktop
      desktopIcons: defaultDesktopIcons,
      selectedIcons: [],
      wallpaper: defaultWallpapers[0],
      wallpapers: defaultWallpapers,
      
      // Apps
      apps: defaultApps,
      installedApps: [],
      pinnedApps: ["file-manager", "terminal", "browser", "settings"],
      
      // File system
      fileSystem: defaultFileSystem,
      clipboard: null,
      
      // Context menu
      contextMenu: null,
      
      // Settings
      settings: {
        theme: "dark",
        accentColor: "#e94560",
        fontSize: 14,
        animations: true,
        sounds: true,
        notifications: true,
        autoHideTaskbar: false,
        showSeconds: true,
        use24Hour: false,
        brightness: 100,
        volume: 50,
        wifi: true,
        bluetooth: false,
        nightLight: false,
        taskbarPosition: "bottom",
        iconSize: "medium",
      },
      
      // Notifications
      notifications: [],
      
      // Start menu
      startMenuOpen: false,
      
      // Boot OS
      bootOS: () => {
        set({ isBooted: true });
      },
      
      // Lock/Unlock
      unlock: () => set({ isLocked: false }),
      lock: () => set({ isLocked: true, startMenuOpen: false }),
      
      // Window management
      openWindow: (appId, props = {}) => {
        const { windows, windowZIndex, apps } = get();
        const app = apps.find((a) => a.id === appId);
        if (!app) return;
        
        const existingWindow = windows.find((w) => w.appId === appId && !props.allowMultiple);
        if (existingWindow) {
          get().focusWindow(existingWindow.id);
          return;
        }
        
        const newWindow = {
          id: `${appId}-${Date.now()}`,
          appId,
          title: props.title || app.name,
          icon: app.icon,
          x: 100 + (windows.length * 30) % 200,
          y: 50 + (windows.length * 30) % 150,
          width: props.width || 800,
          height: props.height || 600,
          minWidth: props.minWidth || 400,
          minHeight: props.minHeight || 300,
          isMaximized: false,
          isMinimized: false,
          zIndex: windowZIndex + 1,
          props: props,
        };
        
        set({
          windows: [...windows, newWindow],
          activeWindowId: newWindow.id,
          windowZIndex: windowZIndex + 1,
          startMenuOpen: false,
        });
      },
      
      closeWindow: (windowId) => {
        const { windows, activeWindowId } = get();
        const newWindows = windows.filter((w) => w.id !== windowId);
        set({
          windows: newWindows,
          activeWindowId: activeWindowId === windowId ? newWindows[newWindows.length - 1]?.id : activeWindowId,
        });
      },
      
      minimizeWindow: (windowId) => {
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === windowId ? { ...w, isMinimized: true } : w
          ),
        }));
      },
      
      maximizeWindow: (windowId) => {
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w
          ),
        }));
      },
      
      focusWindow: (windowId) => {
        const { windowZIndex } = get();
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === windowId
              ? { ...w, zIndex: windowZIndex + 1, isMinimized: false }
              : w
          ),
          activeWindowId: windowId,
          windowZIndex: windowZIndex + 1,
        }));
      },
      
      updateWindowPosition: (windowId, x, y) => {
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === windowId ? { ...w, x, y } : w
          ),
        }));
      },
      
      updateWindowSize: (windowId, width, height) => {
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === windowId ? { ...w, width, height } : w
          ),
        }));
      },
      
      // Desktop icons
      selectIcon: (iconId, multi = false) => {
        set((state) => ({
          selectedIcons: multi
            ? state.selectedIcons.includes(iconId)
              ? state.selectedIcons.filter((id) => id !== iconId)
              : [...state.selectedIcons, iconId]
            : [iconId],
        }));
      },
      
      clearSelection: () => set({ selectedIcons: [] }),
      
      updateIconPosition: (iconId, x, y) => {
        set((state) => ({
          desktopIcons: state.desktopIcons.map((icon) =>
            icon.id === iconId ? { ...icon, x, y } : icon
          ),
        }));
      },
      
      // Wallpaper
      setWallpaper: (url) => set({ wallpaper: url }),
      addWallpaper: (url) => set((state) => ({ wallpapers: [...state.wallpapers, url] })),
      
      // Context menu
      showContextMenu: (x, y, items, target = null) => {
        set({ contextMenu: { x, y, items, target } });
      },
      
      hideContextMenu: () => set({ contextMenu: null }),
      
      // Start menu
      toggleStartMenu: () => set((state) => ({ startMenuOpen: !state.startMenuOpen })),
      closeStartMenu: () => set({ startMenuOpen: false }),
      
      // File system operations
      createFile: (path, name, content = "") => {
        const fullPath = `${path}/${name}`.replace("//", "/");
        set((state) => {
          const parentFolder = state.fileSystem[path];
          if (!parentFolder || parentFolder.type !== "folder") return state;
          
          return {
            fileSystem: {
              ...state.fileSystem,
              [path]: {
                ...parentFolder,
                children: [...parentFolder.children, name],
              },
              [fullPath]: {
                type: "file",
                content,
                size: content.length,
                created: new Date().toISOString(),
                modified: new Date().toISOString(),
              },
            },
          };
        });
      },
      
      createFolder: (path, name) => {
        const fullPath = `${path}/${name}`.replace("//", "/");
        set((state) => {
          const parentFolder = state.fileSystem[path];
          if (!parentFolder || parentFolder.type !== "folder") return state;
          
          return {
            fileSystem: {
              ...state.fileSystem,
              [path]: {
                ...parentFolder,
                children: [...parentFolder.children, name],
              },
              [fullPath]: {
                type: "folder",
                children: [],
              },
            },
          };
        });
      },
      
      deleteItem: (path) => {
        set((state) => {
          const parts = path.split("/");
          const name = parts.pop();
          const parentPath = parts.join("/") || "/";
          const parentFolder = state.fileSystem[parentPath];
          
          if (!parentFolder) return state;
          
          const newFileSystem = { ...state.fileSystem };
          delete newFileSystem[path];
          newFileSystem[parentPath] = {
            ...parentFolder,
            children: parentFolder.children.filter((c) => c !== name),
          };
          
          return { fileSystem: newFileSystem };
        });
      },
      
      renameItem: (path, newName) => {
        set((state) => {
          const parts = path.split("/");
          const oldName = parts.pop();
          const parentPath = parts.join("/") || "/";
          const newPath = `${parentPath}/${newName}`.replace("//", "/");
          
          const parentFolder = state.fileSystem[parentPath];
          const item = state.fileSystem[path];
          
          if (!parentFolder || !item) return state;
          
          const newFileSystem = { ...state.fileSystem };
          delete newFileSystem[path];
          newFileSystem[newPath] = item;
          newFileSystem[parentPath] = {
            ...parentFolder,
            children: parentFolder.children.map((c) => (c === oldName ? newName : c)),
          };
          
          return { fileSystem: newFileSystem };
        });
      },
      
      updateFileContent: (path, content) => {
        set((state) => ({
          fileSystem: {
            ...state.fileSystem,
            [path]: {
              ...state.fileSystem[path],
              content,
              size: content.length,
              modified: new Date().toISOString(),
            },
          },
        }));
      },
      
      // Clipboard
      copyToClipboard: (path) => set({ clipboard: { action: "copy", path } }),
      cutToClipboard: (path) => set({ clipboard: { action: "cut", path } }),
      
      paste: (destinationPath) => {
        const { clipboard, fileSystem } = get();
        if (!clipboard) return;
        
        const sourcePath = clipboard.path;
        const sourceItem = fileSystem[sourcePath];
        if (!sourceItem) return;
        
        const parts = sourcePath.split("/");
        const name = parts.pop();
        const newPath = `${destinationPath}/${name}`.replace("//", "/");
        
        set((state) => {
          const destFolder = state.fileSystem[destinationPath];
          if (!destFolder || destFolder.type !== "folder") return state;
          
          const newFileSystem = {
            ...state.fileSystem,
            [destinationPath]: {
              ...destFolder,
              children: [...destFolder.children, name],
            },
            [newPath]: { ...sourceItem },
          };
          
          if (clipboard.action === "cut") {
            const parentPath = parts.join("/") || "/";
            const parentFolder = state.fileSystem[parentPath];
            delete newFileSystem[sourcePath];
            newFileSystem[parentPath] = {
              ...parentFolder,
              children: parentFolder.children.filter((c) => c !== name),
            };
          }
          
          return { fileSystem: newFileSystem, clipboard: null };
        });
      },
      
      // Settings
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
      
      // Notifications
      addNotification: (notification) => {
        const id = Date.now();
        set((state) => ({
          notifications: [...state.notifications, { ...notification, id }],
        }));
        setTimeout(() => {
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }));
        }, 5000);
      },
      
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },
      
      // Pinned apps
      pinApp: (appId) => {
        set((state) => ({
          pinnedApps: state.pinnedApps.includes(appId)
            ? state.pinnedApps
            : [...state.pinnedApps, appId],
        }));
      },
      
      unpinApp: (appId) => {
        set((state) => ({
          pinnedApps: state.pinnedApps.filter((id) => id !== appId),
        }));
      },
      
      // Username
      setUsername: (name) => set({ username: name }),
    }),
    {
      name: "cyberos-storage",
      partialize: (state) => ({
        wallpaper: state.wallpaper,
        wallpapers: state.wallpapers,
        desktopIcons: state.desktopIcons,
        fileSystem: state.fileSystem,
        settings: state.settings,
        pinnedApps: state.pinnedApps,
        installedApps: state.installedApps,
        username: state.username,
      }),
    }
  )
);
