package com.trackwise.repository;

import com.trackwise.entity.Account;
import com.trackwise.entity.AccountType;
import com.trackwise.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountRepository extends JpaRepository<Account, UUID> {

    List<Account> findByUserAndIsArchivedFalseOrderByCreatedAtDesc(User user);

    List<Account> findByUserOrderByCreatedAtDesc(User user);

    Optional<Account> findByIdAndUser(UUID id, User user);

    boolean existsByNameAndUserAndIdNot(String name, User user, UUID id);

    boolean existsByNameAndUser(String name, User user);

    List<Account> findByUserAndTypeAndIsArchivedFalse(User user, AccountType type);
}
