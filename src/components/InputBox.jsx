import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

/**
 * InputBox Component
 * Handles user input with send button and keyboard shortcuts
 * @param {Object} props - Component props
 * @param {Function} props.onSendMessage - Callback when message is sent
 * @param {boolean} props.isLoading - Whether AI is currently responding
 */
const InputBox = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    // Send message on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="sticky bottom-0 bg-white dark:bg-dark-bg px-3 py-3 sm:px-4 sm:py-4">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="relative flex items-center gap-2 bg-white dark:bg-dark-surface rounded-3xl 
                        shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(0,0,0,0.3)]
                        border border-gray-400 dark:border-gray-700
                        px-4 py-3 lg:py-2 transition-all duration-200
                        focus-within:border-primary-500 focus-within:shadow-[0_0_15px_rgba(14,165,233,0.2)] dark:focus-within:shadow-[0_0_15px_rgba(14,165,233,0.3)]">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? "AI is thinking..." : "Type your message..."}
            disabled={isLoading}
            rows={1}
            className="flex-1 bg-transparent text-gray-900 dark:text-gray-200 placeholder-gray-400 
                       dark:placeholder-gray-500 resize-none outline-none border-none focus:ring-0 
                       min-h-[24px] max-h-[200px] disabled:opacity-50 disabled:cursor-not-allowed
                       text-[15px] leading-6 font-medium"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 
                       ${input.trim() && !isLoading
                         ? 'bg-gray-900 dark:bg-white text-white dark:text-black hover:opacity-80'
                         : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                       }`}
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Hint text - hidden on mobile */}
        <p className="hidden sm:block text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
          NeuraMind can make mistakes. Check important info.
        </p>
      </form>
    </div>
  );
};

export default InputBox;
