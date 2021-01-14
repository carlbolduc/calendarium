import axios from 'axios';

export default function Api(signOut) {
  const defaultOptions = {
    baseURL: process.env.REACT_APP_API,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let instance = axios.create(defaultOptions);

  // Set the AUTH token for any request
  instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token");
    if (token !== null) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (res) => {
      return res;
    },
    (error) => {
      if (error.response !== undefined) {
        if ([401, 403].indexOf(error.response.status) !== -1) {
          // bad token, contact doesn't exist
          signOut();
        } else {
          return error;
        }
      } else {
        return error;
      }
    }
  );

  return instance;
}
