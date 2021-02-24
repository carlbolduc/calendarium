import { useState, useEffect, useCallback, useRef } from "react";

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
  switch (day) {
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
  return day === 7 ? 1 : day + 1;
}

export function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
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

// This function returns the appropriate bootstrap text color class of white or dark that works best with the provided background color html code
// Ref.: https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
export function textColor(backgroundColor) {
  // break the hex code into 3 pieces to get the individual red, green, and blue intensities
  const red = parseInt(backgroundColor.substring(1, 3), 16);
  const green = parseInt(backgroundColor.substring(3, 5), 16);
  const blue = parseInt(backgroundColor.substring(5, 7), 16);

  // determine the overall intensity of the color to choose the corresponding text color
  if ((red * 0.299 + green * 0.587 + blue * 0.114) > 186) {
    //use #000000 
    return "text-dark";
  } else {
    //use #ffffff
    return "text-white";
  }
}

// This function returns the right text to display for a calendar user content, according to calendar settings and current language
export function decideWhatToDisplay(language, enableEn, enableFr, textEn, textFr) {
  let result;
  if (language === "enCa" && enableEn) { // we're in English and the calendar has English enabled
    result = textEn;
  } else if (language === "frCa" && enableFr) { // we're in French and the calendar has French enabled
    result = textFr;
  } else if (enableEn && textEn !== "") { // none of the above, the calendar has English enabled and text isn't empty
    result = textEn;
  } else { // none of the above, we must use the French text
    result = textFr;
  }
  return result;
}

// This function converts a language to an actuale locale. E.g.: "enCa" becomes "en-Ca".
export function getLocale(language) {
  return language.substring(0, 2) + "-" + language.substring(2, 4);
}