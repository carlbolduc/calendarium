package io.codebards.calendarium.resources;

import io.codebards.calendarium.api.SignUp;
import io.codebards.calendarium.api.PasswordReset;
import io.codebards.calendarium.api.UserAccountToken;
import io.codebards.calendarium.core.EmailManager;
import io.codebards.calendarium.core.UserAccount;
import io.codebards.calendarium.core.Utils;
import io.codebards.calendarium.db.Dao;
import de.mkammerer.argon2.Argon2;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
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
        Optional<UserAccount> oUserAccount = dao.findUserAccountByEmail(signUp.getEmail());
        if (oUserAccount.isPresent()) {
            response = Response.status(Response.Status.CONFLICT).build();
        } else {
            String passwordDigest = argon2.hash(2, 65536, 1, signUp.getPassword().toCharArray());
            long userAccountId = dao.insertUserAccount(signUp.getEmail(), signUp.getName(), passwordDigest);
            String token = createToken(userAccountId);
            if (token != null) {
                UserAccountToken userAccountToken = new UserAccountToken(userAccountId, token);
                response = Response.status(Response.Status.CREATED).entity(userAccountToken).build();
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
            Optional<UserAccount> oUserAccount = dao.findUserAccountByEmail(loginDetails[0]);
            if (oUserAccount.isPresent()) {
                if (oUserAccount.get().getEmail().equalsIgnoreCase(loginDetails[0]) && argon2.verify(oUserAccount.get().getPasswordDigest(), password)) {
                    String token = createToken(oUserAccount.get().getUserAccountId());
                    if (token != null) {
                        UserAccountToken userAccountToken = new UserAccountToken(oUserAccount.get().getUserAccountId(), token);
                        response = Response.status(Response.Status.OK).entity(userAccountToken).build();
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
    public Response createPasswordReset(UserAccount userAccount) {
        Response response = Response.status(Response.Status.NOT_FOUND).build();
        Optional<UserAccount> oUserAccount = dao.findUserAccountByEmail(userAccount.getEmail());
        if (oUserAccount.isPresent()) {
            try {
                String passwordResetDigest = Utils.createDigest();
                dao.updatePasswordResetDigest(oUserAccount.get().getUserAccountId(), passwordResetDigest, Instant.now());
                emailManager.sendResetPasswordEmail(oUserAccount.get().getEmail(), oUserAccount.get().getName(), passwordResetDigest);
                response = Response.status(Response.Status.CREATED).build();
            } catch (NoSuchAlgorithmException e) {
                e.printStackTrace();
                response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
            }
        }
        return response;
    }

    @PUT
    @Path("/password-resets/{digest}")
    public Response resetPassword(PasswordReset passwordReset) {
        Response response = Response.status(Response.Status.NOT_FOUND).build();
        Optional<UserAccount> oUserAccount = dao.findUserAccountByEmail(passwordReset.getEmail());
        if (oUserAccount.isPresent()
                && oUserAccount.get().getPasswordResetDigest().equals(passwordReset.getDigest())
                && Duration.between(oUserAccount.get().getPasswordResetRequestedAt(), Instant.now()).getSeconds() < 86400) {
            String passwordDigest = argon2.hash(2, 65536, 1, passwordReset.getPassword().toCharArray());
            dao.updatePasswordDigest(oUserAccount.get().getUserAccountId(), passwordDigest);
            String token = createToken(oUserAccount.get().getUserAccountId());
            if (token != null) {
                UserAccountToken userAccountToken = new UserAccountToken(oUserAccount.get().getUserAccountId(), token);
                response = Response.status(Response.Status.OK).entity(userAccountToken).build();
            } else {
                response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
            }

        }
        return response;
    }

    private String createToken(long userAccountId) {
        String token = null;
        try {
            token = Utils.getToken();
            String selector = token.substring(0, 16);
            String verifier = token.substring(16);
            String validator = Utils.getHash(verifier);
            dao.insertUserAccountToken(selector, validator, Instant.now(), userAccountId);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return token;
    }

}
