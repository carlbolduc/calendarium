package io.codebards.calendarium.api;

import java.time.Instant;

public class Subscription {
    private long subscriptionId;
    private String status;
    private Instant startAt;
    private Instant endAt;
    private String stripeSubId;
    private String product;

    public long getSubscriptionId() {
        return subscriptionId;
    }

    public void setSubscriptionId(long subscriptionId) {
        this.subscriptionId = subscriptionId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getStartAt() {
        return startAt;
    }

    public void setStartAt(Instant startAt) {
        this.startAt = startAt;
    }

    public Instant getEndAt() {
        return endAt;
    }

    public void setEndAt(Instant endAt) {
        this.endAt = endAt;
    }

    public String getStripeSubId() {
        return stripeSubId;
    }

    public void setStripeSubId(String stripeSubId) {
        this.stripeSubId = stripeSubId;
    }

    public String getProduct() {
        return product;
    }

    public void setProduct(String product) {
        this.product = product;
    }
}
