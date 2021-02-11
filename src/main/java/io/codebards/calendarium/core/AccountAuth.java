package io.codebards.calendarium.core;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.jdbi.v3.core.mapper.reflect.ColumnName;

import java.security.Principal;
import java.time.Instant;

public class AccountAuth implements Principal {
    private long accountId;
    private String email;
    private String name;
    private Long languageId;
    private String passwordDigest;
    private String passwordResetDigest;
    private Instant passwordResetRequestedAt;
    private Instant createdAt;
    private String tokenValidator;
    private String stripeCusId;

    public long getAccountId() {
        return accountId;
    }

    public void setAccountId(long accountId) {
        this.accountId = accountId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getLanguageId() {
        return languageId;
    }

    public void setLanguageId(Long languageId) {
        this.languageId = languageId;
    }

    @JsonIgnore
    public String getPasswordDigest() {
        return passwordDigest;
    }

    @JsonIgnore
    public void setPasswordDigest(String passwordDigest) {
        this.passwordDigest = passwordDigest;
    }

    @JsonIgnore
    public String getPasswordResetDigest() {
        return passwordResetDigest;
    }

    public Instant getPasswordResetRequestedAt() {
        return passwordResetRequestedAt;
    }

    public void setPasswordResetRequestedAt(Instant passwordResetRequestedAt) {
        this.passwordResetRequestedAt = passwordResetRequestedAt;
    }

    @JsonIgnore
    public void setPasswordResetDigest(String passwordResetDigest) {
        this.passwordResetDigest = passwordResetDigest;
    }


    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    @JsonIgnore
    public boolean hasRole(String role) {
        // TODO: implement role validation
        return true;
    }

    @JsonIgnore
    @ColumnName("validator")
    public String getTokenValidator() {
        return tokenValidator;
    }

    @JsonIgnore
    @ColumnName("validator")
    public void setTokenValidator(String tokenValidator) {
        this.tokenValidator = tokenValidator;
    }

    private String getStripeCusId() {
        return stripeCusId;
    }

    private void setStripeId(String stripeCusId) {
        this.stripeCusId = stripeCusId;
    }

}
