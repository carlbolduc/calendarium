import {useState, useEffect} from "react";
import axios from "axios";
import {errorCallback} from "./Helpers";

export function useCalendar(token, subscribed) {
  const [calendars, setCalendars] = useState([]);
  const [calendar, setCalendar] = useState(null);

  useEffect(() => {
    if (token !== null) {
      // TODO: move this into the MyCalendar initial mount function
      getCalendars();
    }
  }, [token]);

  function getCalendars() {
    if (token !== null) {
      axios({
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        url: `${process.env.REACT_APP_API}/calendars`,
      }).then(res => {
        setCalendars(res.data);
      }).catch(err => {
        console.log("THIS SHOULD NEVER HAPPEN, error in 'getCalendars' from 'useCalendar' hook");
        console.log(err.response);
      });
    }
  }

  function getCalendar(link, cb) {
    if (token !== null) {
      axios({
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        url: `${process.env.REACT_APP_API}/calendars/${link}`,
      }).then(res => {
        setCalendar(res.data);
      }).catch(err => {
        console.log("THIS SHOULD NEVER HAPPEN, error in 'getCalendars' from 'useCalendar' hook");
        console.log(err.response);
      });
    }
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

  return {calendars, calendar, getCalendars, getCalendar, createCalendar};
}