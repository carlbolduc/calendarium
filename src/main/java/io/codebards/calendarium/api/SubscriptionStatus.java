package io.codebards.calendarium.api;

public enum SubscriptionStatus {
    ACTIVE, CANCELED;

    public String getStatus() {
        switch (this) {
            case ACTIVE:
                return "active";
            case CANCELED:
                return "canceled";
            default:
                return null;
        }
    }
}
