package io.codebards.calendarium;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.codebards.calendarium.core.ThirdPartyFactory;
import io.dropwizard.Configuration;
import io.dropwizard.db.DataSourceFactory;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

public class Config extends Configuration {
    @Valid
    @NotNull
    private final DataSourceFactory database = new DataSourceFactory();
    private String rewriteConfPath;

    @Valid
    @NotNull
    private final ThirdPartyFactory thirdPartyFactory = new ThirdPartyFactory();

    @JsonProperty("database")
    public DataSourceFactory getDatabase() {
        return database;
    }

    @JsonProperty("thirdParty")
    public ThirdPartyFactory getThirdPartyFactory() {
        return thirdPartyFactory;
    }

    @JsonProperty
    public String getRewriteConfPath() {
        return this.rewriteConfPath;
    }

    public void setRewriteConfPath(String rewriteConfPath) {
        this.rewriteConfPath = rewriteConfPath;
    }
}
