import React, { useState, useEffect, Fragment } from "react";
import HTTP_STATUS from "http-status-codes";
import {
  getVinculosTipoAlimentacaoPorEscola,
  getVinculosTipoAlimentacaoMotivoInclusaoEspecifico,
} from "src/services/cadastroTipoAlimentacao.service";

export const InclusoesCEMEI = ({ inclusaoDeAlimentacao }) => {
  const [vinculosAlimentacao, setVinculosAlimentacao] = useState(null);
  const [vinculosMotivoEspecifico, setVinculosMotivoEspecifico] =
    useState(null);

  const unique = (arr) => [...new Set(arr)];

  const temMotivoEspecifico =
    inclusaoDeAlimentacao.dias_motivos_da_inclusao_cemei.some(
      (inc) => inc.motivo.nome === "Evento Específico"
    );

  const getVinculosMotivoEspecificoCEMEIAsync = async (vinculosAlimentacao) => {
    const tipo_unidade_escolar_iniciais =
      inclusaoDeAlimentacao.escola.tipo_unidade.iniciais;
    const response = await getVinculosTipoAlimentacaoMotivoInclusaoEspecifico({
      tipo_unidade_escolar_iniciais,
    });
    if (response.status === HTTP_STATUS.OK) {
      const vincuosNormaisEMEI = vinculosAlimentacao.filter(
        (vinculo) => vinculo.tipo_unidade_escolar.iniciais === "EMEI"
      );

      let vinculosEspecificos = response.data.map((vinculo) => {
        let periodo = vinculo.periodo_escolar;
        let tipos_de_alimentacao = vinculo.tipos_alimentacao;

        let vinculoNormal = vincuosNormaisEMEI.find(
          (obj) => obj.periodo_escolar.nome === periodo
        );
        if (!vinculoNormal) {
          vinculoNormal = vincuosNormaisEMEI.find(
            (obj) => obj.periodo_escolar.nome === "INTEGRAL"
          );
          tipos_de_alimentacao = response.data.find(
            (p) => p.periodo_escolar.nome === "INTEGRAL"
          ).tipos_alimentacao;
          vinculo.tipos_alimentacao = tipos_de_alimentacao;
        }
        vinculo.tipo_unidade_escolar = vinculoNormal.tipo_unidade_escolar;
        return vinculo;
      });
      vinculosEspecificos = vinculosEspecificos.sort((obj1, obj2) =>
        obj1.periodo_escolar.posicao > obj2.periodo_escolar.posicao ? 1 : -1
      );
      setVinculosMotivoEspecifico(vinculosEspecificos);
    }
  };

  const nomes_periodos = unique(
    inclusaoDeAlimentacao.quantidade_alunos_cei_da_inclusao_cemei
      .concat(inclusaoDeAlimentacao.quantidade_alunos_emei_da_inclusao_cemei)
      .map((qa) => qa.periodo_escolar.nome)
  );

  const getVinculosAlimentacao = async () => {
    const escola_uuid = inclusaoDeAlimentacao.escola.uuid;
    const response = await getVinculosTipoAlimentacaoPorEscola(escola_uuid);
    if (response.status === HTTP_STATUS.OK) {
      setVinculosAlimentacao(response.data.results);
      await getVinculosMotivoEspecificoCEMEIAsync(response.data.results);
    }
  };

  useEffect(() => {
    getVinculosAlimentacao();
  }, []);

  return (
    <>
      {vinculosAlimentacao &&
        !temMotivoEspecifico &&
        nomes_periodos.map((periodo, idx) => {
          const vinculosCEI = vinculosAlimentacao.find(
            (vinc) =>
              vinc.periodo_escolar.nome === periodo &&
              vinc.tipo_unidade_escolar.iniciais === "CEI DIRET"
          );
          const tiposAlimentacaoCEI = vinculosCEI.tipos_alimentacao
            .map((ta) => ta.nome)
            .join(", ");
          const vinculosEMEI = vinculosAlimentacao.find(
            (vinc) =>
              vinc.periodo_escolar.nome === periodo &&
              vinc.tipo_unidade_escolar.iniciais === "EMEI"
          );
          const tiposAlimentacaoEMEI =
            inclusaoDeAlimentacao.quantidade_alunos_emei_da_inclusao_cemei.find(
              (q) => q.periodo_escolar.nome === periodo
            )?.tipos_alimentacao?.length
              ? inclusaoDeAlimentacao.quantidade_alunos_emei_da_inclusao_cemei
                  .find((q) => q.periodo_escolar.nome === periodo)
                  .tipos_alimentacao.map((alimentacao) => alimentacao.nome)
                  .join(", ")
              : vinculosEMEI.tipos_alimentacao.map((ta) => ta.nome).join(", ");
          const faixasCEI =
            inclusaoDeAlimentacao.quantidade_alunos_cei_da_inclusao_cemei.filter(
              (qa) => qa.periodo_escolar.nome === periodo
            );
          const faixasEMEI =
            inclusaoDeAlimentacao.quantidade_alunos_emei_da_inclusao_cemei.filter(
              (qa) => qa.periodo_escolar.nome === periodo
            );
          const total = faixasCEI.reduce(function (acc, v) {
            return acc + (v.quantidade || v.quantidade_alunos);
          }, 0);
          const total_matriculados = faixasCEI.reduce(function (acc, v) {
            return acc + (v.matriculados_quando_criado || 0);
          }, 0);
          return (
            <Fragment key={idx}>
              <div className="row">
                <div className="col-12">
                  <label
                    style={{
                      background: "#fff7cb",
                      border: "1px solid #ffbb8a",
                      borderRadius: "5px",
                      margin: "1% 0px",
                      width: "100%",
                      padding: "8px 15px",
                      height: "40px",
                    }}
                  >
                    {periodo}
                  </label>
                </div>
              </div>
              {faixasCEI.length ? (
                <div className="row">
                  <div className="col-12">
                    <div className="container-fluid pe-0">
                      <label
                        style={{
                          background: "#eaffe3",
                          border: "1px solid #79cf91",
                          borderRadius: "5px",
                          margin: "1% 0px",
                          width: "100%",
                          padding: "8px 15px",
                          height: "40px",
                        }}
                      >
                        Alunos CEI
                      </label>
                    </div>
                  </div>
                  <div className="col-12 mt-3">
                    <div className="container-fluid pe-0 ms-4">
                      <p>
                        Tipos de Inclusão de Alimentação:{" "}
                        <b
                          style={{
                            color: "#0c6b45",
                          }}
                        >
                          {tiposAlimentacaoCEI}
                        </b>
                      </p>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="container-fluid pe-0">
                      <table className="table table-bordered table-items">
                        <thead>
                          <tr className="row table-head-items">
                            <th className="col-8">Faixa Etária</th>
                            <th className="col-2 text-center">
                              Alunos Matriculados
                            </th>
                            <th className="col-2 text-center">Quantidade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {faixasCEI.map((faixa, idxFaixa) => {
                            return (
                              <tr
                                className="row table-body-items"
                                key={idxFaixa}
                              >
                                <td className="col-8">
                                  {faixa.faixa_etaria.__str__}
                                </td>
                                <td className="col-2 text-center">
                                  {faixa.matriculados_quando_criado}
                                </td>
                                <td className="col-2 text-center">
                                  {faixa.quantidade_alunos}
                                </td>
                              </tr>
                            );
                          })}
                          <tr className="row table-head-items">
                            <td className="col-8">Total</td>
                            <td className="col-2 text-center">
                              {total_matriculados}
                            </td>
                            <td className="col-2 text-center">{total}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
              {faixasEMEI.length ? (
                <div className="row">
                  <div className="col-12">
                    <div className="container-fluid pe-0">
                      <label
                        style={{
                          background: "#eaffe3",
                          border: "1px solid #79cf91",
                          borderRadius: "5px",
                          margin: "1% 0px",
                          width: "100%",
                          padding: "8px 15px",
                          height: "40px",
                        }}
                      >
                        Alunos EMEI
                      </label>
                    </div>
                  </div>
                  <div className="col-12 mt-3">
                    <div className="container-fluid pe-0 ms-4">
                      <p>
                        Tipos de Inclusão de Alimentação:{" "}
                        <b
                          style={{
                            color: "#0c6b45",
                          }}
                        >
                          {tiposAlimentacaoEMEI}
                        </b>
                      </p>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="container-fluid pe-0">
                      <table className="table table-bordered table-items">
                        <thead>
                          {faixasEMEI.map((faixa, idxFaixa) => {
                            return (
                              <tr
                                className="row table-head-items"
                                key={idxFaixa}
                              >
                                <th className="col-8">
                                  Alunos Matriculados:{" "}
                                  {faixa.matriculados_quando_criado}
                                </th>
                                <th className="col-4 text-center">
                                  Quantidade: {faixa.quantidade_alunos}
                                </th>
                              </tr>
                            );
                          })}
                        </thead>
                        <tbody />
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </Fragment>
          );
        })}
      {vinculosMotivoEspecifico &&
        temMotivoEspecifico &&
        nomes_periodos.map((periodo, idx) => {
          const vinculosEMEI = vinculosMotivoEspecifico.find(
            (vinc) =>
              vinc.periodo_escolar.nome === periodo &&
              vinc.tipo_unidade_escolar.iniciais === "EMEI"
          );
          const tiposAlimentacaoEMEI =
            inclusaoDeAlimentacao.quantidade_alunos_emei_da_inclusao_cemei.find(
              (q) => q.periodo_escolar.nome === periodo
            )?.tipos_alimentacao?.length
              ? inclusaoDeAlimentacao.quantidade_alunos_emei_da_inclusao_cemei
                  .find((q) => q.periodo_escolar.nome === periodo)
                  .tipos_alimentacao.map((alimentacao) => alimentacao.nome)
                  .join(", ")
              : vinculosEMEI.tipos_alimentacao.map((ta) => ta.nome).join(", ");

          const faixasEMEI =
            inclusaoDeAlimentacao.quantidade_alunos_emei_da_inclusao_cemei.filter(
              (qa) => qa.periodo_escolar.nome === periodo
            );
          return (
            <Fragment key={idx}>
              {faixasEMEI.length ? (
                <div className="row">
                  <div className="col-12">
                    <div className="container-fluid pe-0">
                      <label className="label-periodo-cei-cemei">
                        Alunos EMEI
                      </label>
                    </div>
                  </div>
                  <div className="col-12 mt-3">
                    <div className=" container-fluid pe-0">
                      <p>
                        Tipos de Inclusão de Alimentação:{" "}
                        <b>{tiposAlimentacaoEMEI}</b>
                      </p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className=" container-fluid pe-0">
                      <table className="table table-bordered table-items">
                        <thead>
                          {faixasEMEI.map((faixa, idxFaixa) => {
                            return (
                              <tr className="table-head-items" key={idxFaixa}>
                                <th className="col-4 text-center">
                                  Quantidade: {faixa.quantidade_alunos}
                                </th>
                              </tr>
                            );
                          })}
                        </thead>
                        <tbody />
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </Fragment>
          );
        })}
    </>
  );
};

export default InclusoesCEMEI;
