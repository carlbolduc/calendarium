import {useState, useEffect} from "react";
import { Redirect } from "react-router-dom";
import Event from "./Event";

export default function MyEvents(props) {
  const [showNewEventForm, setShowNewEventForm] = useState(false);
  const [newEventFormResult, setNewEventFormResult] = useState(null);

  useEffect(() => {
    props.getEvents();
  }, [])

  const events = props.events.map(e => (
    <Event key={e.eventId} event={e} />
  ));

  return props.authenticated ? (
    <div className="p-5">
      <h1>{props.translate("My events")}</h1>
      {events}
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