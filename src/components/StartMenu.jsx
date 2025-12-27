import { useState } from "react";
import { useOSStore } from "../store/osStore";
import Icon from "./Icons";
import { motion } from "framer-motion";

const StartMenu = () => {
  const { apps, openWindow, closeStartMenu, lock, username, settings } = useOSStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAppClick = (appId) => {
    openWindow(appId);
    closeStartMenu();
  };

  const handlePowerAction = (action) => {
    closeStartMenu();
    if (action === "lock") {
      lock();
    } else if (action === "restart") {
      window.location.reload();
    }
  };

  const isLight = settings.theme === 'light';
  const textColor = isLight ? 'text-black' : 'text-white';
  const textMuted = isLight ? 'text-black/60' : 'text-white/60';
  const textFaint = isLight ? 'text-black/40' : 'text-white/40';
  const bgHover = isLight ? 'hover:bg-black/5' : 'hover:bg-white/10';
  const bgCard = isLight ? 'bg-black/5' : 'bg-white/5';
  const borderColor = isLight ? 'border-black/10' : 'border-white/10';

  return (
    <motion.div
      className={`start-menu-glass fixed bottom-14 left-2 w-[620px] rounded-2xl overflow-hidden z-50 ${
        isLight ? 'bg-white/95 border border-black/10' : ''
      }`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {/* Search */}
      <div className={`p-4 border-b ${borderColor}`}>
        <div className="relative">
          <Icon
            name="Search"
            size={18}
            className={`absolute left-4 top-1/2 -translate-y-1/2 ${textFaint}`}
          />
          <input
            type="text"
            placeholder="Search apps, settings, and files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none transition-colors ${
              isLight 
                ? 'bg-black/5 border-black/10 text-black placeholder-black/40 focus:border-os-primary/50'
                : 'bg-white/5 border-white/10 text-white placeholder-white/40 focus:border-os-primary/50'
            }`}
            autoFocus
          />
        </div>
      </div>

      {/* Pinned apps */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm font-medium ${textMuted}`}>Pinned</span>
          <button className={`text-xs text-os-primary hover:text-os-primary/80 transition-colors flex items-center gap-1`}>
            All apps
            <Icon name="ChevronRight" size={14} />
          </button>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {filteredApps.slice(0, 12).map((app) => (
            <motion.button
              key={app.id}
              className={`p-3 rounded-xl ${bgHover} transition-colors flex flex-col items-center gap-2`}
              onClick={() => handleAppClick(app.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-os-primary/20 to-purple-600/20 flex items-center justify-center">
                <Icon name={app.icon} size={24} className={textColor} />
              </div>
              <span className={`text-xs ${textMuted} text-center line-clamp-1`}>
                {app.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recommended */}
      <div className={`p-4 border-t ${borderColor}`}>
        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm font-medium ${textMuted}`}>Recommended</span>
          <button className={`text-xs text-os-primary hover:text-os-primary/80 transition-colors flex items-center gap-1`}>
            More
            <Icon name="ChevronRight" size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button 
            className={`p-3 rounded-xl ${bgHover} transition-colors flex items-center gap-3`}
            onClick={() => {
              openWindow("text-editor", { filePath: "/home/user/Documents/readme.txt", title: "readme.txt" });
              closeStartMenu();
            }}
          >
            <div className={`w-10 h-10 rounded-lg ${bgCard} flex items-center justify-center`}>
              <Icon name="FileText" size={20} className={textMuted} />
            </div>
            <div className="text-left">
              <div className={`text-sm ${textMuted}`}>readme.txt</div>
              <div className={`text-xs ${textFaint}`}>Recently opened</div>
            </div>
          </button>
          <button 
            className={`p-3 rounded-xl ${bgHover} transition-colors flex items-center gap-3`}
            onClick={() => {
              openWindow("file-manager", { path: "/home/user/Documents" });
              closeStartMenu();
            }}
          >
            <div className={`w-10 h-10 rounded-lg ${bgCard} flex items-center justify-center`}>
              <Icon name="Folder" size={20} className="text-yellow-500/60" />
            </div>
            <div className="text-left">
              <div className={`text-sm ${textMuted}`}>Documents</div>
              <div className={`text-xs ${textFaint}`}>Folder</div>
            </div>
          </button>
        </div>
      </div>

      {/* User and power */}
      <div className={`p-4 border-t ${borderColor} flex items-center justify-between ${bgCard}`}>
        <button className={`flex items-center gap-3 p-2 rounded-xl ${bgHover} transition-colors`}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-os-primary to-purple-600 flex items-center justify-center">
            <Icon name="User" size={18} className="text-white" />
          </div>
          <div className="text-left">
            <span className={`text-sm ${textColor} block`}>{username}</span>
            <span className={`text-xs ${textFaint}`}>CyberOS</span>
          </div>
        </button>
        <div className="flex items-center gap-1">
          <button
            className={`p-2.5 rounded-xl ${bgHover} transition-colors`}
            onClick={() => handlePowerAction("lock")}
            title="Lock"
          >
            <Icon name="Lock" size={18} className={textMuted} />
          </button>
          <button
            className={`p-2.5 rounded-xl ${bgHover} transition-colors`}
            onClick={() => handlePowerAction("restart")}
            title="Restart"
          >
            <Icon name="RefreshCw" size={18} className={textMuted} />
          </button>
          <button
            className={`p-2.5 rounded-xl ${bgHover} transition-colors`}
            title="Shut down"
          >
            <Icon name="Power" size={18} className={textMuted} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default StartMenu;
