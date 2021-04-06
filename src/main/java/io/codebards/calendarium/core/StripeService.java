package io.codebards.calendarium.core;

import java.util.HashMap;
import java.util.Map;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentMethod;
import com.stripe.model.Subscription;

public class StripeService {
    private final String stripeApiKey;

    public StripeService(String stripeApiKey) {
        this.stripeApiKey = stripeApiKey;
    }

    public Customer createCustomer(Account account) throws StripeException {
        Stripe.apiKey = stripeApiKey;
        Map<String, Object> params = new HashMap<>();
        params.put("email", account.getEmail());
        params.put("name", account.getName());
        Customer customer = Customer.create(params);
        return customer;
    }

    public void updateCustomer(String stripeCusId, String email, String name) throws StripeException {
        if (stripeCusId != null && !stripeCusId.equals("")) {
            Stripe.apiKey = stripeApiKey;
            Customer customer = Customer.retrieve(stripeCusId);
            Map<String, Object> params = new HashMap<>();
            params.put("email", email);
            params.put("name", name);
            customer.update(params);
        }
    }

    public Subscription createSubscription() {
        Subscription subscription = null;
        return subscription;
    }

    public Subscription cancelSubscription() {
        Subscription subscription = null;
        return subscription;
    }

    public PaymentMethod getPaymentMethod() {
        // Retrieve customer's payment method
        PaymentMethod paymentMethod = null;
        return paymentMethod;
    }

}
