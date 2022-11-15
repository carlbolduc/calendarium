package io.codebards.calendarium.core;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.codebards.calendarium.api.Subscription;
import io.codebards.calendarium.api.SubscriptionStatus;
import org.jdbi.v3.core.mapper.reflect.ColumnName;

import java.security.Principal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Account implements Principal {
    private long accountId;
    private String email;
    private String name;
    private Long languageId;
    private String passwordDigest;
    private String passwordResetDigest;
    private Integer passwordResetRequestedAt;
    private Integer createdAt;
    private String tokenValidator;
    private String stripeCusId;
    private Subscription subscription;

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

    public String getStripeCusId() {
        return stripeCusId;
    }

    public void setStripeCusId(String stripeCusId) {
        this.stripeCusId = stripeCusId;
    }

    public Subscription getSubscription() {
        return subscription;
    }

    public void setSubscription(Subscription subscription) {
        this.subscription = subscription;
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

    public Integer getPasswordResetRequestedAt() {
        return passwordResetRequestedAt;
    }

    public void setPasswordResetRequestedAt(Integer passwordResetRequestedAt) {
        this.passwordResetRequestedAt = passwordResetRequestedAt;
    }

    @JsonIgnore
    public void setPasswordResetDigest(String passwordResetDigest) {
        this.passwordResetDigest = passwordResetDigest;
    }


    public Integer getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Integer createdAt) {
        this.createdAt = createdAt;
    }

    @JsonIgnore
    public boolean hasRole(String role) {
        return getRoles().contains(role);
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

    @JsonIgnore
    // TODO: subscription, when filled, is the latest one, validate a few things here to make sure the user still has access
    public Set<String> getRoles() {
        List<String> roles = new ArrayList<>();
        roles.add("USER");
        if (subscription != null && subscription.getStatus().equals(SubscriptionStatus.ACTIVE.getStatus())) {
            roles.add("SUBSCRIBER");
        }
        return new HashSet<>(roles);
    }

}
