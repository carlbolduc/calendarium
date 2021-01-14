package io.codebards.calendarium.resources;

import io.codebards.calendarium.db.Dao;

import javax.ws.rs.GET;
import javax.ws.rs.Path;

@Path("/ops")
public class OpsResource {
    private final Dao dao;

    public OpsResource(Dao dao) {
        this.dao = dao;
    }

    @Path("/health-check")
    @GET
    public String getHealthCheck() {
        return dao.healthCheck();
    }

    @Path("/blip")
    @GET
    public String getBlip() {
        return "blop";
    }

}
