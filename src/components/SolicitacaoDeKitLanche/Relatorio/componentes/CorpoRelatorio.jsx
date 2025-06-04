import React, { Fragment, useState } from "react";
import { FluxoDeStatus } from "../../../Shareable/FluxoDeStatus";
import {
  corDaMensagem,
  deepCopy,
  ehInclusaoCei,
  justificativaAoAprovarSolicitacao,
} from "../../../../helpers/utilities";
import Botao from "../../../Shareable/Botao";
import { ToggleExpandir } from "../../../Shareable/ToggleExpandir";
import { SolicitacoesSimilaresKitLanche } from "src/components/Shareable/SolicitacoesSimilaresKitLanche";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON,
} from "../../../Shareable/Botao/constants";
import {
  stringSeparadaPorVirgulas,
  justificativaAoNegarSolicitacao,
} from "../../../../helpers/utilities";
import { getDetalheKitLancheAvulso } from "../../../../services/relatorios";
import { fluxoPartindoEscola } from "../../../Shareable/FluxoDeStatus/helper";
import TabelaFaixaEtaria from "../../../Shareable/TabelaFaixaEtaria";
import "./style.scss";
import { existeLogDeQuestionamentoDaCODAE } from "src/components/Shareable/RelatorioHistoricoQuestionamento/helper";

