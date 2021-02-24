package io.codebards.calendarium.resources;

import io.codebards.calendarium.api.Event;
import io.codebards.calendarium.core.Account;
import io.codebards.calendarium.db.Dao;
import io.dropwizard.auth.Auth;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;

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
}
