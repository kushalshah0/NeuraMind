import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  ClipboardIcon, 
  ClipboardDocumentCheckIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

/**
 * ChatMessage Component
 * Displays individual chat messages with syntax highlighting for code blocks
 * @param {Object} props - Component props
 * @param {Object} props.message - Message object containing role and content
 * @param {boolean} props.isDark - Current theme state
 */
const ChatMessage = ({ message, isDark }) => {
  const [copiedCode, setCopiedCode] = useState(null);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const isUser = message.role === 'user';

  // Parse message content to detect code blocks
  const parseContent = (content) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.substring(lastIndex, match.index),
        });
      }

      // Add code block
      parts.push({
        type: 'code',
        language: match[1] || 'text',
        content: match[2].trim(),
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.substring(lastIndex),
      });
    }

    return parts.length > 0 ? parts : [{ type: 'text', content }];
  };

  const copyToClipboard = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(index);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const copyMessageToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const downloadCode = (code, language) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language || 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Format text content with markdown-like styling
  const formatTextContent = (text) => {
    // Split by double newlines for paragraphs
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, pIndex) => {
      // Skip empty paragraphs
      if (!paragraph.trim()) return null;

      const lines = paragraph.split('\n');
      
      return (
        <div key={pIndex} className={pIndex > 0 ? 'mt-4' : ''}>
          {lines.map((line, lIndex) => {
            // Check if it's a list item
            if (line.match(/^[\s]*[-*•]\s/)) {
              const content = line.replace(/^[\s]*[-*•]\s/, '');
              return (
                <div key={lIndex} className="flex gap-2 mb-1">
                  <span className="flex-shrink-0">•</span>
                  <span>{formatInlineText(content)}</span>
                </div>
              );
            }
            
            // Check if it's a numbered list
            if (line.match(/^[\s]*\d+\.\s/)) {
              const content = line.replace(/^[\s]*\d+\.\s/, '');
              const number = line.match(/^[\s]*(\d+)\./)?.[1];
              return (
                <div key={lIndex} className="flex gap-2 mb-1">
                  <span className="flex-shrink-0">{number}.</span>
                  <span>{formatInlineText(content)}</span>
                </div>
              );
            }

            // Check if it's a heading
            if (line.match(/^#{1,3}\s/)) {
              const level = line.match(/^(#{1,3})/)?.[1].length || 1;
              const content = line.replace(/^#{1,3}\s/, '');
              const sizeClass = level === 1 ? 'text-xl font-bold' : level === 2 ? 'text-lg font-semibold' : 'text-base font-semibold';
              return (
                <div key={lIndex} className={`${sizeClass} mb-2 mt-3`}>
                  {formatInlineText(content)}
                </div>
              );
            }
            
            // Regular line
            return lIndex < lines.length - 1 ? (
              <div key={lIndex}>{formatInlineText(line)}</div>
            ) : (
              <span key={lIndex}>{formatInlineText(line)}</span>
            );
          })}
        </div>
      );
    });
  };

  // Format inline text (bold, inline code, etc.)
  const formatInlineText = (text) => {
    const parts = [];
    let lastIndex = 0;
    
    // Match **bold**, `code`, and *italic*
    const regex = /(\*\*.*?\*\*)|(`.*?`)|(\*.*?\*)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      // Add formatted match
      if (match[0].startsWith('**')) {
        // Bold
        parts.push(
          <strong key={match.index} className="font-semibold">
            {match[0].slice(2, -2)}
          </strong>
        );
      } else if (match[0].startsWith('`')) {
        // Inline code
        parts.push(
          <code 
            key={match.index} 
            className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-sm font-mono"
          >
            {match[0].slice(1, -1)}
          </code>
        );
      } else if (match[0].startsWith('*')) {
        // Italic
        parts.push(
          <em key={match.index} className="italic">
            {match[0].slice(1, -1)}
          </em>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const contentParts = parseContent(message.content);

  return (
    <div className={`mb-4 sm:mb-6 animate-fade-in group ${isUser ? 'flex justify-end' : ''}`}>
      {/* Message Content */}
      <div className={`max-w-full sm:max-w-[95%]`}>
        <div
          className={`rounded-2xl shadow-md ${
            isUser
              ? 'bg-primary-500 text-white px-3 py-2 sm:px-4 sm:py-2.5'
              : 'bg-white dark:bg-dark-surface text-gray-800 dark:text-gray-200 px-3 py-2.5 sm:px-4 sm:py-3'
          }`}
        >
          {contentParts.map((part, index) => {
            if (part.type === 'text') {
              return (
                <div key={index} className="break-words">
                  {formatTextContent(part.content)}
                </div>
              );
            } else {
              return (
                <div key={index} className="my-3 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                  {/* Code block header */}
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
                    <span className="text-xs font-mono text-gray-700 dark:text-gray-300 uppercase font-semibold">
                      {part.language}
                    </span>
                    <div className="flex gap-2">
                      {/* Copy button */}
                      <button
                        onClick={() => copyToClipboard(part.content, index)}
                        className="p-1.5 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                        title="Copy code"
                      >
                        {copiedCode === index ? (
                          <ClipboardDocumentCheckIcon className="w-4 h-4 text-green-500" />
                        ) : (
                          <ClipboardIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        )}
                      </button>
                      {/* Download button */}
                      <button
                        onClick={() => downloadCode(part.content, part.language)}
                        className="p-1.5 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                        title="Download code"
                      >
                        <ArrowDownTrayIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                  {/* Code content */}
                  <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 
                                  scrollbar-track-transparent hover:scrollbar-thumb-gray-500 dark:hover:scrollbar-thumb-gray-500">
                    <SyntaxHighlighter
                      language={part.language}
                      style={isDark ? vscDarkPlus : vs}
                      customStyle={{
                        margin: 0,
                        padding: '1rem',
                        background: 'transparent',
                        fontSize: '0.875rem',
                      }}
                      showLineNumbers
                    >
                      {part.content}
                    </SyntaxHighlighter>
                  </div>
                </div>
              );
            }
          })}
        </div>
        
        {/* Copy Message Button - Below message (only for AI messages) */}
        {!isUser && (
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={copyMessageToClipboard}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Copy message"
            >
              {copiedMessage ? (
                <ClipboardDocumentCheckIcon className="w-4 h-4 text-green-500" />
              ) : (
                <ClipboardIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
