import React from "react";
import "../styles/components.css";

export function Card({ children, className = "" }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function StatCard({ label, value, tone = "default" }) {
  return (
    <div className={`stat-card stat-card-${tone}`}>
      <p className="stat-card-value">{value}</p>
      <p className="stat-card-label">{label}</p>
    </div>
  );
}

export function Badge({ children, tone = "default" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function Button({ children, variant = "primary", onClick, type = "button", disabled = false }) {
  return (
    <button
      type={type}
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function EmptyState({ title, message }) {
  return (
    <div className="empty-state">
      <p className="empty-state-title">{title}</p>
      <p className="empty-state-message">{message}</p>
    </div>
  );
}
