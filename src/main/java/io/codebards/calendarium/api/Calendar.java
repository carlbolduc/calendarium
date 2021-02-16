package io.codebards.calendarium.api;

public class Calendar {
    private long calendarId;
    private Boolean enableEn = true;
    private Boolean enableFr = false;
    private String nameEn;
    private String nameFr;
    private String descriptionEn;
    private String descriptionFr;
    private String linkEn;
    private String linkFr;
    private String primaryColor;
    private String secondaryColor;
    private Boolean publicCalendar = false;
    private Boolean eventApprovalRequired = true;

    public long getCalendarId() {
        return calendarId;
    }

    public void setCalendarId(long calendarId) {
        this.calendarId = calendarId;
    }

    public Boolean getEnableEn() {
        return enableEn;
    }

    public void setEnableEn(Boolean enableEn) {
        this.enableEn = enableEn;
    }

    public Boolean getEnableFr() {
        return enableFr;
    }

    public void setEnableFr(Boolean enableFr) {
        this.enableFr = enableFr;
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

    public String getLinkEn() {
        return linkEn;
    }

    public void setLinkEn(String linkEn) {
        this.linkEn = linkEn;
    }

    public String getLinkFr() {
        return linkFr;
    }

    public void setLinkFr(String linkFr) {
        this.linkFr = linkFr;
    }

    public String getPrimaryColor() {
        return primaryColor;
    }

    public void setPrimaryColor(String primaryColor) {
        this.primaryColor = primaryColor;
    }

    public String getSecondaryColor() {
        return secondaryColor;
    }

    public void setSecondaryColor(String secondaryColor) {
        this.secondaryColor = secondaryColor;
    }

    public Boolean getPublicCalendar() {
        return publicCalendar;
    }

    public void setPublicCalendar(Boolean publicCalendar) {
        this.publicCalendar = publicCalendar;
    }

    public Boolean getEventApprovalRequired() {
        return eventApprovalRequired;
    }

    public void setEventApprovalRequired(Boolean eventApprovalRequired) {
        this.eventApprovalRequired = eventApprovalRequired;
    }
    
}
