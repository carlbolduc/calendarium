import { useEffect, useState } from 'react';
import axios from 'axios';

export function useLoc(account, languages) {
  const [loc, setLoc] = useState([]);
  const [language, setLanguage] = useState("enCa");
  
  useEffect(() => {
    if (languages.length > 0) {
      const l = languages.find(l => l.languageId === account.languageId);
      if (l !== undefined) {
        setLanguage(l.localeId);
      }
    }
  },[account, languages]);

  function getLocData() {
    axios({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: `${process.env.REACT_APP_API}/loc`,
    }).then(res => {
      setLoc(res.data);
    })
  }

  function translate(label) {
    let locTranslated = '';
    // if loc is ready and the label to translate is not empty, translate it
    if (loc.length > 0 && languages.length > 0 && ![null, undefined, 0, ''].includes(label)) {
      const defaultLanguage = languages.find(l => l.localeId === 'enCa');
      // if user language is en_ca, return the label as is
      if (defaultLanguage.languageId === account.languageId) {
        locTranslated = label;

        // TODO: do this only when in DEV if label doesn't exist in loc, insert it
        const locToTranslate = loc.find(l => l.enCa === label);
        if (locToTranslate === undefined) {
          axios.post(`${process.env.REACT_APP_API}/loc`, label);
        }

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

  return { getLocData, translate, language };
}
