import { useState, useEffect } from "react";
import { useOSStore } from "../../store/osStore";
import Icon from "../Icons";
import { Modal } from "../ui/Modal";

const TextEditor = ({ window }) => {
  const { fileSystem, updateFileContent, createFile } = useOSStore();
  const [content, setContent] = useState("");
  const [filePath, setFilePath] = useState(window.props?.filePath || null);
  const [isModified, setIsModified] = useState(false);
  const [wordWrap, setWordWrap] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  useEffect(() => {
    if (filePath && fileSystem[filePath]) {
      setContent(fileSystem[filePath].content || "");
      setIsModified(false);
    }
  }, [filePath, fileSystem]);

  const handleSave = () => {
    if (filePath) {
      updateFileContent(filePath, content);
      setIsModified(false);
    } else {
      setShowSaveModal(true);
    }
  };

  const handleSaveAs = () => {
    if (newFileName.trim()) {
      const path = "/home/user/Documents";
      const name = newFileName.trim().includes(".") ? newFileName.trim() : `${newFileName.trim()}.txt`;
      createFile(path, name, content);
      setFilePath(`${path}/${name}`);
      setIsModified(false);
      setShowSaveModal(false);
      setNewFileName("");
    }
  };

  const handleNew = () => {
    if (isModified) {
      // Could add a confirmation modal here
    }
    setContent("");
    setFilePath(null);
    setIsModified(false);
  };

  const handleChange = (e) => {
    setContent(e.target.value);
    setIsModified(true);
  };

  const lines = content.split("\n");
  const lineCount = lines.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      {/* Menu bar */}
      <div className="flex items-center gap-1 px-2 py-1 border-b border-white/10 bg-os-surface/50">
        <button
          className="px-3 py-1 text-sm text-white/70 hover:bg-white/10 rounded transition-colors"
          onClick={handleNew}
        >
          File
        </button>
        <button className="px-3 py-1 text-sm text-white/70 hover:bg-white/10 rounded transition-colors">
          Edit
        </button>
        <button className="px-3 py-1 text-sm text-white/70 hover:bg-white/10 rounded transition-colors">
          View
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-2 py-1.5 border-b border-white/10 bg-os-surface/30">
        <button
          className="p-1.5 rounded hover:bg-white/10 transition-colors"
          onClick={handleNew}
          title="New"
        >
          <Icon name="FilePlus" size={18} className="text-white/60" />
        </button>
        <button
          className="p-1.5 rounded hover:bg-white/10 transition-colors"
          title="Open"
        >
          <Icon name="FolderOpen" size={18} className="text-white/60" />
        </button>
        <button
          className="p-1.5 rounded hover:bg-white/10 transition-colors"
          onClick={handleSave}
          title="Save"
        >
          <Icon name="Download" size={18} className="text-white/60" />
        </button>
        <div className="w-px h-5 bg-white/10 mx-1" />
        <button
          className="p-1.5 rounded hover:bg-white/10 transition-colors"
          title="Undo"
        >
          <Icon name="RotateCcw" size={18} className="text-white/60" />
        </button>
        <button
          className="p-1.5 rounded hover:bg-white/10 transition-colors"
          title="Redo"
        >
          <Icon name="RotateCw" size={18} className="text-white/60" />
        </button>
        <div className="w-px h-5 bg-white/10 mx-1" />
        <button
          className={`p-1.5 rounded transition-colors ${wordWrap ? "bg-white/10" : "hover:bg-white/10"}`}
          onClick={() => setWordWrap(!wordWrap)}
          title="Word Wrap"
        >
          <Icon name="AlignLeft" size={18} className="text-white/60" />
        </button>
        <button
          className={`p-1.5 rounded transition-colors ${showLineNumbers ? "bg-white/10" : "hover:bg-white/10"}`}
          onClick={() => setShowLineNumbers(!showLineNumbers)}
          title="Line Numbers"
        >
          <Icon name="Hash" size={18} className="text-white/60" />
        </button>
        <div className="w-px h-5 bg-white/10 mx-1" />
        <button
          className="p-1.5 rounded hover:bg-white/10 transition-colors"
          onClick={() => setFontSize(Math.max(10, fontSize - 2))}
          title="Decrease Font Size"
        >
          <Icon name="ZoomOut" size={18} className="text-white/60" />
        </button>
        <span className="text-xs text-white/60 w-8 text-center">{fontSize}</span>
        <button
          className="p-1.5 rounded hover:bg-white/10 transition-colors"
          onClick={() => setFontSize(Math.min(24, fontSize + 2))}
          title="Increase Font Size"
        >
          <Icon name="ZoomIn" size={18} className="text-white/60" />
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 flex overflow-hidden">
        {showLineNumbers && (
          <div
            className="py-2 px-2 text-right select-none bg-[#252526] border-r border-white/10 overflow-hidden"
            style={{ fontSize: `${fontSize}px`, lineHeight: "1.5" }}
          >
            {lines.map((_, i) => (
              <div key={i} className="text-white/30">
                {i + 1}
              </div>
            ))}
          </div>
        )}
        <textarea
          value={content}
          onChange={handleChange}
          className="flex-1 p-2 bg-transparent text-white/90 resize-none outline-none terminal-text"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: "1.5",
            whiteSpace: wordWrap ? "pre-wrap" : "pre",
            overflowWrap: wordWrap ? "break-word" : "normal",
          }}
          spellCheck={false}
          placeholder="Start typing..."
        />
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-1 border-t border-white/10 bg-os-surface/50 text-xs text-white/60">
        <div className="flex items-center gap-4">
          <span>{filePath ? filePath.split("/").pop() : "Untitled"}</span>
          {isModified && <span className="text-os-primary">● Modified</span>}
        </div>
        <div className="flex items-center gap-4">
          <span>Lines: {lineCount}</span>
          <span>Words: {wordCount}</span>
          <span>Characters: {charCount}</span>
        </div>
      </div>

      {/* Save Modal */}
      <Modal
        isOpen={showSaveModal}
        onClose={() => {
          setShowSaveModal(false);
          setNewFileName("");
        }}
        title="Save File"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSaveAs(); }}>
          <p className="text-white/60 text-sm mb-4">
            File will be saved to Documents folder
          </p>
          <input
            type="text"
            placeholder="Enter file name (e.g., document.txt)"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-os-primary/50 focus:outline-none"
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => {
                setShowSaveModal(false);
                setNewFileName("");
              }}
              className="px-4 py-2 rounded-lg text-white/60 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newFileName.trim()}
              className="px-4 py-2 rounded-lg bg-os-primary hover:bg-os-primary/80 text-white transition-colors disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TextEditor;
