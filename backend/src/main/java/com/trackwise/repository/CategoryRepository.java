package com.trackwise.repository;

import com.trackwise.entity.Category;
import com.trackwise.entity.TransactionType;
import com.trackwise.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * CategoryRepository — Spring Data JPA repository for Category entity.
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {

    List<Category> findByUser(User user);

    List<Category> findByUserAndType(User user, TransactionType type);

    Optional<Category> findByIdAndUser(UUID id, User user);

    boolean existsByUserAndName(User user, String name);

    boolean existsByUserAndNameIgnoreCase(User user, String name);

    boolean existsByUserAndNameAndIdNot(User user, String name, UUID id);

    boolean existsByUserAndNameIgnoreCaseAndIdNot(User user, String name, UUID id);
}
