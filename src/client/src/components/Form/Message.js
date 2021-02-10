import React from 'react';

export default function Message(props) {
  let message = null;
  if (props.result && !props.result.success) {
    message = (
      <div className="alert alert-danger alert-dismissible fade show my-4" role="alert">
        {/* TODO: create an enum for all possible message to use here */}
        {props.result.message}
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" />
      </div>
    );
  } else {
    // TODO: implement the green/success message
  }
  return message;
}
