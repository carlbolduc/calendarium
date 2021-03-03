import { useEffect, useState } from "react";
import { decideWhatToDisplay, getLocale } from "../../services/Helpers";
import { DateTime } from "luxon";
import Button from "../../components/Form/Button";

export default function Users(props) {

  useEffect(() => {
    props.getCalendarUsers(props.calendar.calendarId);
  }, [])

  const title = (
    <>
      {props.translate("Users of")} {decideWhatToDisplay(props.language, props.calendar.enableEn, props.calendar.enableFr, props.calendar.nameEn, props.calendar.nameFr)}
    </>
  );

  const actionButtonsZone = (
    <div className="mb-4">
      <Button label={props.translate("Back to calendar")} id="button-cancel" onClick={props.cancel} outline={true} />
      <Button label="Invite user" id="button-invite-user" outline={true} />
    </div>
  );

  function users() {
    // TODO: format nicely and add edit options
    return (
      <ul>
        {props.users.map((u, index) => (<li key={index}>{u.name} - {u.email} - {u.status} - {DateTime.fromSeconds(u.createdAt).setLocale(getLocale(props.language)).toLocaleString(DateTime.DATETIME_FULL)}</li>))}
      </ul>
    )
  } 

  return (
    <>
      <h1>{title}</h1>
      {actionButtonsZone}
      {users()}
    </>
  );
}