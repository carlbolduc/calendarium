package io.codebards.calendarium.api;

public enum CalendarAccessStatus {
    OWNER, INVITED, REQUESTED, ACTIVE, INACTIVE;

    public String getStatus() {
        switch (this) {
            case OWNER:
                return "owner";
            case INVITED:
                return "invited";
            case REQUESTED:
                return "requested";
            case ACTIVE:
                return "active";
            case INACTIVE:
                return "inactive";
            default:
                return null;
        }
    }
}
