import MultiSelect from "@khanacademy/react-multi-select";
import React from "react";

import { InputErroMensagem } from "components/Shareable/Input/InputErroMensagem";
import { HelpText } from "components/Shareable/HelpText";

import "./styles.scss";

export default ({
  disableSearch,
  input,
  meta,
  label,
  required,
  labelClassName,
  helpText,
  nomeDoItemNoPlural,
  pluralFeminino,
  ...props
}) => {
  const allItemsAreSelectedText = `${
    pluralFeminino ? "Todas as" : "Todos os"
  } ${nomeDoItemNoPlural} estão ${
    pluralFeminino ? "selecionadas" : "selecionados"
  }`;

  const disabledInputValue = () => {
    if (
      Array.isArray(input.value) &&
      input.value.length > 1 &&
      input.value.length === props.options.length
    ) {
      return allItemsAreSelectedText;
    } else if (input.value[0]) {
      const matchingOption = props.options.find(
        e => e.value === input.value[0]
      );
      return matchingOption ? matchingOption.label : "";
    }
    return "";
  };

  return (
    <div className="select final-form-multi-select">
      {label && [
        required && (
          <span key={0} className="required-asterisk">
            *
          </span>
        ),
        <label
          key={1}
          htmlFor={input.name}
          className={`${labelClassName || "col-form-label"}`}
        >
          {label}
        </label>
      ]}
      {!props.disabled && (
        <MultiSelect
          {...props}
          {...input}
          onSelectedChanged={input.onChange}
          disableSearch={props.disabled || disableSearch}
          selected={input.value}
          overrideStrings={{
            selectAll: pluralFeminino ? "Todas" : "Todos",
            search: "Busca",
            allItemsAreSelected:
              input.value.length === 1 && props.options[0]
                ? props.options[0].label
                : allItemsAreSelectedText
          }}
          valueRenderer={(selected, options) => {
            if (selected.length === 0) {
              return "Selecione...";
            }
            if (selected.length === 1) {
              return selected.value;
            }

            if (selected.length === options.length) {
              return allItemsAreSelectedText;
            }

            return `Selecionou ${selected.length} ${nomeDoItemNoPlural}`;
          }}
        />
      )}
      {props.disabled && (
        <input
          className={`form-control ${meta &&
            meta.touched &&
            (meta.error || meta.warning) &&
            "invalid-field"}`}
          disabled={props.disabled}
          data-cy={input.name}
          required={required}
          value={disabledInputValue()}
        />
      )}
      <HelpText helpText={helpText} />
      <InputErroMensagem meta={meta} dirty />
    </div>
  );
};
