import React from "react";
import { FluxoDeStatus } from "src/components/Shareable/FluxoDeStatus";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON,
} from "src/components/Shareable/Botao/constants";
import Botao from "src/components/Shareable/Botao";
import { fluxoInformativoPartindoEscola } from "src/components/Shareable/FluxoDeStatus/helper";
import { stringSeparadaPorVirgulas } from "src/helpers/utilities";
import { imprimeRelatorioSuspensaoAlimentacao } from "src/services/relatorios";

export const CorpoRelatorio = (props) => {
  const { suspensaoAlimentacao, dadosEscola } = props;
  return (
    <div>
      <div className="row">
        <div className="col-2">
          <span className="badge-sme badge-secondary-sme">
            <span className="id-of-solicitation-dre">
              # {suspensaoAlimentacao.id_externo}
            </span>
            <br />{" "}
            <span className="number-of-order-label">Nº DA SOLICITAÇÂO</span>
          </span>
        </div>
        <div className="ps-2 my-auto offset-1 col-5">
          <span className="requester">Escola Solicitante</span>
          <br />
          <span className="dre-name">
            {suspensaoAlimentacao.escola && suspensaoAlimentacao.escola.nome}
          </span>
        </div>
        <div className="my-auto col-2">
          <span className="requester">Código EOL</span>
          <br />
          <span className="dre-name">
            {suspensaoAlimentacao.escola &&
              suspensaoAlimentacao.escola.codigo_eol}
          </span>
        </div>
        <p className={`col-2 title-message pe-3`}>
          <Botao
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN}
            icon={BUTTON_ICON.PRINT}
            className="float-end"
            onClick={() =>
              imprimeRelatorioSuspensaoAlimentacao(
                suspensaoAlimentacao.uuid,
                suspensaoAlimentacao?.escola?.nome
              )
            }
          />
        </p>
      </div>
      <div className="row">
        <div className="col-3 report-label-value">
          <p>DRE</p>
          <p className="value-important">
            {dadosEscola && dadosEscola.diretoria_regional.nome}
          </p>
        </div>
        <div className="col-3 report-label-value">
          <p>Lote</p>
          <p className="value-important">
            {dadosEscola && dadosEscola.lote.nome}
          </p>
        </div>
        <div className="col-3 report-label-value">
          <p>Tipo de Gestão</p>
          <p className="value-important">
            {dadosEscola && dadosEscola.tipo_gestao.nome}
          </p>
        </div>
        <div className="col-3 report-label-value">
          <p>Empresa</p>
          <p className="value-important">
            {suspensaoAlimentacao.rastro_terceirizada &&
              suspensaoAlimentacao.rastro_terceirizada.nome_fantasia}
          </p>
        </div>
      </div>
      <hr />
      {suspensaoAlimentacao.logs && (
        <div className="row">
          <FluxoDeStatus
            listaDeStatus={suspensaoAlimentacao.logs}
            fluxo={fluxoInformativoPartindoEscola}
            eh_gestao_alimentacao={true}
          />
        </div>
      )}
      <hr />
      <table className="table-reasons">
        <thead>
          <tr className="row">
            <th
              className={
                suspensaoAlimentacao.suspensoes_alimentacao.some(
                  (s) => s.cancelado
                )
                  ? "col-3"
                  : "col-6"
              }
            >
              Motivo
            </th>
            <th
              className={
                suspensaoAlimentacao.suspensoes_alimentacao.some(
                  (s) => s.cancelado
                )
                  ? "col-3"
                  : "col-6"
              }
            >
              Dia(s) de suspensão
            </th>
            {suspensaoAlimentacao.suspensoes_alimentacao.some(
              (suspensao) => suspensao.cancelado
            ) && <th className="col-6">Justificativa</th>}
          </tr>
        </thead>
        <tbody>
          {suspensaoAlimentacao.suspensoes_alimentacao.map(
            (suspensao, index) => (
              <tr className="row" key={index}>
                <td
                  className={
                    suspensaoAlimentacao.suspensoes_alimentacao.some(
                      (s) => s.cancelado
                    )
                      ? "col-3"
                      : "col-6"
                  }
                >
                  {suspensao.motivo.nome.includes("Outro")
                    ? `${suspensao.motivo.nome} - ${suspensao.outro_motivo}`
                    : suspensao.motivo.nome}
                </td>
                <td
                  className={`${
                    suspensaoAlimentacao.suspensoes_alimentacao.some(
                      (s) => s.cancelado
                    )
                      ? "col-3"
                      : "col-6"
                  } ${suspensao.cancelado ? "dia-cancelado" : ""}`}
                >
                  {suspensao.cancelado ? (
                    <span className="dark-red">{suspensao.data}</span>
                  ) : (
                    <span>{suspensao.data}</span>
                  )}
                </td>
                {suspensaoAlimentacao.suspensoes_alimentacao.some(
                  (s) => s.cancelado
                ) && (
                  <td className="col-6">
                    {suspensao.cancelado ? (
                      <span className="dark-red">
                        {suspensao.cancelado_justificativa}
                      </span>
                    ) : (
                      ""
                    )}
                  </td>
                )}
              </tr>
            )
          )}
        </tbody>
      </table>
      <table className="table-report mt-3">
        <tr>
          <th>Período</th>
          <th>Tipos de Alimentação</th>
          <th>Nº de Alunos</th>
        </tr>
        {suspensaoAlimentacao.quantidades_por_periodo.map(
          (quantidade_por_periodo, key) => {
            return (
              <tr key={key}>
                <td>
                  {quantidade_por_periodo.periodo_escolar &&
                    quantidade_por_periodo.periodo_escolar.nome}
                </td>
                <td>
                  {stringSeparadaPorVirgulas(
                    quantidade_por_periodo.tipos_alimentacao,
                    "nome"
                  )}
                </td>
                <td>{quantidade_por_periodo.numero_alunos}</td>
              </tr>
            );
          }
        )}
      </table>
      <div className="row">
        <div className="col-12 report-label-value">
          <p>Observações</p>
          <p
            className="value"
            dangerouslySetInnerHTML={{
              __html: suspensaoAlimentacao.observacao,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CorpoRelatorio;
