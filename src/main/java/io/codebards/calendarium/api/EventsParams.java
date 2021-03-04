package io.codebards.calendarium.api;

import java.time.Instant;

public class EventsParams {
    
    private Instant startAt;

    public Instant getStartAt() {
        return startAt;
    }

    public void setStartAt(Instant startAt) {
        this.startAt = startAt;
    }

}
