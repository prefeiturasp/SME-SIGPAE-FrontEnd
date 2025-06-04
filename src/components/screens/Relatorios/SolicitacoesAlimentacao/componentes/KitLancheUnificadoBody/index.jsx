import React, { useState } from "react";
import { usuarioEhEscolaTerceirizadaQualquerPerfil } from "src/helpers/utilities";

export const KitLancheUnificadoBody = ({ ...props }) => {
  const { solicitacao, item, index, filtros, labelData } = props;
  const log = solicitacao.logs[solicitacao.logs.length - 1];
  const [showDetail, setShowDetail] = useState(false);

  return [
    <tr className="table-body-items" key={index}>
      <td>
        {item.dre_iniciais} - {item.lote_nome}
      </td>
      {filtros.status === "RECEBIDAS" && <td>Várias Terceirizadas</td>}
      {filtros.status !== "RECEBIDAS" &&
        !usuarioEhEscolaTerceirizadaQualquerPerfil() && (
          <td>
            {solicitacao.escolas_quantidades.length > 1
              ? `${solicitacao.escolas_quantidades.length} Escolas`
              : `${solicitacao.escolas_quantidades[0].escola.nome}`}
          </td>
        )}
      {filtros.status !== "RECEBIDAS" &&
        usuarioEhEscolaTerceirizadaQualquerPerfil() && (
          <td>{solicitacao.escolas_quantidades[0].escola.nome}</td>
        )}
      <td>{item.desc_doc}</td>
      <td className="text-center">
        {item.data_evento}{" "}
        {item.data_evento_fim && item.data_evento !== item.data_evento_fim
          ? `- ${item.data_evento_fim}`
          : ""}
      </td>
      {!usuarioEhEscolaTerceirizadaQualquerPerfil() && (
        <td className="text-center">{item.numero_alunos || "-"}</td>
      )}
      {usuarioEhEscolaTerceirizadaQualquerPerfil() && (
        <td className="text-center">
          {solicitacao.escolas_quantidades[0].quantidade_alunos || "-"}
        </td>
      )}
      <td className="text-center">
        <i
          className={`fas fa-${showDetail ? "angle-up" : "angle-down"}`}
          onClick={() => setShowDetail(!showDetail)}
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
                <p>No Total de Kits:</p>
                <p>
                  <b>{solicitacao.total_kit_lanche}</b>
                </p>
              </div>
              <div className="col-3">
                <p>{labelData}</p>
                <p>
                  <b>{log && log.criado_em.split(" ")[0]}</b>
                </p>
              </div>
              <div className="col-12">
                <p>Data do Evento:</p>
                <p>
                  <b>{solicitacao.data}</b>
                </p>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-12">
                <table className="table table-bordered table-items">
                  <thead>
                    <tr className="table-head-items">
                      <th className="col-1">Codigo</th>
                      <th className="col-4">Unidade Escola</th>
                      <th className="col-2 text-center">Quantidade</th>
                      <th className="col-2 text-center">
                        Tempo previsto de passeio
                      </th>
                      <th className="col-2 text-center">Opção desejada</th>
                      <th className="col-1 text-center">Total Kits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {solicitacao.escolas_quantidades.map(
                      (escola_quantidade, idxEscolaQuantidade) => {
                        return (
                          <tr
                            className="table-body-items"
                            key={idxEscolaQuantidade}
                          >
                            <td>{escola_quantidade.escola.codigo_eol}</td>
                            <td>{escola_quantidade.escola.nome}</td>
                            <td className="text-center">
                              {escola_quantidade.quantidade_alunos}
                            </td>
                            <td className="text-center">
                              {escola_quantidade.tempo_passeio_explicacao}
                            </td>
                            <td className="text-center">
                              {escola_quantidade.kits
                                .map((kit) => kit.nome)
                                .join(", ")}
                            </td>
                            <td className="text-center">
                              {escola_quantidade.quantidade_alunos *
                                escola_quantidade.kits.length}
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
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
