package io.codebards.calendarium.resources;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import io.codebards.calendarium.core.AccountAuth;
import io.codebards.calendarium.db.Dao;
import io.dropwizard.auth.Auth;

@RolesAllowed({"USER"})
@Path("/calendars")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CalendarsResource {
    
    private Dao dao;

    public CalendarsResource(Dao dao) {
        this.dao = dao;
    }

    @POST
    @RolesAllowed({"SUBSCRIBER"})
    public Response createCalendar(@Auth AccountAuth auth) {
        Response response = Response.ok().build();

        
        return response;
    }
}
