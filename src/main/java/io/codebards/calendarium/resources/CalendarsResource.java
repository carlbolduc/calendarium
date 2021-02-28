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
import java.util.Optional;

@RolesAllowed({ "USER" })
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

    @GET
    @Path("/{link}")
    public Response getCalendar(@Auth Account auth, @PathParam("link") String link) {
        Response response = Response.status(Response.Status.NOT_FOUND).build();
        Optional<Calendar> oCalendar = dao.findCalendarByLink(auth.getAccountId(), link);
        if (oCalendar.isPresent()) {
            response = Response.ok(oCalendar.get()).build();
        }
        return response;
    }

    @POST
    @RolesAllowed({ "SUBSCRIBER" })
    public Response createCalendar(@Auth Account auth, Calendar calendar) {
        long calendarId = dao.insertCalendar(auth.getAccountId(), calendar);
        dao.insertCalendarAccess(auth.getAccountId(), calendarId, CalendarAccessStatus.OWNER.getStatus());
        return Response.noContent().build();
    }

    @PUT
    @RolesAllowed({ "SUBSCRIBER" })
    @Path("/{calendarId}")
    // TODO: do this only if the account is calendar owner
    public Response updateCalendar(@Auth Account auth, @PathParam("calendarId") long calendarId, Calendar calendar) {
        Response response = Response.status(Response.Status.NOT_FOUND).build();
        dao.updateCalendar(auth.getAccountId(), calendarId, calendar);
        Optional<Calendar> oCalendar = dao.findCalendarByLink(auth.getAccountId(), calendar.getLinkEn());
        if (oCalendar.isPresent()) {
            response = Response.ok(oCalendar.get()).build();
        }
        return response;
    }

    @DELETE
    @RolesAllowed({ "SUBSCRIBER" })
    @Path("/{calendarId}")
    // TODO: do this only if the account is calendar owner
    public Response deleteCalendar(@Auth Account auth, @PathParam("calendarId") long calendarId) {
        // TODO: start by deleting calendar accesses
        dao.deleteCalendar(auth.getAccountId(), calendarId);
        return Response.noContent().build();
    }    
}
