-- Pour faire la migration, exécuter dbMigrate pour créer le fichier de bd vide, puis exécuter les selects ci-desosus un par un dans DataGrip Query Console, et copier-coller l'output dans chacune des tables SQLite

-- 1. language
select language_id,
       locale_id,
       name,
       EXTRACT(EPOCH FROM created_at) AS created_at,
       created_by,
       EXTRACT(EPOCH FROM updated_at) AS updated_at,
       updated_by
from language;

-- 2. localisation
select localisation_id,
       en_ca,
       fr_ca,
       EXTRACT(EPOCH FROM created_at) AS created_at,
       created_by,
       EXTRACT(EPOCH FROM updated_at) AS updated_at,
       updated_by
from localisation
where localisation_id <> 1;

-- 3. account
select account_id,
       email,
       name,
       stripe_cus_id,
       language_id,
       password_digest,
       password_reset_digest,
       EXTRACT(EPOCH FROM password_reset_requested_at) AS password_reset_requested_at,
       EXTRACT(EPOCH FROM created_at) AS created_at,
       created_by,
       EXTRACT(EPOCH FROM updated_at) AS updated_at,
       updated_by
from account
order by 1;

-- 4. account_token
select account_token_id,
       selector,
       validator,
       account_id,
       EXTRACT(EPOCH FROM created_at) AS created_at,
       created_by,
       EXTRACT(EPOCH FROM updated_at) AS updated_at,
       updated_by
from account_token
order by 1;

-- 5. price
select * from price order by 1;

-- 6. subscription
select subscription_id,
       account_id,
       price_id,
       stripe_sub_id,
       EXTRACT(EPOCH FROM start_at) AS start_at,
       EXTRACT(EPOCH FROM end_at) AS end_at,
       status,
       EXTRACT(EPOCH FROM created_at) AS created_at,
       created_by,
       EXTRACT(EPOCH FROM updated_at) AS updated_at,
       updated_by
from subscription
order by 1;

-- 7. calendar
select calendar_id,
       CASE WHEN enable_fr THEN 1 ELSE 0 END AS enable_fr,
       CASE WHEN enable_en THEN 1 ELSE 0 END AS enable_en,
       name_fr,
       name_en,
       description_fr,
       description_en,
       link_fr,
       link_en,
       primary_color,
       secondary_color,
       start_week_on,
       CASE WHEN public_calendar THEN 1 ELSE 0 END AS public_calendar,
       CASE WHEN event_approval_required THEN 1 ELSE 0 END AS event_approval_required,
       EXTRACT(EPOCH FROM created_at) AS created_at,
       created_by,
       EXTRACT(EPOCH FROM updated_at) AS updated_at,
       updated_by,
       CASE WHEN embed_calendar THEN 1 ELSE 0 END AS embed_calendar,
       CASE WHEN show_event_author THEN 1 ELSE 0 END AS show_event_author
from calendar
order by 1;

-- 8. calendar_access
select calendar_access_id,
       account_id,
       calendar_id,
       status,
       EXTRACT(EPOCH FROM created_at) AS created_at,
       created_by,
       EXTRACT(EPOCH FROM updated_at) AS updated_at,
       updated_by
from calendar_access
order by 1;

-- 9. event
select event_id,
       account_id,
       calendar_id,
       status,
       name_fr,
       name_en,
       description_fr,
       description_en,
       EXTRACT(EPOCH FROM start_at) AS start_at,
       EXTRACT(EPOCH FROM end_at) AS end_at,
       CASE WHEN all_day THEN 1 ELSE 0 END AS all_day,
       hyperlink_fr,
       hyperlink_en,
       EXTRACT(EPOCH FROM created_at) AS created_at,
       created_by,
       EXTRACT(EPOCH FROM updated_at) AS updated_at,
       updated_by
from event
order by 1;

-- 10. email_template
select email_template_id,
       name,
       title_fr,
       title_en,
       body_fr,
       body_en,
       EXTRACT(EPOCH FROM created_at) AS created_at,
       created_by,
       EXTRACT(EPOCH FROM updated_at) AS updated_at,
       updated_by
from email_template
order by 1;

-- 11. activity --> table vide, ne sert pas encore mais devait éventuellement contenir les logs d'utilisation

-- 12. tax
select tax_id,
       stripe_tax_id,
       description,
       EXTRACT(EPOCH FROM created_at) AS created_at,
       created_by,
       EXTRACT(EPOCH FROM updated_at) AS updated_at,
       updated_by
from tax
order by 1;