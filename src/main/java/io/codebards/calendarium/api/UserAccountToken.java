package io.codebards.calendarium.api;

public class UserAccountToken {
    private final long userAccountId;
    private final String token;

    public UserAccountToken(long userAccountId, String token) {
        this.userAccountId = userAccountId;
        this.token = token;
    }

    public long getUserAccountId() {
        return userAccountId;
    }

    public String getToken() {
        return token;
    }

}
