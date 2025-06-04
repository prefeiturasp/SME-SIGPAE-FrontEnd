import React from "react";
import Select from "../Select";

const SelectSelecione = (props) => {
  const {
    input: { onChange, value },
    options,
    placeholder,
    ...rest
  } = props;
  return (
    <Select
      naoDesabilitarPrimeiraOpcao={value !== undefined}
      options={
        value === ""
          ? [{ uuid: "0", nome: placeholder || "Selecione..." }].concat(options)
          : options
      }
      input={{ value: value || "0", onChange }}
      usarDirty={true}
      {...rest}
    />
  );
};

export default SelectSelecione;
