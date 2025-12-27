import { useState, useEffect, useRef } from "react";
import { useOSStore } from "../store/osStore";
import Icon from "./Icons";
import { motion } from "framer-motion";

const SearchPanel = ({ onClose }) => {
  const { apps, openWindow, fileSystem, settings } = useOSStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(query.toLowerCase())
  );

  const searchFiles = () => {
    if (!query) return [];
    const results = [];
    Object.keys(fileSystem).forEach((path) => {
      const item = fileSystem[path];
      const name = path.split("/").pop();
      if (name && name.toLowerCase().includes(query.toLowerCase()) && item.type === "file") {
        results.push({ path, name, type: "file" });
      }
    });
    return results.slice(0, 5);
  };

  const fileResults = searchFiles();

  const handleAppClick = (appId) => {
    openWindow(appId);
    onClose();
  };

  const handleFileClick = (path, name) => {
    openWindow("text-editor", { filePath: path, title: name });
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const quickActions = [
    { name: "Settings", icon: "Settings", action: () => handleAppClick("settings") },
    { name: "Files", icon: "Folder", action: () => handleAppClick("file-manager") },
    { name: "Terminal", icon: "Terminal", action: () => handleAppClick("terminal") },
    { name: "Browser", icon: "Globe", action: () => handleAppClick("browser") },
  ];

  return (
    <motion.div
      className={`search-panel fixed bottom-14 left-2 w-[500px] rounded-2xl overflow-hidden z-50 ${
        settings.theme === 'light' ? 'bg-white/95 border border-black/10' : 'start-menu-glass'
      }`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {/* Search input */}
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Icon
            name="Search"
            size={20}
            className={`absolute left-4 top-1/2 -translate-y-1/2 ${settings.theme === 'light' ? 'text-black/40' : 'text-white/40'}`}
          />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type to search apps, files, and settings..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none transition-colors ${
              settings.theme === 'light' 
                ? 'bg-black/5 border-black/10 text-black placeholder-black/40 focus:border-os-primary/50' 
                : 'bg-white/5 border-white/10 text-white placeholder-white/40 focus:border-os-primary/50'
            }`}
          />
        </div>
      </div>

      {/* Results */}
      <div className="max-h-96 overflow-y-auto">
        {query ? (
          <>
            {/* Apps */}
            {filteredApps.length > 0 && (
              <div className="p-3">
                <div className={`text-xs uppercase tracking-wider mb-2 px-2 ${settings.theme === 'light' ? 'text-black/40' : 'text-white/40'}`}>
                  Apps
                </div>
                <div className="space-y-1">
                  {filteredApps.slice(0, 5).map((app) => (
                    <button
                      key={app.id}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        settings.theme === 'light' ? 'hover:bg-black/5' : 'hover:bg-white/10'
                      }`}
                      onClick={() => handleAppClick(app.id)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-os-primary/20 to-purple-600/20 flex items-center justify-center">
                        <Icon name={app.icon} size={20} className={settings.theme === 'light' ? 'text-black/80' : 'text-white'} />
                      </div>
                      <div className="text-left">
                        <div className={`text-sm ${settings.theme === 'light' ? 'text-black/80' : 'text-white/80'}`}>{app.name}</div>
                        <div className={`text-xs ${settings.theme === 'light' ? 'text-black/40' : 'text-white/40'}`}>App</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Files */}
            {fileResults.length > 0 && (
              <div className="p-3 border-t border-white/10">
                <div className={`text-xs uppercase tracking-wider mb-2 px-2 ${settings.theme === 'light' ? 'text-black/40' : 'text-white/40'}`}>
                  Files
                </div>
                <div className="space-y-1">
                  {fileResults.map((file) => (
                    <button
                      key={file.path}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        settings.theme === 'light' ? 'hover:bg-black/5' : 'hover:bg-white/10'
                      }`}
                      onClick={() => handleFileClick(file.path, file.name)}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        settings.theme === 'light' ? 'bg-black/5' : 'bg-white/5'
                      }`}>
                        <Icon name="FileText" size={20} className={settings.theme === 'light' ? 'text-black/60' : 'text-white/60'} />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <div className={`text-sm truncate ${settings.theme === 'light' ? 'text-black/80' : 'text-white/80'}`}>{file.name}</div>
                        <div className={`text-xs truncate ${settings.theme === 'light' ? 'text-black/40' : 'text-white/40'}`}>{file.path}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {filteredApps.length === 0 && fileResults.length === 0 && (
              <div className={`p-8 text-center ${settings.theme === 'light' ? 'text-black/40' : 'text-white/40'}`}>
                <Icon name="Search" size={32} className="mx-auto mb-2" />
                <p>No results found for "{query}"</p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Quick actions */}
            <div className="p-3">
              <div className={`text-xs uppercase tracking-wider mb-2 px-2 ${settings.theme === 'light' ? 'text-black/40' : 'text-white/40'}`}>
                Quick Actions
              </div>
              <div className="grid grid-cols-4 gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.name}
                    className={`p-3 rounded-xl flex flex-col items-center gap-2 transition-colors ${
                      settings.theme === 'light' ? 'hover:bg-black/5' : 'hover:bg-white/10'
                    }`}
                    onClick={action.action}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-os-primary/20 to-purple-600/20 flex items-center justify-center">
                      <Icon name={action.icon} size={20} className={settings.theme === 'light' ? 'text-black/80' : 'text-white'} />
                    </div>
                    <span className={`text-xs ${settings.theme === 'light' ? 'text-black/60' : 'text-white/60'}`}>{action.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent */}
            <div className="p-3 border-t border-white/10">
              <div className={`text-xs uppercase tracking-wider mb-2 px-2 ${settings.theme === 'light' ? 'text-black/40' : 'text-white/40'}`}>
                Recent
              </div>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  settings.theme === 'light' ? 'hover:bg-black/5' : 'hover:bg-white/10'
                }`}
                onClick={() => handleFileClick("/home/user/Documents/readme.txt", "readme.txt")}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  settings.theme === 'light' ? 'bg-black/5' : 'bg-white/5'
                }`}>
                  <Icon name="FileText" size={20} className={settings.theme === 'light' ? 'text-black/60' : 'text-white/60'} />
                </div>
                <div className="text-left">
                  <div className={`text-sm ${settings.theme === 'light' ? 'text-black/80' : 'text-white/80'}`}>readme.txt</div>
                  <div className={`text-xs ${settings.theme === 'light' ? 'text-black/40' : 'text-white/40'}`}>Documents</div>
                </div>
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default SearchPanel;
