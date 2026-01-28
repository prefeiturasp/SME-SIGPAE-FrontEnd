import PropTypes from "prop-types";
import React from "react";
import { InputErroMensagem } from "../InputErroMensagem";
import { HelpText } from "../../../Shareable/HelpText";
import { ContadorCaracteres } from "../../ContadorCaracteres";
import "../style.scss";
import TooltipIcone from "../../TooltipIcone";
import {
  agruparMilharDecimal,
  agruparMilharInteirosPositivos,
} from "./helpers";
import { formataMilhar } from "src/helpers/utilities";

export const InputText = (props) => {
  const {
    acrescentarAppend,
    className,
    disabled,
    esconderAsterisco,
    helpText,
    input,
    label,
    labelClassName,
    meta,
    min,
    step,
    max,
    name,
    placeholder,
    required,
    title,
    tooltipText,
    maxlength,
    pattern,
    icone,
    contador,
    toUppercaseActive,
    toLowerCaseActive,
    apenasNumeros,
    id,
    proibeLetras,
    proibeNumeros,
    agrupadorMilhar,
    agrupadorMilharComDecimal,
    agrupadorMilharPositivo,
    valorInicial,
    inputOnChange,
    prefix,
    suffix,
    onBlur,
    dataTestId,
    dataTestIdDiv,
  } = props;

  const inputProps = {
    ...input,
    onChange: (e) => {
      input?.onChange(e);
      inputOnChange && inputOnChange(e);
    },
    onBlur: (e) => {
      input?.onBlur(e);
      onBlur && onBlur(e);
    },
  };

  return (
    <div
      className={`input ${icone && "icon"}`}
      data-testid={dataTestIdDiv || "input-div"}
    >
      {label && [
        required && !esconderAsterisco && (
          <span key={0} className="required-asterisk">
            *
          </span>
        ),
        <label
          key={1}
          htmlFor={id || name || input?.name}
          className={`col-form-label ${labelClassName}`}
        >
          {label}
        </label>,
      ]}
      {tooltipText && <TooltipIcone tooltipText={tooltipText} />}
      <div
        className={`${prefix ? "input-com-prefixo" : suffix ? "input-com-sufixo" : ""}`}
      >
        {prefix && <span className="prefix">{prefix}</span>}
        <input
          {...input}
          {...inputProps}
          className={`form-control ${className} ${
            meta &&
            (meta.touched || meta.submitFailed) &&
            (meta.error || meta.warning) &&
            "invalid-field"
          }`}
          id={id}
          data-testid={dataTestId}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          name={name}
          data-cy={input?.name}
          placeholder={placeholder}
          required={required}
          type={input?.type || "text"}
          title={title}
          pattern={pattern}
          maxLength={maxlength}
          value={valorInicial || input?.value}
          onInput={(e) => {
            e.target.value = toUppercaseActive
              ? e.target.value.toUpperCase()
              : e.target.value;
            e.target.value = toLowerCaseActive
              ? e.target.value.toLowerCase()
              : e.target.value;
            e.target.value = apenasNumeros
              ? e.target.value.replace(/\D/g, "")
              : e.target.value;
            e.target.value = proibeLetras
              ? e.target.value.replace(/[A-Za-z]/, "")
              : e.target.value;
            e.target.value = proibeNumeros
              ? e.target.value.replace(/[0-9]/, "")
              : e.target.value;
            e.target.value = agrupadorMilhar
              ? formataMilhar(e.target.value)
              : e.target.value;
            e.target.value = agrupadorMilharComDecimal
              ? agruparMilharDecimal(e.target.value)
              : e.target.value;
            e.target.value = agrupadorMilharPositivo
              ? agruparMilharInteirosPositivos(e.target.value)
              : e.target.value;
          }}
        />
        {suffix && <div className="suffix">{suffix}</div>}
      </div>
      {acrescentarAppend && (
        <div className="input-group-append">
          <span className="input-group-text" id="basic-addon1">
            {acrescentarAppend}
          </span>
        </div>
      )}
      {icone && <i className={icone} />}
      {contador && (
        <ContadorCaracteres atual={input?.value.length} max={contador} />
      )}
      <HelpText helpText={helpText} />
      <InputErroMensagem meta={meta} />
    </div>
  );
};

InputText.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  esconderAsterisco: PropTypes.bool,
  helpText: PropTypes.string,
  input: PropTypes.object,
  label: PropTypes.string,
  step: PropTypes.string,
  labelClassName: PropTypes.string,
  meta: PropTypes.object,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string,
  contador: PropTypes.number,
  valorInicial: PropTypes.string,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
};

export default InputText;
