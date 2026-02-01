import React from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  CodeBracketIcon, 
  ArrowPathIcon, 
  LightBulbIcon 
} from '@heroicons/react/24/outline';

/**
 * ModeSelector Component
 * Allows users to select different AI interaction modes
 * @param {Object} props - Component props
 * @param {string} props.currentMode - Currently selected mode
 * @param {Function} props.onModeChange - Callback when mode changes
 */
const ModeSelector = ({ currentMode, onModeChange }) => {
  const modes = [
    { id: 'chat', name: 'Chat', icon: ChatBubbleLeftRightIcon, description: 'General conversation' },
    { id: 'code', name: 'Generate Code', icon: CodeBracketIcon, description: 'Create code snippets' },
    { id: 'refactor', name: 'Refactor', icon: ArrowPathIcon, description: 'Improve existing code' },
    { id: 'explain', name: 'Explain', icon: LightBulbIcon, description: 'Explain concepts' },
  ];

  return (
    <div className="space-y-1">
      <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
        Modes
      </h3>
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = currentMode === mode.id;
        
        return (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                       ${isActive 
                         ? 'bg-primary-500 text-white shadow-md' 
                         : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface'
                       }`}
            title={mode.description}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">{mode.name}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ModeSelector;
