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
import com.stripe.param.SubscriptionUpdateParams;
import io.codebards.calendarium.api.PaymentIntentStatus;
import io.codebards.calendarium.api.Price;
import io.codebards.calendarium.api.SubscriptionStatus;
import io.codebards.calendarium.api.SubscriptionUpdate;
import io.codebards.calendarium.core.Account;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
    public Response createStripeCustomer(@Auth Account auth) {
        Response response;
        Stripe.apiKey = stripeApiKey;
        Map<String, Object> params = new HashMap<>();
        params.put("email", auth.getEmail());
        params.put("name", auth.getName());
        try {
            Customer customer = Customer.create(params);
            dao.setStripeCusId(auth.getAccountId(), customer.getId());
            // Customer successfully created, client should fetch the account again to obtain the stripe customer id
            response = Response.ok().build();
        } catch (StripeException e) {
            // Stripe failed to create the customer, client should ask the customer to retry
	        System.out.println(e.getMessage());
            response = Response.serverError().build();
        }
        return response;
    }

    @POST
    public Response createSubscription(@Auth Account auth, PaymentMethod paymentMethod) {
        Response response;
        Stripe.apiKey = stripeApiKey;
        Customer customer;
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
                SubscriptionCreateParams subCreateParams;
                if (pm.getCard().getCountry().equals("CA")) {
                    List<TaxRate> taxesToCharge = new ArrayList<>();
                    Map<String, Object> params = new HashMap<>();
                    params.put("limit", 4);
                    TaxRateCollection taxRates = TaxRate.list(params);
                    List<TaxRate> taxes = taxRates.getData();
                    String postalCode = pm.getBillingDetails().getAddress().getPostalCode();
                    if (postalCode != null) {
                        List<String> taxRateDescriptions = getTaxRateDescriptions(postalCode);
                        taxesToCharge = taxes.stream().filter(t -> taxRateDescriptions.contains(t.getDescription())).collect(Collectors.toList());
                    }
                    subCreateParams = SubscriptionCreateParams
                        .builder()
                        .addItem(SubscriptionCreateParams.Item.builder().setPrice(price.getStripePriceId()).build())
                        .setCustomer(customer.getId())
                        .addAllExpand(Collections.singletonList("latest_invoice.payment_intent"))
                        .addAllDefaultTaxRate(taxesToCharge.stream().map(TaxRate::getId).collect(Collectors.toList()))
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
                Subscription subscription = Subscription.create(subCreateParams);
                dao.insertSubscription(auth.getAccountId(), subscription.getId(), price.getPriceId(), Instant.ofEpochSecond(subscription.getCurrentPeriodStart()), Instant.ofEpochSecond(subscription.getCurrentPeriodEnd()), SubscriptionStatus.ACTIVE.getStatus());
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
        return response;
    }

    @PUT
    @Path("/{id}")
    public Response updateSubscription(@Auth Account auth, SubscriptionUpdate update) {
        Response response = Response.ok().build();
        if (update.getCancelAtPeriodEnd() != null) {
            Stripe.apiKey = stripeApiKey;
            String stripeSubId = dao.findStripeSubId(auth.getAccountId());
            if (stripeSubId != null) {
                try {
                    Subscription subscription = Subscription.retrieve(stripeSubId);
                    SubscriptionUpdateParams params = SubscriptionUpdateParams.builder().setCancelAtPeriodEnd(update.getCancelAtPeriodEnd()).build();
                    subscription.update(params);
                    if (update.getCancelAtPeriodEnd()) {
                        dao.updateSubscriptionStatus(stripeSubId, SubscriptionStatus.CANCELED.getStatus());
                    } else {
                        dao.updateSubscriptionStatus(stripeSubId, SubscriptionStatus.ACTIVE.getStatus());
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
