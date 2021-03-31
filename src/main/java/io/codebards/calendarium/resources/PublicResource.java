package io.codebards.calendarium.resources;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import io.codebards.calendarium.api.Calendar;
import io.codebards.calendarium.api.CalendarEventsParams;
import io.codebards.calendarium.api.DotsParams;
import io.codebards.calendarium.api.Event;
import io.codebards.calendarium.db.Dao;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.nio.charset.StandardCharsets;
import java.time.*;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Path("/public")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PublicResource {

    private final Dao dao;

    public PublicResource(Dao dao) {
        this.dao = dao;
    }

    @GET
    @Path("/calendars")
    public List<Calendar> getPublicCalendars() {
        return dao.findPublicCalendars();
    }

    @GET
    @Path("/calendars/{link}")
    public Response getCalendar(@PathParam("link") String link) {
        Response response = Response.status(Response.Status.NOT_FOUND).build();
        Optional<Calendar> oCalendar = dao.findPublicCalendarByLink(link);
        if (oCalendar.isPresent()) {
            response = Response.ok(oCalendar.get()).build();
        }
        return response;
    }

    @GET
    @Path("/calendar-embeds/{calendarId}")
    public Response getCalendar(@PathParam("calendarId") long calendarId) {
        Response response = Response.status(Response.Status.NOT_FOUND).build();
        Optional<Calendar> oCalendar = dao.findCalendar(calendarId);
        if (oCalendar.isPresent() && oCalendar.get().getEmbedCalendar()) {
            response = Response.ok(oCalendar.get()).build();
        }
        return response;
    }

    @GET
    @Path("/calendars/{calendarId}/events")
    public List<Event> getCalendarEvents(@PathParam("calendarId") long calendarId, @QueryParam("q") String q) {
        List<Event> events = new ArrayList<>();
        Optional<Calendar> oCalendar = dao.findCalendar(calendarId);
        if (oCalendar.isPresent() && oCalendar.get().getEmbedCalendar()) {
            String decodedQuery = new String(Base64.getDecoder().decode(q), StandardCharsets.UTF_8);
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            try {
                CalendarEventsParams calendarEventsParams = mapper.readValue(decodedQuery, CalendarEventsParams.class);
                events = dao.findCalendarEmbedEvents(calendarId, calendarEventsParams.getStartAt());
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }
        return events;
    }

    @GET
    @Path("/dots")
    public List<Integer> getDots(@QueryParam("q") String q) {
        List<Integer> dots = new ArrayList<>();
        String decodedQuery = new String(Base64.getDecoder().decode(q), StandardCharsets.UTF_8);
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        try {
            DotsParams dotsParams = mapper.readValue(decodedQuery, DotsParams.class);
            if (dotsParams.getCalendarId() != null && dotsParams.getStartAt() != null) {
                ZoneId zoneId = ZoneId.of(dotsParams.getZoneName());
                ZonedDateTime zonedStartAt = dotsParams.getStartAt().atZone(zoneId);
                // Find the upper limit for months event: the beginning of the first day of next month
                LocalDate monthEnd = YearMonth.from(zonedStartAt).atEndOfMonth();
                Instant firstDayOfNextMonth = monthEnd.plusDays(1).atStartOfDay().atZone(zoneId).toInstant();
                List<Event> monthEvents = dao.findMonthEvents(dotsParams.getCalendarId(), zonedStartAt.toInstant(), firstDayOfNextMonth);
                // TODO: finish this
                dots.add(monthEvents.size());
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return dots;
    }

}
