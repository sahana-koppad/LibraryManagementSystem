import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Badge, EmptyState } from "../components/UI";
import { api } from "../services/api";

export default function MemberHistory() {
    const { id } = useParams();
    const [member, setMember] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const today = new Date();

    useEffect(() => {
        Promise.all([
            api.members.getAll().then(ms => ms.find(m => m.id === Number(id))),
            api.borrow.getMemberHistory(id)
        ]).then(([m, h]) => {
            setMember(m);
            setHistory(h.sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate)));
        }).finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p style={{ padding: 40 }}>Loading...</p>;
    if (!member) return <Card><EmptyState title="Member not found" message="This member may have been removed." /></Card>;

    const totalFines = history.reduce((s, r) => s + (r.fineAmount || 0), 0);

    return (
        <>
            <div className="page-header">
                <Link to="/members" className="back-link">&larr; Back to members</Link>
                <h1 className="page-title">{member.name}</h1>
                <p className="page-subtitle">{member.email} &middot; Member since {member.membershipDate}</p>
            </div>

            {totalFines > 0 && (
                <Card className="fine-summary">
                    <p>Total fines on record: <strong>₹{totalFines}</strong></p>
                </Card>
            )}

            <Card>
                <h2 className="section-title">Borrowing history</h2>
                {history.length === 0 ? (
                    <EmptyState title="No borrowing history" message="This member hasn't borrowed any books yet." />
                ) : (
                    <table className="data-table">
                        <thead><tr><th>Book</th><th>Borrowed</th><th>Due</th><th>Returned</th><th>Status</th><th>Fine</th></tr></thead>
                        <tbody>
                            {history.map(r => {
                                const overdue = !r.returnDate && new Date(r.dueDate) < today;
                                return (
                                    <tr key={r.id}>
                                        <td className="cell-title">{r.book?.title}</td>
                                        <td>{r.borrowDate}</td>
                                        <td>{r.dueDate}</td>
                                        <td>{r.returnDate || "—"}</td>
                                        <td>
                                            {r.returnDate ? <Badge tone="success">Returned</Badge>
                                                : overdue ? <Badge tone="danger">Overdue</Badge>
                                                : <Badge tone="amber">Borrowed</Badge>}
                                        </td>
                                        <td>{r.fineAmount > 0 ? `₹${r.fineAmount}` : "—"}</td>
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
