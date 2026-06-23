import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await signIn(email, password);
            navigate("/");
        } catch (err) {
            setError(err.message || "Sign in failed. Check your email and password.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-shell">
            <div className="auth-card">
                <div className="auth-brand">
                    <span className="sidebar-brand-mark">LMS</span>
                    <span className="auth-brand-name">Reading Room</span>
                </div>
                <h1 className="auth-title">Sign in</h1>
                <p className="auth-subtitle">Welcome back. Enter your details to continue.</p>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <label className="form-field">
                        <span>Email</span>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                            placeholder="name@example.com" required autoComplete="email" />
                    </label>
                    <label className="form-field">
                        <span>Password</span>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                            placeholder="Enter your password" required autoComplete="current-password" />
                    </label>
                    {error && <p className="form-message form-message-danger">{error}</p>}
                    <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>
                <p className="auth-footer-text">
                    Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
                </p>
            </div>
        </div>
    );
}
