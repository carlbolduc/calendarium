import { useState } from "react";
import axios from "axios";
import {errorCallback} from "./Helpers";

export function useCollaborator(token) {
  const [collaborators, setCollaborators] = useState([]);

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
        console.log("THIS SHOULD NEVER HAPPEN, error in 'getEvents' from 'useEvent' hook");
        console.log(err.response);
      });
    }
  }

  function inviteCollaborator(data, cb) {
    if (token !== null) {
      axios({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        url: `${process.env.REACT_APP_API}/calendar_collaborators`,
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

  return { collaborators, getCalendarCollaborators, inviteCollaborator };
}
