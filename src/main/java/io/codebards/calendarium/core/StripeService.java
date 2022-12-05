package io.codebards.calendarium.core;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentMethod;
import com.stripe.model.SetupIntent;
import com.stripe.model.Subscription;
import com.stripe.model.checkout.Session;
import com.stripe.param.CustomerUpdateParams;
import com.stripe.param.PaymentMethodAttachParams;
import com.stripe.param.SubscriptionCreateParams;
import com.stripe.param.SubscriptionUpdateParams;
import com.stripe.param.checkout.SessionCreateParams;

import java.util.HashMap;
import java.util.Map;

public class StripeService {
    private final String env;
    private final String stripeApiKey;

    public StripeService(String env, String stripeApiKey) {
        this.env = env;
        this.stripeApiKey = stripeApiKey;
    }

    public Customer getCustomer(String customerId) throws StripeException {
        Stripe.apiKey = stripeApiKey;
        return Customer.retrieve(customerId);
    }

    public Customer createCustomer(String email, String name) throws StripeException {
        Stripe.apiKey = stripeApiKey;
        Map<String, Object> params = new HashMap<>();
        params.put("email", email);
        params.put("name", name);
        return Customer.create(params);
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

    public Subscription getSubscription(String subscriptionId) throws StripeException {
        Stripe.apiKey = stripeApiKey;
        return Subscription.retrieve(subscriptionId);
    }

    public Subscription createSubscription(SubscriptionCreateParams params) throws StripeException {
        Stripe.apiKey = stripeApiKey;
        return Subscription.create(params);
    }

    public void updateSubscription(String subscriptionId, Boolean cancelAtPeriodEnd) throws StripeException {
        Stripe.apiKey = stripeApiKey;
        Subscription subscription = Subscription.retrieve(subscriptionId);
        SubscriptionUpdateParams params = SubscriptionUpdateParams.builder().setCancelAtPeriodEnd(cancelAtPeriodEnd).build();
        subscription.update(params);
    }

    public PaymentMethod setPaymentMethod(Customer customer, String paymentMethodId) throws StripeException {
        Stripe.apiKey = stripeApiKey;
        PaymentMethod pm = PaymentMethod.retrieve(paymentMethodId);
        pm.attach(PaymentMethodAttachParams.builder().setCustomer(customer.getId()).build());
        CustomerUpdateParams customerUpdateParams = CustomerUpdateParams
                .builder()
                .setInvoiceSettings(CustomerUpdateParams.InvoiceSettings.builder().setDefaultPaymentMethod(pm.getId()).build())
                .build();
        customer.update(customerUpdateParams);
        return pm;
    }

    public Session getSession(String sessionId) throws StripeException {
        Stripe.apiKey = stripeApiKey;
        return Session.retrieve(sessionId);
    }

    public Session createCheckoutSession(String customerId, String subscriptionId) throws StripeException {
        Stripe.apiKey = stripeApiKey;
        String cancelUrl = env.equals("development") ? "http://localhost:3003/subscription" : "https://calendarium.ca/subscription";
        String successUrl = env.equals("development") ? "http://localhost:3003/subscription" : "https://calendarium.ca/subscription";
        SessionCreateParams params = SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.SETUP)
                .setCustomer(customerId)
                .setSetupIntentData(SessionCreateParams.SetupIntentData.builder()
                        .putMetadata("customer_id", customerId)
                        .putMetadata("subscription_id", subscriptionId)
                        .build())
                .setSuccessUrl(successUrl + "?session-id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(cancelUrl)
                .build();

        return Session.create(params);
    }

    public SetupIntent getSetupIntent(String setupIntentId) throws StripeException {
        Stripe.apiKey = stripeApiKey;
        return SetupIntent.retrieve(setupIntentId);
    }

}
