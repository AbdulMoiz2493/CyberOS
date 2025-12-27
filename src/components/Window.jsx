import { useRef } from "react";
import { Rnd } from "react-rnd";
import { useOSStore } from "../store/osStore";
import Icon from "./Icons";
import { motion } from "framer-motion";

const Window = ({ window, children }) => {
  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    activeWindowId,
    settings,
  } = useOSStore();

  const rndRef = useRef(null);
  const isActive = window.id === activeWindowId;
  const isLight = settings.theme === 'light';

  const handleDragStop = (e, d) => {
    updateWindowPosition(window.id, d.x, d.y);
  };

  const handleResizeStop = (e, direction, ref, delta, position) => {
    updateWindowSize(window.id, parseInt(ref.style.width), parseInt(ref.style.height));
    updateWindowPosition(window.id, position.x, position.y);
  };

  if (window.isMinimized) {
    return null;
  }

  const windowContent = (
    <motion.div
      className={`window-shadow rounded-lg overflow-hidden flex flex-col h-full ${
        isActive ? "ring-1 ring-os-primary/50" : ""
      }`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      onMouseDown={() => focusWindow(window.id)}
    >
      {/* Title bar */}
      <div
        className={`window-titlebar flex items-center justify-between px-3 py-2 ${
          isLight 
            ? isActive ? "bg-white" : "bg-gray-100"
            : isActive ? "bg-os-surface" : "bg-os-surface/80"
        }`}
      >
        <div className="flex items-center gap-2">
          <Icon name={window.icon} size={16} className={isLight ? "text-black/80" : "text-white/80"} />
          <span className={`text-sm font-medium ${isLight ? "text-black/90" : "text-white/90"}`}>{window.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            className={`p-1.5 rounded transition-colors ${isLight ? "hover:bg-black/10" : "hover:bg-white/10"}`}
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(window.id);
            }}
          >
            <Icon name="Minus" size={14} className={isLight ? "text-black/60" : "text-white/60"} />
          </button>
          <button
            className={`p-1.5 rounded transition-colors ${isLight ? "hover:bg-black/10" : "hover:bg-white/10"}`}
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(window.id);
            }}
          >
            <Icon
              name={window.isMaximized ? "Minimize2" : "Maximize2"}
              size={14}
              className={isLight ? "text-black/60" : "text-white/60"}
            />
          </button>
          <button
            className="p-1.5 rounded hover:bg-red-500/80 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(window.id);
            }}
          >
            <Icon name="X" size={14} className={isLight ? "text-black/60 hover:text-white" : "text-white/60"} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-hidden ${isLight ? "bg-white" : "bg-os-bg"}`}>{children}</div>
    </motion.div>
  );

  if (window.isMaximized) {
    return (
      <div
        className="fixed inset-0 bottom-12 pointer-events-auto"
        style={{ zIndex: window.zIndex }}
      >
        {windowContent}
      </div>
    );
  }

  return (
    <Rnd
      ref={rndRef}
      default={{
        x: window.x,
        y: window.y,
        width: window.width,
        height: window.height,
      }}
      position={{ x: window.x, y: window.y }}
      size={{ width: window.width, height: window.height }}
      minWidth={window.minWidth}
      minHeight={window.minHeight}
      bounds="parent"
      dragHandleClassName="window-titlebar"
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      style={{ zIndex: window.zIndex, pointerEvents: 'auto' }}
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
    >
      {windowContent}
    </Rnd>
  );
};

export default Window;
