import React, { Component } from "react";
import MaskedInput from "react-text-mask";
import { InputErroMensagem } from "src/components/Shareable/Input/InputErroMensagem";
import { HelpText } from "src/components/Shareable/HelpText";
import "../style.scss";

class InputPhoneNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ehCelular: false,
    };
  }

  verificaCampo(valor) {
    const quantidadeInput = valor.length;
    if (quantidadeInput <= 12) {
      return [
        /[1-9]/,
        /\d/,
        " ",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        " ",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ];
    }
    if (quantidadeInput > 12) {
      return [
        /[1-9]/,
        /\d/,
        " ",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        " ",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ];
    }
  }

  render() {
    const { name, id, input, label, required, helpText, meta, className } =
      this.props;
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
          mask={(valor) => this.verificaCampo(valor)}
          className={`form-control ${className} ${
            meta &&
            meta.touched &&
            (meta.error || meta.warning) &&
            "invalid-field"
          }`}
          guide={false}
          required={required}
        />
        <HelpText helpText={helpText} />
        <InputErroMensagem meta={meta} />
      </div>
    );
  }
}

export default InputPhoneNumber;
