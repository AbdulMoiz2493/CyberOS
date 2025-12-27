import { useState } from "react";
import { useOSStore } from "../../store/osStore";
import Icon from "../Icons";
import { Modal } from "../ui/Modal";
import { formatFileSize } from "../../lib/utils";

const FileManager = ({ window }) => {
  const {
    fileSystem,
    openWindow,
    createFolder,
    createFile,
    deleteItem,
    renameItem,
    copyToClipboard,
    cutToClipboard,
    paste,
    clipboard,
    showContextMenu,
    settings,
  } = useOSStore();

  const isLight = settings.theme === 'light';
  const textColor = isLight ? 'text-black' : 'text-white';
  const textMuted = isLight ? 'text-black/60' : 'text-white/60';
  const textFaint = isLight ? 'text-black/40' : 'text-white/40';
  const bgCard = isLight ? 'bg-black/5' : 'bg-white/5';
  const bgHover = isLight ? 'hover:bg-black/5' : 'hover:bg-white/5';
  const bgHover10 = isLight ? 'hover:bg-black/10' : 'hover:bg-white/10';
  const borderColor = isLight ? 'border-black/10' : 'border-white/10';

  const [currentPath, setCurrentPath] = useState(window.props?.path || "/home/user");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedItems, setSelectedItems] = useState([]);
  const [renaming, setRenaming] = useState(null);
  const [newName, setNewName] = useState("");
  
  // Modal states
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToRename, setItemToRename] = useState(null);

  const currentFolder = fileSystem[currentPath];
  const items = currentFolder?.children || [];

  const navigateTo = (path) => {
    setCurrentPath(path);
    setSelectedItems([]);
  };

  const goUp = () => {
    const parts = currentPath.split("/").filter(Boolean);
    if (parts.length > 0) {
      parts.pop();
      navigateTo("/" + parts.join("/") || "/");
    }
  };

  const handleItemClick = (name, e) => {
    if (e.ctrlKey) {
      setSelectedItems((prev) =>
        prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
      );
    } else {
      setSelectedItems([name]);
    }
  };

  const handleItemDoubleClick = (name) => {
    const itemPath = `${currentPath}/${name}`.replace("//", "/");
    const item = fileSystem[itemPath];

    if (item?.type === "folder") {
      navigateTo(itemPath);
    } else if (item?.type === "file") {
      openWindow("text-editor", { filePath: itemPath, title: name });
    }
  };

  const handleContextMenu = (e, name = null) => {
    e.preventDefault();
    if (name) setSelectedItems([name]);

    const itemPath = name ? `${currentPath}/${name}`.replace("//", "/") : null;

    const items = name
      ? [
          { label: "Open", icon: "FolderOpen", action: () => handleItemDoubleClick(name) },
          { type: "separator" },
          { label: "Cut", icon: "Scissors", action: () => cutToClipboard(itemPath) },
          { label: "Copy", icon: "Copy", action: () => copyToClipboard(itemPath) },
          { type: "separator" },
          {
            label: "Rename",
            icon: "Edit",
            action: () => {
              setItemToRename({ name, path: itemPath });
              setNewItemName(name);
              setShowRenameModal(true);
            },
          },
          {
            label: "Delete",
            icon: "Trash2",
            action: () => {
              setItemToDelete({ name, path: itemPath });
              setShowDeleteModal(true);
            },
          },
          { type: "separator" },
          { label: "Properties", icon: "Info", action: () => {} },
        ]
      : [
          {
            label: "View",
            submenu: [
              { label: "Grid", action: () => setViewMode("grid") },
              { label: "List", action: () => setViewMode("list") },
            ],
          },
          { type: "separator" },
          { label: "New Folder", icon: "FolderPlus", action: () => setShowNewFolderModal(true) },
          { label: "New File", icon: "FilePlus", action: () => setShowNewFileModal(true) },
          { type: "separator" },
          ...(clipboard ? [{ label: "Paste", icon: "Clipboard", action: () => paste(currentPath) }] : []),
          { type: "separator" },
          { label: "Refresh", icon: "RefreshCw", action: () => {} },
          { label: "Properties", icon: "Info", action: () => {} },
        ];

    showContextMenu(e.clientX, e.clientY, items);
  };

  const handleCreateFolder = () => {
    if (newItemName.trim()) {
      createFolder(currentPath, newItemName.trim());
      setNewItemName("");
      setShowNewFolderModal(false);
    }
  };

  const handleCreateFile = () => {
    if (newItemName.trim()) {
      createFile(currentPath, newItemName.trim(), "");
      setNewItemName("");
      setShowNewFileModal(false);
    }
  };

  const handleRename = () => {
    if (newItemName.trim() && itemToRename) {
      renameItem(itemToRename.path, newItemName.trim());
      setNewItemName("");
      setItemToRename(null);
      setShowRenameModal(false);
    }
  };

  const handleDelete = () => {
    if (itemToDelete) {
      deleteItem(itemToDelete.path);
      setItemToDelete(null);
      setShowDeleteModal(false);
      setSelectedItems([]);
    }
  };

  const pathParts = currentPath.split("/").filter(Boolean);

  const quickAccess = [
    { name: "Home", path: "/home/user", icon: "Home" },
    { name: "Desktop", path: "/home/user/Desktop", icon: "Monitor" },
    { name: "Documents", path: "/home/user/Documents", icon: "FileText" },
    { name: "Downloads", path: "/home/user/Downloads", icon: "Download" },
    { name: "Pictures", path: "/home/user/Pictures", icon: "Image" },
    { name: "Music", path: "/home/user/Music", icon: "Music" },
    { name: "Videos", path: "/home/user/Videos", icon: "Video" },
  ];

  return (
    <div className={`h-full flex flex-col ${isLight ? 'bg-gray-50' : ''}`}>
      {/* Toolbar */}
      <div className={`flex items-center gap-2 p-2 border-b ${borderColor} ${isLight ? 'bg-white/50' : 'bg-os-surface/50'}`}>
        <button
          className={`p-1.5 rounded ${bgHover10} transition-colors disabled:opacity-50`}
          onClick={goUp}
        >
          <Icon name="ArrowLeft" size={18} className={textMuted} />
        </button>
        <button
          className={`p-1.5 rounded ${bgHover10} transition-colors disabled:opacity-50`}
          disabled
        >
          <Icon name="ArrowRight" size={18} className={textMuted} />
        </button>
        <button
          className={`p-1.5 rounded ${bgHover10} transition-colors`}
          onClick={goUp}
        >
          <Icon name="ArrowUp" size={18} className={textMuted} />
        </button>

        {/* Breadcrumb */}
        <div className={`flex-1 flex items-center gap-1 px-3 py-1.5 rounded ${bgCard}`}>
          <button
            className="hover:text-os-primary transition-colors"
            onClick={() => navigateTo("/")}
          >
            <Icon name="HardDrive" size={16} className={textMuted} />
          </button>
          {pathParts.map((part, index) => (
            <div key={index} className="flex items-center">
              <Icon name="ChevronRight" size={14} className={textFaint} />
              <button
                className={`text-sm ${textMuted} hover:text-os-primary transition-colors`}
                onClick={() => navigateTo("/" + pathParts.slice(0, index + 1).join("/"))}
              >
                {part}
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <button
          className={`p-1.5 rounded ${bgHover10} transition-colors`}
          onClick={() => setShowNewFolderModal(true)}
          title="New Folder"
        >
          <Icon name="FolderPlus" size={18} className={textMuted} />
        </button>
        <button
          className={`p-1.5 rounded ${bgHover10} transition-colors`}
          onClick={() => setShowNewFileModal(true)}
          title="New File"
        >
          <Icon name="FilePlus" size={18} className={textMuted} />
        </button>

        {/* View toggle */}
        <div className={`flex items-center gap-1 ${bgCard} rounded p-0.5`}>
          <button
            className={`p-1.5 rounded transition-colors ${viewMode === "grid" ? (isLight ? "bg-black/10" : "bg-white/10") : ""}`}
            onClick={() => setViewMode("grid")}
          >
            <Icon name="Grid" size={16} className={textMuted} />
          </button>
          <button
            className={`p-1.5 rounded transition-colors ${viewMode === "list" ? (isLight ? "bg-black/10" : "bg-white/10") : ""}`}
            onClick={() => setViewMode("list")}
          >
            <Icon name="List" size={16} className={textMuted} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`w-48 border-r ${borderColor} p-2 overflow-y-auto`}>
          <div className={`text-xs ${textFaint} uppercase tracking-wider mb-2 px-2`}>
            Quick Access
          </div>
          {quickAccess.map((item) => (
            <button
              key={item.path}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
                currentPath === item.path ? (isLight ? "bg-black/10" : "bg-white/10") : bgHover
              }`}
              onClick={() => navigateTo(item.path)}
            >
              <Icon name={item.icon} size={16} className={textMuted} />
              <span className={`text-sm ${textMuted}`}>{item.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div
          className="flex-1 p-4 overflow-auto"
          onContextMenu={(e) => handleContextMenu(e)}
          onClick={() => setSelectedItems([])}
        >
          {items.length === 0 ? (
            <div className={`h-full flex flex-col items-center justify-center ${textFaint}`}>
              <Icon name="Folder" size={48} className="mb-4" />
              <p>This folder is empty</p>
              <button
                className="mt-4 px-4 py-2 rounded-lg bg-os-primary/20 hover:bg-os-primary/30 text-os-primary text-sm transition-colors"
                onClick={() => setShowNewFolderModal(true)}
              >
                Create New Folder
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-6 gap-4">
              {items.map((name) => {
                const itemPath = `${currentPath}/${name}`.replace("//", "/");
                const item = fileSystem[itemPath];
                const isFolder = item?.type === "folder";
                const isSelected = selectedItems.includes(name);

                return (
                  <div
                    key={name}
                    className={`p-3 rounded-lg cursor-pointer flex flex-col items-center gap-2 transition-all ${
                      isSelected ? "bg-os-primary/20 ring-1 ring-os-primary/50" : bgHover
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(name, e);
                    }}
                    onDoubleClick={() => handleItemDoubleClick(name)}
                    onContextMenu={(e) => handleContextMenu(e, name)}
                  >
                    <Icon
                      name={isFolder ? "Folder" : "FileText"}
                      size={40}
                      className={isFolder ? "text-yellow-400" : textMuted}
                    />
                    <span className={`text-xs ${textMuted} text-center line-clamp-2`}>
                      {name}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-1">
              {items.map((name) => {
                const itemPath = `${currentPath}/${name}`.replace("//", "/");
                const item = fileSystem[itemPath];
                const isFolder = item?.type === "folder";
                const isSelected = selectedItems.includes(name);

                return (
                  <div
                    key={name}
                    className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-all ${
                      isSelected ? "bg-os-primary/20 ring-1 ring-os-primary/50" : bgHover
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(name, e);
                    }}
                    onDoubleClick={() => handleItemDoubleClick(name)}
                    onContextMenu={(e) => handleContextMenu(e, name)}
                  >
                    <Icon
                      name={isFolder ? "Folder" : "FileText"}
                      size={20}
                      className={isFolder ? "text-yellow-400" : textMuted}
                    />
                    <span className={`flex-1 text-sm ${textMuted}`}>{name}</span>
                    <span className={`text-xs ${textFaint}`}>
                      {isFolder ? "--" : formatFileSize(item?.size || 0)}
                    </span>
                    <span className={`text-xs ${textFaint} w-32`}>
                      {item?.modified ? new Date(item.modified).toLocaleDateString() : "--"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className={`px-3 py-1.5 border-t ${borderColor} ${isLight ? 'bg-white/50' : 'bg-os-surface/50'} flex items-center justify-between`}>
        <span className={`text-xs ${textMuted}`}>{items.length} items</span>
        {selectedItems.length > 0 && (
          <span className={`text-xs ${textMuted}`}>{selectedItems.length} selected</span>
        )}
      </div>

      {/* New Folder Modal */}
      <Modal
        isOpen={showNewFolderModal}
        onClose={() => {
          setShowNewFolderModal(false);
          setNewItemName("");
        }}
        title="Create New Folder"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleCreateFolder(); }}>
          <input
            type="text"
            placeholder="Folder name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-os-primary/50 focus:outline-none"
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => {
                setShowNewFolderModal(false);
                setNewItemName("");
              }}
              className="px-4 py-2 rounded-lg text-white/60 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newItemName.trim()}
              className="px-4 py-2 rounded-lg bg-os-primary hover:bg-os-primary/80 text-white transition-colors disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </form>
      </Modal>

      {/* New File Modal */}
      <Modal
        isOpen={showNewFileModal}
        onClose={() => {
          setShowNewFileModal(false);
          setNewItemName("");
        }}
        title="Create New File"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleCreateFile(); }}>
          <input
            type="text"
            placeholder="File name (e.g., document.txt)"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-os-primary/50 focus:outline-none"
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => {
                setShowNewFileModal(false);
                setNewItemName("");
              }}
              className="px-4 py-2 rounded-lg text-white/60 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newItemName.trim()}
              className="px-4 py-2 rounded-lg bg-os-primary hover:bg-os-primary/80 text-white transition-colors disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </form>
      </Modal>

      {/* Rename Modal */}
      <Modal
        isOpen={showRenameModal}
        onClose={() => {
          setShowRenameModal(false);
          setNewItemName("");
          setItemToRename(null);
        }}
        title="Rename"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleRename(); }}>
          <input
            type="text"
            placeholder="New name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-os-primary/50 focus:outline-none"
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => {
                setShowRenameModal(false);
                setNewItemName("");
                setItemToRename(null);
              }}
              className="px-4 py-2 rounded-lg text-white/60 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newItemName.trim()}
              className="px-4 py-2 rounded-lg bg-os-primary hover:bg-os-primary/80 text-white transition-colors disabled:opacity-50"
            >
              Rename
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}
        title="Delete Item"
      >
        <p className="text-white/70 mb-6">
          Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setShowDeleteModal(false);
              setItemToDelete(null);
            }}
            className="px-4 py-2 rounded-lg text-white/60 hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default FileManager;
