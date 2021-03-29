package io.codebards.calendarium.api;

import com.stripe.model.PaymentMethod;

public class PaymentInformation {
    private PaymentMethod paymentMethod;
    private String postalCode;
    
    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPostalCode() {
        return postalCode;
    }
    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

}
