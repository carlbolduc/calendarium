package io.codebards.calendarium.api;

import java.time.Instant;

public class Event {
    private long eventId;
    private String status;
    private String nameEn;
    private String nameFr;
    private String descriptionEn;
    private String descriptionFr;
    private String hyperlinkEn;
    private String hyperlinkFr;
    private Instant startAt;
    private Instant endAt;
    private Boolean allDay;
    private long accountId;
    private long calendarId;

    public long getEventId() {
        return eventId;
    }

    public void setEventId(long eventId) {
        this.eventId = eventId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNameEn() {
        return nameEn;
    }

    public void setNameEn(String nameEn) {
        this.nameEn = nameEn;
    }

    public String getNameFr() {
        return nameFr;
    }

    public void setNameFr(String nameFr) {
        this.nameFr = nameFr;
    }

    public String getDescriptionEn() {
        return descriptionEn;
    }

    public void setDescriptionEn(String descriptionEn) {
        this.descriptionEn = descriptionEn;
    }

    public String getDescriptionFr() {
        return descriptionFr;
    }

    public void setDescriptionFr(String descriptionFr) {
        this.descriptionFr = descriptionFr;
    }

    public String getHyperlinkEn() {
        return hyperlinkEn;
    }

    public void setHyperlinkEn(String hyperlinkEn) {
        this.hyperlinkEn = hyperlinkEn;
    }

    public String getHyperlinkFr() {
        return hyperlinkFr;
    }

    public void setHyperlinkFr(String hyperlinkFr) {
        this.hyperlinkFr = hyperlinkFr;
    }

    public Instant getStartAt() {
        return startAt;
    }

    public void setStartAt(Instant startAt) {
        this.startAt = startAt;
    }

    public Instant getEndAt() {
        return endAt;
    }

    public void setEndAt(Instant endAt) {
        this.endAt = endAt;
    }

    public Boolean getAllDay() {
        return allDay != null && allDay;
    }

    public void setAllDay(Boolean allDay) {
        this.allDay = allDay;
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
}
