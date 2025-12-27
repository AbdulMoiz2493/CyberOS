import { useEffect, useRef, useState } from "react";
import { useOSStore } from "../store/osStore";
import Icon from "./Icons";
import { motion, AnimatePresence } from "framer-motion";

const ContextMenu = () => {
  const { contextMenu, hideContextMenu, settings } = useOSStore();
  const menuRef = useRef(null);
  const [submenuOpen, setSubmenuOpen] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isLight = settings.theme === 'light';

  useEffect(() => {
    if (contextMenu) {
      const menu = menuRef.current;
      if (menu) {
        const rect = menu.getBoundingClientRect();
        const x = Math.min(contextMenu.x, window.innerWidth - rect.width - 10);
        const y = Math.min(contextMenu.y, window.innerHeight - rect.height - 10);
        setPosition({ x, y });
      } else {
        setPosition({ x: contextMenu.x, y: contextMenu.y });
      }
    }
  }, [contextMenu]);

  useEffect(() => {
    const handleClick = () => hideContextMenu();
    const handleKeyDown = (e) => {
      if (e.key === "Escape") hideContextMenu();
    };

    if (contextMenu) {
      document.addEventListener("click", handleClick);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [contextMenu, hideContextMenu]);

  if (!contextMenu) return null;

  const renderMenuItem = (item, index) => {
    if (item.type === "separator") {
      return <div key={index} className={`h-px my-1 ${isLight ? 'bg-black/10' : 'bg-white/10'}`} />;
    }

    const hasSubmenu = item.submenu && item.submenu.length > 0;

    return (
      <div
        key={index}
        className="relative"
        onMouseEnter={() => hasSubmenu && setSubmenuOpen(index)}
        onMouseLeave={() => hasSubmenu && setSubmenuOpen(null)}
      >
        <button
          className={`w-full px-3 py-1.5 flex items-center gap-3 transition-colors rounded text-left ${
            isLight ? 'hover:bg-black/5' : 'hover:bg-white/10'
          }`}
          onClick={() => {
            if (item.action) {
              item.action();
              hideContextMenu();
            }
          }}
        >
          {item.icon && (
            <Icon name={item.icon} size={16} className={isLight ? 'text-black/60' : 'text-white/60'} />
          )}
          <span className={`flex-1 text-sm ${isLight ? 'text-black/90' : 'text-white/90'}`}>{item.label}</span>
          {hasSubmenu && (
            <Icon name="ChevronRight" size={14} className={isLight ? 'text-black/40' : 'text-white/40'} />
          )}
        </button>

        {/* Submenu */}
        <AnimatePresence>
          {hasSubmenu && submenuOpen === index && (
            <motion.div
              className={`absolute left-full top-0 ml-1 min-w-[180px] rounded-lg p-1 ${
                isLight ? 'bg-white/95 border border-black/10 shadow-lg' : 'context-menu'
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              {item.submenu.map((subItem, subIndex) =>
                renderMenuItem(subItem, `${index}-${subIndex}`)
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div
      ref={menuRef}
      className={`fixed min-w-[200px] rounded-lg p-1 z-[9999] ${
        isLight ? 'bg-white/95 border border-black/10 shadow-lg backdrop-blur-xl' : 'context-menu'
      }`}
      style={{ left: position.x, top: position.y }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.1 }}
    >
      {contextMenu.items.map((item, index) => renderMenuItem(item, index))}
    </motion.div>
  );
};

export default ContextMenu;
