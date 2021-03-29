package io.codebards.calendarium.core;

import java.time.Year;
import java.util.List;
import java.util.Optional;

import com.amazonaws.services.simpleemail.AmazonSimpleEmailService;
import com.amazonaws.services.simpleemail.model.*;

import io.codebards.calendarium.api.Calendar;
import io.codebards.calendarium.api.EmailTemplate;
import io.codebards.calendarium.api.Language;
import io.codebards.calendarium.db.Dao;

public class EmailManager {
    // This address must be verified with Amazon SES.
    private final String from = "\"Calendarium\" <grove@codebards.io>";
    private final AmazonSimpleEmailService emailClient;
    private final String baseUrl;
    private final List<Language> allLanguages;
    private final Dao dao;

    public EmailManager(AmazonSimpleEmailService emailClient, String baseUrl, List<Language> allLanguages, Dao dao) {
        this.emailClient = emailClient;
        this.baseUrl = baseUrl;
        this.allLanguages = allLanguages;
        this.dao = dao;
    }

    // If the account is still in the sandbox, to address must be verified.
    public void sendResetPasswordEmail(Optional<Account> oAccount, String passwordResetDigest) {
        // Get account language
        long languageId = oAccount.get().getLanguageId();
        Language language = allLanguages.stream().filter(l -> l.getLanguageId() == languageId).findAny().orElse(null);
        String locale = language.getLocaleId();

        // Get footer template
        String emailFooter = getFooter(oAccount, locale);

        // Get email title and body template
        Optional<EmailTemplate> emailTemplate = getEmailTemplate("Password reset");
        String emailTitle = "";
        String emailBody = "";
        if (locale.equals("enCa")) {
            emailTitle = emailTemplate.get().getTitleEn();
            emailBody = emailTemplate.get().getBodyEn();
        } else {
            emailTitle = emailTemplate.get().getTitleFr();
            emailBody = emailTemplate.get().getBodyFr();
        }

        // Replace template placeholders
        emailBody = replacePlaceholder(emailBody, "\\[account.name\\]", oAccount.get().getName());
        emailBody = replacePlaceholder(emailBody, "\\[reset_password_link\\]", baseUrl + "/password-reset?id=" + passwordResetDigest);

        // Add footer to email body
        emailBody = emailBody + "\n\n\n" + emailFooter;

        SendEmailRequest emailRequest = new SendEmailRequest()
                .withDestination(new Destination().withToAddresses(oAccount.get().getEmail()))
                .withMessage(
                        new Message()
                                .withBody(new Body().withText(new Content().withCharset("UTF-8").withData(emailBody)))
                                .withSubject(new Content().withCharset("UTF-8").withData(emailTitle)))
                .withSource(from);
        emailClient.sendEmail(emailRequest);
    }

    public void sendCollaboratorInvitation(Optional<Account> oAccount, long calendarAccessId, long calendarId, long calendarOwnerAccountId) {
        // Get calendar
        Optional<Calendar> oCalendar = dao.findCalendar(calendarId);

        // Get calendar owner account
        Optional<Account> oCalendarOwner = dao.findAccountById(calendarOwnerAccountId);

        // Get invitee account language
        long languageId = oAccount.get().getLanguageId();
        Language language = allLanguages.stream().filter(l -> l.getLanguageId() == languageId).findAny().orElse(null);
        String locale = language.getLocaleId();

        // Get footer template
        String emailFooter = getFooter(oAccount, locale);

        // Get email title and body template
        Optional<EmailTemplate> emailTemplate = getEmailTemplate("Calendar collaborator invitation");
        String emailTitle = "";
        String emailBody = "";
        if (locale.equals("enCa")) {
            emailTitle = emailTemplate.get().getTitleEn();
            emailBody = emailTemplate.get().getBodyEn();
        } else {
            emailTitle = emailTemplate.get().getTitleFr();
            emailBody = emailTemplate.get().getBodyFr();
        }

        // Generate invitation link
        String calendarLink = "";
        if (locale.equals("enCa")) {
            calendarLink = oCalendar.get().getLinkEn();
        } else {
            calendarLink = oCalendar.get().getLinkFr();
        }
        String invitationLink = baseUrl + "/" + calendarLink + "/accept-invitation?id=" + calendarAccessId;

        // Replace template placeholders
        emailTitle = replacePlaceholder(emailTitle, "\\[calendar_owner.name\\]", oCalendarOwner.get().getName());
        emailTitle = replacePlaceholder(emailTitle, "\\[calendar.nameEn\\]", decideWhatToDisplay("enCa", oCalendar.get().getEnableEn(), oCalendar.get().getEnableFr(), oCalendar.get().getNameEn(), oCalendar.get().getNameFr()));
        emailTitle = replacePlaceholder(emailTitle, "\\[calendar.nameFr\\]", decideWhatToDisplay("frCa", oCalendar.get().getEnableEn(), oCalendar.get().getEnableFr(), oCalendar.get().getNameEn(), oCalendar.get().getNameFr()));
        emailBody = replacePlaceholder(emailBody, "\\[account.name\\]", oAccount.get().getName());
        emailBody = replacePlaceholder(emailBody, "\\[calendar_owner.name\\]", oCalendarOwner.get().getName());
        emailBody = replacePlaceholder(emailBody, "\\[calendar.nameEn\\]", decideWhatToDisplay("enCa", oCalendar.get().getEnableEn(), oCalendar.get().getEnableFr(), oCalendar.get().getNameEn(), oCalendar.get().getNameFr()));
        emailBody = replacePlaceholder(emailBody, "\\[calendar.nameFr\\]", decideWhatToDisplay("frCa", oCalendar.get().getEnableEn(), oCalendar.get().getEnableFr(), oCalendar.get().getNameEn(), oCalendar.get().getNameFr()));
        emailBody = replacePlaceholder(emailBody, "\\[accept_calendar_invitation_link\\]", invitationLink);

        // Add footer to email body
        emailBody = emailBody + "\n\n\n" + emailFooter;

        SendEmailRequest emailRequest = new SendEmailRequest()
                .withDestination(new Destination().withToAddresses(oAccount.get().getEmail()))
                .withMessage(
                        new Message()
                                .withBody(new Body().withText(new Content().withCharset("UTF-8").withData(emailBody)))
                                .withSubject(new Content().withCharset("UTF-8").withData(emailTitle)))
                .withSource(from);
        emailClient.sendEmail(emailRequest);
    }

