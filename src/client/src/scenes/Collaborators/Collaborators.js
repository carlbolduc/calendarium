import { useEffect, useState } from "react";
import { decideWhatToDisplay, getLocale } from "../../services/Helpers";
import { DateTime } from "luxon";
import Button from "../../components/Form/Button";

export default function Collaborators(props) {

  useEffect(() => {
    props.getCalendarCollaborators(props.calendar.calendarId);
  }, [])

  const title = (
    <>
      {props.translate("Collaborators of")} {decideWhatToDisplay(props.language, props.calendar.enableEn, props.calendar.enableFr, props.calendar.nameEn, props.calendar.nameFr)}
    </>
  );

  const actionButtonsZone = (
    <div className="mb-4">
      <Button label={props.translate("Back to calendar")} id="button-cancel" onClick={props.cancel} outline={true} />
      <Button label="Invite collaborator" id="button-invite-collaborator" outline={true} />
    </div>
  );

  function users() {
    // TODO: format nicely and add edit options
    return (
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Status</th>
            <th scope="col">Collaborating since</th>
          </tr>
        </thead>
        <tbody>
          {props.collaborators.map((m, index) => (
            <tr>
              <th scope="row">{index + 1}</th>
              <td>{m.name}</td>
              <td>{m.email}</td>
              <td>{m.status}</td>
              <td>{DateTime.fromSeconds(m.createdAt).setLocale(getLocale(props.language)).toLocaleString(DateTime.DATETIME_FULL)}</td>
            </tr>
          ))}
        </tbody>
      </table>)
  }

  return (
    <>
      <h1>{title}</h1>
      {actionButtonsZone}
      {users()}
    </>
  );
}