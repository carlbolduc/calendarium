package io.codebards.calendarium.core;

import io.codebards.calendarium.api.Event;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

public class EventHelpers {

    public List<Integer> generateDots(List<Event> events, ZoneId zoneId, ZonedDateTime dotsZonedStartAt, LocalDate monthEnd) {
        List<Integer> dots = new ArrayList<>();
        for (Event event: events) {
            ZonedDateTime zonedStartAt = Instant.ofEpochSecond(event.getStartAt()).atZone(zoneId);
            ZonedDateTime zonedEndAt = Instant.ofEpochSecond(event.getEndAt()).atZone(zoneId);
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
        return dots;
    }

}
