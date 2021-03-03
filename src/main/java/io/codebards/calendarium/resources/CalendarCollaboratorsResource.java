package io.codebards.calendarium.resources;

import java.util.List;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

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
    public List<CalendarCollaborator> getCalendarAccesses(@Auth Account auth, @PathParam("calendarId") long calendarId) {
        return dao.findCalendarCollaboratorsByCalendar(auth.getAccountId(), calendarId);
    }

}
