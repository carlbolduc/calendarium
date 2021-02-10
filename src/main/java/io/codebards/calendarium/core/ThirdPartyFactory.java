package io.codebards.calendarium.core;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.constraints.NotEmpty;

public class ThirdPartyFactory {
    private String env;
    private String baseUrl;
    @NotEmpty
    private String accessKey = "";
    @NotEmpty
    private String secretKey = "";
    private String stripeApiKey = "";

    @JsonProperty
    public String getEnv() {
      return env;
    }

    @JsonProperty
    public String getBaseUrl() {
        return baseUrl;
    }

    @JsonProperty
    public String getAccessKey() {
        return accessKey;
    }

    @JsonProperty
    public String getSecretKey() {
        return secretKey;
    }

    @JsonProperty
    public String getStripeApiKey() {
      return stripeApiKey;
    }

}
    


