package io.codebards.calendarium.resources;

import de.mkammerer.argon2.Argon2;
import io.codebards.calendarium.api.AccountToken;
import io.codebards.calendarium.api.PasswordReset;
import io.codebards.calendarium.api.SignUp;
import io.codebards.calendarium.core.Account;
import io.codebards.calendarium.core.EmailManager;
import io.codebards.calendarium.core.Utils;
import io.codebards.calendarium.db.Dao;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {
    private final Dao dao;
    private final Argon2 argon2;
    private final EmailManager emailManager;

    public AuthResource(Dao dao, Argon2 argon2, EmailManager emailManager) {
        this.dao = dao;
        this.argon2 = argon2;
        this.emailManager = emailManager;
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
