package io.codebards.calendarium.api;

public class SubscriptionUpdate {
    private Boolean cancelAtPeriodEnd;

    public Boolean getCancelAtPeriodEnd() {
        return cancelAtPeriodEnd != null && cancelAtPeriodEnd;
    }

    public void setCancelAtPeriodEnd(Boolean cancelAtPeriodEnd) {
        this.cancelAtPeriodEnd = cancelAtPeriodEnd;
    }
}
