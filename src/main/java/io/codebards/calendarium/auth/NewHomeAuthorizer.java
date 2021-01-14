package io.codebards.calendarium.auth;

import io.codebards.calendarium.core.UserAccount;
import io.dropwizard.auth.Authorizer;

import java.util.Objects;

public class NewHomeAuthorizer implements Authorizer<UserAccount> {
    @Override
    public boolean authorize(UserAccount userAccount, String role) {
        if (Objects.nonNull(userAccount)) {
            return userAccount.hasRole(role);
        }
        return false;
    }
}
