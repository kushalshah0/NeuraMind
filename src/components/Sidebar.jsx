import React, { useState } from 'react';
import { 
  PlusIcon, 
  Cog6ToothIcon, 
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChatBubbleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import ModeSelector from './ModeSelector';
import DeleteChatModal from './DeleteChatModal';
import ApiHelpModal from './ApiHelpModal';

/**
 * Sidebar Component
 * Navigation sidebar with settings and new chat button
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether sidebar is open (mobile)
 * @param {boolean} props.isCollapsed - Whether sidebar is collapsed (desktop)
 * @param {Function} props.onClose - Callback to close sidebar
 * @param {Function} props.onToggleCollapse - Callback to toggle collapse state
 * @param {Function} props.onNewChat - Callback to start new chat
 * @param {string} props.apiUrl - Current API URL
 * @param {Function} props.onApiUrlChange - Callback when API URL changes
 * @param {Array} props.savedChats - List of saved chats
 * @param {string} props.currentChatId - Current active chat ID
 * @param {Function} props.onLoadChat - Callback to load a chat
 * @param {Function} props.onDeleteChat - Callback to delete a chat
 * @param {Function} props.onRenameChat - Callback to rename a chat
 * @param {Function} props.onExportChat - Callback to export current chat
 * @param {Function} props.onImportChat - Callback to import a chat
 */
const Sidebar = ({ 
  isOpen, 
  isCollapsed,
  onClose, 
  onToggleCollapse,
  onNewChat,
  apiUrl,
  onApiUrlChange,
  savedChats = [],
  currentChatId,
  onLoadChat,
  onDeleteChat,
  onRenameChat,
  onExportChat,
  onImportChat
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [tempApiUrl, setTempApiUrl] = useState(apiUrl);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [apiHelpModalOpen, setApiHelpModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportingChatId, setExportingChatId] = useState(null);

  const handleSaveSettings = () => {
    onApiUrlChange(tempApiUrl);
    setShowSettings(false);
  };

  const startEditing = (chatId, currentTitle) => {
    setEditingChatId(chatId);
    setEditingTitle(currentTitle);
  };

  const saveRename = (chatId) => {
    if (editingTitle.trim()) {
      onRenameChat(chatId, editingTitle.trim());
    }
    setEditingChatId(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Overlay - only on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 bg-white dark:bg-dark-bg 
                   border-r border-gray-200 dark:border-dark-border flex flex-col
                   transform transition-all duration-300 ease-in-out
                   ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                   ${isCollapsed ? 'lg:w-16' : 'lg:w-72'} w-72`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 lg:pb-3 border-b border-gray-200 dark:border-dark-border">
          {!isCollapsed && <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Menu</h2>}
          <div className="flex items-center gap-2">
            {/* Collapse toggle - desktop only */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:block p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-surface
                         transition-colors"
              aria-label="Toggle sidebar"
            >
              {isCollapsed ? (
                <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            {/* Close button - mobile only */}
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-surface
                         transition-colors"
              aria-label="Close sidebar"
            >
              <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className={`flex-1 overflow-y-auto scrollbar-custom p-4 flex flex-col ${isCollapsed ? 'overflow-x-hidden' : ''}`}>
          <div className="space-y-6">
          {/* New Chat and Import Buttons */}
          {isCollapsed ? (
            <div className="space-y-2 flex flex-col items-center">
              <button
                onClick={() => {
                  onNewChat();
                  onClose();
                }}
                className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg
                           shadow-sm hover:shadow-md transition-all duration-200"
                title="New Chat"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
              
              <label className={`p-2 bg-white dark:bg-dark-surface border border-gray-300 dark:border-gray-600
                                text-gray-700 dark:text-gray-300 rounded-lg
                                hover:bg-gray-50 dark:hover:bg-gray-700
                                transition-colors ${isImporting ? 'cursor-wait opacity-70' : 'cursor-pointer'}`}
                     title="Import Chat">
                {isImporting ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <ArrowUpTrayIcon className="w-5 h-5" />
                )}
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => onImportChat(e, setIsImporting)}
                  className="hidden"
                  disabled={isImporting}
                />
              </label>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => {
                  onNewChat();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 
                           bg-primary-500 hover:bg-primary-600 text-white rounded-lg
                           transition-all duration-200 text-sm"
              >
                <PlusIcon className="w-4 h-4" />
                <span className="font-medium">New Chat</span>
              </button>
              
              <label className={`w-full flex items-center justify-center gap-2 px-3 py-2
                                text-gray-600 dark:text-gray-400 rounded-lg text-sm
                                hover:bg-gray-100 dark:hover:bg-dark-surface
                                transition-colors ${isImporting ? 'cursor-wait opacity-70' : 'cursor-pointer'}`}
                     title="Import Chat">
                {isImporting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="font-medium">Importing...</span>
                  </>
                ) : (
                  <>
                    <ArrowUpTrayIcon className="w-4 h-4" />
                    <span className="font-medium">Import Chat</span>
                  </>
                )}
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => onImportChat(e, setIsImporting)}
                  className="hidden"
                  disabled={isImporting}
                />
              </label>
            </div>
          )}

          {/* Chat History */}
          {!isCollapsed && (
            <div className="space-y-1">
              <h3 className="px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Recent Chats
              </h3>
              <div className="space-y-1 max-h-64 overflow-y-auto scrollbar-custom">
              {savedChats.length === 0 ? (
                <p className="px-2 py-2 text-sm text-gray-500 dark:text-gray-400 italic">
                  No saved chats yet
                </p>
              ) : (
                savedChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`group relative px-2 py-2 rounded-lg transition-colors ${
                      currentChatId === chat.id
                        ? 'bg-primary-100 dark:bg-primary-900/30'
                        : 'hover:bg-gray-100 dark:hover:bg-dark-surface'
                    }`}
                  >
                    {editingChatId === chat.id ? (
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onBlur={() => saveRename(chat.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveRename(chat.id);
                          if (e.key === 'Escape') setEditingChatId(null);
                        }}
                        className="w-full px-2 py-1 text-sm bg-white dark:bg-dark-elevated border border-primary-500 
                                   rounded outline-none text-gray-800 dark:text-gray-200"
                        autoFocus
                      />
                    ) : (
                      <button
                        onClick={() => onLoadChat(chat.id)}
                        className="w-full text-left pr-20"
                      >
                        <div className="flex items-start gap-2">
                          <ChatBubbleLeftIcon className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-500 dark:text-gray-400" />
                          <div className="flex-1 min-w-0 overflow-hidden">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                              {chat.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(chat.updatedAt)}
                            </p>
                          </div>
                        </div>
                      </button>
                    )}
                    
                    {/* Action buttons */}
                    {editingChatId !== chat.id && (
                      <div className="absolute right-2 top-2 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEditing(chat.id, chat.title)}
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                          title="Rename"
                        >
                          <PencilIcon className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button
                          onClick={() => {
                            setExportingChatId(chat.id);
                            const chatToExport = {
                              title: chat.title,
                              messages: chat.messages,
                              exportedAt: new Date().toISOString()
                            };
                            const blob = new Blob([JSON.stringify(chatToExport, null, 2)], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `neuramind-${chat.title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                            setTimeout(() => setExportingChatId(null), 800);
                          }}
                          className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-50"
                          title="Export chat"
                          disabled={exportingChatId === chat.id}
                        >
                          {exportingChatId === chat.id ? (
                            <svg className="animate-spin h-3.5 w-3.5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <ArrowDownTrayIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setChatToDelete(chat);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
                          title="Delete"
                        >
                          <TrashIcon className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
              </div>
            </div>
          )}

          {/* Collapsed chat icons */}
          {isCollapsed && savedChats.length > 0 && (
            <div className="space-y-2 flex flex-col items-center">
              {savedChats.slice(0, 5).map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onLoadChat(chat.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    currentChatId === chat.id
                      ? 'bg-primary-500 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-dark-surface text-gray-600 dark:text-gray-400'
                  }`}
                  title={chat.title}
                >
                  <ChatBubbleLeftIcon className="w-5 h-5" />
                </button>
              ))}
            </div>
          )}
          </div>

          {/* Settings Section */}
          <div className="border-t border-gray-200 dark:border-dark-border pt-4 mt-auto">
            {/* Settings Panel - Appears ABOVE button */}
            {showSettings && !isCollapsed && (
              <div className="mb-3 space-y-3 px-3 animate-fade-in">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    API URL
                  </label>
                  <input
                    type="text"
                    value={tempApiUrl}
                    onChange={(e) => setTempApiUrl(e.target.value)}
                    placeholder="https://your-api-url.com"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-dark-surface 
                               border border-gray-300 dark:border-dark-border rounded-lg
                               text-sm text-gray-800 dark:text-gray-200
                               focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    onClick={() => setApiHelpModalOpen(true)}
                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline mt-1"
                  >
                    Where to get API URL?
                  </button>
                </div>
                <button
                  onClick={handleSaveSettings}
                  className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 
                             text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Save Settings
                </button>
              </div>
            )}

            {/* Settings Button - Always at bottom */}
            <div>
              {isCollapsed ? (
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 rounded-lg text-gray-700 dark:text-gray-300 
                               hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
                    title="Settings"
                  >
                    <Cog6ToothIcon className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg
                             text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface
                             transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Cog6ToothIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Settings</span>
                  </div>
                  {showSettings ? (
                    <ChevronDownIcon className="w-4 h-4" />
                  ) : (
                    <ChevronUpIcon className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

      </aside>

      {/* Delete Chat Modal */}
      <DeleteChatModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setChatToDelete(null);
        }}
        onConfirm={() => {
          if (chatToDelete) {
            onDeleteChat(chatToDelete.id);
          }
        }}
        chatTitle={chatToDelete?.title || ''}
      />

      {/* API Help Modal */}
      <ApiHelpModal
        isOpen={apiHelpModalOpen}
        onClose={() => setApiHelpModalOpen(false)}
      />
    </>
  );
};

export default Sidebar;
