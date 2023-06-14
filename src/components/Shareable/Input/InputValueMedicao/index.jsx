import React from "react";
import { Tooltip } from "antd";
import PropTypes from "prop-types";
import "../style.scss";

export const InputText = props => {
  const {
    className,
    disabled,
    esconderAsterisco,
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
    type,
    inputType,
    title,
    maxlength,
    pattern,
    icone,
    toUppercaseActive,
    apenasNumeros,
    exibeTooltipDiaSobremesaDoce,
    exibeTooltipErroQtdMaiorQueAutorizado,
    numeroDeInclusoesAutorizadas,
    exibeTooltipAlimentacoesAutorizadasDiaNaoLetivo,
    exibeTooltipSuspensoesAutorizadas,
    exibeTooltipRPLAutorizadas,
    exibeTooltipLPRAutorizadas,
    exibeTooltipQtdKitLancheDiferenteSolAlimentacoesAutorizadas,
    exibeTooltipKitLancheSolAlimentacoes,
    exibeTooltipQtdLancheEmergencialDiferenteSolAlimentacoesAutorizadas,
    exibeTooltipLancheEmergencialSolAlimentacoes,
    exibeTooltipFrequenciaZeroTabelaEtec,
    exibeTooltipLancheEmergTabelaEtec,
    ehGrupoETECUrlParam,
    ehProgramasEProjetos
  } = props;

  let msgTooltip = "";

  const validacaoMeta = () => {
    return meta && (meta.error || meta.warning);
  };

  const validacaoFrequencia = () => {
    if (validacaoMeta() && input.name.includes("frequencia")) {
      msgTooltip = meta.error;
      return true;
    }
    return false;
  };

  const validacaoLancheRefeicaoSobremesa1Oferta = () => {
    let validacao =
      validacaoMeta() &&
      (input.name.includes("refeicao") ||
        input.name.includes("sobremesa") ||
        input.name.includes("lanche"));
    if (!ehGrupoETECUrlParam && !ehProgramasEProjetos) {
      validacao =
        validacaoMeta() &&
        (input.name.includes("refeicao") ||
          input.name.includes("sobremesa") ||
          input.name.includes("lanche")) &&
        !input.name.includes("repeticao");
    }
    if (validacao) {
      msgTooltip = meta.error;
      return true;
    }
    return false;
  };

  const exibirTooltipAlimentacoesAutorizadasDiaNaoLetivo = () => {
    return (
      exibeTooltipAlimentacoesAutorizadasDiaNaoLetivo &&
      Number(input.value) > Number(numeroDeInclusoesAutorizadas)
    );
  };

  return (
    <div className={`input ${icone && "icon"}`}>
      {label && [
        required && !esconderAsterisco && (
          <span key={0} className="required-asterisk">
            *
          </span>
        ),
        <label
          key={1}
          htmlFor={name}
          className={`col-form-label ${labelClassName}`}
        >
          {label}
        </label>
      ]}
      {exibeTooltipDiaSobremesaDoce && (
        <Tooltip
          title={
            "Dia de sobremesa doce. Justifique o lançamento de repetição nas observações."
          }
        >
          <i className="fas fa-info icone-info-success" />
        </Tooltip>
      )}
      {exibirTooltipAlimentacoesAutorizadasDiaNaoLetivo() && (
        <Tooltip
          title={
            "Número apontado de alimentações maior do que o autorizado. Justifique na Observação."
          }
        >
          <i className="fas fa-info icone-info-warning" />
        </Tooltip>
      )}
      {exibeTooltipSuspensoesAutorizadas && (
        <Tooltip
          title={
            "Há suspensão de alimentação autorizada para essa data. Obrigatório adicionar observação para lançamentos neste dia."
          }
        >
          <i className="fas fa-info icone-info-warning" />
        </Tooltip>
      )}
      {exibeTooltipRPLAutorizadas && (
        <Tooltip
          title={
            "Há autorização de RPL para essa data. Justifique o apontamento de refeição."
          }
        >
          <i className="fas fa-info icone-info-warning" />
        </Tooltip>
      )}
      {exibeTooltipLPRAutorizadas && (
        <Tooltip
          title={
            "Há autorização de LPR para essa data. Justifique o apontamento de Lanche. Obrigatório adicionar observação."
          }
        >
          <i className="fas fa-info icone-info-warning" />
        </Tooltip>
      )}
      {exibeTooltipQtdKitLancheDiferenteSolAlimentacoesAutorizadas && (
        <Tooltip
          title={
            "Quantidade lançada diferente da autorizada. Justifique na Observação para análise de CODAE."
          }
        >
          <i className="fas fa-info icone-info-warning" />
        </Tooltip>
      )}
      {exibeTooltipKitLancheSolAlimentacoes && (
        <Tooltip
          title={
            "Não há autorização para oferta de Kit Lanche. Justifique na Observação para análise de CODAE."
          }
        >
          <i className="fas fa-info icone-info-warning" />
        </Tooltip>
      )}
      {exibeTooltipQtdLancheEmergencialDiferenteSolAlimentacoesAutorizadas && (
        <Tooltip
          title={
            "Quantidade lançada diferente da autorizada. Justifique na Observação para análise de CODAE."
          }
        >
          <i className="fas fa-info icone-info-warning" />
        </Tooltip>
      )}
      {exibeTooltipLancheEmergencialSolAlimentacoes && (
        <Tooltip
          title={
            "Não há autorização para oferta de Lanche Emergencial. Justifique na Observação para análise de CODAE."
          }
        >
          <i className="fas fa-info icone-info-warning" />
        </Tooltip>
      )}
      {exibeTooltipFrequenciaZeroTabelaEtec && (
        <Tooltip
          title={
            "Nenhuma frequência apontada, porém havia inclusão autorizada. Justifique na Observação."
          }
        >
          <i className="fas fa-info icone-info-warning" />
        </Tooltip>
      )}
      {exibeTooltipLancheEmergTabelaEtec && (
        <Tooltip
          title={
            "Foi solicitada inclusão de Lanche Emergencial no período. Justifique o apontamento nas Observações."
          }
        >
          <i className="fas fa-info icone-info-warning" />
        </Tooltip>
      )}
      {(validacaoFrequencia() || validacaoLancheRefeicaoSobremesa1Oferta()) && (
        <Tooltip title={msgTooltip}>
          <i className="fas fa-info icone-info-error" />
        </Tooltip>
      )}
      {!meta.error &&
        exibeTooltipErroQtdMaiorQueAutorizado &&
        !["Mês anterior", "Mês posterior"].includes(input.value) && (
          <Tooltip
            title={`Número apontado de alimentação é maior que número autorizado (${numeroDeInclusoesAutorizadas}). Justifique na Observação.`}
          >
            <i className="fas fa-info icone-info-warning" />
          </Tooltip>
        )}

      <input
        {...input}
        className={`form-control ${className} ${
          validacaoFrequencia() || validacaoLancheRefeicaoSobremesa1Oferta()
            ? "invalid-field"
            : ""
        } ${
          !meta.error &&
          (exibirTooltipAlimentacoesAutorizadasDiaNaoLetivo() ||
            exibeTooltipErroQtdMaiorQueAutorizado ||
            exibeTooltipSuspensoesAutorizadas ||
            exibeTooltipRPLAutorizadas ||
            exibeTooltipLPRAutorizadas ||
            exibeTooltipQtdKitLancheDiferenteSolAlimentacoesAutorizadas ||
            exibeTooltipKitLancheSolAlimentacoes ||
            exibeTooltipQtdLancheEmergencialDiferenteSolAlimentacoesAutorizadas ||
            exibeTooltipLancheEmergencialSolAlimentacoes ||
            exibeTooltipFrequenciaZeroTabelaEtec ||
            exibeTooltipLancheEmergTabelaEtec)
            ? "border-warning"
            : ""
        }`}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        name={name}
        data-cy={input.name}
        placeholder={placeholder}
        required={required}
        type={inputType ? inputType : type}
        title={title}
        pattern={pattern}
        maxLength={maxlength}
        onInput={e => {
          e.target.value = toUppercaseActive
            ? e.target.value.toUpperCase()
            : e.target.value;
          e.target.value = apenasNumeros
            ? e.target.value.replace(/\D/g, "")
            : e.target.value;
        }}
      />
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
  contador: PropTypes.number
};

InputText.defaultProps = {
  className: "",
  disabled: false,
  esconderAsterisco: false,
  helpText: "",
  input: {},
  label: "",
  step: "0.01",
  labelClassName: "",
  meta: {},
  name: "",
  placeholder: "",
  required: false,
  type: "text"
};

export default InputText;
