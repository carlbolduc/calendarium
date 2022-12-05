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
        data: {id: paymentMethod.id}
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

  function cancelSubscription(cb) {
    if (token !== null && account.subscription !== null) {
      updateSubscription({ cancelAtPeriodEnd: true }, cb);
    }
  }

  function reactivateSubscription(cb) {
    if (token !== null && account.subscription !== null) {
      updateSubscription({ cancelAtPeriodEnd: false }, cb);
    }
  }

  function createCheckoutSession(cb) {
    if (token !== null && account.subscription !== null) {
      axios({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        url: `${process.env.REACT_APP_API}/subscriptions/checkout-sessions`,
      })
        .then(res => {
          if (cb) {
            cb(res.data);
          }
        })
        .catch((err) => {
          // Let caller know that something went wrong
          errorCallback(err, cb);
        });
    }
  }

  function updatePaymentMethod(sessionId, cb) {
    axios({
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      url: `${process.env.REACT_APP_API}/subscriptions/checkout-sessions/${sessionId}`,
    })
      .then(() => {
        if (cb) {
          cb({success: true});
        }
      })
      .catch((err) => {
        // Let caller know that something went wrong
        errorCallback(err, cb);
      });
  }

  function startTrial(cb) {
    if (token !== null) {
      axios({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        url: `${process.env.REACT_APP_API}/subscriptions/trials`,
      })
        .then(() => {
          // Success, fetch account to retrieve the trial subscription
          getAccount();
          if (cb) {
            const result = {
              success: true,
            };
            cb(result);
          }
        })
        .catch((err) => {
          // Let caller know that something went wrong
          errorCallback(err, cb);
        });
    }
  }

  return {customerCreated, subscribed, createCustomer, createSubscription, cancelSubscription, reactivateSubscription, createCheckoutSession, updatePaymentMethod, startTrial};
}