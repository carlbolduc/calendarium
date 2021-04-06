package io.codebards.calendarium.resources;

import com.stripe.exception.CardException;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.net.Webhook;
import com.stripe.param.SubscriptionCreateParams;
import io.codebards.calendarium.api.PaymentIntentStatus;
import io.codebards.calendarium.api.Price;
import io.codebards.calendarium.api.SubscriptionStatus;
import io.codebards.calendarium.api.SubscriptionUpdate;
import io.codebards.calendarium.api.Tax;
import io.codebards.calendarium.core.Account;
import io.codebards.calendarium.core.StripeService;
import io.codebards.calendarium.db.Dao;
import io.dropwizard.auth.Auth;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RolesAllowed({"USER"})
@Path("/subscriptions")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SubscriptionsResource {
    private final Dao dao;
    private final StripeService stripeService;
    private final String stripeWebhookSecret;

    public SubscriptionsResource(Dao dao, StripeService stripeService, String stripeWebhookSecret) {
        this.dao = dao;
        this.stripeService = stripeService;
        this.stripeWebhookSecret = stripeWebhookSecret;
    }

    @POST
    @Path("/stripe-customers")
    public Response createStripeCustomer(@Auth Account auth) {
        Response response;
        try {
            Customer customer = stripeService.createCustomer(auth);
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
    public Response createSubscription(@Auth Account auth, PaymentMethod paymentMethod) {
        Response response;
        // You can subscribe if you never subscribe, if you are on a trial or if your subscription is expired
        if (
            auth.getSubscription() == null
            || auth.getSubscription().getStripeSubId() == null
            || auth.getSubscription().getEndAt().isBefore(Instant.now())
        ) {
            try {
                Customer customer = stripeService.getCustomer(auth.getStripeCusId());
                try {
                    // Set the default payment method on the customer
                    PaymentMethod pm = stripeService.setPaymentMethod(customer, paymentMethod.getId());
                    // Get price id from database
                    Price price = dao.findPrice(600);
                    SubscriptionCreateParams subCreateParams;
                    if (pm.getCard().getCountry().equals("CA")) {
                        List<Tax> taxesToCharge = new ArrayList<>();
                        String postalCode = pm.getBillingDetails().getAddress().getPostalCode();
                        if (postalCode != null) {
                            List<Tax> taxes = dao.findTaxes();
                            List<String> taxRateDescriptions = getTaxRateDescriptions(postalCode);
                            taxesToCharge = taxes.stream().filter(t -> taxRateDescriptions.contains(t.getDescription())).collect(Collectors.toList());
                        }
                        subCreateParams = SubscriptionCreateParams
                            .builder()
                            .addItem(SubscriptionCreateParams.Item.builder().setPrice(price.getStripePriceId()).build())
                            .setCustomer(customer.getId())
                            .addAllExpand(Collections.singletonList("latest_invoice.payment_intent"))
                            .addAllDefaultTaxRate(taxesToCharge.stream().map(Tax::getStripeTaxId).collect(Collectors.toList()))
                            .build();
                    } else {
                        subCreateParams = SubscriptionCreateParams
                                .builder()
                                .addItem(SubscriptionCreateParams.Item.builder().setPrice(price.getStripePriceId()).build())
                                .setCustomer(customer.getId())
                                .addAllExpand(Collections.singletonList("latest_invoice.payment_intent"))
                                .build();
                    }
                    // Create the subscription
                    Subscription subscription = stripeService.createSubscription(subCreateParams);
                    if (auth.getSubscription() == null) {
                        dao.insertSubscription(auth.getAccountId(), subscription.getId(), price.getPriceId(), Instant.ofEpochSecond(subscription.getCurrentPeriodStart()), Instant.ofEpochSecond(subscription.getCurrentPeriodEnd()), SubscriptionStatus.ACTIVE.getStatus(), auth.getAccountId());
                    } else {
                        dao.updateSubscription(auth.getSubscription().getSubscriptionId(), subscription.getId(), price.getPriceId(), Instant.ofEpochSecond(subscription.getCurrentPeriodStart()), Instant.ofEpochSecond(subscription.getCurrentPeriodEnd()), SubscriptionStatus.ACTIVE.getStatus(), auth.getAccountId());
                    }
                    if (subscription.getLatestInvoiceObject().getPaymentIntentObject().getStatus().equals(PaymentIntentStatus.SUCCEEDED.getStatus())) {
                        // TODO: It worked, check what we must return to client
                        // Check with Stripe if it's possible to get a subscription that is not succeeded when we reach this step
                    }
                    response = Response.ok().build();
                } catch (CardException e) {
                    // Returns a 402 Payment Required
                    response = Response.status(Response.Status.PAYMENT_REQUIRED).entity(e.getLocalizedMessage()).build();
                }
            } catch (StripeException e) {
                // Returns a 500 Internal Server Error
                response = Response.serverError().entity(e.getLocalizedMessage()).build();
            }
        } else {
            response = Response.status(Response.Status.FORBIDDEN).build();
        }
        return response;
    }

    @PUT
    @Path("/{id}")
    public Response updateSubscription(@Auth Account auth, SubscriptionUpdate update) {
        Response response = Response.ok().build();
        if (auth.getSubscription() != null && auth.getSubscription().getStripeSubId() != null && update.getCancelAtPeriodEnd() != null) {
            try {
                stripeService.updateSubscription(auth.getSubscription().getStripeSubId(), update.getCancelAtPeriodEnd());
                if (update.getCancelAtPeriodEnd()) {
                    dao.updateSubscriptionStatus(auth.getSubscription().getStripeSubId(), SubscriptionStatus.CANCELED.getStatus(), auth.getAccountId());
                } else {
                    dao.updateSubscriptionStatus(auth.getSubscription().getStripeSubId(), SubscriptionStatus.ACTIVE.getStatus(), auth.getAccountId());
                }
            } catch (StripeException e) {
                e.printStackTrace();
                // Returns a 500 Internal Server Error
                response = Response.serverError().build();
            }
        } else {
            // Returns a 404 Not Found
            response = Response.status(Response.Status.NOT_FOUND).build();
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

    private List<String> getTaxRateDescriptions(String postalCode) {
        List<String> taxRateDescriptions = new ArrayList<>();
        switch (postalCode.toLowerCase().charAt(0)) {
            case 'a': case 'b': case 'c': case 'e':
                // NL, NS, PE, NB
                taxRateDescriptions.add("HST15");
                break;
            case 'g': case 'h': case 'j':
                // QC
                taxRateDescriptions.add("GST");
                taxRateDescriptions.add("QST");
                break;
            case 'k': case 'l': case 'm': case 'n': case 'p':
                // ON
                taxRateDescriptions.add("HST13");
                break;
            case 'r': case 's': case 't': case 'v': case 'x': case 'y':
                // MP, SK, AB, BC, NUNT, YT
                taxRateDescriptions.add("HST15");
                break;
            default:
                break;
        }
        return taxRateDescriptions;
    }
}
