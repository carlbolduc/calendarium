-- execute this sql script in the database query console after initial db migrate
drop trigger if exists language_row_created_at;
create trigger language_row_created_at
    after insert on language for each row
begin
    update language set created_at = date('now') where language_id = new.language_id;
end;

drop trigger if exists language_row_created_by;
create trigger language_row_created_by
    after insert on language for each row
    when new.created_by is null
begin
    update language set created_by = 0 where language_id = new.language_id;
end;

drop trigger if exists language_row_updated_at;
create trigger language_row_updated_at
    after update on language for each row
begin
    update language set updated_at = date('now') where language_id = new.language_id;
end;

drop trigger if exists language_row_updated_by;
create trigger language_row_updated_by
    after update on language for each row
    when new.updated_by is null
begin
    update language set updated_by = 0 where language_id = new.language_id;
end;

drop trigger if exists localisation_row_created_at;
create trigger localisation_row_created_at
    after insert on localisation for each row
begin
    update localisation set created_at = date('now') where localisation_id = new.localisation_id;
end;

drop trigger if exists localisation_row_created_by;
create trigger localisation_row_created_by
    after insert on localisation for each row
    when new.created_by is null
begin
    update localisation set created_by = 0 where localisation_id = new.localisation_id;
end;

drop trigger if exists localisation_row_updated_at;
create trigger localisation_row_updated_at
    after update on localisation for each row
begin
    update localisation set updated_at = date('now') where localisation_id = new.localisation_id;
end;

drop trigger if exists localisation_row_updated_by;
create trigger localisation_row_updated_by
    after update on localisation for each row
    when new.updated_by is null
begin
    update localisation set updated_by = 0 where localisation_id = new.localisation_id;
end;

drop trigger if exists account_row_created_at;
create trigger account_row_created_at
    after insert on account for each row
begin
    update account set created_at = date('now') where account_id = new.account_id;
end;

drop trigger if exists account_row_created_by;
create trigger account_row_created_by
    after insert on account for each row
    when new.created_by is null
begin
    update account set created_by = 0 where account_id = new.account_id;
end;

drop trigger if exists account_row_updated_at;
create trigger account_row_updated_at
    after update on account for each row
begin
    update account set updated_at = date('now') where account_id = new.account_id;
end;

drop trigger if exists account_row_updated_by;
create trigger account_row_updated_by
    after update on account for each row
    when new.updated_by is null
begin
    update account set updated_by = 0 where account_id = new.account_id;
end;

drop trigger if exists account_token_row_created_at;
create trigger account_token_row_created_at
    after insert on account_token for each row
begin
    update account_token set created_at = date('now') where account_token_id = new.account_token_id;
end;

drop trigger if exists account_token_row_created_by;
create trigger account_token_row_created_by
    after insert on account_token for each row
    when new.created_by is null
begin
    update account_token set created_by = 0 where account_token_id = new.account_token_id;
end;

drop trigger if exists account_token_row_updated_at;
create trigger account_token_row_updated_at
    after update on account_token for each row
begin
    update account_token set updated_at = date('now') where account_token_id = new.account_token_id;
end;

drop trigger if exists account_token_row_updated_by;
create trigger account_token_row_updated_by
    after update on account_token for each row
    when new.updated_by is null
begin
    update account_token set updated_by = 0 where account_token_id = new.account_token_id;
end;

drop trigger if exists subscription_row_created_at;
create trigger subscription_row_created_at
    after insert on subscription for each row
begin
    update subscription set created_at = date('now') where subscription_id = new.subscription_id;
end;

drop trigger if exists subscription_row_created_by;
create trigger subscription_row_created_by
    after insert on subscription for each row
    when new.created_by is null
begin
    update subscription set created_by = 0 where subscription_id = new.subscription_id;
end;

drop trigger if exists subscription_row_updated_at;
create trigger subscription_row_updated_at
    after update on subscription for each row
begin
    update subscription set updated_at = date('now') where subscription_id = new.subscription_id;
end;

drop trigger if exists subscription_row_updated_by;
create trigger subscription_row_updated_by
    after update on subscription for each row
    when new.updated_by is null
begin
    update subscription set updated_by = 0 where subscription_id = new.subscription_id;
end;

drop trigger if exists calendar_row_created_at;
create trigger calendar_row_created_at
    after insert on calendar for each row
begin
    update calendar set created_at = date('now') where calendar_id = new.calendar_id;
end;

drop trigger if exists calendar_row_created_by;
create trigger calendar_row_created_by
    after insert on calendar for each row
    when new.created_by is null
begin
    update calendar set created_by = 0 where calendar_id = new.calendar_id;
end;

