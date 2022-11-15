package io.codebards.calendarium.resources;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import io.codebards.calendarium.api.*;
import io.codebards.calendarium.core.Account;
import io.codebards.calendarium.core.EventHelpers;
import io.codebards.calendarium.db.Dao;
import io.dropwizard.auth.Auth;

import java.nio.charset.StandardCharsets;
import java.time.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Path("/calendars")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CalendarsResource {

    private final Dao dao;
    private final EventHelpers eventHelpers;

    public CalendarsResource(Dao dao, EventHelpers eventHelpers) {
        this.dao = dao;
        this.eventHelpers = eventHelpers;
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
            if (oCalendar.get().getPublicCalendar()) {
                response = Response.ok(oCalendar.get()).build();
            } else {
                // Only owner and users with an active access can lookup this calendar
                List<CalendarAccess> calendarAccesses = dao.findCalendarAccesses(auth.getAccountId());
                Calendar calendar = oCalendar.get();
                Optional<CalendarAccess> oCalendarAccess = calendarAccesses
                    .stream()
                    .filter(ca -> ca.getCalendarId() == calendar.getCalendarId())
                    .findAny();
                if (
                    oCalendarAccess.isPresent() &&
                    (oCalendarAccess.get().getStatus().equals(CalendarAccessStatus.OWNER.getStatus()) ||
                     oCalendarAccess.get().getStatus().equals(CalendarAccessStatus.ACTIVE.getStatus()))
                ) {
                    response = Response.ok(oCalendar.get()).build();
                }
            }
        } else {
            // User might not have access and calendar may be public
            oCalendar = dao.findPublicCalendarByLink(link);
            if (oCalendar.isPresent()) {
                response = Response.ok(oCalendar.get()).build();
            }
        }
        return response;
    }

    // This route is for the calendar invitation only, it returns limited data about the calendar
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
    public Response createCalendar(@Auth Account auth, Calendar calendar) {
        Response response = Response.status(Status.CONFLICT).build();
        if (
            (calendar.getEnableEn() != null && !reservedWords().contains(calendar.getLinkEn())) &&
            (calendar.getEnableFr() != null && !reservedWords().contains(calendar.getLinkFr()))
        ) {
            try {
                calendar.setCreatedBy(auth.getAccountId());
                long calendarId = dao.insertCalendar(auth.getAccountId(), calendar);
                dao.insertCalendarAccess(auth.getAccountId(), calendarId, CalendarAccessStatus.OWNER.getStatus(), auth.getAccountId());
                response = Response.noContent().build();
            } catch (Exception e) {
                // Unique constraint will cause insert to fail
            }
        }
        return response;
    }

    @PUT
    @RolesAllowed({ "SUBSCRIBER" })
    @Path("/{calendarId}")
    public Response updateCalendar(@Auth Account auth, @PathParam("calendarId") long calendarId, Calendar calendar) {
        // the default response is for when the link is already in use, return 409 Conflict
        Response response = Response.status(Status.CONFLICT).build();
        if (auth.getAccountId() == dao.findCalendarOwnerAccountId(calendarId)) {
            // the calendar owner is doing the action
            if (
                (calendar.getEnableEn() != null && !reservedWords().contains(calendar.getLinkEn())) &&
                (calendar.getEnableFr() != null && !reservedWords().contains(calendar.getLinkFr()))
            ) {
                try {
                    calendar.setUpdatedBy(auth.getAccountId());
                    dao.updateCalendar(auth.getAccountId(), calendarId, calendar);
                    // check if calendar exists after update
                    String linkToUse;
                    if (calendar.getEnableEn()) {
                        linkToUse = calendar.getLinkEn();
                    } else {
                        linkToUse = calendar.getLinkFr();
                    }
                    Optional<Calendar> oCalendar = dao.findCalendarByLink(auth.getAccountId(), linkToUse);
                    if (oCalendar.isPresent()) {
                        // the update went according to plan, return 200 OK
                        response = Response.ok(oCalendar.get()).build();
                    } else {
                        // the calendar cannot be found after update, return 404 Not Found
                        response = Response.status(Response.Status.NOT_FOUND).build();
                    }   
                } catch (Exception e) {
                    // Unique constraint will cause insert to fail
                }
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

        Optional<Calendar> oCalendar = Optional.empty();
        if (oCalendarAccess.isEmpty()) {
            oCalendar = dao.findCalendar(calendarId);
        }

        if (oCalendarAccess.isPresent() || (oCalendar.isPresent() && oCalendar.get().getPublicCalendar())) {
            String decodedQuery = new String(Base64.getDecoder().decode(q), StandardCharsets.UTF_8);
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            try {
                CalendarEventsParams calendarEventsParams = mapper.readValue(decodedQuery, CalendarEventsParams.class);
                if (oCalendarAccess.isPresent()) {
                    if (oCalendarAccess.get().getStatus().equals(CalendarAccessStatus.OWNER.getStatus())) {
                        events = dao.findCalendarOwnerEvents(calendarId, calendarEventsParams.getStartAt());
                    } else if (oCalendarAccess.get().getStatus().equals(CalendarAccessStatus.ACTIVE.getStatus())) {
                        events = dao.findCollaboratorEvents(auth.getAccountId(), calendarId, calendarEventsParams.getStartAt());
                    } else if (oCalendarAccess.get().getStatus().equals(CalendarAccessStatus.INVITED.getStatus())) {
                        // Collaborator is invited but has yet to create content, show them published events
                        events = dao.findCalendarPublishedEvents(calendarId, calendarEventsParams.getStartAt());
                    }
                } else {
                    // Public calendar, show events even if user isn't owner or collaborator
                    events = dao.findCalendarPublishedEvents(calendarId, calendarEventsParams.getStartAt());
                }
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }

        return events;
    }

    @GET
    @Path("/dots")
    public List<Integer> getDots(@Auth Account auth, @QueryParam("q") String q) {
        List<Integer> dots = new ArrayList<>();
        String decodedQuery = new String(Base64.getDecoder().decode(q), StandardCharsets.UTF_8);
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        try {
            DotsParams dotsParams = mapper.readValue(decodedQuery, DotsParams.class);
            if (dotsParams.getCalendarId() != null && dotsParams.getStartAt() != null) {
                List<Event> monthEvents = new ArrayList<>();
                ZoneId zoneId = ZoneId.of(dotsParams.getZoneName());
                ZonedDateTime dotsZonedStartAt = Instant.ofEpochSecond(dotsParams.getStartAt()).atZone(zoneId);
                // Find the upper limit for months event: the beginning of the first day of next month
                LocalDate monthEnd = YearMonth.from(dotsZonedStartAt).atEndOfMonth();
                Instant firstDayOfNextMonth = monthEnd.plusDays(1).atStartOfDay().atZone(zoneId).toInstant();
                monthEvents = dao.findMonthPublishedEvents(dotsParams.getCalendarId(), Math.toIntExact(dotsZonedStartAt.toInstant().getEpochSecond()), Math.toIntExact(firstDayOfNextMonth.getEpochSecond()));

                List<CalendarAccess> calendarAccesses = dao.findCalendarAccesses(auth.getAccountId());
                Optional<CalendarAccess> oCalendarAccess = calendarAccesses.stream().filter(ca -> ca.getCalendarId() == dotsParams.getCalendarId()).findAny();

                if (oCalendarAccess.isPresent()) {
                    if (oCalendarAccess.get().getStatus().equals(CalendarAccessStatus.OWNER.getStatus())) {
                        monthEvents = dao.findMonthOwnerEvents(dotsParams.getCalendarId(), Math.toIntExact(dotsZonedStartAt.toInstant().getEpochSecond()), Math.toIntExact(firstDayOfNextMonth.getEpochSecond()));
                    } else if (oCalendarAccess.get().getStatus().equals(CalendarAccessStatus.ACTIVE.getStatus())) {
                        monthEvents = dao.findMonthCollaboratorEvents(dotsParams.getCalendarId(), auth.getAccountId(), Math.toIntExact(dotsZonedStartAt.toInstant().getEpochSecond()), Math.toIntExact(firstDayOfNextMonth.getEpochSecond()));
                    } else if (oCalendarAccess.get().getStatus().equals(CalendarAccessStatus.INVITED.getStatus())) {
                        // Collaborator is invited but has yet to create content, process published events
                        monthEvents = dao.findMonthPublishedEvents(dotsParams.getCalendarId(), Math.toIntExact(dotsZonedStartAt.toInstant().getEpochSecond()), Math.toIntExact(firstDayOfNextMonth.getEpochSecond()));
                    }
                } else {
                    // Public calendar, process published events if user isn't owner or collaborator
                    monthEvents = dao.findMonthPublishedEvents(dotsParams.getCalendarId(), Math.toIntExact(dotsZonedStartAt.toInstant().getEpochSecond()), Math.toIntExact(firstDayOfNextMonth.getEpochSecond()));
                }
                dots = eventHelpers.generateDots(monthEvents, zoneId, dotsZonedStartAt, monthEnd);
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return dots;
    }

    private List<String> reservedWords() {
        return Arrays.asList("api", "static", "img", "favicon", "embed", "sign-in", "sign-up", "forgot-password",
                "password-reset", "profile", "subscription", "my-calendars", "public-calendars");
    }
}
