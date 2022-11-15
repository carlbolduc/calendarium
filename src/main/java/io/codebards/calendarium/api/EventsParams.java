package io.codebards.calendarium.api;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class EventsParams {
    private String search;
    private Integer startAt;
    private Integer endAt;
    private String status;
    private Long calendarId;

    public String getSearch() {
        return search;
    }

    public void setSearch(String search) {
        this.search = search;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getCalendarId() {
        return calendarId;
    }

    public void setCalendarId(Long calendarId) {
        this.calendarId = calendarId;
    }

    @JsonIgnore
    public String getUpperCaseSearch() {
        return search.toUpperCase();
    }
}
