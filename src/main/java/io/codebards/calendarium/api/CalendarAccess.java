package io.codebards.calendarium.api;

public class CalendarAccess {
    private long calendarAccessId;
    private long accountId;
    private long calendarId;
    private String status;

    public long getCalendarAccessId() {
        return calendarAccessId;
    }

    public void setCalendarAccessId(long calendarAccessId) {
        this.calendarAccessId = calendarAccessId;
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
}
