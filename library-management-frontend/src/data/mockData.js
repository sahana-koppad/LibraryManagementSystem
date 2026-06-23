// Mock data shaped to match the future Spring Boot API responses exactly.
// When the real backend is ready, these arrays get replaced by fetch() calls
// to endpoints like GET /api/books, GET /api/members, etc. - same shape, real data.

export const authors = [
  { id: 1, name: "R.K. Narayan", bio: "Indian author known for fiction set in the fictional town of Malgudi." },
  { id: 2, name: "Robert C. Martin", bio: "Software engineer, author of Clean Code." },
  { id: 3, name: "Chimamanda Ngozi Adichie", bio: "Nigerian author of novels and essays." },
  { id: 4, name: "Andrew Hunt & David Thomas", bio: "Authors of The Pragmatic Programmer." },
  { id: 5, name: "Arundhati Roy", bio: "Indian author, Booker Prize winner." },
];

export const categories = [
  { id: 1, name: "Fiction" },
  { id: 2, name: "Technology" },
  { id: 3, name: "Biography" },
  { id: 4, name: "Science" },
];

export const books = [
  { id: 1, title: "Swami and Friends", isbn: "9780226568476", authorId: 1, categoryId: 1, totalCopies: 4, availableCopies: 2 },
  { id: 2, title: "Clean Code", isbn: "9780132350884", authorId: 2, categoryId: 2, totalCopies: 3, availableCopies: 0 },
  { id: 3, title: "Half of a Yellow Sun", isbn: "9780007200283", authorId: 3, categoryId: 1, totalCopies: 5, availableCopies: 5 },
  { id: 4, title: "The Pragmatic Programmer", isbn: "9780135957059", authorId: 4, categoryId: 2, totalCopies: 2, availableCopies: 1 },
  { id: 5, title: "The God of Small Things", isbn: "9780812979657", authorId: 5, categoryId: 1, totalCopies: 3, availableCopies: 3 },
  { id: 6, title: "Malgudi Days", isbn: "9780143039655", authorId: 1, categoryId: 1, totalCopies: 4, availableCopies: 1 },
];

export const members = [
  { id: 1, name: "Sahana Koppad", email: "sahana@example.com", phone: "9876543210", membershipDate: "2025-01-15" },
  { id: 2, name: "Arjun Mehta", email: "arjun@example.com", phone: "9876543211", membershipDate: "2025-03-22" },
  { id: 3, name: "Priya Sharma", email: "priya@example.com", phone: "9876543212", membershipDate: "2025-06-10" },
  { id: 4, name: "Kiran Patel", email: "kiran@example.com", phone: "9876543213", membershipDate: "2025-08-05" },
];

// borrowDate / dueDate stored as ISO date strings, returnDate null = still borrowed
export const borrowRecords = [
  { id: 1, bookId: 2, memberId: 1, borrowDate: "2026-06-01", dueDate: "2026-06-15", returnDate: null, fineAmount: 0 },
  { id: 2, bookId: 6, memberId: 2, borrowDate: "2026-05-20", dueDate: "2026-06-03", returnDate: null, fineAmount: 0 },
  { id: 3, bookId: 1, memberId: 3, borrowDate: "2026-06-10", dueDate: "2026-06-24", returnDate: null, fineAmount: 0 },
  { id: 4, bookId: 4, memberId: 1, borrowDate: "2026-05-01", dueDate: "2026-05-15", returnDate: "2026-05-14", fineAmount: 0 },
  { id: 5, bookId: 1, memberId: 4, borrowDate: "2026-04-10", dueDate: "2026-04-24", returnDate: "2026-04-30", fineAmount: 30 },
];

// Helper lookups, mirroring what @ManyToOne relationships would give you
// automatically once this is wired to the real JPA backend.
export const getAuthorById = (id) => authors.find((a) => a.id === id);
export const getCategoryById = (id) => categories.find((c) => c.id === id);
export const getBookById = (id) => books.find((b) => b.id === id);
export const getMemberById = (id) => members.find((m) => m.id === id);

export const FINE_PER_DAY = 5; // rupees per day overdue
