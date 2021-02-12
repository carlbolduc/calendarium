package io.codebards.calendarium.api;

public enum PaymentIntentStatus {
    REQUIRES_PAYMENT_METHOD, REQUIRES_CONFIRMATION, REQUIRES_ACTION, PROCESSING, SUCCEEDED, CANCELED;

    public String getStatus() {
        switch (this) {
            case REQUIRES_PAYMENT_METHOD:
                return "requires_payment_method";
            case REQUIRES_CONFIRMATION:
                return "requires_confirmation";
            case REQUIRES_ACTION:
                return "requires_action";
            case PROCESSING:
                return "processing";
            case SUCCEEDED:
                return "succeeded";
            case CANCELED:
                return "canceled";
            default:
                return null;
        }
    }
}
