import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import InputBox from './components/InputBox';

/**
 * Main App Component
 * Manages the entire application state, theme, and API integration
 */
function App() {
  // Theme state
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Chat state
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [savedChats, setSavedChats] = useState(() => {
    const saved = localStorage.getItem('savedChats');
    return saved ? JSON.parse(saved) : [];
  });
  
  // API configuration
  const [apiUrl, setApiUrl] = useState(() => {
    return localStorage.getItem('apiUrl') || '';
  });
  
  const chatContainerRef = useRef(null);

  // Apply theme to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Save API URL to localStorage
  useEffect(() => {
    localStorage.setItem('apiUrl', apiUrl);
  }, [apiUrl]);

  // Save all chats to localStorage
  useEffect(() => {
    localStorage.setItem('savedChats', JSON.stringify(savedChats));
  }, [savedChats]);

  // Update current chat in savedChats when messages change
  useEffect(() => {
    if (currentChatId && messages.length > 0) {
      setSavedChats(prev => 
        prev.map(chat => {
          if (chat.id === currentChatId) {
            // Generate title from first user message if title is still "New Chat"
            let title = chat.title;
            if (chat.title === 'New Chat' && messages.length > 0) {
              const firstUserMessage = messages.find(m => m.role === 'user');
              if (firstUserMessage) {
                // Take first 50 characters or until first newline/punctuation
                title = firstUserMessage.content
                  .split(/[\n.!?]/)[0]
                  .slice(0, 50)
                  .trim();
                // Add ellipsis if truncated
                if (firstUserMessage.content.length > 50) {
                  title += '...';
                }
              }
            }
            return { 
              ...chat, 
              title,
              messages, 
              updatedAt: new Date().toISOString() 
            };
          }
          return chat;
        })
      );
    }
  }, [messages, currentChatId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleNewChat = () => {
    // Only create a new chat if current chat has messages or there's no current chat
    if (messages.length > 0 || !currentChatId) {
      const newChatId = Date.now().toString();
      const newChat = {
        id: newChatId,
        title: 'New Chat',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setSavedChats(prev => [newChat, ...prev]);
      setCurrentChatId(newChatId);
      setMessages([]);
    }
  };

  const handleLoadChat = (chatId) => {
    const chat = savedChats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages);
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteChat = (chatId) => {
    setSavedChats(prev => prev.filter(c => c.id !== chatId));
    if (currentChatId === chatId) {
      setMessages([]);
      setCurrentChatId(null);
    }
  };

  const handleRenameChat = (chatId, newTitle) => {
    setSavedChats(prev =>
      prev.map(chat =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    );
  };

  const handleExportChat = () => {
    const chatData = {
      title: savedChats.find(c => c.id === currentChatId)?.title || 'Exported Chat',
      messages,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neuramind-chat-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportChat = (event, setIsImporting) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);
    const startTime = Date.now();
    const minLoadingTime = 1000; // Minimum 1 second loading

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const chatData = JSON.parse(e.target.result);
        const newChatId = Date.now().toString();
        const newChat = {
          id: newChatId,
          title: chatData.title || 'Imported Chat',
          messages: chatData.messages || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setSavedChats(prev => [newChat, ...prev]);
        setCurrentChatId(newChatId);
        setMessages(newChat.messages);
        
        // Ensure minimum loading time
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
        
        setTimeout(() => {
          setIsImporting(false);
        }, remainingTime);
      } catch (error) {
        // Ensure minimum loading time even on error
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
        
        setTimeout(() => {
          alert('Failed to import chat. Please check the file format.');
          console.error('Import error:', error);
          setIsImporting(false);
        }, remainingTime);
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const handleApiUrlChange = (url) => {
    setApiUrl(url);
  };

  /**
   * Send message to API and handle response
   */
  const handleSendMessage = async (userMessage) => {
    if (!apiUrl) {
      alert('Please configure the API URL in Settings');
      setIsSidebarOpen(true);
      return;
    }

    // Create a new chat if one doesn't exist
    if (!currentChatId) {
      const newChatId = Date.now().toString();
      const newChat = {
        id: newChatId,
        title: 'New Chat',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setSavedChats(prev => [newChat, ...prev]);
      setCurrentChatId(newChatId);
    }

    // Add user message to chat
    const userMsg = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // model: 'qwen2.5-coder:7b-instruct-q4_K_M',
          model: 'qwen2.5-coder:14b',
          prompt: userMessage,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const fullResponse = data.response || 'No response received';
      
      // Add empty AI message to the array first
      const aiMsg = { 
        role: 'assistant', 
        content: '',
        isStreaming: true
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsStreaming(true);
      
      // Simulate streaming effect by updating the last message
      const words = fullResponse.split(' ');
      let currentText = '';
      
      for (let i = 0; i < words.length; i++) {
        currentText += (i > 0 ? ' ' : '') + words[i];
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: currentText,
            isStreaming: true
          };
          return newMessages;
        });
        // Adjust delay for speed (20ms = fast, 50ms = medium, 100ms = slow)
        await new Promise(resolve => setTimeout(resolve, 30));
      }
      
      // Mark streaming as complete
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: 'assistant',
          content: fullResponse,
          isStreaming: false
        };
        return newMessages;
      });
      setIsStreaming(false);
      
    } catch (error) {
      console.error('Error calling API:', error);
      
      // Add error message to chat
      const errorMsg = {
        role: 'assistant',
        content: `Error: ${error.message}\n\nPlease check:\n- API URL is correct\n- API server is running\n- Network connection is stable`,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-bg overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onClose={() => setIsSidebarOpen(false)}
        onToggleCollapse={toggleSidebarCollapse}
        onNewChat={handleNewChat}
        apiUrl={apiUrl}
        onApiUrlChange={handleApiUrlChange}
        savedChats={savedChats}
        currentChatId={currentChatId}
        onLoadChat={handleLoadChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        onExportChat={handleExportChat}
        onImportChat={handleImportChat}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          isDark={isDark}
          toggleTheme={toggleTheme}
          toggleSidebar={toggleSidebar}
        />

        {/* Chat Area */}
        <main className="flex-1 overflow-hidden flex flex-col">
          {/* Messages Container */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto scrollbar-custom px-3 sm:px-4 py-4 sm:py-6"
          >
            <div className="max-w-4xl mx-auto">
              {messages.length === 0 ? (
                // Welcome screen
                <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
                  {/* Logo */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl 
                                  flex items-center justify-center mb-6 shadow-lg animate-fade-in">
                    <span className="text-3xl sm:text-4xl text-white font-bold">N</span>
                  </div>
                  
                  {/* Title */}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 
                                 bg-clip-text text-transparent mb-4 animate-fade-in">
                    Welcome to NeuraMind
                  </h1>
                  
                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-xl mb-8 animate-fade-in">
                    Your intelligent AI assistant. Start a conversation below!
                  </p>
                  
                  {/* Example prompts */}
                  <div className="max-w-2xl w-full space-y-3 mb-8 animate-fade-in">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Try asking:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          if (apiUrl) {
                            handleSendMessage("Explain quantum computing in simple terms");
                          }
                        }}
                        className="text-left px-4 py-3 bg-white dark:bg-dark-surface rounded-lg 
                                   hover:shadow-md hover:border-primary-500 border border-gray-200 dark:border-gray-700
                                   transition-all duration-200 group"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                          💡 Explain quantum computing
                        </span>
                      </button>
                      
                      <button
                        onClick={() => {
                          if (apiUrl) {
                            handleSendMessage("Write a Python function to sort a list");
                          }
                        }}
                        className="text-left px-4 py-3 bg-white dark:bg-dark-surface rounded-lg 
                                   hover:shadow-md hover:border-primary-500 border border-gray-200 dark:border-gray-700
                                   transition-all duration-200 group"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                          💻 Write a Python sorting function
                        </span>
                      </button>
                      
                      <button
                        onClick={() => {
                          if (apiUrl) {
                            handleSendMessage("What are the benefits of using React?");
                          }
                        }}
                        className="text-left px-4 py-3 bg-white dark:bg-dark-surface rounded-lg 
                                   hover:shadow-md hover:border-primary-500 border border-gray-200 dark:border-gray-700
                                   transition-all duration-200 group"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                          ⚛️ Benefits of using React
                        </span>
                      </button>
                      
                      <button
                        onClick={() => {
                          if (apiUrl) {
                            handleSendMessage("Explain the difference between let and const in JavaScript");
                          }
                        }}
                        className="text-left px-4 py-3 bg-white dark:bg-dark-surface rounded-lg 
                                   hover:shadow-md hover:border-primary-500 border border-gray-200 dark:border-gray-700
                                   transition-all duration-200 group"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                          📝 let vs const in JavaScript
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* API warning if not configured */}
                  {!apiUrl && (
                    <div className="px-5 py-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 
                                    dark:border-yellow-800 rounded-xl max-w-md animate-fade-in">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                        <span className="text-lg">⚠️</span>
                        <span>Configure API URL in Settings to get started</span>
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                // Chat messages
                <>
                  {messages.map((message, index) => (
                    <ChatMessage
                      key={index}
                      message={message}
                      isDark={isDark}
                    />
                  ))}
                  
                  {/* Typing indicator - only show when loading and not streaming */}
                  {isLoading && !isStreaming && (
                    <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 animate-fade-in">
                      <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 
                                      flex items-center justify-center shadow-md">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"/>
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                      <div className="bg-white dark:bg-dark-surface rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 shadow-md">
                        <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
                          Thinking...
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Input Box */}
          <InputBox
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
