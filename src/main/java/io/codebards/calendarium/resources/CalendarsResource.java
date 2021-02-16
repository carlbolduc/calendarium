package io.codebards.calendarium.resources;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import io.codebards.calendarium.api.Calendar;
import io.codebards.calendarium.api.CalendarAccessStatus;
import io.codebards.calendarium.core.Account;
import io.codebards.calendarium.db.Dao;
import io.dropwizard.auth.Auth;

import java.net.URI;
import java.util.List;

@RolesAllowed({"USER"})
@Path("/calendars")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CalendarsResource {
    
    private final Dao dao;

    public CalendarsResource(Dao dao) {
        this.dao = dao;
    }

    @GET
    public List<Calendar> getCalendars(@Auth Account auth) {
        return dao.findCalendars(auth.getAccountId());
    }

    @POST
    @RolesAllowed({"SUBSCRIBER"})
    public Response createCalendar(@Auth Account auth, Calendar calendar) {
        long calendarId = dao.insertCalendar(auth.getAccountId(), calendar);
        dao.insertCalendarAccess(auth.getAccountId(), calendarId, CalendarAccessStatus.OWNER.getStatus());
        return Response.created(URI.create("/api/calendars/" + calendarId)).build();
    }
}
