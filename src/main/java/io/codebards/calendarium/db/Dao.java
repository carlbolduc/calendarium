package io.codebards.calendarium.db;

import io.codebards.calendarium.api.*;
import io.codebards.calendarium.core.Account;

import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.GetGeneratedKeys;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface Dao {

    @SqlQuery("SELECT 'bidu'")
    String healthCheck();

    // ******************** Account ********************

    // Only use this if you validated first that the account exists in the database
    @SqlQuery("SELECT account_id, email, name, language_id, stripe_cus_id, created_at FROM account WHERE account_id = :accountId")
    @RegisterBeanMapper(Account.class)
    Account findAccount(@Bind("accountId") long accountId);

    @SqlUpdate("INSERT INTO account (email, name, language_id, password_digest, created_by) VALUES (:email, :name, :languageId, :passwordDigest, :createdBy)")
    @GetGeneratedKeys
    long insertAccount(@Bind("email") String email, @Bind("name") String name, @Bind("languageId") Long languageId, @Bind("passwordDigest") String passwordDigest, @Bind("createdBy") long createdBy);

    @SqlQuery("SELECT a.account_id, a.email, a.name, a.language_id, a.stripe_cus_id, at.validator\n" +
            "FROM account a\n" +
            "         INNER JOIN account_token at ON a.account_id = at.account_id\n" +
            "WHERE at.selector = :selector")
    @RegisterBeanMapper(Account.class)
    Optional<Account> findAccountBySelector(@Bind("selector") String selector);

    @SqlQuery("SELECT account_id, email, name, language_id, password_digest, password_reset_digest, password_reset_requested_at FROM account WHERE email = :email")
    @RegisterBeanMapper(Account.class)
    Optional<Account> findAccountByEmail(@Bind("email") String email);

    @SqlQuery("SELECT account_id, email, name, language_id, password_digest, password_reset_digest, password_reset_requested_at FROM account WHERE password_reset_digest = :digest")
    @RegisterBeanMapper(Account.class)
    Optional<Account> findAccountByPasswordReset(@Bind("digest") String digest);

    @SqlQuery("SELECT account_id, email, name, language_id, stripe_cus_id, created_at FROM account WHERE account_id = :accountId")
    @RegisterBeanMapper(Account.class)
    Optional<Account> findAccountById(@Bind("accountId") long accountId);

    @SqlQuery("SELECT password_digest FROM account WHERE account_id = :accountId")
    String findPasswordDigest(@Bind("accountId") long accountId);

    @SqlUpdate("UPDATE account SET password_reset_digest = :passwordResetDigest, password_reset_requested_at = :now WHERE account_id = :accountId")
    void updatePasswordResetDigest(@Bind("accountId") long accountId, @Bind("passwordResetDigest") String passwordResetDigest, @Bind("now") Instant now);

    @SqlUpdate("UPDATE account SET password_digest = :passwordDigest, password_reset_digest = NULL, password_reset_requested_at = NULL, updated_by = :updatedBy WHERE account_id = :accountId")
    void updatePasswordDigest(@Bind("accountId") long accountId, @Bind("passwordDigest") String passwordDigest, @Bind("updatedBy") long updatedBy);

    @SqlUpdate("UPDATE account SET email = :email, name = :name, updated_by = :updatedBy WHERE account_id = :accountId")
    void updateAccount(@Bind("accountId") long accountId, @Bind("email") String email, @Bind("name") String name, @Bind("updatedBy") long updatedBy);

    @SqlUpdate("UPDATE account SET email = :email, name = :name, language_id = :languageId, password_digest = :passwordDigest, updated_by = :updatedBy WHERE account_id = :accountId")
    void updateAccountAndPassword(@Bind("accountId") long accountId, @Bind("email") String email, @Bind("name") String name, @Bind("languageId") Long languageId, @Bind("passwordDigest") String passwordDigest, @Bind("updatedBy") long updatedBy);

    @SqlUpdate("UPDATE account SET language_id = :languageId, updated_by = :updatedBy WHERE account_id = :accountId")
    void updateAccountLanguage(@Bind("accountId") long accountId, @Bind("languageId") long languageId, @Bind("updatedBy") long updatedBy);

    @SqlUpdate("UPDATE account SET password_digest = :passwordDigest, updated_by = :updatedBy WHERE account_id = :accountId")
    void updateAccountPassword(@Bind("accountId") long accountId, @Bind("passwordDigest") String passwordDigest, @Bind("updatedBy") long updatedBy);

    @SqlUpdate("INSERT INTO account_token (selector, validator, created_at, account_id)\n" +
            "VALUES (:selector, :validator, :now, :accountId)")
    void insertAccountToken(@Bind("selector") String selector, @Bind("validator") String validator, @Bind("now") Instant now, @Bind("accountId") long accountId);

    // ******************** Localisation ********************

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

    // ******************** Subscription ********************

    @SqlUpdate("UPDATE account SET stripe_cus_id = :stripeCusId WHERE account_id = :accountId")
    void setStripeCusId(@Bind("accountId") long accountId, @Bind("stripeCusId") String stripeCusId);

    @SqlQuery("SELECT s.subscription_id,\n" +
            "s.status,\n" +
            "s.start_at,\n" +
            "s.end_at,\n" +
            "s.stripe_sub_id,\n" +
            "CASE\n" +
            "    WHEN p.amount = 600 THEN 'unlimited'\n" +
            "    WHEN p.amount = 0 THEN 'trial'\n" +
            "    ELSE 'unknown'\n" +
            "    END AS product\n" +
            "FROM subscription s\n" +
            "      INNER JOIN price p on p.price_id = s.price_id\n" +
            "WHERE account_id = :accountId\n" +
            "ORDER BY s.start_at DESC LIMIT 1")
    @RegisterBeanMapper(Subscription.class)
    Subscription findSubscriptionByAccountId(@Bind("accountId") long accountId);

    @SqlQuery("SELECT * FROM price WHERE amount = :amount")
    @RegisterBeanMapper(Price.class)
    Price findPrice(@Bind("amount") int amount);

    @SqlQuery("SELECT stripe_tax_id, description FROM tax")
    @RegisterBeanMapper(Tax.class)
    List<Tax> findTaxes();

    @SqlUpdate("INSERT INTO subscription (account_id, stripe_sub_id, price_id, start_at, end_at, status, created_by) VALUES (:accountId, :stripeSubId, :priceId, :startAt, :endAt, :status, :createdBy)")
    void insertSubscription(@Bind("accountId") long accountId, @Bind("stripeSubId") String stripeSubId, @Bind("priceId") long priceId, @Bind("startAt") Instant startAt, @Bind("endAt") Instant endAt, @Bind("status") String status, @Bind("createdBy") long createdBy);

    @SqlUpdate("UPDATE subscription SET stripe_sub_id = :stripeSubId, price_id = :priceId, start_at = :startAt, end_at = :endAt, status = :status, updated_by = :updatedBy WHERE subscription_id = :subscriptionId")
    void updateSubscription(@Bind("subscriptionId") long subscriptionId, @Bind("stripeSubId") String stripeSubId, @Bind("priceId") long priceId, @Bind("startAt") Instant startAt, @Bind("endAt") Instant endAt, @Bind("status") String status, @Bind("updatedBy") long updatedBy);

    @SqlQuery("SELECT stripe_sub_id FROM subscription WHERE account_id = :accountId")
    String findStripeSubId(@Bind("accountId") long accountId);

    @SqlUpdate("UPDATE subscription SET status = :status, updated_by = :updatedBy WHERE stripe_sub_id = :stripeSubId")
    void updateSubscriptionStatus(@Bind("stripeSubId") String stripeSubId, @Bind("status") String status, @Bind("updatedBy") long updatedBy);

    // ******************** Calendar ********************

    @SqlQuery("SELECT c.calendar_id,\n" +
            "       c.enable_en,\n" +
            "       c.enable_fr,\n" +
            "       c.name_en,\n" +
            "       c.name_fr,\n" +
            "       c.description_en,\n" +
            "       c.description_fr,\n" +
            "       c.link_en,\n" +
            "       c.link_fr,\n" +
            "       c.start_week_on,\n" +
            "       c.primary_color,\n" +
            "       c.secondary_color,\n" +
            "       c.embed_calendar,\n" +
            "       c.public_calendar,\n" +
            "       c.event_approval_required\n" +
            "FROM calendar c\n" +
            "         INNER JOIN calendar_access ca on c.calendar_id = ca.calendar_id\n" +
            "WHERE ca.account_id = :accountId AND ca.status IN ('owner', 'active')")
    @RegisterBeanMapper(Calendar.class)
    List<Calendar> findCalendars(@Bind("accountId") long accountId);

    @SqlQuery("SELECT calendar_id,\n" +
            "       enable_en,\n" +
            "       enable_fr,\n" +
            "       name_en,\n" +
            "       name_fr,\n" +
            "       description_en,\n" +
            "       description_fr,\n" +
            "       link_en,\n" +
            "       link_fr,\n" +
            "       start_week_on,\n" +
            "       primary_color,\n" +
            "       secondary_color\n" +
            "FROM calendar\n" +
            "WHERE public_calendar IS TRUE")
    @RegisterBeanMapper(Calendar.class)
    List<Calendar> findPublicCalendars();

    @SqlQuery("SELECT calendar_id,\n" +
            "       enable_en,\n" +
            "       enable_fr,\n" +
            "       name_en,\n" +
            "       name_fr,\n" +
            "       description_en,\n" +
            "       description_fr,\n" +
            "       link_en,\n" +
            "       link_fr,\n" +
            "       start_week_on,\n" +
            "       primary_color,\n" +
            "       secondary_color,\n" +
            "       embed_calendar,\n" +
            "       public_calendar,\n" +
            "       event_approval_required\n" +
            "FROM calendar\n" +
            "WHERE calendar_id = :calendarId")
    @RegisterBeanMapper(Calendar.class)
    Optional<Calendar> findCalendar(@Bind("calendarId") long calendarId);

    @SqlQuery("SELECT c.calendar_id\n" +
            "FROM calendar c\n" +
            "         inner join calendar_access ca on c.calendar_id = ca.calendar_id\n" +
            "WHERE ca.account_id = :accountId\n" +
            "  AND ca.status IN ('owner', 'active')")
    List<Long> findAccountCalendarIds(@Bind("accountId") long accountId);

    @SqlQuery("SELECT c.calendar_id,\n" +
            "       c.enable_en,\n" +
            "       c.enable_fr,\n" +
            "       c.name_en,\n" +
            "       c.name_fr,\n" +
            "       c.description_en,\n" +
            "       c.description_fr,\n" +
            "       c.link_en,\n" +
            "       c.link_fr,\n" +
            "       c.start_week_on,\n" +
            "       c.primary_color,\n" +
            "       c.secondary_color,\n" +
            "       c.embed_calendar,\n" +
            "       c.public_calendar,\n" +
            "       c.event_approval_required,\n" +
            "       ca.status AS access\n" +
            "FROM calendar c\n" +
            "         INNER JOIN calendar_access ca on c.calendar_id = ca.calendar_id\n" +
            "WHERE ca.account_id = :accountId\n" +
            "  AND (c.link_en = :link OR c.link_fr = :link)")
    @RegisterBeanMapper(Calendar.class)
    Optional<Calendar> findCalendarByLink(@Bind("accountId") long accountId, @Bind("link") String link);

    @SqlQuery("SELECT calendar_id,\n" +
            "       enable_en,\n" +
            "       enable_fr,\n" +
            "       name_en,\n" +
            "       name_fr,\n" +
            "       description_en,\n" +
            "       description_fr,\n" +
            "       link_en,\n" +
            "       link_fr,\n" +
            "       start_week_on,\n" +
            "       primary_color,\n" +
            "       secondary_color,\n" +
            "       embed_calendar,\n" +
            "       public_calendar,\n" +
            "       event_approval_required,\n" +
            "       '' AS access\n" +
            "FROM calendar\n" +
            "WHERE (link_en = :link OR link_fr = :link) AND public_calendar IS TRUE")
    @RegisterBeanMapper(Calendar.class)
	Optional<Calendar> findPublicCalendarByLink(@Bind("link") String link);

    @SqlQuery("SELECT c.calendar_id,\n" +
            "       c.enable_en,\n" +
            "       c.enable_fr,\n" +
            "       c.name_en,\n" +
            "       c.name_fr\n" +
            "FROM calendar c\n" +
            "         INNER JOIN calendar_access ca on c.calendar_id = ca.calendar_id\n" +
            "WHERE ca.calendar_access_id = :calendarAccessId\n" +
            "  AND (c.link_en = :link OR c.link_fr = :link)")
    @RegisterBeanMapper(Calendar.class)
    Optional<Calendar> findAnonymousCalendar(@Bind("link") String link, @Bind("calendarAccessId") long calendarAccessId);

    @SqlUpdate("INSERT INTO calendar (enable_en, enable_fr, name_en, name_fr, description_en, description_fr, link_en, link_fr,\n" +
            "                      start_week_on, primary_color, secondary_color, embed_calendar, public_calendar, event_approval_required, created_by)\n" +
            "VALUES (:enableEn, :enableFr, :nameEn, :nameFr, :descriptionEn, :descriptionFr, :linkEn, :linkFr,\n" +
            "        :startWeekOn, :primaryColor, :secondaryColor, :embedCalendar, :publicCalendar, :eventApprovalRequired, :createdBy)")
    @GetGeneratedKeys
    long insertCalendar(@Bind("accountId") long accountId, @BindBean Calendar calendar);

    @SqlUpdate("UPDATE calendar SET enable_en = :enableEn, enable_fr = :enableFr, name_en = :nameEn, name_fr = :nameFr, description_en = :descriptionEn, description_fr = :descriptionFr, link_en = :linkEn, link_fr = :linkFr, start_week_on = :startWeekOn, primary_color = :primaryColor, secondary_color = :secondaryColor, embed_calendar = :embedCalendar, public_calendar = :publicCalendar, event_approval_required = :eventApprovalRequired, updated_by = :updatedBy WHERE calendar_id = :calendarId")
    void updateCalendar(@Bind("accountId") long accountId, @Bind("calendarId") long calendarId, @BindBean Calendar calendar);

    @SqlUpdate("DELETE FROM calendar WHERE calendar_id = :calendarId")
    void deleteCalendar(@Bind("accountId") long accountId, @Bind("calendarId") long calendarId);

    // ******************** Event ********************

    @SqlQuery("SELECT event_id,\n" +
            "       account_id,\n" +
            "       calendar_id,\n" +
            "       status,\n" +
            "       name_fr,\n" +
            "       name_en,\n" +
            "       description_fr,\n" +
            "       description_en,\n" +
            "       start_at,\n" +
            "       end_at,\n" +
            "       all_day,\n" +
            "       hyperlink_fr,\n" +
            "       hyperlink_en\n" +
            "FROM event\n" +
            "WHERE account_id = :accountId")
    @RegisterBeanMapper(Event.class)
    List<Event> findEventsByAccount(@Bind("accountId") long accountId);

    @SqlQuery("SELECT event_id,\n" +
            "       account_id,\n" +
            "       calendar_id,\n" +
            "       status,\n" +
            "       name_fr,\n" +
            "       name_en,\n" +
            "       description_fr,\n" +
            "       description_en,\n" +
            "       start_at,\n" +
            "       end_at,\n" +
            "       all_day,\n" +
            "       hyperlink_fr,\n" +
            "       hyperlink_en\n" +
            "FROM event\n" +
            "WHERE event_id = :eventId")
    @RegisterBeanMapper(Event.class)
    Optional<Event> findEvent(@Bind("eventId") long eventId);

    @SqlUpdate("INSERT INTO event (account_id, calendar_id, status, name_fr, name_en, description_fr, \n" +
            "                   description_en, start_at, end_at, all_day, hyperlink_fr, hyperlink_en, created_by)\n" +
            "VALUES (:accountId, :calendarId, :status, :nameFr, :nameEn, :descriptionFr, \n" +
            "        :descriptionEn, :startAt, :endAt, :allDay, :hyperlinkFr, :hyperlinkEn, :createdBy)")
    void insertEvent(@BindBean Event event);

    @SqlUpdate("UPDATE event\n" +
            "SET calendar_id    = :calendarId,\n" +
            "    status         = :status,\n" +
            "    name_fr        = :nameFr,\n" +
            "    name_en        = :nameEn,\n" +
            "    description_fr = :descriptionFr,\n" +
            "    description_en = :descriptionEn,\n" +
            "    start_at       = :startAt,\n" +
            "    end_at         = :endAt,\n" +
            "    all_day        = :allDay,\n" +
            "    hyperlink_fr   = :hyperlinkFr,\n" +
            "    hyperlink_en   = :hyperlinkEn,\n" +
            "    updated_by     = :updatedBy\n" +
            "WHERE event_id = :eventId")
    void updateEvent(@BindBean Event event);

    @SqlUpdate("DELETE FROM event WHERE event_id = :eventId")
    void deleteEvent(@Bind("eventId") long eventId);

    @SqlQuery("SELECT event_id, status, name_en, name_fr, description_en, description_fr, start_at, end_at, all_day, hyperlink_en, hyperlink_fr, account_id, calendar_id\n" +
            "FROM event\n" +
            "WHERE calendar_id = :calendarId\n" +
            "  AND end_at >= :startAt\n" +
            "ORDER BY start_at\n" +
            "LIMIT 20")
    @RegisterBeanMapper(Event.class)
    List<Event> findCalendarOwnerEvents(@Bind("calendarId") long calendarId, @Bind("startAt") Instant startAt);

    @SqlQuery("SELECT event_id, status, name_en, name_fr, description_en, description_fr, start_at, end_at, all_day, hyperlink_en, hyperlink_fr, account_id, calendar_id\n" +
            "FROM event\n" +
            "WHERE account_id = :accountId\n" +
            "  AND calendar_id = :calendarId\n" +
            "  AND end_at >= :startAt\n" +
            "UNION\n" +
            "SELECT event_id, status, name_en, name_fr, description_en, description_fr, start_at, end_at, all_day, hyperlink_en, hyperlink_fr, account_id, calendar_id\n" +
            "FROM event\n" +
            "WHERE account_id != :accountId\n" +
            "  AND calendar_id = :calendarId\n" +
            "  AND end_at >= :startAt\n" +
            "  AND status = 'published'\n" +
            "ORDER BY start_at\n" +
            "LIMIT 20")
    @RegisterBeanMapper(Event.class)
    List<Event> findCollaboratorEvents(@Bind("accountId") long accountId, @Bind("calendarId") long calendarId, @Bind("startAt") Instant startAt);

    @SqlQuery("SELECT event_id,\n" +
            "       status,\n" +
            "       name_en,\n" +
            "       name_fr,\n" +
            "       description_en,\n" +
            "       description_fr,\n" +
            "       start_at,\n" +
            "       end_at,\n" +
            "       all_day,\n" +
            "       hyperlink_en,\n" +
            "       hyperlink_fr,\n" +
            "       calendar_id\n" +
            "FROM event\n" +
            "WHERE calendar_id = :calendarId\n" +
            "  AND status = 'published'\n" +
            "  AND end_at >= :startAt\n" +
            "ORDER BY start_at\n" +
            "LIMIT 20")
    @RegisterBeanMapper(Event.class)
    List<Event> findCalendarEmbedEvents(@Bind("calendarId") long calendarId, @Bind("startAt") Instant startAt);

    @SqlQuery("SELECT event_id, account_id, calendar_id, status, name_en, name_fr, description_en, description_fr, start_at, end_at, all_day, hyperlink_en, hyperlink_fr FROM event WHERE ((name_en ILIKE '%' || :search || '%') OR (name_fr ILIKE '%' || :search || '%') OR (description_en ILIKE '%' || :search || '%') OR ((description_fr ILIKE '%' || :search || '%'))) AND (:status = '' OR status = :status) ORDER BY start_at")
    @RegisterBeanMapper(Event.class)
    List<Event> findEvents(@BindBean EventsParams eventsParams);

    @SqlQuery("SELECT event_id,\n" +
            "       account_id,\n" +
            "       calendar_id,\n" +
            "       status,\n" +
            "       name_en,\n" +
            "       name_fr,\n" +
            "       description_en,\n" +
            "       description_fr,\n" +
            "       start_at,\n" +
            "       end_at,\n" +
            "       all_day,\n" +
            "       hyperlink_en,\n" +
            "       hyperlink_fr\n" +
            "FROM event\n" +
            "WHERE ((name_en ILIKE '%' || :search || '%') OR (name_fr ILIKE '%' || :search || '%') OR\n" +
            "       (description_en ILIKE '%' || :search || '%') OR ((description_fr ILIKE '%' || :search || '%')))\n" +
            "  AND (:status = '' OR status = :status)\n" +
            "  AND (cast(:startAt AS date) IS NULL OR end_at >= :startAt)\n" +
            "  AND (cast(:endAt AS date) IS NULL OR end_at <= :endAt)\n" +
            "  AND calendar_id = :calendarId\n" +
            "ORDER BY start_at")
    @RegisterBeanMapper(Event.class)
    List<Event> findAllCalendarEvents(@BindBean EventsParams eventsParams, @Bind("startAt2") Instant startAt2);

    @SqlQuery("SELECT event_id,\n" +
            "       account_id,\n" +
            "       calendar_id,\n" +
            "       status,\n" +
            "       name_en,\n" +
            "       name_fr,\n" +
            "       description_en,\n" +
            "       description_fr,\n" +
            "       start_at,\n" +
            "       end_at,\n" +
            "       all_day,\n" +
            "       hyperlink_en,\n" +
            "       hyperlink_fr\n" +
            "FROM event\n" +
            "WHERE ((name_en ILIKE '%' || :search || '%') OR (name_fr ILIKE '%' || :search || '%') OR\n" +
            "       (description_en ILIKE '%' || :search || '%') OR ((description_fr ILIKE '%' || :search || '%')))\n" +
            "  AND (:status = '' OR status = :status)\n" +
            "  AND (cast(:startAt AS date) IS NULL OR end_at >= :startAt)\n" +
            "  AND (cast(:endAt AS date) IS NULL OR end_at <= :endAt)\n" +
            "  AND calendar_id = :calendarId\n" +
            "  AND account_id = :accountId\n" +
            "ORDER BY start_at")
    @RegisterBeanMapper(Event.class)
    List<Event> findAccountCalendarEvents(@Bind("accountId") long accountId, @BindBean EventsParams eventsParams);

    @SqlQuery("SELECT e.event_id, e.start_at, e.end_at\n" +
            "FROM event e\n" +
            "INNER JOIN calendar c ON e.calendar_id = c.calendar_id\n" +
            "WHERE c.calendar_id = :calendarId\n" +
            "AND ((e.start_at < :monthStart AND e.end_at >= :monthStart) OR (e.start_at >= :monthStart AND e.start_at < :firstDayOfNextMonth))\n" +
            "ORDER BY e.start_at")
    @RegisterBeanMapper(Event.class)
    List<Event> findMonthEvents(@Bind("calendarId") long calendarId, @Bind("monthStart") Instant monthStart, @Bind("firstDayOfNextMonth") Instant firstDayOfNextMonth);

    // ******************** Calendar Access ********************

    @SqlUpdate("INSERT INTO calendar_access (account_id, calendar_id, status, created_by) VALUES (:accountId, :calendarId, :status, :createdBy)")
    @GetGeneratedKeys
    long insertCalendarAccess(@Bind("accountId") long accountId, @Bind("calendarId") long calendarId, @Bind("status") String status, @Bind("createdBy") long createdBy);

    @SqlQuery("SELECT calendar_access_id, account_id, calendar_id, status\n" +
            "FROM calendar_access\n" +
            "WHERE account_id = :accountId")
    @RegisterBeanMapper(CalendarAccess.class)
    List<CalendarAccess> findCalendarAccesses(@Bind("accountId") long accountId);

    @SqlQuery("SELECT calendar_access_id, account_id, calendar_id, status\n" +
            "FROM calendar_access\n" +
            "WHERE account_id = :accountId\n" +
            "AND status IN ('owner','active')")
    @RegisterBeanMapper(CalendarAccess.class)
    List<CalendarAccess> findActiveCalendarAccesses(@Bind("accountId") long accountId);

    @SqlQuery("SELECT ca.calendar_access_id, a.name, a.email, ca.status, ca.created_at\n" +
            "FROM account a\n" +
            "INNER JOIN calendar_access ca on a.account_id = ca.account_id\n" +
            "WHERE calendar_id = :calendarId\n" +
            "ORDER BY ca.created_at")
    @RegisterBeanMapper(Collaborator.class)
    List<Collaborator> findCollaboratorsByCalendar(@Bind("calendarId") long calendarId);

    @SqlQuery("SELECT name, email, status, ca.created_at\n" +
            "FROM account a\n" +
            "INNER JOIN calendar_access ca on a.account_id = ca.account_id\n" +
            "WHERE calendar_id = :calendarId\n" +
            "AND a.account_id = :accountId")
    @RegisterBeanMapper(Collaborator.class)
    Optional<Collaborator> findCollaboratorByAccountId(@Bind("calendarId") long calendarId, @Bind("accountId") long accountId);

    @SqlQuery("SELECT calendar_access_id, account_id, calendar_id, status\n" +
            "FROM calendar_access\n" +
            "WHERE calendar_id = :calendarId\n" +
            "AND calendar_access_id = :calendarAccessId")
    @RegisterBeanMapper(CalendarAccess.class)
    Optional<CalendarAccess> findCalendarAccessByCalendarAccessIdAndCalendarId(@Bind("calendarAccessId") long calendarAccessId, @Bind("calendarId") long calendarId);

    @SqlUpdate("UPDATE calendar_access SET status = 'active', updated_by = :updatedBy WHERE calendar_access_id = :calendarAccessId and calendar_id = :calendarId")
    @RegisterBeanMapper(CalendarAccess.class)
    void acceptCalendarInvitation(@Bind("calendarAccessId") long calendarAccessId, @Bind("calendarId") long calendarId, @Bind("updatedBy") long updatedBy);

    @SqlQuery("SELECT account_id FROM calendar_access WHERE calendar_id = :calendarId AND status = 'owner'")
    @RegisterBeanMapper(CalendarAccess.class)
    long findCalendarOwnerAccountId(@Bind("calendarId") long calendarId);

    @SqlUpdate("UPDATE calendar_access SET status = :status, updated_by = :updatedBy WHERE calendar_access_id = :calendarAccessId and calendar_id = :calendarId")
    @RegisterBeanMapper(CalendarAccess.class)
    void updateCalendarAccessStatus(@Bind("calendarAccessId") long calendarAccessId, @Bind("calendarId") long calendarId, @Bind("status") String status, @Bind("updatedBy") long updatedBy);


    // ******************** Email Template ********************

    @SqlQuery("SELECT email_template_id, name, title_fr, title_en, body_fr, body_en\n" +
            "FROM email_template\n" +
            "WHERE name = :name")
    @RegisterBeanMapper(EmailTemplate.class)
    Optional<EmailTemplate> findEmailTemplateByName(@Bind("name") String name);

}
