package io.codebards.calendarium.api;

public class PaidSignUp {
    private SignUp signUp;
    private PaymentMethodDetails paymentMethodDetails;

    public SignUp getSignUp() {
        return signUp;
    }

    public void setSignUp(SignUp signUp) {
        this.signUp = signUp;
    }

    public PaymentMethodDetails getPaymentMethodDetails() {
        return paymentMethodDetails;
    }

    public void setPaymentMethodDetails(PaymentMethodDetails paymentMethodDetails) {
        this.paymentMethodDetails = paymentMethodDetails;
    }
}
