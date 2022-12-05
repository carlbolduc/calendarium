package io.codebards.calendarium.resources;

import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentMethod;
import com.stripe.model.Subscription;
import com.stripe.param.SubscriptionCreateParams;
import de.mkammerer.argon2.Argon2;
import io.codebards.calendarium.api.*;
import io.codebards.calendarium.core.Account;
import io.codebards.calendarium.core.EmailManager;
import io.codebards.calendarium.core.StripeService;
import io.codebards.calendarium.core.Utils;
import io.codebards.calendarium.db.Dao;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {
    private final Dao dao;
    private final Argon2 argon2;
    private final EmailManager emailManager;
    private final StripeService stripeService;

    public AuthResource(Dao dao, Argon2 argon2, EmailManager emailManager, StripeService stripeService) {
        this.dao = dao;
        this.argon2 = argon2;
        this.emailManager = emailManager;
        this.stripeService = stripeService;
    }

    @POST
    @Path("/sign-up-validation")
    public Response signUpValidation(SignUp signUp) {
        Response response;
        Optional<Account> oAccount = dao.findAccountByEmail(signUp.getEmail());
        if (oAccount.isPresent()) {
            response = Response.status(Response.Status.CONFLICT).build();
        } else {
            response = Response.ok().build();
        }
        return response;
    }

    @POST
    @Path("/sign-up-and-subscribe")
    public Response signUpAndSubscribe(PaidSignUp paidSignUp) {
        Response response;
        Optional<Account> oAccount = dao.findAccountByEmail(paidSignUp.getSignUp().getEmail());
        if (oAccount.isPresent()) {
            response = Response.status(Response.Status.CONFLICT).build();
        } else {
            // Create the Calendarium account
            String passwordDigest = argon2.hash(2, 65536, 1, paidSignUp.getSignUp().getPassword().toCharArray());
            long accountId = dao.insertAccount(paidSignUp.getSignUp().getEmail(), paidSignUp.getSignUp().getName(), paidSignUp.getSignUp().getLanguageId(), passwordDigest, 0);
            String token = createToken(accountId);
            if (token != null) {
                AccountToken accountToken = new AccountToken(accountId, token);
                // Create the Stripe customer
                try {
                    Customer customer = stripeService.createCustomer(paidSignUp.getSignUp().getEmail(), paidSignUp.getSignUp().getName());
                    dao.setStripeCusId(accountId, customer.getId());
                    // Set the default payment method on the customer
                    PaymentMethod paymentMethod = stripeService.setPaymentMethod(customer, paidSignUp.getPaymentMethodDetails().getId());
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
                    dao.insertSubscription(accountId, subscription.getId(), price.getPriceId(), Math.toIntExact(subscription.getCurrentPeriodStart()), Math.toIntExact(subscription.getCurrentPeriodEnd()), SubscriptionStatus.ACTIVE.getStatus(), accountId);
                    if (subscription.getLatestInvoiceObject().getPaymentIntentObject().getStatus().equals(PaymentIntentStatus.SUCCEEDED.getStatus())) {
                        // TODO: It worked, check what we must return to client
                        // Check with Stripe if it's possible to get a subscription that is not succeeded when we reach this step
                    }
                    response = Response.ok(accountToken).build();
                } catch (StripeException e) {
                    // Stripe failed to create the customer, client should ask the customer to retry
                    response = Response.serverError().build();
                }
            } else {
                response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
            }
        }
        return response;
    }

    @POST
    @Path("/sign-up")
    public Response signUp(SignUp signUp) {
        Response response;
        Optional<Account> oAccount = dao.findAccountByEmail(signUp.getEmail());
        if (oAccount.isPresent()) {
            response = Response.status(Response.Status.CONFLICT).build();
        } else {
            String passwordDigest = argon2.hash(2, 65536, 1, signUp.getPassword().toCharArray());
            long accountId = dao.insertAccount(signUp.getEmail(), signUp.getName(), signUp.getLanguageId(), passwordDigest, 0);
            String token = createToken(accountId);
            if (token != null) {
                AccountToken accountToken = new AccountToken(accountId, token);
                Instant now = Instant.now();
                Instant in30Days = LocalDateTime.from(now.atZone(ZoneId.of("UTC"))).plusDays(30).atZone(ZoneId.of("UTC")).toInstant();
                Price price = dao.findPrice(0);
                // Create the trial
                dao.insertSubscription(accountId, null, price.getPriceId(), Math.toIntExact(now.getEpochSecond()), Math.toIntExact(in30Days.getEpochSecond()), SubscriptionStatus.ACTIVE.getStatus(), accountId);
                response = Response.status(Response.Status.CREATED).entity(accountToken).build();
            } else {
                response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
            }
        }
        return response;
    }

    @GET
    @Path("/sign-in")
    public Response signIn(@HeaderParam("Authorization") String authorization) {
        Response response = Response.status(Response.Status.UNAUTHORIZED).build();
        if (authorization != null && authorization.startsWith("Basic")) {
            String base64Credentials = authorization.substring("Basic".length()).trim();
            String credentials = new String(Base64.getDecoder().decode(base64Credentials), StandardCharsets.UTF_8);
            final String[] loginDetails = credentials.split(":", 2);
            final char[] password = loginDetails[1].toCharArray();
            Optional<Account> oAccount = dao.findAccountByEmail(loginDetails[0]);
            if (oAccount.isPresent()) {
                if (oAccount.get().getEmail().equalsIgnoreCase(loginDetails[0]) && argon2.verify(oAccount.get().getPasswordDigest(), password)) {
                    String token = createToken(oAccount.get().getAccountId());
                    if (token != null) {
                        AccountToken accountToken = new AccountToken(oAccount.get().getAccountId(), token);
                        response = Response.status(Response.Status.OK).entity(accountToken).build();
                    } else {
                        response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
                    }
                }
            }
        }
        return response;
    }

    @POST
    @Path("/password-resets")
    public Response createPasswordReset(Account account) {
        Response response = Response.status(Response.Status.CREATED).build();
        Optional<Account> oAccount = dao.findAccountByEmail(account.getEmail());
        if (oAccount.isPresent()) {
            try {
                String passwordResetDigest = Utils.createDigest();
                dao.updatePasswordResetDigest(oAccount.get().getAccountId(), passwordResetDigest, Math.toIntExact(Instant.now().getEpochSecond()));
                emailManager.sendResetPasswordEmail(oAccount, passwordResetDigest);
            } catch (NoSuchAlgorithmException e) {
                e.printStackTrace();
                response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
            }
        }
        return response;
    }

    @PUT
    @Path("/password-resets/{id}")
    public Response resetPassword(PasswordReset passwordReset) {
        Response response = Response.status(Response.Status.NOT_FOUND).build();
        Optional<Account> oAccount = dao.findAccountByPasswordReset(passwordReset.getId());
        if (oAccount.isPresent()
                && oAccount.get().getPasswordResetDigest().equals(passwordReset.getId())
                && (Instant.now().getEpochSecond() - oAccount.get().getPasswordResetRequestedAt()) < 86400) {
            String token = createToken(oAccount.get().getAccountId());
            if (token != null) {
                String passwordDigest = argon2.hash(2, 65536, 1, passwordReset.getPassword().toCharArray());
                dao.updatePasswordDigest(oAccount.get().getAccountId(), passwordDigest, 0);
                AccountToken accountToken = new AccountToken(oAccount.get().getAccountId(), token);
                response = Response.status(Response.Status.OK).entity(accountToken).build();
            } else {
                response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
            }
        }
        return response;
    }

    // TODO: centralise this function (also used in CollaboratorsResource.java)
    private String createToken(long accountId) {
        String token = null;
        try {
            token = Utils.getToken();
            String selector = token.substring(0, 16);
            String verifier = token.substring(16);
            String validator = Utils.getHash(verifier);
            dao.insertAccountToken(selector, validator, Math.toIntExact(Instant.now().getEpochSecond()), accountId);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return token;
    }

}
