import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "../Icons";
import { useOSStore } from "../../store/osStore";

export const Modal = ({ isOpen, onClose, title, children, size = "sm" }) => {
  const modalRef = useRef(null);
  const { settings } = useOSStore();
  const isLight = settings.theme === 'light';

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            ref={modalRef}
            className={`relative w-full ${sizeClasses[size]} mx-4 rounded-xl shadow-2xl overflow-hidden ${
              isLight 
                ? 'bg-white border border-black/10' 
                : 'bg-os-surface border border-white/10'
            }`}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-4 py-3 border-b ${
              isLight ? 'border-black/10' : 'border-white/10'
            }`}>
              <h3 className={`text-lg font-medium ${isLight ? 'text-black' : 'text-white'}`}>{title}</h3>
              <button
                className={`p-1 rounded transition-colors ${
                  isLight ? 'hover:bg-black/10' : 'hover:bg-white/10'
                }`}
                onClick={onClose}
              >
                <Icon name="X" size={18} className={isLight ? 'text-black/60' : 'text-white/60'} />
              </button>
            </div>
            {/* Content */}
            <div className="p-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const InputModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  placeholder = "",
  defaultValue = "",
  submitText = "Create",
}) => {
  const inputRef = useRef(null);
  const [value, setValue] = useState(defaultValue);
  const { settings } = useOSStore();
  const isLight = settings.theme === 'light';

  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, defaultValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-lg border focus:outline-none transition-colors ${
            isLight 
              ? 'bg-black/5 border-black/10 text-black placeholder-black/40 focus:border-os-primary/50'
              : 'bg-white/5 border-white/10 text-white placeholder-white/40 focus:border-os-primary/50'
          }`}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isLight ? 'text-black/60 hover:bg-black/10' : 'text-white/60 hover:bg-white/10'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-os-primary hover:bg-os-primary/80 text-white transition-colors"
          >
            {submitText}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
}) => {
  const { settings } = useOSStore();
  const isLight = settings.theme === 'light';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className={`mb-6 ${isLight ? 'text-black/70' : 'text-white/70'}`}>{message}</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className={`px-4 py-2 rounded-lg transition-colors ${
            isLight ? 'text-black/60 hover:bg-black/10' : 'text-white/60 hover:bg-white/10'
          }`}
        >
          {cancelText}
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-4 py-2 rounded-lg text-white transition-colors ${
            danger
              ? "bg-red-500 hover:bg-red-600"
              : "bg-os-primary hover:bg-os-primary/80"
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};


