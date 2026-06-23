package com.library.controller;

import com.library.exception.ResourceNotFoundException;
import com.library.model.Author;
import com.library.repository.AuthorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/authors")
public class AuthorController {

    private final AuthorRepository authorRepository;

    public AuthorController(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    @GetMapping
    public List<Author> getAll() { return authorRepository.findAll(); }

    @GetMapping("/{id}")
    public Author getById(@PathVariable Long id) {
        return authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found: " + id));
    }

    @PostMapping
    public ResponseEntity<Author> create(@RequestBody Author author) {
        return new ResponseEntity<>(authorRepository.save(author), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public Author update(@PathVariable Long id, @RequestBody Author updated) {
        Author existing = authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found: " + id));
        existing.setName(updated.getName());
        existing.setBio(updated.getBio());
        return authorRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        authorRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
