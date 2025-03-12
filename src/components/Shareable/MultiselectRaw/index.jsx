import TooltipIcone from "components/Shareable/TooltipIcone";
import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { HelpText } from "../HelpText";
import InputErroMensagem from "../Input/InputErroMensagem";
import { Option } from "./components/Option";

export const MultiselectRaw = (props) => {
  const {
    allowSelectAll = true,
    closeMenuOnSelect = false,
    disabled,
    helpText,
    hideSelectedOptions = false,
    input,
    isMulti = true,
    label,
    labelClassName,
    meta,
    onSelectedChanged,
    options,
    placeholder = "Selecione",
    required,
    selected,
    tooltipText,
    usarDirty,
  } = props;

  const [opcoesSelecionadas, setOpcoesSelecionadas] = useState(
    options.filter((option) => selected.includes(option.value))
  );

  useEffect(() => {
    setOpcoesSelecionadas(
      options.filter((option) => selected.includes(option.value))
    );
  }, [selected]);

  return (
    <div className="select">
      {label && [
        required && !disabled && (
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
        </label>,
        tooltipText && <TooltipIcone key={2} tooltipText={tooltipText} />,
      ]}
      <ReactSelect
        {...input}
        options={options}
        isDisabled={disabled}
        isMulti={isMulti}
        closeMenuOnSelect={closeMenuOnSelect}
        hideSelectedOptions={hideSelectedOptions}
        components={{
          Option,
        }}
        onChange={(values) => {
          onSelectedChanged(values);
          setOpcoesSelecionadas(values);
        }}
        allowSelectAll={allowSelectAll}
        value={opcoesSelecionadas}
        required={required}
        placeholder={placeholder}
      />
      <HelpText helpText={helpText} />
      <InputErroMensagem meta={meta} dirtyValidation={usarDirty} />
    </div>
  );
};
