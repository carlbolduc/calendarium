package io.codebards.calendarium.resources;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stripe.model.*;
import com.stripe.net.Webhook;
import io.codebards.calendarium.db.Dao;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;

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
    @Path("/webhook")
    public Response createWebhook(String payload, @Context HttpHeaders headers) {

        String sigHeader = headers.getRequestHeader("Stripe-Signature").get(0);
        Event event = null;
        try {
            event = Webhook.constructEvent(payload, sigHeader, stripeWebhookSecret);
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
