import React, { Fragment, useState } from "react";
import { FluxoDeStatus } from "src/components/Shareable/FluxoDeStatus";
import {
  corDaMensagem,
  ehInclusaoCei,
  justificativaAoNegarSolicitacao,
  justificativaAoAprovarSolicitacao,
} from "src/helpers/utilities";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
  BUTTON_ICON,
} from "src/components/Shareable/Botao/constants";
import { getRelatorioAlteracaoCardapio } from "src/services/relatorios";
import { fluxoPartindoEscola } from "src/components/Shareable/FluxoDeStatus/helper";
import TabelaFaixaEtaria from "src/components/Shareable/TabelaFaixaEtaria";
import { existeLogDeQuestionamentoDaCODAE } from "src/components/Shareable/RelatorioHistoricoQuestionamento/helper";
import "./style.scss";
import PropTypes from "prop-types";

export const CorpoRelatorio = (props) => {
  const { solicitacao, prazoDoPedidoMensagem, tipoSolicitacao } = props;
  const [baixandoPDF, setBaixandoPDF] = useState(false);

  const justificativaNegacao = justificativaAoNegarSolicitacao(
    solicitacao.logs
  );

  const justificativaAprovacao = justificativaAoAprovarSolicitacao(
    solicitacao.logs
  );

  const EXIBIR_HISTORICO =
    solicitacao.prioridade !== "REGULAR" &&
    existeLogDeQuestionamentoDaCODAE(solicitacao.logs);

  return (
    <div>
      <div className="row">
        <p
          className={`col-12 title-message ${corDaMensagem(
            prazoDoPedidoMensagem
          )}`}
        >
          {prazoDoPedidoMensagem}
          <Botao
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN}
            icon={!baixandoPDF && BUTTON_ICON.PRINT}
            texto={
              baixandoPDF && (
                <img src="/assets/image/ajax-loader.gif" alt="ajax-loader" />
              )
            }
            disabled={baixandoPDF}
            className="float-end"
            onClick={async () => {
              setBaixandoPDF(true);
              await getRelatorioAlteracaoCardapio(
                solicitacao.uuid,
                tipoSolicitacao,
                solicitacao?.escola?.nome
              );
              setBaixandoPDF(false);
            }}
          />
        </p>
        <div className="col-2">
          <span className="badge-sme badge-secondary-sme">
            <span className="id-of-solicitation-dre">
              # {solicitacao.id_externo}
            </span>
            <br />{" "}
            <span className="number-of-order-label">Nº DA SOLICITAÇÃO</span>
          </span>
        </div>
        <div className="ps-2 my-auto offset-1 col-5">
          <span className="requester">Escola Solicitante</span>
          <br />
          <span className="dre-name">{solicitacao.escola?.nome}</span>
        </div>
        <div className="my-auto col-4">
          <span className="requester">Código EOL</span>
          <br />
          <span className="dre-name">{solicitacao.escola?.codigo_eol}</span>
        </div>
      </div>
      <div className="row">
        <div className="col-3 report-label-value">
          <p>DRE</p>
          <p className="value-important">
            {solicitacao.escola?.diretoria_regional?.nome}
          </p>
        </div>
        <div className="col-3 report-label-value">
          <p>Lote</p>
          <p className="value-important">{solicitacao.escola?.lote?.nome}</p>
        </div>
        <div className="col-3 report-label-value">
          <p>Tipo de Gestão</p>
          <p className="value-important">
            {solicitacao.escola?.tipo_gestao?.nome}
          </p>
        </div>
        <div className="col-3 report-label-value">
          <p>Empresa</p>
          <p className="value-important">
            {solicitacao.rastro_terceirizada?.nome_fantasia}
          </p>
        </div>
      </div>
      <hr />
      {solicitacao.logs && (
        <div className="row">
          <FluxoDeStatus
            listaDeStatus={solicitacao.logs}
            fluxo={fluxoPartindoEscola}
            eh_gestao_alimentacao={true}
          />
        </div>
      )}
      <hr />
      <table className="table-periods-alteracao">
        <thead>
          <tr className="row">
            <th className="col-2">Tipo de Alteração</th>
            {solicitacao.data_inicial === solicitacao.data_final ? (
              <th className="col-2">Alterar dia</th>
            ) : (
              <th className="col-2">Dia(s) de Alteração</th>
            )}
          </tr>
        </thead>
        <tbody>
          <tr className="row">
            <td className="col-2">{solicitacao.motivo.nome}</td>
            {solicitacao.data_inicial === solicitacao.data_final ? (
              <td className="col-2">
                {solicitacao.data_inicial || solicitacao.data}
              </td>
            ) : (
              solicitacao.datas_intervalo.map((data_intervalo, key) => {
                return (
                  <td
                    className={`col-2 ${
                      key > 0 && key % 5 === 0 ? "offset-2" : ""
                    }`}
                    key={key}
                  >
                    <span
                      className={
                        data_intervalo.cancelado_justificativa
                          ? `data-cancelada`
                          : ""
                      }
                    >
                      {data_intervalo.data}
                    </span>
                    <br />
                    {data_intervalo.cancelado_justificativa && (
                      <span className="justificativa">
                        justificativa:{" "}
                        <span className="fw-normal">
                          {data_intervalo.cancelado_justificativa}
                        </span>
                      </span>
                    )}
                  </td>
                );
              })
            )}
          </tr>
        </tbody>
      </table>
      <table className="table-report mt-4">
        <tr>
          <th>Período</th>
          <th>Alteração alimentação de:</th>
          <th>Alteração alimentação para:</th>
          {!ehInclusaoCei(tipoSolicitacao) && <th>Número de alunos</th>}
        </tr>
        {solicitacao.substituicoes.map(
          (
            {
              periodo_escolar,
              tipos_alimentacao_de,
              tipos_alimentacao_para,
              tipo_alimentacao_para,
              qtd_alunos,
              faixas_etarias,
            },
            key
          ) => {
            let alimentos = tipos_alimentacao_de.map(
              (alimento) => alimento.nome
            );
            let tipos_alimentos_formatados = "";
            for (let i = 0; i < alimentos.length; i++) {
              tipos_alimentos_formatados =
                tipos_alimentos_formatados + alimentos[i];
              if (i + 1 !== alimentos.length) {
                tipos_alimentos_formatados = tipos_alimentos_formatados + ", ";
              }
            }
            let substitutos_formatados = "";
            if (ehInclusaoCei(tipoSolicitacao)) {
              substitutos_formatados = tipo_alimentacao_para.nome;
            } else {
              let substitutos = tipos_alimentacao_para.map(
                (substituto) => substituto.nome
              );

              for (let i = 0; i < substitutos.length; i++) {
                substitutos_formatados =
                  substitutos_formatados + substitutos[i];
                if (i + 1 !== substitutos.length) {
                  substitutos_formatados = substitutos_formatados + ", ";
                }
              }
            }

            return (
              <Fragment key={key}>
                <tr>
                  <td>{periodo_escolar && periodo_escolar.nome}</td>
                  <td>{tipos_alimentos_formatados}</td>
                  <td>{substitutos_formatados}</td>
                  {!ehInclusaoCei(tipoSolicitacao) && <td>{qtd_alunos}</td>}
                </tr>
                {ehInclusaoCei(tipoSolicitacao) && (
                  <tr>
                    <td className="faixas-etarias" colSpan="3">
                      <TabelaFaixaEtaria faixas={faixas_etarias} />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          }
        )}
      </table>
      <table className="table-periods">
        <tr>
          <th>Observações</th>
        </tr>
        <tr>
          <td>
            <p
              className="value"
              dangerouslySetInnerHTML={{
                __html: solicitacao.observacao,
              }}
            />
          </td>
        </tr>
      </table>
      {!ehInclusaoCei(tipoSolicitacao) &&
        solicitacao.datas_intervalo.find(
          (data_intervalo) => data_intervalo.cancelado_justificativa
        ) && (
          <>
            <hr />
            <p>
              <strong>Histórico de cancelamento</strong>
              {solicitacao.datas_intervalo
                .filter(
                  (data_intervalo) => data_intervalo.cancelado_justificativa
                )
                .map((data_intervalo, key) => {
                  return (
                    <div key={key}>
                      {data_intervalo.data}
                      {" - justificativa: "}
                      {data_intervalo.cancelado_justificativa}
                    </div>
                  );
                })}
            </p>
          </>
        )}
      {justificativaNegacao && (
        <table className="table-periods">
          <tr>
            <th>Justificativa da negação</th>
          </tr>
          <tr>
            <td>
              <p
                className="value"
                dangerouslySetInnerHTML={{
                  __html: justificativaNegacao,
                }}
              />
            </td>
          </tr>
        </table>
      )}
      {justificativaAprovacao && !EXIBIR_HISTORICO && (
        <table className="table-periods">
          <tr>
            <th>
              <b>Autorizou</b>
            </th>
          </tr>
          <tr>
            <th>{`${
              solicitacao.logs.find(
                (log) => log.status_evento_explicacao === "CODAE autorizou"
              ).criado_em
            } - Informações da CODAE`}</th>
          </tr>
          <tr>
            <td>
              <p
                className="value"
                dangerouslySetInnerHTML={{
                  __html: justificativaAprovacao,
                }}
              />
            </td>
          </tr>
        </table>
      )}
    </div>
  );
};

CorpoRelatorio.propTypes = {
  solicitacao: PropTypes.object.isRequired,
  prazoDoPedidoMensagem: PropTypes.string.isRequired,
  tipoSolicitacao: PropTypes.string.isRequired,
};

export default CorpoRelatorio;
