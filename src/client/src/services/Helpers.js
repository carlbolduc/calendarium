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

export const eventStatus = {
  DRAFT: {label: "Draft", value: "draft"},
  PENDING_APPROVAL: {label: "Pending Approval", value: "pending_approval"},
  PUBLISHED: {label: "Published", value: "published"}
}

export const calendarAccessStatus = {
  OWNER: "owner",
  INVITED: "invited",
  REQUESTED: "requested",
  ACTIVE: "active",
  INACTIVE: "inactive"
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

// This function converts a language to an actual locale. E.g.: "enCa" becomes "en-Ca".
export function getLocale(language) {
  return language.substring(0, 2) + "-" + language.substring(2, 4);
}

// Return all times of day in 30 minutes increments
export function timesList(locale) {
  if (locale.indexOf("en") !== -1) {
    return ["12:00 a.m.", "12:30 a.m.", "1:00 a.m.", "1:30 a.m.", "2:00 a.m.", "2:30 a.m.", "3:00 a.m.", "3:30 a.m.", "4:00 a.m.", "4:30 a.m.", "5:00 a.m.", "5:30 a.m.", "6:00 a.m.", "6:30 a.m.", "7:00 a.m.", "7:30 a.m.", "8:00 a.m.", "8:30 a.m.", "9:00 a.m.", "9:30 a.m.", "10:00 a.m.", "10:30 a.m.", "11:00 a.m.", "11:30 a.m.", "12:00 p.m.", "12:30 p.m.", "1:00 p.m.", "1:30 p.m.", "2:00 p.m.", "2:30 p.m.", "3:00 p.m.", "3:30 p.m.", "4:00 p.m.", "4:30 p.m.", "5:00 p.m.", "5:30 p.m.", "6:00 p.m.", "6:30 p.m.", "7:00 p.m.", "7:30 p.m.", "8:00 p.m.", "8:30 p.m.", "9:00 p.m.", "9:30 p.m.", "10:00 p.m.", "10:30 p.m.", "11:00 p.m.", "11:30 p.m."];
  } else {
    return ["00 h 00", "00 h 30", "01 h 00", "01 h 30", "02 h 00", "02 h 30", "03 h 00", "03 h 30", "04 h 00", "04 h 30", "05 h 00", "05 h 30", "06 h 00", "06 h 30", "07 h 00", "07 h 30", "08 h 00", "08 h 30", "09 h 00", "09 h 30", "10 h 00", "10 h 30", "11 h 00", "11 h 30", "12 h 00", "12 h 30", "13 h 00", "13 h 30", "14 h 00", "14 h 30", "15 h 00", "15 h 30", "16 h 00", "16 h 30", "17 h 00", "17 h 30", "18 h 00", "18 h 30", "19 h 00", "19 h 30", "20 h 00", "20 h 30", "21 h 00", "21 h 30", "22 h 00", "22 h 30", "23 h 00", "23 h 30"];
  }
}

// Convert JavaScript object into a string safe to use in a URL
export function encodeObject(data) {
  const string = JSON.stringify(data);
  return btoa(string);
}

// Check if two Luxon dates are on the same day
export function sameDay(d1, d2) {
  return (
    d1.day === d2.day &&
    d1.month === d2.month &&
    d1.year === d2.year
  );
}

  // Try to sort calendars according to the current language, fallback to alternative language when sorting if current language isn't enabled
  export function sortedCalendars(calendars, language) {
    if (language === "frCa") {
      return calendars.sort((a, b) => (a.enableFr ? a.nameFr : a.nameEn).localeCompare((b.enableFr ? b.nameFr : b.nameEn)));
    } else {
      return calendars.sort((a, b) => (a.enableEn ? a.nameEn : a.nameFr).localeCompare((b.enableEn ? b.nameEn : b.nameFr)));
    }
  }