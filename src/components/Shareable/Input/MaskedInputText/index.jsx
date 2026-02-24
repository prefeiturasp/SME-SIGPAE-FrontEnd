import React from "react";
import MaskedInput from "react-text-mask";
import { InputErroMensagem } from "src/components/Shareable/Input/InputErroMensagem";
import { HelpText } from "src/components/Shareable/HelpText";
import "../style.scss";

const MaskedInputText = ({
  name,
  id,
  input,
  label,
  required,
  helpText,
  meta,
  className,
  placeholder,
  mask,
  disabled,
  inputOnChange,
  dataTestId,
}) => {
  return (
    <div className="input">
      {label && [
        required && (
          <span key={0} className="required-asterisk">
            *
          </span>
        ),
        <label key={1} htmlFor={name} className={`col-form-label`}>
          {label}
        </label>,
      ]}
      <MaskedInput
        {...input}
        name={name}
        id={id}
        data-testid={dataTestId}
        mask={mask}
        className={`form-control ${className} ${
          meta &&
          meta.touched &&
          (meta.error || meta.warning) &&
          "invalid-field"
        }`}
        guide={false}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => {
          input.onChange(e);
          inputOnChange && inputOnChange(e);
        }}
      />
      <HelpText helpText={helpText} />
      <InputErroMensagem meta={meta} />
    </div>
  );
};

export default MaskedInputText;
