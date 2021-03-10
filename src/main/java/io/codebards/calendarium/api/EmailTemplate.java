package io.codebards.calendarium.api;

public class EmailTemplate {
    private long emailTemplateId;
    private String name;
    private String titleFr;
    private String titleEn;
    private String bodyFr;
    private String bodyEn;

    public long getEmailTemplateId() {
        return emailTemplateId;
    }

    public void setEmailTemplateId(long emailTemplateId) {
        this.emailTemplateId = emailTemplateId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitleFr() {
        return titleFr;
    }

    public void setTitleFr(String titleFr) {
        this.titleFr = titleFr;
    }

    public String getTitleEn() {
        return titleEn;
    }

    public void setTitleEn(String titleEn) {
        this.titleEn = titleEn;
    }

    public String getBodyFr() {
        return bodyFr;
    }

    public void setBodyFr(String bodyFr) {
        this.bodyFr = bodyFr;
    }

    public String getBodyEn() {
        return bodyEn;
    }

    public void setBodyEn(String bodyEn) {
        this.bodyEn = bodyEn;
    }
}
