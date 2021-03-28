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

import javax.ws.rs.core.Response;

public interface Dao {

    @SqlQuery("SELECT 'bidu'")
    String healthCheck();

    // ******************** Account ********************

    @SqlUpdate("INSERT INTO account (email, name, language_id, password_digest) VALUES (:email, :name, :languageId, :passwordDigest)")
    @GetGeneratedKeys
    long insertAccount(@Bind("email") String email, @Bind("name") String name, @Bind("languageId") Long languageId, @Bind("passwordDigest") String passwordDigest);

    @SqlQuery("SELECT a.account_id, a.email, a.name, a.language_id, a.stripe_cus_id, at.validator\n" +
            "FROM account a\n" +
            "         INNER JOIN account_token at ON a.account_id = at.account_id\n" +
            "WHERE at.selector = :selector")
    @RegisterBeanMapper(Account.class)
    Optional<Account> findAccount(@Bind("selector") String selector);

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

    @SqlUpdate("UPDATE account SET password_digest = :passwordDigest, password_reset_digest = NULL, password_reset_requested_at = NULL WHERE account_id = :accountId")
    void updatePasswordDigest(@Bind("accountId") long accountId, @Bind("passwordDigest") String passwordDigest);

    @SqlUpdate("UPDATE account SET email = :email, name = :name, language_id = :languageId WHERE account_id = :accountId")
    void updateAccount(@Bind("accountId") long accountId, @Bind("email") String email, @Bind("name") String name, @Bind("languageId") Long languageId);

    @SqlUpdate("UPDATE account SET email = :email, name = :name, language_id = :languageId, password_digest = :passwordDigest WHERE account_id = :accountId")
    void updateAccountAndPassword(@Bind("accountId") long accountId, @Bind("email") String email, @Bind("name") String name, @Bind("languageId") Long languageId, @Bind("passwordDigest") String passwordDigest);

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

    @SqlQuery("SELECT subscription_id, status, start_at, end_at, stripe_sub_id FROM subscription WHERE account_id = :accountId")
    @RegisterBeanMapper(Subscription.class)
    Subscription findSubscriptionByAccountId(@Bind("accountId") long accountId);

    @SqlQuery("SELECT * FROM price LIMIT 1")
    @RegisterBeanMapper(Price.class)
    Price findPrice();

    @SqlUpdate("INSERT INTO subscription (account_id, stripe_sub_id, price_id, start_at, end_at, status) VALUES (:accountId, :stripeSubId, :priceId, :startAt, :endAt, :status)")
    void insertSubscription(@Bind("accountId") long accountId, @Bind("stripeSubId") String stripeSubId, @Bind("priceId") long priceId, @Bind("startAt") Instant startAt, @Bind("endAt") Instant endAt, @Bind("status") String status);

    @SqlQuery("SELECT stripe_sub_id FROM subscription WHERE account_id = :accountId")
    String findStripeSubId(@Bind("accountId") long accountId);

