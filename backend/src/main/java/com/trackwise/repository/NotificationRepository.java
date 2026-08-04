package com.trackwise.repository;

import com.trackwise.entity.Notification;
import com.trackwise.entity.NotificationType;
import com.trackwise.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    List<Notification> findByUserAndIsReadOrderByCreatedAtDesc(User user, boolean isRead);

    long countByUserAndIsReadFalse(User user);

    List<Notification> findByUserAndTypeOrderByCreatedAtDesc(User user, NotificationType type);

    Optional<Notification> findByIdAndUser(UUID id, User user);

    boolean existsByUserAndTypeAndTitle(User user, NotificationType type, String title);

    void deleteAllByUser(User user);
}
