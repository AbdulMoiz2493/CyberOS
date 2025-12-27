import { useState, useRef } from "react";
import { useOSStore } from "../store/osStore";
import Icon from "./Icons";

const Desktop = () => {
  const {
    wallpaper,
    desktopIcons,
    selectedIcons,
    selectIcon,
    clearSelection,
    updateIconPosition,
    openWindow,
    showContextMenu,
    settings,
  } = useOSStore();

  const desktopRef = useRef(null);
  const [dragging, setDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const lastClickRef = useRef({ id: null, time: 0 });

  const handleDesktopClick = (e) => {
    if (e.target === desktopRef.current) {
      clearSelection();
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    const items = [
      {
        label: "View",
        submenu: [
          { label: "Large icons", action: () => {} },
          { label: "Medium icons", action: () => {} },
          { label: "Small icons", action: () => {} },
          { type: "separator" },
          { label: "Auto arrange icons", action: () => {} },
          { label: "Align icons to grid", action: () => {} },
        ],
      },
      {
        label: "Sort by",
        submenu: [
          { label: "Name", action: () => {} },
          { label: "Size", action: () => {} },
          { label: "Date modified", action: () => {} },
          { label: "Type", action: () => {} },
        ],
      },
      { type: "separator" },
      { label: "Refresh", icon: "RefreshCw", action: () => window.location.reload() },
      { type: "separator" },
      {
        label: "New",
        submenu: [
          { label: "Folder", icon: "FolderPlus", action: () => {} },
          { label: "Text Document", icon: "FileText", action: () => {} },
        ],
      },
      { type: "separator" },
      { label: "Display settings", icon: "Monitor", action: () => openWindow("settings", { tab: "display" }) },
      { label: "Personalize", icon: "Palette", action: () => openWindow("settings", { tab: "personalization" }) },
    ];
    showContextMenu(e.clientX, e.clientY, items);
  };

  const handleIconContextMenu = (e, icon) => {
    e.preventDefault();
    e.stopPropagation();
    selectIcon(icon.id);
    
    const items = [
      { label: "Open", icon: "FolderOpen", action: () => openWindow(icon.id) },
      { type: "separator" },
      { label: "Cut", icon: "Scissors", action: () => {} },
      { label: "Copy", icon: "Copy", action: () => {} },
      { type: "separator" },
      { label: "Delete", icon: "Trash2", action: () => {} },
      { label: "Rename", icon: "Edit", action: () => {} },
      { type: "separator" },
      { label: "Properties", icon: "Info", action: () => {} },
    ];
    showContextMenu(e.clientX, e.clientY, items, icon);
  };

  const handleIconClick = (e, icon) => {
    e.stopPropagation();
    
    const now = Date.now();
    const lastClick = lastClickRef.current;
    
    // Check for double-click (within 300ms on same icon)
    if (lastClick.id === icon.id && now - lastClick.time < 300) {
      // Double-click detected - open the app
      openWindow(icon.id);
      lastClickRef.current = { id: null, time: 0 };
      return;
    }
    
    // Single click - select icon
    lastClickRef.current = { id: icon.id, time: now };
    
    if (!e.ctrlKey && !e.shiftKey) {
      selectIcon(icon.id);
    } else {
      selectIcon(icon.id, true);
    }
  };

  const handleIconMouseDown = (e, icon) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDragging(icon.id);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    
    const desktop = desktopRef.current;
    const rect = desktop.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left - dragOffset.x, rect.width - 80));
    const y = Math.max(0, Math.min(e.clientY - rect.top - dragOffset.y, rect.height - 100));
    
    updateIconPosition(dragging, x, y);
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const iconSizes = {
    small: 32,
    medium: 40,
    large: 48,
  };

  const currentIconSize = iconSizes[settings.iconSize] || iconSizes.medium;

  return (
    <div
      ref={desktopRef}
      className={`absolute inset-0 bottom-12 overflow-hidden ${settings.theme === 'light' ? 'bg-gray-100' : ''}`}
      style={{
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: `brightness(${settings.brightness / 100})`,
      }}
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Night light overlay */}
      {settings.nightLight && (
        <div className="absolute inset-0 bg-orange-500/20 pointer-events-none" />
      )}

      {/* Desktop icons */}
      {desktopIcons.map((icon) => (
        <div
          key={icon.id}
          className={`absolute w-20 p-2 rounded-lg cursor-pointer select-none flex flex-col items-center gap-1 transition-all duration-150 ${
            selectedIcons.includes(icon.id) 
              ? "bg-os-primary/30 ring-1 ring-os-primary/50" 
              : "hover:bg-white/10"
          } ${dragging === icon.id ? "opacity-70" : "hover:scale-[1.02] active:scale-[0.98]"}`}
          style={{ left: icon.x, top: icon.y }}
          onClick={(e) => handleIconClick(e, icon)}
          onMouseDown={(e) => handleIconMouseDown(e, icon)}
          onContextMenu={(e) => handleIconContextMenu(e, icon)}
        >
          <div className="flex items-center justify-center">
            <Icon name={icon.icon} size={currentIconSize} className="text-white drop-shadow-lg" />
          </div>
          <span className="text-xs text-white text-center drop-shadow-lg line-clamp-2 font-medium">
            {icon.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Desktop;
