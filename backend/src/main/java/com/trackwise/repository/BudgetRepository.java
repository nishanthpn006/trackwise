package com.trackwise.repository;

import com.trackwise.entity.Budget;
import com.trackwise.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * BudgetRepository — Data access for Budget entities, always scoped to a User.
 */
@Repository
public interface BudgetRepository extends JpaRepository<Budget, UUID> {

    /**
     * Returns all budgets for a user, most recently created first.
     */
    List<Budget> findAllByUserOrderByCreatedAtDesc(User user);

    /**
     * Owner-scoped single budget lookup.
     */
    Optional<Budget> findByIdAndUser(UUID id, User user);

    /**
     * Checks for duplicate budget name within the same user, used on create.
     */
    boolean existsByNameAndUser(String name, User user);

    /**
     * Checks for duplicate name excluding the current record (for update).
     */
    @Query("SELECT COUNT(b) > 0 FROM Budget b WHERE b.name = :name AND b.user = :user AND b.id <> :id")
    boolean existsByNameAndUserAndIdNot(@Param("name") String name,
                                        @Param("user") User user,
                                        @Param("id") UUID id);
}
