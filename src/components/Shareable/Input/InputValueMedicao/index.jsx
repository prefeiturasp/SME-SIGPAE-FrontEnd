import React from "react";
import { Tooltip } from "antd";
import PropTypes from "prop-types";
import "../style.scss";

export const InputText = (props) => {
  const {
    classNameToNextInput,
    classNameToPrevInput,
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
    exibeTooltipPadraoRepeticaoDiasSobremesaDoce,
    exibeTooltipRepeticaoDiasSobremesaDoceDiferenteZero,
    exibeTooltipErroQtdMaiorQueAutorizado,
    numeroDeInclusoesAutorizadas,
    exibeTooltipAlimentacoesAutorizadasDiaNaoLetivo,
    exibeTooltipSuspensoesAutorizadas,
    exibeTooltipRPLAutorizadas,
    exibeTooltipLPRAutorizadas,
    exibeTooltipQtdKitLancheDiferenteSolAlimentacoesAutorizadas,
    exibeTooltipQtdKitLancheMenorSolAlimentacoesAutorizadas,
    exibeTooltipKitLancheSolAlimentacoes,
    exibeTooltipQtdLancheEmergencialDiferenteSolAlimentacoesAutorizadas,
    exibeTooltipLancheEmergencialNaoAutorizado,
    exibeTooltipLancheEmergencialAutorizado,
    exibeTooltipLancheEmergencialZeroAutorizado,
    exibeTooltipLancheEmergencialZeroAutorizadoJustificado,
    exibeTooltipFrequenciaZeroTabelaEtec,
    exibeTooltipLancheEmergTabelaEtec,
    exibeTooltipRepeticao,
    exibeTooltipAlimentacoesAutorizadasDiaNaoLetivoCEI,
    exibeTooltipSuspensoesAutorizadasCEI,
    exibeTooltipInclusaoAlimentacaoAutorizadaDreCodae,
    exibeTooltipAlteracaoAlimentacaoAutorizadaDreCodae,
    exibeTooltipSuspensaoAutorizadaFrequenciaDreCodae,
    exibeTooltipSuspensaoAutorizadaAlimentacaoDreCodae,
    exibeTooltipInclusoesAutorizadasComZero,
    exibeTooltipDietasInclusaoDiaNaoLetivoCEI,
    inputOnChange,
    exibeTooltipFrequenciaAlimentacaoZero,
    exibirTooltipPeriodosZeradosNoProgramasProjetos,
  } = props;

  const inputProps = {
    ...input,
    onChange: (e) => {
      input.onChange(e);
      inputOnChange && inputOnChange(e);
    },
  };

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
        input.name.includes("lanche") ||
        input.name.includes("repeticao"));
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
        </label>,
      ]}
      {exibeTooltipPadraoRepeticaoDiasSobremesaDoce && (
        <Tooltip title={"Dia de sobremesa doce."}>
          <i className="fas fa-info icone-info-success" />
        </Tooltip>
      )}
      {exibeTooltipRepeticaoDiasSobremesaDoceDiferenteZero && (
        <Tooltip
          title={
            "Dia de sobremesa doce. Justifique o lançamento de repetição nas observações."
          }
        >
          <i className="fas fa-info icone-info-warning" />
        </Tooltip>
      )}
      {exibeTooltipRepeticao && (
        <Tooltip
          title={`${
            input.name.includes("repeticao_refeicao")
              ? "Lançamento de repetição de refeição maior do que lançamento da 1º Oferta. Confira a digitação."
              : "Lançamento maior do que o registrado na 1º Oferta. Confira a digitação."
          }`}
        >
          <i
            className="fas fa-info icone-info-success"
            data-test-id={`tooltip_${input.name}`}
          />
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
      {exibeTooltipFrequenciaAlimentacaoZero && (
        <Tooltip
          title={
            "Não há apontamento no campo de alimentação. Justifique a frequência de estudantes com dietas especiais autorizadas."
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
      {exibeTooltipInclusoesAutorizadasComZero && (
        <Tooltip
          title={
            "Nenhuma frequência e alimentação apontada, porém havia inclusão autorizada. Justifique na Observação."
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
      {exibeTooltipQtdKitLancheMenorSolAlimentacoesAutorizadas && (
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
      {exibeTooltipLancheEmergencialNaoAutorizado && (
        <Tooltip
          title={
            "Não há autorização para oferta de Lanche Emergencial. Justifique na Observação para análise de CODAE."
          }
        >
          <i className="fas fa-info icone-info-warning" />
        </Tooltip>
      )}
      {exibeTooltipLancheEmergencialZeroAutorizado &&
        !exibeTooltipLancheEmergencialZeroAutorizadoJustificado && (
          <Tooltip
            title={
              "Há autorização de Lanche Emergencial para esta data. Justifique a ausência do lançamento."
            }
          >
            <i className="fas fa-info icone-info-warning" />
          </Tooltip>
        )}
      {exibeTooltipLancheEmergencialZeroAutorizadoJustificado && (
        <Tooltip title={"Há autorização de Lanche Emergencial para esta data."}>
          <i className="fas fa-info icone-info-success" />
        </Tooltip>
      )}
      {exibeTooltipLancheEmergencialAutorizado && (
        <Tooltip
          title={
            "Há autorização de Lanche Emergencial para esta data. Informe a quantidade ofertada."
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
      {exibeTooltipAlimentacoesAutorizadasDiaNaoLetivoCEI && !input.value && (
        <Tooltip
          title={
            "Existe autorização para o Lançamento de Alimentações para o dia. Justifique a ausência do apontamento!"
          }
        >
          <i className="fas fa-info icone-info-warning" />
        </Tooltip>
      )}
      {exibeTooltipSuspensoesAutorizadasCEI && (
        <Tooltip
          title={
            "Há suspensão de alimentação autorizada para essa data. Obrigatório adicionar observação para lançamento de frequência neste dia."
          }
        >
          <i className="fas fa-info icone-info-warning" />
        </Tooltip>
      )}
      {exibeTooltipDietasInclusaoDiaNaoLetivoCEI && (
        <Tooltip
          title={
            "Existe autorização para o Lançamento de Dietas Especiais para o dia. Justifique a ausência do apontamento!"
          }
        >
          <i className="fas fa-info icone-info-warning" />
        </Tooltip>
      )}

      {exibeTooltipInclusaoAlimentacaoAutorizadaDreCodae && (
        <Tooltip title={"Foi autorizada inclusão de alimentações neste dia."}>
          <i className="fas fa-info icone-info-success" />
        </Tooltip>
      )}
      {exibeTooltipAlteracaoAlimentacaoAutorizadaDreCodae && (
        <Tooltip title={"Há autorização de LPR ou RPL para este dia."}>
          <i className="fas fa-info icone-info-success" />
        </Tooltip>
      )}
      {exibeTooltipSuspensaoAutorizadaFrequenciaDreCodae && (
        <Tooltip
          title={"Há suspensão de alimentações autorizada para este dia."}
        >
          <i className="fas fa-info icone-info-success" />
        </Tooltip>
      )}
      {exibeTooltipSuspensaoAutorizadaAlimentacaoDreCodae && (
        <Tooltip
          title={"Há suspensão deste tipo de alimentação para este dia."}
        >
          <i className="fas fa-info icone-info-success" />
        </Tooltip>
      )}
      {exibirTooltipPeriodosZeradosNoProgramasProjetos && (
        <Tooltip
          title={
            "Não há apontamento de estudantes nos demais períodos. Justifique a frequência nos Programas e Projetos."
          }
        >
          <i
            data-testid="icone-tooltip-warning"
            className="fas fa-info icone-info-warning"
          />
        </Tooltip>
      )}

      <input
        {...input}
        {...inputProps}
        className={`form-control ${className} ${
          validacaoFrequencia() || validacaoLancheRefeicaoSobremesa1Oferta()
            ? "invalid-field"
            : ""
        } ${
          !meta.error &&
          (exibirTooltipAlimentacoesAutorizadasDiaNaoLetivo() ||
            exibeTooltipFrequenciaAlimentacaoZero ||
            exibeTooltipErroQtdMaiorQueAutorizado ||
            exibeTooltipSuspensoesAutorizadas ||
            exibeTooltipRPLAutorizadas ||
            exibeTooltipLPRAutorizadas ||
            exibeTooltipQtdKitLancheDiferenteSolAlimentacoesAutorizadas ||
            exibeTooltipQtdKitLancheMenorSolAlimentacoesAutorizadas ||
            exibeTooltipKitLancheSolAlimentacoes ||
            exibeTooltipQtdLancheEmergencialDiferenteSolAlimentacoesAutorizadas ||
            exibeTooltipLancheEmergencialNaoAutorizado ||
            exibeTooltipLancheEmergencialAutorizado ||
            exibeTooltipFrequenciaZeroTabelaEtec ||
            exibeTooltipLancheEmergTabelaEtec ||
            exibeTooltipInclusoesAutorizadasComZero ||
            exibeTooltipRepeticaoDiasSobremesaDoceDiferenteZero ||
            exibeTooltipDietasInclusaoDiaNaoLetivoCEI ||
            exibeTooltipAlimentacoesAutorizadasDiaNaoLetivoCEI ||
            exibirTooltipPeriodosZeradosNoProgramasProjetos ||
            exibeTooltipSuspensoesAutorizadasCEI)
            ? "border-warning"
            : ""
        }`}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        name={input.name}
        data-cy={input.name}
        data-testid={input.name}
        placeholder={placeholder}
        required={required}
        type={inputType ? inputType : type}
        title={title}
        pattern={pattern}
        maxLength={maxlength}
        onInput={(e) => {
          e.target.value = toUppercaseActive
            ? e.target.value.toUpperCase()
            : e.target.value;
          e.target.value = apenasNumeros
            ? e.target.value.replace(/\D/g, "")
            : e.target.value;
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && classNameToPrevInput && e.shiftKey) {
            let elements = document.getElementsByName(classNameToPrevInput);
            if (elements && elements.length === 1) {
              elements[0].focus();
            }
          }

          if (e.key === "Enter" && classNameToNextInput && !e.shiftKey) {
            let elements = document.getElementsByName(classNameToNextInput);
            if (elements && elements.length === 1) {
              elements[0].focus();
            }
          }
        }}
      />
    </div>
  );
};

InputText.propTypes = {
  className: PropTypes.string,
  classNameToNextInput: PropTypes.string,
  classNameToPrevInput: PropTypes.string,
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
};

export default InputText;
