package io.codebards.calendarium.api;

public class Subscription {
    private long subscriptionId;
    private String status;
    private Integer startAt;
    private Integer endAt;
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