    @SqlUpdate("UPDATE subscription SET status = :status WHERE stripe_sub_id = :stripeSubId")
    void updateSubscriptionStatus(@Bind("stripeSubId") String stripeSubId, @Bind("status") String status);

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
            "WHERE ca.account_id = :accountId AND ca.status IN ('owner', 'active')\n" +
            "ORDER BY c.name_en")
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
            "WHERE public_calendar IS TRUE\n" +
            "ORDER BY name_en")
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
            "WHERE (link_en = :link OR link_fr = :link)")
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
            "                      start_week_on, primary_color, secondary_color, embed_calendar, public_calendar, event_approval_required)\n" +
            "VALUES (:enableEn, :enableFr, :nameEn, :nameFr, :descriptionEn, :descriptionFr, :linkEn, :linkFr,\n" +
            "        :startWeekOn, :primaryColor, :secondaryColor, :embedCalendar, :publicCalendar, :eventApprovalRequired)")
    @GetGeneratedKeys
    long insertCalendar(@Bind("accountId") long accountId, @BindBean Calendar calendar);

    @SqlUpdate("UPDATE calendar SET enable_en = :enableEn, enable_fr = :enableFr, name_en = :nameEn, name_fr = :nameFr, description_en = :descriptionEn, description_fr = :descriptionFr, link_en = :linkEn, link_fr = :linkFr, start_week_on = :startWeekOn, primary_color = :primaryColor, secondary_color = :secondaryColor, embed_calendar = :embedCalendar, public_calendar = :publicCalendar, event_approval_required = :eventApprovalRequired WHERE calendar_id = :calendarId")
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
            "                   description_en, start_at, end_at, all_day, hyperlink_fr, hyperlink_en)\n" +
            "VALUES (:accountId, :calendarId, :status, :nameFr, :nameEn, :descriptionFr, \n" +
            "        :descriptionEn, :startAt, :endAt, :allDay, :hyperlinkFr, :hyperlinkEn)")
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
            "    hyperlink_en   = :hyperlinkEn\n" +
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
    List<Event> findCalendarCollaboratorEvents(@Bind("accountId") long accountId, @Bind("calendarId") long calendarId, @Bind("startAt") Instant startAt);

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
            "  AND end_at >= :startAt")
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

    // ******************** Calendar Access ********************

    @SqlUpdate("INSERT INTO calendar_access (account_id, calendar_id, status) VALUES (:accountId, :calendarId, :status)")
    @GetGeneratedKeys
    long insertCalendarAccess(@Bind("accountId") long accountId, @Bind("calendarId") long calendarId, @Bind("status") String status);

    @SqlQuery("SELECT calendar_access_id, account_id, calendar_id, status\n" +
            "FROM calendar_access\n" +
            "WHERE account_id = :accountId")
    @RegisterBeanMapper(CalendarAccess.class)
    List<CalendarAccess> findCalendarAccesses(@Bind("accountId") long accountId);

    @SqlQuery("SELECT ca.calendar_access_id, a.name, a.email, ca.status, ca.created_at\n" +
            "FROM account a\n" +
            "INNER JOIN calendar_access ca on a.account_id = ca.account_id\n" +
            "WHERE calendar_id = :calendarId\n" +
            "ORDER BY ca.created_at")
    @RegisterBeanMapper(CalendarCollaborator.class)
    List<CalendarCollaborator> findCalendarCollaboratorsByCalendar(@Bind("calendarId") long calendarId);

    @SqlQuery("SELECT name, email, status, ca.created_at\n" +
            "FROM account a\n" +
            "INNER JOIN calendar_access ca on a.account_id = ca.account_id\n" +
            "WHERE calendar_id = :calendarId\n" +
            "AND a.account_id = :accountId")
    @RegisterBeanMapper(CalendarCollaborator.class)
    Optional<CalendarCollaborator> findCalendarCollaboratorByAccountId(@Bind("calendarId") long calendarId, @Bind("accountId") long accountId);

    @SqlQuery("SELECT calendar_access_id, account_id, calendar_id, status\n" +
            "FROM calendar_access\n" +
            "WHERE calendar_id = :calendarId\n" +
            "AND calendar_access_id = :calendarAccessId")
    @RegisterBeanMapper(CalendarAccess.class)
    Optional<CalendarAccess> findCalendarAccessByCalendarAccessIdAndCalendarId(@Bind("calendarAccessId") long calendarAccessId, @Bind("calendarId") long calendarId);

    @SqlUpdate("UPDATE calendar_access SET status = 'active' WHERE calendar_access_id = :calendarAccessId and calendar_id = :calendarId")
    @RegisterBeanMapper(CalendarAccess.class)
    void acceptCalendarInvitation(@Bind("calendarAccessId") long calendarAccessId, @Bind("calendarId") long calendarId);

    @SqlQuery("SELECT account_id FROM calendar_access WHERE calendar_id = :calendarId AND status = 'owner'")
    @RegisterBeanMapper(CalendarAccess.class)
    long findCalendarOwnerAccountId(@Bind("calendarId") long calendarId);

    @SqlUpdate("UPDATE calendar_access SET status = :status WHERE calendar_access_id = :calendarAccessId and calendar_id = :calendarId")
    @RegisterBeanMapper(CalendarAccess.class)
    void updateCalendarAccessStatus(@Bind("calendarAccessId") long calendarAccessId, @Bind("calendarId") long calendarId, @Bind("status") String status);

    // ******************** Email Template ********************

    @SqlQuery("SELECT email_template_id, name, title_fr, title_en, body_fr, body_en\n" +
            "FROM email_template\n" +
            "WHERE name = :name")
    @RegisterBeanMapper(EmailTemplate.class)
    Optional<EmailTemplate> findEmailTemplateByName(@Bind("name") String name);

}
