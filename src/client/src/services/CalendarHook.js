import { useCallback, useState } from "react";
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
    embedCalendar: false,
    publicCalendar: false,
    eventApprovalRequired: true,
    access: ""
  });
  const [calendarEvents, setCalendarEvents] = useState([]);

  const getCalendars = useCallback(() => {
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
  }, [token]);

  const getPublicCalendars = useCallback(() => {
   console.log("get public calendar");
    // axios({
   //   method: "GET",
   //   headers: {
   //     "Content-Type": "application/json"
   //   },
   //   url: `${process.env.REACT_APP_API}/calendars`,
   // }).then(res => {
   //   setCalendars(res.data);
   // }).catch(err => {
   //   console.log("THIS SHOULD NEVER HAPPEN, error in 'getCalendars' from 'useCalendar' hook");
   //   console.log(err.response);
   // });
  }, []);

  const clearCalendars = useCallback(() => {
    setCalendars([]);
  }, []);

  const getCalendar = useCallback((data, cb) => {
    function buildUrl() {
      let url;
      if (data.hasOwnProperty("id")) {
        url = `${process.env.REACT_APP_API}/public/calendar-embeds/${data.id}`
      } else if (data.hasOwnProperty("calendarAccessId")) {
        url = `${process.env.REACT_APP_API}/calendars/anonymous/${data.link}?id=${data.calendarAccessId}`;
      } else if (data.hasOwnProperty("link")) {
        url = `${process.env.REACT_APP_API}/calendars/${data.link}`;
      }
      return url;
    }
    const url = buildUrl();
    if (url !== undefined) {
      const header = token !== null
        ? { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
        : { "Content-Type": "application/json" }
      axios({
        method: "GET",
        headers: header,
        url: url,
      }).then(res => {
        setCalendar(res.data);
        if (cb) cb();
      }).catch(err => {
        if (err.response.status === 404) {
          // Calendar not found, we callback
          if (cb) cb();
        } else {
          console.log("THIS SHOULD NEVER HAPPEN, error in 'getCalendars' from 'useCalendar' hook");
          console.log(err.response);
        }
      });
    } else {
      console.log("Function getCalendar of CalendarHook called with invalid parameters.")
    }
  }, [token]);

  const createCalendar = useCallback((data, cb) => {
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
  }, [token, getCalendars, subscribed]);

  const updateCalendar = useCallback((calendarId, data, cb) => {
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
  }, [token, getCalendars, getCalendar, subscribed]);

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

  const getCalendarEvents = useCallback((calendarId, q, cb) => {
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
  }, [token]);

  function getCalendarEmbedEvents(calendarId, q, cb) {
      axios({
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        url: `${process.env.REACT_APP_API}/public/calendar-embeds/${calendarId}/events?q=${q}`,
      }).then(res => {
        setCalendarEvents(res.data);
      }).catch(err => {
        console.log("THIS SHOULD NEVER HAPPEN, error in 'getCalendarEvents' from 'useCalendar' hook");
        console.log(err.response);
      });
  }

  function clearCalendarEvents() {
    setCalendarEvents([]);
  }

  return { calendars, calendar, getCalendars, getPublicCalendars, clearCalendars, getCalendar, createCalendar, updateCalendar, deleteCalendar, calendarEvents, getCalendarEvents, getCalendarEmbedEvents, clearCalendarEvents };
}
