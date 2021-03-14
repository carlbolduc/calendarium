package io.codebards.calendarium.api;

public class InvitationResponse {
    private long calendarId;
    private long calendarAccessId;
    private long accountId;
    private String password;

    public long getCalendarId() {
        return calendarId;
    }

    public void setCalendarId(long calendarId) {
        this.calendarId = calendarId;
    }

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
