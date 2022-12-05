package io.codebards.calendarium.resources;

import de.mkammerer.argon2.Argon2;
import io.codebards.calendarium.api.*;
import io.codebards.calendarium.core.Account;
import io.codebards.calendarium.core.EmailManager;
import io.codebards.calendarium.core.Utils;
import io.codebards.calendarium.db.Dao;
import io.dropwizard.auth.Auth;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Path("/collaborators")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CollaboratorsResource {
    private final Dao dao;
    private final Argon2 argon2;
    private final EmailManager emailManager;

    public CollaboratorsResource(Dao dao, Argon2 argon2, EmailManager emailManager) {
        this.dao = dao;
        this.argon2 = argon2;
        this.emailManager = emailManager;
    }

    @GET
    @RolesAllowed({ "SUBSCRIBER" })
    @Path("/{calendarId}")
    public List<Collaborator> getCollaborators(@Auth Account auth, @PathParam("calendarId") long calendarId) {
        // TODO: check user has the right to see the collaborators of this calendar
        return dao.findCollaboratorsByCalendar(calendarId);
    }

    @POST
    @RolesAllowed({ "SUBSCRIBER" })
    @Path("/{calendarId}")
    public Response inviteCollaborator(@Auth Account auth, @PathParam("calendarId") long calendarId, Collaborator collaborator) {
        Response response;

        // check if account already exists
        Optional<Account> oAccount = dao.findAccountByEmail(collaborator.getEmail());
        long accountId;
        if (oAccount.isPresent()) {
            // if account exists, get its account id
            accountId = oAccount.get().getAccountId();
        } else {
            // if account doesn't exist, create it, with the language of the account that is
            // inviting and a null password
            Instant now = Instant.now();
            accountId = dao.insertAccount(collaborator.getEmail(), collaborator.getName(), auth.getLanguageId(), null, Math.toIntExact(now.getEpochSecond()), auth.getAccountId());
            oAccount = dao.findAccountById(accountId);
        }

        // check if account already is a collaborator on that calendar
        Optional<Collaborator> oCollaborator = dao.findCollaboratorByAccountId(calendarId, accountId);
        if (oCollaborator.isPresent()) {
            // if it is already there, return 409 Conflict
            response = Response.status(Response.Status.CONFLICT).build();
        } else {
            // else create a calendar access for this collaborator, with status invited, and send the invitation email
            long calendarAccessId = dao.insertCalendarAccess(accountId, calendarId, CalendarAccessStatus.INVITED.getStatus(), auth.getAccountId());
            emailManager.sendCollaboratorInvitation(oAccount, calendarAccessId, calendarId, auth.getAccountId());
            // TODO: implement email sending error in emailManager and return a response accordingly

            // invitation is sent, return 201 Created
            List<Collaborator> collaborators = dao.findCollaboratorsByCalendar(calendarId);
            response = Response.status(Response.Status.CREATED).entity(collaborators).build();
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
    @Path("/{calendarId}/accept_invitation/{calendarAccessId}")
    public Response acceptCalendarInvitation(InvitationResponse invitationResponse) {
        // default response to return is 200 OK
        Response response = Response.status(Response.Status.OK).build();
        Optional<Account> oAccount = dao.findAccountById(invitationResponse.getAccountId());
        // if password is provided, update account password and sign in
        if (!invitationResponse.getPassword().isEmpty()) {
            if (oAccount.isPresent()) {
                String passwordDigest = argon2.hash(2, 65536, 1, invitationResponse.getPassword().toCharArray());
                // TODO: check if we can use another method here
                dao.updateAccountAndPassword(oAccount.get().getAccountId(), oAccount.get().getEmail(), oAccount.get().getName(), oAccount.get().getLanguageId(), passwordDigest, oAccount.get().getAccountId());
                String token = createToken(oAccount.get().getAccountId());
                if (token != null) {
                    AccountToken accountToken = new AccountToken(oAccount.get().getAccountId(), token);
                    // invitation accepted, return 200 OK
                    response = Response.status(Response.Status.OK).entity(accountToken).build();
                } else {
                    // token could not be created, return 500 Internal Server Error
                    response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
                }
            }
        }
        // change calendar access status to active
        dao.acceptCalendarInvitation(invitationResponse.getCalendarAccessId(), invitationResponse.getCalendarId(), oAccount.get().getAccountId());
        // send email that invitation is accepted to calendar owner
        emailManager.sendCalendarInvitationAccepted(oAccount, invitationResponse.getCalendarId(), dao.findCalendarOwnerAccountId(invitationResponse.getCalendarId()));

        return response;
    }

    @PUT
    @Path("/{calendarId}/{calendarAccessId}")
    public Response putCalendarAccess(@Auth Account auth, @PathParam("calendarId") long calendarId, @PathParam("calendarAccessId") long calendarAccessId, String status) {
        // TODO: implement failure checks and adjust response accordingly
        dao.updateCalendarAccessStatus(calendarAccessId, calendarId, status, auth.getAccountId());
        List<Collaborator> collaborators = dao.findCollaboratorsByCalendar(calendarId);
        return Response.status(Response.Status.OK).entity(collaborators).build();
    }

    // TODO: centralise this function (also used in AuthResource.java)
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
