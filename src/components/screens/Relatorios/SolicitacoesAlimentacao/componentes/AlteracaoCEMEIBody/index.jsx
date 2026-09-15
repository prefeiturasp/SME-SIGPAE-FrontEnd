import React, { Fragment, useState } from "react";
import { acionaComEnterOuEspaco } from "src/helpers/utilities";

export const AlteracaoCEMEIBody = ({ ...props }) => {
  const { solicitacao, item, index, filtros, labelData } = props;
  const log = solicitacao.logs[solicitacao.logs.length - 1];
  const [showDetail, setShowDetail] = useState(false);

  const unique = (arr) => [...new Set(arr)];

  const nomes_periodos = unique(
    solicitacao.substituicoes_cemei_cei_periodo_escolar
      .concat(solicitacao.substituicoes_cemei_emei_periodo_escolar)
      .map((qa) => qa.periodo_escolar.nome),
  );

  const ehDiaCancelado = (diaIntervalo) => {
    return diaIntervalo.cancelado || solicitacao.status === "ESCOLA_CANCELOU"
      ? "dia-cancelado"
      : "";
  };

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
        {solicitacao.data_final
          ? `${solicitacao.data_inicial} - ${solicitacao.data_final}`
          : solicitacao.alterar_dia}
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
            <div className="row mt-3" style={{ marginBottom: "-3em" }}>
              <div className="col-3">
                <p>ID da Solicitação:</p>
                <p>
                  <b># {solicitacao.id_externo}</b>
                </p>
              </div>
              <div className="col-3">
                <p>Tipo de Alteração:</p>
              </div>
              <div className="col-3">
                <p>Dia(s) de Alteração:</p>
              </div>
              <div className="col-3">
                <p>{labelData}</p>
                <p>
                  <b>{log && log.criado_em.split(" ")[0]}</b>
                </p>
              </div>
            </div>
            {solicitacao.datas_intervalo.map((data_intervalo, key) => {
              return (
                <div key={key} className="row">
                  <div className="offset-3 col-3">
                    <p>
                      <b className={`${ehDiaCancelado(data_intervalo)}`}>
                        {solicitacao.motivo.nome}
                      </b>
                    </p>
                  </div>
                  <div className="col-3">
                    <p>
                      <b className={`${ehDiaCancelado(data_intervalo)}`}>
                        {data_intervalo.data}
                      </b>
                    </p>
                  </div>
                </div>
              );
            })}
            {nomes_periodos.map((periodo, idx) => {
              const substituicoesCEI =
                solicitacao.substituicoes_cemei_cei_periodo_escolar.filter(
                  (s) => s.periodo_escolar.nome === periodo,
                );
              const substituicoesEMEI =
                solicitacao.substituicoes_cemei_emei_periodo_escolar.filter(
                  (s) => s.periodo_escolar.nome === periodo,
                );
              return (
                <Fragment key={idx}>
                  <div className="row mt-3">
                    <div className="col-12">
                      <label className="label-periodo-cei-cemei">
                        {periodo}
                      </label>
                    </div>
                  </div>
                  {substituicoesCEI.map((substituicaoCEI, idxCEI) => {
                    const total = substituicaoCEI.faixas_etarias.reduce(
                      function (acc, v) {
                        return acc + (v.quantidade || v.quantidade_alunos);
                      },
                      0,
                    );
                    const total_matriculados =
                      substituicaoCEI.faixas_etarias.reduce(function (acc, v) {
                        return acc + (v.matriculados_quando_criado || 0);
                      }, 0);
                    return (
                      <div className="container-fluid pe-0" key={idxCEI}>
                        <div className="row mt-3">
                          <div className="col-12">
                            <label className="label-periodo-cei-cemei">
                              Alunos CEI
                            </label>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-12">
                            <p>
                              Alteração do tipo de Alimentação de:{" "}
                              <b>
                                {substituicaoCEI.tipos_alimentacao_de
                                  .map((ta) => ta.nome)
                                  .join(", ")}
                              </b>
                            </p>
                          </div>
                          <div className="col-12">
                            <p>
                              Alteração do tipo de Alimentação para:{" "}
                              <b>
                                {substituicaoCEI.tipos_alimentacao_para
                                  .map((ta) => ta.nome)
                                  .join(", ")}
                              </b>
                            </p>
                          </div>
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
                                  <th className="col-2 text-center">
                                    Quantidade
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {substituicaoCEI.faixas_etarias.map(
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
                    );
                  })}
                  {substituicoesEMEI.map((substituicaoEMEI, idxEMEI) => {
                    return (
                      <div className="container-fluid pe-0" key={idxEMEI}>
                        <div className="row mt-3">
                          <div className="col-12">
                            <label className="label-periodo-cei-cemei">
                              Alunos EMEI
                            </label>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-12">
                            <p>
                              Alteração do tipo de Alimentação de:{" "}
                              <b>
                                {substituicaoEMEI.tipos_alimentacao_de
                                  .map((ta) => ta.nome)
                                  .join(", ")}
                              </b>
                            </p>
                          </div>
                          <div className="col-12">
                            <p>
                              Alteração do tipo de Alimentação de:{" "}
                              <b>
                                {substituicaoEMEI.tipos_alimentacao_para
                                  .map((ta) => ta.nome)
                                  .join(", ")}
                              </b>
                            </p>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-12">
                            <table className="table table-bordered table-items">
                              <thead>
                                <tr className="table-head-items">
                                  <th className="col-8">
                                    Alunos Matriculados:{" "}
                                    {
                                      substituicaoEMEI.matriculados_quando_criado
                                    }
                                  </th>
                                  <th className="col-4 text-center">
                                    Quantidade: {substituicaoEMEI.qtd_alunos}
                                  </th>
                                </tr>
                              </thead>
                              <tbody />
                            </table>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
            {solicitacao.datas_intervalo.find(
              (data_intervalo) => data_intervalo.cancelado_justificativa,
            ) && (
              <>
                <hr />
                <p>
                  <strong>Histórico de cancelamento</strong>
                  {solicitacao.datas_intervalo
                    .filter(
                      (data_intervalo) =>
                        data_intervalo.cancelado_justificativa,
                    )
                    .map((data_intervalo, key) => {
                      return (
                        <div className="cancelado_justificativa" key={key}>
                          {data_intervalo.data}
                          {" - "}
                          justificativa:{" "}
                          {data_intervalo.cancelado_justificativa}
                        </div>
                      );
                    })}
                </p>
              </>
            )}
          </div>
        </td>
      </tr>
    ),
  ];
};
