import React, { useState } from "react";
import ptBR from "date-fns/locale/pt-BR";
import DatePicker from "react-datepicker";
import InputErroMensagem from "src/components/Shareable/Input/InputErroMensagem";
import { HelpText } from "src/components/Shareable/HelpText";
import "./style.scss";

const DataTermino = ({
  label,
  labelClassName,
  name,
  required,
  labelDesligado,
  labelLigado,
  temData,
  minDate,
  input,
  className,
  meta,
  hasIcon,
  datePickerProps,
  helpText,
  _calendar,
}) => {
  const [comData, setComData] = useState(temData);

  const onSemDataTerminoSelected = () => {
    input.onChange(undefined);
    setComData(false);
  };

  const onComDataTerminoSelected = () => {
    setComData(true);
  };

  const handleChange = (data) => {
    input.onChange(data);
  };

  const openDatepicker = () => {
    _calendar.setOpen(true);
    _calendar.setFocus();
  };

  return (
    <div className="data-opcional">
      {label && [
        required && <span className="required-asterisk">*</span>,
        <p
          key={1}
          htmlFor={name}
          className={`col-form-label ${labelClassName}`}
        >
          {label}
        </p>,
      ]}
      <div className="data-opcional-inner">
        <label className="container-radio">
          {labelDesligado}
          <input
            onChange={onSemDataTerminoSelected}
            type="radio"
            checked={!comData}
          />
          <span className="checkmark" />
        </label>
        <label className="container-radio">
          {labelLigado}
          <input
            onChange={onComDataTerminoSelected}
            type="radio"
            checked={comData}
          />
          <span className="checkmark" />
        </label>
        <DatePicker
          {...datePickerProps}
          isClearable={true}
          selected={input.value}
          className={`form-control ${className} ${
            meta.touched && meta.error && "invalid-field"
          }`}
          ref={(c) => (_calendar = c)}
          onChange={handleChange}
          locale={ptBR}
          minDate={minDate}
          name={name}
          disabled={!comData}
          dateFormat="dd/MM/yyyy"
          strictParsing
        />
        {hasIcon && (
          <i onClick={openDatepicker} className="fas fa-calendar-alt" />
        )}
      </div>
      <HelpText helpText={helpText} />
      <InputErroMensagem meta={meta} />
    </div>
  );
};

export default DataTermino;
