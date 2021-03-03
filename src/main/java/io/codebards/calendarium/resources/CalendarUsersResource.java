package io.codebards.calendarium.resources;

import java.util.List;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

import io.codebards.calendarium.api.CalendarUser;
import io.codebards.calendarium.core.Account;
import io.codebards.calendarium.db.Dao;
import io.dropwizard.auth.Auth;

@RolesAllowed({ "USER" })
@Path("/calendar_users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CalendarUsersResource {
    
    private final Dao dao;

    public CalendarUsersResource(Dao dao) {
        this.dao = dao;
    }

    @GET
    @RolesAllowed({ "SUBSCRIBER" })
    @Path("/{calendarId}")
    public List<CalendarUser> getCalendarAccesses(@Auth Account auth, @PathParam("calendarId") long calendarId) {
        return dao.findCalendarUsersByCalendar(auth.getAccountId(), calendarId);
    }

}
