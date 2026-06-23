package com.library.service;

import com.library.exception.ResourceNotFoundException;
import com.library.model.Author;
import com.library.model.Book;
import com.library.model.Category;
import com.library.repository.AuthorRepository;
import com.library.repository.BookRepository;
import com.library.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;

    public BookService(BookRepository bookRepository,
                       AuthorRepository authorRepository,
                       CategoryRepository categoryRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Book> getAll() {
        return bookRepository.findAll();
    }

    public Book getById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
    }

    public List<Book> search(String query) {
        return bookRepository.search(query);
    }

    public List<Book> getByCategory(Long categoryId) {
        return bookRepository.findByCategoryId(categoryId);
    }

    public Book create(Book book, Long authorId, Long categoryId) {
        Author author = authorRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found: " + authorId));
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + categoryId));
        book.setAuthor(author);
        book.setCategory(category);
        return bookRepository.save(book);
    }

    public Book update(Long id, Book updated, Long authorId, Long categoryId) {
        Book existing = getById(id);
        existing.setTitle(updated.getTitle());
        existing.setIsbn(updated.getIsbn());
        existing.setTotalCopies(updated.getTotalCopies());

        if (authorId != null) {
            Author author = authorRepository.findById(authorId)
                    .orElseThrow(() -> new ResourceNotFoundException("Author not found: " + authorId));
            existing.setAuthor(author);
        }
        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + categoryId));
            existing.setCategory(category);
        }
        return bookRepository.save(existing);
    }

    public void delete(Long id) {
        bookRepository.delete(getById(id));
    }
}
