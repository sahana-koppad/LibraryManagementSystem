import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Members from "./pages/Members";
import BorrowReturn from "./pages/BorrowReturn";
import MemberHistory from "./pages/MemberHistory";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import "./styles/tokens.css";
import "./styles/layout.css";

const navItems = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/books", label: "Books" },
  { to: "/members", label: "Members" },
  { to: "/borrow-return", label: "Borrow / return" },
];

function AppShell() {
  const { user, signOut, isSignedIn } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-brand-mark">LMS</span>
          <span className="sidebar-brand-name">Reading Room</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                "sidebar-link" + (isActive ? " sidebar-link-active" : "")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <p className="sidebar-footer-text">Library Management System</p>
          <p className="sidebar-footer-sub">Demo data &middot; v1.0</p>
        </div>
      </aside>

      <main className="content-area">
        <div className="topbar">
          {isSignedIn ? (
            <div className="user-pill">
              <span className="user-pill-name">{user.name}</span>
              <button className="user-pill-signout" onClick={signOut}>Sign out</button>
            </div>
          ) : (
            <div className="user-pill">
              <NavLink to="/signin" className="auth-link">Sign in</NavLink>
            </div>
          )}
        </div>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/members" element={<Members />} />
          <Route path="/borrow-return" element={<BorrowReturn />} />
          <Route path="/members/:id/history" element={<MemberHistory />} />
        </Routes>
      </main>
    </div>
  );
}

function Root() {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/*" element={<AppShell />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Root />
      </AuthProvider>
    </BrowserRouter>
  );
}
