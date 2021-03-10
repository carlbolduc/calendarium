package io.codebards.calendarium.core;

import java.time.Year;
import java.util.List;
import java.util.Optional;

import com.amazonaws.services.simpleemail.AmazonSimpleEmailService;
import com.amazonaws.services.simpleemail.model.*;

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
        emailBody = replacePlaceholder(emailBody, "\\[reset_password_link\\]", baseUrl + "/password-resets/" + passwordResetDigest);

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

}
