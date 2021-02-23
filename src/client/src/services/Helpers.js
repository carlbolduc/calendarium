import {useState, useEffect, useCallback, useRef} from "react";

export function textValid(text) {
  return text !== "";
}

export function emailValid(email) {
  const re = /^\S+@\S+[.][0-9a-z]+$/;
  return re.test(email);
}

export function passwordValid(password) {
  return password.length > 7;
}

export const subscriptionStatus = {
  ACTIVE: "active",
  CANCELED: "canceled"
}

export function dayNumber(day) {
  let dayNumber;
  switch(day) {
    case "Monday":
      dayNumber = 1;
      break;
    case "Tuesday":
      dayNumber = 2;
      break;
    case "Wednesday":
      dayNumber = 3;
      break;
    case "Thursday":
      dayNumber = 4;
      break;
    case "Friday":
      dayNumber = 5;
      break;
    case "Saturday":
      dayNumber = 6;
      break;
    case "Sunday":
      dayNumber = 7;
      break;
    default:
      dayNumber = 1;
  }
  return dayNumber;
}

export function nextWeekDay(day) {
  return day === 7 ? 1 : day+1;
}

export function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    ((c ^ crypto.getRandomValues(new Uint8Array(1))[0]) & (15 >> c / 4)).toString(16)
  );
}

export function useStateCallback(initialState) {
  const [state, setState] = useState(initialState);
  const cbRef = useRef(null);

  const setStateCallback = useCallback((state, cb) => {
    cbRef.current = cb;
    setState(state);
  }, []);

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null;
    }
  }, [state]);

  return [state, setStateCallback];
}

export function errorCallback(err, cb) {
  if (cb) {
    const result = {
      success: false,
      errorCode: err.response.status
    }
    cb(result);
  }
}