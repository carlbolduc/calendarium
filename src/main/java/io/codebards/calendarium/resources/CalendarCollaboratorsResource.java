package io.codebards.calendarium.resources;

import java.util.List;
import java.util.Optional;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import io.codebards.calendarium.api.CalendarAccessStatus;
import io.codebards.calendarium.api.CalendarCollaborator;
import io.codebards.calendarium.core.Account;
import io.codebards.calendarium.db.Dao;
import io.dropwizard.auth.Auth;

@RolesAllowed({ "USER" })
@Path("/calendar_collaborators")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CalendarCollaboratorsResource {

    private final Dao dao;

    public CalendarCollaboratorsResource(Dao dao) {
        this.dao = dao;
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
            // else create a calendar access for this collaborator, with status invited
            dao.insertCalendarAccess(accountId, calendarId, CalendarAccessStatus.INVITED.getStatus());
            response = Response.status(Response.Status.CREATED).build();
        }
        return response;
    }

}