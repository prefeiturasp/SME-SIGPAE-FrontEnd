import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { tiposAlimentacaoPorPeriodoETipoUnidade } from "src/components/InclusaoDeAlimentacaoCEMEI/helpers";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { FluxoDeStatus } from "src/components/Shareable/FluxoDeStatus";
import { fluxoPartindoEscola } from "src/components/Shareable/FluxoDeStatus/helper";
import RelatorioHistoricoQuestionamento from "src/components/Shareable/RelatorioHistoricoQuestionamento";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import RelatorioHistoricoJustificativaEscola from "src/components/Shareable/RelatorioHistoricoJustificativaEscola";
import { existeLogDeQuestionamentoDaCODAE } from "src/components/Shareable/RelatorioHistoricoQuestionamento/helper";
import { TIPO_SOLICITACAO } from "src/constants/shared";
import { getRelatorioInclusaoAlimentacaoCEMEI } from "src/services/relatorios";
import {
  corDaMensagem,
  justificativaAoNegarSolicitacao,
  prazoDoPedidoMensagem,
  gerarLinkRelatorio,
} from "src/helpers/utilities";
import {
  inclusaoPossuiCEInestePeriodo,
  inclusaoPossuiEMEInestePeriodo,
  periodosDaInclusao,
} from "../../helpers";
import "./style.scss";
import { formataMotivosDiasComOutros } from "src/components/InclusaoDeAlimentacao/Relatorio/componentes/helper";
import { ToggleExpandir } from "src/components/Shareable/ToggleExpandir";
import { SolicitacoesSimilaresInclusao } from "src/components/Shareable/SolicitacoesSimilaresInclusao";
import {
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhDRE,
} from "src/helpers/utilities";

