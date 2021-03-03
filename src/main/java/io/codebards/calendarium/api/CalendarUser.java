package io.codebards.calendarium.api;

import java.time.Instant;

public class CalendarUser {
    private long calendarAccessId;
    private String name;
    private String email;
    private String status;
    private Instant createdAt;

    public void setCalendarAccessId(long calendarAccessId) {
        this.calendarAccessId = calendarAccessId;
    }

    public long getCalendarAccessId() {
        return calendarAccessId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
