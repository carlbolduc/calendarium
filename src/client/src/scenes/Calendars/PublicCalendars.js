import React from 'react';
import { Redirect } from 'react-router-dom';

export default function PublicCalendars(props) {
  return props.authenticated ? (
    <article>
      <h1>{props.translate("Public calendars")}</h1>
    </article>
  ) : (
    <Redirect
      to={{
        pathname: '/sign-in',
        state: { from: '/subscription' }
      }}
    />
  );
}