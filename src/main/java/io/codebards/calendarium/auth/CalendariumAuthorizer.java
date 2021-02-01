package io.codebards.calendarium.auth;

import io.codebards.calendarium.core.AccountAuth;
import io.dropwizard.auth.Authorizer;

import java.util.Objects;

public class CalendariumAuthorizer implements Authorizer<AccountAuth> {
    @Override
    public boolean authorize(AccountAuth account, String role) {
        if (Objects.nonNull(account)) {
            return account.hasRole(role);
        }
        return false;
    }
}
