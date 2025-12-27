import { useState, useEffect } from "react";
import { useOSStore } from "../store/osStore";
import { formatTime, formatDate } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "./Icons";

const LockScreen = () => {
  const { unlock, wallpaper, username, settings } = useOSStore();
  const [time, setTime] = useState(new Date());
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUnlock = (e) => {
    e?.preventDefault();
    unlock();
  };

  const handleKeyPress = (e) => {
    if (!showLogin) {
      setShowLogin(true);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showLogin]);

  return (
    <motion.div
      className="w-full h-full relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${wallpaper})`,
          filter: `brightness(${settings.brightness / 100})`,
        }}
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <AnimatePresence mode="wait">
        {!showLogin ? (
          <motion.div
            key="clock"
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
            onClick={() => setShowLogin(true)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <motion.div
              className="text-8xl font-light text-white mb-4 tracking-tight"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              {formatTime(time, settings.use24Hour, false)}
            </motion.div>
            <div className="text-2xl text-white/80 font-light">{formatDate(time)}</div>
            <motion.div 
              className="mt-12 text-white/60 flex items-center gap-2"
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Icon name="ChevronUp" size={20} />
              <span>Click or press any key to unlock</span>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="login"
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <motion.div
              className="w-28 h-28 rounded-full bg-gradient-to-br from-os-primary to-purple-600 flex items-center justify-center mb-6 shadow-2xl"
              whileHover={{ scale: 1.05 }}
            >
              <Icon name="User" size={56} className="text-white" />
            </motion.div>
            <div className="text-2xl text-white mb-2 font-medium">{username}</div>
            <div className="text-sm text-white/50 mb-6">CyberOS</div>
            <form onSubmit={handleUnlock} className="flex flex-col items-center gap-4">
              <div className="relative">
                <input
                  type="password"
                  placeholder="Password (press Enter to unlock)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-80 px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-os-primary/50 focus:outline-none transition-all"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Icon name="ArrowRight" size={20} className="text-white" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowLogin(false)}
                className="text-white/50 hover:text-white transition-colors text-sm"
              >
                Back to clock
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button className="p-2.5 rounded-xl hover:bg-white/10 transition-colors">
            <Icon name="Wifi" size={20} className="text-white" />
          </button>
          <button className="p-2.5 rounded-xl hover:bg-white/10 transition-colors">
            <Icon name="Battery" size={20} className="text-white" />
          </button>
        </div>
        <div className="text-white/60 text-sm">
          CyberOS v1.0.0
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2.5 rounded-xl hover:bg-white/10 transition-colors">
            <Icon name="HelpCircle" size={20} className="text-white" />
          </button>
          <button
            onClick={handleUnlock}
            className="p-2.5 rounded-xl hover:bg-white/10 transition-colors"
          >
            <Icon name="Power" size={20} className="text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LockScreen;
