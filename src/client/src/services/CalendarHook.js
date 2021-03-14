import { useState, useEffect } from "react";
import axios from "axios";
import { errorCallback } from "./Helpers";

export function useCalendar(token, subscribed) {
  const [calendars, setCalendars] = useState([]);
  const [calendar, setCalendar] = useState({
    calendarId: null,
    enableEn: false,
    enableFr: false,
    nameEn: "",
    nameFr: "",
    descriptionEn: "",
    descriptionFr: "",
    linkEn: "",
    linkFr: "",
    startWeekOn: "Sunday",
    primaryColor: "#ffffff",
    secondaryColor: "#ffffff",
    publicCalendar: false,
    eventApprovalRequired: true,
    access: ""
  });
  const [calendarEvents, setCalendarEvents] = useState([]);

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

  function getCalendar(data, cb) {
    const url = data.calendarAccessId === undefined
      ? `${process.env.REACT_APP_API}/calendars/${data.link}`
      : `${process.env.REACT_APP_API}/calendars/anonymous/${data.link}?id=${data.calendarAccessId}`;
    const header = token !== null
      ? { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
      : { "Content-Type": "application/json" }
    axios({
      method: "GET",
      headers: header,
      url: url,
    }).then(res => {
      setCalendar(res.data);
    }).catch(err => {
      console.log("THIS SHOULD NEVER HAPPEN, error in 'getCalendars' from 'useCalendar' hook");
      console.log(err.response);
    });
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

  function updateCalendar(calendarId, data, cb) {
    if (token !== null && subscribed) {
      axios({
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        url: `${process.env.REACT_APP_API}/calendars/${calendarId}`,
        data: data
      }).then(() => {
        // Success, fetch calendar
        getCalendar(data.linkEn, cb);
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

  function deleteCalendar(calendarId, cb) {
    if (token !== null && subscribed) {
      axios({
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        url: `${process.env.REACT_APP_API}/calendars/${calendarId}`
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

  function getCalendarEvents(calendarId, q, cb) {
    if (token !== null) {
      axios({
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        url: `${process.env.REACT_APP_API}/calendars/${calendarId}/events?q=${q}`,
      }).then(res => {
        setCalendarEvents(res.data);
      }).catch(err => {
        console.log("THIS SHOULD NEVER HAPPEN, error in 'getCalendarEvents' from 'useCalendar' hook");
        console.log(err.response);
      });
    }
  }

  return { calendars, calendar, getCalendars, getCalendar, createCalendar, updateCalendar, deleteCalendar, calendarEvents, getCalendarEvents };
}