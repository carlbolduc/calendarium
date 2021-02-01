package io.codebards.calendarium.resources;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

import io.codebards.calendarium.api.Language;
import io.codebards.calendarium.api.Localisation;
import io.codebards.calendarium.db.Dao;

@Path("/loc")
public class LocalisationsResource {
    private final Dao dao;

    public LocalisationsResource(Dao dao) {
        this.dao = dao;
    }

    @GET
    public List<Localisation> getLoc() {
        return dao.findAllLocalisations();
    }

    @POST
    public Response addLoc(String enCa) {
        dao.insertLocalisation(enCa);
        return Response.noContent().build();
    }

    @Path("/languages")
    @GET
    public List<Language> getLanguages() {
        return dao.findAllLanguages();
    }
}
