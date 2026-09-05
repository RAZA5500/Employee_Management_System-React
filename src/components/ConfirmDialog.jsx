import React from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangleIcon } from 'lucide-react'

const ConfirmDialog = ({ open, title, message, confirmLabel = "Delete", onConfirm, onCancel }) => {

    if (!open) return null

  return createPortal(
    <div
      onClick={onCancel}
      className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-in"
      >
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-full bg-rose-50 shrink-0">
            <AlertTriangleIcon className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500 mt-1">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-rose-600 text-white px-5 py-2.5 rounded-md text-sm hover:bg-rose-700
              transition-all duration-200 shadow-md shadow-rose-500/25 active:scale-[0.98]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ConfirmDialog
