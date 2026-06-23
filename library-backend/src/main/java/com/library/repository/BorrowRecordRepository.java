package com.library.repository;

import com.library.model.BorrowRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {

    List<BorrowRecord> findByMemberId(Long memberId);

    List<BorrowRecord> findByReturnDateIsNull(); // all currently borrowed

    long countByMemberIdAndReturnDateIsNull(Long memberId); // active loans for a member
}
