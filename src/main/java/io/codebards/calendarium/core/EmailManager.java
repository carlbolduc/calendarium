package io.codebards.calendarium.core;

import java.util.List;
import java.util.Optional;

import com.amazonaws.services.simpleemail.AmazonSimpleEmailService;
import com.amazonaws.services.simpleemail.model.*;

import io.codebards.calendarium.api.Language;
import io.codebards.calendarium.db.Dao;

public class EmailManager {
    // This address must be verified with Amazon SES.
    private final String from = "grove@codebards.io";
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

        // The HTML body for the email.
        final String htmlBody = "<h1>Hi, " + oAccount.get().getName() + "</h1>"
                + "<p>Click <a href=\"" + baseUrl + "/password-resets/"
                + passwordResetDigest
                + "\">here</a> to reset your password</p>.";

        // The email body for recipients with non-HTML email clients.
        final String textBody = "Hi, " + oAccount.get().getName() + "\n"
                + "Reach " + baseUrl + "/password-resets/"
                + passwordResetDigest
                + " to reset your password.";

        SendEmailRequest emailRequest = new SendEmailRequest()
                .withDestination(new Destination().withToAddresses(oAccount.get().getEmail()))
                .withMessage(new Message()
                        .withBody(new Body()
                                .withHtml(new Content()
                                        .withCharset("UTF-8").withData(htmlBody))
                                .withText(new Content()
                                        .withCharset("UTF-8").withData(textBody)))
                        .withSubject(new Content()
                                .withCharset("UTF-8").withData("You requested a password reset")))
                .withSource(from);
        emailClient.sendEmail(emailRequest);
    }
}
