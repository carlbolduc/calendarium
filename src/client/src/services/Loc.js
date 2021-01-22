import { useState } from 'react';
import axios from 'axios';

export function useLoc(account) {
  const [loc, setLoc] = useState([]);
  function getLocData() {
    axios({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: `${process.env.REACT_APP_API}/loc`, //TODO: query the api to get en_ca (the default UI language) + the user language if different than en_ca
    }).then(res => {
      setLoc(res.data);
    })
  }

  function translate(label) {
    let locTranslated = "";
    // if loc is ready and the label to translate is not empty, translate it
    if (loc.length !== 0 && ![null, undefined, 0, ""].includes(label)) {
      // if user language is en_ca, return the label as is
      if (account.languageId === 1) {
        locTranslated = label;
        // TODO: only when in DEV, if label doesn't exist in loc, insert it
      }
      // if user language is not en_ca,try to translate it
      else {
        // search label in loc
        const locToTranslate = loc.find(l => l.enCa === label);
        // if label doesn't exist in loc, return label as is
        if (locToTranslate === undefined) {
          locTranslated = label;
          // if label exist, return its translation for the account language id
        } else {
          //TODO: instead of hardcoded frCa, return the user language translation, using user last set language, which is saved when the user changes it from the dropdown
          locTranslated = locToTranslate.frCa;
        }
      }
    }
    return locTranslated;
  }

  return { getLocData, translate };
}
