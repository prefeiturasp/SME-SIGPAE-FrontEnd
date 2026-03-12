import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import InputText from "../../../../Shareable/Input/InputText";
import {
  required,
  inteiroOuDecimal,
} from "../../../../../helpers/fieldValidators";
import "./style.scss";
import { ToggleExpandir } from "../../../../Shareable/ToggleExpandir";
import { Collapse } from "react-collapse";
import Botao from "../../../../Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "../../../../Shareable/Botao/constants";

class Step2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      solicitacoesVigentes: null,
    };
  }
  componentDidMount() {
    const { payload } = this.props;
    if (this.props.solicitacoesVigentes !== this.state.solicitacoesVigentes) {
      this.setState({ solicitacoesVigentes: this.props.solicitacoesVigentes });
    }
    if (
      payload.porcao !== null &&
      payload.unidade_caseira !== null &&
      payload.informacoes_nutricionais.length > 0
    ) {
      this.props.change("porcao", payload.porcao);
      this.props.change("unidade_caseira", payload.unidade_caseira);
      payload.informacoes_nutricionais.forEach((informacao) => {
        this.props.change(
          `porcao=${informacao.informacao_nutricional}`,
          informacao.quantidade_porcao,
        );
        this.props.change(
          `vd=${informacao.informacao_nutricional}`,
          informacao.valor_diario,
        );
      });
    }
  }
  componentDidUpdate() {
    if (this.props.informacoesAgrupadas !== this.state.informacoesAgrupadas) {
      this.props.informacoesAgrupadas.forEach((item) => {
        item.informacoes_nutricionais.forEach((info) => {
          info["check"] = false;
        });
      });
      this.setState({ informacoesAgrupadas: this.props.informacoesAgrupadas });
    }
  }

  activateInformacao(key) {
    let informacoesAgrupadas = this.state.informacoesAgrupadas;
    informacoesAgrupadas[key].active = !informacoesAgrupadas[key].active;
    this.setState({ informacoesAgrupadas });
  }

  onSubmit = (values) => {
    const { informacoesAgrupadas } = this.state;
    const { payload } = this.props;
    informacoesAgrupadas.forEach((item) => {
      item.informacoes_nutricionais.forEach((informacao) => {
        const temPorcao = Object.prototype.hasOwnProperty.call(
          values,
          `porcao=${informacao.uuid}`,
        );
        if (temPorcao) {
          let inf_nutr_atualizada = payload.informacoes_nutricionais.find(
            (inf_nutr) => inf_nutr.informacao_nutricional === informacao.uuid,
          );
          if (inf_nutr_atualizada) {
            inf_nutr_atualizada.quantidade_porcao =
              values[`porcao=${informacao.uuid}`];
            inf_nutr_atualizada.valor_diario = values[`vd=${informacao.uuid}`];
          } else {
            payload.informacoes_nutricionais.push({
              informacao_nutricional: informacao.uuid,
              quantidade_porcao: values[`porcao=${informacao.uuid}`],
              valor_diario: values[`vd=${informacao.uuid}`],
            });
          }
        }
      });
    });

    payload["porcao"] = values.porcao;
    payload["unidade_caseira"] = values.unidade_caseira;
    this.props.setaValoresStep2(payload);
  };

  setaInformacaoComoVisto = ({ uuid }) => {
    let { informacoesAgrupadas } = this.state;
    informacoesAgrupadas.forEach((item) => {
      item.informacoes_nutricionais.forEach((info) => {
        if (info.uuid === uuid) {
          info.check = true;
        }
      });
    });
    this.setState({ informacoesAgrupadas });
  };

  retornaNomesFormatados = ({ nome }) => {
    if (nome === "PROTEINAS") {
      return "PROTEÍNAS";
    } else if (nome === "CALORIA") {
      return "CALORIAS";
    } else {
      return nome;
    }
  };

  changeFormValue = (e, inputName) => {
    this.props.change(inputName, e.target.value);
  };

  render() {
    const { informacoesAgrupadas } = this.state;
    const { handleSubmit } = this.props;
    return (
      <div className="cadastro-produto-step2">
        <div className="card-title">Informações Nutricionais</div>
        <div className="row">
          <div className="col-6 pt-3">
            <Field
              component={InputText}
              label="Porção"
              name="porcao"
              type="text"
              tooltipText="Inserir as informações conforme rótulo do produto"
              placeholder="Ex: porção de 200ml (01 unidade)"
              required
              validate={required}
            />
          </div>
          <div className="col-6 pt-3">
            <Field
              component={InputText}
              label="Unidade Caseira"
              name="unidade_caseira"
              type="text"
              tooltipText="Inserir as informações conforme rótulo do produto"
              placeholder="Ex: 01 copo"
              required
              validate={required}
            />
          </div>
        </div>
        <div className="row card-title fw-bold ms-2">
          Necessário o preenchimento das informações nutricionais abaixo
        </div>
        {informacoesAgrupadas &&
          informacoesAgrupadas.map((informacao, key) => {
            return (
              <div className="pb-2" key={key}>
                <div className="school-container col-md-12 me-4">
                  <div className="row pt-2 pb-2 title">
                    <div className="title col-4">
                      {this.retornaNomesFormatados(informacao)}
                    </div>
                    <div className="col-8 text-end">
                      <ToggleExpandir
                        onClick={() => this.activateInformacao(key)}
                        ativo={informacao.active}
                        className="float-end"
                      />
                    </div>
                  </div>
                  <Collapse
                    isOpened={informacao.active ? informacao.active : false}
                  >
                    <table className="table-informacoes-nutricionais">
                      <thead>
                        <tr className="row">
                          <th className="col-4">Título</th>
                          <th className="col-4">Quantidade por porção</th>
                          <th className="col-4">%VD(*)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {informacao.informacoes_nutricionais.map(
                          (informacaoNutricional, key) => {
                            return (
                              <tr className="row" key={key}>
                                <td className="col-4">
                                  {informacaoNutricional.nome}
                                </td>
                                <td className="col-4">
                                  <div className="row">
                                    <div className="col-8">
                                      <Field
                                        component={InputText}
                                        name={`porcao=${informacaoNutricional.uuid}`}
                                        type="text"
                                        validate={inteiroOuDecimal}
                                        onBlur={() => {
                                          this.setaInformacaoComoVisto(
                                            informacaoNutricional,
                                          );
                                        }}
                                        onChange={(e) => {
                                          this.changeFormValue(
                                            e,
                                            `porcao=${informacaoNutricional.uuid}`,
                                          );
                                          this.props.setBlockProximo();
                                        }}
                                      />
                                    </div>
                                    <div className="col-4 mt-2">
                                      {informacaoNutricional.medida}
                                    </div>
                                  </div>
                                </td>
                                <td className="col-4">
                                  <div className="row">
                                    <div className="col-8">
                                      <Field
                                        component={InputText}
                                        name={`vd=${informacaoNutricional.uuid}`}
                                        type="text"
                                        validate={inteiroOuDecimal}
                                        onBlur={() => {
                                          this.setaInformacaoComoVisto(
                                            informacaoNutricional,
                                          );
                                        }}
                                      />
                                    </div>
                                    <div className="col-4">%</div>
                                  </div>
                                </td>
                              </tr>
                            );
                          },
                        )}
                      </tbody>
                    </table>
                  </Collapse>
                </div>
              </div>
            );
          })}
        <div className="row">
          <div className="col-10">
            <div className="card-warning mt-3 mb-3">
              % Valores Diários com base em uma dieta de 2.000 Kcal ou 8.400 KJ.
              <br />
              Seus valores diários podem ser maiores ou menores dependendo de
              suas necessidades energéticas. (**) VD não estabelecidos
            </div>
          </div>
          <div className="col-2">
            <div className="mt-3 mb-3">
              <Botao
                texto={"salvar"}
                type={BUTTON_TYPE.SUBMIT}
                style={BUTTON_STYLE.GREEN}
                className="botaoSalvar"
                onClick={handleSubmit((values) =>
                  this.onSubmit({
                    ...values,
                  }),
                )}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Step2 = reduxForm({
  form: "step2",
})(Step2);

export default Step2;
