import React, { useState, useEffect } from "react";
import { Card, Badge, Button, EmptyState } from "../components/UI";
import { api } from "../services/api";

export default function Books() {
    const [books, setBooks] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: "", isbn: "", authorId: "", categoryId: "", totalCopies: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        Promise.all([api.books.getAll(), api.authors.getAll(), api.categories.getAll()])
            .then(([b, a, c]) => { setBooks(b); setAuthors(a); setCategories(c); })
            .finally(() => setLoading(false));
    }, []);

    async function handleSearch() {
        const results = await api.books.getAll(search, categoryFilter);
        setBooks(results);
    }

    async function handleAdd(e) {
        e.preventDefault();
        setError("");
        try {
            const newBook = await api.books.create({
                title: form.title, isbn: form.isbn,
                authorId: Number(form.authorId), categoryId: Number(form.categoryId),
                totalCopies: Number(form.totalCopies)
            });
            setBooks([newBook, ...books]);
            setForm({ title: "", isbn: "", authorId: "", categoryId: "", totalCopies: 1 });
            setShowForm(false);
        } catch (err) { setError(err.message); }
    }

    async function handleDelete(id) {
        await api.books.delete(id);
        setBooks(books.filter(b => b.id !== id));
    }

    if (loading) return <p style={{ padding: 40 }}>Loading...</p>;

    return (
        <>
            <div className="page-header page-header-row">
                <div>
                    <h1 className="page-title">Books</h1>
                    <p className="page-subtitle">{books.length} titles in the catalog</p>
                </div>
                <Button variant="accent" onClick={() => setShowForm(s => !s)}>
                    {showForm ? "Cancel" : "Add book"}
                </Button>
            </div>

            {showForm && (
                <Card className="form-card">
                    <h2 className="section-title">New book</h2>
                    <form className="form-grid" onSubmit={handleAdd}>
                        <label className="form-field"><span>Title</span>
                            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                        </label>
                        <label className="form-field"><span>ISBN</span>
                            <input value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })} />
                        </label>
                        <label className="form-field"><span>Author</span>
                            <select value={form.authorId} onChange={e => setForm({ ...form, authorId: e.target.value })} required>
                                <option value="">Select author</option>
                                {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                        </label>
                        <label className="form-field"><span>Category</span>
                            <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} required>
                                <option value="">Select category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </label>
                        <label className="form-field"><span>Total copies</span>
                            <input type="number" min="1" value={form.totalCopies} onChange={e => setForm({ ...form, totalCopies: e.target.value })} />
                        </label>
                        <div className="form-actions">
                            {error && <p className="form-message form-message-danger">{error}</p>}
                            <Button type="submit" variant="primary">Save book</Button>
                        </div>
                    </form>
                </Card>
            )}

            <Card className="filter-bar">
                <input className="search-input" placeholder="Search by title or author..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSearch()} />
                <select className="filter-select" value={categoryFilter}
                    onChange={e => { setCategoryFilter(e.target.value); }}>
                    <option value="all">All categories</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <Button variant="outline" onClick={handleSearch}>Search</Button>
            </Card>

            <Card>
                {books.length === 0 ? (
                    <EmptyState title="No books found" message="Try a different search or add a new book." />
                ) : (
                    <table className="data-table">
                        <thead><tr><th>Title</th><th>Author</th><th>Category</th><th>Availability</th><th></th></tr></thead>
                        <tbody>
                            {books.map(b => (
                                <tr key={b.id}>
                                    <td className="cell-title">{b.title}</td>
                                    <td>{b.author?.name}</td>
                                    <td><Badge>{b.category?.name}</Badge></td>
                                    <td>
                                        {b.availableCopies === 0
                                            ? <Badge tone="danger">0 of {b.totalCopies} available</Badge>
                                            : <Badge tone="success">{b.availableCopies} of {b.totalCopies} available</Badge>}
                                    </td>
                                    <td className="cell-actions">
                                        <button className="link-action" onClick={() => handleDelete(b.id)}>Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </Card>
        </>
    );
}
