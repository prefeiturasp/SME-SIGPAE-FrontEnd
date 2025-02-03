import React from "react";
import PropTypes from "prop-types";
import InputErroMensagem from "../../Input/InputErroMensagem";
import { ContadorCaracteres } from "../../ContadorCaracteres";
import "../style.scss";

export const TextArea = (props) => {
  const {
    className,
    disabled,
    helpText,
    input,
    label,
    meta,
    name,
    placeholder,
    required,
    maxLength,
    contador,
    valorInicial,
    height,
    inputOnChange,
  } = props;

  const inputProps = {
    ...input,
    onChange: (e) => {
      input?.onChange(e);
      inputOnChange && inputOnChange(e);
    },
  };

  return (
    <div className="textarea" data-testid="textarea-div">
      {label && [
        required && (
          <span key={1} className="required-asterisk">
            *
          </span>
        ),
        <label key={2} htmlFor={name} className="col-form-label">
          {label}
        </label>,
      ]}
      <textarea
        style={height && { height: height + "px" }}
        {...input}
        {...inputProps}
        className={`form-control ${className} ${
          meta?.touched && meta?.error && "invalid-field"
        }`}
        disabled={disabled}
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        value={valorInicial || input?.value}
      />
      {contador && (
        <ContadorCaracteres atual={input?.value.length} max={contador} />
      )}
      <div className="help-text">{helpText}</div>
      <InputErroMensagem meta={meta} />
    </div>
  );
};

TextArea.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  helpText: PropTypes.string,
  input: PropTypes.object,
  label: PropTypes.string,
  meta: PropTypes.object,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  contador: PropTypes.number,
  valorInicial: PropTypes.string,
};
