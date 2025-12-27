import { useState, useEffect } from "react";
import { useOSStore } from "../../store/osStore";
import Icon from "../Icons";

const TaskManager = () => {
  const { windows, closeWindow, settings } = useOSStore();
  const isLight = settings.theme === 'light';
  const textColor = isLight ? 'text-black' : 'text-white';
  const textMuted = isLight ? 'text-black/60' : 'text-white/60';
  const textFaint = isLight ? 'text-black/40' : 'text-white/40';
  const bgCard = isLight ? 'bg-black/5' : 'bg-white/5';
  const bgHover = isLight ? 'hover:bg-black/5' : 'hover:bg-white/5';
  const borderColor = isLight ? 'border-black/10' : 'border-white/10';

  const [activeTab, setActiveTab] = useState("processes");
  const [processes, setProcesses] = useState([]);
  const [systemStats, setSystemStats] = useState({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
  });

  useEffect(() => {
    // Simulate system processes
    const systemProcesses = [
      { name: "System", cpu: 2, memory: 150, disk: 0, status: "Running" },
      { name: "WebOS Core", cpu: 5, memory: 200, disk: 1, status: "Running" },
      { name: "Window Manager", cpu: 3, memory: 80, disk: 0, status: "Running" },
      { name: "Desktop", cpu: 1, memory: 50, disk: 0, status: "Running" },
      { name: "Taskbar", cpu: 1, memory: 30, disk: 0, status: "Running" },
    ];

    const appProcesses = windows.map((w) => ({
      name: w.title,
      cpu: Math.floor(Math.random() * 10) + 1,
      memory: Math.floor(Math.random() * 200) + 50,
      disk: Math.floor(Math.random() * 5),
      status: w.isMinimized ? "Suspended" : "Running",
      windowId: w.id,
    }));

    setProcesses([...systemProcesses, ...appProcesses]);

    // Simulate changing stats
    const interval = setInterval(() => {
      setSystemStats({
        cpu: Math.floor(Math.random() * 30) + 10,
        memory: Math.floor(Math.random() * 20) + 40,
        disk: Math.floor(Math.random() * 10) + 5,
        network: Math.floor(Math.random() * 100),
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [windows]);

  const handleEndTask = (process) => {
    if (process.windowId) {
      closeWindow(process.windowId);
    }
  };

  const tabs = [
    { id: "processes", name: "Processes", icon: "List" },
    { id: "performance", name: "Performance", icon: "Activity" },
    { id: "startup", name: "Startup", icon: "Zap" },
    { id: "users", name: "Users", icon: "User" },
  ];

  return (
    <div className={`h-full flex flex-col ${isLight ? 'bg-gray-50' : 'bg-os-bg'}`}>
      {/* Tabs */}
      <div className={`flex border-b ${borderColor} ${isLight ? 'bg-white/50' : 'bg-os-surface/50'}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
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
      <div className="flex-1 overflow-hidden">
        {activeTab === "processes" && (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className={`grid grid-cols-5 gap-4 px-4 py-2 border-b ${borderColor} text-xs ${textMuted} uppercase tracking-wider`}>
              <span>Name</span>
              <span className="text-right">CPU</span>
              <span className="text-right">Memory</span>
              <span className="text-right">Disk</span>
              <span className="text-right">Status</span>
            </div>

            {/* Process list */}
            <div className="flex-1 overflow-y-auto">
              {processes.map((process, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-5 gap-4 px-4 py-2 ${bgHover} transition-colors group`}
                >
                  <span className={`text-sm ${textMuted} truncate`}>{process.name}</span>
                  <span className={`text-sm ${textMuted} text-right`}>{process.cpu}%</span>
                  <span className={`text-sm ${textMuted} text-right`}>{process.memory} MB</span>
                  <span className={`text-sm ${textMuted} text-right`}>{process.disk} MB/s</span>
                  <div className="flex items-center justify-end gap-2">
                    <span
                      className={`text-sm ${
                        process.status === "Running" ? "text-green-400" : "text-yellow-400"
                      }`}
                    >
                      {process.status}
                    </span>
                    {process.windowId && (
                      <button
                        className="opacity-0 group-hover:opacity-100 px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                        onClick={() => handleEndTask(process)}
                      >
                        End
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className={`px-4 py-2 border-t ${borderColor} flex justify-between items-center`}>
              <span className={`text-xs ${textFaint}`}>{processes.length} processes</span>
              <button className="px-3 py-1 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                End task
              </button>
            </div>
          </div>
        )}

        {activeTab === "performance" && (
          <div className="p-4 grid grid-cols-2 gap-4">
            {/* CPU */}
            <div className={`p-4 rounded-lg ${bgCard}`}>
              <div className="flex items-center justify-between mb-4">
                <span className={textMuted}>CPU</span>
                <span className={`text-2xl font-light ${textColor}`}>{systemStats.cpu}%</span>
              </div>
              <div className={`h-24 ${bgCard} rounded relative overflow-hidden`}>
                <div
                  className="absolute bottom-0 left-0 right-0 bg-os-primary/50 transition-all duration-500"
                  style={{ height: `${systemStats.cpu}%` }}
                />
              </div>
              <div className={`mt-2 text-xs ${textFaint}`}>
                <div>Utilization: {systemStats.cpu}%</div>
                <div>Speed: 2.4 GHz</div>
              </div>
            </div>

            {/* Memory */}
            <div className={`p-4 rounded-lg ${bgCard}`}>
              <div className="flex items-center justify-between mb-4">
                <span className={textMuted}>Memory</span>
                <span className={`text-2xl font-light ${textColor}`}>{systemStats.memory}%</span>
              </div>
              <div className={`h-24 ${bgCard} rounded relative overflow-hidden`}>
                <div
                  className="absolute bottom-0 left-0 right-0 bg-purple-500/50 transition-all duration-500"
                  style={{ height: `${systemStats.memory}%` }}
                />
              </div>
              <div className={`mt-2 text-xs ${textFaint}`}>
                <div>In use: {Math.round(systemStats.memory * 0.16)} GB</div>
                <div>Available: {Math.round((100 - systemStats.memory) * 0.16)} GB</div>
              </div>
            </div>

            {/* Disk */}
            <div className={`p-4 rounded-lg ${bgCard}`}>
              <div className="flex items-center justify-between mb-4">
                <span className={textMuted}>Disk</span>
                <span className={`text-2xl font-light ${textColor}`}>{systemStats.disk}%</span>
              </div>
              <div className={`h-24 ${bgCard} rounded relative overflow-hidden`}>
                <div
                  className="absolute bottom-0 left-0 right-0 bg-green-500/50 transition-all duration-500"
                  style={{ height: `${systemStats.disk}%` }}
                />
              </div>
              <div className={`mt-2 text-xs ${textFaint}`}>
                <div>Active time: {systemStats.disk}%</div>
                <div>Read/Write: {Math.round(systemStats.disk * 2)} MB/s</div>
              </div>
            </div>

            {/* Network */}
            <div className={`p-4 rounded-lg ${bgCard}`}>
              <div className="flex items-center justify-between mb-4">
                <span className={textMuted}>Network</span>
                <span className={`text-2xl font-light ${textColor}`}>{systemStats.network} Kbps</span>
              </div>
              <div className={`h-24 ${bgCard} rounded relative overflow-hidden`}>
                <div
                  className="absolute bottom-0 left-0 right-0 bg-blue-500/50 transition-all duration-500"
                  style={{ height: `${Math.min(systemStats.network, 100)}%` }}
                />
              </div>
              <div className={`mt-2 text-xs ${textFaint}`}>
                <div>Send: {Math.round(systemStats.network * 0.3)} Kbps</div>
                <div>Receive: {Math.round(systemStats.network * 0.7)} Kbps</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "startup" && (
          <div className="p-4">
            <div className={`${textFaint} text-center py-8`}>
              No startup apps configured
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="p-4">
            <div className={`flex items-center gap-3 p-3 rounded-lg ${bgCard}`}>
              <div className="w-10 h-10 rounded-full bg-os-primary flex items-center justify-center">
                <Icon name="User" size={20} className="text-white" />
              </div>
              <div>
                <div className={textColor}>User</div>
                <div className={`text-xs ${textFaint}`}>Active</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;
