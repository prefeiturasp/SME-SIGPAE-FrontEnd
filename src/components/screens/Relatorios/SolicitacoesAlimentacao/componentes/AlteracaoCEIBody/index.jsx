import React, { Fragment, useState } from "react";
import { acionaComEnterOuEspaco } from "src/helpers/utilities";

export const AlteracaoCEIBody = ({ ...props }) => {
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
                <p>Tipo de Alteração:</p>
                <p>
                  <b>{solicitacao.motivo.nome}</b>
                </p>
              </div>
              <div className="col-3">
                <p>Data(s) do Evento:</p>
                <p>
                  <b>{solicitacao.data}</b>
                </p>
              </div>
              <div className="col-3">
                <p>{labelData}</p>
                <p>
                  <b>{log && log.criado_em.split(" ")[0]}</b>
                </p>
              </div>
            </div>

            {solicitacao.substituicoes.map((substituicao, idx) => {
              const total = substituicao.faixas_etarias.reduce(function (
                acc,
                v,
              ) {
                return acc + (v.quantidade || v.quantidade_alunos);
              }, 0);
              const total_matriculados = substituicao.faixas_etarias.reduce(
                function (acc, v) {
                  return acc + (v.matriculados_quando_criado || 0);
                },
                0,
              );
              return (
                <Fragment key={idx}>
                  <div className="row mt-3">
                    <div className="col-12">
                      <label className="label-periodo-cei-cemei">
                        {substituicao.periodo_escolar.nome}
                      </label>
                    </div>
                  </div>
                  <div className="container-fluid pe-0">
                    <div className="row mt-3">
                      <div className="col-4">
                        <p>Alteração de Alimentação De:</p>
                        <p>
                          <b>
                            {substituicao.tipos_alimentacao_de
                              .map((ta) => ta.nome)
                              .join(", ")}
                          </b>
                        </p>
                      </div>
                      <div className="col-4">
                        <p>Alteração de Alimentação Para:</p>
                        <p>
                          <b>{substituicao.tipo_alimentacao_para.nome}</b>
                        </p>
                      </div>
                      <div className="col-4" />
                    </div>
                    <div className="row mt-3">
                      <div className="col-12">
                        <table className="table table-bordered table-items">
                          <thead>
                            <tr className="table-head-items">
                              <th className="col-8">Faixa Etária</th>
                              <th className="col-2 text-center">
                                Alunos Matriculados
                              </th>
                              <th className="col-2 text-center">Quantidade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {substituicao.faixas_etarias.map(
                              (faixa, idxFaixa) => {
                                return (
                                  <tr
                                    className="table-body-items"
                                    key={idxFaixa}
                                  >
                                    <td>{faixa.faixa_etaria.__str__}</td>
                                    <td className="text-center">
                                      {faixa.matriculados_quando_criado}
                                    </td>
                                    <td className="text-center">
                                      {faixa.quantidade}
                                    </td>
                                  </tr>
                                );
                              },
                            )}
                            <tr className="table-head-items">
                              <td>Total</td>
                              <td className="text-center">
                                {total_matriculados}
                              </td>
                              <td className="text-center">{total}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </Fragment>
              );
            })}
            {solicitacao.observacao !== "<p></p>" && (
              <div className="row mt-3">
                <div className="col-12">
                  <p>Observação:</p>
                  <p
                    className="observacao-negrito"
                    dangerouslySetInnerHTML={{
                      __html: solicitacao.observacao,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </td>
      </tr>
    ),
  ];
};
