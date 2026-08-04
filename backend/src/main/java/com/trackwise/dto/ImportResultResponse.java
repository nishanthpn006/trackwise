package com.trackwise.dto;

import java.util.List;

/**
 * ImportResultResponse — Summary result returned after a CSV import operation.
 */
public class ImportResultResponse {

    private int totalRows;
    private int importedCount;
    private int skippedCount;
    private int errorCount;
    private List<String> errors;

    public ImportResultResponse() {
    }

    public ImportResultResponse(int totalRows, int importedCount, int skippedCount, int errorCount, List<String> errors) {
        this.totalRows = totalRows;
        this.importedCount = importedCount;
        this.skippedCount = skippedCount;
        this.errorCount = errorCount;
        this.errors = errors;
    }

    public int getTotalRows() { return totalRows; }
    public void setTotalRows(int totalRows) { this.totalRows = totalRows; }

    public int getImportedCount() { return importedCount; }
    public void setImportedCount(int importedCount) { this.importedCount = importedCount; }

    public int getSkippedCount() { return skippedCount; }
    public void setSkippedCount(int skippedCount) { this.skippedCount = skippedCount; }

    public int getErrorCount() { return errorCount; }
    public void setErrorCount(int errorCount) { this.errorCount = errorCount; }

    public List<String> getErrors() { return errors; }
    public void setErrors(List<String> errors) { this.errors = errors; }
}
