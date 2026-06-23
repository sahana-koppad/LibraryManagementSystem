import React, { useState, useEffect } from "react";
import { Card, Badge, Button, EmptyState } from "../components/UI";
import { api } from "../services/api";

export default function BorrowReturn() {
    const [books, setBooks] = useState([]);
    const [members, setMembers] = useState([]);
    const [activeRecords, setActiveRecords] = useState([]);
    const [bookId, setBookId] = useState("");
    const [memberId, setMemberId] = useState("");
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    const today = new Date();

    useEffect(() => {
        Promise.all([api.books.getAll(), api.members.getAll(), api.borrow.getActive()])
            .then(([b, m, r]) => { setBooks(b); setMembers(m); setActiveRecords(r); })
            .finally(() => setLoading(false));
    }, []);

    async function handleIssue(e) {
        e.preventDefault();
        setMessage(null);
        try {
            const record = await api.borrow.issue(Number(bookId), Number(memberId));
            setActiveRecords([record, ...activeRecords]);
            // Refresh books to update available copies
            const updated = await api.books.getAll();
            setBooks(updated);
            setMessage({ tone: "success", text: `Book issued successfully. Due ${record.dueDate}.` });
            setBookId(""); setMemberId("");
        } catch (err) {
            setMessage({ tone: "danger", text: err.message });
        }
    }

    async function handleReturn(recordId) {
        try {
            const updated = await api.borrow.returnBook(recordId);
            setActiveRecords(activeRecords.filter(r => r.id !== recordId));
            if (updated.fineAmount > 0) {
                setMessage({ tone: "danger", text: `Book returned. Fine applied: ₹${updated.fineAmount}` });
            } else {
                setMessage({ tone: "success", text: "Book returned successfully." });
            }
            const updatedBooks = await api.books.getAll();
            setBooks(updatedBooks);
        } catch (err) {
            setMessage({ tone: "danger", text: err.message });
        }
    }

    if (loading) return <p style={{ padding: 40 }}>Loading...</p>;

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">Borrow &amp; return</h1>
                <p className="page-subtitle">Issue a book to a member, or process a return</p>
            </div>

            <Card className="form-card">
                <h2 className="section-title">Issue a book</h2>
                <form className="form-grid" onSubmit={handleIssue}>
                    <label className="form-field"><span>Book</span>
                        <select value={bookId} onChange={e => setBookId(e.target.value)} required>
                            <option value="">Select a book</option>
                            {books.map(b => (
                                <option key={b.id} value={b.id} disabled={b.availableCopies === 0}>
                                    {b.title} {b.availableCopies === 0 ? "(none available)" : `(${b.availableCopies} available)`}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="form-field"><span>Member</span>
                        <select value={memberId} onChange={e => setMemberId(e.target.value)} required>
                            <option value="">Select a member</option>
                            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    </label>
                    <div className="form-actions">
                        <Button type="submit" variant="primary">Issue book</Button>
                    </div>
                </form>
                {message && <p className={`form-message form-message-${message.tone}`}>{message.text}</p>}
            </Card>

            <Card>
                <h2 className="section-title">Currently borrowed</h2>
                {activeRecords.length === 0 ? (
                    <EmptyState title="Nothing on loan" message="All books are currently in the library." />
                ) : (
                    <table className="data-table">
                        <thead><tr><th>Book</th><th>Member</th><th>Due date</th><th>Status</th><th></th></tr></thead>
                        <tbody>
                            {activeRecords.map(r => {
                                const overdue = new Date(r.dueDate) < today;
                                return (
                                    <tr key={r.id}>
                                        <td className="cell-title">{r.book?.title}</td>
                                        <td>{r.member?.name}</td>
                                        <td>{r.dueDate}</td>
                                        <td>{overdue ? <Badge tone="danger">Overdue</Badge> : <Badge tone="amber">On loan</Badge>}</td>
                                        <td className="cell-actions">
                                            <button className="link-action" onClick={() => handleReturn(r.id)}>Mark returned</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </Card>
        </>
    );
}
