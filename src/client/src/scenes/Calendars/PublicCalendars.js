import React from 'react';
import { Redirect } from 'react-router-dom';

export default function PublicCalendars(props) {
  return props.authenticated ? (
    <div className="p-5">
      <h1>{props.translate("Public calendars")}</h1>
    </div>
  ) : (
    <Redirect
      to={{
        pathname: '/sign-in',
        state: { from: '/subscription' }
      }}
    />
  );
}