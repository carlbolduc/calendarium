import axios from "axios";
import {errorCallback} from "./Helpers";

export function useCalendar(token, subscribed) {

  function getCalendars() {
    console.log("TODO: get calendars from the API");
  }

  function createCalendar(data, cb) {
    if (token !== null && subscribed) {
      axios({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        url: `${process.env.REACT_APP_API}/calendars`,
        data: data
      }).then(() => {
        // Success, fetch calendars
        getCalendars();
      }).catch(err => {
        // Let caller know that something went wrong
        errorCallback(err, cb);
      });
    }
  }

  return {getCalendar, createCalendar};
}