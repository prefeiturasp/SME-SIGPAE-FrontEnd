import { Input, AutoComplete } from "antd";
import React, { Component } from "react";
import { InputErroMensagem } from "components/Shareable/Input/InputErroMensagem";
import { HelpText } from "components/Shareable/HelpText";
import "./style.scss";

export default class AutoCompleteField extends Component {
  render() {
    const {
      label,
      helpText,
      meta,
      className,
      onSearch,
      input,
      name,
      required,
      esconderIcone,
      toUppercaseActive,
      maxlength,
      proibeNumeros,
      ...props
    } = this.props;
    return (
      <div className="input">
        {label && [
          required && (
            <span key={0} className="required-asterisk">
              *
            </span>
          ),
          <label key={1} htmlFor={name} className="col-form-label">
            {label}
          </label>
        ]}
        <AutoComplete
          className="autocomplete"
          {...props}
          {...input}
          onSearch={onSearch}
          maxLength={maxlength}
          onInput={e => {
            e.target.value = toUppercaseActive
              ? e.target.value.toUpperCase()
              : e.target.value;
            e.target.value = proibeNumeros
              ? e.target.value.replace(/[0-9]/, "")
              : e.target.value;
          }}
        >
          {esconderIcone ? (
            <Input
              {...input}
              className={`${className} ${meta &&
                meta.touched &&
                (meta.error || meta.warning) &&
                "invalid-field"}`}
              name={name}
              size="large"
            />
          ) : (
            <Input.Search
              {...input}
              className={`${className} ${meta &&
                meta.touched &&
                (meta.error || meta.warning) &&
                "invalid-field"}`}
              name={name}
              size="large"
              onSearch={onSearch}
            />
          )}
        </AutoComplete>
        <HelpText helpText={helpText} />
        <InputErroMensagem meta={meta} />
      </div>
    );
  }
}
