package io.codebards.calendarium.core;

import com.amazonaws.services.simpleemail.AmazonSimpleEmailService;
import com.amazonaws.services.simpleemail.model.*;

public class EmailManager {
    // This address must be verified with Amazon SES.
    private final String from = "grove@codebards.io";
    private final AmazonSimpleEmailService emailClient;
    private final String baseUrl;

    public EmailManager(AmazonSimpleEmailService emailClient, String baseUrl) {
        this.emailClient = emailClient;
        this.baseUrl = baseUrl;
    }

    // If the account is still in the sandbox, to address must be verified.
    public void sendResetPasswordEmail(String to, String name, String passwordResetDigest) {

        // The HTML body for the email.
        final String htmlBody = "<h1>Hi, " + name + "</h1>"
                + "<p>Click <a href=\"" + baseUrl + "/password-resets/"
                + passwordResetDigest
                + "\">here</a> to reset your password</p>.";

        // The email body for recipients with non-HTML email clients.
        final String textBody = "Hi, " + name + "\n"
                + "Reach " + baseUrl + "/reset-password?digest="
                + passwordResetDigest
                + " to reset your password.";

        SendEmailRequest emailRequest = new SendEmailRequest()
                .withDestination(new Destination().withToAddresses(to))
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
