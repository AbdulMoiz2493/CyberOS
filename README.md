# CyberOS - Web-Based Operating System

A fully functional, browser-based operating system simulation built with React. CyberOS provides a modern desktop experience with draggable windows, a file system, multiple applications, and a beautiful glassmorphism UI design.

![CyberOS](https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&q=80)

## 🚀 Features

### Core System
- **Lock Screen** - Beautiful animated lock screen with clock display and user authentication
- **Desktop Environment** - Draggable desktop icons with customizable positions
- **Window Management** - Resizable, draggable windows with minimize, maximize, and close functionality
- **Taskbar** - Windows-style taskbar with pinned apps, system tray, and clock
- **Start Menu** - Application launcher with search functionality
- **Context Menus** - Right-click context menus throughout the system
- **Persistent Storage** - Settings and file system persist across sessions using localStorage

### Built-in Applications

| Application | Description |
|-------------|-------------|
| **File Manager** | Browse and manage the virtual file system |
| **Terminal** | Full-featured command-line interface with common Unix commands |
| **Browser** | Simple web browser with navigation |
| **Settings** | System settings for themes, wallpapers, and preferences |
| **Text Editor** | Create and edit text files |
| **Calculator** | Scientific calculator with history |
| **Photos** | Image viewer application |
| **Music Player** | Audio player with playlist support |
| **App Store** | Browse and install additional apps |
| **Task Manager** | Monitor running applications |
| **Notes** | Quick note-taking application |
| **Calendar** | Date and event management |
| **Weather** | Weather forecast display |
| **Clock** | World clock and alarms |
| **Trash** | Recycle bin for deleted files |

### Terminal Commands
The built-in terminal supports the following commands:
- `help` - Display available commands
- `ls` - List directory contents
- `cd` - Change directory
- `pwd` - Print working directory
- `mkdir` - Create directories
- `touch` - Create files
- `rm` - Remove files/directories
- `cat` - Display file contents
- `echo` - Print text
- `whoami` - Display current user
- `date` - Show current date/time
- `uname` - System information
- `history` - Command history
- `neofetch` - Display system info with ASCII art
- `clear` - Clear terminal

### Customization
- **Themes** - Dark and Light mode support
- **Wallpapers** - Multiple built-in wallpapers with custom URL support
- **Accent Colors** - Customizable system accent color
- **Icon Sizes** - Small, medium, and large desktop icons
- **Taskbar** - Auto-hide option and position settings
- **Display** - Brightness and night light controls

## 📁 Project Structure

```
CyberOS/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── apps/
│   │   │   ├── AppStore.jsx       # App store interface
│   │   │   ├── Browser.jsx        # Web browser
│   │   │   ├── Calculator.jsx     # Calculator app
│   │   │   ├── Calendar.jsx       # Calendar app
│   │   │   ├── ClockApp.jsx       # Clock/alarms
│   │   │   ├── FileManager.jsx    # File explorer
│   │   │   ├── ImageViewer.jsx    # Photo viewer
│   │   │   ├── MusicPlayer.jsx    # Music player
│   │   │   ├── Notes.jsx          # Notes app
│   │   │   ├── Settings.jsx       # System settings
│   │   │   ├── TaskManager.jsx    # Task manager
│   │   │   ├── Terminal.jsx       # Terminal emulator
│   │   │   ├── TextEditor.jsx     # Text editor
│   │   │   ├── Trash.jsx          # Recycle bin
│   │   │   └── Weather.jsx        # Weather app
│   │   ├── ui/
│   │   │   └── Modal.jsx          # Reusable modal component
│   │   ├── ContextMenu.jsx        # Right-click menus
│   │   ├── Desktop.jsx            # Desktop with icons
│   │   ├── Icons.jsx              # Icon component wrapper
│   │   ├── LockScreen.jsx         # Lock screen UI
│   │   ├── SearchPanel.jsx        # Search functionality
│   │   ├── StartMenu.jsx          # Start menu
│   │   ├── Taskbar.jsx            # Bottom taskbar
│   │   ├── Window.jsx             # Window component
│   │   └── WindowManager.jsx      # Window orchestration
│   ├── lib/
│   │   └── utils.js               # Utility functions
│   ├── store/
│   │   └── osStore.js             # Zustand state management
│   ├── App.jsx                    # Main app component
│   ├── index.css                  # Global styles
│   └── main.jsx                   # Entry point
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Zustand** - State management with persistence
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations and transitions
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Icon library
- **react-rnd** - Resizable and draggable windows
- **date-fns** - Date manipulation

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AbdulMoiz2493/CyberOS.git
   cd CyberOS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## 🏗️ Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🔧 Preview Production Build

```bash
npm run preview
```

## ⚙️ Configuration

### Vite Configuration
The project uses Vite with the following configuration:
- SWC for fast React compilation
- Path alias `@` pointing to `./src`
- Development server on port 3000

### Tailwind Configuration
Custom color palette defined for the OS theme:
- `os-bg` - Background color (#1a1a2e)
- `os-surface` - Surface color (#16213e)
- `os-accent` - Accent color (#0f3460)
- `os-primary` - Primary color (#e94560)
- `os-text` - Text color (#eaeaea)

## 🎨 Screenshots

### Lock Screen
Beautiful animated lock screen with time display and smooth transitions.

### Desktop
Clean desktop environment with draggable icons and customizable wallpapers.

### Window Management
Multiple windows with resize, drag, minimize, maximize, and close functionality.

### Terminal
Full-featured terminal with syntax highlighting and command history.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Abdul Moiz**

- Email: abdulmoiz8895@gmail.com
- GitHub: [@abdulmoiz](https://github.com/abdulmoiz)

