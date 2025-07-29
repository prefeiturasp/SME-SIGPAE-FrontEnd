import React, { Component } from "react";
import { Field } from "redux-form";
import "./style.scss";

export class CardKit extends Component {
  render() {
    const { nome, uuid, descricao } = this.props.kitLanche;
    const {
      checked,
      kitsChecked,
      onCardChange,
      nomeKitsLanche,
      tempoPasseio,
      esconderDetalhamentoKits,
      numeroKit,
    } = this.props;
    const disabled =
      (!checked &&
        kitsChecked.length !== 0 &&
        !kitsChecked.includes(uuid) &&
        parseInt(tempoPasseio) === kitsChecked.length - 1) ||
      (tempoPasseio === "" &&
        (kitsChecked.length === 0 || !kitsChecked.includes(uuid)));
    return (
      <div
        className={`card meal-kit
        ${checked && "checked"}
        ${disabled && "disabled"}
        ${esconderDetalhamentoKits && "minor-height"} mb-3`}
      >
        <div className="card-body">
          <div className="card-title">
            <span>{nome}</span>
            <label className="container-checkbox">
              <Field
                checked={checked}
                component={"input"}
                disabled={disabled}
                onChange={() => onCardChange(uuid)}
                type="checkbox"
                name={nomeKitsLanche}
                data-cy={`kit-${numeroKit + 1}`}
                data-testid={`kit-${numeroKit + 1}`}
              />
              <span className="checkmark" />
            </label>
          </div>
          {!esconderDetalhamentoKits && (
            <div
              className={`item-meal-kit`}
              dangerouslySetInnerHTML={{ __html: descricao }}
            />
          )}
        </div>
      </div>
    );
  }
}
