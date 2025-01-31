import { Input, AutoComplete } from "antd";
import React from "react";
import { InputErroMensagem } from "components/Shareable/Input/InputErroMensagem";
import { HelpText } from "components/Shareable/HelpText";
import "./style.scss";
import TooltipIcone from "../TooltipIcone";
import ContadorCaracteres from "../ContadorCaracteres";
import Label from "../Label";

export default ({
  options,
  label,
  helpText,
  meta,
  className,
  input,
  name,
  required,
  tooltipText,
  contador,
  apenasNumeros,
  proibeLetras,
  proibeNumeros,
  onChange,
  dataTestId,
  ...props
}) => {
  const handleInput = (e) => {
    e.target.value = apenasNumeros
      ? e.target.value.replace(/\D/g, "")
      : e.target.value;

    e.target.value = proibeLetras
      ? e.target.value.replace(/[A-Za-z]/, "")
      : e.target.value;

    e.target.value = proibeNumeros
      ? e.target.value.replace(/[0-9]/, "")
      : e.target.value;
  };

  const handleBlur = () => {
    const selectedOption = options.find((opt) => opt.value === input.value);
    if (!selectedOption) {
      input.onChange("");
    }
  };

  return (
    <div className="input">
      <Label content={label} required={required} htmlFor={name} />
      {tooltipText && <TooltipIcone tooltipText={tooltipText} />}
      <AutoComplete
        {...props}
        {...input}
        onChange={(value) => {
          input.onChange(value);
          onChange && onChange(value);
        }}
        className="autocomplete-select"
        options={options}
        onInput={handleInput}
        onBlur={handleBlur}
        maxLength={props.maxLength || contador}
      >
        <Input
          {...input}
          data-testid={dataTestId}
          className={`${className} ${
            meta &&
            meta.touched &&
            (meta.error || meta.warning) &&
            "invalid-field"
          }`}
          name={name}
          size="large"
        />
      </AutoComplete>
      {contador && (
        <ContadorCaracteres atual={input.value.length} max={contador} />
      )}
      <HelpText helpText={helpText} />
      <InputErroMensagem meta={meta} />
    </div>
  );
};
