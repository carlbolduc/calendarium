import { useState } from "react";
import axios from "axios";
import {errorCallback} from "./Helpers";

export function useEvent(token) {
  const [events, setEvents] = useState([]);

  function getEvents() {
    if (token !== null) {
      axios({
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        url: `${process.env.REACT_APP_API}/events`,
      }).then(res => {
        setEvents(res.data);
      }).catch(err => {
        console.log("THIS SHOULD NEVER HAPPEN, error in 'getEvents' from 'useEvent' hook");
        console.log(err.response);
      });
    }
  }

  function createEvent(data, cb) {
    if (token !== null) {
      axios({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        url: `${process.env.REACT_APP_API}/events`,
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

  function searchEvents(q, cb) {
    if (token !== null) {
      axios({
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        url: `${process.env.REACT_APP_API}/events/search?q=${q}`,
      }).then(res => {
        setEvents(res.data);
        if (cb) cb();
      }).catch(err => {
        console.log("THIS SHOULD NEVER HAPPEN, error in 'searchEvents' from 'useEvent' hook");
        console.log(err.response);
      });
    }
  }

  return { events, getEvents, createEvent, searchEvents };
}
