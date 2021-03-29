package io.codebards.calendarium.resources;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import io.codebards.calendarium.api.*;
import io.codebards.calendarium.core.Account;
import io.codebards.calendarium.db.Dao;
import io.dropwizard.auth.Auth;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

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
    @RolesAllowed({ "USER" })
    @Path("/{link}")
    public Response getCalendar(@Auth Account auth, @PathParam("link") String link) {
        Response response = Response.status(Response.Status.NOT_FOUND).build();
        Optional<Calendar> oCalendar = dao.findCalendarByLink(auth.getAccountId(), link);
        if (oCalendar.isPresent()) {
            response = Response.ok(oCalendar.get()).build();
        }
        return response;
    }

    @GET
    @Path("/anonymous/{link}")
    public Response getAnonymousCalendar(@PathParam("link") String link, @QueryParam("id") long id) {
        Response response = Response.status(Response.Status.NOT_FOUND).build();
        Optional<Calendar> oCalendar = dao.findAnonymousCalendar(link, id);
        if (oCalendar.isPresent()) {
            response = Response.ok(oCalendar.get()).build();
        }
        return response;
    }

    @POST
    @RolesAllowed({ "SUBSCRIBER" })
    // TODO: add validation if calendar created correctly, and return a response that matches this result
    // TODO: when above todo is done, add appropriate messages in Message.js and show it in MyCalendars.js
    public Response createCalendar(@Auth Account auth, Calendar calendar) {
        long calendarId = dao.insertCalendar(auth.getAccountId(), calendar);
        dao.insertCalendarAccess(auth.getAccountId(), calendarId, CalendarAccessStatus.OWNER.getStatus());
        return Response.noContent().build();
    }

    @PUT
    @RolesAllowed({ "SUBSCRIBER" })
    @Path("/{calendarId}")
    public Response updateCalendar(@Auth Account auth, @PathParam("calendarId") long calendarId, Calendar calendar) {
        Response response;
        if (auth.getAccountId() == dao.findCalendarOwnerAccountId(calendarId)) {
            // the calendar owner is doing the action
            dao.updateCalendar(auth.getAccountId(), calendarId, calendar);
            Optional<Calendar> oCalendar = dao.findCalendarByLink(auth.getAccountId(), calendar.getLinkEn());
            if (oCalendar.isPresent()) {
                // the update went according to plan, return 200 OK
                response = Response.ok(oCalendar.get()).build();
            } else {
                // the calendar cannot be found after update, return 404 Not Found
                response = Response.status(Response.Status.NOT_FOUND).build();
            }
        } else {
            // it's not the calendar owner, return 401 Unauthorized
            response = Response.status(Response.Status.UNAUTHORIZED).build();
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

    @GET
    @RolesAllowed({ "USER" })
    @Path("/{calendarId}/events")
    public List<Event> getCalendarEvents(@Auth Account auth, @PathParam("calendarId") long calendarId, @QueryParam("q") String q) {
        List<Event> events = new ArrayList<>();

        List<CalendarAccess> calendarAccesses = dao.findCalendarAccesses(auth.getAccountId());
        Optional<CalendarAccess> oCalendarAccess = calendarAccesses.stream().filter(ca -> ca.getCalendarId() == calendarId).findAny();
        if (oCalendarAccess.isPresent()) {
            String decodedQuery = new String(Base64.getDecoder().decode(q), StandardCharsets.UTF_8);
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            try {
                CalendarEventsParams calendarEventsParams = mapper.readValue(decodedQuery, CalendarEventsParams.class);
                if (oCalendarAccess.get().getStatus().equals(CalendarAccessStatus.OWNER.getStatus())) {
                    events = dao.findCalendarOwnerEvents(calendarId, calendarEventsParams.getStartAt());
                } else if (oCalendarAccess.get().getStatus().equals(CalendarAccessStatus.ACTIVE.getStatus())) {
                    events = dao.findCalendarCollaboratorEvents(auth.getAccountId(), calendarId, calendarEventsParams.getStartAt());
                }
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }


        return events;
    }
}
