package io.codebards.calendarium.resources;

import java.lang.StackWalker.Option;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import io.codebards.calendarium.api.AccountToken;
import io.codebards.calendarium.api.CalendarAccess;
import io.codebards.calendarium.api.CalendarAccessStatus;
import io.codebards.calendarium.api.CalendarCollaborator;
import io.codebards.calendarium.api.InvitationResponse;
import io.codebards.calendarium.core.EmailManager;
import io.codebards.calendarium.core.Utils;
import io.codebards.calendarium.core.Account;
import io.codebards.calendarium.db.Dao;
import de.mkammerer.argon2.Argon2;
import io.dropwizard.auth.Auth;

@Path("/calendar_collaborators")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CalendarCollaboratorsResource {
    private final Dao dao;
    private final Argon2 argon2;
    private final EmailManager emailManager;

    public CalendarCollaboratorsResource(Dao dao, Argon2 argon2, EmailManager emailManager) {
        this.dao = dao;
        this.argon2 = argon2;
        this.emailManager = emailManager;
    }

    @GET
    @RolesAllowed({ "SUBSCRIBER" })
    @Path("/{calendarId}")
    public List<CalendarCollaborator> getCalendarCollaborators(@Auth Account auth, @PathParam("calendarId") long calendarId) {
        // TODO: check user has the right to see the collaborators of this calendar
        return dao.findCalendarCollaboratorsByCalendar(calendarId);
    }

    @POST
    @RolesAllowed({ "SUBSCRIBER" })
    @Path("/{calendarId}")
    public Response inviteCalendarCollaborator(@Auth Account auth, @PathParam("calendarId") long calendarId, CalendarCollaborator calendarCollaborator) {
        Response response;

        // check if account already exists
        Optional<Account> oAccount = dao.findAccountByEmail(calendarCollaborator.getEmail());
        long accountId;
        if (oAccount.isPresent()) {
            // if account exists, get its account id
            accountId = oAccount.get().getAccountId();
        } else {
            // if account doesn't exist, create it, with the language of the account that is
            // inviting and a null password
            accountId = dao.insertAccount(calendarCollaborator.getEmail(), calendarCollaborator.getName(), auth.getLanguageId(), null);
        }

        // check if account already is a collaborator on that calendar
        Optional<CalendarCollaborator> oCalendarCollaborator = dao.findCalendarCollaboratorByAccountId(calendarId, accountId);
        if (oCalendarCollaborator.isPresent()) {
            // if it is already there, return an error
            response = Response.status(Response.Status.CONFLICT).build();
        } else {
            // else create a calendar access for this collaborator, with status invited, and send the invitation email
            long calendarAccessId = dao.insertCalendarAccess(accountId, calendarId, CalendarAccessStatus.INVITED.getStatus());
            emailManager.sendCalendarCollaboratorInvitation(oAccount, calendarAccessId, calendarId, auth.getAccountId());
            response = Response.status(Response.Status.CREATED).build();
        }
        return response;
    }

    @GET
    @Path("/{calendarId}/{calendarAccessId}")
    public Response getCalendarInvitation(@PathParam("calendarId") long calendarId, @PathParam("calendarAccessId") long calendarAccessId) {
        Response response = Response.status(Response.Status.NOT_FOUND).build();
        Optional<CalendarAccess> oCalendarAccess = dao.findCalendarAccessByCalendarAccessIdAndCalendarId(calendarAccessId, calendarId);
        if (oCalendarAccess.isPresent()) {
            response = Response.ok(oCalendarAccess.get()).build();
        }
        return response;
    }

    @PUT
    @Path("/{calendarId}/{calendarAccessId}")
    public Response acceptCalendarInvitation(InvitationResponse invitationResponse) {
        Response response = Response.status(Response.Status.OK).build();
        // TODO: implement failure checks and adjust response accordingly
        Optional<Account> oAccount = dao.findAccountById(invitationResponse.getAccountId());
        // if password is provided, update account password and sign in
        if (!invitationResponse.getPassword().isEmpty()) {
            if (oAccount.isPresent()) {
                String passwordDigest = argon2.hash(2, 65536, 1, invitationResponse.getPassword().toCharArray());
                dao.updateAccountAndPassword(oAccount.get().getAccountId(), oAccount.get().getEmail(), oAccount.get().getName(), oAccount.get().getLanguageId(), passwordDigest);
                String token = createToken(oAccount.get().getAccountId());
                if (token != null) {
                    AccountToken accountToken = new AccountToken(oAccount.get().getAccountId(), token);
                    response = Response.status(Response.Status.OK).entity(accountToken).build();
                } else {
                    response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
                }
            }
        }
        // change calendar access status to active
        dao.acceptCalendarInvitation(invitationResponse.getCalendarAccessId(), invitationResponse.getCalendarId());
        // send email that invitation is accepted to calendar owner
        emailManager.sendCalendarInvitationAccepted(oAccount, invitationResponse.getCalendarId(), dao.findCalendarOwnerAccountId(invitationResponse.getCalendarId()));

        return response;
    }

    // TODO: centralise this function (also used in AuthResource.java)
    private String createToken(long accountId) {
        String token = null;
        try {
            token = Utils.getToken();
            String selector = token.substring(0, 16);
            String verifier = token.substring(16);
            String validator = Utils.getHash(verifier);
            dao.insertAccountToken(selector, validator, Instant.now(), accountId);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return token;
    }
}
