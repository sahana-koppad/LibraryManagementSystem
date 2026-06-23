package com.library.controller;

import com.library.model.Book;
import com.library.service.BookService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public List<Book> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId) {

        if (search != null && !search.isBlank()) return bookService.search(search);
        if (categoryId != null) return bookService.getByCategory(categoryId);
        return bookService.getAll();
    }

    @GetMapping("/{id}")
    public Book getById(@PathVariable Long id) {
        return bookService.getById(id);
    }

    @PostMapping
    public ResponseEntity<Book> create(@RequestBody Map<String, Object> body) {
        Book book = new Book();
        book.setTitle((String) body.get("title"));
        book.setIsbn((String) body.get("isbn"));
        book.setTotalCopies((Integer) body.get("totalCopies"));

        Long authorId = Long.valueOf(body.get("authorId").toString());
        Long categoryId = Long.valueOf(body.get("categoryId").toString());

        return new ResponseEntity<>(bookService.create(book, authorId, categoryId), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public Book update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Book book = new Book();
        book.setTitle((String) body.get("title"));
        book.setIsbn((String) body.get("isbn"));
        book.setTotalCopies((Integer) body.get("totalCopies"));

        Long authorId = body.get("authorId") != null ? Long.valueOf(body.get("authorId").toString()) : null;
        Long categoryId = body.get("categoryId") != null ? Long.valueOf(body.get("categoryId").toString()) : null;

        return bookService.update(id, book, authorId, categoryId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
