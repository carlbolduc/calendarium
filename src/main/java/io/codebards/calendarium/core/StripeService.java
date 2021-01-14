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

  public Customer createCustomer() {
    Stripe.apiKey = stripeApiKey;
    Customer customer = null;
    Map<String, Object> params = new HashMap<>();
    params.put("email", "cbol@me.com");
    params.put("description", "Created from API.");

    try {
      customer = Customer.create(params);
    } catch (StripeException e) {
      e.printStackTrace();
    }
    return customer;
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
