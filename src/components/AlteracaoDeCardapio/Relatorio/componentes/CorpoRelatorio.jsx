import React, { Fragment } from "react";
import { FluxoDeStatus } from "../../../Shareable/FluxoDeStatus";
import {
  corDaMensagem,
  ehInclusaoCei,
  justificativaAoNegarSolicitacao
} from "../../../../helpers/utilities";
import Botao from "../../../Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
  BUTTON_ICON
} from "../../../Shareable/Botao/constants";
import { getRelatorioAlteracaoCardapio } from "../../../../services/relatorios";
import { fluxoPartindoEscola } from "../../../Shareable/FluxoDeStatus/helper";
import TabelaFaixaEtaria from "../../../Shareable/TabelaFaixaEtaria";

export const CorpoRelatorio = props => {
  const { alteracaoDeCardapio, prazoDoPedidoMensagem, tipoSolicitacao } = props;

  const justificativaNegacao = justificativaAoNegarSolicitacao(
    alteracaoDeCardapio.logs
  );

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
            style={BUTTON_STYLE.BLUE}
            icon={BUTTON_ICON.PRINT}
            className="float-right"
            onClick={() => {
              getRelatorioAlteracaoCardapio(
                alteracaoDeCardapio.uuid,
                tipoSolicitacao
              );
            }}
          />
        </p>
        <div className="col-2">
          <span className="badge-sme badge-secondary-sme">
            <span className="id-of-solicitation-dre">
              # {alteracaoDeCardapio.id_externo}
            </span>
            <br />{" "}
            <span className="number-of-order-label">Nº DA SOLICITAÇÃO</span>
          </span>
        </div>
        <div className="pl-2 my-auto offset-1 col-5">
          <span className="requester">Escola Solicitante</span>
          <br />
          <span className="dre-name">
            {alteracaoDeCardapio.escola && alteracaoDeCardapio.escola.nome}
          </span>
        </div>
        <div className="my-auto col-4">
          <span className="requester">Código EOL</span>
          <br />
          <span className="dre-name">
            {alteracaoDeCardapio.escola &&
              alteracaoDeCardapio.escola.codigo_eol}
          </span>
        </div>
      </div>
      <div className="row">
        <div className="col-3 report-label-value">
          <p>DRE</p>
          <p className="value-important">
            {alteracaoDeCardapio.escola &&
              alteracaoDeCardapio.escola.diretoria_regional &&
              alteracaoDeCardapio.escola.diretoria_regional.nome}
          </p>
        </div>
        <div className="col-3 report-label-value">
          <p>Lote</p>
          <p className="value-important">
            {alteracaoDeCardapio.escola &&
              alteracaoDeCardapio.escola.lote &&
              alteracaoDeCardapio.escola.lote.nome}
          </p>
        </div>
        <div className="col-3 report-label-value">
          <p>Tipo de Gestão</p>
          <p className="value-important">
            {alteracaoDeCardapio.escola &&
              alteracaoDeCardapio.escola.tipo_gestao &&
              alteracaoDeCardapio.escola.tipo_gestao.nome}
          </p>
        </div>
        <div className="col-3 report-label-value">
          <p>Empresa</p>
          <p className="value-important">
            {alteracaoDeCardapio.rastro_terceirizada &&
              alteracaoDeCardapio.rastro_terceirizada.nome_fantasia}
          </p>
        </div>
      </div>
      <hr />
      {alteracaoDeCardapio.logs && (
        <div className="row">
          <FluxoDeStatus
            listaDeStatus={alteracaoDeCardapio.logs}
            fluxo={fluxoPartindoEscola}
            eh_gestao_alimentacao={true}
          />
        </div>
      )}
      <hr />
      <table className="table-periods">
        <tr>
          <th>Tipo de Alteração</th>
          {alteracaoDeCardapio.data_inicial ===
          alteracaoDeCardapio.data_final ? (
            <th>Alterar dia</th>
          ) : (
            [<th key={0}>Alterar de</th>, <th key={1}>Até</th>]
          )}
        </tr>
        <tr>
          <td>{alteracaoDeCardapio.motivo.nome}</td>
          {alteracaoDeCardapio.data_inicial ===
          alteracaoDeCardapio.data_final ? (
            <td>
              {alteracaoDeCardapio.data_inicial || alteracaoDeCardapio.data}
            </td>
          ) : (
            [
              <td key={0}>{alteracaoDeCardapio.data_inicial}</td>,
              <td key={1}>{alteracaoDeCardapio.data_final}</td>
            ]
          )}
        </tr>
      </table>
      <table className="table-report mt-4">
        <tr>
          <th>Período</th>
          <th>Alteração alimentação de:</th>
          <th>Alteração alimentação para:</th>
          <th>Número de alunos</th>
        </tr>
        {alteracaoDeCardapio.substituicoes.map(
          (
            {
              periodo_escolar,
              tipos_alimentacao_de,
              tipos_alimentacao_para,
              qtd_alunos,
              faixas_etarias
            },
            key
          ) => {
            let alimentos = tipos_alimentacao_de.map(alimento => alimento.nome);
            let tipos_alimentos_formatados = "";
            for (let i = 0; i < alimentos.length; i++) {
              tipos_alimentos_formatados =
                tipos_alimentos_formatados + alimentos[i];
              if (i + 1 !== alimentos.length) {
                tipos_alimentos_formatados = tipos_alimentos_formatados + ", ";
              }
            }

            let substitutos = tipos_alimentacao_para.map(
              substituto => substituto.nome
            );
            let substitutos_formatados = "";
            for (let i = 0; i < substitutos.length; i++) {
              substitutos_formatados = substitutos_formatados + substitutos[i];
              if (i + 1 !== substitutos.length) {
                substitutos_formatados = substitutos_formatados + ", ";
              }
            }
            return (
              <Fragment key={key}>
                <tr>
                  <td>{periodo_escolar && periodo_escolar.nome}</td>
                  <td>{tipos_alimentos_formatados}</td>
                  <td>{substitutos_formatados}</td>
                  <td>{qtd_alunos}</td>
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
                __html: alteracaoDeCardapio.observacao
              }}
            />
          </td>
        </tr>
      </table>
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
                  __html: justificativaNegacao
                }}
              />
            </td>
          </tr>
        </table>
      )}
    </div>
  );
};

export default CorpoRelatorio;
