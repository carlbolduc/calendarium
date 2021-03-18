import {useState, useEffect} from "react";

// TODO: translate
export default function ReadOnlyIframe(props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  }, [copied])

  function copy() {
    navigator.clipboard.writeText(props.iframe).then(() => {
      setCopied(true);
    });
  }

  return (
    <div className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        readOnly={true}
        value={props.iframe}
        style={{fontSize: ".6rem"}}
      />
      <span
        className="input-group-text"
        style={copied ? {} : {cursor: "pointer"}}
        onClick={copied ? null : copy}
      >
        {copied ? "Copied" : "Copy"}
      </span>
    </div>
  );
}