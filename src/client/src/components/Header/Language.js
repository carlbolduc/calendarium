import React from "react";

export default function Language(props) {
  function selectedLanguage() {
    let result = "English";
    const language = props.languages.find(l => l.languageId === props.languageId);
    if (language !== undefined) {
      result = language.name;
    }
    return result;
  } 

  const languageOptions = props.languages.map(l => {
    return (
      <li key={l.languageId}>
        <button 
          className="link-button dropdown-item" 
          onClick={e => {
            e.preventDefault();
            props.switchLanguage(l.languageId);
            props.collapseMenu();
          }}
        >
          {l.name}
        </button>
      </li>
    );
  });

  return (
    <li className="nav-item dropdown">
      <button className="link-button nav-link dropdown-toggle" id="dropdown-language" data-bs-toggle="dropdown" aria-expanded="false">
        {selectedLanguage()}
      </button>
      <ul className="dropdown-menu" aria-labelledby="dropdown-language">
        {languageOptions}
      </ul>
    </li>
  );
}