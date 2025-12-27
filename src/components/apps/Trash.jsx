import { useState } from "react";
import Icon from "../Icons";
import { Modal } from "../ui/Modal";
import { useOSStore } from "../../store/osStore";

const Trash = () => {
  const { settings } = useOSStore();
  const isLight = settings.theme === 'light';
  const textColor = isLight ? 'text-black' : 'text-white';
  const textMuted = isLight ? 'text-black/60' : 'text-white/60';
  const textFaint = isLight ? 'text-black/40' : 'text-white/40';
  const bgCard = isLight ? 'bg-black/5' : 'bg-white/5';
  const bgHover = isLight ? 'hover:bg-black/5' : 'hover:bg-white/5';
  const bgHover10 = isLight ? 'hover:bg-black/10' : 'hover:bg-white/10';
  const borderColor = isLight ? 'border-black/10' : 'border-white/10';

  const [trashedItems, setTrashedItems] = useState([
    { id: 1, name: "old_document.txt", type: "file", size: 1024, deletedAt: new Date(Date.now() - 86400000) },
    { id: 2, name: "backup_folder", type: "folder", size: 0, deletedAt: new Date(Date.now() - 172800000) },
    { id: 3, name: "screenshot.png", type: "file", size: 245760, deletedAt: new Date(Date.now() - 259200000) },
  ]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showEmptyModal, setShowEmptyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const formatSize = (bytes) => {
    if (bytes === 0) return "--";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleRestore = (id) => {
    setTrashedItems(trashedItems.filter((item) => item.id !== id));
    setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
  };

  const handleDelete = (id) => {
    setTrashedItems(trashedItems.filter((item) => item.id !== id));
    setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleEmptyTrash = () => {
    setTrashedItems([]);
    setSelectedItems([]);
    setShowEmptyModal(false);
  };

  const handleRestoreAll = () => {
    setTrashedItems([]);
    setSelectedItems([]);
  };

  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className={`h-full flex flex-col ${isLight ? 'bg-gray-50' : 'bg-os-bg'}`}>
      {/* Toolbar */}
      <div className={`flex items-center justify-between p-3 border-b ${borderColor} ${isLight ? 'bg-white/50' : 'bg-os-surface/50'}`}>
        <div className="flex items-center gap-2">
          <Icon name="Trash2" size={20} className={textMuted} />
          <span className={textMuted}>Trash</span>
          <span className={`${textFaint} text-sm`}>({trashedItems.length} items)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`px-3 py-1.5 rounded-lg text-sm ${textMuted} ${bgHover10} transition-colors disabled:opacity-50`}
            onClick={handleRestoreAll}
            disabled={trashedItems.length === 0}
          >
            Restore All
          </button>
          <button
            className="px-3 py-1.5 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
            onClick={() => setShowEmptyModal(true)}
            disabled={trashedItems.length === 0}
          >
            Empty Trash
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {trashedItems.length === 0 ? (
          <div className={`h-full flex flex-col items-center justify-center ${textFaint}`}>
            <Icon name="Trash2" size={64} className="mb-4" />
            <p className="text-lg">Trash is empty</p>
            <p className="text-sm">Deleted items will appear here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {trashedItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
                  selectedItems.includes(item.id) ? "bg-os-primary/20 ring-1 ring-os-primary/50" : bgHover
                }`}
                onClick={() => toggleSelect(item.id)}
              >
                <Icon
                  name={item.type === "folder" ? "Folder" : "FileText"}
                  size={24}
                  className={item.type === "folder" ? "text-yellow-400/60" : textFaint}
                />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm ${textMuted} truncate`}>{item.name}</div>
                  <div className={`text-xs ${textFaint}`}>
                    Deleted {item.deletedAt.toLocaleDateString()}
                  </div>
                </div>
                <div className={`text-xs ${textFaint}`}>{formatSize(item.size)}</div>
                <div className="flex items-center gap-1">
                  <button
                    className={`p-1.5 rounded ${bgHover10} transition-colors`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRestore(item.id);
                    }}
                    title="Restore"
                  >
                    <Icon name="RotateCcw" size={16} className={textMuted} />
                  </button>
                  <button
                    className="p-1.5 rounded hover:bg-red-400/10 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setItemToDelete(item);
                      setShowDeleteModal(true);
                    }}
                    title="Delete permanently"
                  >
                    <Icon name="X" size={16} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status bar */}
      {selectedItems.length > 0 && (
        <div className={`px-4 py-2 border-t ${borderColor} ${isLight ? 'bg-white/50' : 'bg-os-surface/50'} flex items-center justify-between`}>
          <span className={`text-sm ${textMuted}`}>{selectedItems.length} selected</span>
          <div className="flex items-center gap-2">
            <button
              className={`px-3 py-1 rounded text-sm ${textMuted} ${bgHover10} transition-colors`}
              onClick={() => {
                selectedItems.forEach((id) => handleRestore(id));
              }}
            >
              Restore Selected
            </button>
            <button
              className="px-3 py-1 rounded text-sm text-red-400 hover:bg-red-400/10 transition-colors"
              onClick={() => {
                selectedItems.forEach((id) => handleDelete(id));
              }}
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Empty Trash Modal */}
      <Modal
        isOpen={showEmptyModal}
        onClose={() => setShowEmptyModal(false)}
        title="Empty Trash"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-full bg-red-500/20">
            <Icon name="AlertTriangle" size={24} className="text-red-400" />
          </div>
          <div>
            <p className={`${textMuted} mb-2`}>Are you sure you want to permanently delete all items in the Trash?</p>
            <p className={`text-sm ${textFaint}`}>This action cannot be undone.</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowEmptyModal(false)}
            className={`px-4 py-2 rounded-lg ${textMuted} ${bgHover10} transition-colors`}
          >
            Cancel
          </button>
          <button
            onClick={handleEmptyTrash}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            Empty Trash
          </button>
        </div>
      </Modal>

      {/* Delete Item Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}
        title="Delete Permanently"
      >
        <p className={`${textMuted} mb-6`}>
          Are you sure you want to permanently delete "{itemToDelete?.name}"? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setShowDeleteModal(false);
              setItemToDelete(null);
            }}
            className={`px-4 py-2 rounded-lg ${textMuted} ${bgHover10} transition-colors`}
          >
            Cancel
          </button>
          <button
            onClick={() => handleDelete(itemToDelete?.id)}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Trash;
