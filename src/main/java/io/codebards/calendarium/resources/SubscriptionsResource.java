package io.codebards.calendarium.resources;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stripe.Stripe;
import com.stripe.exception.CardException;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.net.Webhook;
import com.stripe.param.CustomerUpdateParams;
import com.stripe.param.PaymentMethodAttachParams;
import com.stripe.param.SubscriptionCreateParams;
import io.codebards.calendarium.api.PaymentIntentStatus;
import io.codebards.calendarium.api.Price;
import io.codebards.calendarium.core.AccountAuth;
import io.codebards.calendarium.db.Dao;
import io.dropwizard.auth.Auth;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RolesAllowed({"USER"})
@Path("/subscriptions")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SubscriptionsResource {
    private final Dao dao;
    private final String stripeApiKey;
    private final String stripeWebhookSecret;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public SubscriptionsResource(Dao dao, String stripeApiKey, String stripeWebhookSecret) {
        this.dao = dao;
        this.stripeApiKey = stripeApiKey;
        this.stripeWebhookSecret = stripeWebhookSecret;
    }

    @POST
    @Path("/stripe-customers")
    public Response createStripeCustomer(@Auth AccountAuth auth) {
        Response response;
        Stripe.apiKey = stripeApiKey;
        Map<String, Object> params = new HashMap<>();
        params.put("email", auth.getEmail());
        try {
            Customer customer = Customer.create(params);
            dao.setStripeCusId(auth.getAccountId(), customer.getId());
            // Customer successfully created, client should fetch the account again to obtain the stripe customer id
            response = Response.ok().build();
        } catch (StripeException e) {
            // Stripe failed to create the customer, client should ask the customer to retry
            response = Response.serverError().build();
        }
        return response;
    }

    @POST
    @Path("/stripe-subscriptions")
    public Response createStripeSubscription(@Auth AccountAuth auth, PaymentMethod paymentMethod) {
        Response response;
        Stripe.apiKey = stripeApiKey;
        Customer customer = null;
        try {
            customer = Customer.retrieve(auth.getStripeCusId());
            try {
                // Set the default payment method on the customer
                PaymentMethod pm = PaymentMethod.retrieve(paymentMethod.getId());
                pm.attach(PaymentMethodAttachParams.builder().setCustomer(customer.getId()).build());
                CustomerUpdateParams customerUpdateParams = CustomerUpdateParams
                        .builder()
                        .setInvoiceSettings(CustomerUpdateParams.InvoiceSettings.builder().setDefaultPaymentMethod(pm.getId()).build())
                        .build();
                customer.update(customerUpdateParams);
                // Get price id from database
                Price price = dao.findPrice();
                // Create the subscription
                SubscriptionCreateParams subCreateParams = SubscriptionCreateParams
                        .builder()
                        .addItem(SubscriptionCreateParams.Item.builder().setPrice(price.getStripePriceId()).build())
                        .setCustomer(customer.getId())
                        .addAllExpand(Collections.singletonList("latest_invoice.payment_intent"))
                        .build();
                Subscription subscription = Subscription.create(subCreateParams);
                // TODO: sub status should be an enum (only in Java, not in db)
                dao.insertSubscription(auth.getAccountId(), subscription.getId(), price.getPriceId(), subscription.getCurrentPeriodStart(), subscription.getCurrentPeriodEnd(), "active");
                if (subscription.getLatestInvoiceObject().getPaymentIntentObject().getStatus().equals(PaymentIntentStatus.SUCCEEDED.getStatus())) {
                    // TODO: It worked, check what we must return to client
                    //...
                };
                response = Response.ok().build();
            } catch (CardException e) {
                response = Response.serverError().entity(e.getLocalizedMessage()).build();
            }
        } catch (StripeException e) {
            response = Response.serverError().entity(e.getLocalizedMessage()).build();
        }
        return response;
    }

    @POST
    @Path("/stripe-events")
    public Response createStripeEvent(String payload, @Context HttpHeaders headers) {
        try {
            String sigHeader = headers.getRequestHeader("Stripe-Signature").get(0);
            Event event = Webhook.constructEvent(payload, sigHeader, stripeWebhookSecret);
            // Deserialize the nested object inside the event
            EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
            StripeObject stripeObject = null;
            if (dataObjectDeserializer.getObject().isPresent()) {
                stripeObject = dataObjectDeserializer.getObject().get();
            } else {
                // Deserialization failed, probably due to an API version mismatch.
                // Refer to the Javadoc documentation on `EventDataObjectDeserializer` for
                // instructions on how to handle this case, or return an error here.
            }
            // Handle the event
            switch (event.getType()) {
                case "payment_intent.succeeded":
                    PaymentIntent paymentIntent = (PaymentIntent) stripeObject;
                    // Then define and call a method to handle the successful payment intent.
                    // handlePaymentIntentSucceeded(paymentIntent);
                    break;
                case "payment_method.attached":
                    PaymentMethod paymentMethod = (PaymentMethod) stripeObject;
                    // Then define and call a method to handle the successful attachment of a PaymentMethod.
                    // handlePaymentMethodAttached(paymentMethod);
                    break;
                // ... handle other event types
                default:
                    System.out.println("Unhandled event type: " + event.getType());
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

        return Response.ok().build();
    }
}
