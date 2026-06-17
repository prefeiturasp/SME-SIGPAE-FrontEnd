import React from "react";
import StatefulMultiSelect from "src/components/Shareable/MultiSelect/StatefulMultiSelect";
import "./style.scss";
import { HelpText } from "../HelpText";
import InputErroMensagem from "../Input/InputErroMensagem";

export const MultiSelect = (props) => {
  const {
    disableSearch,
    helpText,
    label,
    meta,
    name,
    options,
    onSelectedChange,
    required,
    selected,
    overrideStrings,
    disabled,
  } = props;
  return (
    <div className={`select ${meta.touched && meta.error && "erro-borda"}`}>
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
      <StatefulMultiSelect
        name={name}
        selected={selected}
        options={options}
        onSelectedChanged={onSelectedChange}
        disableSearch={disableSearch}
        overrideStrings={
          overrideStrings || {
            selectSomeItems: "Selecione",
            allItemsAreSelected: "Todos os itens estão selecionados",
            selectAll: "Todos",
          }
        }
        disabled={disabled}
      />
      <HelpText helpText={helpText} />
      <InputErroMensagem meta={meta} />
    </div>
  );
};
