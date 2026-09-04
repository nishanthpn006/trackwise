package com.trackwise.service;

import com.trackwise.dto.AccountRequest;
import com.trackwise.dto.AccountResponse;
import com.trackwise.entity.Account;
import com.trackwise.entity.Transaction;
import com.trackwise.entity.TransactionType;
import com.trackwise.entity.User;
import com.trackwise.exception.ResourceNotFoundException;
import com.trackwise.repository.AccountRepository;
import com.trackwise.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class AccountService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public AccountService(AccountRepository accountRepository, TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public List<AccountResponse> getAccounts(User user, boolean includeArchived) {
        seedDefaultAccounts(user);

        List<Account> accounts = includeArchived
                ? accountRepository.findByUserOrderByCreatedAtDesc(user)
                : accountRepository.findByUserAndIsArchivedFalseOrderByCreatedAtDesc(user);

        return accounts.stream()
                .map(acc -> {
                    BigDecimal computedBalance = calculateCurrentBalance(acc, user);
                    acc.setCurrentBalance(computedBalance);
                    long txCount = transactionRepository.countByAccount(acc);
                    return AccountResponse.fromEntity(acc, txCount);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AccountResponse getAccountById(UUID id, User user) {
        Account account = accountRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));

        BigDecimal computedBalance = calculateCurrentBalance(account, user);
        account.setCurrentBalance(computedBalance);
        long txCount = transactionRepository.countByAccount(account);
        return AccountResponse.fromEntity(account, txCount);
    }

    @Transactional
    public AccountResponse createAccount(AccountRequest request, User user) {
        String name = request.getName().trim();
        if (accountRepository.existsByNameIgnoreCaseAndUser(name, user)) {
            throw new IllegalArgumentException("Account with name '" + name + "' already exists");
        }

        BigDecimal initial = request.getInitialBalance() != null ? request.getInitialBalance() : BigDecimal.ZERO;
        Account account = new Account(
                name,
                request.getType(),
                initial,
                request.getCurrency() != null ? request.getCurrency() : "INR",
                request.getColor() != null ? request.getColor() : "#3B82F6",
                request.getIcon() != null ? request.getIcon() : "wallet",
                request.getDescription(),
                user
        );

        Account saved = accountRepository.save(account);
        return AccountResponse.fromEntity(saved, 0L);
    }

    @Transactional
    public AccountResponse updateAccount(UUID id, AccountRequest request, User user) {
        Account account = accountRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));

        String name = request.getName().trim();
        if (accountRepository.existsByNameIgnoreCaseAndUserAndIdNot(name, user, id)) {
            throw new IllegalArgumentException("Account with name '" + name + "' already exists");
        }

        account.setName(name);
        account.setType(request.getType());
        if (request.getInitialBalance() != null) {
            account.setInitialBalance(request.getInitialBalance());
        }
        if (request.getCurrency() != null) account.setCurrency(request.getCurrency());
        if (request.getColor() != null) account.setColor(request.getColor());
        if (request.getIcon() != null) account.setIcon(request.getIcon());
        account.setDescription(request.getDescription());

        BigDecimal computed = calculateCurrentBalance(account, user);
        account.setCurrentBalance(computed);
        Account updated = accountRepository.save(account);
        long txCount = transactionRepository.countByAccount(updated);
        return AccountResponse.fromEntity(updated, txCount);
    }

    @Transactional
    public AccountResponse toggleArchive(UUID id, User user) {
        Account account = accountRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));

        account.setArchived(!account.isArchived());
        Account saved = accountRepository.save(account);
        BigDecimal computed = calculateCurrentBalance(saved, user);
        saved.setCurrentBalance(computed);
        long txCount = transactionRepository.countByAccount(saved);
        return AccountResponse.fromEntity(saved, txCount);
    }

    @Transactional
    @SuppressWarnings("null")
    public void deleteAccount(UUID id, User user) {
        Account account = accountRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));

        long txCount = transactionRepository.countByAccount(account);
        if (txCount > 0) {
            throw new IllegalArgumentException("Cannot delete account associated with " + txCount + " transactions. Reassign or delete transactions first, or archive the account.");
        }
        accountRepository.delete(account);
    }

    @Transactional
    public void seedDefaultAccounts(User user) {
        List<Account> existing = accountRepository.findByUserOrderByCreatedAtDesc(user);
        if (existing.isEmpty()) {
            Account cash = new Account(
                    "Cash",
                    com.trackwise.entity.AccountType.CASH,
                    BigDecimal.ZERO,
                    "INR",
                    "#10B981",
                    "banknote",
                    "Physical cash on hand",
                    user
            );
            Account bank = new Account(
                    "Main Bank Account",
                    com.trackwise.entity.AccountType.BANK,
                    BigDecimal.ZERO,
                    "INR",
                    "#3B82F6",
                    "landmark",
                    "Primary checking / savings bank account",
                    user
            );
            accountRepository.save(cash);
            accountRepository.save(bank);
        }
    }

    /**
     * Computes the balance dynamically from initial balance + income - expenses linked to this account.
     */
    @SuppressWarnings("null")
    public BigDecimal calculateCurrentBalance(Account account, User user) {
        BigDecimal initial = account.getInitialBalance() != null ? account.getInitialBalance() : BigDecimal.ZERO;
        List<Transaction> txs = transactionRepository.findByUserAndAccountOrderByDateDesc(user, account);

        BigDecimal income = txs.stream()
                .filter(t -> t.getType() == TransactionType.INCOME)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal expense = txs.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return initial.add(income).subtract(expense);
    }
}
