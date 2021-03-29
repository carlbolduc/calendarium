package io.codebards.calendarium.resources;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import io.codebards.calendarium.api.*;
import io.codebards.calendarium.core.Account;
import io.codebards.calendarium.db.Dao;
import io.dropwizard.auth.Auth;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RolesAllowed({"USER"})
@Path("/events")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EventsResource {
    private final Dao dao;

    public EventsResource(Dao dao) {
        this.dao = dao;
    }

    @GET
    public List<Event> getEvents(@Auth Account auth) {
        return dao.findEventsByAccount(auth.getAccountId());
    }

    @POST
    public Response createEvent(@Auth Account auth, Event event) {
        Response response;
        // Validate that only owner and active accesses on the calendar can create events
        List<CalendarAccess> calendarAccesses = dao.findActiveCalendarAccesses(auth.getAccountId());
        Optional<CalendarAccess> oCalendarAccess = calendarAccesses.stream().filter(ca -> ca.getCalendarId() == event.getCalendarId()).findAny();
        if (oCalendarAccess.isPresent()) {
            event.setAccountId(auth.getAccountId());
            dao.insertEvent(event);
            // event created, return 200 OK
            response = Response.ok().build();
        } else {
            // the account isn't owner or active on the calendar, return 401 Unauthorized
            response = Response.status(Response.Status.UNAUTHORIZED).build();
        }
        return response;
    }

    @PUT
    @Path("/{eventId}")
    public Response updateEvent(@Auth Account auth, Event event) {
        // default response to return is 401 Unauthorized
        Response response = Response.status(Response.Status.UNAUTHORIZED).build();
        Optional<Event> oEvent = dao.findEvent(event.getEventId());
        if (oEvent.isPresent()) {
            // Event exists
            List<CalendarAccess> calendarAccesses = dao.findCalendarAccesses(auth.getAccountId());
            Optional<CalendarAccess> oCalendarAccess = calendarAccesses.stream().filter(ca -> ca.getCalendarId() == oEvent.get().getCalendarId()).findFirst();
            if (oEvent.get().getCalendarId() == event.getCalendarId()) {
                if (oCalendarAccess.isPresent()) {
                    // Account has access to the original event's calendar and the calendar was not modified
                    // may return 200 OK or 401 Unauthorized
                    response = updateEventIfPossible(oCalendarAccess.get(), event);
                }
            } else if (oCalendarAccess.isPresent()) {
                // Before anything, make sure account has the access in the original calendar of the event
                List<String> statuses = Arrays.asList(CalendarAccessStatus.OWNER.getStatus(), CalendarAccessStatus.ACTIVE.getStatus());
                if (statuses.contains(oCalendarAccess.get().getStatus())) {
                    // Account has access to the original event's calendar and the calendar was modified
                    oCalendarAccess = calendarAccesses.stream().filter(ca -> ca.getCalendarId() == event.getCalendarId()).findFirst();
                    if (oCalendarAccess.isPresent()) {
                        // Account has access to the new event's calendar
                        // may return 200 OK or 401 Unauthorized
                        response = updateEventIfPossible(oCalendarAccess.get(), event);
                    }
                }
            }
        } else {
            // event does not exist, return 404 Not Found
            response = Response.status(Response.Status.NOT_FOUND).build();
        }
        return response;
    }

    @DELETE
    @Path("/{eventId}")
    public Response deleteEvent(@Auth Account auth, @PathParam("eventId") long eventId) {
        // default response to return is 401 Unauthorized
        Response response = Response.status(Response.Status.UNAUTHORIZED).build();
        Optional<Event> oEvent = dao.findEvent(eventId);
        if (oEvent.isPresent()) {
            // Event exists
            if (oEvent.get().getAccountId() == auth.getAccountId()) {
                // Event owner can delete their own events
                dao.deleteEvent(eventId);
                // event deleted, return 200 OK
                response = Response.ok().build();
            } else {
                List<CalendarAccess> calendarAccesses = dao.findCalendarAccesses(auth.getAccountId());
                Optional<CalendarAccess> oCalendarAccess = calendarAccesses.stream().filter(ca -> ca.getCalendarId() == oEvent.get().getCalendarId()).findFirst();
                if (oCalendarAccess.isPresent() && oCalendarAccess.get().getStatus().equals(CalendarAccessStatus.OWNER.getStatus())) {
                    // Calendar owner can delete any event in their calendar
                    dao.deleteEvent(eventId);
                    // event deleted, return 200 OK
                    response = Response.ok().build();
                }
            }
        } else {
            // event does not exist, return 404 Not Found
            response = Response.status(Response.Status.NOT_FOUND).build();
        }
        return response;
    }

    @GET
    @Path("/search")
    public List<Event> searchEvents(@Auth Account auth, @QueryParam("q") String q) {
        List<Event> events = new ArrayList<>();

        String decodedQuery = new String(Base64.getDecoder().decode(q), StandardCharsets.UTF_8);
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());

        try {
            EventsParams eventsParams = mapper.readValue(decodedQuery, EventsParams.class);
            if (eventsParams.getCalendarId() == null) {
                // Search for all events
                events = dao.findEvents(eventsParams);
            } else {
                List<CalendarAccess> calendarAccesses = dao.findCalendarAccesses(auth.getAccountId());
                Optional<CalendarAccess> oCalendarAccess = calendarAccesses.stream().filter(ca -> ca.getCalendarId() == eventsParams.getCalendarId()).findAny();
                if (oCalendarAccess.isPresent()) {
                    // Search for calendar events
                    if (oCalendarAccess.get().getStatus().equals(CalendarAccessStatus.OWNER.getStatus())) {
                        events = dao.findAllCalendarEvents(eventsParams, eventsParams.getStartAt());
                    } else {
                        events = dao.findAccountCalendarEvents(auth.getAccountId(), eventsParams);
                    }
                }
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return events;
    }

    private Response updateEventIfPossible(CalendarAccess calendarAccess, Event event) {
        // default response to return is 401 Unauthorized
        Response response = Response.status(Response.Status.UNAUTHORIZED).build();
        if (calendarAccess.getStatus().equals(CalendarAccessStatus.OWNER.getStatus())) {
            // We can update the event
            dao.updateEvent(event);
            // event updated, return 200 OK
            response = Response.ok().build();
        } else if (calendarAccess.getStatus().equals(CalendarAccessStatus.ACTIVE.getStatus())) {
            dao.updateEvent(event);
            // event updated, return 200 OK
            response = Response.ok().build();
        }
        return response;
    }

}