export const CorpoRelatorio = ({
  solicitacao,
  vinculos,
  ehMotivoEspecifico,
  solicitacoesSimilares,
}) => {
  const [imprimindo, setImprimindo] = useState(false);

  const [solicitacoesSimilaresState, setSolicitacoesSimilares] = useState(
    solicitacoesSimilares
  );

  const justificativaNegacao =
    solicitacao && justificativaAoNegarSolicitacao(solicitacao.logs);

  const imprimirRelatorio = async () => {
    setImprimindo(true);
    try {
      await getRelatorioInclusaoAlimentacaoCEMEI(
        solicitacao.uuid,
        TIPO_SOLICITACAO.SOLICITACAO_CEMEI,
        solicitacao?.escola?.nome
      );
    } catch {
      toastError("Houve um erro ao imprimir o relatório");
    }
    setImprimindo(false);
  };

  const collapseSolicitacaoSimilar = (idxSolicitacaoSimilar) => {
    const novoSolicitacoesSimilares = solicitacoesSimilaresState.map(
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
    <div className="relatorio-inclusao-cemei">
      <div className="row">
        <p
          className={`col-12 title-message ${corDaMensagem(
            prazoDoPedidoMensagem(solicitacao.prioridade)
          )}`}
        >
          {prazoDoPedidoMensagem(solicitacao.prioridade)}
          <Botao
            type={BUTTON_TYPE.BUTTON}
            dataTestId="botao-imprimir"
            style={imprimindo ? BUTTON_STYLE.GREEN_OUTLINE : BUTTON_STYLE.GREEN}
            icon={imprimindo ? BUTTON_ICON.LOADING : BUTTON_ICON.PRINT}
            disabled={imprimindo}
            className="float-end"
            onClick={imprimirRelatorio}
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
          <span className="dre-name">
            {solicitacao.escola && solicitacao.escola.nome}
          </span>
        </div>
        <div className="my-auto col-4">
          <span className="requester">Código EOL</span>
          <br />
          <span className="dre-name">
            {solicitacao.escola && solicitacao.escola.codigo_eol}
          </span>
        </div>
      </div>
      <div className="row">
        <div className="col-3 report-label-value">
          <p>DRE</p>
          <p className="value-important">
            {solicitacao.escola.diretoria_regional.nome}
          </p>
        </div>
        <div className="col-3 report-label-value">
          <p>Lote</p>
          <p className="value-important">
            {solicitacao.escola &&
              solicitacao.escola.lote &&
              solicitacao.escola.lote.nome}
          </p>
        </div>
        <div className="col-3 report-label-value">
          <p>Tipo de Gestão</p>
          <p className="value-important">
            {solicitacao.escola &&
              solicitacao.escola.tipo_gestao &&
              solicitacao.escola.tipo_gestao.nome}
          </p>
        </div>
        <div className="col-3 report-label-value">
          <p>Empresa</p>
          <p className="value-important">
            {solicitacao.rastro_terceirizada &&
              solicitacao.rastro_terceirizada.nome_fantasia}
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
      {(usuarioEhCODAEGestaoAlimentacao() || usuarioEhDRE()) &&
        solicitacoesSimilaresState &&
        solicitacoesSimilaresState.length > 0 && (
          <>
            {solicitacoesSimilaresState.map(
              (inclusaoDeAlimentacao, idxSolicitacaoSimilar) => {
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
                                  inclusaoDeAlimentacao.dias_motivos_da_inclusao_cemei
                                    ? "-cemei"
                                    : ""
                                }`,
                                inclusaoDeAlimentacao
                              )}
                              target="blank"
                            >
                              {`#${inclusaoDeAlimentacao.id_externo}`}
                            </Link>
                            <ToggleExpandir
                              dataTestId={`toggle-expandir-${idxSolicitacaoSimilar}`}
                              onClick={() =>
                                collapseSolicitacaoSimilar(
                                  idxSolicitacaoSimilar
                                )
                              }
                              ativo={inclusaoDeAlimentacao.collapsed}
                              className="icon-padding"
                            />
                          </b>
                        </p>
                      </div>
                    </div>
                    <SolicitacoesSimilaresInclusao
                      key={idxSolicitacaoSimilar}
                      solicitacao={inclusaoDeAlimentacao}
                      index={idxSolicitacaoSimilar}
                    />
                  </>
                );
              }
            )}
            <hr />
          </>
        )}
      <p>
        <strong>Solicitação de Inclusão de Alimentação</strong>
      </p>
      <table className="table-reasons">
        <tbody>
          {Object.entries(
            formataMotivosDiasComOutros(
              solicitacao.dias_motivos_da_inclusao_cemei
            )
          ).map((dadosMotivo, key) => {
            const [motivo, datas] = dadosMotivo;
            return (
              <div key={key}>
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
                          solicitacao.dias_motivos_da_inclusao_cemei.find(
                            (i) => i.data === dia
                          ).cancelado ||
                          solicitacao.status === "ESCOLA_CANCELOU"
                            ? `cancelado`
                            : ""
                        }`}
                      >
                        <span>{dia}</span>
                        {(solicitacao.dias_motivos_da_inclusao_cemei.find(
                          (i) => i.data === dia
                        ).cancelado_justificativa ||
                          solicitacao.status === "ESCOLA_CANCELOU") && (
                          <div className="dark-red">
                            <strong>justificativa:</strong>{" "}
                            {solicitacao.dias_motivos_da_inclusao_cemei.find(
                              (i) => i.data === dia
                            ).cancelado_justificativa ||
                              solicitacao.logs[solicitacao.logs.length - 1]
                                .justificativa}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
                {motivo === "Evento Específico" && (
                  <Fragment>
                    <tr className="row">
                      <th className="col-12">Descrição do evento:</th>
                    </tr>
                    <tr className="row">
                      <td className="col-12 text-justify">
                        {
                          solicitacao.dias_motivos_da_inclusao_cemei[key]
                            .descricao_evento
                        }
                      </td>
                    </tr>
                  </Fragment>
                )}
                {motivo === "Outro" && (
                  <Fragment>
                    <tr className="row">
                      <th className="col-12">Descrição do motivo:</th>
                    </tr>
                    <tr className="row">
                      <td className="col-12 text-justify">
                        {
                          solicitacao.dias_motivos_da_inclusao_cemei[key]
                            .outro_motivo
                        }
                      </td>
                    </tr>
                  </Fragment>
                )}
              </div>
            );
          })}
        </tbody>
      </table>
      {periodosDaInclusao(solicitacao).map((periodo, key) => {
        let totalMatriculados = 0;
        let totalQuantidadeAlunos = 0;

        return (
          <div key={key}>
            <div className={`period-quantity number-${key}`}>{periodo}</div>
            <div className="ps-3 pe-3 pb-3">
              {inclusaoPossuiCEInestePeriodo(solicitacao, periodo) && (
                <>
                  <div className="alunos-label mt-3">Alunos CEI</div>
                  <div className="tipos-alimentacao mt-3 mb-3">
                    Tipos de inclusão de alimentação:{" "}
                    <span>
                      {tiposAlimentacaoPorPeriodoETipoUnidade(
                        vinculos,
                        periodo,
                        "CEI"
                      )}
                    </span>
                  </div>
                  <table className="faixas-etarias-cei">
                    <thead>
                      <tr className="row">
                        <th className="col-8">Faixa Etária</th>
                        <th className="col-2 text-center">
                          Alunos matriculados
                        </th>
                        <th className="col-2 text-center">Quantidade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {solicitacao.quantidade_alunos_cei_da_inclusao_cemei
                        .filter((q) => q.periodo_escolar.nome === periodo)
                        .map((faixa, key) => {
                          return (
                            <tr key={key} className="row">
                              <td className="col-8">
                                {faixa.faixa_etaria.__str__}
                              </td>
                              <td className="col-2 text-center">
                                {faixa.matriculados_quando_criado}
                              </td>
                              <td className="col-2 text-center">
                                {" "}
                                {faixa.quantidade_alunos}
                              </td>
                            </tr>
                          );
                        })}
                      <tr className="row">
                        <td className="col-8 fw-bold">Total</td>
                        <td className="col-2 text-center">
                          {solicitacao.quantidade_alunos_cei_da_inclusao_cemei
                            .filter((q) => q.periodo_escolar.nome === periodo)
                            .reduce(function (total, faixa) {
                              return total + faixa.matriculados_quando_criado;
                            }, totalMatriculados)}
                        </td>
                        <td className="col-2 text-center">
                          {solicitacao.quantidade_alunos_cei_da_inclusao_cemei
                            .filter((q) => q.periodo_escolar.nome === periodo)
                            .reduce(function (total, faixa) {
                              return total + faixa.quantidade_alunos;
                            }, totalQuantidadeAlunos)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </>
              )}
              {inclusaoPossuiEMEInestePeriodo(solicitacao, periodo) && (
                <>
                  <div className="alunos-label mt-3">Alunos EMEI</div>
                  <div className="tipos-alimentacao mt-3 mb-3">
                    Tipos de inclusão de alimentação:{" "}
                    <span>
                      {solicitacao.quantidade_alunos_emei_da_inclusao_cemei.find(
                        (q) => q.periodo_escolar.nome === periodo
                      ).tipos_alimentacao?.length
                        ? solicitacao.quantidade_alunos_emei_da_inclusao_cemei
                            .find((q) => q.periodo_escolar.nome === periodo)
                            .tipos_alimentacao.map(
                              (alimentacao) => alimentacao.nome
                            )
                            .join(", ")
                        : !ehMotivoEspecifico
                        ? tiposAlimentacaoPorPeriodoETipoUnidade(
                            vinculos,
                            periodo,
                            "EMEI"
                          )
                        : vinculos
                            .find((v) => v.nome === periodo)
                            .tipos_alimentacao.map((t) => t.nome)
                            .join(", ")}
                    </span>
                  </div>
                  <table
                    className={`${
                      ehMotivoEspecifico ? "w-50" : ""
                    } faixas-etarias-cei`}
                  >
                    <thead>
                      <tr className="row">
                        {!ehMotivoEspecifico && (
                          <th className="col-8 my-auto">
                            Alunos matriculados:{" "}
                            <span className="fw-normal">
                              {
                                solicitacao.quantidade_alunos_emei_da_inclusao_cemei.find(
                                  (q) => q.periodo_escolar.nome === periodo
                                ).matriculados_quando_criado
                              }
                            </span>
                          </th>
                        )}
                        <th
                          className={`${
                            ehMotivoEspecifico ? "col-6" : "col-4"
                          } d-flex justify-content-center`}
                        >
                          Quantidade:{" "}
                          {
                            solicitacao.quantidade_alunos_emei_da_inclusao_cemei.find(
                              (q) => q.periodo_escolar.nome === periodo
                            ).quantidade_alunos
                          }
                        </th>
                      </tr>
                    </thead>
                  </table>
                </>
              )}
              {solicitacao.dias_motivos_da_inclusao_cemei.find(
                (inclusao) => inclusao.cancelado_justificativa
              ) && (
                <>
                  <hr />
                  <p>
                    <strong>Histórico de cancelamento</strong>
                    {solicitacao.dias_motivos_da_inclusao_cemei
                      .filter((inclusao) => inclusao.cancelado_justificativa)
                      .map((inclusao, key) => {
                        return (
                          <div key={key}>
                            {inclusao.data}
                            {" - justificativa: "}
                            {inclusao.cancelado_justificativa}
                          </div>
                        );
                      })}
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
              <RelatorioHistoricoQuestionamento solicitacao={solicitacao} />
              {solicitacao.status !== "ESCOLA_CANCELOU" && (
                <RelatorioHistoricoJustificativaEscola
                  solicitacao={solicitacao}
                />
              )}
            </div>
          </div>
        );
      })}
      {solicitacao.status === "CODAE_AUTORIZADO" &&
        !existeLogDeQuestionamentoDaCODAE(solicitacao.logs) && (
          <>
            <hr />
            <div className="mt-3">
              <p className="mb-0">
                <b>Autorizou</b>
              </p>
              {
                solicitacao.logs.find(
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
                    solicitacao.logs.find(
                      (log) =>
                        log.status_evento_explicacao === "CODAE autorizou"
                    ).justificativa || `Sem observações por parte da CODAE`
                  }`,
                }}
              />
            </p>
          </>
        )}
    </div>
  );
};
