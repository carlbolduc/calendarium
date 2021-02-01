import React from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.js';

export default function Language(props) {
  // TODO: get selected language from app state (or account preferences)
  const selectedLanguage = 'English';

  const languageOptions = props.languages.map(l => {
    return (
      <li key={l.languageId}><a className="dropdown-item" href="#">{l.name}</a></li>
    );
  });

  return (
    <li className="nav-item dropdown">
      <a className="nav-link dropdown-toggle" href="#" id="dropdown-language" role="button" data-toggle="dropdown" aria-expanded="false">
        {selectedLanguage}
      </a>
      <ul className="dropdown-menu" aria-labelledby="dropdown-language">
        {languageOptions}
      </ul>
    </li>
  );
}