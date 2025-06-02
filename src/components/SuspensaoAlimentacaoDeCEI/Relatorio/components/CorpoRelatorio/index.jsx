import React from "react";
import { fluxoInformativoPartindoEscola } from "src/components/Shareable/FluxoDeStatus/helper";
import { FluxoDeStatus } from "src/components/Shareable/FluxoDeStatus";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import Botao from "src/components/Shareable/Botao";
import { stringSeparadaPorVirgulas } from "src/helpers/utilities";
import { imprimeRelatorioSuspensaoAlimentacao } from "src/services/relatorios";

export default ({ solicitacaoSuspensao }) => {
  return (
    <>
      <div className="row">
        <div className="col-3 my-auto">
          <div className="badge-sme badge-secondary-sme">
            <span className="id-of-solicitation-dre">
              {solicitacaoSuspensao.id_externo}
            </span>
            <br />{" "}
            <span className="number-of-order-label">Nº DA SOLICITAÇÂO</span>
          </div>
        </div>
        <div className="col-5 my-auto">
          <span className="requester">Escola Solicitante</span>
          <br />
          <span className="dre-name">{solicitacaoSuspensao.escola.nome}</span>
        </div>
        <div className="col-2 my-auto">
          <span className="requester">Código EOL</span>
          <br />
          <span className="dre-name">
            {solicitacaoSuspensao.escola.codigo_eol}
          </span>
        </div>
        <p className={`col-2 title-message px-0`}>
          <Botao
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN}
            icon={BUTTON_ICON.PRINT}
            className="float-end"
            onClick={() =>
              imprimeRelatorioSuspensaoAlimentacao(
                solicitacaoSuspensao.uuid,
                solicitacaoSuspensao?.escola?.nome,
                true
              )
            }
          />
        </p>
      </div>
      <div className="row">
        <div className="col-3 report-label-value">
          <p>DRE</p>
          <p className="value-important">
            {solicitacaoSuspensao.escola.diretoria_regional.nome}
          </p>
        </div>
        <div className="col-3 report-label-value">
          <p>Lote</p>
          <p className="value-important">
            {solicitacaoSuspensao.escola.lote.nome}
          </p>
        </div>
        <div className="col-3 report-label-value">
          <p>Tipo de Gestão</p>
          <p className="value-important">
            {solicitacaoSuspensao.escola.tipo_gestao.nome}
          </p>
        </div>
        <div className="col-3 report-label-value">
          <p>Empresa</p>
          <p className="value-important">
            {solicitacaoSuspensao.rastro_terceirizada.nome_fantasia}
          </p>
        </div>
      </div>
      <hr />
      <div className="row">
        <FluxoDeStatus
          listaDeStatus={solicitacaoSuspensao.logs}
          fluxo={fluxoInformativoPartindoEscola}
          eh_gestao_alimentacao={true}
        />
      </div>
      <hr />
      <table className="table-reasons">
        <tr className="row">
          <th className="col-8">Motivo</th>
          <th className="col-4">Dia(s) de suspensão</th>
        </tr>
        <tr className="row">
          <td className="col-8">
            {solicitacaoSuspensao.motivo.nome.includes("Outro")
              ? solicitacaoSuspensao.outro_motivo
              : solicitacaoSuspensao.motivo.nome}
          </td>
          <td className="col-4">{solicitacaoSuspensao.data}</td>
        </tr>
      </table>
      <table className="table-report mt-3">
        <tr>
          <th>Período</th>
          <th>Tipos de Alimentação</th>
          <th>N° de Alunos</th>
        </tr>
        {solicitacaoSuspensao.periodos_escolares.map((periodo, key) => {
          let escola_periodo =
            solicitacaoSuspensao.escola.periodos_escolares.find(
              (pr) => pr.nome === periodo.nome
            );
          let tipos_alimentacao = stringSeparadaPorVirgulas(
            escola_periodo.tipos_alimentacao,
            "nome"
          );
          return (
            <tr key={key}>
              <td>{periodo.nome}</td>
              <td>{tipos_alimentacao}</td>
              <td>{solicitacaoSuspensao.escola.quantidade_alunos}</td>
            </tr>
          );
        })}
      </table>
      <div className="row">
        <div className="col-12 report-label-value">
          {solicitacaoSuspensao.observacao && (
            <>
              <p>Observações</p>
              <p
                className="value"
                dangerouslySetInnerHTML={{
                  __html: solicitacaoSuspensao.observacao,
                }}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};
