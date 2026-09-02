package com.trackwise.repository;

import com.trackwise.entity.Subscription;
import com.trackwise.entity.SubscriptionStatus;
import com.trackwise.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {

    List<Subscription> findByUserOrderByNextBillingDateAsc(User user);

    List<Subscription> findByUserAndStatusOrderByNextBillingDateAsc(User user, SubscriptionStatus status);

    Optional<Subscription> findByIdAndUser(UUID id, User user);
}
