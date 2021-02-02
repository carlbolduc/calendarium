import React from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.js';

export default function Language(props) {
  function selectedLanguage() {
    let result = 'English';
    const language = props.languages.find(l => l.languageId === props.languageId);
    if (language !== undefined) {
      result = language.name;
    }
    return result;
  } 

  const languageOptions = props.languages.map(l => {
    return (
      <li key={l.languageId}>
        <a 
          className="dropdown-item" 
          href="#" 
          onClick={e => {e.preventDefault();props.switchLanguage(l.languageId)}}>
            {l.name}
        </a>
      </li>
    );
  });

  return (
    <li className="nav-item dropdown">
      <a className="nav-link dropdown-toggle" href="#" id="dropdown-language" role="button" data-toggle="dropdown" aria-expanded="false">
        {selectedLanguage()}
      </a>
      <ul className="dropdown-menu" aria-labelledby="dropdown-language">
        {languageOptions}
      </ul>
    </li>
  );
}