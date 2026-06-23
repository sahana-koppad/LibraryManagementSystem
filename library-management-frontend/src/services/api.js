// Central place for all backend API calls.
// Every fetch() goes through here so that when the backend URL changes,
// you only update one file, not every component.

const BASE_URL = "http://localhost:8080/api";

// Attach JWT token to every request automatically
function authHeaders() {
    const token = localStorage.getItem("lms_token");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function request(method, path, body = null) {
    const response = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: authHeaders(),
        ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Request failed" }));
        throw new Error(error.message || "Something went wrong");
    }

    // 204 No Content has no body
    if (response.status === 204) return null;
    return response.json();
}

// ===== Auth =====
export const api = {
    auth: {
        login: (email, password) => request("POST", "/auth/login", { email, password }),
        register: (name, email, password) => request("POST", "/auth/register", { name, email, password }),
    },

    // ===== Books =====
    books: {
        getAll: (search, categoryId) => {
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (categoryId && categoryId !== "all") params.append("categoryId", categoryId);
            const qs = params.toString();
            return request("GET", `/books${qs ? "?" + qs : ""}`);
        },
        create: (data) => request("POST", "/books", data),
        delete: (id) => request("DELETE", `/books/${id}`),
    },

    // ===== Authors =====
    authors: {
        getAll: () => request("GET", "/authors"),
        create: (data) => request("POST", "/authors", data),
    },

    // ===== Categories =====
    categories: {
        getAll: () => request("GET", "/categories"),
        create: (data) => request("POST", "/categories", data),
    },

    // ===== Members =====
    members: {
        getAll: () => request("GET", "/members"),
        create: (data) => request("POST", "/members", data),
        delete: (id) => request("DELETE", `/members/${id}`),
    },

    // ===== Borrow / Return =====
    borrow: {
        getAll: () => request("GET", "/borrow"),
        getActive: () => request("GET", "/borrow/active"),
        getMemberHistory: (memberId) => request("GET", `/borrow/member/${memberId}`),
        issue: (bookId, memberId) => request("POST", "/borrow", { bookId, memberId }),
        returnBook: (recordId) => request("PUT", `/borrow/${recordId}/return`),
    },
};
