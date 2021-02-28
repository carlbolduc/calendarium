import {useState} from "react";
import axios from "axios";

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

    function createEvent() {
        console.log("TODO")
    }

    return {events, getEvents, createEvent};
}
