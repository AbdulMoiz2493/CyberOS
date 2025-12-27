import { useState } from "react";
import { useOSStore } from "../../store/osStore";
import Icon from "../Icons";
import { Modal } from "../ui/Modal";

// Toggle switch component - defined outside to prevent recreation on each render
const ToggleSwitch = ({ enabled, onChange, isLight }) => {
  return (
    <button
      type="button"
      className={`w-12 h-6 rounded-full transition-all duration-200 relative flex-shrink-0 cursor-pointer ${
        enabled ? "bg-os-primary" : isLight ? "bg-black/20" : "bg-white/20"
      }`}
      onClick={() => onChange(!enabled)}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-200 ${
          enabled ? "left-[26px]" : "left-0.5"
        }`}
      />
    </button>
  );
};

const Settings = ({ window }) => {
  const {
    settings,
    updateSettings,
    wallpaper,
    wallpapers,
    setWallpaper,
    addWallpaper,
    username,
    setUsername,
    apps,
    pinnedApps,
    pinApp,
    unpinApp,
  } = useOSStore();

  const [activeTab, setActiveTab] = useState(window.props?.tab || "personalization");
  const [showWallpaperModal, setShowWallpaperModal] = useState(false);
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState("");
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [newUsername, setNewUsername] = useState(username);

  const isLight = settings.theme === 'light';

  const tabs = [
    { id: "personalization", name: "Personalization", icon: "Palette" },
    { id: "taskbar", name: "Taskbar", icon: "Layout" },
    { id: "display", name: "Display", icon: "Monitor" },
    { id: "sound", name: "Sound", icon: "Volume2" },
    { id: "network", name: "Network", icon: "Wifi" },
    { id: "notifications", name: "Notifications", icon: "Bell" },
    { id: "accounts", name: "Accounts", icon: "User" },
    { id: "time", name: "Time & Language", icon: "Clock" },
    { id: "system", name: "System", icon: "Settings" },
    { id: "about", name: "About", icon: "Info" },
  ];

  const handleAddWallpaper = () => {
    if (customWallpaperUrl) {
      addWallpaper(customWallpaperUrl);
      setWallpaper(customWallpaperUrl);
      setCustomWallpaperUrl("");
      setShowWallpaperModal(false);
    }
  };

  const handleUpdateUsername = () => {
    if (newUsername.trim()) {
      setUsername(newUsername.trim());
      setShowUsernameModal(false);
    }
  };

  const Slider = ({ value, onChange, min = 0, max = 100, icon }) => (
    <div className="flex items-center gap-3">
      {icon && <Icon name={icon} size={18} className={isLight ? 'text-black/60' : 'text-white/60'} />}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="flex-1 h-2 rounded-full appearance-none cursor-pointer accent-os-primary"
        style={{ background: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)' }}
      />
      <span className={`text-sm w-12 text-right ${isLight ? 'text-black/60' : 'text-white/60'}`}>{value}%</span>
    </div>
  );

  const textColor = isLight ? 'text-black' : 'text-white';
  const textMuted = isLight ? 'text-black/60' : 'text-white/60';
  const textFaint = isLight ? 'text-black/40' : 'text-white/40';
  const bgCard = isLight ? 'bg-black/5' : 'bg-white/5';
  const bgCardHover = isLight ? 'hover:bg-black/10' : 'hover:bg-white/10';
  const borderColor = isLight ? 'border-black/10' : 'border-white/10';

  const renderContent = () => {
    switch (activeTab) {
      case "personalization":
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-medium ${textColor} mb-4`}>Theme</h3>
              <div className="flex gap-4">
                <button
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    settings.theme === "dark" ? "border-os-primary bg-os-primary/10" : `${borderColor} ${bgCardHover}`
                  }`}
                  onClick={() => updateSettings({ theme: "dark" })}
                >
                  <div className="w-full h-20 rounded-lg bg-gray-900 mb-3 flex items-center justify-center border border-white/10">
                    <Icon name="Moon" size={24} className="text-white" />
                  </div>
                  <span className={`text-sm ${textColor}`}>Dark</span>
                </button>
                <button
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    settings.theme === "light" ? "border-os-primary bg-os-primary/10" : `${borderColor} ${bgCardHover}`
                  }`}
                  onClick={() => updateSettings({ theme: "light" })}
                >
                  <div className="w-full h-20 rounded-lg bg-gray-100 mb-3 flex items-center justify-center border border-black/10">
                    <Icon name="Sun" size={24} className="text-gray-800" />
                  </div>
                  <span className={`text-sm ${textColor}`}>Light</span>
                </button>
              </div>
            </div>

            <div>
              <h3 className={`text-lg font-medium ${textColor} mb-4`}>Background</h3>
              <div className="grid grid-cols-4 gap-3">
                {wallpapers.map((wp, index) => (
                  <button
                    key={index}
                    className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      wallpaper === wp ? "border-os-primary scale-105" : `border-transparent ${bgCardHover}`
                    }`}
                    onClick={() => setWallpaper(wp)}
                  >
                    <img src={wp} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
                <button
                  className={`aspect-video rounded-lg border-2 border-dashed ${borderColor} ${bgCardHover} flex items-center justify-center transition-colors`}
                  onClick={() => setShowWallpaperModal(true)}
                >
                  <Icon name="Plus" size={24} className={textFaint} />
                </button>
              </div>
            </div>

            <div>
              <h3 className={`text-lg font-medium ${textColor} mb-4`}>Accent Color</h3>
              <div className="flex gap-3">
                {["#e94560", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"].map((color) => (
                  <button
                    key={color}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      settings.accentColor === color ? "border-white scale-110 shadow-lg" : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => updateSettings({ accentColor: color })}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className={`text-lg font-medium ${textColor} mb-4`}>Icon Size</h3>
              <div className="flex gap-3">
                {["small", "medium", "large"].map((size) => (
                  <button
                    key={size}
                    className={`flex-1 p-3 rounded-lg border transition-colors capitalize ${
                      settings.iconSize === size ? "border-os-primary bg-os-primary/20 text-os-primary" : `${borderColor} ${bgCardHover} ${textMuted}`
                    }`}
                    onClick={() => updateSettings({ iconSize: size })}
                  >
                    <span className="text-sm">{size}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "taskbar":
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-medium ${textColor} mb-4`}>Taskbar Behavior</h3>
              <div className={`flex items-center justify-between p-4 rounded-xl ${bgCard}`}>
                <div>
                  <span className={textColor}>Auto-hide taskbar</span>
                  <p className={`text-sm ${textFaint}`}>Hide taskbar when not in use</p>
                </div>
                <ToggleSwitch
                  enabled={settings.autoHideTaskbar}
                  onChange={(v) => updateSettings({ autoHideTaskbar: v })}
                  isLight={isLight}
                />
              </div>
            </div>

            <div>
              <h3 className={`text-lg font-medium ${textColor} mb-4`}>Pinned Apps</h3>
              <p className={`text-sm ${textMuted} mb-3`}>Choose which apps appear in the taskbar</p>
              <div className="space-y-2">
                {apps.map((app) => {
                  const isPinned = pinnedApps.includes(app.id);
                  return (
                    <div
                      key={app.id}
                      className={`flex items-center justify-between p-3 rounded-xl ${bgCard}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-os-primary/20 to-purple-600/20 flex items-center justify-center">
                          <Icon name={app.icon} size={20} className={textColor} />
                        </div>
                        <span className={textColor}>{app.name}</span>
                      </div>
                      <ToggleSwitch
                        enabled={isPinned}
                        onChange={(v) => v ? pinApp(app.id) : unpinApp(app.id)}
                        isLight={isLight}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case "display":
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-medium ${textColor} mb-4`}>Brightness</h3>
              <Slider
                value={settings.brightness}
                onChange={(v) => updateSettings({ brightness: v })}
                icon="Sun"
              />
            </div>

            <div>
              <h3 className={`text-lg font-medium ${textColor} mb-4`}>Night Light</h3>
              <div className={`flex items-center justify-between p-4 rounded-xl ${bgCard}`}>
                <div className="flex items-center gap-3">
                  <Icon name="Moon" size={20} className="text-orange-400" />
                  <div>
                    <span className={textColor}>Night Light</span>
                    <p className={`text-sm ${textFaint}`}>Reduce blue light for better sleep</p>
                  </div>
                </div>
                <ToggleSwitch
                  enabled={settings.nightLight}
                  onChange={(v) => updateSettings({ nightLight: v })}
                  isLight={isLight}
                />
              </div>
            </div>

            <div>
              <h3 className={`text-lg font-medium ${textColor} mb-4`}>Animations</h3>
              <div className={`flex items-center justify-between p-4 rounded-xl ${bgCard}`}>
                <div>
                  <span className={textColor}>Enable animations</span>
                  <p className={`text-sm ${textFaint}`}>Smooth transitions and effects</p>
                </div>
                <ToggleSwitch
                  enabled={settings.animations}
                  onChange={(v) => updateSettings({ animations: v })}
                  isLight={isLight}
                />
              </div>
            </div>
          </div>
        );

      case "sound":
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-medium ${textColor} mb-4`}>Volume</h3>
              <Slider
                value={settings.volume}
                onChange={(v) => updateSettings({ volume: v })}
                icon="Volume2"
              />
            </div>

            <div>
              <h3 className={`text-lg font-medium ${textColor} mb-4`}>System Sounds</h3>
              <div className={`flex items-center justify-between p-4 rounded-xl ${bgCard}`}>
                <div>
                  <span className={textColor}>Enable system sounds</span>
                  <p className={`text-sm ${textFaint}`}>Play sounds for notifications</p>
                </div>
                <ToggleSwitch
                  enabled={settings.sounds}
                  onChange={(v) => updateSettings({ sounds: v })}
                  isLight={isLight}
                />
              </div>
            </div>
          </div>
        );

      case "network":
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-medium ${textColor} mb-4`}>Wi-Fi</h3>
              <div className={`flex items-center justify-between p-4 rounded-xl ${bgCard} mb-3`}>
                <div className="flex items-center gap-3">
                  <Icon name="Wifi" size={20} className={textMuted} />
                  <div>
                    <span className={textColor}>Wi-Fi</span>
                    <p className={`text-sm ${textFaint}`}>
                      {settings.wifi ? "Connected" : "Disconnected"}
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  enabled={settings.wifi}
                  onChange={(v) => updateSettings({ wifi: v })}
                  isLight={isLight}
                />
              </div>
            </div>

            <div>
              <h3 className={`text-lg font-medium ${textColor} mb-4`}>Bluetooth</h3>
              <div className={`flex items-center justify-between p-4 rounded-xl ${bgCard}`}>
                <div className="flex items-center gap-3">
                  <Icon name="Bluetooth" size={20} className={textMuted} />
                  <div>
                    <span className={textColor}>Bluetooth</span>
                    <p className={`text-sm ${textFaint}`}>
                      {settings.bluetooth ? "On" : "Off"}
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  enabled={settings.bluetooth}
                  onChange={(v) => updateSettings({ bluetooth: v })}
                  isLight={isLight}
                />
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div className={`flex items-center justify-between p-4 rounded-xl ${bgCard}`}>
              <div>
                <span className={textColor}>Notifications</span>
                <p className={`text-sm ${textFaint}`}>Get notifications from apps</p>
              </div>
              <ToggleSwitch
                enabled={settings.notifications}
                onChange={(v) => updateSettings({ notifications: v })}
                isLight={isLight}
              />
            </div>
          </div>
        );

      case "accounts":
        return (
          <div className="space-y-6">
            <div className={`flex items-center gap-4 p-4 rounded-xl ${bgCard}`}>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-os-primary to-purple-600 flex items-center justify-center">
                <Icon name="User" size={32} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className={`text-lg font-medium ${textColor}`}>{username}</h3>
                <p className={`text-sm ${textFaint}`}>Local Account</p>
              </div>
              <button
                className={`px-4 py-2 rounded-lg ${bgCard} ${bgCardHover} ${textMuted} text-sm transition-colors`}
                onClick={() => {
                  setNewUsername(username);
                  setShowUsernameModal(true);
                }}
              >
                Edit
              </button>
            </div>
          </div>
        );

      case "time":
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-medium ${textColor} mb-4`}>Time Format</h3>
              <div className="space-y-3">
                <div className={`flex items-center justify-between p-4 rounded-xl ${bgCard}`}>
                  <span className={textColor}>Use 24-hour format</span>
                  <ToggleSwitch
                    enabled={settings.use24Hour}
                    onChange={(v) => updateSettings({ use24Hour: v })}
                    isLight={isLight}
                  />
                </div>
                <div className={`flex items-center justify-between p-4 rounded-xl ${bgCard}`}>
                  <span className={textColor}>Show seconds in clock</span>
                  <ToggleSwitch
                    enabled={settings.showSeconds}
                    onChange={(v) => updateSettings({ showSeconds: v })}
                    isLight={isLight}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "system":
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-medium ${textColor} mb-4`}>Storage</h3>
              <div className={`p-4 rounded-xl ${bgCard}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={textColor}>System Storage</span>
                  <span className={`text-sm ${textFaint}`}>45.2 GB / 256 GB</span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${settings.theme === 'light' ? 'bg-black/10' : 'bg-white/10'}`}>
                  <div className="h-full bg-os-primary rounded-full" style={{ width: "18%" }} />
                </div>
              </div>
            </div>
          </div>
        );

      case "about":
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-os-primary to-purple-600 flex items-center justify-center text-4xl font-bold text-white">
                C
              </div>
              <h2 className={`text-2xl font-bold ${textColor} mb-2`}>CyberOS</h2>
              <p className={textMuted}>Version 1.0.0</p>
            </div>
            <div className="space-y-2">
              <div className={`flex justify-between p-4 rounded-xl ${bgCard}`}>
                <span className={textMuted}>Device name</span>
                <span className={textColor}>{username}'s PC</span>
              </div>
              <div className={`flex justify-between p-4 rounded-xl ${bgCard}`}>
                <span className={textMuted}>System type</span>
                <span className={textColor}>Web-based OS</span>
              </div>
              <div className={`flex justify-between p-4 rounded-xl ${bgCard}`}>
                <span className={textMuted}>Built with</span>
                <span className={textColor}>React + Tailwind</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-os-primary/20 to-purple-600/20 border border-os-primary/30">
              <h3 className={`text-lg font-medium ${textColor} mb-2`}>Developer</h3>
              <p className={textColor}>Abdul Moiz</p>
              <p className={textMuted}>abdulmoiz8895@gmail.com</p>
            </div>
          </div>
        );

      default:
        return (
          <div className={`flex items-center justify-center h-full ${textFaint}`}>
            <div className="text-center">
              <Icon name="Settings" size={48} className="mx-auto mb-4" />
              <p>Coming soon...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`h-full flex ${settings.theme === 'light' ? 'bg-gray-50' : 'bg-os-bg'}`}>
      {/* Sidebar */}
      <div className={`w-64 border-r ${borderColor} p-4 overflow-y-auto`}>
        <div className="mb-4">
          <div className="relative">
            <Icon
              name="Search"
              size={18}
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${textFaint}`}
            />
            <input
              type="text"
              placeholder="Find a setting"
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${bgCard} ${borderColor} ${textColor} placeholder:${textFaint}`}
            />
          </div>
        </div>
        <div className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                activeTab === tab.id 
                  ? "bg-os-primary/20 text-os-primary" 
                  : `${textMuted} ${bgCardHover}`
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon name={tab.icon} size={20} className={activeTab === tab.id ? "text-os-primary" : ""} />
              <span className="text-sm">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className={`text-2xl font-semibold ${textColor} mb-6`}>
          {tabs.find((t) => t.id === activeTab)?.name}
        </h2>
        {renderContent()}
      </div>

      {/* Modals */}
      <Modal
        isOpen={showWallpaperModal}
        onClose={() => setShowWallpaperModal(false)}
        title="Add Custom Wallpaper"
      >
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter image URL..."
            value={customWallpaperUrl}
            onChange={(e) => setCustomWallpaperUrl(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-os-primary/50 focus:outline-none"
          />
          {customWallpaperUrl && (
            <div className="aspect-video rounded-lg overflow-hidden bg-white/5">
              <img
                src={customWallpaperUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => e.target.style.display = "none"}
              />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowWallpaperModal(false)}
              className="px-4 py-2 rounded-lg text-white/60 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddWallpaper}
              disabled={!customWallpaperUrl}
              className="px-4 py-2 rounded-lg bg-os-primary hover:bg-os-primary/80 text-white transition-colors disabled:opacity-50"
            >
              Add Wallpaper
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showUsernameModal}
        onClose={() => setShowUsernameModal(false)}
        title="Change Username"
      >
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter new username..."
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-os-primary/50 focus:outline-none"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowUsernameModal(false)}
              className="px-4 py-2 rounded-lg text-white/60 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateUsername}
              disabled={!newUsername.trim()}
              className="px-4 py-2 rounded-lg bg-os-primary hover:bg-os-primary/80 text-white transition-colors disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;
