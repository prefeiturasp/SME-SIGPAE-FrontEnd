import React, { Component } from "react";
import MaskedInput from "react-text-mask";
import { InputErroMensagem } from "components/Shareable/Input/InputErroMensagem";
import { HelpText } from "components/Shareable/HelpText";
import "../style.scss";

class MaskedInputText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ehCelular: false
    };
  }

  render() {
    const {
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
      disabled
    } = this.props;
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
          </label>
        ]}
        <MaskedInput
          {...input}
          name={name}
          id={id}
          mask={mask}
          className={`form-control ${className} ${meta &&
            meta.touched &&
            (meta.error || meta.warning) &&
            "invalid-field"}`}
          guide={false}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
        />
        <HelpText helpText={helpText} />
        <InputErroMensagem meta={meta} />
      </div>
    );
  }
}

export default MaskedInputText;
