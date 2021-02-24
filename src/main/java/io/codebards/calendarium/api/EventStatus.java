package io.codebards.calendarium.api;

public enum EventStatus {
    DRAFT, PENDING_APPROVAL, PUBLISHED;

    public String getStatus() {
        switch (this) {
            case DRAFT:
                return "draft";
            case PENDING_APPROVAL:
                return "pending_approval";
            case PUBLISHED:
                return "published";
            default:
                return null;
        }
    }
}