drop trigger if exists calendar_row_updated_at;
create trigger calendar_row_updated_at
    after update on calendar for each row
begin
    update calendar set updated_at = date('now') where calendar_id = new.calendar_id;
end;

drop trigger if exists calendar_row_updated_by;
create trigger calendar_row_updated_by
    after update on calendar for each row
    when new.updated_by is null
begin
    update calendar set updated_by = 0 where calendar_id = new.calendar_id;
end;

drop trigger if exists calendar_access_row_created_at;
create trigger calendar_access_row_created_at
    after insert on calendar_access for each row
begin
    update calendar_access set created_at = date('now') where calendar_access_id = new.calendar_access_id;
end;

drop trigger if exists calendar_access_row_created_by;
create trigger calendar_access_row_created_by
    after insert on calendar_access for each row
    when new.created_by is null
begin
    update calendar_access set created_by = 0 where calendar_access_id = new.calendar_access_id;
end;

drop trigger if exists calendar_access_row_updated_at;
create trigger calendar_access_row_updated_at
    after update on calendar_access for each row
begin
    update calendar_access set updated_at = date('now') where calendar_access_id = new.calendar_access_id;
end;

drop trigger if exists calendar_access_row_updated_by;
create trigger calendar_access_row_updated_by
    after update on calendar_access for each row
    when new.updated_by is null
begin
    update calendar_access set updated_by = 0 where calendar_access_id = new.calendar_access_id;
end;

drop trigger if exists event_row_created_at;
create trigger event_row_created_at
    after insert on event for each row
begin
    update event set created_at = date('now') where event_id = new.event_id;
end;

drop trigger if exists event_row_created_by;
create trigger event_row_created_by
    after insert on event for each row
    when new.created_by is null
begin
    update event set created_by = 0 where event_id = new.event_id;
end;

drop trigger if exists event_row_updated_at;
create trigger event_row_updated_at
    after update on event for each row
begin
    update event set updated_at = date('now') where event_id = new.event_id;
end;

drop trigger if exists event_row_updated_by;
create trigger event_row_updated_by
    after update on event for each row
    when new.updated_by is null
begin
    update event set updated_by = 0 where event_id = new.event_id;
end;

drop trigger if exists email_template_row_created_at;
create trigger email_template_row_created_at
    after insert on email_template for each row
begin
    update email_template set created_at = date('now') where email_template_id = new.email_template_id;
end;

drop trigger if exists email_template_row_created_by;
create trigger email_template_row_created_by
    after insert on email_template for each row
    when new.created_by is null
begin
    update email_template set created_by = 0 where email_template_id = new.email_template_id;
end;

drop trigger if exists email_template_row_updated_at;
create trigger email_template_row_updated_at
    after update on email_template for each row
begin
    update email_template set updated_at = date('now') where email_template_id = new.email_template_id;
end;

drop trigger if exists email_template_row_updated_by;
create trigger email_template_row_updated_by
    after update on email_template for each row
    when new.updated_by is null
begin
    update email_template set updated_by = 0 where email_template_id = new.email_template_id;
end;

drop trigger if exists activity_row_created_at;
create trigger activity_row_created_at
    after insert on activity for each row
begin
    update activity set created_at = date('now') where activity_id = new.activity_id;
end;

drop trigger if exists activity_row_created_by;
create trigger activity_row_created_by
    after insert on activity for each row
    when new.created_by is null
begin
    update activity set created_by = 0 where activity_id = new.activity_id;
end;

drop trigger if exists activity_row_updated_at;
create trigger activity_row_updated_at
    after update on activity for each row
begin
    update activity set updated_at = date('now') where activity_id = new.activity_id;
end;

drop trigger if exists activity_row_updated_by;
create trigger activity_row_updated_by
    after update on activity for each row
    when new.updated_by is null
begin
    update activity set updated_by = 0 where activity_id = new.activity_id;
end;

drop trigger if exists tax_row_created_at;
create trigger tax_row_created_at
    after insert on tax for each row
begin
    update tax set created_at = date('now') where tax_id = new.tax_id;
end;

drop trigger if exists tax_row_created_by;
create trigger tax_row_created_by
    after insert on tax for each row
    when new.created_by is null
begin
    update tax set created_by = 0 where tax_id = new.tax_id;
end;

drop trigger if exists tax_row_updated_at;
create trigger tax_row_updated_at
    after update on tax for each row
begin
    update tax set updated_at = date('now') where tax_id = new.tax_id;
end;

drop trigger if exists tax_row_updated_by;
create trigger tax_row_updated_by
    after update on tax for each row
    when new.updated_by is null
begin
    update tax set updated_by = 0 where tax_id = new.tax_id;
end;
