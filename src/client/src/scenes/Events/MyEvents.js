import {useState, useEffect} from "react";
import { Redirect } from "react-router-dom";
import Event from "./Event";
import EventForm from "./EventForm";
import Button from "../../components/Form/Button";

export default function MyEvents(props) {
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventFormResult, setEventFormResult] = useState(null);

  useEffect(() => {
    props.getEvents();
  }, [])

  const events = props.events.map(e => (
    <Event key={e.eventId} event={e} />
  ));

  const newEventButton = showEventForm ? null : (
    <Button
      label={props.translate("New event")}
      id="button-new-event"
      onClick={() => {
        setShowEventForm(true);
        setEventFormResult(null);
      }}
    />
  );

  const eventForm = showEventForm ? (
    <EventForm
      translate={props.translate}
      cancel={() => setShowEventForm(false)}
      createEvent={props.createEvent}
      hideForm={() => setShowEventForm(false)}
      setResult={setEventFormResult}
      />
  ) : null;

  return props.authenticated ? (
    <div className="p-5">
      <h1>{props.translate("My events")}</h1>
      {newEventButton}
      {events}
      {eventForm}
    </div>
  ) : (
    <Redirect
      to={{
        pathname: "/sign-in",
        state: { from: "/subscription" }
      }}
    />
  );
}