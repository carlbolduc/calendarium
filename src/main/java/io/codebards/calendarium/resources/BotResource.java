package io.codebards.calendarium.resources;

import io.codebards.calendarium.db.Dao;
import io.codebards.calendarium.service.BotView;

import javax.ws.rs.GET;
import javax.ws.rs.Path;

@Path("/bot")
public class BotResource {
    private final Dao dao;

    public BotResource(Dao dao) {
        this.dao = dao;
    }

    @GET
    public BotView getMessage() {
        return new BotView("monsieur Gro");
    }

}
