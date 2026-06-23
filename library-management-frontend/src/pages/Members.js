import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Button, EmptyState } from "../components/UI";
import { api } from "../services/api";

export default function Members() {
    const [members, setMembers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", phone: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api.members.getAll().then(setMembers).finally(() => setLoading(false));
    }, []);

    async function handleAdd(e) {
        e.preventDefault();
        setError("");
        try {
            const newMember = await api.members.create(form);
            setMembers([newMember, ...members]);
            setForm({ name: "", email: "", phone: "" });
            setShowForm(false);
        } catch (err) { setError(err.message); }
    }

    async function handleDelete(id) {
        await api.members.delete(id);
        setMembers(members.filter(m => m.id !== id));
    }

    if (loading) return <p style={{ padding: 40 }}>Loading...</p>;

    return (
        <>
            <div className="page-header page-header-row">
                <div>
                    <h1 className="page-title">Members</h1>
                    <p className="page-subtitle">{members.length} registered members</p>
                </div>
                <Button variant="accent" onClick={() => setShowForm(s => !s)}>
                    {showForm ? "Cancel" : "Add member"}
                </Button>
            </div>

            {showForm && (
                <Card className="form-card">
                    <h2 className="section-title">New member</h2>
                    <form className="form-grid" onSubmit={handleAdd}>
                        <label className="form-field"><span>Full name</span>
                            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                        </label>
                        <label className="form-field"><span>Email</span>
                            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                        </label>
                        <label className="form-field"><span>Phone</span>
                            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                        </label>
                        <div className="form-actions">
                            {error && <p className="form-message form-message-danger">{error}</p>}
                            <Button type="submit" variant="primary">Save member</Button>
                        </div>
                    </form>
                </Card>
            )}

            <Card>
                {members.length === 0 ? (
                    <EmptyState title="No members yet" message="Add a member to get started." />
                ) : (
                    <table className="data-table">
                        <thead><tr><th>Name</th><th>Email</th><th>Member since</th><th></th></tr></thead>
                        <tbody>
                            {members.map(m => (
                                <tr key={m.id}>
                                    <td className="cell-title">{m.name}</td>
                                    <td>{m.email}</td>
                                    <td>{m.membershipDate}</td>
                                    <td className="cell-actions">
                                        <Link className="link-action" to={`/members/${m.id}/history`}>History</Link>
                                        <button className="link-action link-action-danger" onClick={() => handleDelete(m.id)}>Remove</button>
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
