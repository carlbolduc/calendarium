package io.codebards.calendarium.resources;

import io.codebards.calendarium.api.AccountData;
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
            response = Response.status(Response.Status.OK).entity(oAccount.get()).build();
        }
        return response;
    }

    @PUT
    @Path("/{accountId}")
    public Response putAccount(@Auth Account auth, AccountData data) {
        Response response = Response.status(Response.Status.NOT_FOUND).build();
        String passwordDigest = argon2.hash(2, 65536, 1, data.getPassword().toCharArray());
        dao.updateAccount(auth.getAccountId(), data.getEmail(), data.getName(), data.getLanguageId(), passwordDigest);
        Optional<Account> oAccount = dao.findAccountById(auth.getAccountId());
        if (oAccount.isPresent()) {
            response = Response.status(Response.Status.OK).entity(oAccount.get()).build();
        }
        return response;
    }

}
