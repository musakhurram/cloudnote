import React, { useState } from "react";

// Password field with a show/hide toggle. The eye button sits inside the
// input on the right, mirroring the lock icon on the left, and uses the
// app's accent color on hover to match the warm notebook design.
const PasswordInput = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  minLength,
  required,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="input-with-icon password-field">
      <i className="fa-solid fa-lock input-icon" aria-hidden="true"></i>
      <input
        type={visible ? "text" : "password"}
        className="form-control"
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        minLength={minLength}
        required={required}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        title={visible ? "Hide password" : "Show password"}
      >
        <i
          className={`fa-solid ${visible ? "fa-eye" : "fa-eye-slash"}`}
          aria-hidden="true"
        ></i>
      </button>
    </div>
  );
};

export default PasswordInput;
