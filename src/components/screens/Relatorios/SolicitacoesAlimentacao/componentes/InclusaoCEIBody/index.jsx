import React, { useState, useEffect, Fragment } from "react";
import HTTP_STATUS from "http-status-codes";
import { getVinculosTipoAlimentacaoPorEscola } from "src/services/cadastroTipoAlimentacao.service";

export const InclusaoCEIBody = ({ ...props }) => {
  const { solicitacao, item, index, filtros, labelData } = props;
  const [vinculosAlimentacao, setVinculosAlimentacao] = useState(undefined);
  const log = solicitacao.logs[solicitacao.logs.length - 1];
  const [showDetail, setShowDetail] = useState(false);

  const unique = (arr) => [...new Set(arr)];

  const nomes_periodos = solicitacao.periodo_escolar
    ? [solicitacao.periodo_escolar.nome]
    : unique(
        solicitacao.quantidade_alunos_por_faixas_etarias.map(
          (qa) => qa.periodo.nome
        )
      );

  const periodosExternos = unique(
    solicitacao.quantidade_alunos_por_faixas_etarias.map(
      (qa) => qa.periodo_externo.nome
    )
  );

  const getVinculosAlimentacao = async () => {
    const escola_uuid = solicitacao.escola.uuid;
    const response = await getVinculosTipoAlimentacaoPorEscola(escola_uuid);
    if (response.status === HTTP_STATUS.OK) {
      setVinculosAlimentacao(response.data.results);
    }
  };

  useEffect(() => {
    getVinculosAlimentacao();
  }, []);

  const ehDiaCancelado = (dia_motivo_inclusao) => {
    return dia_motivo_inclusao.cancelado ||
      solicitacao.status === "ESCOLA_CANCELOU"
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
      <td className="text-center">{solicitacao.datas}</td>
      <td className="text-center">
        {item.numero_alunos !== 0 ? item.numero_alunos : "-"}
      </td>
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
              </div>
              <div className="col-3">
                <p>Motivo:</p>
              </div>
              <div className="col-3">
                <p>Dia(s) de Inclusão:</p>
              </div>
              <div className="col-3">
                <p>{labelData}</p>
              </div>
            </div>
            {solicitacao.dias_motivos_da_inclusao_cei.map(
              (dia_motivo_inclusao, idx) => {
                return (
                  <div className="row mt-3" key={idx}>
                    {idx === 0 ? (
                      <div className="col-3">
                        <p>
                          <b># {solicitacao.id_externo}</b>
                        </p>
                      </div>
                    ) : (
                      <div className="col-3" />
                    )}
                    <div className="col-3">
                      <p>
                        <b className={`${ehDiaCancelado(dia_motivo_inclusao)}`}>
                          {dia_motivo_inclusao.motivo.nome}
                        </b>
                      </p>
                    </div>
                    <div className="col-3">
                      <p>
                        <b className={`${ehDiaCancelado(dia_motivo_inclusao)}`}>
                          {dia_motivo_inclusao.data}
                        </b>
                      </p>
                    </div>
                    {idx === 0 ? (
                      <div className="col-3">
                        <p>
                          <b>{log && log.criado_em.split(" ")[0]}</b>
                        </p>
                      </div>
                    ) : (
                      <div className="col-3" />
                    )}
                  </div>
                );
              }
            )}
            {vinculosAlimentacao &&
              periodosExternos.map((periodoExt, index) => {
                return nomes_periodos.map((periodo, idx) => {
                  let faixas_etarias = [];
                  if (solicitacao.periodo_escolar) {
                    faixas_etarias =
                      solicitacao.quantidade_alunos_por_faixas_etarias;
                  } else {
                    faixas_etarias =
                      solicitacao.quantidade_alunos_por_faixas_etarias.filter(
                        (qpf) =>
                          qpf.periodo.nome === periodo &&
                          qpf.periodo_externo.nome === periodoExt
                      );
                  }
                  const alimentosFormatados = vinculosAlimentacao
                    .find((v) => v.periodo_escolar.nome === periodoExt)
                    .tipos_alimentacao.map((ta) => ta.nome)
                    .join(", ");
                  const total = faixas_etarias.reduce(function (acc, v) {
                    return acc + (v.quantidade || v.quantidade_alunos);
                  }, 0);
                  const total_matriculados = faixas_etarias.reduce(function (
                    acc,
                    v
                  ) {
                    return acc + (v.matriculados_quando_criado || 0);
                  },
                  0);
                  return (
                    <Fragment key={idx}>
                      {(periodoExt !== "INTEGRAL" && periodoExt === periodo) ||
                      (periodoExt === "INTEGRAL" &&
                        periodo === nomes_periodos[0]) ? (
                        <div key={index} className="row">
                          <div className="col-12">
                            <label className="label-periodo-cei-cemei">
                              {periodoExt}
                            </label>
                          </div>
                        </div>
                      ) : null}
                      {periodoExt === periodo || periodoExt === "INTEGRAL" ? (
                        <>
                          {periodoExt !== periodo || periodo === "INTEGRAL" ? (
                            <div className="row">
                              <div className="col-12">
                                <div className="container-fluid pe-0">
                                  <label className="label-periodo-cei-cemei">
                                    {periodo}
                                  </label>
                                </div>
                              </div>
                            </div>
                          ) : null}
                          <div className="row mt-3">
                            <div className="col-12">
                              <div className="container-fluid pe-0">
                                <p>
                                  Tipos de Inclusão de Alimentação:{" "}
                                  <b>{alimentosFormatados}</b>
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-12">
                              <div className="container-fluid pe-0">
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
                                    {faixas_etarias.map((faixa, idxFaixa) => {
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
                                            {faixa.quantidade_alunos}
                                          </td>
                                        </tr>
                                      );
                                    })}
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
                        </>
                      ) : null}
                    </Fragment>
                  );
                });
              })}
            {solicitacao.dias_motivos_da_inclusao_cei.find(
              (inclusao) => inclusao.cancelado_justificativa
            ) && (
              <>
                <hr />
                <p>
                  <strong>Histórico de cancelamento</strong>
                  {solicitacao.dias_motivos_da_inclusao_cei
                    .filter((inclusao) => inclusao.cancelado_justificativa)
                    .map((inclusao, key) => {
                      return (
                        <div className="cancelado_justificativa" key={key}>
                          {inclusao.data}
                          {" - "}
                          justificativa: {inclusao.cancelado_justificativa}
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
