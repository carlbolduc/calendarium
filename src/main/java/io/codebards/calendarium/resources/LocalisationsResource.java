package io.codebards.calendarium.resources;

import java.util.List;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.GET;
import javax.ws.rs.Path;

import io.codebards.calendarium.api.Localisation;
import io.codebards.calendarium.db.Dao;

@RolesAllowed({ "USER" })
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
}
