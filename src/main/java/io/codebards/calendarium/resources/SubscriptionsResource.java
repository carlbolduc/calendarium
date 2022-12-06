package io.codebards.calendarium.resources;

import com.stripe.exception.CardException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.Subscription;
import com.stripe.model.*;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.SubscriptionCreateParams;
import io.codebards.calendarium.api.Price;
import io.codebards.calendarium.api.*;
import io.codebards.calendarium.core.Account;
import io.codebards.calendarium.core.StripeService;
import io.codebards.calendarium.core.Utils;
import io.codebards.calendarium.db.Dao;
import io.dropwizard.auth.Auth;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
    @Path("/trials")
    public Response createTrial(@Auth Account auth) {
        Response response;
        if (auth.getSubscription() == null) {
            Instant now = Instant.now();
            Instant in30Days = LocalDateTime.from(now.atZone(ZoneId.of("UTC"))).plusDays(30).atZone(ZoneId.of("UTC")).toInstant();
            Price price = dao.findPrice(0);
            // Create the subscription
            dao.insertSubscription(auth.getAccountId(), null, price.getPriceId(), Math.toIntExact(now.getEpochSecond()), Math.toIntExact(in30Days.getEpochSecond()), SubscriptionStatus.ACTIVE.getStatus(), Math.toIntExact(now.getEpochSecond()), auth.getAccountId());
            response = Response.ok().build();
        } else {
            response = Response.status(Response.Status.FORBIDDEN).build();
        }
        return response;
    }

    @RolesAllowed({"USER"})
    @POST
    @Path("/stripe-customers")
    public Response createStripeCustomer(@Auth Account auth) {
        Response response;
        try {
            Customer customer = stripeService.createCustomer(auth.getEmail(), auth.getName());
            dao.setStripeCusId(auth.getAccountId(), customer.getId());
            // Customer successfully created, client should fetch the account again to obtain the stripe customer id
            response = Response.ok().build();
        } catch (StripeException e) {
            // Stripe failed to create the customer, client should ask the customer to retry
            response = Response.serverError().build();
        }
        return response;
    }

    @RolesAllowed({"USER"})
    @POST
    public Response createSubscription(@Auth Account auth, PaymentMethodDetails paymentMethodDetails) {
        Response response;
        // You can subscribe if you never subscribe, if you are on a trial or if your subscription is expired
        if (
            auth.getSubscription() == null
            || auth.getSubscription().getStripeSubId() == null
            || auth.getSubscription().getEndAt() < Instant.now().getEpochSecond()
        ) {
            try {
                Customer customer = stripeService.getCustomer(auth.getStripeCusId());
                try {
                    // Set the default payment method on the customer
                    PaymentMethod paymentMethod = stripeService.setPaymentMethod(customer, paymentMethodDetails.getId());
                    // Get price id from database
                    Price price = dao.findPrice(10);
                    SubscriptionCreateParams subCreateParams;
                    if (paymentMethod.getCard().getCountry().equals("CA")) {
                        List<Tax> taxesToCharge = new ArrayList<>();
                        String postalCode = paymentMethod.getBillingDetails().getAddress().getPostalCode();
                        if (postalCode != null) {
                            List<Tax> taxes = dao.findTaxes();
                            List<String> taxRateDescriptions = Utils.getTaxRateDescriptions(postalCode);
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
                    Integer now = Math.toIntExact(Instant.now().getEpochSecond());
                    if (auth.getSubscription() == null) {
                        dao.insertSubscription(auth.getAccountId(), subscription.getId(), price.getPriceId(), Math.toIntExact(subscription.getCurrentPeriodStart()), Math.toIntExact(subscription.getCurrentPeriodEnd()), SubscriptionStatus.ACTIVE.getStatus(), now, auth.getAccountId());
                    } else {
                        dao.updateSubscription(auth.getSubscription().getSubscriptionId(), subscription.getId(), price.getPriceId(), Math.toIntExact(subscription.getCurrentPeriodStart()), Math.toIntExact(subscription.getCurrentPeriodEnd()), SubscriptionStatus.ACTIVE.getStatus(), now, auth.getAccountId());
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

    @RolesAllowed({"USER"})
    @PUT
    @Path("/{id}")
    public Response updateSubscription(@Auth Account auth, SubscriptionUpdate update) {
        Response response = Response.ok().build();
        if (auth.getSubscription() != null && auth.getSubscription().getStripeSubId() != null && update.getCancelAtPeriodEnd() != null) {
            try {
                stripeService.updateSubscription(auth.getSubscription().getStripeSubId(), update.getCancelAtPeriodEnd());
                if (update.getCancelAtPeriodEnd()) {
                    dao.updateSubscriptionStatus(auth.getSubscription().getStripeSubId(), SubscriptionStatus.CANCELED.getStatus(), Math.toIntExact(Instant.now().getEpochSecond()), auth.getAccountId());
                } else {
                    dao.updateSubscriptionStatus(auth.getSubscription().getStripeSubId(), SubscriptionStatus.ACTIVE.getStatus(), Math.toIntExact(Instant.now().getEpochSecond()), auth.getAccountId());
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

    @RolesAllowed({"USER"})
    @GET
    @Path("/checkout-sessions/{sessionId}")
    public Response createCheckoutSession(@Auth Account auth, @PathParam("sessionId") String sessionId) {
        Response response;
        try {
            Session session = stripeService.getSession(sessionId);
            SetupIntent setupIntent = stripeService.getSetupIntent(session.getSetupIntent());
            Customer customer = stripeService.getCustomer(session.getCustomer());
            stripeService.setPaymentMethod(customer, setupIntent.getPaymentMethod());
            response = Response.ok().build();
        } catch (StripeException e) {
            response = Response.serverError().entity(e.getLocalizedMessage()).build();
        }
        return response;
    }

    @RolesAllowed({"USER"})
    @POST
    @Path("/checkout-sessions")
    public Response createCheckoutSession(@Auth Account auth) {
        Response response;
        if (auth.getSubscription() != null) {
            try {
                Session session = stripeService.createCheckoutSession(auth.getStripeCusId(), auth.getSubscription().getStripeSubId());
                response = Response.ok(session.getId()).build();
            } catch (StripeException e) {
                response = Response.serverError().entity(e.getLocalizedMessage()).build();
            }
        } else {
            response = Response.status(Response.Status.FORBIDDEN).build();
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
                // TODO: email grove since we cannot process renewal
            }
            if (stripeObject != null) {
                if (event.getType().equals("invoice.paid")) {
                    Invoice invoice = (Invoice) stripeObject;
                    if (invoice.getStatus().equals("paid")) {
                        Optional<Long> oSubscriptionId = dao.findSubscriptionId(invoice.getSubscription());
                        if (oSubscriptionId.isPresent()) {
                            // Renew the subscription by postponing its end time
                            Subscription subscription = stripeService.getSubscription(invoice.getSubscription());
                            dao.renewSubscription(oSubscriptionId.get(), Math.toIntExact(subscription.getCurrentPeriodEnd()), Math.toIntExact(Instant.now().getEpochSecond()));
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return Response.ok().build();
    }

}
