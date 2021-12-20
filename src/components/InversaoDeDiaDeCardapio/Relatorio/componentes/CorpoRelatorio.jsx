import React from "react";
import { FluxoDeStatus } from "../../../Shareable/FluxoDeStatus";
import { corDaMensagem } from "../../../../helpers/utilities";
import Botao from "../../../Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON
} from "../../../Shareable/Botao/constants";

import { getDetalheInversaoCardapio } from "../../../../services/relatorios";
import { fluxoPartindoEscola } from "../../../Shareable/FluxoDeStatus/helper";
import { statusEnum } from "constants/shared";

export const CorpoRelatorio = props => {
  const {
    inversaoDiaCardapio,
    prazoDoPedidoMensagem,
    escolaDaInversao
  } = props;
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
            titulo="imprimir"
            style={BUTTON_STYLE.BLUE}
            icon={BUTTON_ICON.PRINT}
            className="float-right"
            onClick={() => getDetalheInversaoCardapio(inversaoDiaCardapio.uuid)}
          />
        </p>
        <div className="col-2">
          <span className="badge-sme badge-secondary-sme">
            <span className="id-of-solicitation-dre">
              # {inversaoDiaCardapio.id_externo}
            </span>
            <br />{" "}
            <span className="number-of-order-label">Nº DA SOLICITAÇÃO</span>
          </span>
        </div>
        <div className="pl-2 my-auto offset-1 col-5">
          <span className="requester">Escola Solicitante</span>
          <br />
          <span className="dre-name">
            {inversaoDiaCardapio.escola && inversaoDiaCardapio.escola.nome}
          </span>
        </div>
        <div className="my-auto col-4">
          <span className="requester">Código EOL</span>
          <br />
          <span className="dre-name">
            {inversaoDiaCardapio.escola &&
              inversaoDiaCardapio.escola.codigo_eol}
          </span>
        </div>
      </div>
      <div className="row">
        <div className="col-3 report-label-value">
          <p>DRE</p>
          <p className="value-important">
            {inversaoDiaCardapio.escola &&
              inversaoDiaCardapio.escola.diretoria_regional &&
              inversaoDiaCardapio.escola.diretoria_regional.nome}
          </p>
        </div>
        <div className="col-3 report-label-value">
          <p>Lote</p>
          <p className="value-important">
            {escolaDaInversao.lote && escolaDaInversao.lote.nome}
          </p>
        </div>
        <div className="col-3 report-label-value">
          <p>Tipo de Gestão</p>
          <p className="value-important">
            {escolaDaInversao &&
              escolaDaInversao.tipo_gestao &&
              escolaDaInversao.tipo_gestao.nome}
          </p>
        </div>
        <div className="col-3 report-label-value">
          <p>Empresa</p>
          <p className="value-important">
            {inversaoDiaCardapio.rastro_terceirizada &&
              inversaoDiaCardapio.rastro_terceirizada.nome_fantasia}
          </p>
        </div>
      </div>
      <hr />
      {inversaoDiaCardapio.logs && (
        <div className="row">
          <FluxoDeStatus
            listaDeStatus={inversaoDiaCardapio.logs}
            fluxo={fluxoPartindoEscola}
          />
        </div>
      )}
      <hr />
      <div className="row">
        <div className="col-12 report-label-value">
          <p>Motivo</p>
          <p
            className="value"
            dangerouslySetInnerHTML={{
              __html: inversaoDiaCardapio.motivo
            }}
          />
        </div>
      </div>
      <table className="table-report mt-4">
        <tr>
          <th className="text-right">Substituição de:</th>
          <th>Substituição para:</th>
        </tr>
        <tr>
          <td className="text-right pr-5">
            {inversaoDiaCardapio.cardapio_de.data}
          </td>
          <td>{inversaoDiaCardapio.cardapio_para.data}</td>
        </tr>
      </table>
      <div className="row">
        <div className="col-12 report-label-value">
          <p>Observações</p>
          <p
            className="value"
            dangerouslySetInnerHTML={{
              __html: inversaoDiaCardapio.observacao
            }}
          />
        </div>
      </div>
      {inversaoDiaCardapio.logs &&
        !inversaoDiaCardapio.foi_solicitado_fora_do_prazo &&
        inversaoDiaCardapio.status === statusEnum.CODAE_AUTORIZADO && (
          <div className="row">
            <div className="col-12 report-label-value">
              <p>
                <b>Autorizou</b>
              </p>
              <div>
                {
                  inversaoDiaCardapio.logs[inversaoDiaCardapio.logs.length - 1]
                    .criado_em
                }{" "}
                - Informações da CODAE
              </div>
              <p
                className="value"
                dangerouslySetInnerHTML={{
                  __html:
                    inversaoDiaCardapio.logs[
                      inversaoDiaCardapio.logs.length - 1
                    ].justificativa
                }}
              />
            </div>
          </div>
        )}
    </div>
  );
};

export default CorpoRelatorio;
