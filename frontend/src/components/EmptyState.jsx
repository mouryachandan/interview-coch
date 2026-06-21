import React from "react";
import { useNavigate } from "react-router-dom";

function EmptyState({ icon: Icon, title, desc, actionLabel, actionPath, onAction }) {
  const navigate = useNavigate();
  return (
    <div className="empty-state">
      {Icon && <div className="empty-icon"><Icon size={40} /></div>}
      <h3>{title}</h3>
      <p>{desc}</p>
      {(actionLabel && (actionPath || onAction)) && (
        <button
          className="empty-action"
          onClick={() => (onAction ? onAction() : navigate(actionPath))}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
