package io.codebards.calendarium.db;

import io.codebards.calendarium.core.AccountAuth;
import io.codebards.calendarium.api.Language;
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

    // Account

    @SqlUpdate("INSERT INTO account (email, name, language_id, password_digest) VALUES (:email, :name, :languageId, :passwordDigest)")
    @GetGeneratedKeys
    long insertAccount(@Bind("email") String email, @Bind("name") String name, @Bind("languageId") Long languageId, @Bind("passwordDigest") String passwordDigest);

    @SqlQuery("SELECT a.account_id, a.email, a.name, a.language_id, at.validator\n" +
            "FROM account a\n" +
            "         INNER JOIN account_token at ON a.account_id = at.account_id\n" +
            "WHERE at.selector = :selector")
    @RegisterBeanMapper(AccountAuth.class)
    Optional<AccountAuth> findAccount(@Bind("selector") String selector);

    @SqlQuery("SELECT account_id, email, name, language_id, password_digest, password_reset_digest, password_reset_requested_at FROM account WHERE email = :email")
    @RegisterBeanMapper(AccountAuth.class)
    Optional<AccountAuth> findAccountByEmail(@Bind("email") String email);

    @SqlQuery("SELECT account_id, email, name, language_id, created_at FROM account WHERE account_id = :accountId")
    @RegisterBeanMapper(AccountAuth.class)
    Optional<AccountAuth> findAccountById(@Bind("accountId") long accountId);

    @SqlUpdate("UPDATE account SET password_reset_digest = :passwordResetDigest, password_reset_requested_at = :now WHERE account_id = :accountId")
    void updatePasswordResetDigest(@Bind("accountId") long accountId, @Bind("passwordResetDigest") String passwordResetDigest, @Bind("now") Instant now);

    @SqlUpdate("UPDATE account SET password_digest = :passwordDigest WHERE account_id = :accountId")
    void updatePasswordDigest(@Bind("accountId") long accountId, @Bind("passwordDigest") String passwordDigest);

    @SqlUpdate("UPDATE account SET email = :email, name = :name, language_id = :languageId, password_digest = :passwordDigest WHERE account_id = :accountId")
    void updateAccount(@Bind("accountId") long accountId, @Bind("email") String email, @Bind("name") String name, @Bind("languageId") Long languageId, @Bind("passwordDigest") String passwordDigest);

    @SqlUpdate("INSERT INTO account_token (selector, validator, created_at, account_id)\n" +
            "VALUES (:selector, :validator, :now, :accountId)")
    void insertAccountToken(@Bind("selector") String selector, @Bind("validator") String validator, @Bind("now") Instant now, @Bind("accountId") long accountId);

    // Localisation

    @SqlQuery("SELECT en_ca, fr_ca FROM localisation")
    @RegisterBeanMapper(Localisation.class)
    List<Localisation> findAllLocalisations();

    @SqlQuery("SELECT * FROM localisation WHERE en_ca = :enCa")
    @RegisterBeanMapper(Localisation.class)
    Optional<Localisation> findLocalisationByEnCa(@Bind("enCa") String enCa);

    @SqlUpdate("INSERT INTO localisation (en_ca) VALUES (:enCa) ON CONFLICT (en_ca) DO NOTHING;")
    void insertLocalisation(@Bind("enCa") String enCa);

    @SqlQuery("SELECT * FROM language")
    @RegisterBeanMapper(Language.class)
    List<Language> findAllLanguages();
}
