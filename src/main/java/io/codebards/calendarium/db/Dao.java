package io.codebards.calendarium.db;

import io.codebards.calendarium.core.UserAccount;
import io.codebards.calendarium.api.Localisation;
import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.statement.GetGeneratedKeys;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface Dao {

    @SqlQuery("SELECT 'bidu'")
    String healthCheck();

    // UserAccount

    @SqlUpdate("INSERT INTO user_account (email, name, password_digest) VALUES (:email, :name, :passwordDigest)")
    @GetGeneratedKeys
    long insertUserAccount(@Bind("email") String email, @Bind("name") String name, @Bind("passwordDigest") String passwordDigest);

    @SqlQuery("SELECT ua.user_account_id, ua.email, ua.name, uat.validator\n" +
            "FROM user_account ua\n" +
            "         INNER JOIN user_account_token uat ON ua.user_account_id = uat.user_account_id\n" +
            "WHERE uat.selector = :selector")
    @RegisterBeanMapper(UserAccount.class)
    Optional<UserAccount> findUserAccount(@Bind("selector") String selector);

    @SqlQuery("SELECT user_account_id, email, name, password_digest, password_reset_digest, password_reset_requested_at FROM user_account WHERE email = :email")
    @RegisterBeanMapper(UserAccount.class)
    Optional<UserAccount> findUserAccountByEmail(@Bind("email") String email);

    @SqlQuery("SELECT user_account_id, email, name, created_at FROM user_account WHERE user_account_id = :userAccountId")
    @RegisterBeanMapper(UserAccount.class)
    Optional<UserAccount> findUserAccountById(@Bind("userAccountId") long userAccountId);

    @SqlUpdate("UPDATE user_account SET password_reset_digest = :passwordResetDigest, password_reset_requested_at = :now WHERE user_account_id = :userAccountId")
    void updatePasswordResetDigest(@Bind("userAccountId") long userAccountId, @Bind("passwordResetDigest") String passwordResetDigest, @Bind("now") Instant now);

    @SqlUpdate("UPDATE user_account SET password_digest = :passwordDigest WHERE user_account_id = :userAccountId")
    void updatePasswordDigest(@Bind("userAccountId") long userAccountId, @Bind("passwordDigest") String passwordDigest);

    @SqlUpdate("UPDATE user_account SET email = :email, name = :name, password_digest = :passwordDigest WHERE user_account_id = :userAccountId")
    void updateUserAccount(@Bind("userAccountId") long userAccountId, @Bind("email") String email, @Bind("name") String name, @Bind("passwordDigest") String passwordDigest);

    @SqlUpdate("INSERT INTO user_account_token (selector, validator, created_at, user_account_id)\n" +
            "VALUES (:selector, :validator, :now, :userAccountId)")
    void insertUserAccountToken(@Bind("selector") String selector, @Bind("validator") String validator, @Bind("now") Instant now, @Bind("userAccountId") long userAccountId);

    // Localisation

    @SqlQuery("SELECT en-ca, fr-ca FROM localisation")
    @RegisterBeanMapper(Localisation.class)
    List<Localisation> findAllLocalisations();
}
