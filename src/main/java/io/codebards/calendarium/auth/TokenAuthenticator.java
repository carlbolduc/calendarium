package io.codebards.calendarium.auth;

import io.codebards.calendarium.core.AccountAuth;
import io.codebards.calendarium.core.Utils;
import io.codebards.calendarium.db.Dao;
import io.dropwizard.auth.Authenticator;

import java.security.NoSuchAlgorithmException;
import java.util.Optional;

public class TokenAuthenticator implements Authenticator<String, AccountAuth> {
    private final Dao dao;

    public TokenAuthenticator(Dao dao) {
        this.dao = dao;
    }

    @Override
    public Optional<AccountAuth> authenticate(String token) {
        if (token.length() > 17) {
            String selector = token.substring(0, 16);
            String verifier = token.substring(16);
            Optional<AccountAuth> oAccount = dao.findAccount(selector);
            if (oAccount.isPresent()) {
                try {
                    if (Utils.getHash(verifier).equals(oAccount.get().getTokenValidator())) {
                        oAccount.get().setSubscription(dao.findSubscriptionByAccountId(oAccount.get().getAccountId()));
                        return oAccount;
                    }
                } catch (NoSuchAlgorithmException e) {
                    e.printStackTrace();
                }
            }
        }
        return Optional.empty();
    }
}
