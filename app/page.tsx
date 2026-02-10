import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, ChevronDown, ArrowLeft, ArrowRight, RotateCw, Minus, Maximize2, Bookmark, Star, Download, Eye, Menu, MoreVertical, Clock, Trash2, FolderOpen, Settings, Home, Search } from 'lucide-react';

interface Tab {
  id: number;
  title: string;
  url: string;
  isActive: boolean;
  favicon: string;
  history: string[];
  historyIndex: number;
  isLoading: boolean;
}

interface BookmarkItem {
  id: number;
  title: string;
  url: string;
  favicon: string;
}

interface HistoryItem {
  id: number;
  url: string;
  title: string;
  timestamp: Date;
}

interface DownloadItem {
  id: number;
  name: string;
  size: string;
}

type MenuType = 'bookmarks' | 'history' | 'downloads' | 'settings' | null;

export default function ChromeBrowser() {
  const [tabs, setTabs] = useState<Tab[]>([
    { 
      id: 1, 
      title: 'New Tab', 
      url: 'about:newtab', 
      isActive: true, 
      favicon: '🌐',
      history: ['about:newtab'],
      historyIndex: 0,
      isLoading: false
    }
  ]);
  const [nextId, setNextId] = useState<number>(2);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([
    { id: 1, title: 'Google', url: 'https://www.google.com', favicon: '🔍' },
    { id: 2, title: 'GitHub', url: 'https://github.com', favicon: '💻' },
    { id: 3, title: 'YouTube', url: 'https://www.youtube.com', favicon: '📺' },
    { id: 4, title: 'Wikipedia', url: 'https://www.wikipedia.org', favicon: '📚' },
    { id: 5, title: 'Twitter', url: 'https://twitter.com', favicon: '🐦' },
  ]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [showMenu, setShowMenu] = useState<MenuType>(null);
  const [showBookmarkBar, setShowBookmarkBar] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [addressBarValue, setAddressBarValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const activeTab = tabs.find(tab => tab.isActive);

  useEffect(() => {
    if (activeTab) {
      setAddressBarValue(activeTab.url === 'about:newtab' ? '' : activeTab.url);
    }
  }, [activeTab?.id]);

  const createNewTab = (): void => {
    setTabs(prev => prev.map(tab => ({ ...tab, isActive: false })).concat({
      id: nextId,
      title: 'New Tab',
      url: 'about:newtab',
      isActive: true,
      favicon: '🌐',
      history: ['about:newtab'],
      historyIndex: 0,
      isLoading: false
    }));
    setNextId(prev => prev + 1);
  };

  const closeTab = (tabId: number): void => {
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    
    if (newTabs.length === 0) {
      setTabs([{ 
        id: nextId, 
        title: 'New Tab', 
        url: 'about:newtab', 
        isActive: true, 
        favicon: '🌐',
        history: ['about:newtab'],
        historyIndex: 0,
        isLoading: false
      }]);
      setNextId(prev => prev + 1);
    } else {
      if (tabs[tabIndex].isActive) {
        const newActiveIndex = Math.min(tabIndex, newTabs.length - 1);
        newTabs[newActiveIndex].isActive = true;
      }
      setTabs(newTabs);
    }
  };

  const switchTab = (tabId: number): void => {
    setTabs(prev => prev.map(tab => ({
      ...tab,
      isActive: tab.id === tabId
    })));
  };

  const navigateToUrl = (url: string, addToHistory: boolean = true): void => {
    if (!url || url === 'about:newtab') {
      setTabs(prev => prev.map(tab => 
        tab.isActive ? { 
          ...tab, 
          url: 'about:newtab', 
          title: 'New Tab',
          favicon: '🌐',
          isLoading: false
        } : tab
      ));
      return;
    }

    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('about:')) {
      // Check if it's a search query or URL
      if (url.includes(' ') || !url.includes('.')) {
        finalUrl = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      } else {
        finalUrl = 'https://' + url;
      }
    }

    setTabs(prev => prev.map(tab => {
      if (!tab.isActive) return tab;
      
      const newHistory = addToHistory 
        ? [...tab.history.slice(0, tab.historyIndex + 1), finalUrl]
        : tab.history;
      
      return { 
        ...tab, 
        url: finalUrl, 
        title: 'Loading...',
        isLoading: true,
        history: newHistory,
        historyIndex: addToHistory ? newHistory.length - 1 : tab.historyIndex
      };
    }));

    // Add to global history
    if (addToHistory) {
      setHistory(prev => [{
        url: finalUrl,
        title: finalUrl.replace(/^https?:\/\//, '').split('/')[0],
        timestamp: new Date(),
        id: Date.now()
      }, ...prev]);
    }

    // Simulate page load
    setTimeout(() => {
      setTabs(prev => prev.map(tab => 
        tab.isActive ? { 
          ...tab, 
          title: finalUrl.replace(/^https?:\/\//, '').split('/')[0].split('?')[0],
          isLoading: false,
          favicon: getFaviconForUrl(finalUrl)
        } : tab
      ));
    }, 800);
  };

  const getFaviconForUrl = (url: string): string => {
    if (url.includes('google.com')) return '🔍';
    if (url.includes('github.com')) return '💻';
    if (url.includes('youtube.com')) return '📺';
    if (url.includes('wikipedia.org')) return '📚';
    if (url.includes('twitter.com') || url.includes('x.com')) return '🐦';
    if (url.includes('reddit.com')) return '🤖';
    if (url.includes('stackoverflow.com')) return '📝';
    if (url.includes('medium.com')) return '✍️';
    if (url.includes('netflix.com')) return '🎬';
    if (url.includes('amazon.com')) return '🛒';
    return '🌐';
  };

  const handleUrlSubmit = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      navigateToUrl(addressBarValue);
      inputRef.current?.blur();
    }
  };

  const goBack = (): void => {
    const tab = tabs.find(t => t.isActive);
    if (tab && tab.historyIndex > 0) {
      setTabs(prev => prev.map(t => 
        t.isActive ? { ...t, historyIndex: t.historyIndex - 1 } : t
      ));
      navigateToUrl(tab.history[tab.historyIndex - 1], false);
    }
  };

  const goForward = (): void => {
    const tab = tabs.find(t => t.isActive);
    if (tab && tab.historyIndex < tab.history.length - 1) {
      setTabs(prev => prev.map(t => 
        t.isActive ? { ...t, historyIndex: t.historyIndex + 1 } : t
      ));
      navigateToUrl(tab.history[tab.historyIndex + 1], false);
    }
  };

  const reload = (): void => {
    if (activeTab) {
      setTabs(prev => prev.map(tab => 
        tab.isActive ? { ...tab, isLoading: true } : tab
      ));
      setTimeout(() => {
        setTabs(prev => prev.map(tab => 
          tab.isActive ? { ...tab, isLoading: false } : tab
        ));
      }, 800);
    }
  };

  const addBookmark = (): void => {
    if (activeTab && activeTab.url !== 'about:newtab') {
      const exists = bookmarks.find(b => b.url === activeTab.url);
      if (!exists) {
        setBookmarks(prev => [...prev, {
          id: Date.now(),
          title: activeTab.title,
          url: activeTab.url,
          favicon: activeTab.favicon
        }]);
      }
    }
  };

  const removeBookmark = (id: number): void => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const clearHistory = (): void => {
    setHistory([]);
  };

  const canGoBack = activeTab && activeTab.historyIndex > 0;
  const canGoForward = activeTab && activeTab.historyIndex < activeTab.history.length - 1;

  return (
    <div className="w-full h-screen flex flex-col bg-white">
      {/* Tab Bar */}
      <div className="bg-[#e8eaed] flex items-center px-2 pt-2">
        <button className="p-1 hover:bg-gray-300 rounded mr-2">
          <ChevronDown size={16} className="text-gray-700" />
        </button>

        <div className="flex items-end flex-1 overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`
                group relative flex items-center gap-2 px-3 py-2 min-w-[200px] max-w-[240px] cursor-pointer
                ${tab.isActive 
                  ? 'bg-white rounded-t-lg shadow-sm' 
                  : 'bg-[#dadce0] hover:bg-[#d0d2d6] rounded-t-lg ml-[-8px]'
                }
              `}
              style={{ 
                clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%, 0 8px)'
              }}
            >
              <span className="text-base">{tab.isLoading ? '⏳' : tab.favicon}</span>
              <div className="flex-1 truncate text-sm text-gray-800">
                {tab.title}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className="opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded-full p-0.5 transition-opacity"
              >
                <X size={16} className="text-gray-600" />
              </button>
            </div>
          ))}
        </div>
        
        <button onClick={createNewTab} className="p-1.5 hover:bg-gray-300 rounded ml-1 mb-1">
          <Plus size={16} className="text-gray-700" />
        </button>

        <div className="flex items-center gap-2 ml-auto mb-1">
          <button className="p-1.5 hover:bg-gray-300 rounded">
            <Minus size={16} className="text-gray-700" />
          </button>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 hover:bg-gray-300 rounded"
          >
            <Maximize2 size={16} className="text-gray-700" />
          </button>
          <button className="p-1.5 hover:bg-gray-300 rounded">
            <X size={16} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Address Bar & Navigation */}
      <div className="bg-white px-3 py-2 flex items-center gap-2">
        <div className="flex gap-1">
          <button 
            onClick={goBack}
            disabled={!canGoBack}
            className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <button 
            onClick={goForward}
            disabled={!canGoForward}
            className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowRight size={18} className="text-gray-700" />
          </button>
          <button onClick={reload} className="p-2 hover:bg-gray-100 rounded-full">
            <RotateCw size={18} className={`text-gray-700 ${activeTab?.isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => navigateToUrl('about:newtab')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Home size={18} className="text-gray-700" />
          </button>
        </div>

        <div className="flex-1 flex items-center bg-white border border-gray-300 hover:border-gray-400 focus-within:border-blue-500 rounded-full px-4 py-1.5 transition-colors">
          {activeTab?.isLoading ? (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mr-2" />
          ) : (
            <Search size={16} className="text-gray-500 mr-2" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={addressBarValue}
            onChange={(e) => setAddressBarValue(e.target.value)}
            onKeyDown={handleUrlSubmit}
            onFocus={(e) => e.target.select()}
            placeholder="Search Google or type a URL"
            className="flex-1 bg-transparent outline-none text-sm text-gray-800"
          />
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={addBookmark}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Bookmark this page"
          >
            <Star 
              size={18} 
              className={`${bookmarks.find(b => b.url === activeTab?.url) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'}`}
            />
          </button>
          <button 
            onClick={() => setShowMenu(showMenu === 'downloads' ? null : 'downloads')}
            className="p-2 hover:bg-gray-100 rounded-full relative"
          >
            <Download size={18} className="text-gray-700" />
            {downloads.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </button>
          <button 
            onClick={() => setShowMenu(showMenu === 'bookmarks' ? null : 'bookmarks')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Bookmark size={18} className="text-gray-700" />
          </button>
          <button 
            onClick={() => setShowMenu(showMenu === 'history' ? null : 'history')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Clock size={18} className="text-gray-700" />
          </button>
          <button 
            onClick={() => setShowMenu(showMenu === 'settings' ? null : 'settings')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Settings size={18} className="text-gray-700" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreVertical size={18} className="text-gray-700" />
          </button>
          
          <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold ml-1">
            U
          </div>
        </div>
      </div>

      {/* Bookmarks Bar */}
      {showBookmarkBar && (
        <div className="bg-white border-b border-gray-200 px-3 py-1.5 flex items-center gap-2 text-sm overflow-x-auto">
          <button className="p-1 hover:bg-gray-100 rounded flex-shrink-0">
            <FolderOpen size={16} className="text-gray-700" />
          </button>
          {bookmarks.map(bookmark => (
            <button
              key={bookmark.id}
              onClick={() => navigateToUrl(bookmark.url)}
              className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded text-gray-700 flex-shrink-0 group"
            >
              <span className="text-sm">{bookmark.favicon}</span>
              <span className="text-xs">{bookmark.title}</span>
              <X 
                size={12} 
                onClick={(e) => {
                  e.stopPropagation();
                  removeBookmark(bookmark.id);
                }}
                className="opacity-0 group-hover:opacity-100 hover:text-red-600"
              />
            </button>
          ))}
        </div>
      )}

      {/* Dropdown Menus */}
      {showMenu && (
        <div className="absolute right-4 top-24 bg-white shadow-lg rounded-lg border border-gray-200 w-80 max-h-96 overflow-y-auto z-50">
          {showMenu === 'bookmarks' && (
            <div className="p-2">
              <div className="px-3 py-2 font-semibold text-sm text-gray-700 border-b">Bookmarks</div>
              {bookmarks.length === 0 ? (
                <div className="px-3 py-4 text-sm text-gray-500 text-center">No bookmarks yet</div>
              ) : (
                bookmarks.map(bookmark => (
                  <div
                    key={bookmark.id}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded cursor-pointer group"
                  >
                    <span className="text-lg">{bookmark.favicon}</span>
                    <div className="flex-1 min-w-0" onClick={() => {
                      navigateToUrl(bookmark.url);
                      setShowMenu(null);
                    }}>
                      <div className="text-sm font-medium text-gray-800 truncate">{bookmark.title}</div>
                      <div className="text-xs text-gray-500 truncate">{bookmark.url}</div>
                    </div>
                    <button
                      onClick={() => removeBookmark(bookmark.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded"
                    >
                      <Trash2 size={14} className="text-red-600" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {showMenu === 'history' && (
            <div className="p-2">
              <div className="flex items-center justify-between px-3 py-2 border-b">
                <span className="font-semibold text-sm text-gray-700">History</span>
                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Clear all
                  </button>
                )}
              </div>
              {history.length === 0 ? (
                <div className="px-3 py-4 text-sm text-gray-500 text-center">No history yet</div>
              ) : (
                history.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      navigateToUrl(item.url);
                      setShowMenu(null);
                    }}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded cursor-pointer"
                  >
                    <Clock size={16} className="text-gray-500" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">{item.title}</div>
                      <div className="text-xs text-gray-500 truncate">{item.url}</div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {showMenu === 'downloads' && (
            <div className="p-2">
              <div className="px-3 py-2 font-semibold text-sm text-gray-700 border-b">Downloads</div>
              {downloads.length === 0 ? (
                <div className="px-3 py-4 text-sm text-gray-500 text-center">No downloads yet</div>
              ) : (
                downloads.map(download => (
                  <div key={download.id} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded">
                    <Download size={16} className="text-gray-500" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">{download.name}</div>
                      <div className="text-xs text-gray-500">{download.size}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {showMenu === 'settings' && (
            <div className="p-2">
              <div className="px-3 py-2 font-semibold text-sm text-gray-700 border-b">Settings</div>
              <label className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={showBookmarkBar}
                  onChange={(e) => setShowBookmarkBar(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-800">Show bookmarks bar</span>
              </label>
            </div>
          )}
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 bg-white overflow-hidden relative">
        {activeTab?.url === 'about:newtab' ? (
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="mb-12">
              <svg className="w-24 h-24 mx-auto text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" opacity="0.3"/>
                <path d="M12 2 L12 12 L17 15" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            
            <h1 className="text-5xl font-normal text-gray-800 mb-8">New Tab</h1>
            
            <div className="w-full max-w-2xl mb-12">
              <input
                type="text"
                placeholder="Search Google or type a URL"
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-full focus:border-blue-500 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    navigateToUrl(e.currentTarget.value);
                  }
                }}
              />
            </div>

            <div className="w-full max-w-4xl">
              <h2 className="text-sm font-semibold text-gray-600 mb-4 px-4">Quick Access</h2>
              <div className="grid grid-cols-5 gap-4">
                {bookmarks.slice(0, 10).map(bookmark => (
                  <button
                    key={bookmark.id}
                    onClick={() => navigateToUrl(bookmark.url)}
                    className="flex flex-col items-center gap-2 p-4 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-3xl">
                      {bookmark.favicon}
                    </div>
                    <span className="text-sm text-gray-700 truncate w-full text-center">
                      {bookmark.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <iframe
            src={activeTab?.url}
            className="w-full h-full border-0"
            title="Browser Content"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        )}
      </div>

      {/* Click outside to close menus */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowMenu(null)}
        />
      )}
    </div>
  );
}