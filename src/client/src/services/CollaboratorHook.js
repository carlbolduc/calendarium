import { useCallback, useState } from "react";
import axios from "axios";
import { errorCallback } from "./Helpers";

export function useCollaborator(token, saveToken) {
  const [collaborators, setCollaborators] = useState([]);
  const [calendarAccess, setCalendarAccess] = useState({
    calendarAccessId: null,
    accountId: null,
    calendarId: null,
    status: ""
  });

  const getCollaborators = useCallback((calendarId) => {
    if (token !== null) {
      axios({
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        url: `${process.env.REACT_APP_API}/collaborators/${calendarId}`,
      }).then(res => {
        setCollaborators(res.data);
      }).catch(err => {
        console.log("THIS SHOULD NEVER HAPPEN, error in 'getCollaborators' from 'useCollaborator' hook");
        console.log(err.response);
      });
    }
  }, [token]);

  const inviteCollaborator = useCallback((calendarId, data, cb) => {
    if (token !== null) {
      axios({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        url: `${process.env.REACT_APP_API}/collaborators/${calendarId}`,
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
  }, [token]);

  const getCalendarInvitation = useCallback((data) => {
    const url = `${process.env.REACT_APP_API}/collaborators/${data.calendarId}/${data.calendarAccessId}`;
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
      console.log("THIS SHOULD NEVER HAPPEN, error in 'getCalendarInvitation' from 'useCollaborator' hook");
      console.log(err.response);
    });
  }, [token]);

  const acceptCalendarInvitation = useCallback((data, cb) => {
    const url = `${process.env.REACT_APP_API}/collaborators/${data.calendarId}/accept_invitation/${data.calendarAccessId}`;
    const header = token !== null
      ? { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
      : { "Content-Type": "application/json" }
    axios({
      method: "PUT",
      headers: header,
      url: url,
      data: data
    }).then(res => {
      if (res.status === 200) {
        if (res.data.token !== undefined) {
          saveToken(res.data.token);
        }
        if (cb) {
          const result = {
            success: true
          }
          cb(result);
        }
      } else {
        // something failed
      }
    }).catch(err => {
      // Let caller know that something went wrong
      errorCallback(err, cb);
    });
  }, [token, saveToken]);

  function deactivateCalendarAccess(calendarId, calendarAccessId) {
    if (token !== null) {
      axios({
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        url: `${process.env.REACT_APP_API}/collaborators/${calendarId}/${calendarAccessId}`,
        data: "inactive"
      }).then(res => {
        setCollaborators(res.data);
      }).catch(err => {
        console.log("THIS SHOULD NEVER HAPPEN, error in 'deactivateCalendarAccess' from 'useCollaborator' hook");
        console.log(err.response);
      });
    }
  }

  function activateCalendarAccess(calendarId, calendarAccessId) {
    if (token !== null) {
      axios({
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        url: `${process.env.REACT_APP_API}/collaborators/${calendarId}/${calendarAccessId}`,
        data: "active"
      }).then(res => {
        setCollaborators(res.data);
      }).catch(err => {
        console.log("THIS SHOULD NEVER HAPPEN, error in 'deactivateCalendarAccess' from 'useCollaborator' hook");
        console.log(err.response);
      });
    }
  }

  return { collaborators, calendarAccess, getCollaborators, inviteCollaborator, getCalendarInvitation, acceptCalendarInvitation, deactivateCalendarAccess, activateCalendarAccess };
}
