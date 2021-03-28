import axios from "axios";
import {errorCallback} from "./Helpers";

export function useSubscription(token, account, getAccount) {
  const customerCreated = account.stripeCusId !== null;
  const subscribed = account.subscription !== null && account.subscription.endAt > (new Date().getTime() / 1000);

  function createCustomer(cb) {
    if (token !== null && account.stripeCusId === null) {
      axios({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        url: `${process.env.REACT_APP_API}/subscriptions/stripe-customers`
      }).then(() => {
        if (cb) {
          const result = {
            success: true,
            message: "Customer created successfully."
          }
          // Fetch account to retrieve the new stripeCusId value
          getAccount();
          cb(result);
        }
      }).catch(err => {
        errorCallback(err, cb);
      });
    }
  }

  function createSubscription(paymentMethod, cb) {
    if (token !== null && account.stripeCusId !== null) {
      axios({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        url: `${process.env.REACT_APP_API}/subscriptions`,
        data: paymentMethod
      }).then(() => {
        // Success, fetch account to retrieve the subscription
        getAccount();
        if (cb) {
          const result = {
            success: true
          }
          cb(result);
        }
      }).catch(err => {
        // Let caller know that something went wrong
        errorCallback(err, cb);
      });
    }
  }

  function updateSubscription(data, cb) {
    if (token !== null && account.subscription !== null) {
      axios({
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        url: `${process.env.REACT_APP_API}/subscriptions/${account.subscription.subscriptionId}`,
        data: data
      }).then(() => {
        // Success, fetch account to retrieve the updated subscription
        getAccount();
        if (cb) {
          const result = {
            success: true
          }
          cb(result);
        }
      }).catch(err => {
        // Let caller know that something went wrong
        errorCallback(err, cb);
      });
    }
  }

  return {customerCreated, subscribed, createCustomer, createSubscription, updateSubscription};
}