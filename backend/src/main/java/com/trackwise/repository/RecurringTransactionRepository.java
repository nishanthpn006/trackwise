package com.trackwise.repository;

import com.trackwise.entity.RecurringTransaction;
import com.trackwise.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RecurringTransactionRepository extends JpaRepository<RecurringTransaction, UUID> {

    List<RecurringTransaction> findByUserOrderByCreatedAtDesc(User user);

    List<RecurringTransaction> findByUserAndIsActiveTrueOrderByNextExecutionDateAsc(User user);

    List<RecurringTransaction> findByIsActiveTrueAndNextExecutionDateLessThanEqual(LocalDate date);

    Optional<RecurringTransaction> findByIdAndUser(UUID id, User user);
}
