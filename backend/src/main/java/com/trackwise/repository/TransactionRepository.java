package com.trackwise.repository;

import com.trackwise.entity.Category;
import com.trackwise.entity.Transaction;
import com.trackwise.entity.TransactionType;
import com.trackwise.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * TransactionRepository — Spring Data JPA repository with JpaSpecificationExecutor for dynamic queries.
 */
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID>, JpaSpecificationExecutor<Transaction> {

    Optional<Transaction> findByIdAndUser(UUID id, User user);

    Page<Transaction> findByUser(User user, Pageable pageable);

    List<Transaction> findByUserAndCategory(User user, Category category);

    List<Transaction> findByUserAndType(User user, TransactionType type);

    List<Transaction> findTop5ByUserOrderByDateDescCreatedAtDesc(User user);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.type = :type")
    BigDecimal sumAmountByUserAndType(@Param("user") User user, @Param("type") TransactionType type);

    long countByCategory(Category category);

    // ─── Analytics queries ────────────────────────────────────────────────────

    /**
     * Sum of transaction amounts for a given user, type, and date range.
     * Used for monthly income/expense aggregation.
     */
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.user = :user AND t.type = :type AND t.date BETWEEN :start AND :end")
    BigDecimal sumAmountByUserAndTypeAndDateBetween(
            @Param("user") User user,
            @Param("type") TransactionType type,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );

    /**
     * Returns all expense transactions within the given date range.
     * Used for category breakdown and daily spending trend.
     */
    List<Transaction> findByUserAndDateBetween(
            User user, LocalDate start, LocalDate end
    );

    List<Transaction> findByUserAndTypeAndDateBetween(
            User user, TransactionType type, LocalDate start, LocalDate end
    );

    /**
     * Total number of transactions owned by the given user.
     * Used for the Financial Insights card.
     */
    long countByUser(User user);

    /**
     * Total number of transactions owned by the user within a date range.
     * Used for the Transactions This Month KPI.
     */
    long countByUserAndDateBetween(User user, LocalDate start, LocalDate end);
}

