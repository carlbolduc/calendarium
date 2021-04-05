import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { DateTime } from "luxon";
import Button from "../../components/Form/Button";
import FeaturesList from "../../components/Content/FeaturesList";
import Message from "../../components/Form/Message";
import { getLocale, subscriptionStatus } from "../../services/Helpers";
import StripeWrapper from "./StripeWrapper";

const wantToOptions = {
  SUBSCRIBE: "subscribe",
  START_TRIAL: "start trial",
  CANCEL: "cancel",
  REACTIVATE: "reactivate"
}

export default function Subscription(props) {
  const [wantTo, setWantTo] = useState("");
  const [result, setResult] = useState("");
  const [messageOrigin, setMessageOrigin] = useState("");

  function wantToSubscribe(e) {
    e.preventDefault();
    setWantTo(wantToOptions.SUBSCRIBE);
    if (!props.customerCreated) {
      props.createCustomer(result => {
        if (result.success) {
          console.log("Customer created, show stripe form.");
        } else {
          setMessageOrigin("createCustomer");
        }
      });
    }
  }

  function wantToStartTrial(e) {
    e.preventDefault();
    setWantTo(wantToOptions.START_TRIAL);
  }

  function wantToCancel(e) {
    e.preventDefault();
    setWantTo(wantToOptions.CANCEL)
  }

  function createSubscription(paymentMethod, cb) {
    props.createSubscription(paymentMethod, result => {
      if (!result.success) {
        setMessageOrigin("createSubscription");
        setResult(result);
        if (cb) cb();
      }
    });
  }

  function cancel(e) {
    e.preventDefault();
    setMessageOrigin("cancelSubscription");
    props.cancelSubscription(result => {
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
    setMessageOrigin("reactivateSubscription");
    props.reactivateSubscription(result => {
      if (result.success) {
        setWantTo("");
      }
      setResult(result);
    });
  }

  function startTrial(e) {
    e.preventDefault();
    setMessageOrigin("startTrial");
    props.startTrial(result => {
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
    <div className="row mt-4">
      {/* ***** Calendarium trial ***** */}
      <div className="col-auto">
        <div className="card" style={{ width: "18rem" }}>
          <img
            src="/img/logo.png"
            alt="Calendarium logo"
            width="100%"
            height="180"
            className="card-img-top"
          />
          <div className="card-body">
            <h5 className="card-title">{props.translate("Calendarium trial")}</h5>
            <h6 className="card-subtitle mb-2 text-muted">{props.translate("Free for one month")}</h6>
            <p className="card-text">{props.translate("Includes unlimited calendars and unlimited collaborators.")}</p>
            <Button label={props.translate("Start trial")} type="button" id="button-subscribe" onClick={e => wantToStartTrial(e)} />
          </div>
        </div>
      </div>
      {/* ***** Calendarium unlimited ***** */}
      <div className="col-auto">
        <div className="card" style={{ width: "18rem" }}>
          <img
            src="/img/logo.png"
            alt="Calendarium logo"
            width="100%"
            height="180"
            className="card-img-top"
          />
          <div className="card-body">
            <h5 className="card-title">{props.translate("Calendarium unlimited")}</h5>
            <h6 className="card-subtitle mb-2 text-muted">{props.translate("$600 CAD per year")}</h6>
            <p className="card-text">{props.translate("Includes unlimited calendars and unlimited collaborators.")}</p>
            <Button label={props.translate("Subscribe")} type="button" id="button-subscribe" onClick={e => wantToSubscribe(e)} />
          </div>
        </div>
      </div>
    </div>
  );

  const endAt = props.account.subscription ? DateTime.fromSeconds(props.account.subscription.endAt).setLocale(getLocale(props.localeId)).toLocaleString(DateTime.DATE_FULL) : null;

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
      <h5 className="mt-4">{props.translate("Calendarium unlimited")}</h5>
      <p>{props.translate("$600 CAD per year")}</p>
      {renderSubscriptionEndAt()}
    </div>
  );

  function renderSubscriptionActions() {
    let result = null;
    if (props.account.subscription !== null) {
      if (props.account.subscription.status === subscriptionStatus.ACTIVE) {
        result =
          <Button label={props.translate("Cancel subscription")} type="button" id="button-cancel-subscription" onClick={e => wantToCancel(e)} />;
      } else if (props.account.subscription.status === subscriptionStatus.CANCELED) {
        result =
          <Button label={props.translate("Reactivate subscription")} type="button" id="button-reactivate-subscription" onClick={e => wantToReactivate(e)} />;
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
            <h5>{props.translate("Are you sure you want to cancel your subscription?")}</h5>
            <p>{props.translate("When you cancel...")}</p>
            <ul>
              <li>{props.translate("You won't be billed again.")}</li>
              <li>{props.translate("Your calendars will become inaccessible at the end of your subscription, on")} {endAt}.</li>
            </ul>
            <Button label={props.translate("Never mind")} type="button" id="button-never-mind" onClick={() => setWantTo("")} outline={true} />
            <Button label={props.translate("Cancel my subscription")} type="button" id="button-confirm-cancel" onClick={e => cancel(e)} />
          </div>
        );
      } else if (wantTo === wantToOptions.REACTIVATE) {
        result = (
          <div>
            <h5>{props.translate("Are you sure you want to reactivate your subscription?")}</h5>
            <p>{props.translate("When you reactivate...")}</p>
            <ul>
              <li>{props.translate("You will be charged at the end of your current subscription cycle, on")} {endAt}.</li>
              <li>{props.translate("Your calendars will remain accessible.")}</li>
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
              <StripeWrapper
                createSubscription={createSubscription}
                cancel={() => setWantTo("")}
                localeId={props.localeId}
                translate={props.translate}
              />
            </>
          );
        } else if (wantTo === wantToOptions.START_TRIAL) {
          // Show start trial form
          result = (
            <>
              {productPresentation}
              <div>
                <h5>{props.translate("Are you ready to start your one-month Calendarium unlimited trial?")}</h5>
                <p>{props.translate("When your trial starts...")}</p>
                <ul>
                  <li>{props.translate("You will enjoy creating calendars and inviting collaborators right away.")}</li>
                  <li>{props.translate("You will have full access to all of Calendarium features for a full month.")}</li>
                  <li>{props.translate("It will feel like you have all the time in the world.")}</li>
                </ul>
                <p>{props.translate("Once your trial ends...")}</p>
                <ul>
                  <li>{props.translate("You will NOT be charged unless you decide to subscribe.")}</li>
                  <li>{props.translate("Your calendars will NOT be deleted, and if you ever decide to subscribe, they will be there for you.")}</li>
                  <li>{props.translate("If some of your calendars are public, they will stop appearing in our Public calendars section.")}</li>
                  <li>{props.translate("If you have embedded calendars in other websites, their embed code will stop displaying the calendar, showing instead a discreet message.")}</li>
                  <li>{props.translate("You will have realised that one month flies by so fast.")}</li>
                </ul>
                <Button label={props.translate("Never mind")} type="button" id="button-never-mind" onClick={() => setWantTo("")} outline={true} />
                <Button label={props.translate("Start my trial")} type="button" id="button-start-trial" onClick={e => startTrial(e)} />
              </div>
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
    <article>
      <h1>{props.translate("My subscription")}</h1>
      <Message result={result} origin={messageOrigin} translate={props.translate} />
      {renderMain()}
    </article>
  ) : (
    <Redirect
      to={{
        pathname: "/sign-in",
        state: { from: "/subscription" }
      }}
    />
  );
}