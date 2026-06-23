# Library Management System — Frontend

A React-based admin dashboard for managing a library's books, members, and borrow/return workflow. Built with mock data first, designed to wire directly into a Spring Boot REST API later with no UI changes.

## What this demonstrates

- Multi-page React app with client-side routing (`react-router-dom`)
- Realistic data modeling with relationships (Book → Author, Book → Category, BorrowRecord → Book + Member) — mirrors the entity design of the planned Spring Boot backend
- Real business logic implemented in the UI layer: borrow limits, availability checks, overdue detection, fine calculation
- Component-based architecture (reusable Card, Badge, Button, StatCard components)
- A deliberate, non-templated visual design — not a default Bootstrap/Material look

## Pages

| Page | Route | Description |
|---|---|---|
| Dashboard | `/` | Summary stats and recent activity |
| Books | `/books` | Catalog with search, category filter, add/remove |
| Members | `/members` | Member list, add/remove, link to history |
| Borrow / Return | `/borrow-return` | Issue books (with business rules), mark returns |
| Member History | `/members/:id/history` | Per-member borrowing history and fines |

## Business rules implemented

- A book can only be issued if `availableCopies > 0`
- A member cannot have more than 3 books borrowed at once
- Returning a book after its due date calculates a fine (₹5/day late)
- Available copy counts update live as books are issued/returned

## Tech stack

- React 18
- React Router v6
- Plain CSS with design tokens (no UI framework — intentional, see `src/styles/tokens.css`)

## Setup & run

```bash
npm install
npm start
```

Opens at `http://localhost:3000`.

## Data

All data currently lives in `src/data/mockData.js` — structured to exactly match the shape the future Spring Boot backend will return. Swapping mock data for a live API later means replacing the imports in each page with `fetch()` calls; the component logic and JSX stay the same.

## Planned next step

Wiring this UI to a real Spring Boot + JPA + MySQL backend (Book, Author, Category, Member, BorrowRecord entities with proper relationships), replacing the mock data layer with live API calls.