    public void sendCalendarInvitationAccepted(Optional<Account> oInvitee, long calendarId, long calendarOwnerAccountId) {
        // Get calendar
        Optional<Calendar> oCalendar = dao.findCalendar(calendarId);

        // Get calendar owner account
        Optional<Account> oCalendarOwner = dao.findAccountById(calendarOwnerAccountId);

        // Get owner account language
        long languageId = oCalendarOwner.get().getLanguageId();
        Language language = allLanguages.stream().filter(l -> l.getLanguageId() == languageId).findAny().orElse(null);
        String locale = language.getLocaleId();

        // Get footer template
        String emailFooter = getFooter(oCalendarOwner, locale);

        // Get email title and body template
        Optional<EmailTemplate> emailTemplate = getEmailTemplate("Calendar invitation accepted");
        String emailTitle = "";
        String emailBody = "";
        if (locale.equals("enCa")) {
            emailTitle = emailTemplate.get().getTitleEn();
            emailBody = emailTemplate.get().getBodyEn();
        } else {
            emailTitle = emailTemplate.get().getTitleFr();
            emailBody = emailTemplate.get().getBodyFr();
        }

        // Replace template placeholders
        emailTitle = replacePlaceholder(emailTitle, "\\[account.name\\]", oInvitee.get().getName());
        emailTitle = replacePlaceholder(emailTitle, "\\[calendar.nameEn\\]", decideWhatToDisplay("enCa", oCalendar.get().getEnableEn(), oCalendar.get().getEnableFr(), oCalendar.get().getNameEn(), oCalendar.get().getNameFr()));
        emailTitle = replacePlaceholder(emailTitle, "\\[calendar.nameFr\\]", decideWhatToDisplay("frCa", oCalendar.get().getEnableEn(), oCalendar.get().getEnableFr(), oCalendar.get().getNameEn(), oCalendar.get().getNameFr()));
        emailBody = replacePlaceholder(emailBody, "\\[calendar_owner.name\\]", oCalendarOwner.get().getName());
        emailBody = replacePlaceholder(emailBody, "\\[account.name\\]", oInvitee.get().getName());
        emailBody = replacePlaceholder(emailBody, "\\[calendar.nameEn\\]", decideWhatToDisplay("enCa", oCalendar.get().getEnableEn(), oCalendar.get().getEnableFr(), oCalendar.get().getNameEn(), oCalendar.get().getNameFr()));
        emailBody = replacePlaceholder(emailBody, "\\[calendar.nameFr\\]", decideWhatToDisplay("frCa", oCalendar.get().getEnableEn(), oCalendar.get().getEnableFr(), oCalendar.get().getNameEn(), oCalendar.get().getNameFr()));

        // Add footer to email body
        emailBody = emailBody + "\n\n\n" + emailFooter;

        SendEmailRequest emailRequest = new SendEmailRequest()
                .withDestination(new Destination().withToAddresses(oCalendarOwner.get().getEmail()))
                .withMessage(
                        new Message()
                                .withBody(new Body().withText(new Content().withCharset("UTF-8").withData(emailBody)))
                                .withSubject(new Content().withCharset("UTF-8").withData(emailTitle)))
                .withSource(from);
        emailClient.sendEmail(emailRequest);
    }

    private Optional<EmailTemplate> getEmailTemplate(String emailTemplate) {
        return dao.findEmailTemplateByName(emailTemplate);
    }

    private String getFooter(Optional<Account> oAccount, String locale) {
        // Get footer template
        Optional<EmailTemplate> footerTemplate = dao.findEmailTemplateByName("Email footer");

        // Get body string for the desired locale
        String emailFooter = "";
        if (locale.equals("enCa")) {
            emailFooter = footerTemplate.get().getBodyEn();
        } else {
            emailFooter = footerTemplate.get().getBodyFr();
        }

        // Replace placeholder
        String thisYear = Year.now().toString();
        emailFooter = replacePlaceholder(emailFooter, "\\[current_year\\]", thisYear);
        emailFooter = replacePlaceholder(emailFooter, "\\[account.email\\]", oAccount.get().getEmail());

        // Return footer text ready to use
        return emailFooter;
    }

    private String replacePlaceholder(String sourceText, String placeholder, String replacement) {
        return sourceText.replaceAll(placeholder, replacement);
    }

    private String decideWhatToDisplay(String language, Boolean enableEn, Boolean enableFr, String textEn, String textFr) {
        String result;
        if (language.equals("enCa") && enableEn) { // we're in English and the calendar has English enabled
            result = textEn;
        } else if (language.equals("frCa") && enableFr) { // we're in French and the calendar has French enabled
            result = textFr;
        } else if (enableEn && !textEn.isEmpty()) { // none of the above, the calendar has English enabled and text isn't empty
            result = textEn;
        } else { // none of the above, we must use the French text
            result = textFr;
        }
        return result;      
    }

}
