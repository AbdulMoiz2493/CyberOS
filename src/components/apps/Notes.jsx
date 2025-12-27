import { useState } from "react";
import Icon from "../Icons";
import { useOSStore } from "../../store/osStore";

const Notes = () => {
  const { settings } = useOSStore();
  const isLight = settings.theme === 'light';
  const textColor = isLight ? 'text-black' : 'text-white';
  const textMuted = isLight ? 'text-black/60' : 'text-white/60';
  const textFaint = isLight ? 'text-black/40' : 'text-white/40';
  const bgCard = isLight ? 'bg-black/5' : 'bg-white/5';
  const bgHover = isLight ? 'hover:bg-black/5' : 'hover:bg-white/5';
  const borderColor = isLight ? 'border-black/10' : 'border-white/10';

  const [notes, setNotes] = useState([
    { id: 1, title: "Welcome to Notes", content: "Start writing your thoughts here!", color: "#e94560", date: new Date() },
    { id: 2, title: "Shopping List", content: "- Milk\n- Bread\n- Eggs\n- Coffee", color: "#3b82f6", date: new Date() },
    { id: 3, title: "Ideas", content: "Build something amazing today!", color: "#10b981", date: new Date() },
  ]);
  const [selectedNote, setSelectedNote] = useState(notes[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const colors = ["#e94560", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

  const handleNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: "New Note",
      content: "",
      color: colors[Math.floor(Math.random() * colors.length)],
      date: new Date(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
  };

  const handleUpdateNote = (field, value) => {
    const updated = { ...selectedNote, [field]: value, date: new Date() };
    setSelectedNote(updated);
    setNotes(notes.map((n) => (n.id === updated.id ? updated : n)));
  };

  const handleDeleteNote = (id) => {
    const filtered = notes.filter((n) => n.id !== id);
    setNotes(filtered);
    if (selectedNote?.id === id) {
      setSelectedNote(filtered[0] || null);
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`h-full flex ${isLight ? 'bg-gray-50' : 'bg-os-bg'}`}>
      {/* Sidebar */}
      <div className={`w-64 border-r ${borderColor} flex flex-col`}>
        <div className={`p-3 border-b ${borderColor}`}>
          <div className="relative mb-3">
            <Icon
              name="Search"
              size={16}
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${textFaint}`}
            />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 rounded-lg ${bgCard} border ${borderColor} text-sm ${textColor} placeholder:${textFaint}`}
            />
          </div>
          <button
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-os-primary hover:bg-os-primary/80 text-white text-sm transition-colors"
            onClick={handleNewNote}
          >
            <Icon name="Plus" size={16} />
            New Note
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filteredNotes.map((note) => (
            <button
              key={note.id}
              className={`w-full p-3 rounded-lg text-left mb-2 transition-colors ${
                selectedNote?.id === note.id ? (isLight ? "bg-black/10" : "bg-white/10") : bgHover
              }`}
              onClick={() => setSelectedNote(note)}
            >
              <div className="flex items-start gap-2">
                <div
                  className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                  style={{ backgroundColor: note.color }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-medium ${textColor} truncate`}>{note.title}</h3>
                  <p className={`text-xs ${textFaint} truncate`}>{note.content}</p>
                  <p className={`text-xs ${isLight ? 'text-black/30' : 'text-white/30'} mt-1`}>
                    {note.date.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className={`p-3 border-t ${borderColor} text-xs ${textFaint} text-center`}>
          {notes.length} notes
        </div>
      </div>

      {/* Editor */}
      {selectedNote ? (
        <div className="flex-1 flex flex-col">
          <div className={`flex items-center justify-between p-3 border-b ${borderColor}`}>
            <div className="flex items-center gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    selectedNote.color === color ? "scale-110 ring-2 ring-white/50" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleUpdateNote("color", color)}
                />
              ))}
            </div>
            <button
              className={`p-2 rounded ${bgHover} transition-colors text-red-400`}
              onClick={() => handleDeleteNote(selectedNote.id)}
            >
              <Icon name="Trash2" size={18} />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <input
              type="text"
              value={selectedNote.title}
              onChange={(e) => handleUpdateNote("title", e.target.value)}
              className={`w-full text-2xl font-semibold ${textColor} bg-transparent border-none outline-none mb-4`}
              placeholder="Note title..."
            />
            <textarea
              value={selectedNote.content}
              onChange={(e) => handleUpdateNote("content", e.target.value)}
              className={`w-full h-full ${textMuted} bg-transparent border-none outline-none resize-none`}
              placeholder="Start writing..."
            />
          </div>

          <div className={`px-4 py-2 border-t ${borderColor} text-xs ${textFaint}`}>
            Last edited: {selectedNote.date.toLocaleString()}
          </div>
        </div>
      ) : (
        <div className={`flex-1 flex items-center justify-center ${textFaint}`}>
          <div className="text-center">
            <Icon name="StickyNote" size={48} className="mx-auto mb-4" />
            <p>Select a note or create a new one</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
