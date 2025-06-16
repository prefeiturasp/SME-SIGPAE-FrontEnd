import { maxValue, naoPodeSerZero } from "src/helpers/fieldValidators";
import { composeValidators } from "src/helpers/utilities";
import React, { Component } from "react";

import { Field } from "redux-form";

import { faixaToString } from "../../../helpers/faixasEtarias";
import InputText from "../Input/InputText";
import "./style.scss";

export default class TabelaQuantidadePorFaixaEtaria extends Component {
  defaultProps = {
    escondeTotalAlunos: false,
  };
  render() {
    const { alunosPorFaixaEtaria, escondeTotalAlunos, totalSelecionados } =
      this.props;
    let totalAlunos = 0;
    Object.values(alunosPorFaixaEtaria).forEach(
      (v) => (totalAlunos += v.count)
    );
    return (
      <div>
        <table
          className={`table tabela-substituicao ${
            escondeTotalAlunos ? "tabela-substituicao-parcial" : ""
          }`}
        >
          <thead className="thead-light">
            <tr>
              <th>Faixa Etária</th>
              {!escondeTotalAlunos && <th>Alunos Matriculados</th>}
              <th>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {alunosPorFaixaEtaria.map((faixa, key) => (
              <tr key={key}>
                <td>{faixaToString(faixa.faixa_etaria)}</td>
                {!escondeTotalAlunos && <td>{faixa.count}</td>}
                <td>
                  <Field
                    component={InputText}
                    name={`faixas_etarias.${faixa.faixa_etaria.uuid}`}
                    type="number"
                    validate={composeValidators(
                      naoPodeSerZero,
                      maxValue(faixa.count)
                    )}
                    step="1"
                    min={0}
                    max={parseInt(faixa.count)}
                  />
                </td>
              </tr>
            ))}
            <tr>
              <th>Total{" >>"}</th>
              {!escondeTotalAlunos && <th>{totalAlunos}</th>}
              <th>{totalSelecionados}</th>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
