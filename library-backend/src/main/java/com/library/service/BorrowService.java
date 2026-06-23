package com.library.service;

import com.library.exception.BusinessException;
import com.library.exception.ResourceNotFoundException;
import com.library.model.Book;
import com.library.model.BorrowRecord;
import com.library.model.Member;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRecordRepository;
import com.library.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BorrowService {

    private static final int MAX_BOOKS_PER_MEMBER = 3;
    private static final double FINE_PER_DAY = 5.0; // ₹5 per day

    private final BorrowRecordRepository borrowRepository;
    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;

    public BorrowService(BorrowRecordRepository borrowRepository,
                         BookRepository bookRepository,
                         MemberRepository memberRepository) {
        this.borrowRepository = borrowRepository;
        this.bookRepository = bookRepository;
        this.memberRepository = memberRepository;
    }

    public BorrowRecord issueBook(Long bookId, Long memberId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found: " + bookId));
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found: " + memberId));

        // Business rule 1: book must have available copies
        if (book.getAvailableCopies() <= 0) {
            throw new BusinessException("No copies of '" + book.getTitle() + "' are currently available.");
        }

        // Business rule 2: member cannot exceed borrow limit
        long activeLoans = borrowRepository.countByMemberIdAndReturnDateIsNull(memberId);
        if (activeLoans >= MAX_BOOKS_PER_MEMBER) {
            throw new BusinessException(member.getName() + " already has " + MAX_BOOKS_PER_MEMBER +
                    " books borrowed. Please return one before borrowing another.");
        }

        // Decrement available copies
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        // Create borrow record
        BorrowRecord record = new BorrowRecord();
        record.setBook(book);
        record.setMember(member);
        // borrowDate and dueDate set by @PrePersist on entity
        return borrowRepository.save(record);
    }

    public BorrowRecord returnBook(Long recordId) {
        BorrowRecord record = borrowRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Borrow record not found: " + recordId));

        if (record.getReturnDate() != null) {
            throw new BusinessException("This book has already been returned.");
        }

        // Calculate fine if overdue
        LocalDate today = LocalDate.now();
        if (today.isAfter(record.getDueDate())) {
            long daysLate = ChronoUnit.DAYS.between(record.getDueDate(), today);
            record.setFineAmount(daysLate * FINE_PER_DAY);
        }

        record.setReturnDate(today);
        borrowRepository.save(record);

        // Increment available copies
        Book book = record.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        return record;
    }

    public List<BorrowRecord> getAllActive() {
        return borrowRepository.findByReturnDateIsNull();
    }

    public List<BorrowRecord> getMemberHistory(Long memberId) {
        return borrowRepository.findByMemberId(memberId);
    }

    public List<BorrowRecord> getAll() {
        return borrowRepository.findAll();
    }
}
