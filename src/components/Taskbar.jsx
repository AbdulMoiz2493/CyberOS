import { useState, useEffect } from "react";
import { useOSStore } from "../store/osStore";
import Icon from "./Icons";
import StartMenu from "./StartMenu";
import SearchPanel from "./SearchPanel";
import { formatTime } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const Taskbar = () => {
  const {
    windows,
    activeWindowId,
    focusWindow,
    minimizeWindow,
    startMenuOpen,
    toggleStartMenu,
    closeStartMenu,
    pinnedApps,
    apps,
    openWindow,
    settings,
    updateSettings,
  } = useOSStore();

  const [time, setTime] = useState(new Date());
  const [showSystemTray, setShowSystemTray] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (startMenuOpen && !e.target.closest(".start-button") && !e.target.closest(".start-menu-glass")) {
        closeStartMenu();
      }
      if (showSystemTray && !e.target.closest(".system-tray-button") && !e.target.closest(".system-tray-popup")) {
        setShowSystemTray(false);
      }
      if (showSearch && !e.target.closest(".search-button") && !e.target.closest(".search-panel")) {
        setShowSearch(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [startMenuOpen, showSystemTray, showSearch, closeStartMenu]);

  const handleWindowClick = (window) => {
    if (window.id === activeWindowId && !window.isMinimized) {
      minimizeWindow(window.id);
    } else {
      focusWindow(window.id);
    }
  };

  const pinnedAppsList = pinnedApps.map((id) => apps.find((a) => a.id === id)).filter(Boolean);
  const openWindows = windows.filter((w) => !pinnedApps.includes(w.appId));

  return (
    <>
      <AnimatePresence>
        {startMenuOpen && <StartMenu />}
      </AnimatePresence>

      <AnimatePresence>
        {showSearch && <SearchPanel onClose={() => setShowSearch(false)} />}
      </AnimatePresence>

      <div
        className={`taskbar-glass fixed bottom-0 left-0 right-0 h-12 flex items-center px-2 z-50 ${
          settings.theme === 'light' ? 'bg-white/80' : ''
        }`}
      >
        {/* Start button */}
        <motion.button
          className={`start-button p-2 rounded-lg hover:bg-white/10 transition-colors ${
            startMenuOpen ? "bg-white/10" : ""
          }`}
          onClick={toggleStartMenu}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-os-primary to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            C
          </div>
        </motion.button>

        {/* Search */}
        <button
          className="search-button ml-2 flex-shrink-0"
          onClick={() => setShowSearch(true)}
        >
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            settings.theme === 'light' ? 'bg-black/5 hover:bg-black/10' : 'bg-white/5 hover:bg-white/10'
          }`}>
            <Icon name="Search" size={16} className={settings.theme === 'light' ? 'text-black/60' : 'text-white/60'} />
            <span className={`text-sm ${settings.theme === 'light' ? 'text-black/60' : 'text-white/60'}`}>Search</span>
          </div>
        </button>

        {/* Pinned apps and open windows */}
        <div className="flex-1 flex items-center gap-1 ml-2 overflow-x-auto">
          {pinnedAppsList.map((app) => {
            const appWindows = windows.filter((w) => w.appId === app.id);
            const isActive = appWindows.some((w) => w.id === activeWindowId);
            const hasWindows = appWindows.length > 0;

            return (
              <motion.button
                key={app.id}
                className={`relative p-2 rounded-lg transition-colors ${
                  isActive ? "bg-white/20" : hasWindows ? "bg-white/10" : "hover:bg-white/10"
                }`}
                onClick={() => {
                  if (hasWindows) {
                    handleWindowClick(appWindows[0]);
                  } else {
                    openWindow(app.id);
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon name={app.icon} size={20} className={settings.theme === 'light' ? 'text-black/80' : 'text-white'} />
                {hasWindows && (
                  <div
                    className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all ${
                      isActive ? "w-4 bg-os-primary" : "w-2 bg-white/50"
                    }`}
                  />
                )}
              </motion.button>
            );
          })}

          {/* Separator */}
          {openWindows.length > 0 && (
            <div className="w-px h-6 bg-white/20 mx-1" />
          )}

          {/* Non-pinned open windows */}
          {openWindows.map((window) => (
            <motion.button
              key={window.id}
              className={`relative p-2 rounded-lg transition-colors ${
                window.id === activeWindowId ? "bg-white/20" : "bg-white/10"
              }`}
              onClick={() => handleWindowClick(window)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon name={window.icon} size={20} className={settings.theme === 'light' ? 'text-black/80' : 'text-white'} />
              <div
                className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all ${
                  window.id === activeWindowId ? "w-4 bg-os-primary" : "w-2 bg-white/50"
                }`}
              />
            </motion.button>
          ))}
        </div>

        {/* System tray */}
        <div className="flex items-center gap-1">
          <button
            className="system-tray-button p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setShowSystemTray(!showSystemTray)}
          >
            <Icon name="ChevronUp" size={16} className={settings.theme === 'light' ? 'text-black/60' : 'text-white/60'} />
          </button>

          <div className="flex items-center gap-2 px-2">
            <Icon name={settings.wifi ? "Wifi" : "WifiOff"} size={16} className={settings.theme === 'light' ? 'text-black/80' : 'text-white/80'} />
            <Icon name="Volume2" size={16} className={settings.theme === 'light' ? 'text-black/80' : 'text-white/80'} />
            <Icon name="Battery" size={16} className={settings.theme === 'light' ? 'text-black/80' : 'text-white/80'} />
          </div>

          {/* Clock */}
          <button 
            className="px-3 py-1 rounded-lg hover:bg-white/10 transition-colors text-right"
            onClick={() => openWindow("clock")}
          >
            <div className={`text-xs ${settings.theme === 'light' ? 'text-black' : 'text-white'}`}>
              {formatTime(time, settings.use24Hour, settings.showSeconds)}
            </div>
            <div className={`text-xs ${settings.theme === 'light' ? 'text-black/60' : 'text-white/60'}`}>
              {time.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          </button>

          {/* Show desktop */}
          <div className="w-1 h-full hover:bg-white/20 transition-colors cursor-pointer" />
        </div>
      </div>

      {/* System tray popup */}
      <AnimatePresence>
        {showSystemTray && (
          <motion.div
            className={`system-tray-popup fixed bottom-14 right-4 rounded-2xl p-4 z-50 w-80 ${
              settings.theme === 'light' ? 'bg-white/95 border border-black/10' : 'glass'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {/* Quick toggles */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button 
                className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                  settings.wifi 
                    ? "bg-os-primary/20 text-os-primary" 
                    : settings.theme === 'light' ? "bg-black/5 text-black/60 hover:bg-black/10" : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
                onClick={() => updateSettings({ wifi: !settings.wifi })}
              >
                <Icon name="Wifi" size={20} />
                <span className="text-xs">Wi-Fi</span>
              </button>
              <button 
                className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                  settings.bluetooth 
                    ? "bg-os-primary/20 text-os-primary" 
                    : settings.theme === 'light' ? "bg-black/5 text-black/60 hover:bg-black/10" : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
                onClick={() => updateSettings({ bluetooth: !settings.bluetooth })}
              >
                <Icon name="Bluetooth" size={20} />
                <span className="text-xs">Bluetooth</span>
              </button>
              <button 
                className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                  settings.nightLight 
                    ? "bg-orange-500/20 text-orange-400" 
                    : settings.theme === 'light' ? "bg-black/5 text-black/60 hover:bg-black/10" : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
                onClick={() => updateSettings({ nightLight: !settings.nightLight })}
              >
                <Icon name="Moon" size={20} />
                <span className="text-xs">Night</span>
              </button>
            </div>

            {/* Brightness slider */}
            <div className="mb-4">
              <div className="flex items-center gap-3">
                <Icon name="Sun" size={16} className={settings.theme === 'light' ? 'text-black/60' : 'text-white/60'} />
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={settings.brightness}
                  onChange={(e) => updateSettings({ brightness: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-white/20 rounded-full appearance-none cursor-pointer accent-os-primary"
                />
                <span className={`text-xs w-8 ${settings.theme === 'light' ? 'text-black/60' : 'text-white/60'}`}>{settings.brightness}%</span>
              </div>
            </div>

            {/* Volume slider */}
            <div className="mb-4">
              <div className="flex items-center gap-3">
                <Icon name="Volume2" size={16} className={settings.theme === 'light' ? 'text-black/60' : 'text-white/60'} />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.volume}
                  onChange={(e) => updateSettings({ volume: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-white/20 rounded-full appearance-none cursor-pointer accent-os-primary"
                />
                <span className={`text-xs w-8 ${settings.theme === 'light' ? 'text-black/60' : 'text-white/60'}`}>{settings.volume}%</span>
              </div>
            </div>

            {/* Settings link */}
            <button 
              className={`w-full p-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm ${
                settings.theme === 'light' ? 'bg-black/5 hover:bg-black/10 text-black/60' : 'bg-white/5 hover:bg-white/10 text-white/60'
              }`}
              onClick={() => {
                openWindow("settings");
                setShowSystemTray(false);
              }}
            >
              <Icon name="Settings" size={16} />
              All Settings
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Taskbar;
