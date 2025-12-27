import { useState, useRef } from "react";
import Icon from "../Icons";
import { useOSStore } from "../../store/osStore";

const Browser = ({ window }) => {
  const { settings } = useOSStore();
  const isLight = settings.theme === 'light';
  const textColor = isLight ? 'text-black' : 'text-white';
  const textMuted = isLight ? 'text-black/60' : 'text-white/60';
  const textFaint = isLight ? 'text-black/40' : 'text-white/40';
  const bgCard = isLight ? 'bg-black/5' : 'bg-white/5';
  const bgHover = isLight ? 'hover:bg-black/10' : 'hover:bg-white/10';
  const borderColor = isLight ? 'border-black/10' : 'border-white/10';

  // Tab state
  const [tabs, setTabs] = useState([
    { id: 1, title: "New Tab", url: "", isHome: true }
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [nextTabId, setNextTabId] = useState(2);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  
  const [inputUrl, setInputUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState([
    { name: "Google", url: "https://www.google.com/webhp?igu=1" },
    { name: "Wikipedia", url: "https://www.wikipedia.org" },
    { name: "DuckDuckGo", url: "https://duckduckgo.com" },
  ]);
  const iframeRef = useRef(null);

  const updateTab = (tabId, updates) => {
    setTabs(tabs.map(t => t.id === tabId ? { ...t, ...updates } : t));
  };

  const navigate = (newUrl) => {
    let finalUrl = newUrl;
    if (!newUrl.startsWith("http://") && !newUrl.startsWith("https://")) {
      if (newUrl.includes(".") && !newUrl.includes(" ")) {
        finalUrl = "https://" + newUrl;
      } else {
        finalUrl = `https://duckduckgo.com/?q=${encodeURIComponent(newUrl)}`;
      }
    }
    
    setIsLoading(true);
    
    // Get title from URL
    let title = "Loading...";
    try {
      title = new URL(finalUrl).hostname;
    } catch {}
    
    updateTab(activeTabId, { url: finalUrl, title, isHome: false, history: [...(activeTab.history || []), finalUrl] });
    setInputUrl(finalUrl);
  };

  const goBack = () => {
    const history = activeTab.history || [];
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const prevUrl = newHistory[newHistory.length - 1];
      updateTab(activeTabId, { url: prevUrl, history: newHistory, isHome: false });
      setInputUrl(prevUrl);
    }
  };

  const goForward = () => {
    // Simplified - just refresh for now
  };

  const goHome = () => {
    updateTab(activeTabId, { url: "", title: "New Tab", isHome: true, history: [] });
    setInputUrl("");
  };

  const refresh = () => {
    if (activeTab.url) {
      setIsLoading(true);
      if (iframeRef.current) {
        iframeRef.current.src = activeTab.url;
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      navigate(inputUrl.trim());
    }
  };

  const addNewTab = () => {
    const newTab = { id: nextTabId, title: "New Tab", url: "", isHome: true, history: [] };
    setTabs([...tabs, newTab]);
    setActiveTabId(nextTabId);
    setNextTabId(nextTabId + 1);
    setInputUrl("");
  };

  const closeTab = (tabId, e) => {
    e.stopPropagation();
    if (tabs.length === 1) {
      // Don't close last tab, just reset it
      updateTab(tabId, { url: "", title: "New Tab", isHome: true, history: [] });
      setInputUrl("");
      return;
    }
    
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);
    
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
      setInputUrl(newTabs[newTabs.length - 1].url || "");
    }
  };

  const switchTab = (tabId) => {
    setActiveTabId(tabId);
    const tab = tabs.find(t => t.id === tabId);
    setInputUrl(tab?.url || "");
  };

  const addBookmark = () => {
    if (activeTab.url) {
      const name = activeTab.title || new URL(activeTab.url).hostname;
      setBookmarks([...bookmarks, { name, url: activeTab.url }]);
    }
  };

  const quickLinks = [
    { name: "DuckDuckGo", url: "https://duckduckgo.com", icon: "🦆" },
    { name: "Wikipedia", url: "https://www.wikipedia.org", icon: "📚" },
    { name: "Reddit", url: "https://www.reddit.com", icon: "🔴" },
    { name: "GitHub", url: "https://github.com", icon: "🐙" },
    { name: "Stack Overflow", url: "https://stackoverflow.com", icon: "📋" },
    { name: "MDN Docs", url: "https://developer.mozilla.org", icon: "📖" },
  ];

  return (
    <div className={`h-full flex flex-col ${isLight ? 'bg-gray-50' : 'bg-os-surface'}`}>
      {/* Tab bar */}
      <div className={`flex items-center gap-1 px-2 pt-2 border-b ${borderColor} ${isLight ? 'bg-gray-100' : 'bg-os-bg'}`}>
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`group flex items-center gap-2 px-3 py-1.5 rounded-t-lg cursor-pointer max-w-[200px] min-w-[100px] transition-colors ${
              activeTabId === tab.id 
                ? (isLight ? 'bg-gray-50' : 'bg-os-surface') 
                : `${bgHover} ${isLight ? 'bg-gray-200/50' : 'bg-white/5'}`
            }`}
            onClick={() => switchTab(tab.id)}
          >
            <Icon name="Globe" size={14} className={textMuted} />
            <span className={`flex-1 text-sm truncate ${activeTabId === tab.id ? textColor : textMuted}`}>
              {tab.title}
            </span>
            <button
              className={`p-0.5 rounded opacity-0 group-hover:opacity-100 ${bgHover} transition-all`}
              onClick={(e) => closeTab(tab.id, e)}
            >
              <Icon name="X" size={12} className={textMuted} />
            </button>
          </div>
        ))}
        <button
          className={`p-1.5 rounded ${bgHover} transition-colors`}
          onClick={addNewTab}
          title="New Tab"
        >
          <Icon name="Plus" size={16} className={textMuted} />
        </button>
      </div>

      {/* Toolbar */}
      <div className={`flex items-center gap-2 p-2 border-b ${borderColor}`}>
        <button
          className={`p-1.5 rounded ${bgHover} transition-colors disabled:opacity-50`}
          onClick={goBack}
          disabled={!activeTab.history?.length || activeTab.history.length <= 1}
        >
          <Icon name="ArrowLeft" size={18} className={textMuted} />
        </button>
        <button
          className={`p-1.5 rounded ${bgHover} transition-colors disabled:opacity-50`}
          onClick={goForward}
          disabled={true}
        >
          <Icon name="ArrowRight" size={18} className={textMuted} />
        </button>
        <button
          className={`p-1.5 rounded ${bgHover} transition-colors`}
          onClick={refresh}
        >
          <Icon
            name={isLoading ? "X" : "RefreshCw"}
            size={18}
            className={textMuted}
          />
        </button>
        <button
          className={`p-1.5 rounded ${bgHover} transition-colors`}
          onClick={goHome}
        >
          <Icon name="Home" size={18} className={textMuted} />
        </button>

        {/* URL bar */}
        <form onSubmit={handleSubmit} className="flex-1">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${bgCard} border ${borderColor} focus-within:border-os-primary/50`}>
            {activeTab.url && <Icon name="Lock" size={14} className="text-green-400" />}
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className={`flex-1 bg-transparent text-sm ${isLight ? 'text-black/90' : 'text-white/90'} outline-none`}
              placeholder="Search or enter URL"
            />
          </div>
        </form>

        <button
          className={`p-1.5 rounded ${bgHover} transition-colors`}
          onClick={addBookmark}
          disabled={!activeTab.url}
        >
          <Icon name="Star" size={18} className={textMuted} />
        </button>
        <button className={`p-1.5 rounded ${bgHover} transition-colors`}>
          <Icon name="MoreVertical" size={18} className={textMuted} />
        </button>
      </div>

      {/* Bookmarks bar */}
      <div className={`flex items-center gap-1 px-2 py-1 border-b ${borderColor} overflow-x-auto`}>
        {bookmarks.map((bookmark, index) => (
          <button
            key={index}
            className={`flex items-center gap-1.5 px-2 py-1 rounded ${bgHover} transition-colors text-sm ${textMuted} whitespace-nowrap`}
            onClick={() => navigate(bookmark.url)}
          >
            <Icon name="Globe" size={14} />
            {bookmark.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={`flex-1 relative ${isLight ? 'bg-white' : 'bg-os-bg'} overflow-hidden`}>
        {activeTab.isHome ? (
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className={`text-6xl font-bold ${textColor} mb-2`}>CyberOS</div>
            <div className={`text-xl ${textMuted} mb-8`}>Browser</div>
            
            {/* Search box */}
            <form onSubmit={handleSubmit} className="w-full max-w-xl mb-8">
              <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${bgCard} border ${borderColor} focus-within:border-os-primary/50`}>
                <Icon name="Search" size={20} className={textFaint} />
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className={`flex-1 bg-transparent ${textColor} outline-none`}
                  placeholder="Search the web or enter URL..."
                  autoFocus
                />
              </div>
            </form>

            {/* Quick links */}
            <div className="grid grid-cols-6 gap-4 max-w-2xl">
              {quickLinks.map((link, index) => (
                <button
                  key={index}
                  className={`p-4 rounded-xl ${bgCard} ${bgHover} transition-colors flex flex-col items-center gap-2`}
                  onClick={() => navigate(link.url)}
                >
                  <span className="text-2xl">{link.icon}</span>
                  <span className={`text-xs ${textMuted}`}>{link.name}</span>
                </button>
              ))}
            </div>

            <div className={`mt-8 text-sm ${textFaint} text-center max-w-md`}>
              Note: Some websites may not load due to security restrictions (X-Frame-Options). 
              Try DuckDuckGo or Wikipedia for best results.
            </div>
          </div>
        ) : (
          <>
            <iframe
              ref={iframeRef}
              src={activeTab.url}
              className="w-full h-full border-0"
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
              title="Browser"
            />
            {isLoading && (
              <div className={`absolute inset-0 ${isLight ? 'bg-white' : 'bg-os-bg'} flex items-center justify-center`}>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-2 border-os-primary border-t-transparent rounded-full animate-spin" />
                  <span className={textMuted}>Loading...</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Browser;
