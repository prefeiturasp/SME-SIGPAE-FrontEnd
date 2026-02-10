import React from "react";
import { FluxoDeStatus } from "../../../Shareable/FluxoDeStatus";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON,
} from "../../../Shareable/Botao/constants";
import Botao from "../../../Shareable/Botao";
import { TabelaKits } from "./TabelaKits";
import {
  corDaMensagem,
  deepCopy,
  justificativaAoNegarSolicitacao,
} from "../../../../helpers/utilities";
import { getRelatorioKitLancheUnificado } from "../../../../services/relatorios";
import { fluxoPartindoDRE } from "../../../Shareable/FluxoDeStatus/helper";
import { ESCOLA } from "src/configs/constants";

export const CorpoRelatorio = (props) => {
  const { solicitacaoUnificada, prazoDoPedidoMensagem, visao } = props;
  const justificativaNegacao = justificativaAoNegarSolicitacao(
    solicitacaoUnificada.logs,
  );

  let escolasQuantidades = solicitacaoUnificada.escolas_quantidades;
  let logs = solicitacaoUnificada.logs;
  let copyLogs = deepCopy(logs);

  if (visao === ESCOLA) {
    if (copyLogs.slice(-1)[0].usuario.tipo_usuario === "escola") {
      copyLogs.splice(-1);
    }
    if (copyLogs.slice(-1)[0].usuario.tipo_usuario === "diretoriaregional") {
      copyLogs.splice(-1);
    }
    const nomeEscola = localStorage.getItem("nome_instituicao");
    escolasQuantidades = escolasQuantidades.filter((eq) =>
      eq.escola.nome.includes(nomeEscola.replace(/"/g, "")),
    );
    if (escolasQuantidades[0].cancelado) {
      copyLogs.push({
        criado_em: escolasQuantidades[0].cancelado_em_com_hora,
        descricao: "",
        justificativa: escolasQuantidades[0].cancelado_justificativa,
        resposta_sim_nao: false,
        status_evento_explicacao: `${
          escolasQuantidades[0].cancelado_por.tipo_usuario ===
          "diretoriaregional"
            ? "DRE"
            : "Escola"
        } cancelou`,
        usuario: escolasQuantidades[0].cancelado_por,
      });
    }
  }

  return (
    <div>
      <div className="container-detail">
        <div className="row">
          <p
            className={`col-12 title-message ${corDaMensagem(
              prazoDoPedidoMensagem,
            )}`}
          >
            {prazoDoPedidoMensagem}
            <Botao
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN}
              icon={BUTTON_ICON.PRINT}
              className="float-end"
              onClick={() => {
                getRelatorioKitLancheUnificado(solicitacaoUnificada.uuid);
              }}
            />
          </p>
          <div className="col-3">
            <span className="badge-sme badge-secondary-sme">
              <span className="id-of-solicitation-dre">
                # {solicitacaoUnificada.id_externo}
              </span>
              <br /> <span className="number-of-order-label">ID DO PEDIDO</span>
            </span>
          </div>
          <div className="col-4">
            <span className="requester">Diretoria Regional Solicitante</span>
            <br />
            <span className="dre-name">
              {solicitacaoUnificada.diretoria_regional.nome}
            </span>
          </div>
          <div className="col-1">
            <span className="requester">Lote</span>
            <br />
            <span className="dre-name">{solicitacaoUnificada.lote_nome}</span>
          </div>
          <div className="col-4">
            <span className="requester">Empresa</span>
            <br />
            <span className="dre-name">
              {solicitacaoUnificada.rastro_terceirizada &&
                solicitacaoUnificada.rastro_terceirizada.nome_fantasia}
            </span>
          </div>
        </div>

        <hr />
        <div className="row">
          <FluxoDeStatus
            fluxo={fluxoPartindoDRE}
            listaDeStatus={copyLogs}
            eh_gestao_alimentacao={true}
            solicitacaoUnificada={solicitacaoUnificada}
          />
        </div>
        <hr />

        <div className="descricao-evento row mt-3 mb-3">
          <div className="descricao-container col-3">
            <div className="descricao-titulo">Data do evento</div>
            <div className="descricao-observacao">
              {solicitacaoUnificada.solicitacao_kit_lanche.data}
            </div>
          </div>
          <div className="descricao-container col-3">
            <div className="descricao-titulo">Local do passeio</div>
            <div className="descricao-texto">{solicitacaoUnificada.local}</div>
          </div>
          <div className="descricao-container col-3">
            <div className="descricao-titulo">Evento/Atividade</div>
            <div className="descricao-texto">
              {solicitacaoUnificada.evento
                ? solicitacaoUnificada.evento
                : "- -"}
            </div>
          </div>
        </div>

        <div className="tabela-escolas header-tabela">
          <div>Código</div>
          <div>Unidade Escolar</div>
          <div>N° de alunos participantes</div>
          <div>Tempo de passeio</div>
          <div>Opção desejada</div>
          <div>N° Total de Kits</div>
        </div>

        <div>
          {escolasQuantidades.map((escola_quantidade, key) => {
            return (
              <TabelaKits
                key={key}
                escola_quantidade={escola_quantidade}
                solicitacaoUnificada={solicitacaoUnificada}
                visao={visao}
              />
            );
          })}
        </div>

        <div className="observacoes-solicitacao">
          <div className="div-topo">
            <div>
              <div className="descricao-titulo">
                N° total de Unidade Escolares beneficiadas
              </div>
              <div className="descricao-texto">{`${
                escolasQuantidades.length
              } Unidade${escolasQuantidades.length > 1 ? "s" : ""} Escolar${
                escolasQuantidades.length > 1 ? "es" : ""
              }`}</div>
            </div>
            <div className="kits">
              <div>
                <div className="descricao-titulo">N° total de Kits</div>
                <div className="descricao-texto">
                  {visao === ESCOLA
                    ? escolasQuantidades.reduce(
                        (acc, curr) =>
                          acc + curr.kits.length * curr.quantidade_alunos,
                        0,
                      )
                    : solicitacaoUnificada.total_kit_lanche}{" "}
                  Kits
                </div>
              </div>
            </div>
          </div>
          {solicitacaoUnificada.solicitacao_kit_lanche.descricao &&
            solicitacaoUnificada.solicitacao_kit_lanche.descricao !==
              "<p></p>" && (
              <div>
                <div className="descricao-titulo">Observações</div>
                <div
                  className="descricao-texto"
                  dangerouslySetInnerHTML={{
                    __html:
                      solicitacaoUnificada.solicitacao_kit_lanche.descricao,
                  }}
                />
              </div>
            )}
          {justificativaNegacao && (
            <div>
              <div className="descricao-titulo">Justificativa da negação</div>
              <div
                className="descricao-texto"
                dangerouslySetInnerHTML={{
                  __html: justificativaNegacao,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CorpoRelatorio;
