import { useCallback, useState } from "react";
import axios from "axios";

export function useDot(token) {
  const [dots, setDots] = useState([]);

  const getDots = useCallback((q, cb) => {
    const url =
      token !== null
        ? `${process.env.REACT_APP_API}/calendars/dots?q=${q}`
        : `${process.env.REACT_APP_API}/public/dots?q=${q}`;
    const headers =
      token !== null
        ? {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        : { "Content-Type": "application/json" };
    axios({
      method: "GET",
      headers: headers,
      url: url,
    })
      .then((res) => {
        setDots(res.data);
      })
      .catch((err) => {
        console.log("THIS SHOULD NEVER HAPPEN, error in 'getDots' from 'useDot' hook");
        console.log(err.response);
      });
  }, [token]);

  const getPublicDots = useCallback((q, cb) => {
    axios({
      method: "GET",
      headers: { "Content-Type": "application/json" },
      url: `${process.env.REACT_APP_API}/public/dots?q=${q}`,
    }).then(res => {
      setDots(res.data);
    }).catch(err => {
      console.log("THIS SHOULD NEVER HAPPEN, error in 'getDots' from 'useDot' hook");
      console.log(err.response);
    });
  }, []);

  return { dots, getDots, getPublicDots };
}