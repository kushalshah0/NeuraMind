import React from 'react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

/**
 * DeleteChatModal Component
 * A confirmation modal for deleting chats
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Callback to close modal
 * @param {Function} props.onConfirm - Callback when delete is confirmed
 * @param {string} props.chatTitle - Title of the chat being deleted
 */
const DeleteChatModal = ({ isOpen, onClose, onConfirm, chatTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-30"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-dark-surface rounded-xl shadow-xl max-w-sm w-full 
                      border border-gray-200 dark:border-gray-700 animate-fade-in p-6">
        {/* Content */}
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Delete "{chatTitle}"?
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium
                       text-gray-700 dark:text-gray-300
                       hover:bg-gray-100 dark:hover:bg-gray-700
                       transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium
                       bg-red-600 hover:bg-red-700 text-white
                       transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteChatModal;