export const CorpoRelatorio = (props) => {
  const { tipoSolicitacao, solicitacaoKitLanche, prazoDoPedidoMensagem } =
    props;

  const [solicitacoesSimilares, setSolicitacoesSimilares] = useState(
    props.solicitacoesSimilares
  );

  const justificativaNegacao = justificativaAoNegarSolicitacao(
    solicitacaoKitLanche.logs
  );

  const justificativaAprovacao = justificativaAoAprovarSolicitacao(
    solicitacaoKitLanche.logs
  );

  const EXIBIR_HISTORICO =
    solicitacaoKitLanche.prioridade !== "REGULAR" &&
    existeLogDeQuestionamentoDaCODAE(solicitacaoKitLanche.logs);

  const collapseSolicitacaoSimilar = (idxSolicitacaoSimilar) => {
    let _solicitacoesSimilares = deepCopy(solicitacoesSimilares);
    _solicitacoesSimilares[idxSolicitacaoSimilar]["collapsed"] =
      !_solicitacoesSimilares[idxSolicitacaoSimilar]["collapsed"];
    setSolicitacoesSimilares(_solicitacoesSimilares);
  };

  return (
    <div>
      <div className="row">
        <p className={`col-12 ${corDaMensagem(prazoDoPedidoMensagem)}`}>
          <b>{prazoDoPedidoMensagem}</b>
          <Botao
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN}
            icon={BUTTON_ICON.PRINT}
            className="float-end"
            onClick={() => {
              getDetalheKitLancheAvulso(
                solicitacaoKitLanche.uuid,
                tipoSolicitacao,
                solicitacaoKitLanche?.escola?.nome
              );
            }}
          />
        </p>
        <div className="col-2">
          <span className="badge-sme badge-secondary-sme">
            <span className="id-of-solicitation-dre">
              # {solicitacaoKitLanche.id_externo}
            </span>
            <br />{" "}
            <span className="number-of-order-label">Nº DA SOLICITAÇÃO</span>
          </span>
        </div>
        <div className="ps-2 my-auto offset-1 col-5">
          <span className="requester">Escola Solicitante</span>
          <br />
          <span className="dre-name">
            {solicitacaoKitLanche.escola && solicitacaoKitLanche.escola.nome}
          </span>
        </div>
        <div className="my-auto col-4">
          <span className="requester">Código EOL</span>
          <br />
          <span className="dre-name">
            {solicitacaoKitLanche.escola &&
              solicitacaoKitLanche.escola.codigo_eol}
          </span>
        </div>
      </div>
      <div className="row">
        <div className="col-3 report-label-value">
          <p>DRE</p>
          <p className="value-important">
            {solicitacaoKitLanche.escola &&
              solicitacaoKitLanche.escola.diretoria_regional &&
              solicitacaoKitLanche.escola.diretoria_regional.nome}
          </p>
        </div>
        <div className="col-3 report-label-value">
          <p>Lote</p>
          <p className="value-important">
            {solicitacaoKitLanche.escola &&
              solicitacaoKitLanche.escola.lote &&
              solicitacaoKitLanche.escola.lote.nome}
          </p>
        </div>
        <div className="col-3 report-label-value">
          <p>Tipo de Gestão</p>
          <p className="value-important">
            {solicitacaoKitLanche.escola &&
              solicitacaoKitLanche.escola.tipo_gestao &&
              solicitacaoKitLanche.escola.tipo_gestao.nome}
          </p>
        </div>
        <div className="col-3 report-label-value">
          <p>Empresa</p>
          <p className="value-important">
            {solicitacaoKitLanche.rastro_terceirizada &&
              solicitacaoKitLanche.rastro_terceirizada.nome_fantasia}
          </p>
        </div>
      </div>
      <hr />
      <div className="row">
        <FluxoDeStatus
          listaDeStatus={solicitacaoKitLanche.logs}
          fluxo={fluxoPartindoEscola}
          eh_gestao_alimentacao={true}
        />
      </div>
      <hr />
      <div className="row mt-3">
        <div className="col-2">
          <p>Solicitação Similar:</p>
        </div>
        <div className="col-10">
          {solicitacoesSimilares &&
            solicitacoesSimilares.map((solicitacao, idxSolicitacaoSimilar) => {
              return (
                <p className="gatilho-style" key={idxSolicitacaoSimilar}>
                  <b>
                    {`#${solicitacao.id_externo}`}
                    <ToggleExpandir
                      onClick={() =>
                        collapseSolicitacaoSimilar(idxSolicitacaoSimilar)
                      }
                      ativo={!solicitacao.collapsed}
                      className="icon-padding"
                    />
                  </b>
                </p>
              );
            })}
        </div>
      </div>
      {solicitacoesSimilares &&
        solicitacoesSimilares.length > 0 &&
        solicitacoesSimilares.map((s, idxSolicitacaoSimilar) => {
          return (
            <SolicitacoesSimilaresKitLanche
              key={idxSolicitacaoSimilar}
              solicitacao={s}
              index={idxSolicitacaoSimilar}
            />
          );
        })}
      <hr />
      <div className="row">
        <div className="col-4 report-label-value">
          <p>Data do evento</p>
          <p className="value">
            {solicitacaoKitLanche.solicitacao_kit_lanche &&
              solicitacaoKitLanche.solicitacao_kit_lanche.data}
          </p>
        </div>
        <div className="col-4 report-label-value">
          <p>Local do passeio</p>
          <p className="value">{solicitacaoKitLanche.local}</p>
        </div>
        <div className="col-4 report-label-value">
          <p>Evento/Atividade</p>
          <p className="value">{solicitacaoKitLanche.evento}</p>
        </div>
      </div>
      <table className="table-report">
        <thead>
          <tr>
            <th>Nº de Alunos</th>
            <th>Tempo Previsto de Passeio</th>
            <th>Opção Desejada</th>
            <th>Nº Total de Kits</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{solicitacaoKitLanche.quantidade_alunos}</td>
            <td>
              {
                solicitacaoKitLanche.solicitacao_kit_lanche
                  .tempo_passeio_explicacao
              }
            </td>
            <td>
              {stringSeparadaPorVirgulas(
                solicitacaoKitLanche.solicitacao_kit_lanche.kits,
                "nome"
              )}
            </td>
            <td>
              {solicitacaoKitLanche.solicitacao_kit_lanche.kits.length *
                solicitacaoKitLanche.quantidade_alunos}
            </td>
          </tr>
        </tbody>
      </table>
      {ehInclusaoCei(tipoSolicitacao) && (
        <Fragment>
          <TabelaFaixaEtaria faixas={solicitacaoKitLanche.faixas_etarias} />
        </Fragment>
      )}
      {solicitacaoKitLanche.alunos_com_dieta_especial_participantes &&
        !!solicitacaoKitLanche.alunos_com_dieta_especial_participantes
          .length && (
          <Fragment>
            <div className="row report-label-value">
              <div className="col-12 report-label-value">
                <p>
                  <b>Alunos com dieta especial</b>
                </p>
              </div>
            </div>
            <section className="table-report-dieta-especial">
              <article>
                <div className="codigo-eol">Código EOL</div>
                <div className="nome">Nome</div>
              </article>
              {solicitacaoKitLanche.alunos_com_dieta_especial_participantes.map(
                (aluno, key) => {
                  return (
                    <article key={key}>
                      <div className="codigo-eol">{aluno.codigo_eol}</div>
                      <div className="nome">{aluno.nome}</div>
                    </article>
                  );
                }
              )}
            </section>
          </Fragment>
        )}

      <div className="row">
        <div className="col-12 report-label-value">
          <p>Observações</p>
          <p
            className="value"
            dangerouslySetInnerHTML={{
              __html:
                solicitacaoKitLanche.solicitacao_kit_lanche &&
                solicitacaoKitLanche.solicitacao_kit_lanche.descricao,
            }}
          />
        </div>
      </div>
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
      {justificativaAprovacao && !EXIBIR_HISTORICO && (
        <div className="row">
          <div className="col-12 report-label-value">
            <p>
              <b>Autorizou</b>
            </p>
            <p>{`${
              solicitacaoKitLanche.logs.find(
                (log) => log.status_evento_explicacao === "CODAE autorizou"
              ).criado_em
            } - Informações da CODAE`}</p>
            <p
              className="value"
              dangerouslySetInnerHTML={{
                __html: justificativaAprovacao,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CorpoRelatorio;
