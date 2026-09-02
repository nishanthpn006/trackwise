package com.trackwise.repository;

import com.trackwise.entity.BillReminder;
import com.trackwise.entity.BillStatus;
import com.trackwise.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BillReminderRepository extends JpaRepository<BillReminder, UUID> {

    List<BillReminder> findByUserOrderByDueDateAsc(User user);

    List<BillReminder> findByUserAndStatusOrderByDueDateAsc(User user, BillStatus status);

    List<BillReminder> findByUserAndStatusNotOrderByDueDateAsc(User user, BillStatus status);

    Optional<BillReminder> findByIdAndUser(UUID id, User user);

    long countByUserAndStatus(User user, BillStatus status);

    List<BillReminder> findByUserAndDueDateBetweenOrderByDueDateAsc(User user, LocalDate start, LocalDate end);
}
