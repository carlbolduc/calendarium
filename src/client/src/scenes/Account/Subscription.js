import React from 'react';
import { Redirect } from 'react-router-dom';

export default function Subscription(props) {
  return props.authenticated ? (
    <div className="p-5">
      <h1>{props.translate("My subscription")}</h1>
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