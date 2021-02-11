package io.codebards.calendarium.resources;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.net.Webhook;
import io.codebards.calendarium.core.AccountAuth;
import io.codebards.calendarium.db.Dao;
import io.dropwizard.auth.Auth;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.Map;

@Path("/subscriptions")
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
    @Path("/stripe-customer")
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
    @Path("/stripe-webhook")
    public Response createWebhook(String payload, @Context HttpHeaders headers) {
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
