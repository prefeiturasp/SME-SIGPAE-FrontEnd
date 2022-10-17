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
              onSearch={onSearch}
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
