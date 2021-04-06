package io.codebards.calendarium.resources;

import io.codebards.calendarium.api.AccountUpdate;
import io.codebards.calendarium.api.LanguageUpdate;
import io.codebards.calendarium.api.PasswordUpdate;
import io.codebards.calendarium.core.StripeService;
import io.codebards.calendarium.core.Account;
import io.codebards.calendarium.db.Dao;
import de.mkammerer.argon2.Argon2;
import io.dropwizard.auth.Auth;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.stripe.exception.StripeException;

import java.util.Optional;

@RolesAllowed({"USER"})
@Path("/accounts")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AccountsResource {
    private final Dao dao;
    private final Argon2 argon2;
    private final StripeService stripeService;

    public AccountsResource(Dao dao, Argon2 argon2, StripeService stripeService) {
        this.dao = dao;
        this.argon2 = argon2;
        this.stripeService = stripeService;
    }

    @GET
    public Response getAccount(@Auth Account auth) {
        Response response = Response.status(Response.Status.NOT_FOUND).build();
        Optional<Account> oAccount = dao.findAccountById(auth.getAccountId());
        if (oAccount.isPresent()) {
            // Set subscription information
            oAccount.get().setSubscription(dao.findSubscriptionByAccountId(auth.getAccountId()));
            response = Response.status(Response.Status.OK).entity(oAccount.get()).build();
        }
        return response;
    }

    @PUT
    @Path("/{accountId}")
    public Response putAccount(@Auth Account auth, AccountUpdate accountUpdate) {
        Response response = Response.status(Response.Status.CONFLICT).build();;
        boolean canUpdate = true;
        if (!accountUpdate.getEmail().equals(auth.getEmail())) {
            // Trying to update email, we check first if email is available
            Optional<Account> oAccount = dao.findAccountByEmail(accountUpdate.getEmail());
            if (oAccount.isPresent()) {
                canUpdate = false;
            }
        }
        if (canUpdate) {
            dao.updateAccount(auth.getAccountId(), accountUpdate.getEmail(), accountUpdate.getName(), auth.getAccountId());
            try {
                stripeService.updateCustomer(auth.getStripeCusId(), auth.getEmail(), accountUpdate.getName());
            } catch (StripeException e) {
                // TODO customer could not be updated in stripe, we should log this somewhere
            }
            response = Response.ok().entity(buildAccount(auth.getAccountId())).build();
        }
        return response;
    }

    @PUT
    @Path("/{accountId}/language")
    public Account putAccountPassword(@Auth Account auth, LanguageUpdate languageUpdate) {
        dao.updateAccountLanguage(auth.getAccountId(), languageUpdate.getLanguageId());
        return buildAccount(auth.getAccountId());
    }

    @PUT
    @Path("/{accountId}/password")
    public Response putAccountPassword(@Auth Account auth, PasswordUpdate passwordUpdate) {
        Response response = Response.status(Response.Status.UNAUTHORIZED).build();
        String passwordDigest = dao.findPasswordDigest(auth.getAccountId());
        if (argon2.verify(passwordDigest, passwordUpdate.getCurrentPassword().toCharArray())) {
            String newPasswordDigest = argon2.hash(2, 65536, 1, passwordUpdate.getNewPassword().toCharArray());
            dao.updateAccountPassword(auth.getAccountId(), newPasswordDigest);
            response = Response.noContent().build();
        }
        return response;
    }

    // Only use this if you validated first that the account exists in the database
    private Account buildAccount(long accountId) {
        Account account = dao.findAccount(accountId);
        account.setSubscription(dao.findSubscriptionByAccountId(accountId));
        return account;
    }

}
