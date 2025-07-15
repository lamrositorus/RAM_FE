import React from 'react'

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  return (
    <>
      {/* Modal Toggle Hidden Checkbox */}
      <input type="checkbox" id="confirm-modal" className="modal-toggle" checked={isOpen} readOnly />
      
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message">
        <div className="modal-box">
          <h3 id="confirm-title" className="font-bold text-lg">
            {title || 'Konfirmasi'}
          </h3>
          <p id="confirm-message" className="py-4">
            {message || 'Apakah Anda yakin?'}
          </p>
          <div className="modal-action">
            <button onClick={onCancel} className="btn btn-outline" aria-label="Batal">
              Batal
            </button>
            <button onClick={onConfirm} className="btn btn-primary" aria-label="Konfirmasi">
              Ya
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
