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
                ZonedDateTime dotsZonedStartAt = dotsParams.getStartAt().atZone(zoneId);
                // Find the upper limit for months event: the beginning of the first day of next month
                LocalDate monthEnd = YearMonth.from(dotsZonedStartAt).atEndOfMonth();
                Instant firstDayOfNextMonth = monthEnd.plusDays(1).atStartOfDay().atZone(zoneId).toInstant();
                List<Event> monthEvents = dao.findMonthEvents(dotsParams.getCalendarId(), dotsZonedStartAt.toInstant(), firstDayOfNextMonth);
                for (Event event: monthEvents) {
                    ZonedDateTime zonedStartAt = event.getStartAt().atZone(zoneId);
                    ZonedDateTime zonedEndAt = event.getEndAt().atZone(zoneId);
                    // Check if start and end are in the same month
                    if (zonedStartAt.getYear() == zonedEndAt.getYear() && zonedStartAt.getMonth() == zonedEndAt.getMonth()) {
                        // Start and end are in the same month
                        if (!dots.contains(zonedStartAt.getDayOfMonth())) {
                            // Add start to dot
                            dots.add(zonedStartAt.getDayOfMonth());
                        }
                        if (zonedEndAt.getDayOfMonth() != zonedStartAt.getDayOfMonth()) {
                            // Event ends on a different day, throw more dots until end date
                            for (int x = zonedStartAt.getDayOfMonth(); x < zonedEndAt.getDayOfMonth(); x++) {
                                if (!dots.contains(x+1)) {
                                    dots.add(x+1);
                                }
                            }
                        }

                    } else {
                        // Start and end are not in the same month
                        if (zonedStartAt.getMonth() == monthEnd.getMonth()) {
                            // Event starts in our current month and ends after the current month, throw more dots until end of month
                            for (int x = zonedStartAt.getDayOfMonth(); x <= monthEnd.getDayOfMonth(); x++) {
                                if (!dots.contains(x)) {
                                    dots.add(x);
                                }
                            }
                        } else {
                            // Event started before current month, throw more dots until end day
                            int startDay = dotsZonedStartAt.getDayOfMonth();
                            int endDay = zonedEndAt.getMonth() == monthEnd.getMonth() ? zonedEndAt.getDayOfMonth() : monthEnd.getDayOfMonth();
                            for (int x = startDay; x < endDay; x++) {
                                if (!dots.contains(x)) {
                                    dots.add(x);
                                }
                            }
                        }
                    }
                }
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return dots;
    }

}
