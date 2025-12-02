import React, { Fragment } from "react";
import { DetalhesCEIouCEMEI } from "../DetalhesCEIouCEMEI";
import { deepCopy, usuarioEhDRE } from "src/helpers/utilities";
import { formataNome, formataPeriodoEscolar } from "../../helpers";
import { Tooltip } from "antd";

export const TabelaResultado = ({ ...props }) => {
  const { resultado, faixasEtarias, showPeridosFaixas, setShowPeriodosFaixas } =
    props;

  const changeToActive = (index) => {
    let lista = deepCopy(showPeridosFaixas);
    lista[index].active = !lista[index].active;
    setShowPeriodosFaixas(lista);
  };

  return (
    <Fragment>
      <div className="row mt-3">
        <div className="col-5">
          <p className="titulo-grid-alunos-matriculados">
            Relação de alunos matriculados
          </p>
        </div>
        <div className="col-7 text-end">
          <p className="helper-grid-alunos-matriculados">
            <i className="fa fa-info-circle me-2" />
            Veja o nome da Unid. Educacional passando o mouse sobre o nome.
          </p>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-12">
          <table className="table table-bordered table-items">
            <thead>
              <tr className="table-head-items">
                {!usuarioEhDRE() && <th className="col-3">DRE</th>}
                <th className={`${usuarioEhDRE() ? "col-2" : "col-1"}`}>
                  Lote
                </th>
                <th className={`${usuarioEhDRE() ? "col-2" : "col-1"}`}>
                  Tipo de unid.
                </th>
                <th className="col-3">Unid. educacional</th>
                <th
                  className={`${
                    usuarioEhDRE() ? "col-2" : "col-1"
                  } text-center`}
                >
                  Tipo de turma
                </th>
                <th className="col-1 text-center">Período</th>
                <th className="col-1 text-center">Matriculados</th>
                <th className="col-1" />
              </tr>
            </thead>
            <tbody>
              {resultado.map((item, index) => {
                let totalMatriculados = item.quantidade_alunos;
                if (item.alunos_por_faixa_etaria && item.escola.exibir_faixas) {
                  totalMatriculados = Object.values(
                    item.alunos_por_faixa_etaria,
                  ).reduce((total, value) => {
                    return total + value;
                  }, 0);
                }
                return (
                  <Fragment key={index}>
                    <tr className="table-body-items" key={index}>
                      {!usuarioEhDRE() && (
                        <td>
                          {item.escola.diretoria_regional &&
                            item.escola.diretoria_regional.nome}
                        </td>
                      )}
                      <td>{item.escola.lote && item.escola.lote.nome}</td>
                      <td>
                        {item.escola.tipo_unidade &&
                          item.escola.tipo_unidade.iniciais}
                      </td>
                      <td>
                        <Tooltip
                          color="#42474a"
                          overlayStyle={{
                            maxWidth: "320px",
                            fontSize: "12px",
                            fontWeight: "700",
                          }}
                          title={item.escola.nome}
                        >
                          {formataNome(item.escola.nome)}
                        </Tooltip>
                      </td>
                      <td className="text-center">{item.tipo_turma}</td>
                      <td className="text-center">
                        {formataPeriodoEscolar(
                          item.escola,
                          item.periodo_escolar.nome,
                        )}
                      </td>
                      <td className="text-center">{totalMatriculados}</td>
                      <td className="text-center">
                        {(item.escola.eh_cei || item.escola.eh_cemei) &&
                          item.alunos_por_faixa_etaria && (
                            <i
                              data-testid={`icone-faixas-etarias-${index}`}
                              className={`fas fa-${
                                showPeridosFaixas[index] &&
                                showPeridosFaixas[index].active
                                  ? "angle-up"
                                  : "angle-down"
                              }`}
                              onClick={() => changeToActive(index)}
                            />
                          )}
                      </td>
                    </tr>
                    {showPeridosFaixas[index] &&
                      showPeridosFaixas[index].active && (
                        <DetalhesCEIouCEMEI
                          faixasEtarias={faixasEtarias}
                          item={item}
                          totalMatriculados={totalMatriculados}
                        />
                      )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
};
