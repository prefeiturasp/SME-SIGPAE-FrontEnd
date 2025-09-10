import PropTypes from "prop-types";
import { Fragment } from "react";
import { HeaderCorpoRelatorio } from "src/components/GestaoDeAlimentacao/Relatorios/RelatorioGenerico/components/HeaderCorpoRelatorio";
import { existeLogDeQuestionamentoDaCODAE } from "src/components/Shareable/RelatorioHistoricoQuestionamento/helper";
import TabelaFaixaEtaria from "src/components/Shareable/TabelaFaixaEtaria";
import {
  ehInclusaoCei,
  justificativaAoAprovarSolicitacao,
  justificativaAoNegarSolicitacao,
} from "src/helpers/utilities";
import { getRelatorioAlteracaoCardapio } from "src/services/relatorios";
import "./style.scss";

export const CorpoRelatorio = (props) => {
  const { solicitacao, tipoSolicitacao } = props;

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
      <HeaderCorpoRelatorio
        getRelatorio={getRelatorioAlteracaoCardapio}
        {...props}
      />
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
