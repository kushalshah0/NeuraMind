# NeuraMind - AI Chat Assistant

A modern, professional, fully responsive AI chat webapp that connects to Ollama API. NeuraMind provides a premium ChatGPT-style experience with streaming responses, chat management, and beautiful code highlighting.

![NeuraMind](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-5.1.0-646CFF.svg)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.1-38bdf8.svg)

## ✨ Features

### 🚀 Core Functionality
- 💬 **AI Chat Interface** - Natural conversations with streaming responses
- 📝 **Word-by-word Streaming** - ChatGPT-style typing animation
- 💾 **Chat Management** - Save, load, rename, export, and delete chats
- 🎯 **Smart Auto-naming** - Automatically names chats from first message
- 📤 **Export/Import** - Download and upload chats as JSON files
- 🔄 **Multiple Sessions** - Switch between different chat conversations

### 🎨 Premium UI/UX
- 🌓 **Dark/Light Theme** - Smooth theme switching with modern icons
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- ✨ **Smooth Animations** - Fade-in effects, loading spinners, transitions
- 🎯 **Syntax Highlighting** - Beautiful code display with Prism
- 📋 **Code Actions** - Copy to clipboard and download code blocks
- 💅 **ChatGPT-style Design** - Clean, modern interface without avatars
- 🎪 **Interactive Welcome** - Example prompts to get started quickly

### 🗂️ Navigation & UI
- 📂 **Collapsible Sidebar** - Desktop: collapse to icons, Mobile: slide-out
- ⚙️ **Settings Panel** - Configure API URL with helpful guide
- ❓ **How-to-Use Modal** - Step-by-step guide to setup Ollama API
- 🔗 **Direct Colab Link** - Quick access to Ollama Colab notebook
- 🎨 **Modern Icons** - Heroicons throughout the interface

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or yarn
- **Ollama API** endpoint (local or via Google Colab)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/kushalshah0/NeuraMind.git
   cd NeuraMind
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   - Opens automatically at `http://localhost:3000`
   - Hot Module Replacement (HMR) for instant updates

4. **Configure API URL**
   - Click the hamburger menu (mobile) or sidebar (desktop)
   - Go to Settings → Enter your Ollama API URL
   - Click "Where to get API URL?" for setup instructions

### Build Commands

**Development:**
```bash
npm run dev          # Start dev server with HMR
```

**Production:**
```bash
npm run build        # Build for production (outputs to /dist)
npm run preview      # Preview production build locally
```

## ⚙️ Configuration

### Setting up the Ollama API

#### Option 1: Google Colab (Recommended for Testing)
1. Open the sidebar → Settings → Click "Where to get API URL?"
2. Click the Colab notebook link in the modal
3. Run all cells in the notebook
4. Use ngrok or Cloudflare tunnel to get a public URL
5. Copy the URL and paste in Settings → API URL

