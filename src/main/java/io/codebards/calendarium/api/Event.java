package io.codebards.calendarium.api;

public class Event {
    private long eventId;
    private long accountId;
    private long calendarId;
    private String status;
    private String nameFr;
    private String nameEn;
    private String descriptionFr;
    private String descriptionEn;
    private Integer startAt;
    private Integer endAt;
    private Boolean allDay;
    private String hyperlinkFr;
    private String hyperlinkEn;
    private long createdBy;
    private long updatedBy;
    private String author;

    public long getEventId() {
        return eventId;
    }

    public void setEventId(long eventId) {
        this.eventId = eventId;
    }

    public long getAccountId() {
        return accountId;
    }

    public void setAccountId(long accountId) {
        this.accountId = accountId;
    }

    public long getCalendarId() {
        return calendarId;
    }

    public void setCalendarId(long calendarId) {
        this.calendarId = calendarId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNameFr() {
        return nameFr;
    }

    public void setNameFr(String nameFr) {
        this.nameFr = nameFr;
    }

    public String getNameEn() {
        return nameEn;
    }

    public void setNameEn(String nameEn) {
        this.nameEn = nameEn;
    }

    public String getDescriptionFr() {
        return descriptionFr;
    }

    public void setDescriptionFr(String descriptionFr) {
        this.descriptionFr = descriptionFr;
    }

    public String getDescriptionEn() {
        return descriptionEn;
    }

    public void setDescriptionEn(String descriptionEn) {
        this.descriptionEn = descriptionEn;
    }

    public Integer getStartAt() {
        return startAt;
    }

    public void setStartAt(Integer startAt) {
        this.startAt = startAt;
    }

    public Integer getEndAt() {
        return endAt;
    }

    public void setEndAt(Integer endAt) {
        this.endAt = endAt;
    }

    public Boolean getAllDay() {
        return allDay != null && allDay;
    }

    public void setAllDay(Boolean allDay) {
        this.allDay = allDay;
    }

    public String getHyperlinkFr() {
        return hyperlinkFr;
    }

    public void setHyperlinkFr(String hyperlinkFr) {
        this.hyperlinkFr = hyperlinkFr;
    }

    public String getHyperlinkEn() {
        return hyperlinkEn;
    }

    public void setHyperlinkEn(String hyperlinkEn) {
        this.hyperlinkEn = hyperlinkEn;
    }

    public long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(long createdBy) {
        this.createdBy = createdBy;
    }

    public long getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(long updatedBy) {
        this.updatedBy = updatedBy;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }
}
