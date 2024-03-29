import React from "react";
import { useEffect, useState } from "react";
import { decideWhatToDisplay, getLocale, textValid, emailValid, productMaxUsers } from "../../services/Helpers";
import { DateTime } from "luxon";
import Button from "../../components/Form/Button";
import Input from "../../components/Form/Input";
import InvalidFeedback from "../../components/Form/InvalidFeedback";
import Message from "../../components/Form/Message";

export default function Collaborators(props) {
  const getCollaborators = props.getCollaborators;
  const inviteCollaborator = props.inviteCollaborator;
  const [name, setName] = useState("");
  const [invalidName, setInvalidName] = useState(false);
  const [email, setEmail] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [working, setWorking] = useState(false);
  const [result, setResult] = useState("");
  const [messageOrigin, setMessageOrigin] = useState("");

  useEffect(() => {
    getCollaborators(props.calendar.calendarId);
  }, [props.calendar.calendarId, getCollaborators])

  function handleSubmit(e) {
    e.preventDefault();
    if (textValid(name) && emailValid(email)) {
      setWorking(true);
      const data = (
        {
          "name": name,
          "email": email
        }
      );
      inviteCollaborator(props.calendar.calendarId, data, result => {
        if (result.success) {
          setName("");
          setEmail("");
        }
        setResult(result);
        setMessageOrigin("inviteCollaborator");
        setWorking(false);
      });
    } else {
      if (!textValid(name)) setInvalidName(true);
      if (!emailValid(email)) setInvalidEmail(true);
    }
  }

  const calendarName = decideWhatToDisplay(props.localeId, props.calendar.enableEn, props.calendar.enableFr, props.calendar.nameEn, props.calendar.nameFr);
  const title = `${props.translate("Collaborators of")} ${calendarName}`;

  function inviteCollaboratorButton() {
    let result = null;
    let maxUsers = 0;
    switch (props.account.subscription.product) {
      case "trial":
        maxUsers = productMaxUsers.TRIAL;
        break;
      case "monthly":
        maxUsers = productMaxUsers.MONTHLY;
        break;
      case "unlimited":
        maxUsers = productMaxUsers.UNLIMITED;
        break;
    }
    // Show Invite collaborator button when collaborator limit isn't reached
    if (maxUsers === 0 || maxUsers > props.account.activeUsers) {
      result = (
        <Button label={props.translate("Invite collaborator")} id="button-invite-collaborator" type="button" dataBsToggle="collapse" dataBsTarget="#invite-collaborator" ariaExpanded="false" ariaControls="invite-collaborator" outline={true} />
      );
    }
    return result;
  }

  const actionButtonsZone = (
    <div className="mb-4">
      <Button label={props.translate("Back to calendar")} id="button-cancel" onClick={props.cancel} outline={true} />
      {inviteCollaboratorButton()}
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
          value={name}
          handleChange={(e) => {
            setName(e.target.value);
            setInvalidName(false);
          }}
          invalidFeedback={invalidName ? <InvalidFeedback feedback={props.translate("You must enter a first name and last name.")} /> : null}
        />
        <Input
          label={props.translate("Email")}
          type="email"
          id="input-email"
          required={true}
          value={email}
          handleChange={(e) => {
            setEmail(e.target.value);
            setInvalidEmail(false);
          }}
          invalidFeedback={invalidEmail ? <InvalidFeedback feedback={props.translate("You must enter a valid email address.")} /> : null}
        />
        <Button label={props.translate("Cancel")} id="button-cancel-invite-collaborator" type="button" dataBsToggle="collapse" dataBsTarget="#invite-collaborator" ariaExpanded="false" ariaControls="invite-collaborator" outline={true} />
        {/* TODO: disable button when nothing is entered in the form */}
        <Button label={props.translate("Send invitation")} type="submit" id="button-invite" working={working} />
      </form>
    </div>
  )

  function collaboratorActions(collaborator) {
    let result;
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
    return (
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr className="text-nowrap">
              <th scope="col">#</th>
              <th scope="col">{props.translate("Name")}</th>
              <th scope="col">{props.translate("Email")}</th>
              <th scope="col">{props.translate("Status")}</th>
              <th scope="col">{props.translate("Collaborating since")}</th>
              <th scope="col">{props.translate("Manage")}</th>
            </tr>
          </thead>
          <tbody>
            {props.collaborators.map((c, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{props.translate(c.status)}</td>
                <td>{c.createdAt === null ? "" : DateTime.fromSeconds(c.createdAt).setLocale(getLocale(props.localeId)).toLocaleString(DateTime.DATETIME_FULL)}</td>
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
      <Message result={result} origin={messageOrigin} translate={props.translate} />
      {actionButtonsZone}
      {inviteCollaboratorForm}
      {collaborators()}
    </article>
  );
}