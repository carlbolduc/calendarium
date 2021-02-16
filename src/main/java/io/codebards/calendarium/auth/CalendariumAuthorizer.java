package io.codebards.calendarium.auth;

import io.codebards.calendarium.core.Account;
import io.dropwizard.auth.Authorizer;

import java.util.Objects;

public class CalendariumAuthorizer implements Authorizer<Account> {
    @Override
    public boolean authorize(Account account, String role) {
        if (Objects.nonNull(account)) {
            return account.hasRole(role);
        }
        return false;
    }
}
