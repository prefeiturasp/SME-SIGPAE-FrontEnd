import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import React from "react";
import { ToggleExpandir } from "src/components/Shareable/ToggleExpandir";
import { Tooltip } from "antd";
import { deepCopy } from "src/helpers/utilities";
import { EditalContratoInterface } from "../../interfaces";
import { VIGENCIA_STATUS } from "../constants";
import { useNavigate } from "react-router-dom";

export const LinhaEditalContrato = ({
  editalContrato,
  setEditaisContratos,
  editaisContratos,
  index,
}) => {
  const navigate = useNavigate();

  const getStatusContrato = (
    editalContrato: EditalContratoInterface
  ): string => {
    let status = "";
    editalContrato.contratos.forEach((contrato) => {
      const vigencia = contrato.vigencias[contrato.vigencias.length - 1];
      if (vigencia?.status === VIGENCIA_STATUS.VENCIDO)
        status = vigencia.status;
      if (status !== "vencido" && vigencia?.status === "proximo_ao_vencimento")
        status = vigencia.status;
    });
    return status;
  };

  const ativaContratoEdital = (index: number): void => {
    const editaisContratos_ = deepCopy(editaisContratos);
    editaisContratos_[index].ativo = !editaisContratos_[index].ativo;
    setEditaisContratos(editaisContratos_);
  };

  const getClasseEstiloContrato = () => {
    return `${
      getStatusContrato(editalContrato) ===
      VIGENCIA_STATUS.PROXIMO_AO_VENCIMENTO
        ? VIGENCIA_STATUS.PROXIMO_AO_VENCIMENTO
        : ""
    }
        ${
          getStatusContrato(editalContrato) === VIGENCIA_STATUS.VENCIDO
            ? VIGENCIA_STATUS.VENCIDO
            : ""
        }`;
  };

  const getClasseEstiloPaddingIcones = (): string => {
    return ![
      VIGENCIA_STATUS.PROXIMO_AO_VENCIMENTO,
      VIGENCIA_STATUS.VENCIDO,
    ].includes(getStatusContrato(editalContrato))
      ? "pe-48px"
      : "";
  };

  return (
    <div className={`row ${getClasseEstiloContrato()}`}>
      <div className="col-3">{editalContrato.tipo_contratacao}</div>
      <div className="col-3">{editalContrato.numero}</div>
      <div className="col-3">{editalContrato.processo}</div>
      <div className={`col-3 d-flex my-auto`}>
        {getStatusContrato(editalContrato) ===
          VIGENCIA_STATUS.PROXIMO_AO_VENCIMENTO && (
          <Tooltip
            title={
              "Data de vigência do contrato próxima ao vencimento, verifique se o contrato permanece ativo e adie a vigência"
            }
          >
            <div className="icon me-4 mt-1">
              <span className="fas fa-exclamation" />
            </div>
          </Tooltip>
        )}
        {getStatusContrato(editalContrato) === VIGENCIA_STATUS.VENCIDO && (
          <Tooltip
            title={
              "Data de vigência do contrato expirada, verifique se o contrato permanece ativo e adie a vigência"
            }
          >
            <div className="icon orange me-4 mt-1">
              <span className="fas fa-exclamation" />
            </div>
          </Tooltip>
        )}
        <span className={getClasseEstiloPaddingIcones()}>
          <ToggleExpandir
            onClick={() => ativaContratoEdital(index)}
            ativo={editalContrato.ativo}
            className="me-3"
          />
        </span>
        <Botao
          type={BUTTON_TYPE.BUTTON}
          style={`${BUTTON_STYLE.GREEN_OUTLINE} no-border`}
          onClick={() =>
            navigate("/configuracoes/cadastros/editais-contratos/editar", {
              state: { uuid: editalContrato.uuid },
            })
          }
          icon={BUTTON_ICON.EDIT}
          tooltipExterno="Editar"
        />
      </div>
    </div>
  );
};
