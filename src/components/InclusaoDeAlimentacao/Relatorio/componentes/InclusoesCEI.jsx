import React, { useState, useEffect, Fragment } from "react";
import HTTP_STATUS from "http-status-codes";
import TabelaFaixaEtaria from "src/components/Shareable/TabelaFaixaEtaria";
import { getVinculosTipoAlimentacaoPorEscola } from "src/services/cadastroTipoAlimentacao.service";
import { formataPeriodos } from "./helper";

export const InclusoesCEI = ({ inclusaoDeAlimentacao }) => {
  const [vinculosAlimentacao, setVinculosAlimentacao] = useState(null);

  const unique = (arr) => [...new Set(arr)];

  const nomes_periodos = unique(
    inclusaoDeAlimentacao.quantidade_alunos_por_faixas_etarias
      .filter((qa) => qa.periodo_externo.nome === "INTEGRAL")
      .map((qa) => qa.periodo.nome)
  );

  const nomes_periodos_externos = unique(
    inclusaoDeAlimentacao.quantidade_alunos_por_faixas_etarias.map(
      (qa) => qa.periodo_externo.nome
    )
  );

  const periodos_formatados = formataPeriodos(nomes_periodos);
  const periodos_externos_formatados = formataPeriodos(nomes_periodos_externos);

  const faixasEtariasPorPeriodo = periodos_externos_formatados.map(
    (periodo) => {
      if (periodo.nome === "INTEGRAL") {
        periodo["periodos"] = [];
        periodos_formatados.forEach((p) => {
          let faixas =
            inclusaoDeAlimentacao.quantidade_alunos_por_faixas_etarias.filter(
              (qa) =>
                qa.periodo.nome === p.nome &&
                qa.periodo_externo.nome === periodo.nome
            );
          periodo["periodos"].push({
            periodo: p,
            faixas: faixas,
          });
        });
      } else {
        periodo["faixas"] =
          inclusaoDeAlimentacao.quantidade_alunos_por_faixas_etarias.filter(
            (qa) =>
              qa.periodo.nome === periodo.nome &&
              qa.periodo_externo.nome === periodo.nome
          );
      }
      return periodo;
    }
  );

  const getVinculosAlimentacao = async () => {
    const escola_uuid = inclusaoDeAlimentacao.escola.uuid;
    const response = await getVinculosTipoAlimentacaoPorEscola(escola_uuid);
    if (response.status === HTTP_STATUS.OK) {
      setVinculosAlimentacao(response.data.results);
    }
  };

  const alimentosFormatados = (nome_periodo) => {
    const vinculo = vinculosAlimentacao.find(
      (v) => v.periodo_escolar.nome === nome_periodo
    );

    return vinculo
      ? vinculo.tipos_alimentacao.map((ta) => ta.nome).join(", ")
      : "Nenhum tipo de alimentação definido";
  };

  useEffect(() => {
    getVinculosAlimentacao();
  }, []);

  return vinculosAlimentacao ? (
    faixasEtariasPorPeriodo.map((faixa_por_periodo, fp_key) => {
      return (
        <Fragment key={fp_key}>
          <div className="row" key={`${fp_key}-0`}>
            <div className="col-12">
              <label
                style={{
                  background: "#D4FFE0",
                  border: `1px solid #DADADA`,
                  borderRadius: "5px",
                  margin: "1% 0px",
                  width: "100%",
                  padding: "8px 15px",
                  height: "40px",
                }}
              >
                {faixa_por_periodo.nome}
              </label>
            </div>
          </div>
          {faixa_por_periodo.nome === "INTEGRAL" ? (
            faixa_por_periodo.periodos.map(
              (periodo_interno, periodo_interno_key) => {
                return (
                  <div key={periodo_interno_key} className="row">
                    <div className="col-12">
                      <div className="container-fluid pe-0">
                        <label
                          style={{
                            background: periodo_interno.periodo.background,
                            border: periodo_interno.periodo.borderColor,
                            borderRadius: "5px",
                            margin: "1% 0px",
                            width: "100%",
                            padding: "8px 15px",
                            height: "40px",
                          }}
                        >
                          {periodo_interno.periodo.nome}
                        </label>
                      </div>
                    </div>
                    <div className="col-12 mt-3">
                      <div className="container-fluid pe-0">
                        <span>
                          Tipos de alimentação no período{" "}
                          {periodo_interno.periodo.nome.toLowerCase()}:{" "}
                          <b>
                            {alimentosFormatados(periodo_interno.periodo.nome)}
                          </b>
                        </span>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="container-fluid pe-0">
                        <TabelaFaixaEtaria
                          key={periodo_interno_key}
                          faixas={periodo_interno.faixas}
                        />
                      </div>
                    </div>
                  </div>
                );
              }
            )
          ) : (
            <div key={`${fp_key}-1`} className="row">
              <div className="col-12 mt-3">
                <span>
                  Tipos de alimentação no período{" "}
                  {faixa_por_periodo.nome.toLowerCase()}:{" "}
                  <b>{alimentosFormatados(faixa_por_periodo.nome)}</b>
                </span>
              </div>
              <div className="col-12">
                <TabelaFaixaEtaria
                  key={`${fp_key}-1`}
                  faixas={faixa_por_periodo.faixas}
                />
              </div>
            </div>
          )}
        </Fragment>
      );
    })
  ) : (
    <></>
  );
};

export default InclusoesCEI;
