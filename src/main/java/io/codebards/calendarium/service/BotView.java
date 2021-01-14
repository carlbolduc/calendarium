package io.codebards.calendarium.service;

import io.dropwizard.views.View;

public class BotView extends View {
    private final String message;

    public BotView(String message) {
        super("bot.ftl");
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
