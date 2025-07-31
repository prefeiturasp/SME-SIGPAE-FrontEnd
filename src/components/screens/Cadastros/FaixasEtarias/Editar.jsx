import React, { Component, Fragment } from "react";

import InputText from "../../../Shareable/Input/InputText";
import Botao from "../../../Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON,
} from "../../../Shareable/Botao/constants";

import {
  faixaToString,
  mesEstaDentroDeAlgumaFaixa,
  mesesToMesEAnoString,
  mesesFinaisValidos,
  mesesForaDasFaixas,
  ordenaFaixas,
  range,
} from "../../../../helpers/faixasEtarias";

import "./style.scss";

const FaixaEtariaItem = ({
  inicio,
  editando,
  fim,
  onApagar,
  onCancelar,
  onConfirmar,
}) => (
  <div className="faixa-etaria-item">
    <InputText
      className={editando && "faixa-etaria-item-editando"}
      input={{ value: faixaToString({ inicio, fim }) }}
      disabled
    />
    {editando ? (
      <Fragment>
        <Botao
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN}
          icon={BUTTON_ICON.CHECK_CIRCLE}
          onClick={onConfirmar}
        />
        <Botao
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.RED}
          icon={BUTTON_ICON.TIMES_CIRCLE}
          onClick={onCancelar}
        />
      </Fragment>
    ) : (
      <Fragment>
        <Botao
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.BLUE_OUTLINE}
          icon={BUTTON_ICON.TRASH}
          onClick={onApagar}
        />
      </Fragment>
    )}
  </div>
);

export default class FaixasEtariasEditar extends Component {
  SEIS_ANOS = 6 * 12;
  SEIS_ANOS_MAIS_UM_MES = this.SEIS_ANOS + 1;

  constructor(props) {
    super(props);
    this.state = {
      meses: range(this.SEIS_ANOS_MAIS_UM_MES),
      faixasEtarias: [],
      mesEdicaoAtual: undefined,
    };
    this.cancelarEdicao = this.cancelarEdicao.bind(this);
    this.onFinalizar = this.onFinalizar.bind(this);
  }

  selecionaMes(mes) {
    if (isNaN(mes)) return;
    if (this.state.mesEdicaoAtual !== undefined) {
      let segundoClique;
      if (this.state.mesEdicaoAtual === 0 && (mes === 0 || mes === 1)) {
        segundoClique = 1;
      } else {
        segundoClique = mes + 1;
      }
      const faixasEtarias = ordenaFaixas(
        this.state.faixasEtarias.concat({
          inicio: this.state.mesEdicaoAtual,
          fim: segundoClique,
        })
      );
      this.setState({
        mesEdicaoAtual: undefined,
        faixasEtarias,
        meses: mesesForaDasFaixas(faixasEtarias, this.SEIS_ANOS_MAIS_UM_MES),
      });
    } else {
      this.setState({
        mesEdicaoAtual: mes,
        meses: mesesFinaisValidos(
          mes,
          this.state.faixasEtarias,
          this.SEIS_ANOS_MAIS_UM_MES
        ),
      });
    }
  }

  cancelarEdicao() {
    this.setState({
      mesEdicaoAtual: undefined,
      meses: mesesForaDasFaixas(
        this.state.faixasEtarias,
        this.SEIS_ANOS_MAIS_UM_MES
      ),
    });
  }

  apagarFaixa(indice) {
    const faixasEtarias = this.state.faixasEtarias.filter(
      (f, i) => i !== indice
    );
    this.setState({
      faixasEtarias,
      meses: mesesForaDasFaixas(faixasEtarias, this.SEIS_ANOS_MAIS_UM_MES),
    });
  }

  onFinalizar() {
    this.props.onFinalizar(this.state.faixasEtarias);
  }

  render() {
    return (
      <div className="card mt-3 faixas-etarias-editar">
        <div className="card-body">
          <div className="row">
            <p>
              Selecione um mês para{" "}
              {this.state.mesEdicaoAtual === undefined
                ? "começar uma"
                : "terminar a"}{" "}
              faixa
            </p>
          </div>
          <div className="row">
            <div className="col-5">
              <select
                multiple
                className={
                  "form-control select-meses" +
                  (this.state.mesEdicaoAtual ? " select-meses-editando" : "")
                }
                onClick={(e) => this.selecionaMes(parseInt(e.target.value))}
              >
                {this.state.meses.map((mes, key) => (
                  <option
                    key={key}
                    value={mes}
                    disabled={
                      this.state.mesEdicaoAtual
                        ? mes < this.state.mesEdicaoAtual ||
                          mesEstaDentroDeAlgumaFaixa(
                            mes,
                            this.state.faixasEtarias
                          )
                        : false
                    }
                  >
                    {mesesToMesEAnoString(mes)}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-7">
              {this.state.faixasEtarias.map((f, key) => (
                <FaixaEtariaItem
                  key={key}
                  onApagar={() => this.apagarFaixa(key)}
                  {...f}
                />
              ))}
              {this.state.mesEdicaoAtual !== undefined && (
                <FaixaEtariaItem
                  inicio={this.state.mesEdicaoAtual}
                  editando={true}
                  onCancelar={this.cancelarEdicao}
                  onConfirmar={() =>
                    this.selecionaMes(this.state.mesEdicaoAtual)
                  }
                />
              )}
            </div>
          </div>
          <div>
            <Botao
              texto="Finalizar"
              className="float-end botao-finalizar"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              disabled={this.state.meses.length > 0}
              onClick={this.onFinalizar}
              dataTestId="finaliza-edicao-faixas-button"
            />
            {this.props.redefinir && (
              <Botao
                texto="Cancelar"
                className="float-end"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                onClick={this.props.onCancelar}
                dataTestId="cancela-edicao-faixas-button"
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
