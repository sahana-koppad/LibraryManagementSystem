This project started as a way to understand how a complete Java application is structured beyond CRUD operations. Instead of only managing books, I wanted to implement the entire borrowing workflow with authentication, business rules, and inventory management similar to a real library.


# Library Management System

A full-stack web application developed to simulate the day-to-day workflow of a library. The project focuses on more than basic CRUD operations by implementing authentication, borrowing rules, inventory tracking, and fine calculation.

The goal was to gain hands-on experience building a complete Java application using Spring Boot for the backend and React for the frontend while following a layered architecture.

---
## Why I Built This

Most beginner projects stop at creating and deleting records. I wanted to build something that required real business logic.
Some of the problems this project solves are:
- Managing books and their availability
- Tracking registered library members
- Preventing books from being borrowed when copies are unavailable
- Limiting the number of active borrowings per member
- Automatically calculating overdue fines
- Securing APIs using JWT authentication

## What the Application Can Do
Register and authenticate users
Manage books, authors and categories
Register library members
Borrow books with validation
Return books and update inventory
Calculate overdue fines automatically
Search books using title or category

## Technologies Used
## Backend
• Java 21
• Spring Boot
• Spring Security
• Spring Data JPA
• Hibernate
## Frontend
• React.js
• Axios
• React Router
## Database
• MySQL
## Development Tools
• IntelliJ IDEA
• Postman
• Git & GitHub

## Challenges I Faced
While developing this project I encountered several practical issues:

- Designing relationships between Books, Authors and Categories.

- Managing JWT authentication between React and Spring Boot.

- Updating book availability automatically after borrow and return.

- Handling CORS between frontend and backend.

- Preventing invalid borrowing requests through backend validation.

 ## What I Learned
Working on this project improved my understanding of:

- Spring Boot project structure

- REST API development

- Entity relationships using JPA

- Authentication using JWT

- React state management

- Connecting React with Spring Boot APIs

- Git version control and project organization

  ## Future Improvements
- Admin and Librarian roles

- Book reservation system

- Email reminders for overdue books

- Dashboard with borrowing statistics

- QR code or barcode support

- Export reports as PDF

## About This Project
This project was built as part of my journey to become a Java Backend Developer. It combines concepts from Spring Boot, React, MySQL and REST API development into a single application that follows real-world workflows instead of isolated CRUD examples.
I'm continuously improving the project by adding new features and refining the codebase.
