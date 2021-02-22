export default function Checkbox(props) {
  const infoButton = props.info ? (
    <button
      className="btn text-secondary btn-help p-0"
      type="button"
      id="button-help"
      data-bs-toggle="collapse"
      data-bs-target={`#collapse-help-${props.id}`}
      aria-expanded="false"
      aria-controls={`collapse-help-${props.id}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412l-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
      </svg>
    </button>
  ) : null;

  const infoText = props.info ? (
    <div className="collapse" id={`collapse-help-${props.id}`}>
      <p className="small">{props.info}</p>
    </div>
  ) : null;

  return (
    <>
      <div className="row">
        <div className="col-auto pe-0">
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={props.value}
              id={props.id}
              required={props.required ? props.required : null}
              onChange={props.handleChange}
            />
            <label
              className="form-check-label"
              htmlFor={props.id}
            >
              {props.label}
            </label>
            {props.invalidFeedback}
          </div>
        </div>
        <div className="col">
          {infoButton}
        </div>
      </div>
      {infoText}
    </>
  );
}