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
      })
    }
  }

  return {customerCreated, subscribed, createCustomer};
}