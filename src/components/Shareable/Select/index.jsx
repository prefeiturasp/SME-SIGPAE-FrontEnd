import PropTypes from "prop-types";
import React from "react";
import "./style.scss";
import { InputErroMensagem } from "../Input/InputErroMensagem";
import { HelpText } from "../../Shareable/HelpText";
import TooltipIcone from "src/components/Shareable/TooltipIcone";

export const Select = (props) => {
  const {
    className,
    labelClassName,
    disabled,
    helpText,
    input,
    label,
    meta,
    name,
    naoDesabilitarPrimeiraOpcao,
    onChange,
    options,
    tooltipText,
    required,
    width,
    usarDirty,
    onChangeEffect,
    dataTestId,
    id,
  } = props;
  return (
    <div className="select" data-testid={dataTestId}>
      {label && [
        required && !disabled && (
          <span key={0} className="required-asterisk">
            *
          </span>
        ),
        <label
          key={1}
          htmlFor={id || name}
          className={`${labelClassName || "col-form-label"}`}
        >
          {label}
        </label>,
        tooltipText && <TooltipIcone key={2} tooltipText={tooltipText} />,
      ]}
      <select
        {...input}
        className={`form-control ${className} ${
          meta &&
          (usarDirty ? meta.dirty || meta.touched : meta.touched) &&
          meta.error &&
          "invalid-field"
        }`}
        disabled={disabled}
        data-cy={label}
        required={required}
        onChange={(e) => {
          if (input) input.onChange(e);
          else onChange(e);

          if (onChangeEffect) onChangeEffect(e);
        }}
        name={name}
        id={id || name}
        style={width && { width: width - 12 }}
      >
        {options &&
          options.length > 0 &&
          options.map((e, key) => {
            return (
              <option
                key={key}
                value={e.uuid}
                disabled={
                  e.disabled || (key === 0 && !naoDesabilitarPrimeiraOpcao)
                }
              >
                {e.nome}
              </option>
            );
          })}
      </select>
      <HelpText helpText={helpText} />
      <InputErroMensagem meta={meta} dirtyValidation={usarDirty} />
    </div>
  );
};

Select.propTypes = {
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      nome: PropTypes.string,
      uuid: PropTypes.string,
      disable: PropTypes.bool,
      selected: PropTypes.bool,
    }),
  ),
  name: PropTypes.string,
};

export default Select;
