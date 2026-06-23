import React, { useState, useEffect } from "react";
import { Card, StatCard, Badge } from "../components/UI";
import { api } from "../services/api";

export default function Dashboard() {
    const [books, setBooks] = useState([]);
    const [members, setMembers] = useState([]);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([api.books.getAll(), api.members.getAll(), api.borrow.getAll()])
            .then(([b, m, r]) => { setBooks(b); setMembers(m); setRecords(r); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const today = new Date();
    const totalCopies = books.reduce((s, b) => s + b.totalCopies, 0);
    const borrowed = records.filter(r => !r.returnDate).length;
    const overdue = records.filter(r => !r.returnDate && new Date(r.dueDate) < today).length;
    const recent = [...records].sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate)).slice(0, 8);

    if (loading) return <p style={{ padding: 40 }}>Loading...</p>;

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-subtitle">Overview of the library's current state</p>
            </div>
            <div className="stat-grid">
                <StatCard label="Total books" value={totalCopies} />
                <StatCard label="Registered members" value={members.length} />
                <StatCard label="Currently borrowed" value={borrowed} tone="amber" />
                <StatCard label="Overdue" value={overdue} tone="danger" />
            </div>
            <Card>
                <h2 className="section-title">Recent activity</h2>
                <table className="data-table">
                    <thead><tr><th>Book</th><th>Member</th><th>Borrowed</th><th>Due</th><th>Status</th></tr></thead>
                    <tbody>
                        {recent.map(r => {
                            const overdue = !r.returnDate && new Date(r.dueDate) < today;
                            return (
                                <tr key={r.id}>
                                    <td>{r.book?.title}</td>
                                    <td>{r.member?.name}</td>
                                    <td>{r.borrowDate}</td>
                                    <td>{r.dueDate}</td>
                                    <td>
                                        {r.returnDate ? <Badge tone="success">Returned</Badge>
                                            : overdue ? <Badge tone="danger">Overdue</Badge>
                                            : <Badge tone="amber">Borrowed</Badge>}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </Card>
        </>
    );
}
