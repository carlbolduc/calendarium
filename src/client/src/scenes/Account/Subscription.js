import React from "react";
import { Redirect } from "react-router-dom";

export default function Subscription(props) {

  function subscribe(e) {
    e.preventDefault();
    if (props.customerCreated) {
      // show Stripe form
      console.log("Customer already exist, show stripe form.");
    } else {
      props.createCustomer(result => {
        if (result.success) {
          // show Stripe form
          console.log("Customer created, show stripe form.");
        }
      });
    }
  }

  const pricing = (
    <div>
      <h2>Calendarium is $600 a year</h2>
      <p>Includes unlimited calendars, unlimited users, and no per user fees.</p>
      <a href="#" onClick={(e) => subscribe(e)}>Subscribe</a>
    </div>
  )

  function renderMain() {
    let result = null;
    if (props.authenticated) {
      if (props.subscribed) {
        // Show subscription details
      } else {
        if (props.customerCreated) {
          // We have the customer id, we can load the Stripe form
        } else {
          result = pricing;
        }
      }
    }
    return result;
  }
  return props.authenticated ? (
    <div className="p-5">
      <h1>{props.translate("My subscription")}</h1>
      {renderMain()}
    </div>
  ) : (
    <Redirect
      to={{
        pathname: "/sign-in",
        state: { from: "/subscription" }
      }}
    />
  );
}