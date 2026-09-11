import React, { useState } from "react";
import { acionaComEnterOuEspaco } from "src/helpers/utilities";

export const KitLancheAvulsaBody = ({ ...props }) => {
  const { solicitacao, item, index, filtros, labelData } = props;
  const log = solicitacao.logs[solicitacao.logs.length - 1];
  const [showDetail, setShowDetail] = useState(false);

  return [
    <tr className="table-body-items" key={index}>
      <td>
        {item.dre_iniciais} - {item.lote_nome}
      </td>
      {filtros.status && filtros.status === "RECEBIDAS" ? (
        <td>{item.terceirizada_nome}</td>
      ) : (
        <td>{item.escola_nome}</td>
      )}
      <td>{item.desc_doc}</td>
      <td className="text-center">
        {item.data_evento}{" "}
        {item.data_evento_fim && item.data_evento !== item.data_evento_fim
          ? `- ${item.data_evento_fim}`
          : ""}
      </td>
      <td className="text-center">
        {item.numero_alunos !== 0 ? item.numero_alunos : "-"}
      </td>
      <td className="text-center">
        <i
          className={`fas fa-${showDetail ? "angle-up" : "angle-down"}`}
          role="button"
          tabIndex={0}
          aria-expanded={showDetail}
          onClick={() => setShowDetail(!showDetail)}
          onKeyDown={(e) =>
            acionaComEnterOuEspaco(e, () => setShowDetail(!showDetail))
          }
        />
      </td>
    </tr>,
    showDetail && (
      <tr key={item.uuid}>
        <td colSpan={6}>
          <div className="container-fluid">
            <div className="row mt-3">
              <div className="col-3">
                <p>ID da Solicitação:</p>
                <p>
                  <b># {solicitacao.id_externo}</b>
                </p>
              </div>
              <div className="col-3">
                <p>Local do Passeio:</p>
                <p>
                  <b>{solicitacao.local}</b>
                </p>
              </div>
              <div className="col-3">
                <p>Evento/Passeio:</p>
                <p>
                  <b>{solicitacao.evento || "- -"}</b>
                </p>
              </div>
              <div className="col-3">
                <p>{labelData}:</p>
                <p>
                  <b>{log && log.criado_em.split(" ")[0]}</b>
                </p>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-3">
                <p>Tempo Previsto de Passeio:</p>
                <p>
                  <b>
                    {
                      solicitacao.solicitacao_kit_lanche
                        .tempo_passeio_explicacao
                    }
                  </b>
                </p>
              </div>
              <div className="col-3">
                <p>Opção Desejada:</p>
                <p>
                  <b>
                    {solicitacao.solicitacao_kit_lanche.kits
                      .map((kit) => kit.nome)
                      .join(", ")}
                  </b>
                </p>
              </div>
              <div className="col-3">
                <p>No Total de Kits:</p>
                <p>
                  <b>{solicitacao.quantidade_alimentacoes}</b>
                </p>
              </div>
              <div className="col-3" />
            </div>
            {solicitacao.solicitacao_kit_lanche.descricao &&
              solicitacao.solicitacao_kit_lanche.descricao !== "<p></p>" && (
                <div className="row">
                  <div className="col-12">
                    <p>Observação:</p>
                    <b>
                      <p
                        className="observacao-negrito"
                        dangerouslySetInnerHTML={{
                          __html: solicitacao.solicitacao_kit_lanche.descricao,
                        }}
                      />
                    </b>
                  </div>
                </div>
              )}
          </div>
        </td>
      </tr>
    ),
  ];
};
