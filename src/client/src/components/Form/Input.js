import Info from "../Icons/Info";

export default function Input(props) {
  const infoButton = props.info ? (
    <button
      className="btn text-secondary btn-icon p-0"
      type="button"
      id="button-help"
      data-bs-toggle="collapse"
      data-bs-target={`#collapse-help-${props.id}`}
      aria-expanded="false"
      aria-controls={`collapse-help-${props.id}`}
    >
      <Info />
    </button>
  ) : null;

  const infoText = props.info ? (
    <div className="collapse" id={`collapse-help-${props.id}`}>
      <p className="small">{props.info}</p>
    </div>
  ) : null;

  return props.type === "color" ? (
    // This is for input type: color
    <>
      <div className="mb-3">
        <div className="row">
          <div className="col-auto pe-0">
            <label
              htmlFor={props.id}
              className="form-label"
            >
              {props.label}
            </label>
          </div>
          <div className="col">
            {infoButton}
          </div>
        </div>
        <input
          type={props.type}
          className="form-control form-control-color"
          id={props.id}
          name={props.name ? props.name : null}
          autoComplete={props.autoComplete ? props.autoComplete : null}
          readOnly={props.readOnly ? props.readOnly : null}
          placeholder={props.placeholder}
          title={props.placeholder}
          value={props.value}
          onChange={props.handleChange}
        />
        {props.invalidFeedback}
      </div>
      {infoText}
    </>
  ) : (
      // This is for input types: text, email, password
      <>
        <div className="row">
          <div className="col pe-0">
            <div className="form-floating mb-3">
              <input
                type={props.type}
                className="form-control"
                id={props.id}
                name={props.name ? props.name : null}
                autoComplete={props.autoComplete ? props.autoComplete : null}
                readOnly={props.readOnly ? props.readOnly : null}
                placeholder={props.placeholder ? props.placeholder : null}
                value={props.value}
                onChange={props.handleChange}
                onClick={props.onClick}
              />
              <label
                htmlFor={props.id}
                className="form-label text-secondary"
              >
                {props.label}
              </label>
              {props.invalidFeedback}
            </div>
          </div>
          <div className="col-auto">
            {infoButton}
          </div>
        </div>
        {infoText}
      </>
    );
}