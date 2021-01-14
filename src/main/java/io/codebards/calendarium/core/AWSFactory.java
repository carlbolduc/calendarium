package io.codebards.calendarium.core;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.constraints.NotEmpty;

public class AWSFactory {

    @NotEmpty
    private String accessKey = "";

    @NotEmpty
    private String secretKey = "";

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
}
