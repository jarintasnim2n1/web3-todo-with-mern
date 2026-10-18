"use client";

const Modal = ({ isOpen, onClose, content, type = "info" }) => {
  if (!isOpen) return null;

  const icons = { success: "✅", error: "❌", info: "ℹ️" };

  return (
    <div className="modal_overlay" onClick={onClose}>
      <div className="modal_box" onClick={(e) => e.stopPropagation()}>
        <div className="modal_icon">{icons[type] || icons.info}</div>
        <p>{content}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
