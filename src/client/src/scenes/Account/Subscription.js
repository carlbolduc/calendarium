import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { DateTime } from "luxon";
import SubscribeForm from "./SubscribeForm";
import Button from "../../components/Form/Button";
import FeaturesList from "../../components/Content/FeaturesList";
import Message from "../../components/Form/Message";

export default function Subscription(props) {
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK);
  const [wantToSubscribe, setWantToSubscribe] = useState(false);
  const [wantToCancel, setWantToCancel] = useState(false);
  const [result, setResult] = useState("");

  function subscribe(e) {
    e.preventDefault();
    setWantToSubscribe(true);
    if (!props.customerCreated) {
      props.createCustomer(result => {
        if (result.success) {
          console.log("Customer created, show stripe form.");
        } else {
          // TODO: manage error creating customer
        }
      });
    }
  }

  function cancelSubscription(e) {
    // TODO: display "you're about to cancel, is that ok?"
    // TODO: call cancel subscription
  }

  const productPresentation = (
    <div className="mt-4">
      <p>{props.translate("By subscribing to Calendarium, you will be able to create and manage your own calendars, and invite people to collaborate with you on these calendars.")}</p>
      <p>
        <Button label={props.translate("What can Calendarium do?")} id="button-features-list" type="button" dataBsToggle="collapse" dataBsTarget="#features-list" ariaExpanded="false" ariaControls="features-list" />
      </p>
      <div className="collapse mb-4" id="features-list">
        <div className="card card-body">
          <FeaturesList translate={props.translate} />
        </div>
      </div>
    </div>
  );

  const pricing = (
    <div className="card mt-4" style={{ width: "18rem" }}>
      {/* TODO: create a header image for this subscription product */}
      <svg className="card-img-top" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Image cap" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#868e96"></rect><text x="26%" y="50%" fill="#dee2e6" dy=".3em">Image placeholder</text></svg>
      <div className="card-body">
        <h5 className="card-title">{props.translate("Calendarium Unlimited")}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{props.translate("$600 CAD per year")}</h6>
        <p className="card-text">{props.translate("Includes unlimited calendars and unlimited additional users.")}</p>
        <Button label={props.translate("Subscribe")} type="button" id="button-subscribe" onClick={(e) => subscribe(e)} />
      </div>
    </div>
  );

  const subscriptionDetails = (
    <div className="mt-4">
      <p>{props.translate("Here are the details about your subscription.")}</p>
      <h5 className="mt-4">{props.translate("Calendarium Unlimited")}</h5>
      <p>{props.translate("$600 CAD per year")}</p>
      <p>{props.translate("Your subscription renews on")} {DateTime.fromSeconds(props.account.subscription.endAt).toLocaleString(DateTime.DATE_FULL)}.</p>
    </div>
  );

  const subscriptionActions = (
    <Button label={props.translate("Cancel subscription")} type="button" id="button-cancel-subscription" onClick={(e) => cancelSubscription(e)} />
  );

  function renderMain() {
    let result = null;
    if (props.authenticated) {
      if (props.subscribed) {
        // Show subscription details
        result = (
          <>
            {subscriptionDetails}
            {subscriptionActions}
          </>
        );
      } else {
        if (wantToSubscribe) {
          // Show subscribe form
          result = (
            <>
              {productPresentation}
              <Elements stripe={stripePromise}>
                <SubscribeForm
                  createSubscription={props.createSubscription}
                  setWantToSubscribe={setWantToSubscribe}
                  translate={props.translate}
                />
              </Elements>
            </>
          );
        } else {
          // Show pricing options
          result = (
            <>
              {productPresentation}
              {pricing}
            </>
          );
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