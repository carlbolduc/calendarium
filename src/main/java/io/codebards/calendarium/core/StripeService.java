package io.codebards.calendarium.core;

import java.util.HashMap;
import java.util.Map;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentMethod;
import com.stripe.model.Subscription;
import com.stripe.param.CustomerUpdateParams;
import com.stripe.param.PaymentMethodAttachParams;
import com.stripe.param.SubscriptionCreateParams;
import com.stripe.param.SubscriptionUpdateParams;

public class StripeService {
    private final String stripeApiKey;

    public StripeService(String stripeApiKey) {
        this.stripeApiKey = stripeApiKey;
    }

    public Customer getCustomer(String customerId) throws StripeException {
        Stripe.apiKey = stripeApiKey;
        return Customer.retrieve(customerId);
    }

    public Customer createCustomer(Account account) throws StripeException {
        Stripe.apiKey = stripeApiKey;
        Map<String, Object> params = new HashMap<>();
        params.put("email", account.getEmail());
        params.put("name", account.getName());
        Customer customer = Customer.create(params);
        return customer;
    }

    public void updateCustomer(String customerId, String email, String name) throws StripeException {
        if (customerId != null && !customerId.equals("")) {
            Stripe.apiKey = stripeApiKey;
            Customer customer = Customer.retrieve(customerId);
            Map<String, Object> params = new HashMap<>();
            params.put("email", email);
            params.put("name", name);
            customer.update(params);
        }
    }

    public Subscription createSubscription(SubscriptionCreateParams params) throws StripeException {
        Subscription subscription = Subscription.create(params);;
        return subscription;
    }

    public void updateSubscription(String subscriptionId, Boolean cancelAtPeriodEnd) throws StripeException {
        Subscription subscription = Subscription.retrieve(subscriptionId);
        SubscriptionUpdateParams params = SubscriptionUpdateParams.builder().setCancelAtPeriodEnd(cancelAtPeriodEnd).build();
        subscription.update(params);
    }

    public PaymentMethod getPaymentMethod() {
        // Retrieve customer's payment method
        PaymentMethod paymentMethod = null;
        return paymentMethod;
    }

    public PaymentMethod setPaymentMethod(Customer customer, String paymentMethodId) throws StripeException {
        PaymentMethod pm = PaymentMethod.retrieve(paymentMethodId);
        pm.attach(PaymentMethodAttachParams.builder().setCustomer(customer.getId()).build());
        CustomerUpdateParams customerUpdateParams = CustomerUpdateParams
                .builder()
                .setInvoiceSettings(CustomerUpdateParams.InvoiceSettings.builder().setDefaultPaymentMethod(pm.getId()).build())
                .build();
        customer.update(customerUpdateParams);
        return pm;
    }

}
