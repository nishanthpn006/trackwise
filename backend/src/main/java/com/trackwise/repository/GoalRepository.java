package com.trackwise.repository;

import com.trackwise.entity.Goal;
import com.trackwise.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GoalRepository extends JpaRepository<Goal, UUID> {
    List<Goal> findByUserOrderByTargetDateAsc(User user);
    Optional<Goal> findByIdAndUser(UUID id, User user);
    long countByUser(User user);
}
