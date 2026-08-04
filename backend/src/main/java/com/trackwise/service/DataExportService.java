package com.trackwise.service;

import com.trackwise.dto.ImportResultResponse;
import com.trackwise.entity.Category;
import com.trackwise.entity.Transaction;
import com.trackwise.entity.TransactionType;
import com.trackwise.entity.User;
import com.trackwise.repository.CategoryRepository;
import com.trackwise.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * DataExportService — Generates comprehensive CSV exports of all user financial data
 * and handles CSV import of transactions with validation.
 */
@Service
public class DataExportService {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;

    public DataExportService(TransactionRepository transactionRepository,
                             CategoryRepository categoryRepository) {
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
    }

    /**
     * Exports all transactions for the user as a CSV byte array.
     */
    @Transactional(readOnly = true)
    public byte[] exportTransactionsCsv(User user) {
        List<Transaction> transactions = transactionRepository.findByUserOrderByDateDesc(user);
        StringBuilder csv = new StringBuilder();

        // Header
        csv.append("Date,Title,Type,Amount,Category,Description\n");

        for (Transaction t : transactions) {
            csv.append(escapeCsv(t.getDate() != null ? t.getDate().format(DATE_FMT) : ""))
               .append(",")
               .append(escapeCsv(t.getTitle()))
               .append(",")
               .append(escapeCsv(t.getType() != null ? t.getType().name() : ""))
               .append(",")
               .append(t.getAmount() != null ? t.getAmount().toPlainString() : "0.00")
               .append(",")
               .append(escapeCsv(t.getCategory() != null ? t.getCategory().getName() : ""))
               .append(",")
               .append(escapeCsv(t.getDescription() != null ? t.getDescription() : ""))
               .append("\n");
        }

        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    /**
     * Exports all transactions for the user in a comprehensive multi-section full-backup CSV.
     */
    @Transactional(readOnly = true)
    public byte[] exportFullBackupCsv(User user, List<Object> budgets, List<Object> goals) {
        List<Transaction> transactions = transactionRepository.findByUserOrderByDateDesc(user);
        List<Category> categories = categoryRepository.findByUser(user);

        StringBuilder csv = new StringBuilder();

        // ── Header banner
        csv.append("# TrackWise Full Data Backup\n");
        csv.append("# User: ").append(escapeCsv(user.getFullName())).append("\n");
        csv.append("# Email: ").append(escapeCsv(user.getEmail())).append("\n");
        csv.append("# Exported: ").append(LocalDate.now().format(DATE_FMT)).append("\n");
        csv.append("#\n");

        // ── Transactions section
        csv.append("\n## TRANSACTIONS\n");
        csv.append("Date,Title,Type,Amount,Category,Description\n");
        for (Transaction t : transactions) {
            csv.append(escapeCsv(t.getDate() != null ? t.getDate().format(DATE_FMT) : ""))
               .append(",")
               .append(escapeCsv(t.getTitle()))
               .append(",")
               .append(escapeCsv(t.getType() != null ? t.getType().name() : ""))
               .append(",")
               .append(t.getAmount() != null ? t.getAmount().toPlainString() : "0.00")
               .append(",")
               .append(escapeCsv(t.getCategory() != null ? t.getCategory().getName() : ""))
               .append(",")
               .append(escapeCsv(t.getDescription() != null ? t.getDescription() : ""))
               .append("\n");
        }

        // ── Categories section
        csv.append("\n## CATEGORIES\n");
        csv.append("Name,Type,Icon,Color\n");
        for (Category c : categories) {
            csv.append(escapeCsv(c.getName()))
               .append(",")
               .append(escapeCsv(c.getType() != null ? c.getType().name() : ""))
               .append(",")
               .append(escapeCsv(c.getIcon() != null ? c.getIcon() : ""))
               .append(",")
               .append(escapeCsv(c.getColor() != null ? c.getColor() : ""))
               .append("\n");
        }

        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    /**
     * Imports transactions from a CSV file uploaded by the user.
     * Expected columns: Date, Title, Type, Amount, Category (optional), Description (optional)
     */
    @Transactional
    public ImportResultResponse importTransactionsCsv(MultipartFile file, User user) throws IOException {
        List<String> errors = new ArrayList<>();
        int totalRows = 0;
        int importedCount = 0;
        int skippedCount = 0;
        int errorCount = 0;

        // Pre-load user categories into a lookup map (case-insensitive)
        List<Category> userCategories = categoryRepository.findByUser(user);
        Map<String, Category> categoryMap = userCategories.stream()
                .collect(Collectors.toMap(c -> c.getName().toLowerCase(), c -> c, (a, b) -> a));

        List<Transaction> toSave = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            String line;
            int lineNumber = 0;
            boolean headerFound = false;
            int[] colIndexes = new int[]{-1, -1, -1, -1, -1, -1}; // date, title, type, amount, category, description

            while ((line = reader.readLine()) != null) {
                lineNumber++;

                // Skip comment lines and empty lines
                if (line.startsWith("#") || line.isBlank()) continue;

                // Skip section marker lines
                if (line.startsWith("##")) continue;

                String[] cols = parseCsvLine(line);

                // Detect header row
                if (!headerFound) {
                    for (int i = 0; i < cols.length; i++) {
                        String colName = cols[i].trim().toLowerCase().replace("\"", "");
                        switch (colName) {
                            case "date" -> colIndexes[0] = i;
                            case "title", "name", "description (title)" -> colIndexes[1] = i;
                            case "type" -> colIndexes[2] = i;
                            case "amount" -> colIndexes[3] = i;
                            case "category" -> colIndexes[4] = i;
                            case "description", "notes", "memo" -> colIndexes[5] = i;
                            default -> { /* ignore unknown columns */ }
                        }
                    }
                    if (colIndexes[0] >= 0 && colIndexes[1] >= 0 && colIndexes[3] >= 0) {
                        headerFound = true;
                    }
                    continue;
                }

                // Data rows
                totalRows++;

                try {
                    if (cols.length < 3) {
                        errors.add("Row " + lineNumber + ": too few columns, skipped.");
                        skippedCount++;
                        continue;
                    }

                    String rawDate = colIndexes[0] >= 0 && colIndexes[0] < cols.length ? cols[colIndexes[0]].trim() : "";
                    String rawTitle = colIndexes[1] >= 0 && colIndexes[1] < cols.length ? cols[colIndexes[1]].trim() : "";
                    String rawType = colIndexes[2] >= 0 && colIndexes[2] < cols.length ? cols[colIndexes[2]].trim().toUpperCase() : "EXPENSE";
                    String rawAmount = colIndexes[3] >= 0 && colIndexes[3] < cols.length ? cols[colIndexes[3]].trim() : "";
                    String rawCategory = colIndexes[4] >= 0 && colIndexes[4] < cols.length ? cols[colIndexes[4]].trim() : "";
                    String rawDescription = colIndexes[5] >= 0 && colIndexes[5] < cols.length ? cols[colIndexes[5]].trim() : "";

                    if (rawDate.isBlank() || rawTitle.isBlank() || rawAmount.isBlank()) {
                        errors.add("Row " + lineNumber + ": missing required fields (date/title/amount), skipped.");
                        skippedCount++;
                        continue;
                    }

                    // Parse date
                    LocalDate date;
                    try {
                        date = LocalDate.parse(rawDate, DATE_FMT);
                    } catch (DateTimeParseException e) {
                        // Try common alternate formats
                        try {
                            date = LocalDate.parse(rawDate, DateTimeFormatter.ofPattern("MM/dd/yyyy"));
                        } catch (DateTimeParseException e2) {
                            try {
                                date = LocalDate.parse(rawDate, DateTimeFormatter.ofPattern("dd/MM/yyyy"));
                            } catch (DateTimeParseException e3) {
                                errors.add("Row " + lineNumber + ": invalid date format '" + rawDate + "', skipped.");
                                errorCount++;
                                continue;
                            }
                        }
                    }

                    // Parse type
                    TransactionType type;
                    if (rawType.contains("INCOME") || rawType.equals("INCOME")) {
                        type = TransactionType.INCOME;
                    } else {
                        type = TransactionType.EXPENSE;
                    }

                    // Parse amount — strip currency symbols
                    BigDecimal amount;
                    try {
                        String cleanAmount = rawAmount.replaceAll("[^0-9.\\-]", "");
                        amount = new BigDecimal(cleanAmount).abs();
                    } catch (NumberFormatException e) {
                        errors.add("Row " + lineNumber + ": invalid amount '" + rawAmount + "', skipped.");
                        errorCount++;
                        continue;
                    }

                    // Lookup category (optional)
                    Category category = null;
                    if (!rawCategory.isBlank()) {
                        category = categoryMap.get(rawCategory.toLowerCase());
                        // If not found, we proceed without category rather than error
                    }

                    // Build transaction
                    Transaction tx = new Transaction();
                    tx.setDate(date);
                    tx.setTitle(rawTitle.length() > 100 ? rawTitle.substring(0, 100) : rawTitle);
                    tx.setType(type);
                    tx.setAmount(amount);
                    tx.setCategory(category);
                    tx.setDescription(rawDescription.length() > 500 ? rawDescription.substring(0, 500) : rawDescription);
                    tx.setUser(user);

                    toSave.add(tx);
                    importedCount++;

                } catch (Exception e) {
                    errors.add("Row " + lineNumber + ": unexpected error — " + e.getMessage());
                    errorCount++;
                }
            }
        }

        // Bulk save
        if (!toSave.isEmpty()) {
            transactionRepository.saveAll(toSave);
        }

        return new ImportResultResponse(totalRows, importedCount, skippedCount, errorCount, errors);
    }

    // ── Helpers ─────────────────────────────────────────────────────────────────

    private String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }

    /**
     * Parses a single CSV line, respecting quoted fields.
     */
    private String[] parseCsvLine(String line) {
        List<String> result = new ArrayList<>();
        boolean inQuotes = false;
        StringBuilder current = new StringBuilder();

        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '"') {
                if (inQuotes && i + 1 < line.length() && line.charAt(i + 1) == '"') {
                    current.append('"');
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (c == ',' && !inQuotes) {
                result.add(current.toString());
                current.setLength(0);
            } else {
                current.append(c);
            }
        }
        result.add(current.toString());
        return result.toArray(new String[0]);
    }
}
