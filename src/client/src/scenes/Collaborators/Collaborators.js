import React from "react";
import { useEffect, useState } from "react";
import { decideWhatToDisplay, getLocale, textValid, emailValid } from "../../services/Helpers";
import { DateTime } from "luxon";
import Button from "../../components/Form/Button";
import Input from "../../components/Form/Input";
import InvalidFeedback from "../../components/Form/InvalidFeedback";
import Message from "../../components/Form/Message";

export default function Collaborators(props) {
  const getCalendarCollaborators = props.getCalendarCollaborators;
  const inviteCollaborator = props.inviteCollaborator;
  const [name, setName] = useState("");
  const [invalidName, setInvalidName] = useState(false);
  const [email, setEmail] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    getCalendarCollaborators(props.calendar.calendarId);
  }, [props.calendar.calendarId, getCalendarCollaborators])

  useEffect(() => {
    if (requesting) {
      const data = (
        {
          "name": name,
          "email": email
        }
      );
      inviteCollaborator(props.calendar.calendarId, data, result => {
        setResult(result);
        setRequesting(false);
      });
    }
  }, [requesting, name, email, props.calendar.calendarId, inviteCollaborator]);

  function handleSubmit(e) {
    e.preventDefault();
    if (textValid(name) && emailValid(email)) {
      setRequesting(true);
    } else {
      if (!textValid(name)) setInvalidName(true);
      if (!emailValid(email)) setInvalidEmail(true);
    }
  }

  const calendarName = decideWhatToDisplay(props.language, props.calendar.enableEn, props.calendar.enableFr, props.calendar.nameEn, props.calendar.nameFr);
  const title = `${props.translate("Collaborators of")} ${calendarName}`;

  const actionButtonsZone = (
    <div className="mb-4">
      <Button label={props.translate("Back to calendar")} id="button-cancel" onClick={props.cancel} outline={true} />
      <Button label={props.translate("Invite collaborator")} id="button-invite-collaborator" type="button" dataBsToggle="collapse" dataBsTarget="#invite-collaborator" ariaExpanded="false" ariaControls="invite-collaborator" outline={true} />
    </div>
  );

  const inviteCollaboratorForm = (
    <div className="collapse mb-4" id="invite-collaborator">
      <form onSubmit={handleSubmit} id="form-invite-collaborator" noValidate>
        <Input
          label={props.translate("Name")}
          type="text"
          id="input-name"
          required={true}
          placeholder={props.translate("Enter your first name and last name.")}
          value={name}
          handleChange={(e) => {
            setName(e.target.value);
            setInvalidName(false);
          }}
          invalidFeedback={invalidName ? <InvalidFeedback feedback="You must enter a name." /> : null}
        />
        <Input
          label={props.translate("Email")}
          type="email"
          id="input-email"
          required={true}
          placeholder={props.translate("Enter your email address.")}
          value={email}
          handleChange={(e) => {
            setEmail(e.target.value);
            setInvalidEmail(false);
          }}
          invalidFeedback={invalidEmail ? <InvalidFeedback feedback="You must enter a valid email address." /> : null}
        />
        <Button label={props.translate("Cancel")} id="button-cancel-invite-collaborator" type="button" dataBsToggle="collapse" dataBsTarget="#invite-collaborator" ariaExpanded="false" ariaControls="invite-collaborator" outline={true} />
        {/* TODO: disable button when nothing is entered in the form */}
        <Button label={props.translate("Send invitation")} type="submit" working={requesting} id="button-invite" />
      </form>
    </div>
  )

  function collaboratorActions(collaborator) {
    let result = "";
    switch (collaborator.status) {
      case "active":
        result = <Button label={props.translate("Deactivate")} id="button-deactivate" onClick={() => props.deactivateCalendarAccess(props.calendar.calendarId, collaborator.calendarAccessId)} outline={true} />;
        break;
      case "inactive":
        result = <Button label={props.translate("Activate")} id="button-activate" onClick={() => props.activateCalendarAccess(props.calendar.calendarId, collaborator.calendarAccessId)} outline={true} />;
        break;      
      default:
        result = <div className="my-4">&nbsp;</div>;
        break;
    }
    return result;
  }

  function collaborators() {
    // TODO: format nicely and add edit options
    return (
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Status</th>
              <th scope="col">Collaborating since</th>
              <th scope="col">Manage</th>
            </tr>
          </thead>
          <tbody>
            {props.collaborators.map((c, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.status}</td>
                <td>{DateTime.fromSeconds(c.createdAt).setLocale(getLocale(props.language)).toLocaleString(DateTime.DATETIME_FULL)}</td>
                <td>{collaboratorActions(c)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <article>
      <h1>{title}</h1>
      <Message result={result} origin="collaborators" translate={props.translate} />
      {actionButtonsZone}
      {inviteCollaboratorForm}
      {collaborators()}
    </article>
  );
}