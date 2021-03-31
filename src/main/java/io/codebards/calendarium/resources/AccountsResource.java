package io.codebards.calendarium.resources;

import io.codebards.calendarium.api.AccountUpdate;
import io.codebards.calendarium.core.StripeService;
import io.codebards.calendarium.core.Account;
import io.codebards.calendarium.db.Dao;
import de.mkammerer.argon2.Argon2;
import io.dropwizard.auth.Auth;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
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
        // TODO: simplify all this
        Response response = Response.status(Response.Status.NOT_FOUND).build();
        if ((accountUpdate.getEmail() == null || accountUpdate.getEmail().equals("")) || (accountUpdate.getName() == null || accountUpdate.getName().equals(""))) {
            // Until we split this route, these values cannot be empty
            response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        } else {
            Optional<Account> oAccount = dao.findAccountByEmail(accountUpdate.getEmail());
            // Check if email was changed
            if (!accountUpdate.getEmail().equals(auth.getEmail())) {
                // Email was updated, validate that new email is available
                if (oAccount.isPresent()) {
                    // New email is already used in the database
                    response = Response.status(Response.Status.CONFLICT).build();
                } else {
                    if (accountUpdate.getCurrentPassword() != null) {
                        // Password was updated
                        String passwordDigest = dao.findPasswordDigest(auth.getAccountId());
                        if (argon2.verify(passwordDigest, accountUpdate.getCurrentPassword().toCharArray())) {
                            String newPasswordDigest = argon2.hash(2, 65536, 1, accountUpdate.getNewPassword().toCharArray());
                            dao.updateAccountAndPassword(auth.getAccountId(), accountUpdate.getEmail(), accountUpdate.getName(), accountUpdate.getLanguageId(), newPasswordDigest);
                            oAccount = dao.findAccountById(auth.getAccountId());
                            if (oAccount.isPresent()) {
                                // Set subscription information
                                oAccount.get().setSubscription(dao.findSubscriptionByAccountId(auth.getAccountId()));
                                response = Response.status(Response.Status.OK).entity(oAccount.get()).build();
                            }
                        } else {
                            response = Response.status(Response.Status.UNAUTHORIZED).build();
                        }
                    } else {
                        dao.updateAccount(auth.getAccountId(), accountUpdate.getEmail(), accountUpdate.getName(), accountUpdate.getLanguageId());
                        oAccount = dao.findAccountById(auth.getAccountId());
                        if (oAccount.isPresent()) {
                            // Set subscription information
                            oAccount.get().setSubscription(dao.findSubscriptionByAccountId(auth.getAccountId()));
                            response = Response.status(Response.Status.OK).entity(oAccount.get()).build();
                        }
                    }
                }
            } else {
                // Email is the same as before
                if (accountUpdate.getCurrentPassword() != null) {
                    // Password was updated
                    String passwordDigest = dao.findPasswordDigest(auth.getAccountId());
                    if (argon2.verify(passwordDigest, accountUpdate.getCurrentPassword().toCharArray())) {
                        String newPasswordDigest = argon2.hash(2, 65536, 1, accountUpdate.getNewPassword().toCharArray());
                        dao.updateAccountAndPassword(auth.getAccountId(), auth.getEmail(), accountUpdate.getName(), accountUpdate.getLanguageId(), newPasswordDigest);
                        oAccount = dao.findAccountById(auth.getAccountId());
                        if (oAccount.isPresent()) {
                            // Set subscription information
                            oAccount.get().setSubscription(dao.findSubscriptionByAccountId(auth.getAccountId()));
                            response = Response.status(Response.Status.OK).entity(oAccount.get()).build();
                        }
                    } else {
                        response = Response.status(Response.Status.UNAUTHORIZED).build();
                    }
                } else {
                    dao.updateAccount(auth.getAccountId(), auth.getEmail(), accountUpdate.getName(), accountUpdate.getLanguageId());
                    oAccount = dao.findAccountById(auth.getAccountId());
                    if (oAccount.isPresent()) {
                        // Set subscription information
                        oAccount.get().setSubscription(dao.findSubscriptionByAccountId(auth.getAccountId()));
                        response = Response.status(Response.Status.OK).entity(oAccount.get()).build();
                    }
                }
            }
        }

        return response;
    }

}
