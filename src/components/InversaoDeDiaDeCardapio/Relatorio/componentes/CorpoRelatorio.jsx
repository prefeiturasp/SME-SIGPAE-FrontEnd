import React, { useState } from "react";
import { FluxoDeStatus } from "../../../Shareable/FluxoDeStatus";
import {
  corDaMensagem,
  justificativaAoNegarSolicitacao,
  stringSeparadaPorVirgulas,
} from "../../../../helpers/utilities";
import Botao from "../../../Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON,
} from "../../../Shareable/Botao/constants";

import { getDetalheInversaoCardapio } from "../../../../services/relatorios";
import { fluxoPartindoEscola } from "../../../Shareable/FluxoDeStatus/helper";
import { statusEnum } from "src/constants/shared";

export const CorpoRelatorio = (props) => {
  const [imprimindo, setimprimindo] = useState(false);
  const { inversaoDiaCardapio, prazoDoPedidoMensagem, escolaDaInversao } =
    props;

  const justificativaNegacao = justificativaAoNegarSolicitacao(
    inversaoDiaCardapio.logs
  );

  const btnImprimirRelatorio = async () => {
    setimprimindo(true);
    await getDetalheInversaoCardapio(
      inversaoDiaCardapio.uuid,
      inversaoDiaCardapio?.escola?.nome
    );
    setimprimindo(false);
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
            titulo="imprimir"
            style={imprimindo ? BUTTON_STYLE.GREEN_OUTLINE : BUTTON_STYLE.GREEN}
            icon={imprimindo ? BUTTON_ICON.LOADING : BUTTON_ICON.PRINT}
            disabled={imprimindo}
            className="float-end"
            onClick={() => btnImprimirRelatorio()}
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
        <div className="ps-2 my-auto offset-1 col-5">
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
            eh_gestao_alimentacao={true}
          />
        </div>
      )}
      <hr />
      {inversaoDiaCardapio.tipos_alimentacao.length > 0 && (
        <div className="row">
          <div className="col-12 report-label-value">
            <p>Tipos de Alimentação para inversão:</p>
            <p className="fw-bold">
              {stringSeparadaPorVirgulas(
                inversaoDiaCardapio.tipos_alimentacao,
                "nome"
              )}
            </p>
          </div>
        </div>
      )}
      <table className="table-report mt-4">
        <tr>
          <th className="col-3">Data de Inversão</th>
          <th className="col-3">Referência:</th>
          <th className="col-3">Aplicar em:</th>
        </tr>
        <tr>
          <td />
          <td className="pe-5">
            {inversaoDiaCardapio.cardapio_de
              ? inversaoDiaCardapio.cardapio_de.data
              : inversaoDiaCardapio.data_de_inversao}
          </td>
          <td>
            {inversaoDiaCardapio.cardapio_para
              ? inversaoDiaCardapio.cardapio_para.data
              : inversaoDiaCardapio.data_para_inversao}
          </td>
        </tr>
        {inversaoDiaCardapio.data_de_inversao_2 && (
          <tr>
            <td />
            <td className="pe-5">{inversaoDiaCardapio.data_de_inversao_2}</td>
            <td>{inversaoDiaCardapio.data_para_inversao_2}</td>
          </tr>
        )}
      </table>
      <div className="row">
        <div className="col-12 report-label-value">
          <p>Motivo</p>
          <p
            className="value fw-bold"
            dangerouslySetInnerHTML={{
              __html: inversaoDiaCardapio.motivo,
            }}
          />
        </div>
      </div>
      {inversaoDiaCardapio.observacao && (
        <div className="row">
          <div className="col-12 report-label-value">
            <p>Observações</p>
            <p
              className="fw-bold value"
              dangerouslySetInnerHTML={{
                __html: inversaoDiaCardapio.observacao,
              }}
            />
          </div>
        </div>
      )}
      {inversaoDiaCardapio.logs &&
        !inversaoDiaCardapio.prioridade !== "REGULAR" &&
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
              {inversaoDiaCardapio.logs[inversaoDiaCardapio.logs.length - 1]
                .justificativa !== "" ? (
                <p
                  className="value"
                  dangerouslySetInnerHTML={{
                    __html:
                      inversaoDiaCardapio.logs[
                        inversaoDiaCardapio.logs.length - 1
                      ].justificativa,
                  }}
                />
              ) : (
                <p>Sem observações por parte da CODAE</p>
              )}
            </div>
          </div>
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

export default CorpoRelatorio;
