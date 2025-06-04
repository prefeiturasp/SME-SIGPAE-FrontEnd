import React, { Component } from "react";
import { Field } from "redux-form";
import "./style.scss";
import InputErroMensagem from "../../Input/InputErroMensagem";
import { escolaEhCei } from "src/helpers/utilities";

export class TempoPasseio extends Component {
  render() {
    const { mostrarExplicacao, nameTempoPasseio, onTempoPasseioChanged, meta } =
      this.props;
    const ehCei = escolaEhCei();
    return (
      <div className="tour-time">
        <p className="label">Tempo previsto do passeio</p>
        <div className="d-inline-flex">
          <label className="container-radio">
            até 4 horas (1 Kit)
            <Field
              component={"input"}
              onChange={onTempoPasseioChanged}
              type="radio"
              value="0"
              data-cy="radio-4h"
              name={nameTempoPasseio}
            />
            <span className="checkmark" />
          </label>
          <label className="container-radio">
            de 5 a 7 horas (2 Kits)
            <Field
              component={"input"}
              onChange={onTempoPasseioChanged}
              type="radio"
              value="1"
              data-cy="radio-5-7h"
              name={nameTempoPasseio}
            />
            <span className="checkmark" />
          </label>
          {!ehCei && (
            <label className="container-radio">
              8 horas ou mais (3 Kits)
              <Field
                component={"input"}
                onChange={onTempoPasseioChanged}
                type="radio"
                value="2"
                data-cy="radio-8h"
                name={nameTempoPasseio}
              />
              <span className="checkmark" />
            </label>
          )}
        </div>
        {mostrarExplicacao && (
          <div className="row">
            <div className="col-12">
              <div className="explanation border rounded mt-3 p-3">
                <label>
                  <b>Até 4 horas:</b> 1 Kit lanche/aluno: Escolher 1 Kit entre
                  os modelos estabelecidos contratualmente;
                </label>
                <br />
                <label>
                  <b>De 5 a 7 horas:</b> 2 Kit lanche/aluno: Escolher 2 Kits
                  distintos entre os modelos estabelecidos contratualmente;
                </label>
                {!ehCei && (
                  <>
                    <br />
                    <label>
                      <b>8 horas ou mais:</b> 3 Kit lanche/aluno: Escolher 3
                      Kits distintos entre os modelos estabelecidos
                      contratualmente;
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        <InputErroMensagem meta={meta} />
      </div>
    );
  }
}
