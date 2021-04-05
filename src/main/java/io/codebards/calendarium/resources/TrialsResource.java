package io.codebards.calendarium.resources;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import io.codebards.calendarium.api.Price;
import io.codebards.calendarium.api.SubscriptionStatus;
import io.codebards.calendarium.core.Account;
import io.codebards.calendarium.db.Dao;
import io.dropwizard.auth.Auth;

@RolesAllowed({"USER"})
@Path("/trials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TrialsResource {
    private Dao dao;

    public TrialsResource(Dao dao) {
        this.dao = dao;
    }

    @POST
    public Response createTrial(@Auth Account auth) {
        Instant now = Instant.now();
        Instant in30Days = LocalDateTime.from(now.atZone(ZoneId.of("UTC"))).plusDays(30).atZone(ZoneId.of("UTC")).toInstant();
        Price price = dao.findPrice(0);
        // Create the subscription
        dao.insertSubscription(auth.getAccountId(), null, price.getPriceId(), now, in30Days, SubscriptionStatus.ACTIVE.getStatus());
        return Response.ok().build();
    }
    
}
