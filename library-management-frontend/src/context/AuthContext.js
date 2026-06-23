import React, { createContext, useContext, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        // Restore user from localStorage on page refresh
        const saved = localStorage.getItem("lms_user");
        return saved ? JSON.parse(saved) : null;
    });

    async function signIn(email, password) {
        const data = await api.auth.login(email, password);
        localStorage.setItem("lms_token", data.token);
        localStorage.setItem("lms_user", JSON.stringify({ name: data.name, email: data.email }));
        setUser({ name: data.name, email: data.email });
    }

    async function signUp(name, email, password) {
        const data = await api.auth.register(name, email, password);
        localStorage.setItem("lms_token", data.token);
        localStorage.setItem("lms_user", JSON.stringify({ name: data.name, email: data.email }));
        setUser({ name: data.name, email: data.email });
    }

    function signOut() {
        localStorage.removeItem("lms_token");
        localStorage.removeItem("lms_user");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, signIn, signUp, signOut, isSignedIn: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
