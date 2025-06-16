import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { FluxoDeStatus } from "src/components/Shareable/FluxoDeStatus";
import {
  corDaMensagem,
  stringSeparadaPorVirgulas,
  ehInclusaoContinua,
  ehInclusaoCei,
  justificativaAoNegarSolicitacao,
  gerarLinkRelatorio,
} from "src/helpers/utilities";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON,
} from "src/components/Shareable/Botao/constants";
import { formataMotivosDias } from "./helper";
import { fluxoPartindoEscola } from "src/components/Shareable/FluxoDeStatus/helper";
import TabelaFaixaEtaria from "src/components/Shareable/TabelaFaixaEtaria";
import { existeLogDeQuestionamentoDaCODAE } from "src/components/Shareable/RelatorioHistoricoQuestionamento/helper";
import { getRelatorioInclusaoAlimentacao } from "src/services/relatorios";
import { WEEK } from "src/configs/constants";
import InclusoesCEI from "./InclusoesCEI";
import { ToggleExpandir } from "../../../Shareable/ToggleExpandir";
import { SolicitacoesSimilaresInclusao } from "src/components/Shareable/SolicitacoesSimilaresInclusao";
import {
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhDRE,
} from "src/helpers/utilities";

const renderParteAvulsa = (
  inclusaoDeAlimentacao,
  inclusoes,
  tipoSolicitacao
) => {
  const diasMotivosFormatados = formataMotivosDias(inclusoes);
  const getDia = (dia) => {
    return inclusaoDeAlimentacao[
      !ehInclusaoCei(tipoSolicitacao)
        ? "inclusoes"
        : "dias_motivos_da_inclusao_cei"
    ].find((i) => i.data === dia);
  };

  return (
    <>
      <table className="table-reasons-inclusao">
        <tbody>
          {Object.entries(diasMotivosFormatados).map((dadosMotivo, key) => {
            const [motivo, datas] = dadosMotivo;
            return (
              <Fragment key={key}>
                <tr className="row">
                  <th className="col-2">Motivo</th>
                  <th className="col-10">Dia(s) de inclusão</th>
                </tr>
                <tr className="row">
                  <td className="col-2">{motivo}</td>
                  {datas.map((dia, key) => {
                    return (
                      <td
                        key={key}
                        className={`col-2 ${
                          getDia(dia).cancelado ||
                          inclusaoDeAlimentacao.status === "ESCOLA_CANCELOU"
                            ? `cancelado`
                            : ""
                        }`}
                      >
                        <span>{dia}</span>
                        {(getDia(dia).cancelado ||
                          inclusaoDeAlimentacao.status ===
                            "ESCOLA_CANCELOU") && (
                          <div className="dark-red">
                            <strong>justificativa:</strong>{" "}
                            {getDia(dia).cancelado_justificativa ||
                              inclusaoDeAlimentacao.logs[
                                inclusaoDeAlimentacao.logs.length - 1
                              ].justificativa}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
                <hr />
              </Fragment>
            );
          })}
          {inclusaoDeAlimentacao[
            !ehInclusaoCei(tipoSolicitacao)
              ? "inclusoes"
              : "dias_motivos_da_inclusao_cei"
          ]
            .filter(
              (inclusao) =>
                inclusao.motivo.nome.includes("Outro") ||
                inclusao.motivo.nome.includes("Evento Específico")
            )
            .map((inclusao, key) => {
              return [
                <tr className="row" key={key}>
                  <th className="col-2">Motivo</th>
                  <th className="col-10">Dia de inclusão</th>
                </tr>,
                <tr className="row" key={key}>
                  <td className="col-2">{inclusao.motivo.nome}</td>
                  <td
                    key={key}
                    className={`col-2 ${
                      inclusao.cancelado ||
                      inclusaoDeAlimentacao.status === "ESCOLA_CANCELOU"
                        ? `cancelado`
                        : ""
                    }`}
                  >
                    <span>{inclusao.data}</span>
                    {(inclusao.cancelado ||
                      inclusaoDeAlimentacao.status === "ESCOLA_CANCELOU") && (
                      <div className="dark-red">
                        <strong>justificativa:</strong>{" "}
                        {inclusao.cancelado_justificativa ||
                          inclusaoDeAlimentacao.logs[
                            inclusaoDeAlimentacao.logs.length - 1
                          ].justificativa}
                      </div>
                    )}
                  </td>
                </tr>,
                <tr className="row" key={key}>
                  <th className="col-12">
                    {inclusao.motivo.nome.includes("Evento Específico")
                      ? "Descrição do Evento"
                      : "Qual o motivo?"}
                  </th>
                </tr>,
                <tr className="row" key={key}>
                  <td className="col-12">
                    {inclusao.motivo.nome.includes("Evento Específico")
                      ? inclusao.evento
                      : inclusao.outro_motivo}
                  </td>
                </tr>,
                <hr key={key} />,
              ];
            })}
        </tbody>
      </table>
    </>
  );
};

const renderParteContinua = (inclusaoDeAlimentacao) => {
  const { motivo, data_final, data_inicial } = inclusaoDeAlimentacao;
  return (
    <div>
      <div className="row">
        <div className="col-4 report-label-value">
          <p>Motivo</p>
          <p className="value">{motivo.nome}</p>
        </div>
        <div className="col-2 report-label-value">
          <p>De</p>
          <p className="value">{data_inicial}</p>
        </div>
        <div className="col-2 report-label-value">
          <p>Até</p>
          <p className="value">{data_final}</p>
        </div>
      </div>
    </div>
  );
};

export const CorpoRelatorio = ({ ...props }) => {
  const { tipoSolicitacao, prazoDoPedidoMensagem, inclusaoDeAlimentacao } =
    props;

  const [solicitacoesSimilares, setSolicitacoesSimilares] = useState(
    props.solicitacoesSimilares
  );

  const [baixandoPDF, setBaixandoPDF] = useState(false);

  const exibirNovoComponeneteCEI =
    !inclusaoDeAlimentacao.periodo_escolar && ehInclusaoCei(tipoSolicitacao);

  const justificativaNegacao = justificativaAoNegarSolicitacao(
    inclusaoDeAlimentacao.logs
  );

  const collapseSolicitacaoSimilar = (idxSolicitacaoSimilar) => {
    const novoSolicitacoesSimilares = solicitacoesSimilares.map(
      (solicitacaoSimilar, index) => {
        if (index === idxSolicitacaoSimilar) {
          solicitacaoSimilar.collapsed = !solicitacaoSimilar.collapsed;
        }
        return solicitacaoSimilar;
      }
    );

    setSolicitacoesSimilares(novoSolicitacoesSimilares);
  };

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
              await getRelatorioInclusaoAlimentacao(
                inclusaoDeAlimentacao.uuid,
                tipoSolicitacao,
                inclusaoDeAlimentacao?.escola?.nome
              );
              setBaixandoPDF(false);
            }}
          />
        </p>
        <div className="col-2">
          <span className="badge-sme badge-secondary-sme">
            <span className="id-of-solicitation-dre">
              # {inclusaoDeAlimentacao.id_externo}
            </span>
            <br />{" "}
            <span className="number-of-order-label">Nº DA SOLICITAÇÃO</span>
          </span>
        </div>
        <div className="ps-2 my-auto offset-1 col-5">
          <span className="requester">Escola Solicitante</span>
          <br />
          <span className="dre-name">
            {inclusaoDeAlimentacao.escola && inclusaoDeAlimentacao.escola.nome}
          </span>
        </div>
        <div className="my-auto col-4">
          <span className="requester">Código EOL</span>
          <br />
          <span className="dre-name">
            {inclusaoDeAlimentacao.escola &&
              inclusaoDeAlimentacao.escola.codigo_eol}
          </span>
        </div>
      </div>
      <div className="row">
        <div className="col-3 report-label-value">
          <p>DRE</p>
          <p className="value-important">
            {inclusaoDeAlimentacao.escola.diretoria_regional.nome}
          </p>
        </div>
        <div className="col-3 report-label-value">
          <p>Lote</p>
          <p className="value-important">
            {inclusaoDeAlimentacao.escola &&
              inclusaoDeAlimentacao.escola.lote &&
              inclusaoDeAlimentacao.escola.lote.nome}
          </p>
        </div>
        <div className="col-3 report-label-value">
          <p>Tipo de Gestão</p>
          <p className="value-important">
            {inclusaoDeAlimentacao.escola &&
              inclusaoDeAlimentacao.escola.tipo_gestao &&
              inclusaoDeAlimentacao.escola.tipo_gestao.nome}
          </p>
        </div>
        <div className="col-3 report-label-value">
          <p>Empresa</p>
          <p className="value-important">
            {inclusaoDeAlimentacao.escola &&
              inclusaoDeAlimentacao.escola.lote &&
              inclusaoDeAlimentacao.escola.lote.terceirizada &&
              inclusaoDeAlimentacao.escola.lote.terceirizada.nome_fantasia}
          </p>
        </div>
      </div>
      <hr />
      {inclusaoDeAlimentacao.logs && (
        <div className="row">
          <FluxoDeStatus
            listaDeStatus={inclusaoDeAlimentacao.logs}
            fluxo={fluxoPartindoEscola}
            eh_gestao_alimentacao={true}
          />
        </div>
      )}
      <hr />
      {(usuarioEhCODAEGestaoAlimentacao() || usuarioEhDRE()) &&
        solicitacoesSimilares &&
        solicitacoesSimilares.length > 0 && (
          <>
            {solicitacoesSimilares.map((solicitacao, idxSolicitacaoSimilar) => {
              return (
                <>
                  <div className="row" key={idxSolicitacaoSimilar}>
                    <div className="col-2">
                      <p>
                        Solicitação Similar:
                        <b className="gatilho-style">
                          <Link
                            style={{
                              color: "#0c6b45",
                            }}
                            to={gerarLinkRelatorio(
                              `inclusao-de-alimentacao${
                                solicitacao.dias_motivos_da_inclusao_cemei
                                  ? "-cemei"
                                  : ""
                              }`,
                              solicitacao
                            )}
                            target="blank"
                          >
                            {`#${solicitacao.id_externo}`}
                          </Link>
                          <ToggleExpandir
                            onClick={() =>
                              collapseSolicitacaoSimilar(idxSolicitacaoSimilar)
                            }
                            ativo={solicitacao.collapsed}
                            className="icon-padding"
                          />
                        </b>
                      </p>
                    </div>
                  </div>
                  <SolicitacoesSimilaresInclusao
                    key={idxSolicitacaoSimilar}
                    solicitacao={solicitacao}
                    index={idxSolicitacaoSimilar}
                  />
                </>
              );
            })}
            <hr />
          </>
        )}
      {ehInclusaoContinua(tipoSolicitacao)
        ? renderParteContinua(inclusaoDeAlimentacao)
        : renderParteAvulsa(
            inclusaoDeAlimentacao,
            inclusaoDeAlimentacao.inclusoes ||
              inclusaoDeAlimentacao.dias_motivos_da_inclusao_cei || [
                {
                  data: inclusaoDeAlimentacao.data,
                  motivo: inclusaoDeAlimentacao.motivo,
                  outro_motivo: inclusaoDeAlimentacao.outro_motivo,
                },
              ],
            tipoSolicitacao
          )}
      {exibirNovoComponeneteCEI ? (
        <InclusoesCEI inclusaoDeAlimentacao={inclusaoDeAlimentacao} />
      ) : (
        <>
          <table className="table-report inclusoes mt-3">
            <tbody>
              <tr>
                {ehInclusaoContinua(tipoSolicitacao) &&
                  inclusaoDeAlimentacao.motivo.nome !== "ETEC" && (
                    <th>Repetir</th>
                  )}
                <th>Período</th>
                <th>Tipos de Alimentação</th>
                <th>Nº de Alunos</th>
              </tr>
              {!ehInclusaoCei(tipoSolicitacao) ? (
                inclusaoDeAlimentacao.quantidades_periodo.map(
                  (quantidade_por_periodo, key) => {
                    return [
                      <tr
                        className={
                          quantidade_por_periodo.cancelado ||
                          inclusaoDeAlimentacao.status === "ESCOLA_CANCELOU"
                            ? "cancelado"
                            : ""
                        }
                        key={key}
                      >
                        {ehInclusaoContinua(tipoSolicitacao) &&
                          inclusaoDeAlimentacao.motivo.nome !== "ETEC" && (
                            <td className="weekly">
                              {WEEK.map((day, key) => {
                                return (
                                  <span
                                    key={key}
                                    className={
                                      quantidade_por_periodo.dias_semana
                                        .map(String)
                                        .includes(day.value)
                                        ? "week-circle-clicked green"
                                        : "week-circle"
                                    }
                                    data-cy={`dia-${key}`}
                                    value={day.value}
                                  >
                                    {day.label}
                                  </span>
                                );
                              })}
                            </td>
                          )}
                        <td>
                          <p>
                            {quantidade_por_periodo.periodo_escolar &&
                              quantidade_por_periodo.periodo_escolar.nome}
                          </p>
                        </td>
                        <td>
                          <p>
                            {stringSeparadaPorVirgulas(
                              quantidade_por_periodo.tipos_alimentacao,
                              "nome"
                            )}
                          </p>
                        </td>
                        <td>
                          <p>{quantidade_por_periodo.numero_alunos}</p>
                        </td>
                      </tr>,
                      ehInclusaoContinua(tipoSolicitacao) && (
                        <tr
                          key={key}
                          className={
                            quantidade_por_periodo.cancelado ||
                            inclusaoDeAlimentacao.status === "ESCOLA_CANCELOU"
                              ? "cancelado"
                              : ""
                          }
                        >
                          <td colSpan="4">
                            <p>
                              <strong>Observações: </strong>
                              {!["<p></p>", "", null].includes(
                                quantidade_por_periodo.observacao
                              ) ? (
                                <p
                                  className="value"
                                  dangerouslySetInnerHTML={{
                                    __html: quantidade_por_periodo.observacao,
                                  }}
                                />
                              ) : (
                                "sem observações por parte da escola"
                              )}
                            </p>

                            {(quantidade_por_periodo.cancelado_justificativa ||
                              inclusaoDeAlimentacao.status ===
                                "ESCOLA_CANCELOU") && (
                              <p className="justificativa-cancelamento dark-red">
                                <span className="fw-bold">justificativa: </span>
                                {quantidade_por_periodo.cancelado_justificativa ||
                                  inclusaoDeAlimentacao.logs.find(
                                    (log) =>
                                      log.status_evento_explicacao ===
                                      "Escola cancelou"
                                  ).justificativa}
                              </p>
                            )}
                          </td>
                        </tr>
                      ),
                    ];
                  }
                )
              ) : (
                <tr>
                  <td>
                    {inclusaoDeAlimentacao.periodo_escolar &&
                      inclusaoDeAlimentacao.periodo_escolar.nome}
                  </td>
                  <td>
                    {stringSeparadaPorVirgulas(
                      inclusaoDeAlimentacao.tipos_alimentacao,
                      "nome"
                    )}
                  </td>
                  <td>
                    {inclusaoDeAlimentacao.quantidade_alunos_por_faixas_etarias.reduce(
                      function (acc, v) {
                        return acc + (v.quantidade || v.quantidade_alunos);
                      },
                      0
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {ehInclusaoCei(tipoSolicitacao) && (
            <TabelaFaixaEtaria
              faixas={
                inclusaoDeAlimentacao.quantidade_alunos_por_faixas_etarias
              }
            />
          )}
        </>
      )}

      {inclusaoDeAlimentacao.status === "CODAE_AUTORIZADO" &&
        !existeLogDeQuestionamentoDaCODAE(inclusaoDeAlimentacao.logs) && (
          <>
            <div className="mt-3">
              <p className="mb-0">
                <b>Autorizou</b>
              </p>
              {
                inclusaoDeAlimentacao.logs.find(
                  (log) => log.status_evento_explicacao === "CODAE autorizou"
                ).criado_em
              }{" "}
              - Informações da CODAE
            </div>
            <p>
              <div
                className="obs"
                dangerouslySetInnerHTML={{
                  __html: `${
                    inclusaoDeAlimentacao.logs.find(
                      (log) =>
                        log.status_evento_explicacao === "CODAE autorizou"
                    ).justificativa || `Sem observações por parte da CODAE`
                  }`,
                }}
              />
            </p>
          </>
        )}

      {justificativaNegacao && (
        <div className="row">
          <div className="col-12 report-label-value">
            <p>Justificativa da negação</p>
            <p
              className="value"
              dangerouslySetInnerHTML={{
                __html: justificativaNegacao,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
