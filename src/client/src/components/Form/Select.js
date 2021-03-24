import Info from "../Icons/Info";

export default function Select(props) {
  // If props placeholder is not provided, there is no empty value
  // and select starts with first option
  const placeholder = props.placeholder ? (
    <option key="0" value="">{props.placeholder}</option>
  ) : null;

  const options = props.options.map((o, index) => (
    <option key={index + 1} value={o.value}>{o.label}</option>
  ));

  const infoButton = props.info ? (
    <button
      className="btn text-secondary btn-icon p-0"
      type="button"
      id="button-help"
      data-bs-toggle="collapse"
      data-bs-target={`#collapse-help-${props.id}`}
      aria-expanded="false"
      aria-controls={`collapse-help-${props.id}`}
      tabIndex="-1"
    >
      <Info />
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
        <div className="col pe-0">
          <div className="form-floating mb-3">
            <select
              className="form-select"
              id={props.id}
              name={props.name ? props.name : null}
              aria-label={props.ariaLabel ? props.ariaLabel : null}
              required={props.required ? props.required : null}
              title={props.placeholder}
              value={props.value}
              onChange={props.handleChange}
            >
              {placeholder}
              {options}
            </select>
            <label
              htmlFor={props.id}
              className="form-label text-secondary"
            >
              {props.label}
            </label>
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
