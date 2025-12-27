import { useState } from "react";
import { useOSStore } from "../../store/osStore";
import Icon from "../Icons";

const AppStore = () => {
  const { installedApps, addNotification, settings } = useOSStore();
  const isLight = settings.theme === 'light';
  const textColor = isLight ? 'text-black' : 'text-white';
  const textMuted = isLight ? 'text-black/60' : 'text-white/60';
  const textFaint = isLight ? 'text-black/40' : 'text-white/40';
  const bgCard = isLight ? 'bg-black/5' : 'bg-white/5';
  const bgHover = isLight ? 'hover:bg-black/5' : 'hover:bg-white/5';
  const bgHover10 = isLight ? 'hover:bg-black/10' : 'hover:bg-white/10';
  const borderColor = isLight ? 'border-black/10' : 'border-white/10';

  const [activeTab, setActiveTab] = useState("discover");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", name: "All", icon: "Grid" },
    { id: "productivity", name: "Productivity", icon: "Briefcase" },
    { id: "utilities", name: "Utilities", icon: "Wrench" },
    { id: "games", name: "Games", icon: "Gamepad2" },
    { id: "media", name: "Media", icon: "Play" },
    { id: "social", name: "Social", icon: "Users" },
  ];

  const apps = [
    { id: "vscode", name: "VS Code", category: "productivity", icon: "Code", rating: 4.8, downloads: "10M+", description: "Code editor" },
    { id: "slack", name: "Slack", category: "social", icon: "MessageSquare", rating: 4.5, downloads: "5M+", description: "Team communication" },
    { id: "spotify", name: "Spotify", category: "media", icon: "Music", rating: 4.7, downloads: "50M+", description: "Music streaming" },
    { id: "notion", name: "Notion", category: "productivity", icon: "FileText", rating: 4.6, downloads: "8M+", description: "All-in-one workspace" },
    { id: "discord", name: "Discord", category: "social", icon: "Headphones", rating: 4.4, downloads: "20M+", description: "Voice & text chat" },
    { id: "figma", name: "Figma", category: "productivity", icon: "Paintbrush", rating: 4.9, downloads: "3M+", description: "Design tool" },
    { id: "vlc", name: "VLC Player", category: "media", icon: "Video", rating: 4.6, downloads: "15M+", description: "Media player" },
    { id: "gimp", name: "GIMP", category: "media", icon: "Image", rating: 4.3, downloads: "2M+", description: "Image editor" },
    { id: "chess", name: "Chess", category: "games", icon: "Crown", rating: 4.5, downloads: "1M+", description: "Classic chess game" },
    { id: "2048", name: "2048", category: "games", icon: "Grid", rating: 4.4, downloads: "500K+", description: "Puzzle game" },
    { id: "zip", name: "7-Zip", category: "utilities", icon: "Archive", rating: 4.7, downloads: "10M+", description: "File archiver" },
    { id: "notepad", name: "Notepad++", category: "utilities", icon: "FileText", rating: 4.6, downloads: "8M+", description: "Text editor" },
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredApps = apps.filter((app) => {
    const matchesCategory = selectedCategory === "all" || app.category === selectedCategory;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleInstall = (app) => {
    addNotification({
      title: "App Installed",
      message: `${app.name} has been installed successfully!`,
      type: "success",
    });
  };

  const featuredApps = apps.slice(0, 3);

  return (
    <div className={`h-full flex flex-col ${isLight ? 'bg-gray-50' : 'bg-os-bg'}`}>
      {/* Header */}
      <div className={`p-4 border-b ${borderColor} ${isLight ? 'bg-white/50' : 'bg-os-surface/50'}`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Icon
              name="Search"
              size={18}
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${textFaint}`}
            />
            <input
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg ${bgCard} border ${borderColor} ${textColor} placeholder:${textFaint}`}
            />
          </div>
        </div>
        <div className="flex gap-2">
          {["discover", "updates", "installed"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
                activeTab === tab ? "bg-os-primary text-white" : `${textMuted} ${bgHover}`
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`w-48 border-r ${borderColor} p-3 overflow-y-auto`}>
          <div className={`text-xs ${textFaint} uppercase tracking-wider mb-2 px-2`}>
            Categories
          </div>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                selectedCategory === cat.id ? (isLight ? "bg-black/10" : "bg-white/10") : bgHover
              }`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <Icon name={cat.icon} size={16} className={textMuted} />
              <span className={`text-sm ${textMuted}`}>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {activeTab === "discover" && (
            <>
              {/* Featured */}
              <div className="mb-6">
                <h2 className={`text-lg font-semibold ${textColor} mb-3`}>Featured</h2>
                <div className="grid grid-cols-3 gap-4">
                  {featuredApps.map((app) => (
                    <div
                      key={app.id}
                      className={`p-4 rounded-xl bg-gradient-to-br from-os-primary/20 to-purple-600/20 border ${borderColor}`}
                    >
                      <div className={`w-12 h-12 rounded-xl ${bgCard} flex items-center justify-center mb-3`}>
                        <Icon name={app.icon} size={24} className={textColor} />
                      </div>
                      <h3 className={`font-medium ${textColor} mb-1`}>{app.name}</h3>
                      <p className={`text-xs ${textMuted} mb-3`}>{app.description}</p>
                      <button
                        className="w-full py-1.5 rounded-lg bg-os-primary hover:bg-os-primary/80 text-white text-sm transition-colors"
                        onClick={() => handleInstall(app)}
                      >
                        Install
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* All Apps */}
              <div>
                <h2 className={`text-lg font-semibold ${textColor} mb-3`}>All Apps</h2>
                <div className="grid grid-cols-2 gap-3">
                  {filteredApps.map((app) => (
                    <div
                      key={app.id}
                      className={`flex items-center gap-3 p-3 rounded-lg ${bgCard} ${bgHover10} transition-colors`}
                    >
                      <div className={`w-12 h-12 rounded-xl ${bgCard} flex items-center justify-center flex-shrink-0`}>
                        <Icon name={app.icon} size={24} className={textMuted} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium ${textColor} truncate`}>{app.name}</h3>
                        <p className={`text-xs ${textMuted}`}>{app.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-0.5">
                            <Icon name="Star" size={12} className="text-yellow-400 fill-yellow-400" />
                            <span className={`text-xs ${textMuted}`}>{app.rating}</span>
                          </div>
                          <span className={`text-xs ${textFaint}`}>{app.downloads}</span>
                        </div>
                      </div>
                      <button
                        className="px-3 py-1.5 rounded-lg bg-os-primary/20 hover:bg-os-primary/30 text-os-primary text-sm transition-colors"
                        onClick={() => handleInstall(app)}
                      >
                        Get
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "updates" && (
            <div className={`flex flex-col items-center justify-center h-full ${textFaint}`}>
              <Icon name="CheckCircle" size={48} className="mb-4" />
              <p>All apps are up to date</p>
            </div>
          )}

          {activeTab === "installed" && (
            <div className="space-y-2">
              {apps.slice(0, 5).map((app) => (
                <div
                  key={app.id}
                  className={`flex items-center gap-3 p-3 rounded-lg ${bgCard}`}
                >
                  <div className={`w-10 h-10 rounded-lg ${bgCard} flex items-center justify-center`}>
                    <Icon name={app.icon} size={20} className={textMuted} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-sm font-medium ${textColor}`}>{app.name}</h3>
                    <p className={`text-xs ${textFaint}`}>Installed</p>
                  </div>
                  <button className={`px-3 py-1 rounded text-xs ${textMuted} ${bgHover10} transition-colors`}>
                    Open
                  </button>
                  <button className="px-3 py-1 rounded text-xs text-red-400 hover:bg-red-400/10 transition-colors">
                    Uninstall
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppStore;
