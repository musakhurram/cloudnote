import React from "react";

function Alert(props) {
  const Capitalize = (word) => {
    if (!word) return "";

    const lower = word.toLowerCase();
    if (lower === "danger") return "Error";
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  if (!props.alert) return null;

  const isError = props.alert.type === "danger";

  return (
    <div className="toast-wrap" role="alert" aria-live="assertive">
      <div className={`toast ${isError ? "toast-error" : "toast-success"}`}>
        <span className="toast-icon">
          <i
            className={`fa-solid ${isError ? "fa-circle-exclamation" : "fa-circle-check"}`}
            aria-hidden="true"
          ></i>
        </span>
        <span className="toast-msg">
          <strong>{Capitalize(props.alert.type)}</strong>
          {props.alert.msg}
        </span>
      </div>
    </div>
  );
}

export default Alert;
