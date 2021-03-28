import React from "react";
import {useState, useEffect} from "react";

export default function Message(props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, [props.result]);

  let result = null;
  if (props.result) {
    if (props.result.success) {
      // map of all possible success messages
      let messages = new Map();
      messages.set("signUp","Account created successfully.");
      messages.set("signIn","Successfully signed in.");
      messages.set("forgotPassword","We have received your password reset request. Instructions are on their way, check your email!");
      messages.set("passwordReset","Your password has been reset successfully. You're good to go!");
      messages.set("profile","Your profile changes have been saved successfully.");
      messages.set("createSubscription","Thank you for your purchase! Your Calendarium subscription has now started.");
      messages.set("cancelSubscription","Your Calendarium subscription has now been cancelled. Thank you for the time you spent with us, and we hope you had fun here!");
      messages.set("reactivateSubscription","Your Calendarium subscription has now been reactivated. Thank you for being back with us!");

      // manage the unexpected successes
      let message = messages.get(props.origin);
      if (message === undefined) {message = "Success!"}

      result = (
        <div className="alert alert-success alert-dismissible fade show my-4" role="alert">
          {props.translate(message)}
          <button type="button" className="btn-close" aria-label="Close" onClick={e => {
            e.preventDefault();
            setShow(false);
          }} />
        </div>
      );
    } else {
      // map of all possible error messages
      let messages = new Map();
      messages.set("signUp409","We already have someone else registered with this email. Make sure it is entered correctly. If this is really your email, try signing in instead, or request a password reset.");
      messages.set("signUp500","Something went wrong with our servers when trying to create your account. Try again, and if this error keeps popping, contact us in the grove.");
      messages.set("signIn401","We didn't recognise your email or your password. Make sure they are entered correctly and try again.");
      messages.set("signIn500","Something went wrong with our servers when trying to sign you in. Try again, and if this error keeps popping, contact us in the grove.");
      messages.set("forgotPassword500","Something went wrong with our servers when trying to receive your password reset request. Try again, and if that error keeps popping, contact us in the grove.");
      messages.set("passwordReset404","We didn't recognise this reset link. Try clicking on it again from the email you received, and if this error keeps popping, you can either request a new reset or contact us in the grove.");
      messages.set("passwordReset500","Something went wrong with our servers when trying to reset your password. Try again, and if this error keeps popping, contact us in the grove.");
      messages.set("profile404","We couldn't find your profile. Try saving your changes again, and if this error keeps popping, contact us in the grove");
      messages.set("profile409","We already have someone else registered with the new email you've entered, so we cannot update your profile to this email. Choose a different one, or make sure it is entered correctly, then try saving your changes again.");
      messages.set("profile401","We didn't recognise your current password. Make sure it is entered correctly and try again.");
      messages.set("createCustomer500","Our payment processing platform returned an error while trying to initialize your customer profile. You may want to try subscribing again, and if that error keeps popping, contact us in the grove.");
      messages.set("createSubscription402","There was an error while processing your credit card. Verify that your billing information is correct and try again. If that error keeps popping, contact us in the grove.");
      messages.set("createSubscription500","Our payment processing platform returned an error. You may want to try subscribing again, and if that error keeps popping, contact us in the grove.");
      messages.set("cancelSubscription500","Our payment processing platform returned an error. You may want to try cancelling again, and if that error keeps popping, contact us in the grove.");
      messages.set("cancelSubscription404","Our payment processing platform could not find the subscription you want to cancel, which is very unusual. Could you drop us an email so we can get you sorted?");
      messages.set("reactivateSubscription500","Our payment processing platform returned an error. You may want to try reactivating again, and if that error keeps popping, contact us in the grove.");
      messages.set("reactivateSubscription404","Our payment processing platform could not find the subscription you want to reactivate, which is very unusual. Could you drop us an email so we can get you sorted?");

      // manage the unexpected errors
      let message = messages.get(props.origin + props.result.errorCode);
      if (message === undefined) {message = "We have encountered the unexpected. Mark the calendar! And maybe contact us in the grove."}

      result = (
        <div className="alert alert-danger alert-dismissible fade show my-4" role="alert">
          {props.translate(message)}
          <button type="button" className="btn-close" aria-label="Close" onClick={e => {
            e.preventDefault();
            setShow(false);
          }} />
        </div>
      );
    }
  } 
  return show ? result : null;
}
