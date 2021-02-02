import React from 'react';

export default function Home(props) {
  return (
    <div className="p-5">
      <h1>{props.translate("Home")}</h1>
    </div>
  );
}