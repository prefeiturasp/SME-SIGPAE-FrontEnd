import PropTypes from "prop-types";
import React, { useState } from "react";
import { InputErroMensagem } from "../InputErroMensagem";
import { HelpText } from "../../../Shareable/HelpText";
import "../style.scss";
import TooltipIcone from "../../TooltipIcone";

export const InputPassword = (props) => {
  const {
    className,
    disabled,
    esconderAsterisco,
    helpText,
    input,
    label,
    labelClassName,
    meta,
    name,
    placeholder,
    required,
    title,
    tooltipText,
    maxlength,
    pattern,
    toUppercaseActive,
    dataTestIdDiv,
  } = props;

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  return (
    <div className={"input show-hide-password "} data-testid={dataTestIdDiv}>
      {label && [
        required && !esconderAsterisco && (
          <span key={0} className="required-asterisk">
            *
          </span>
        ),
        <label
          key={1}
          htmlFor={name}
          className={`col-form-label ${labelClassName}`}
        >
          {label}
        </label>,
      ]}
      {tooltipText && <TooltipIcone tooltipText={tooltipText} />}
      <input
        {...input}
        className={`form-control ${className} ${
          meta &&
          meta.touched &&
          (meta.error || meta.warning) &&
          "invalid-field"
        }`}
        disabled={disabled}
        name={name}
        data-cy={input.name}
        data-testid={input.name}
        placeholder={placeholder}
        required={required}
        type={passwordShown ? "text" : "password"}
        pattern={pattern}
        title={title}
        maxLength={maxlength}
        onInput={(e) => {
          e.target.value = toUppercaseActive
            ? e.target.value.toUpperCase()
            : e.target.value;
        }}
      />
      <i
        className={`show-hide ${
          passwordShown ? "fa fa-eye-slash" : "fa fa-eye"
        }`}
        onClick={togglePasswordVisiblity}
      />
      <HelpText helpText={helpText} />
      <InputErroMensagem meta={meta} />
    </div>
  );
};

InputPassword.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  esconderAsterisco: PropTypes.bool,
  helpText: PropTypes.string,
  input: PropTypes.object,
  label: PropTypes.string,
  labelClassName: PropTypes.string,
  meta: PropTypes.object,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string,
  contador: PropTypes.number,
  dataTestIdDiv: PropTypes.string,
  title: PropTypes.string,
  tooltipText: PropTypes.string,
  maxlength: PropTypes.number,
  pattern: PropTypes.string,
  toUppercaseActive: PropTypes.bool,
};

InputPassword.defaultProps = {
  className: "",
  disabled: false,
  esconderAsterisco: false,
  helpText: "",
  input: {},
  label: "",
  labelClassName: "",
  meta: {},
  name: "",
  placeholder: "",
  required: false,
  type: "password",
};

export default InputPassword;
