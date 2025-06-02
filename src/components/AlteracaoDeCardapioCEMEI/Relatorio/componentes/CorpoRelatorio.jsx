import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { FluxoDeStatus } from "src/components/Shareable/FluxoDeStatus";
import { fluxoPartindoEscola } from "src/components/Shareable/FluxoDeStatus/helper";
import RelatorioHistoricoJustificativaEscola from "src/components/Shareable/RelatorioHistoricoJustificativaEscola";
import RelatorioHistoricoQuestionamento from "src/components/Shareable/RelatorioHistoricoQuestionamento";
import { existeLogDeQuestionamentoDaCODAE } from "src/components/Shareable/RelatorioHistoricoQuestionamento/helper";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { TIPO_SOLICITACAO } from "src/constants/shared";
import {
  corDaMensagem,
  justificativaAoAprovarSolicitacao,
  justificativaAoNegarSolicitacao,
  prazoDoPedidoMensagem,
} from "src/helpers/utilities";
import { useState } from "react";
import { getRelatorioAlteracaoTipoAlimentacao } from "src/services/relatorios";

export const CorpoRelatorio = ({ ...props }) => {
  let totalMatriculados = 0;
  let totalQuantidadeAlunos = 0;
  const [imprimindo, setImprimindo] = useState(false);
  const { dadosTabela, solicitacao } = props;
  const EXIBIR_HISTORICO =
    solicitacao.prioridade !== "REGULAR" &&
    existeLogDeQuestionamentoDaCODAE(solicitacao.logs);

  const imprimirRelatorio = async () => {
    setImprimindo(true);
    try {
      await getRelatorioAlteracaoTipoAlimentacao(
        solicitacao.uuid,
        TIPO_SOLICITACAO.SOLICITACAO_CEMEI,
        solicitacao?.escola?.nome
      );
    } catch (e) {
      toastError("Houve um erro ao imprimir o relatório");
    }
    setImprimindo(false);
  };

  return (
    <>
      <p
        className={`col-12 title-message fw-bold ${corDaMensagem(
          prazoDoPedidoMensagem(solicitacao.prioridade)
        )}`}
      >
        {prazoDoPedidoMensagem(solicitacao.prioridade)}
        <Botao
          dataTestId="botao-imprimir"
          type={BUTTON_TYPE.BUTTON}
          style={imprimindo ? BUTTON_STYLE.GREEN_OUTLINE : BUTTON_STYLE.GREEN}
          icon={imprimindo ? BUTTON_ICON.LOADING : BUTTON_ICON.PRINT}
          disabled={imprimindo}
          className="float-end"
          onClick={imprimirRelatorio}
        />
      </p>
      <div className="row mt-3">
        <div className="col-3">
          <div className="id-externo-style">
            <p className="id-externo-font">
              <b># {solicitacao.id_externo}</b>
            </p>
            <p>
              <b>Nº da Solicitação</b>
            </p>
          </div>
        </div>
        <div className="col-3">
          <p>Escola Solicitante:</p>
          <p>
            <b>{solicitacao.escola.nome}</b>
          </p>
        </div>
        <div className="offset-3 col-3">
          <p>Código EOL:</p>
          <p>
            <b>{solicitacao.escola.codigo_eol}</b>
          </p>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-3">
          <p>DRE:</p>
          <p>
            <b>{solicitacao.escola.diretoria_regional.nome}</b>
          </p>
        </div>
        <div className="col-3">
          <p>Lote:</p>
          <p>
            <b>{solicitacao.escola.lote.nome}</b>
          </p>
        </div>
        <div className="col-3">
          <p>Tipo de Gestão:</p>
          <p>
            <b>{solicitacao.escola.tipo_gestao.nome}</b>
          </p>
        </div>
        <div className="col-3">
          <p>Empresa:</p>
          <p>
            <b>{solicitacao.escola.lote.terceirizada.nome_fantasia}</b>
          </p>
        </div>
      </div>
      <hr />
      <div className="row mx-3">
        <FluxoDeStatus
          listaDeStatus={solicitacao.logs}
          fluxo={fluxoPartindoEscola}
          eh_gestao_alimentacao={true}
        />
      </div>
      <hr />
      <div className="row mt-3">
        <div className="col-12">
          <p>
            <b>Solicitação de Alteração</b>
          </p>
        </div>
      </div>
      <table className="table-periods-alteracao">
        <thead>
          <tr className="row">
            <th className="col-2">Tipo de Alteração</th>
            {solicitacao.alterar_dia ? (
              <th className="col-2">Alterar dia</th>
            ) : (
              <th className="col-2">Dia(s) de Alteração</th>
            )}
          </tr>
        </thead>
        <tbody>
          <tr className="row">
            <td className="col-2">{solicitacao.motivo.nome}</td>
            {solicitacao.datas_intervalo.map((data_intervalo, key) => {
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
            })}
          </tr>
        </tbody>
      </table>
      {dadosTabela.map((periodo, index) => {
        return (
          <div className="row" key={index}>
            <div className="col-12">
              <label
                style={{
                  background: periodo.background,
                  border: `1px solid ${periodo.borderColor}`,
                  borderRadius: "5px",
                  margin: "1% 0px",
                  width: "100%",
                  padding: "8px 15px",
                  height: "40px",
                }}
              >
                {periodo.nome}
              </label>
            </div>
            <div className="col-12">
              <div className="container-fluid pe-0">
                {periodo.substituicoesCEI && (
                  <div className="row">
                    <div className="col-12">
                      <label className="periodo-label-style">Alunos CEI</label>
                    </div>
                    <div className="col-12 substituicoes-font-style">
                      <p>
                        Alteração do tipo de Alimentação de:{" "}
                        <b className="tipos-alimentacao-style">
                          {periodo.substituicoesCEI.tipos_alimentacao_de
                            .map((ta) => ta.nome)
                            .join(", ")}
                        </b>
                      </p>
                      <p>
                        Para o tipo de Alimentação:{" "}
                        <b className="tipos-alimentacao-style">
                          {periodo.substituicoesCEI.tipos_alimentacao_para
                            .map((ta) => ta.nome)
                            .join(", ")}
                        </b>
                      </p>
                    </div>
                    <div className="col-12">
                      <table className="table faixas-etarias-cei-alteracao">
                        <thead>
                          <tr>
                            <th className="col-7">Faixa Etária</th>
                            <th className="col-3 text-center">
                              Alunos matriculados
                            </th>
                            <th className="col-2 text-center">Quantidade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {solicitacao.substituicoes_cemei_cei_periodo_escolar
                            .filter(
                              (q) => q.periodo_escolar.nome === periodo.nome
                            )
                            .map((faixa, key) =>
                              faixa.faixas_etarias.map((f) => {
                                return (
                                  <tr key={key}>
                                    <td className="col-7">
                                      {f.faixa_etaria.__str__}
                                    </td>
                                    <td className="col-3 text-center">
                                      {f.matriculados_quando_criado}
                                    </td>
                                    <td className="col-2 text-center">
                                      {f.quantidade}
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                        </tbody>
                        <thead>
                          <tr>
                            <th className="col-7">Total</th>
                            <th className="col-3 text-center">
                              {solicitacao.substituicoes_cemei_cei_periodo_escolar
                                .filter(
                                  (q) => q.periodo_escolar.nome === periodo.nome
                                )
                                .map((faixa) =>
                                  faixa.faixas_etarias.reduce(function (
                                    total,
                                    f
                                  ) {
                                    return total + f.matriculados_quando_criado;
                                  },
                                  totalMatriculados)
                                )}
                            </th>
                            <th className="col-2 text-center">
                              {solicitacao.substituicoes_cemei_cei_periodo_escolar
                                .filter(
                                  (q) => q.periodo_escolar.nome === periodo.nome
                                )
                                .map((faixa) =>
                                  faixa.faixas_etarias.reduce(function (
                                    total,
                                    f
                                  ) {
                                    return total + f.quantidade;
                                  },
                                  totalQuantidadeAlunos)
                                )}
                            </th>
                          </tr>
                        </thead>
                      </table>
                    </div>
                  </div>
                )}
                {periodo.substituicoesEMEI && (
                  <div className="row">
                    <div className="col-12">
                      <label className="periodo-label-style">Alunos EMEI</label>
                    </div>
                    <div className="col-12 substituicoes-font-style">
                      <p>
                        Alteração do tipo de Alimentação de:{" "}
                        <b className="tipos-alimentacao-style">
                          {periodo.substituicoesEMEI.tipos_alimentacao_de
                            .map((ta) => ta.nome)
                            .join(", ")}
                        </b>
                      </p>
                      <p>
                        Para o tipo de Alimentação:{" "}
                        <b className="tipos-alimentacao-style">
                          {periodo.substituicoesEMEI.tipos_alimentacao_para
                            .map((ta) => ta.nome)
                            .join(", ")}
                        </b>
                      </p>
                    </div>
                    <div className="col-12">
                      <table className="table faixas-etarias-cei-alteracao">
                        <thead>
                          <tr>
                            <th className="col-7">
                              <span className="ms-5">Alunos matriculados</span>
                              <b className="ms-5">
                                {
                                  periodo.substituicoesEMEI
                                    .matriculados_quando_criado
                                }
                              </b>
                            </th>
                            <th className="col-5">
                              <span className="ms-5">Quantidade</span>
                              <b className="ms-5">
                                {periodo.substituicoesEMEI.qtd_alunos}
                              </b>
                            </th>
                          </tr>
                        </thead>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <hr />
      {solicitacao?.observacao && (
        <div className="row mt-3">
          <div className="col-12">
            <p>Observações:</p>
            <p
              className="observacao-alteracao-cardapio-cemei"
              dangerouslySetInnerHTML={{
                __html: solicitacao.observacao,
              }}
            />
          </div>
        </div>
      )}
      {solicitacao.datas_intervalo.find(
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
      {solicitacao && justificativaAoNegarSolicitacao(solicitacao.logs) && (
        <div className="row">
          <div className="col-12 report-label-value">
            <p>Justificativa da negação</p>
            <p
              className="value"
              dangerouslySetInnerHTML={{
                __html: justificativaAoNegarSolicitacao(solicitacao.logs),
              }}
            />
          </div>
        </div>
      )}
      {solicitacao &&
        justificativaAoAprovarSolicitacao(solicitacao.logs) &&
        !EXIBIR_HISTORICO && (
          <div className="row">
            <div className="col-12 report-label-value">
              <p>
                <b>Autorizou</b>
              </p>
              <p>{`${
                solicitacao.logs.find(
                  (log) => log.status_evento_explicacao === "CODAE autorizou"
                ).criado_em
              } - Informações da CODAE`}</p>
              <p
                className="value"
                dangerouslySetInnerHTML={{
                  __html: justificativaAoAprovarSolicitacao(solicitacao.logs),
                }}
              />
            </div>
          </div>
        )}
      <RelatorioHistoricoJustificativaEscola solicitacao={solicitacao} />
      <RelatorioHistoricoQuestionamento solicitacao={solicitacao} />
    </>
  );
};
