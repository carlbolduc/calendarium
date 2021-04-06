import { useEffect, useState } from "react";
import axios from "axios";

export function useLoc(account) {
  const [loc, setLoc] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [localeId, setLocaleId] = useState("enCa");

  // Load languages when the app boots
  useEffect(() => {
    const languagesPromise = axios({
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${process.env.REACT_APP_API}/loc/languages`,
    });
    const locPromise = axios({
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${process.env.REACT_APP_API}/loc`,
    });
    Promise.all([languagesPromise, locPromise]).then(results => {
      setLanguages(results[0].data);
      setLoc(results[1].data);
    });
  }, []);
  
  // Change the language of the app according to the account language
  useEffect(() => {
    if (languages.length > 0) {
      const l = languages.find(l => l.languageId === account.languageId);
      if (l.localeId !== localeId) {
        setLocaleId(l.localeId)
      }
    }
  }, [account.languageId, languages, localeId]);

  function translate(label) {
    let locTranslated = "";
    // if loc is ready and the label to translate is not empty, translate it
    if (loc.length > 0 && languages.length > 0 && ![null, undefined, 0, ""].includes(label)) {
      const defaultLanguage = languages.find(l => l.localeId === "enCa");
      // if user language is en_ca, return the label as is
      if (defaultLanguage.languageId === account.languageId) {
        locTranslated = label;
      }
      // if user language is not en_ca, try to translate it
      else {
        const language = languages.find(l => l.languageId === account.languageId);
        // search label in loc
        const locToTranslate = loc.find(l => l.enCa === label);
        // if label doesn't exist in loc, return label as is
        if (locToTranslate === undefined) {
          locTranslated = label;
          // if label exist, return its translation for the account language id
        } else {
          locTranslated = locToTranslate[language.localeId] !== null ? locToTranslate[language.localeId] : label;
        }
      }
    }
    return locTranslated;
  }

  return { languages, localeId, translate };
}
