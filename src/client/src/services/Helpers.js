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

// This function converts a language to an actuale locale. E.g.: "enCa" becomes "en-Ca".
export function getLocale(language) {
  return language.substring(0, 2) + "-" + language.substring(2, 4);
}

// Return all times of day in 30 minutes increments
export function timesList(locale) {
  if (locale.indexOf("en") !== -1) {
    return ["12:00am", "12:30am", "1:00am", "1:30am", "2:00am", "2:30am", "3:00am", "3:30am", "4:00am", "4:30am", "5:00am", "5:30am", "6:00am", "6:30am", "7:00am", "7:30am", "8:00am", "8:30am", "9:00am", "9:30am", "10:00am", "10:30am", "11:00am", "11:30am", "12:00pm", "12:30pm", "1:00pm", "1:30pm", "2:00pm", "2:30pm", "3:00pm", "3:30pm", "4:00pm", "4:30pm", "5:00pm", "5:30pm", "6:00pm", "6:30pm", "7:00pm", "7:30pm", "8:00pm", "8:30pm", "9:00pm", "9:30pm", "10:00pm", "10:30pm", "11:00pm", "11:30pm"];
  } else {
    return ["00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"];
  }
}

// Convert JavaScript object into a string safe to use in a URL
export function encodeObject(data) {
  const string = JSON.stringify(data);
  return btoa(string);
}