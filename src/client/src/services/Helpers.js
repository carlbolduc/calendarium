import {useState, useEffect, useCallback, useRef} from "react";

export function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    ((c ^ crypto.getRandomValues(new Uint8Array(1))[0]) & (15 >> c / 4)).toString(16)
  );
}

export function useStateCallback(initialState) {
  const [state, setState] = useState(initialState);
  const cbRef = useRef(null);

  const setStateCallback = useCallback((state, cb) => {
    cbRef.current = cb;
    setState(state);
  }, []);

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null;
    }
  }, [state]);

  return [state, setStateCallback];
}

export function errorCallback(err, cb) {
  if (cb) {
    const result = {
      success: false,
      message: err.message,
      errorCode: err.response.status
    }
    cb(result);
  }
}