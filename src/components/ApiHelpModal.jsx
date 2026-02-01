import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * ApiHelpModal Component
 * Shows instructions on how to get API URL
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Callback to close modal
 */
const ApiHelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-30"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-dark-surface rounded-xl shadow-xl max-w-lg w-full 
                      border border-gray-200 dark:border-gray-700 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            How to Get API URL
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Option 1: Google Colab */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-3">
              Option 1: Using Google Colab (Recommended)
            </h4>
            <ol className="text-sm text-blue-800 dark:text-blue-400 space-y-2 list-decimal list-inside">
              <li>
                <a 
                  href="https://colab.research.google.com/github/kushalshah0/NeuraMind/blob/main/ollama_colab.ipynb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Open the Ollama Colab notebook →
                </a>
              </li>
              <li>Run all the cells in the notebook</li>
              <li>Wait for Ollama server to start</li>
              <li>Copy the generated URL (e.g., https://xyz.trycloudflare.com)</li>
              <li>Paste it in the API URL field above</li>
            </ol>
          </div>

          {/* Option 2: Local Setup */}
          <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Option 2: Local Setup
            </h4>
            <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-decimal list-inside">
              <li>Install Ollama from <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">ollama.ai</a></li>
              <li>Start Ollama server on your computer</li>
              <li>Default URL: <code className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">http://localhost:11434</code></li>
              <li>Enter this URL in the API URL field</li>
            </ol>
          </div>

          {/* Important Note */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-400">
              <strong>⚠️ Important:</strong> Make sure CORS is enabled on your Ollama server to allow API requests from the browser.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-5 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiHelpModal;
