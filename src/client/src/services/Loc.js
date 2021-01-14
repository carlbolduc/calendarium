import { useState } from 'react';
import axios from 'axios';

export function useLoc() {
  const [loc, setLoc] = useState([]);
  function getLocData() {
    const token = localStorage.getItem("token");
    if (token !== null) {
      axios({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        url: `${process.env.REACT_APP_API}/loc`,
      }).then(res => {
        setLoc(res.data);
      })
    }
  }

  function translate(label) {
    if ([null, undefined, 0, ""].includes(label)) {
      return "";
    } else {
      return loc[label].enCa; //TODO: return the user language translation
    }
  }

  return { getLocData, translate };


  // export default class Loc {
  //   constructor(api) {
  //     this.path = "/loc";
  //     this.loc = [];
  //     this.userLanguage = ""; //TODO: fill userLanguage with user last set language, which is saved when the user changes it from the dropdown, use locale_id
  //     this.getData = this.getData.bind(this);
  //     this.api = api;
  //   }

  //   getData() {
  //     //TODO: query the api to get en-ca (the default UI language) + the user language if different than en-ca
  //     this.api.get(this.path).then(res => {
  //       this.loc = res.data;
  //     });
  //   }

  //   translate(label) {
  //     if ([null, undefined, 0, ""].includes(label)) {
  //       return "";
  //     } else {
  //       return this.loc[label].enCa; //TODO: return the user language translation
  //     }
  //   }

}
