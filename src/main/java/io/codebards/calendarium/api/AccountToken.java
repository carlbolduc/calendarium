package io.codebards.calendarium.api;

public class AccountToken {
    private final long accountId;
    private final String token;

    public AccountToken(long accountId, String token) {
        this.accountId = accountId;
        this.token = token;
    }

    public long getAccountId() {
        return accountId;
    }

    public String getToken() {
        return token;
    }

}
