import React, {useEffect, useState} from "react";
import {Redirect, useLocation} from "react-router-dom";
import {DateTime} from "luxon";
import Button from "../../components/Form/Button";
import FeaturesList from "../../components/Content/FeaturesList";
import Message from "../../components/Form/Message";
import {getLocale, subscriptionStatus} from "../../services/Helpers";
import StripeWrapper from "./StripeWrapper";
import UpdateBillingInformationButton from "./UpdateBillingInformationButton";
import SignUp from "../Auth/SignUp";

const wantToOptions = {
  SUBSCRIBE: "subscribe",
  START_TRIAL: "start trial",
  CANCEL: "cancel",
  REACTIVATE: "reactivate",
}

export default function Subscription(props) {
  const location = useLocation();
  const [wantTo, setWantTo] = useState("");
  const [result, setResult] = useState("");
  const [messageOrigin, setMessageOrigin] = useState("");
  const [working, setWorking] = useState(true);

  useEffect(() => {
    // After adding a new payment method, user is brought back here with a checkout session id inside query params
    const query = new URLSearchParams(location.search);
    const sessionId = query.get("session-id");
    if (sessionId === null) {
      setWorking(false);
    } else {
      // Try to update billing info information using the checkout session id
      setMessageOrigin("updateBillingInformation");
      props.updatePaymentMethod(sessionId, result => {
        setResult(result);
        setWorking(false);
      });
    }
  }, []);

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
      setMessageOrigin("createSubscription");
      if (result.success) {
        setWantTo("");
      }
      setResult(result);
      if (cb) cb();
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
      {/* Show trial option only if account has never had a trial/sub before */}
      {props.account.subscription !== null ? null : (
      <div className="col-auto">
        <div className="card" style={{ width: "18rem" }}>
          <img
            src="/img/logo.png"
            alt="Calendarium logo"
            width="100%"
            height="180"
            className="card-img-top opacity-50"
          />
          <div className="card-body">
            <h5 className="card-title">{props.translate("Calendarium trial")}</h5>
            <h6 className="card-subtitle mb-2 text-muted">{props.translate("One month free - no credit card")}</h6>
            <p className="card-text">{props.translate("Invite up to 2 collaborators and create 1 calendar.")}</p>
            <Button label={props.translate("Start trial")} type="button" id="button-subscribe" onClick={e => wantToStartTrial(e)} />
          </div>
        </div>
      </div>)}
      {/* ***** Calendarium monthly ***** */}
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
            <h5 className="card-title">{props.translate("Calendarium monthly")}</h5>
            <h6 className="card-subtitle mb-2 text-muted">{props.translate("$10 CAD per month")}</h6>
            <p className="card-text">{props.translate("Invite up to 20 collaborators and create unlimited calendars.")}</p>
            <Button label={props.translate("Subscribe")} type="button" id="button-subscribe" onClick={e => wantToSubscribe(e)} />
          </div>
        </div>
      </div>
    </div>
  );

  const endAt = props.account.subscription ? DateTime.fromSeconds(props.account.subscription.endAt).setLocale(getLocale(props.localeId)).toLocaleString(DateTime.DATE_FULL) : null;

  function subscriptionEndAt() {
    let result = null;
    if (props.account.subscription !== null) {
      // There's a subscription
      if (props.account.subscription.status === subscriptionStatus.ACTIVE) {
        // It's active
        if (props.account.subscription.product === "trial") {
          // It's a trial
          result = <p>{props.translate("Your trial ends on")} {endAt}.</p>
        } else {
          // It's a regular subscription
          result = <p>{props.translate("Your subscription renews on")} {endAt}.</p>
        }
      } else if (props.account.subscription.status === subscriptionStatus.CANCELED) {
        // It's canceled
        result = <p>{props.translate("Your subscription ends on")} {endAt}.</p>
      }
    }
    return result;
  }

  function subscriptionActions() {
    let result = null;
    if (props.account.subscription !== null) {
      // There's a subscription
      if (props.account.subscription.status === subscriptionStatus.ACTIVE) {
        // It's active
        if (props.account.subscription.product === "trial") {
          // It's a trial
          result = <Button label={props.translate("Subscribe")} type="button" id="button-subscribe" onClick={e => wantToSubscribe(e)} />;
        } else {
          // It's a regular subscription
          result = (
           <>
             <UpdateBillingInformationButton translate={props.translate} createCheckoutSession={props.createCheckoutSession} />
             <Button label={props.translate("Cancel subscription")} type="button" id="button-cancel-subscription" onClick={e => wantToCancel(e)} />
           </>
          )
        }
      } else if (props.account.subscription.status === subscriptionStatus.CANCELED) {
        // It's canceled and it's a regular subscription
        result = <Button label={props.translate("Reactivate subscription")} type="button" id="button-reactivate-subscription" onClick={e => wantToReactivate(e)} />;
      }
    }
    return result;
  }

  function subscriptionDetails() {
    const product = props.account.subscription.product === "trial" ? "Calendarium trial" : "Calendarium unlimited";
    const price = props.account.subscription.product === "trial" ? "Free for one month" : "$600 CAD per year";
    return (
      <>
        <div>
          <p>{props.translate("Here are the details about your subscription.")}</p>
          <h5 className="mt-4">{props.translate(product)}</h5>
          <p>{props.translate(price)}</p>
          {subscriptionEndAt()}
        </div>
        {subscriptionActions()}
      </>
    );
  }

  function renderMain() {
    let result;
    if (working) {
      result = (
        <div className="text-center">
          <span className="spinner-border"/>
        </div>
      );
    } else {
      if (wantTo === wantToOptions.CANCEL) {
        // Show cancel info
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
        // Show reactivate info
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
      } else if (wantTo === wantToOptions.SUBSCRIBE) {
        // Show subscribe form
        result = (
          <>
            {productPresentation}

            {/* TODO: update sign up form to fit embedded in the start trial or subscribe flow  while not authenticated */}
            {!props.authenticated ?
            <SignUp signUp={props.signUp} authenticated={props.authenticated} translate={props.translate} /> : null}

            <StripeWrapper
              createSubscription={createSubscription}
              cancel={() => setWantTo("")}
              localeId={props.localeId}
              translate={props.translate}
            />
          </>
        );
      } else if (wantTo === wantToOptions.START_TRIAL) {
        // Show start trial info
        result = (
          <>
            {productPresentation}
            <div>
              <h5>{props.translate("Are you ready to start your one-month Calendarium trial?")}</h5>
              <p>{props.translate("When your trial starts...")}</p>
              <ul>
                <li>{props.translate("You will enjoy creating a calendar and inviting collaborators right away.")}</li>
                <li>{props.translate("You will have full access to all of Calendarium features for a whole month.")}</li>
                <li>{props.translate("It will feel like you have all the time in the world.")}</li>
              </ul>
              <p>{props.translate("Once your trial ends...")}</p>
              <ul>
                <li>{props.translate("You will NOT be charged unless you decide to subscribe.")}</li>
                <li>{props.translate("Your calendar will NOT be deleted, and if you ever decide to subscribe, it will be there for you.")}</li>
                <li>{props.translate("If your calendar is public, it will stop appearing in our Public calendars section.")}</li>
                <li>{props.translate("If you have embedded your calendar in other websites, its embed code will stop displaying the calendar, showing instead a discreet message.")}</li>
                <li>{props.translate("You will have realized that one month flies by so fast.")}</li>
              </ul>

              {/* TODO: update sign up form to fit embedded in the start trial or subscribe flow while not authenticated */}
              {!props.authenticated ?
              <SignUp signUp={props.signUp} authenticated={props.authenticated} translate={props.translate} /> : null}

              <Button label={props.translate("Never mind")} type="button" id="button-never-mind" onClick={() => setWantTo("")} outline={true} />
              <Button label={props.translate("Start my trial")} type="button" id="button-start-trial" onClick={e => startTrial(e)} />
            </div>
          </>
        );
      } else if (props.subscribed && DateTime.fromSeconds(props.account.subscription.endAt) >= DateTime.now()) {
        // Show subscription details, but only if subscription end date is in the future
        result = subscriptionDetails();
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
    return result;
  }
  return props.authenticated ? (
    <article>
      <h1>{props.translate("My subscription")}</h1>
      <Message result={result} origin={messageOrigin} translate={props.translate} />
      {renderMain()}
    </article>
  ) : (
    <article>
      <h1>{props.translate("Start trial or subscribe")}</h1>
      <Message result={result} origin={messageOrigin} translate={props.translate} />
      {renderMain()}
    </article>
  );
}