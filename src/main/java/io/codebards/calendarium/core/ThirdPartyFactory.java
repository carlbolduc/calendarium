package io.codebards.calendarium.core;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.constraints.NotEmpty;

public class ThirdPartyFactory {
    private String env;
    @NotEmpty
    private String accessKey = "";
    @NotEmpty
    private String secretKey = "";
    private String stripeApiKey = "";

    @JsonProperty("env")
    public String getEnv() {
      return env;
    }

    @JsonProperty
    public String getAccessKey() {
        return accessKey;
    }

    @JsonProperty
    public void setAccessKey(String accessKey) {
        this.accessKey = accessKey;
    }

    @JsonProperty
    public String getSecretKey() {
        return secretKey;
    }

    @JsonProperty
    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    public String getStripeApiKey() {
      return stripeApiKey;
    }
  
    public void setStripeApiKey(String stripeApiKey) {
      this.stripeApiKey = stripeApiKey;
    }

}
    


