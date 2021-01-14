package io.codebards.calendarium.auth;

import io.codebards.calendarium.core.UserAccount;
import io.codebards.calendarium.core.Utils;
import io.codebards.calendarium.db.Dao;
import io.dropwizard.auth.Authenticator;

import java.security.NoSuchAlgorithmException;
import java.util.Optional;

public class TokenAuthenticator implements Authenticator<String, UserAccount> {
    private final Dao dao;

    public TokenAuthenticator(Dao dao) {
        this.dao = dao;
    }

    @Override
    public Optional<UserAccount> authenticate(String token) {
        if (token.length() > 17) {
            String selector = token.substring(0, 16);
            String verifier = token.substring(16);
            Optional<UserAccount> oUserAccount = dao.findUserAccount(selector);
            if (oUserAccount.isPresent()) {
                try {
                    if (Utils.getHash(verifier).equals(oUserAccount.get().getTokenValidator())) {
                        return oUserAccount;
                    }
                } catch (NoSuchAlgorithmException e) {
                    e.printStackTrace();
                }
            }
        }
        return Optional.empty();
    }
}