Direct Colab Link: [Ollama Colab Notebook](https://colab.research.google.com/github/kushalshah0/NeuraMind/blob/main/ollama_colab.ipynb)

#### Option 2: Local Ollama
1. Install Ollama from [ollama.ai](https://ollama.ai)
2. Start Ollama server: `ollama serve`
3. Default URL: `http://localhost:11434`
4. Enter this URL in Settings → API URL

### API Configuration

The app uses Ollama's `/api/generate` endpoint:

**Request:**
```json
{
  "model": "qwen2.5-coder:7b-instruct-q4_K_M",
  "prompt": "Your message",
  "stream": false
}
```

**Response:**
```json
{
  "response": "AI response text"
}
```

**⚠️ Important:** Enable CORS on your Ollama server to allow browser requests.

## 🎯 Usage

### Getting Started

1. **New Chat** - Click "New Chat" button in sidebar
2. **Type Message** - Enter your question in the input box
3. **Send** - Press Enter or click send button
4. **Watch Response Stream** - AI response appears word-by-word

### Chat Management

- **Save Chats** - All chats auto-save to browser storage
- **Load Chats** - Click any chat in sidebar to load it
- **Rename** - Click pencil icon next to chat name
- **Export** - Click download icon to save as JSON
- **Delete** - Click trash icon to remove chat
- **Import** - Use "Import Chat" button to load JSON files

### Keyboard Shortcuts

- **Enter** - Send message
- **Shift + Enter** - New line in message

### Features

- ✨ **Streaming responses** - Watch AI type in real-time
- 📋 **Copy messages** - One-click copy for AI responses
- 💻 **Code highlighting** - Automatic syntax highlighting
- 📥 **Download code** - Save code blocks to files
- 🎨 **Rich formatting** - Bold, italic, lists, and more
- 🌙 **Theme toggle** - Switch between dark and light modes

## 📁 Project Structure

```
neuramind/
├── public/
│   └── favicon.svg             # App favicon
├── src/
│   ├── components/
│   │   ├── Header.jsx          # App header with logo and theme toggle
│   │   ├── Sidebar.jsx         # Navigation sidebar with chat history
│   │   ├── ChatMessage.jsx     # Message component with streaming support
│   │   ├── InputBox.jsx        # ChatGPT-style message input
│   │   ├── ThemeToggle.jsx     # Dark/Light theme switcher
│   │   ├── DeleteChatModal.jsx # Confirmation modal for deletions
│   │   └── ApiHelpModal.jsx    # API setup instructions modal
│   ├── App.jsx                 # Main app with state management
│   ├── index.jsx               # React entry point
│   └── index.css               # Global styles with Tailwind
├── index.html                  # HTML entry point
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind with custom theme
├── postcss.config.js           # PostCSS configuration
└── README.md                   # This file
```

## 🎨 Technology Stack

- **React** (18.2.0) - UI library with functional components and hooks
- **Vite** (5.1.0) - Lightning-fast build tool and dev server
- **Tailwind CSS** (3.4.1) - Utility-first CSS framework
- **Heroicons** (2.1.1) - Modern icon library
- **React Syntax Highlighter** (15.5.0) - Code syntax highlighting
- **Prism React Renderer** (2.3.1) - Code theme support

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Features Checklist

**Chat Experience:**
- ✅ Word-by-word streaming responses (ChatGPT-style)
- ✅ Auto-generated chat titles from first message
- ✅ Multiple chat sessions with history
- ✅ Save/Load/Rename/Export/Delete chats
- ✅ Import/Export with loading animations
- ✅ Auto-scrolling chat interface
- ✅ Copy AI responses to clipboard
- ✅ "Thinking..." indicator while loading

**Code Features:**
- ✅ Syntax highlighting (Prism)
- ✅ Copy code to clipboard
- ✅ Download code as files
- ✅ Line numbers in code blocks
- ✅ Multiple language support

**UI/UX:**
- ✅ Dark/Light theme with modern icons
- ✅ Fully responsive (mobile/tablet/desktop)
- ✅ Collapsible sidebar (desktop)
- ✅ Slide-out sidebar (mobile)
- ✅ ChatGPT-style message layout
- ✅ Smooth animations throughout
- ✅ Interactive welcome screen
- ✅ Premium gradients and shadows
- ✅ Custom scrollbars

**Settings & Help:**
- ✅ API URL configuration
- ✅ Setup guide modal
- ✅ Direct link to Ollama Colab
- ✅ LocalStorage persistence

## 🔧 Customization

### Changing Colors

Edit `tailwind.config.js` to customize the color palette:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

### Changing the Model

Edit `src/App.jsx` and modify the `model` parameter in the API request:

```javascript
body: JSON.stringify({
  model: 'your-model-name',
  prompt: prompt,
  stream: false,
}),
```

## 🐛 Troubleshooting

### API Connection Issues

**Error: "Failed to fetch"**
- Verify API URL is correct in Settings
- Ensure Ollama server is running
- Check CORS is enabled on the server
- For Colab: Verify ngrok/Cloudflare tunnel is active

**Streaming Not Working**
- Check browser console for errors
- Verify API response format matches expected structure
- Try refreshing the page

### UI Issues

**Theme Not Persisting**
- Enable browser local storage
- Clear cache and reload (Ctrl+Shift+R)

**Sidebar Not Showing**
- Check browser width (collapsible on desktop)
- Click hamburger menu on mobile

**Chat History Missing**
- Check browser local storage is enabled
- Look for `savedChats` key in DevTools → Application → Local Storage

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 🙏 Acknowledgments

- **Ollama** - Local LLM runtime
- **Heroicons** - Beautiful icon set
- **Prism** - Code syntax highlighting
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Lightning-fast build tool

## 👨‍💻 Author

Built with ❤️ for premium AI experiences

---

**NeuraMind** - Your intelligent AI assistant
