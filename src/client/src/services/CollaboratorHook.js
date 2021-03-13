import { useState } from "react";
import axios from "axios";
import { errorCallback } from "./Helpers";

export function useCollaborator(token) {
  const [collaborators, setCollaborators] = useState([]);
  const [calendarAccess, setCalendarAccess] = useState({
    calendarAccessId: null,
    accountId: null,
    calendarId: null,
    status: ""
  })

  function getCalendarCollaborators(calendarId) {
    if (token !== null) {
      axios({
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        url: `${process.env.REACT_APP_API}/calendar_collaborators/${calendarId}`,
      }).then(res => {
        setCollaborators(res.data);
      }).catch(err => {
        console.log("THIS SHOULD NEVER HAPPEN, error in 'getCalendarCollaborators' from 'useCollaborator' hook");
        console.log(err.response);
      });
    }
  }

  function inviteCollaborator(calendarId, data, cb) {
    if (token !== null) {
      axios({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        url: `${process.env.REACT_APP_API}/calendar_collaborators/${calendarId}`,
        data: data
      }).then(() => {
        if (cb) {
          const result = {
            success: true
          }
          cb(result);
        }
      }).catch(err => {
        // Let caller know that something went wrong
        errorCallback(err, cb);
      });
    }
  }

  function getCalendarInvitation(data) {
    const url = `${process.env.REACT_APP_API}/calendar_collaborators/${data.calendarId}/${data.calendarAccessId}`;
    const header = token !== null
      ? { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
      : { "Content-Type": "application/json" }
    axios({
      method: "GET",
      headers: header,
      url: url,
    }).then(res => {
      setCalendarAccess(res.data);
    }).catch(err => {
      // TODO: manage error cases
      console.log("THIS SHOULD NEVER HAPPEN, error in 'getCalendarCollaborators' from 'useCollaborator' hook");
      console.log(err.response);
    });
  }

  function acceptCalendarInvitation() {
    // TODO: write the code to acccept a calendar invitation
  }

  return { collaborators, calendarAccess, getCalendarCollaborators, inviteCollaborator, getCalendarInvitation, acceptCalendarInvitation };
}
