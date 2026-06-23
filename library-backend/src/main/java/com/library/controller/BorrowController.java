package com.library.controller;

import com.library.dto.BorrowRequest;
import com.library.model.BorrowRecord;
import com.library.service.BorrowService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrow")
public class BorrowController {

    private final BorrowService borrowService;

    public BorrowController(BorrowService borrowService) {
        this.borrowService = borrowService;
    }

    // Issue a book
    @PostMapping
    public ResponseEntity<BorrowRecord> issue(@RequestBody BorrowRequest request) {
        return new ResponseEntity<>(
                borrowService.issueBook(request.bookId, request.memberId),
                HttpStatus.CREATED
        );
    }

    // Return a book
    @PutMapping("/{id}/return")
    public BorrowRecord returnBook(@PathVariable Long id) {
        return borrowService.returnBook(id);
    }

    // All active loans (returnDate is null)
    @GetMapping("/active")
    public List<BorrowRecord> getActive() {
        return borrowService.getAllActive();
    }

    // Full history for one member
    @GetMapping("/member/{memberId}")
    public List<BorrowRecord> getMemberHistory(@PathVariable Long memberId) {
        return borrowService.getMemberHistory(memberId);
    }

    // Dashboard stats - all records
    @GetMapping
    public List<BorrowRecord> getAll() {
        return borrowService.getAll();
    }
}
