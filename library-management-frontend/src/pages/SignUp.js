import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        if (password !== confirmPassword) { setError("Passwords don't match."); return; }
        setLoading(true);
        try {
            await signUp(name, email, password);
            navigate("/");
        } catch (err) {
            setError(err.message || "Registration failed. Try again.");
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
                <h1 className="auth-title">Create an account</h1>
                <p className="auth-subtitle">Sign up to manage the library.</p>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <label className="form-field">
                        <span>Full name</span>
                        <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
                    </label>
                    <label className="form-field">
                        <span>Email</span>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" required />
                    </label>
                    <label className="form-field">
                        <span>Password</span>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" required />
                    </label>
                    <label className="form-field">
                        <span>Confirm password</span>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" required />
                    </label>
                    {error && <p className="form-message form-message-danger">{error}</p>}
                    <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                        {loading ? "Creating account..." : "Create account"}
                    </button>
                </form>
                <p className="auth-footer-text">
                    Already have an account? <Link to="/signin" className="auth-link">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
