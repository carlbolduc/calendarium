package io.codebards.calendarium.db;

import io.codebards.calendarium.api.*;
import io.codebards.calendarium.core.Account;
import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.GetGeneratedKeys;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;

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

    @SqlUpdate("INSERT INTO account (email, name, language_id, password_digest, created_at, created_by) VALUES (:email, :name, :languageId, :passwordDigest, :now, :createdBy)")
    @GetGeneratedKeys
    long insertAccount(@Bind("email") String email, @Bind("name") String name, @Bind("languageId") Long languageId, @Bind("passwordDigest") String passwordDigest, @Bind("now") Integer now, @Bind("createdBy") long createdBy);

    @SqlQuery("""
            SELECT a.account_id, a.email, a.name, a.language_id, a.stripe_cus_id, at.validator
            FROM account a
                     INNER JOIN account_token at ON a.account_id = at.account_id
            WHERE at.selector = :selector""")
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

    @SqlUpdate("UPDATE account SET password_reset_digest = :passwordResetDigest, password_reset_requested_at = :now, updated_at = :now, updated_by = 0 WHERE account_id = :accountId")
    void updatePasswordResetDigest(@Bind("accountId") long accountId, @Bind("passwordResetDigest") String passwordResetDigest, @Bind("now") Integer now);

    @SqlUpdate("UPDATE account SET password_digest = :passwordDigest, password_reset_digest = NULL, password_reset_requested_at = NULL, updated_at = :now, updated_by = 0 WHERE account_id = :accountId")
    void updatePasswordDigest(@Bind("accountId") long accountId, @Bind("passwordDigest") String passwordDigest, @Bind("now") Integer now);

    @SqlUpdate("UPDATE account SET email = :email, name = :name, updated_at = :now, updated_by = :updatedBy WHERE account_id = :accountId")
    void updateAccount(@Bind("accountId") long accountId, @Bind("email") String email, @Bind("name") String name, @Bind("now") Integer now, @Bind("updatedBy") long updatedBy);

    @SqlUpdate("UPDATE account SET email = :email, name = :name, language_id = :languageId, password_digest = :passwordDigest, updated_at = :now, updated_by = :updatedBy WHERE account_id = :accountId")
    void updateAccountAndPassword(@Bind("accountId") long accountId, @Bind("email") String email, @Bind("name") String name, @Bind("languageId") Long languageId, @Bind("passwordDigest") String passwordDigest, @Bind("now") Integer now, @Bind("updatedBy") long updatedBy);

    @SqlUpdate("UPDATE account SET language_id = :languageId, updated_at = :now, updated_by = :updatedBy WHERE account_id = :accountId")
    void updateAccountLanguage(@Bind("accountId") long accountId, @Bind("languageId") long languageId, @Bind("now") Integer now, @Bind("updatedBy") long updatedBy);

    @SqlUpdate("UPDATE account SET password_digest = :passwordDigest, updated_at = :now, updated_by = :updatedBy WHERE account_id = :accountId")
    void updateAccountPassword(@Bind("accountId") long accountId, @Bind("passwordDigest") String passwordDigest, @Bind("now") Integer now, @Bind("updatedBy") long updatedBy);

    @SqlUpdate("INSERT INTO account_token (selector, validator, created_at, account_id) VALUES (:selector, :validator, :now, :accountId)")
    void insertAccountToken(@Bind("selector") String selector, @Bind("validator") String validator, @Bind("now") Integer now, @Bind("accountId") long accountId);

    // ******************** Localisation ********************

    @SqlQuery("SELECT en_ca, fr_ca FROM localisation")
    @RegisterBeanMapper(Localisation.class)
    List<Localisation> findAllLocalisations();

    @SqlUpdate("INSERT INTO localisation (en_ca) VALUES (:enCa) ON CONFLICT (en_ca) DO NOTHING;")
    void insertLocalisation(@Bind("enCa") String enCa);

    @SqlQuery("SELECT * FROM language")
    @RegisterBeanMapper(Language.class)
    List<Language> findAllLanguages();

    // ******************** Subscription ********************

    @SqlQuery("SELECT subscription_id FROM subscription WHERE stripe_sub_id = :stripeSubId")
    Optional<Long> findSubscriptionId(@Bind("stripeSubId") String stripeSubId);

    @SqlUpdate("UPDATE account SET stripe_cus_id = :stripeCusId WHERE account_id = :accountId")
    void setStripeCusId(@Bind("accountId") long accountId, @Bind("stripeCusId") String stripeCusId);

    @SqlQuery("""
            SELECT s.subscription_id,
            s.status,
            s.start_at,
            s.end_at,
            s.stripe_sub_id,
            CASE
                WHEN p.amount = 600 THEN 'unlimited'
                WHEN p.amount = 0 THEN 'trial'
                WHEN p.amount = 10 THEN 'monthly'
                ELSE 'unknown'
                END AS product
            FROM subscription s
                  INNER JOIN price p on p.price_id = s.price_id
            WHERE account_id = :accountId
            ORDER BY s.start_at DESC LIMIT 1""")
    @RegisterBeanMapper(Subscription.class)
    Subscription findSubscriptionByAccountId(@Bind("accountId") long accountId);

    @SqlQuery("SELECT * FROM price WHERE amount = :amount")
    @RegisterBeanMapper(Price.class)
    Price findPrice(@Bind("amount") int amount);

    @SqlQuery("SELECT stripe_tax_id, description FROM tax")
    @RegisterBeanMapper(Tax.class)
    List<Tax> findTaxes();

    @SqlUpdate("INSERT INTO subscription (account_id, stripe_sub_id, price_id, start_at, end_at, status, created_at, created_by) VALUES (:accountId, :stripeSubId, :priceId, :startAt, :endAt, :status, :createdAt, :createdBy)")
    void insertSubscription(@Bind("accountId") long accountId, @Bind("stripeSubId") String stripeSubId, @Bind("priceId") long priceId, @Bind("startAt") Integer startAt, @Bind("endAt") Integer endAt, @Bind("status") String status, @Bind("createdAt") Integer createdAt, @Bind("createdBy") long createdBy);

    @SqlUpdate("UPDATE subscription SET stripe_sub_id = :stripeSubId, price_id = :priceId, start_at = :startAt, end_at = :endAt, status = :status, updated_at = :now, updated_by = :updatedBy WHERE subscription_id = :subscriptionId")
    void updateSubscription(@Bind("subscriptionId") long subscriptionId, @Bind("stripeSubId") String stripeSubId, @Bind("priceId") long priceId, @Bind("startAt") Integer startAt, @Bind("endAt") Integer endAt, @Bind("status") String status, @Bind("now") Integer now, @Bind("updatedBy") long updatedBy);

    @SqlUpdate("UPDATE subscription SET end_at = :endAt, updated_at = :now, updated_by = 0 WHERE subscription_id = :subscriptionId")
    void renewSubscription(@Bind("subscriptionId") long subscriptionId, @Bind("endAt") Integer endAt, @Bind("now") Integer now);

    @SqlUpdate("UPDATE subscription SET status = :status, updated_at = :now, updated_by = :updatedBy WHERE stripe_sub_id = :stripeSubId")
    void updateSubscriptionStatus(@Bind("stripeSubId") String stripeSubId, @Bind("status") String status, @Bind("now") Integer now, @Bind("updatedBy") long updatedBy);

    // ******************** Calendar ********************

    @SqlQuery("""
            SELECT c.calendar_id,
                   c.enable_en,
                   c.enable_fr,
                   c.name_en,
                   c.name_fr,
                   c.description_en,
                   c.description_fr,
                   c.link_en,
                   c.link_fr,
                   c.start_week_on,
                   c.primary_color,
                   c.secondary_color,
                   c.embed_calendar,
                   c.public_calendar,
                   c.event_approval_required,
                   c.show_event_author
            FROM calendar c
                     INNER JOIN calendar_access ca on c.calendar_id = ca.calendar_id
            WHERE ca.account_id = :accountId AND ca.status IN ('owner', 'active')""")
    @RegisterBeanMapper(Calendar.class)
    List<Calendar> findCalendars(@Bind("accountId") long accountId);

    @SqlQuery("""
            SELECT calendar_id,
                   enable_en,
                   enable_fr,
                   name_en,
                   name_fr,
                   description_en,
                   description_fr,
                   link_en,
                   link_fr,
                   start_week_on,
                   primary_color,
                   secondary_color
            FROM calendar
            WHERE public_calendar IS TRUE""")
    @RegisterBeanMapper(Calendar.class)
    List<Calendar> findPublicCalendars();

    @SqlQuery("""
            SELECT calendar_id,
                   enable_en,
                   enable_fr,
                   name_en,
                   name_fr,
                   description_en,
                   description_fr,
                   link_en,
                   link_fr,
                   start_week_on,
                   primary_color,
                   secondary_color,
                   embed_calendar,
                   public_calendar,
                   event_approval_required,
                   show_event_author
            FROM calendar
            WHERE calendar_id = :calendarId""")
    @RegisterBeanMapper(Calendar.class)
    Optional<Calendar> findCalendar(@Bind("calendarId") long calendarId);

    @SqlQuery("""
            SELECT c.calendar_id,
                   c.enable_en,
                   c.enable_fr,
                   c.name_en,
                   c.name_fr,
                   c.description_en,
                   c.description_fr,
                   c.link_en,
                   c.link_fr,
                   c.start_week_on,
                   c.primary_color,
                   c.secondary_color,
                   c.embed_calendar,
                   c.public_calendar,
                   c.event_approval_required,
                   c.show_event_author,
                   ca.status AS access
            FROM calendar c
                     INNER JOIN calendar_access ca on c.calendar_id = ca.calendar_id
            WHERE ca.account_id = :accountId
              AND (c.link_en = :link OR c.link_fr = :link)""")
    @RegisterBeanMapper(Calendar.class)
    Optional<Calendar> findCalendarByLink(@Bind("accountId") long accountId, @Bind("link") String link);

    @SqlQuery("""
            SELECT calendar_id,
                   enable_en,
                   enable_fr,
                   name_en,
                   name_fr,
                   description_en,
                   description_fr,
                   link_en,
                   link_fr,
                   start_week_on,
                   primary_color,
                   secondary_color,
                   embed_calendar,
                   public_calendar,
                   event_approval_required,
                   show_event_author,
                   '' AS access
            FROM calendar
            WHERE (link_en = :link OR link_fr = :link) AND public_calendar IS TRUE""")
    @RegisterBeanMapper(Calendar.class)
	Optional<Calendar> findPublicCalendarByLink(@Bind("link") String link);

    @SqlQuery("""
            SELECT c.calendar_id,
                   c.enable_en,
                   c.enable_fr,
                   c.name_en,
                   c.name_fr
            FROM calendar c
                     INNER JOIN calendar_access ca on c.calendar_id = ca.calendar_id
            WHERE ca.calendar_access_id = :calendarAccessId
              AND (c.link_en = :link OR c.link_fr = :link)""")
    @RegisterBeanMapper(Calendar.class)
    Optional<Calendar> findAnonymousCalendar(@Bind("link") String link, @Bind("calendarAccessId") long calendarAccessId);

    @SqlUpdate("""
            INSERT INTO calendar (enable_en, enable_fr, name_en, name_fr, description_en, description_fr, link_en, link_fr,
                                  start_week_on, primary_color, secondary_color, embed_calendar, public_calendar, event_approval_required, show_event_author, created_at, created_by)
            VALUES (:enableEn, :enableFr, :nameEn, :nameFr, :descriptionEn, :descriptionFr, :linkEn, :linkFr,
                    :startWeekOn, :primaryColor, :secondaryColor, :embedCalendar, :publicCalendar, :eventApprovalRequired, :showEventAuthor, :createdAt, :createdBy)""")
    @GetGeneratedKeys
    long insertCalendar(@Bind("accountId") long accountId, @BindBean Calendar calendar);

    @SqlUpdate("UPDATE calendar SET enable_en = :enableEn, enable_fr = :enableFr, name_en = :nameEn, name_fr = :nameFr, description_en = :descriptionEn, description_fr = :descriptionFr, link_en = :linkEn, link_fr = :linkFr, start_week_on = :startWeekOn, primary_color = :primaryColor, secondary_color = :secondaryColor, embed_calendar = :embedCalendar, public_calendar = :publicCalendar, event_approval_required = :eventApprovalRequired, show_event_author = :showEventAuthor, updated_at = :updatedAt, updated_by = :updatedBy WHERE calendar_id = :calendarId")
    void updateCalendar(@Bind("accountId") long accountId, @Bind("calendarId") long calendarId, @BindBean Calendar calendar);

    @SqlUpdate("DELETE FROM calendar WHERE calendar_id = :calendarId")
    void deleteCalendar(@Bind("accountId") long accountId, @Bind("calendarId") long calendarId);

    // ******************** Event ********************

    @SqlQuery("""
            SELECT event_id,
                   e.account_id,
                   calendar_id,
                   status,
                   name_fr,
                   name_en,
                   description_fr,
                   description_en,
                   start_at,
                   end_at,
                   all_day,
                   hyperlink_fr,
                   hyperlink_en,
                   a.name author
            FROM event e
            INNER JOIN account a ON e.account_id = a.account_id
            WHERE e.account_id = :accountId""")
    @RegisterBeanMapper(Event.class)
    List<Event> findEventsByAccount(@Bind("accountId") long accountId);

    @SqlQuery("""
            SELECT event_id,
                   account_id,
                   calendar_id,
                   status,
                   name_fr,
                   name_en,
                   description_fr,
                   description_en,
                   start_at,
                   end_at,
                   all_day,
                   hyperlink_fr,
                   hyperlink_en
            FROM event
            WHERE event_id = :eventId""")
    @RegisterBeanMapper(Event.class)
    Optional<Event> findEvent(@Bind("eventId") long eventId);

    @SqlUpdate("""
            INSERT INTO event (account_id, calendar_id, status, name_fr, name_en, description_fr,
                               description_en, start_at, end_at, all_day, hyperlink_fr, hyperlink_en, created_at, created_by)
            VALUES (:accountId, :calendarId, :status, :nameFr, :nameEn, :descriptionFr,
                    :descriptionEn, :startAt, :endAt, :allDay, :hyperlinkFr, :hyperlinkEn, :createdAt, :createdBy)""")
    void insertEvent(@BindBean Event event);

    @SqlUpdate("""
            UPDATE event
            SET calendar_id    = :calendarId,
                status         = :status,
                name_fr        = :nameFr,
                name_en        = :nameEn,
                description_fr = :descriptionFr,
                description_en = :descriptionEn,
                start_at       = :startAt,
                end_at         = :endAt,
                all_day        = :allDay,
                hyperlink_fr   = :hyperlinkFr,
                hyperlink_en   = :hyperlinkEn,
                updated_at     = :updatedAt,
                updated_by     = :updatedBy
            WHERE event_id = :eventId""")
    void updateEvent(@BindBean Event event);

    @SqlUpdate("DELETE FROM event WHERE event_id = :eventId")
    void deleteEvent(@Bind("eventId") long eventId);

    @SqlQuery("""
            SELECT *
            FROM (SELECT event_id,
                         status,
                         name_en,
                         name_fr,
                         description_en,
                         description_fr,
                         start_at,
                         end_at,
                         all_day,
                         hyperlink_en,
                         hyperlink_fr,
                         e.account_id,
                         calendar_id,
                         a.name author
                  FROM event e
                           INNER JOIN account a ON e.account_id = a.account_id
                  WHERE calendar_id = :calendarId
                    AND end_at >= :startAt
                  ORDER BY start_at
                  LIMIT 10)
            UNION
            SELECT *
            FROM (SELECT event_id,
                         status,
                         name_en,
                         name_fr,
                         description_en,
                         description_fr,
                         start_at,
                         end_at,
                         all_day,
                         hyperlink_en,
                         hyperlink_fr,
                         e.account_id,
                         calendar_id,
                         a.name author
                  FROM event e
                           INNER JOIN account a ON e.account_id = a.account_id
                  WHERE calendar_id = :calendarId
                    AND end_at < :startAt
                  ORDER BY start_at DESC
                  LIMIT 10)""")
    @RegisterBeanMapper(Event.class)
    List<Event> findCalendarOwnerEvents(@Bind("calendarId") long calendarId, @Bind("startAt") Integer startAt);

    @SqlQuery("""
            SELECT *
            FROM (SELECT event_id,
                         status,
                         name_en,
                         name_fr,
                         description_en,
                         description_fr,
                         start_at,
                         end_at,
                         all_day,
                         hyperlink_en,
                         hyperlink_fr,
                         e.account_id,
                         calendar_id,
                         a.name author
                  FROM event e
                           INNER JOIN account a ON e.account_id = a.account_id
                  WHERE calendar_id = :calendarId
                    AND end_at >= :startAt
                    AND (e.status = 'published' OR e.account_id = :accountId)
                  ORDER BY start_at
                  LIMIT 10)
            UNION
            SELECT *
            FROM (SELECT event_id,
                         status,
                         name_en,
                         name_fr,
                         description_en,
                         description_fr,
                         start_at,
                         end_at,
                         all_day,
                         hyperlink_en,
                         hyperlink_fr,
                         e.account_id,
                         calendar_id,
                         a.name author
                  FROM event e
                           INNER JOIN account a ON e.account_id = a.account_id
                  WHERE calendar_id = :calendarId
                    AND end_at < :startAt
                    AND (e.status = 'published' OR e.account_id = :accountId)
                  ORDER BY start_at DESC
                  LIMIT 10)""")
    @RegisterBeanMapper(Event.class)
    List<Event> findCollaboratorEvents(@Bind("accountId") long accountId, @Bind("calendarId") long calendarId, @Bind("startAt") Integer startAt);

    @SqlQuery("""
            SELECT *
            FROM (SELECT event_id,
                         status,
                         name_en,
                         name_fr,
                         description_en,
                         description_fr,
                         start_at,
                         end_at,
                         all_day,
                         hyperlink_en,
                         hyperlink_fr,
                         calendar_id
                  FROM event
                  WHERE calendar_id = :calendarId
                    AND status = 'published'
                    AND end_at >= :startAt
                  ORDER BY start_at
                  LIMIT 5)
            UNION
            SELECT *
            FROM (SELECT event_id,
                         status,
                         name_en,
                         name_fr,
                         description_en,
                         description_fr,
                         start_at,
                         end_at,
                         all_day,
                         hyperlink_en,
                         hyperlink_fr,
                         calendar_id
                  FROM event
                  WHERE calendar_id = :calendarId
                    AND status = 'published'
                    AND end_at < :startAt
                  ORDER BY start_at DESC
                  LIMIT 5)""")
    @RegisterBeanMapper(Event.class)
    List<Event> findCalendarPublishedEvents(@Bind("calendarId") long calendarId, @Bind("startAt") Integer startAt);

    @SqlQuery("""
            SELECT event_id,
                   e.account_id,
                   calendar_id,
                   status,
                   name_en,
                   name_fr,
                   description_en,
                   description_fr,
                   start_at,
                   end_at,
                   all_day,
                   hyperlink_en,
                   hyperlink_fr,
                   a.name author
            FROM event e
                     INNER JOIN account a ON e.account_id = a.account_id
            WHERE ((UPPER(name_en) LIKE '%' || :upperCaseSearch || '%') OR
                   (UPPER(name_fr) LIKE '%' || :upperCaseSearch || '%') OR
                   (UPPER(description_en) LIKE '%' || :upperCaseSearch || '%') OR
                   ((UPPER(description_fr) LIKE '%' || :upperCaseSearch || '%')))
              AND (:status = '' OR status = :status)
            ORDER BY start_at""")
    @RegisterBeanMapper(Event.class)
    List<Event> findEvents(@BindBean EventsParams eventsParams);

    @SqlQuery("""
            SELECT event_id,
                   e.account_id,
                   calendar_id,
                   status,
                   name_en,
                   name_fr,
                   description_en,
                   description_fr,
                   start_at,
                   end_at,
                   all_day,
                   hyperlink_en,
                   hyperlink_fr,
                   a.name author
            FROM event e
            INNER JOIN account a ON e.account_id = a.account_id
            WHERE ((UPPER(name_en) LIKE '%' || :upperCaseSearch || '%') OR (UPPER(name_fr) LIKE '%' || :upperCaseSearch || '%') OR
                   (UPPER(description_en) LIKE '%' || :upperCaseSearch || '%') OR ((UPPER(description_fr) LIKE '%' || :upperCaseSearch || '%')))
              AND (:status = '' OR status = :status)
              AND (cast(:startAt AS INTEGER) IS NULL OR end_at >= :startAt)
              AND (cast(:endAt AS INTEGER) IS NULL OR end_at <= :endAt)
              AND calendar_id = :calendarId
            ORDER BY start_at""")
    @RegisterBeanMapper(Event.class)
    List<Event> findAllCalendarEvents(@BindBean EventsParams eventsParams);

    @SqlQuery("""
            SELECT event_id,
                   e.account_id,
                   calendar_id,
                   status,
                   name_en,
                   name_fr,
                   description_en,
                   description_fr,
                   start_at,
                   end_at,
                   all_day,
                   hyperlink_en,
                   hyperlink_fr,
                   a.name author
            FROM event e
            INNER JOIN account a ON e.account_id = a.account_id
            WHERE ((UPPER(name_en) LIKE '%' || :upperCaseSearch || '%') OR (UPPER(name_fr) LIKE '%' || :upperCaseSearch || '%') OR
                   (UPPER(description_en) LIKE '%' || :upperCaseSearch || '%') OR ((UPPER(description_fr) LIKE '%' || :upperCaseSearch || '%')))
              AND (:status = '' OR status = :status)
              AND (cast(:startAt AS INTEGER) IS NULL OR end_at >= :startAt)
              AND (cast(:endAt AS INTEGER) IS NULL OR end_at <= :endAt)
              AND calendar_id = :calendarId
              AND e.account_id = :accountId
            ORDER BY start_at""")
    @RegisterBeanMapper(Event.class)
    List<Event> findAccountCalendarEvents(@Bind("accountId") long accountId, @BindBean EventsParams eventsParams);

    @SqlQuery("""
            SELECT e.event_id, e.start_at, e.end_at
            FROM event e
                     INNER JOIN calendar c ON e.calendar_id = c.calendar_id
            WHERE c.calendar_id = :calendarId
              AND ((e.start_at < :monthStart AND e.end_at >= :monthStart) OR
                   (e.start_at >= :monthStart AND e.start_at < :firstDayOfNextMonth))
              AND status = 'published'
            ORDER BY e.start_at""")
    @RegisterBeanMapper(Event.class)
    List<Event> findMonthPublishedEvents(@Bind("calendarId") long calendarId, @Bind("monthStart") Integer monthStart, @Bind("firstDayOfNextMonth") Integer firstDayOfNextMonth);

    @SqlQuery("""
            SELECT e.event_id, e.start_at, e.end_at
            FROM event e
                     INNER JOIN calendar c ON e.calendar_id = c.calendar_id
            WHERE c.calendar_id = :calendarId
              AND ((e.start_at < :monthStart AND e.end_at >= :monthStart) OR
                   (e.start_at >= :monthStart AND e.start_at < :firstDayOfNextMonth))
            ORDER BY e.start_at""")
    @RegisterBeanMapper(Event.class)
    List<Event> findMonthOwnerEvents(@Bind("calendarId") long calendarId, @Bind("monthStart") Integer monthStart, @Bind("firstDayOfNextMonth") Integer firstDayOfNextMonth);

    @SqlQuery("""
            SELECT e.event_id, e.start_at, e.end_at
            FROM event e
                     INNER JOIN calendar c ON e.calendar_id = c.calendar_id
            WHERE c.calendar_id = :calendarId
              AND ((e.start_at < :monthStart AND e.end_at >= :monthStart) OR
                   (e.start_at >= :monthStart AND e.start_at < :firstDayOfNextMonth))
              AND (status = 'published' OR e.account_id = :accountId)
            ORDER BY e.start_at""")
    @RegisterBeanMapper(Event.class)
    List<Event> findMonthCollaboratorEvents(@Bind("calendarId") long calendarId, @Bind("accountId") long accountId, @Bind("monthStart") Integer monthStart, @Bind("firstDayOfNextMonth") Integer firstDayOfNextMonth);


    // ******************** Calendar Access ********************

    @SqlUpdate("INSERT INTO calendar_access (account_id, calendar_id, status, created_at, created_by) VALUES (:accountId, :calendarId, :status, :createdAt, :createdBy)")
    @GetGeneratedKeys
    long insertCalendarAccess(@Bind("accountId") long accountId, @Bind("calendarId") long calendarId, @Bind("status") String status, @Bind("createdAt") Integer createdAt, @Bind("createdBy") long createdBy);

    @SqlQuery("""
            SELECT calendar_access_id, account_id, calendar_id, status
            FROM calendar_access
            WHERE account_id = :accountId""")
    @RegisterBeanMapper(CalendarAccess.class)
    List<CalendarAccess> findCalendarAccesses(@Bind("accountId") long accountId);

    @SqlQuery("""
            SELECT calendar_access_id, account_id, calendar_id, status
            FROM calendar_access
            WHERE account_id = :accountId
            AND status IN ('owner','active')""")
    @RegisterBeanMapper(CalendarAccess.class)
    List<CalendarAccess> findActiveCalendarAccesses(@Bind("accountId") long accountId);

    @SqlQuery("""
            SELECT ca.calendar_access_id, a.name, a.email, ca.status, ca.created_at
            FROM account a
            INNER JOIN calendar_access ca on a.account_id = ca.account_id
            WHERE calendar_id = :calendarId
            ORDER BY ca.created_at""")
    @RegisterBeanMapper(Collaborator.class)
    List<Collaborator> findCollaboratorsByCalendar(@Bind("calendarId") long calendarId);

    @SqlQuery("""
            SELECT name, email, status, ca.created_at
            FROM account a
            INNER JOIN calendar_access ca on a.account_id = ca.account_id
            WHERE calendar_id = :calendarId
            AND a.account_id = :accountId""")
    @RegisterBeanMapper(Collaborator.class)
    Optional<Collaborator> findCollaboratorByAccountId(@Bind("calendarId") long calendarId, @Bind("accountId") long accountId);

    @SqlQuery("""
            SELECT calendar_access_id, account_id, calendar_id, status
            FROM calendar_access
            WHERE calendar_id = :calendarId
            AND calendar_access_id = :calendarAccessId""")
    @RegisterBeanMapper(CalendarAccess.class)
    Optional<CalendarAccess> findCalendarAccessByCalendarAccessIdAndCalendarId(@Bind("calendarAccessId") long calendarAccessId, @Bind("calendarId") long calendarId);

    @SqlUpdate("UPDATE calendar_access SET status = 'active', updated_at = :now, updated_by = :updatedBy WHERE calendar_access_id = :calendarAccessId and calendar_id = :calendarId")
    @RegisterBeanMapper(CalendarAccess.class)
    void acceptCalendarInvitation(@Bind("calendarAccessId") long calendarAccessId, @Bind("calendarId") long calendarId, @Bind("now") Integer now, @Bind("updatedBy") long updatedBy);

    @SqlQuery("SELECT account_id FROM calendar_access WHERE calendar_id = :calendarId AND status = 'owner'")
    @RegisterBeanMapper(CalendarAccess.class)
    long findCalendarOwnerAccountId(@Bind("calendarId") long calendarId);

    @SqlUpdate("UPDATE calendar_access SET status = :status, updated_at = :now, updated_by = :updatedBy WHERE calendar_access_id = :calendarAccessId and calendar_id = :calendarId")
    @RegisterBeanMapper(CalendarAccess.class)
    void updateCalendarAccessStatus(@Bind("calendarAccessId") long calendarAccessId, @Bind("calendarId") long calendarId, @Bind("status") String status, @Bind("now") Integer now, @Bind("updatedBy") long updatedBy);

    // Get the number of active and invited accounts that have access to calendars that the user is owner of
    @SqlQuery("""
        SELECT COUNT(a.account_id) AS active_users FROM account a
        WHERE a.account_id IN
            (SELECT ca.account_id FROM calendar_access ca
            WHERE ca.status IN ('active', 'invited')
            AND ca.calendar_id IN
                (SELECT ca.calendar_id FROM account a
                INNER JOIN calendar_access ca ON a.account_id = ca.account_id
                WHERE a.account_id = :accountId
                AND ca.status = 'owner'))
        """)
    @RegisterBeanMapper(Account.class)
    long findNumberOfActiveUsers(@Bind("accountId") long accountId);
    

    // ******************** Email Template ********************

    @SqlQuery("""
            SELECT email_template_id, name, title_fr, title_en, body_fr, body_en
            FROM email_template
            WHERE name = :name""")
    @RegisterBeanMapper(EmailTemplate.class)
    Optional<EmailTemplate> findEmailTemplateByName(@Bind("name") String name);

}
