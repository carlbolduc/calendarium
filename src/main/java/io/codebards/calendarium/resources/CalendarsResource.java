package io.codebards.calendarium.resources;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import io.codebards.calendarium.api.Calendar;
import io.codebards.calendarium.core.Account;
import io.codebards.calendarium.db.Dao;
import io.dropwizard.auth.Auth;

import java.net.URI;

@RolesAllowed({"USER"})
@Path("/calendars")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CalendarsResource {
    
    private final Dao dao;

    public CalendarsResource(Dao dao) {
        this.dao = dao;
    }

    @POST
    @RolesAllowed({"SUBSCRIBER"})
    public Response createCalendar(@Auth Account auth, Calendar calendar) {
        long calendarId = dao.insertCalendar(auth.getAccountId(), calendar);
        return Response.created(URI.create("/api/calendars/" + calendarId)).build();
    }
}
