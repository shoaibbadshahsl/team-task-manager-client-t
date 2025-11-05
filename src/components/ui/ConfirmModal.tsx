import React from 'react';
import Modal from './Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  error?: string | null;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = 'Confirm',
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  error = null,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <div>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.487 0l5.516 9.816c.75 1.334-.213 2.985-1.744 2.985H4.485c-1.53 0-2.494-1.65-1.744-2.985L8.257 3.1zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-8a1 1 0 01.993.883L11 6v4a1 1 0 01-1.993.117L9 10V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div>
            {description}
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            {cancelLabel}
          </button>

          <button
            onClick={() => onConfirm()}
            className="px-4 py-2 rounded-md bg-red-600 text-white"
            disabled={loading}
          >
            {loading ? 'Deleting...' : confirmLabel}
          </button>
        </div>

        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      </div>
    </Modal>
  );
};

export default ConfirmModal;
