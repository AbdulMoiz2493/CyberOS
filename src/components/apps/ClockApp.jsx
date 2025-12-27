import { useState, useEffect } from "react";
import Icon from "../Icons";
import { useOSStore } from "../../store/osStore";

const ClockApp = () => {
  const { settings } = useOSStore();
  const isLight = settings.theme === 'light';
  const textColor = isLight ? 'text-black' : 'text-white';
  const textMuted = isLight ? 'text-black/60' : 'text-white/60';
  const textFaint = isLight ? 'text-black/40' : 'text-white/40';
  const bgCard = isLight ? 'bg-black/5' : 'bg-white/5';
  const bgCard10 = isLight ? 'bg-black/10' : 'bg-white/10';
  const bgHover = isLight ? 'hover:bg-black/20' : 'hover:bg-white/20';
  const borderColor = isLight ? 'border-black/10' : 'border-white/10';

  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("clock");
  const [alarms, setAlarms] = useState([
    { id: 1, time: "07:00", label: "Wake up", enabled: true, days: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
    { id: 2, time: "08:30", label: "Meeting", enabled: false, days: ["Mon", "Wed"] },
  ]);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [timerTime, setTimerTime] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerInitial, setTimerInitial] = useState(300);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval;
    if (stopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchTime((prev) => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [stopwatchRunning]);

  useEffect(() => {
    let interval;
    if (timerRunning && timerTime > 0) {
      interval = setInterval(() => {
        setTimerTime((prev) => prev - 1);
      }, 1000);
    } else if (timerTime === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerTime]);

  const formatStopwatch = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const tabs = [
    { id: "clock", name: "Clock", icon: "Clock" },
    { id: "alarm", name: "Alarm", icon: "Bell" },
    { id: "stopwatch", name: "Stopwatch", icon: "Timer" },
    { id: "timer", name: "Timer", icon: "Hourglass" },
  ];

  const worldClocks = [
    { city: "New York", offset: -5 },
    { city: "London", offset: 0 },
    { city: "Tokyo", offset: 9 },
    { city: "Sydney", offset: 11 },
  ];

  return (
    <div className={`h-full flex flex-col ${isLight ? 'bg-gray-50' : 'bg-os-bg'}`}>
      {/* Tabs */}
      <div className={`flex border-b ${borderColor}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm transition-colors ${
              activeTab === tab.id
                ? `${textColor} border-b-2 border-os-primary`
                : `${textMuted} hover:${textColor}`
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon name={tab.icon} size={16} />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "clock" && (
          <div className="space-y-6">
            {/* Main clock */}
            <div className="text-center py-8">
              <div className={`text-6xl font-light ${textColor} mb-2`}>
                {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </div>
              <div className={textMuted}>
                {time.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </div>
            </div>

            {/* World clocks */}
            <div>
              <h3 className={`text-sm font-medium ${textMuted} mb-3`}>World Clocks</h3>
              <div className="grid grid-cols-2 gap-3">
                {worldClocks.map((clock) => {
                  const localTime = new Date(time.getTime() + clock.offset * 3600000);
                  return (
                    <div key={clock.city} className={`p-4 rounded-xl ${bgCard}`}>
                      <div className={`text-sm ${textMuted} mb-1`}>{clock.city}</div>
                      <div className={`text-2xl font-light ${textColor}`}>
                        {localTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "alarm" && (
          <div className="space-y-3">
            {alarms.map((alarm) => (
              <div
                key={alarm.id}
                className={`p-4 rounded-xl transition-colors ${
                  alarm.enabled ? bgCard10 : bgCard
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`text-3xl font-light ${textColor}`}>{alarm.time}</div>
                  <button
                    className={`w-12 h-6 rounded-full transition-colors ${
                      alarm.enabled ? "bg-os-primary" : (isLight ? "bg-black/20" : "bg-white/20")
                    }`}
                    onClick={() => {
                      setAlarms(alarms.map((a) =>
                        a.id === alarm.id ? { ...a, enabled: !a.enabled } : a
                      ));
                    }}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        alarm.enabled ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
                <div className={`text-sm ${textMuted}`}>{alarm.label}</div>
                <div className={`text-xs ${textFaint} mt-1`}>{alarm.days.join(", ")}</div>
              </div>
            ))}
            <button className={`w-full p-4 rounded-xl border-2 border-dashed ${isLight ? 'border-black/20 hover:border-black/40' : 'border-white/20 hover:border-white/40'} ${textMuted} hover:${textColor} transition-colors`}>
              <Icon name="Plus" size={24} className="mx-auto" />
            </button>
          </div>
        )}

        {activeTab === "stopwatch" && (
          <div className="text-center py-8">
            <div className={`text-6xl font-light ${textColor} mb-8 font-mono`}>
              {formatStopwatch(stopwatchTime)}
            </div>
            <div className="flex items-center justify-center gap-4">
              <button
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                  stopwatchRunning
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-os-primary hover:bg-os-primary/80"
                }`}
                onClick={() => setStopwatchRunning(!stopwatchRunning)}
              >
                <Icon name={stopwatchRunning ? "Pause" : "Play"} size={24} className="text-white" />
              </button>
              <button
                className={`w-16 h-16 rounded-full ${bgCard10} ${bgHover} flex items-center justify-center transition-colors`}
                onClick={() => {
                  setStopwatchRunning(false);
                  setStopwatchTime(0);
                }}
              >
                <Icon name="RotateCcw" size={24} className={textColor} />
              </button>
            </div>
          </div>
        )}

        {activeTab === "timer" && (
          <div className="text-center py-8">
            <div className={`text-6xl font-light ${textColor} mb-8 font-mono`}>
              {formatTimer(timerTime)}
            </div>
            {!timerRunning && timerTime === timerInitial && (
              <div className="flex items-center justify-center gap-4 mb-8">
                {[60, 300, 600, 1800].map((seconds) => (
                  <button
                    key={seconds}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      timerInitial === seconds ? "bg-os-primary" : `${bgCard10} ${bgHover}`
                    }`}
                    onClick={() => {
                      setTimerInitial(seconds);
                      setTimerTime(seconds);
                    }}
                  >
                    <span className={timerInitial === seconds ? "text-white" : textColor}>{seconds / 60}m</span>
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-center justify-center gap-4">
              <button
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                  timerRunning
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-os-primary hover:bg-os-primary/80"
                }`}
                onClick={() => setTimerRunning(!timerRunning)}
              >
                <Icon name={timerRunning ? "Pause" : "Play"} size={24} className="text-white" />
              </button>
              <button
                className={`w-16 h-16 rounded-full ${bgCard10} ${bgHover} flex items-center justify-center transition-colors`}
                onClick={() => {
                  setTimerRunning(false);
                  setTimerTime(timerInitial);
                }}
              >
                <Icon name="RotateCcw" size={24} className={textColor} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClockApp;
