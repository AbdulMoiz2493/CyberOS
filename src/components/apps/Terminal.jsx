import { useState, useRef, useEffect } from "react";
import { useOSStore } from "../../store/osStore";

const Terminal = ({ window }) => {
  const { fileSystem, createFolder, createFile, deleteItem, username } = useOSStore();
  const [history, setHistory] = useState([
    { type: "output", content: `CyberOS Terminal v1.0.0\nType 'help' for available commands.\n` },
  ]);
  const [input, setInput] = useState("");
  const [currentPath, setCurrentPath] = useState("/home/user");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addOutput = (content, type = "output") => {
    setHistory((prev) => [...prev, { type, content }]);
  };

  const executeCommand = (cmd) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    setCommandHistory((prev) => [...prev, trimmedCmd]);
    setHistoryIndex(-1);
    addOutput(`${username.toLowerCase()}@cyberos:${currentPath}$ ${trimmedCmd}`, "command");

    const [command, ...args] = trimmedCmd.split(" ");
    const arg = args.join(" ");

    switch (command.toLowerCase()) {
      case "help":
        addOutput(`Available commands:
  help          - Show this help message
  clear         - Clear the terminal
  ls            - List directory contents
  cd <dir>      - Change directory
  pwd           - Print working directory
  mkdir <name>  - Create a directory
  touch <name>  - Create a file
  rm <name>     - Remove a file or directory
  cat <file>    - Display file contents
  echo <text>   - Print text
  whoami        - Display current user
  date          - Display current date and time
  uname         - Display system information
  history       - Show command history
  neofetch      - Display system info
  exit          - Close terminal`);
        break;

      case "clear":
        setHistory([]);
        break;

      case "ls":
        const folder = fileSystem[currentPath];
        if (folder?.children) {
          const items = folder.children.map((name) => {
            const itemPath = `${currentPath}/${name}`.replace("//", "/");
            const item = fileSystem[itemPath];
            return item?.type === "folder" ? `📁 ${name}/` : `📄 ${name}`;
          });
          addOutput(items.join("\n") || "(empty)");
        }
        break;

      case "cd":
        if (!arg || arg === "~") {
          setCurrentPath("/home/user");
        } else if (arg === "..") {
          const parts = currentPath.split("/").filter(Boolean);
          parts.pop();
          setCurrentPath("/" + parts.join("/") || "/");
        } else if (arg === "/") {
          setCurrentPath("/");
        } else {
          const newPath = arg.startsWith("/")
            ? arg
            : `${currentPath}/${arg}`.replace("//", "/");
          if (fileSystem[newPath]?.type === "folder") {
            setCurrentPath(newPath);
          } else {
            addOutput(`cd: ${arg}: No such directory`, "error");
          }
        }
        break;

      case "pwd":
        addOutput(currentPath);
        break;

      case "mkdir":
        if (!arg) {
          addOutput("mkdir: missing operand", "error");
        } else {
          createFolder(currentPath, arg);
          addOutput(`Created directory: ${arg}`);
        }
        break;

      case "touch":
        if (!arg) {
          addOutput("touch: missing operand", "error");
        } else {
          createFile(currentPath, arg, "");
          addOutput(`Created file: ${arg}`);
        }
        break;

      case "rm":
        if (!arg) {
          addOutput("rm: missing operand", "error");
        } else {
          const itemPath = `${currentPath}/${arg}`.replace("//", "/");
          if (fileSystem[itemPath]) {
            deleteItem(itemPath);
            addOutput(`Removed: ${arg}`);
          } else {
            addOutput(`rm: ${arg}: No such file or directory`, "error");
          }
        }
        break;

      case "cat":
        if (!arg) {
          addOutput("cat: missing operand", "error");
        } else {
          const filePath = `${currentPath}/${arg}`.replace("//", "/");
          const file = fileSystem[filePath];
          if (file?.type === "file") {
            addOutput(file.content || "(empty file)");
          } else {
            addOutput(`cat: ${arg}: No such file`, "error");
          }
        }
        break;

      case "echo":
        addOutput(arg || "");
        break;

      case "whoami":
        addOutput(username.toLowerCase());
        break;

      case "date":
        addOutput(new Date().toString());
        break;

      case "uname":
        addOutput("CyberOS 1.0.0 x86_64 WebBrowser");
        break;

      case "history":
        addOutput(commandHistory.map((cmd, i) => `  ${i + 1}  ${cmd}`).join("\n"));
        break;

      case "neofetch":
        addOutput(`
   ██████╗██╗   ██╗██████╗ ███████╗██████╗  ██████╗ ███████╗
  ██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗██╔═══██╗██╔════╝
  ██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝██║   ██║███████╗
  ██║       ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗██║   ██║╚════██║
  ╚██████╗   ██║   ██████╔╝███████╗██║  ██║╚██████╔╝███████║
   ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝

  ${username}@cyberos
  ─────────────────────
  OS: CyberOS 1.0.0
  Host: Web Browser
  Kernel: JavaScript
  Shell: CyberTerminal
  Resolution: ${typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'N/A'}
  Terminal: CyberOS Terminal
  CPU: Virtual CPU
  Memory: Unlimited
  
  Developed by Abdul Moiz
  Email: abdulmoiz8895@gmail.com
`);
        break;

      case "exit":
        addOutput("Goodbye!");
        break;

      default:
        addOutput(`${command}: command not found`, "error");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      executeCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const folder = fileSystem[currentPath];
      if (folder?.children && input) {
        const parts = input.split(" ");
        const lastPart = parts[parts.length - 1];
        const matches = folder.children.filter((name) =>
          name.toLowerCase().startsWith(lastPart.toLowerCase())
        );
        if (matches.length === 1) {
          parts[parts.length - 1] = matches[0];
          setInput(parts.join(" "));
        }
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    }
  };

  return (
    <div
      className="h-full bg-[#0d1117] p-4 overflow-auto terminal-text"
      ref={terminalRef}
      onClick={() => inputRef.current?.focus()}
    >
      {history.map((item, index) => (
        <div
          key={index}
          className={`whitespace-pre-wrap mb-1 ${
            item.type === "error"
              ? "text-red-400"
              : item.type === "command"
              ? "text-green-400"
              : "text-gray-300"
          }`}
        >
          {item.content}
        </div>
      ))}
      <div className="flex items-center text-green-400">
        <span className="text-cyan-400">{username.toLowerCase()}</span>
        <span className="text-white">@</span>
        <span className="text-purple-400">cyberos</span>
        <span className="text-white">:</span>
        <span className="text-blue-400">{currentPath}</span>
        <span className="text-white">$ </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-gray-300 ml-1 caret-green-400"
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
};

export default Terminal;
