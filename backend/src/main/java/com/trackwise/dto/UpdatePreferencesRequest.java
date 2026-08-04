package com.trackwise.dto;

public class UpdatePreferencesRequest {
    private String currency;
    private String dateFormat;
    private String timeFormat;
    private String firstDayOfWeek;
    private String numberFormat;
    private String language;
    private String theme;

    public UpdatePreferencesRequest() {
    }

    public UpdatePreferencesRequest(String currency, String dateFormat, String timeFormat, String firstDayOfWeek, String numberFormat, String language, String theme) {
        this.currency = currency;
        this.dateFormat = dateFormat;
        this.timeFormat = timeFormat;
        this.firstDayOfWeek = firstDayOfWeek;
        this.numberFormat = numberFormat;
        this.language = language;
        this.theme = theme;
    }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getDateFormat() { return dateFormat; }
    public void setDateFormat(String dateFormat) { this.dateFormat = dateFormat; }

    public String getTimeFormat() { return timeFormat; }
    public void setTimeFormat(String timeFormat) { this.timeFormat = timeFormat; }

    public String getFirstDayOfWeek() { return firstDayOfWeek; }
    public void setFirstDayOfWeek(String firstDayOfWeek) { this.firstDayOfWeek = firstDayOfWeek; }

    public String getNumberFormat() { return numberFormat; }
    public void setNumberFormat(String numberFormat) { this.numberFormat = numberFormat; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }
}
