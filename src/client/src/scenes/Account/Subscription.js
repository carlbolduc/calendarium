import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { DateTime } from "luxon";
import SubscribeForm from "./SubscribeForm";
import Button from "../../components/Form/Button";
import FeaturesList from "../../components/Content/FeaturesList";
import Message from "../../components/Form/Message";
import {subscriptionStatus} from "../../services/Helpers";

const wantToOptions = {
  SUBSCRIBE: "subscribe",
  CANCEL: "cancel",
  REACTIVATE: "reactivate"
}

export default function Subscription(props) {
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK);
  const [wantTo, setWantTo] = useState("");
  const [result, setResult] = useState("");

  function wantToSubscribe(e) {
    e.preventDefault();
    setWantTo(wantToOptions.SUBSCRIBE);
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

  function wantToCancel(e) {
    e.preventDefault();
    setWantTo(wantToOptions.CANCEL)
  }

  function cancel(e) {
    e.preventDefault();
    props.updateSubscription({ cancelAtPeriodEnd: true}, result => {
      if (result.success) {
        setWantTo("");
      }
      setResult(result);
    });
  }

  function wantToReactivate(e) {
    e.preventDefault();
    setWantTo(wantToOptions.REACTIVATE);
  }

  function reactivate(e) {
    e.preventDefault();
    props.updateSubscription({ cancelAtPeriodEnd: false}, result => {
      if (result.success) {
        setWantTo("");
      }
      setResult(result);
    });
  }

  const productPresentation = (
    <div>
      <p>{props.translate("By subscribing to Calendarium, you will be able to create and manage your own calendars, and invite people to collaborate with you on these calendars.")}</p>
      <p>
        <Button label={props.translate("What can Calendarium do?")} id="button-features-list" type="button" dataBsToggle="collapse" dataBsTarget="#features-list" ariaExpanded="false" ariaControls="features-list" outline={true} />
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
      <svg className="card-img-top" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Image cap" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#868e96"/><text x="26%" y="50%" fill="#dee2e6" dy=".3em">Image placeholder</text></svg>
      <div className="card-body">
        <h5 className="card-title">{props.translate("Calendarium Unlimited")}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{props.translate("$600 CAD per year")}</h6>
        <p className="card-text">{props.translate("Includes unlimited calendars and unlimited additional users.")}</p>
        <Button label={props.translate("Subscribe")} type="button" id="button-subscribe" onClick={e => wantToSubscribe(e)} />
      </div>
    </div>
  );


  const endAt = props.account.subscription ? DateTime.fromSeconds(props.account.subscription.endAt).toLocaleString(DateTime.DATE_FULL) : null;

  function renderSubscriptionEndAt() {
    let result = null;
    if (props.account.subscription !== null) {
      if (props.account.subscription.status === subscriptionStatus.ACTIVE) {
        result = <p>{props.translate("Your subscription renews on")} {endAt}.</p>
      } else if (props.account.subscription.status === subscriptionStatus.CANCELED) {
        result = <p>{props.translate("Your subscription ends on")} {endAt}.</p>
      }
    }
    return result;
  }

  const subscriptionDetails = (
    <div>
      <p>{props.translate("Here are the details about your subscription.")}</p>
      <h5 className="mt-4">{props.translate("Calendarium Unlimited")}</h5>
      <p>{props.translate("$600 CAD per year")}</p>
      {renderSubscriptionEndAt()}
    </div>
  );

  function renderSubscriptionActions() {
    let result = null;
    if (props.account.subscription !== null) {
      if (props.account.subscription.status === subscriptionStatus.ACTIVE) {
        result =
          <Button label={props.translate("Cancel subscription")} type="button" id="button-cancel-subscription" onClick={e => wantToCancel(e)}/>;
      } else if (props.account.subscription.status === subscriptionStatus.CANCELED) {
        result =
          <Button label={props.translate("Reactivate subscription")} type="button" id="button-reactivate-subscription" onClick={e => wantToReactivate(e)}/>;
      }
    }
    return result;
  }

  function renderMain() {
    let result = null;
    if (props.authenticated) {
      if (wantTo === wantToOptions.CANCEL) {
        result = (
          <div>
            <h5>Are you sure you want to cancel your subscription?</h5>
            <p>When you cancel...</p>
            <ul>
              <li>You won't be billed again.</li>
              <li>Your calendars will become inaccessible at the end of your subscription.</li>
            </ul>
            <Button label={props.translate("Never mind")} type="button" id="button-never-mind" onClick={() => setWantTo("")} outline={true} />
            <Button label={props.translate("Cancel my subscription")} type="button" id="button-confirm-cancel" onClick={e => cancel(e)} />
          </div>
        );
      } else if (wantTo === wantToOptions.REACTIVATE) {
          result = (
            <div>
              <h5>Are you sure you want reactivate your subscription?</h5>
              <p>When you reactivate...</p>
              <ul>
                <li>You will be charged at the end of your current subscription cycle.</li>
              </ul>
              <Button label={props.translate("Never mind")} type="button" id="button-never-mind" onClick={() => setWantTo("")} outline={true} />
              <Button label={props.translate("Reactivate my subscription")} type="button" id="button-confirm-cancel" onClick={e => reactivate(e)} />
            </div>
          );
        } else if (props.subscribed) {
        // Show subscription details
        // TODO: show subscription details only if subscription end date is in the future
        result = (
          <>
            {subscriptionDetails}
            {renderSubscriptionActions()}
          </>
        );
      } else {
        if (wantTo === wantToOptions.SUBSCRIBE) {
          // Show subscribe form
          result = (
            <>
              {productPresentation}
              <Elements stripe={stripePromise}>
                <SubscribeForm
                  createSubscription={props.createSubscription}
                  cancel={() => setWantTo("")}
                  translate={props.translate}
                />
              </Elements>
            </>
          );
        } else  {
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
      <Message result={result} origin="Subscription" translate={props.translate} />
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