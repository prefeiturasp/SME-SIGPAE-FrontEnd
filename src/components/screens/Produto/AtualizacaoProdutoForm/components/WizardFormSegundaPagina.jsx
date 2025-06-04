import React from "react";
import { Field, reduxForm, FormSection } from "redux-form";
import InputText from "src/components/Shareable/Input/InputText";
import { required, inteiroOuDecimal } from "src/helpers/fieldValidators";
import "./styles.scss";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import { ToggleExpandir } from "src/components/Shareable/ToggleExpandir";
import { STATUS_CODAE_QUESTIONADO } from "src/configs/constants";

class WizardFormSegundaPagina extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      informacoes: [],
      valuesForm: {},
      verificado: false,
      temCamposPreenchidos: false,
      status_codae_questionado: false,
    };
  }

  verificaSeOsCamposEstaoCorretos = (informacoes) => {
    const { valuesForm } = this.props;
    let arrayIncorretos = [];
    informacoes.forEach((informacao) => {
      const objeto = valuesForm[informacao];
      objeto.porcao === undefined &&
        objeto.valor_diario !== undefined &&
        arrayIncorretos.push(objeto);
    });
    return arrayIncorretos.length === 0;
  };

  verificaSeAlgumCampoEstaPreenchido = (values) => {
    const arrayKeys = Object.keys(values);
    let informacoes = [];
    arrayKeys.forEach((item) => {
      item.includes("informacao=") && informacoes.push(item);
    });
    return (
      this.verificaSeOsCamposEstaoCorretos(informacoes) &&
      informacoes.length > 0
    );
  };

  componentDidMount() {
    let { informacoes, valuesForm } = this.state;
    const { produto, change, segundoStep, valoresSegundoForm } = this.props;

    if (produto.homologacao.status === STATUS_CODAE_QUESTIONADO) {
      this.setState({
        status_codae_questionado: true,
      });
    }

    const { verificado } = this.state;
    if (
      this.props.informacoes !== this.state.informacoes &&
      informacoes.length === 0 &&
      !verificado
    ) {
      informacoes = this.props.informacoes;
      informacoes.forEach((item) => {
        item.informacoes_nutricionais.forEach((informacao) => {
          informacao["check"] = false;
          informacao["validate"] = [];
        });
      });
      this.setState({ informacoes });
    }

    const objetoVazio = Object.entries(valuesForm).length === 0;
    if (this.state.valuesForm !== this.props.valuesForm && objetoVazio) {
      valuesForm = this.props.valuesForm;

      if (segundoStep) {
        valoresSegundoForm.informacoes_nutricionais.forEach((info) => {
          this.props.change(
            `informacao=${info.informacao_nutricional}.porcao`,
            info.quantidade_porcao
          );
          this.props.change(
            `informacao=${info.informacao_nutricional}.valor_diario`,
            info.valor_diario
          );
        });
      }

      if (!segundoStep) {
        change("porcao", produto.porcao);
        change("unidade_caseira", produto.unidade_caseira);
      } else {
        change("porcao", valoresSegundoForm.porcao);
        change("unidade_caseira", valoresSegundoForm.unidade_caseira);
      }

      const { informacoes_nutricionais } = produto;

      informacoes_nutricionais.forEach((informacao) => {
        const { quantidade_porcao, valor_diario, informacao_nutricional } =
          informacao;
        const { tipo_nutricional, uuid } = informacao_nutricional;
        if (!segundoStep) {
          this.props.change(`informacao=${uuid}.porcao`, quantidade_porcao);
          this.props.change(`informacao=${uuid}.valor_diario`, valor_diario);

          informacoes.forEach((item) => {
            item.informacoes_nutricionais.forEach((informacao) => {
              if (informacao.uuid === uuid) {
                informacao.validate.push(inteiroOuDecimal);
              }
            });
          });

          this.setState({ informacoes });
        }

        informacoes.forEach((informacao) => {
          if (informacao.nome === tipo_nutricional.nome) {
            informacao.ativo = true;
          }
        });
      });
      this.setState({ valuesForm, informacoes, verificado: true });
    }

    const temCamposPreenchidos = this.verificaSeAlgumCampoEstaPreenchido(
      this.props.valuesForm
    );

    if (this.state.temCamposPreenchidos !== temCamposPreenchidos) {
      this.setState({ temCamposPreenchidos });
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    let { informacoes, valuesForm } = this.state;
    const { produto, change, segundoStep, valoresSegundoForm } = this.props;
    const { verificado } = this.state;
    if (
      prevProps.informacoes !== prevState.informacoes &&
      informacoes.length === 0 &&
      !verificado
    ) {
      informacoes = prevProps.informacoes;
      informacoes.forEach((item) => {
        item.informacoes_nutricionais.forEach((informacao) => {
          informacao["check"] = false;
          informacao["validate"] = [];
        });
      });
      this.setState({ informacoes });
    }

    const objetoVazio = Object.entries(valuesForm).length === 0;
    if (prevState.valuesForm !== prevProps.valuesForm && objetoVazio) {
      valuesForm = prevProps.valuesForm;

      if (segundoStep) {
        valoresSegundoForm.informacoes_nutricionais.forEach((info) => {
          this.props.change(
            `informacao=${info.informacao_nutricional}.porcao`,
            info.quantidade_porcao
          );
          this.props.change(
            `informacao=${info.informacao_nutricional}.valor_diario`,
            info.valor_diario
          );
        });
      }

      if (!segundoStep) {
        change("porcao", produto.porcao);
        change("unidade_caseira", produto.unidade_caseira);
      } else {
        change("porcao", valoresSegundoForm.porcao);
        change("unidade_caseira", valoresSegundoForm.unidade_caseira);
      }

      const { informacoes_nutricionais } = produto;

      informacoes_nutricionais.forEach((informacao) => {
        const { quantidade_porcao, valor_diario, informacao_nutricional } =
          informacao;
        const { tipo_nutricional, uuid } = informacao_nutricional;
        if (!segundoStep) {
          this.props.change(`informacao=${uuid}.porcao`, quantidade_porcao);
          this.props.change(`informacao=${uuid}.valor_diario`, valor_diario);

          informacoes.forEach((item) => {
            item.informacoes_nutricionais.forEach((informacao) => {
              if (informacao.uuid === uuid) {
                informacao.validate.push(inteiroOuDecimal);
              }
            });
          });

          this.setState({ informacoes });
        }

        informacoes.forEach((informacao) => {
          if (informacao.nome === tipo_nutricional.nome) {
            informacao.ativo = true;
          }
        });
      });
      this.setState({ valuesForm, informacoes, verificado: true });
    }

    const temCamposPreenchidos = this.verificaSeAlgumCampoEstaPreenchido(
      this.props.valuesForm
    );

    if (prevState.temCamposPreenchidos !== temCamposPreenchidos) {
      this.setState({ temCamposPreenchidos });
    }
  };

  checkInformacao = ({ nome }) => {
    let { informacoes } = this.state;
    informacoes.forEach((info) => {
      if (info.nome === nome) {
        info.ativo = !info.ativo;
      }
    });
    this.setState({ informacoes });
  };

  onBlurField = ({ uuid }) => {
    let { informacoes } = this.state;
    informacoes.forEach((item) => {
      item.informacoes_nutricionais.forEach((info) => {
        if (info.uuid === uuid) {
          info.validate.push(inteiroOuDecimal);
        }
      });
    });
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

  render() {
    const { handleSubmit, previousPage, valuesForm } = this.props;
    const { informacoes, temCamposPreenchidos, status_codae_questionado } =
      this.state;
    return (
      <form onSubmit={handleSubmit} className="segundo-formulario">
        <header>Informações Nutricionais</header>
        <section className="porcao-unidade-caseira">
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
        </section>
        <header className="mt-3">
          Necessário o preenchimento das informações nutricionais abaixo
        </header>
        <section className="secao-informacoes-nutricionais">
          {informacoes.length > 0 &&
            informacoes.map((informacao, index) => {
              return (
                <div key={index}>
                  <div className="header-tipo-informacao">
                    <div>{this.retornaNomesFormatados(informacao)}</div>
                    <ToggleExpandir
                      onClick={() => this.checkInformacao(informacao)}
                      ativo={informacao.ativo}
                    />
                  </div>
                  {informacao.ativo && (
                    <div className="informacoes-nutri">
                      <div className="campos-informacoes-nutri-header">
                        <div>Título</div>
                        <div>Quantidade por Porção</div>
                        <div>%VD(*)</div>
                      </div>
                      {informacao.informacoes_nutricionais.map(
                        (item, index) => {
                          return (
                            <FormSection
                              key={index}
                              name={`informacao=${item.uuid}`}
                            >
                              <div className="campos-informacoes-nutri">
                                <div>{item.nome}</div>
                                <div>
                                  <Field
                                    component={InputText}
                                    name="porcao"
                                    type="text"
                                    validate={item.validate}
                                    onBlur={() => {
                                      this.onBlurField(item);
                                    }}
                                  />
                                </div>
                                <div className="medida">{item.medida}</div>
                                <div>
                                  <Field
                                    component={InputText}
                                    name="valor_diario"
                                    type="text"
                                    validate={item.validate}
                                    onBlur={() => {
                                      this.onBlurField(item);
                                    }}
                                  />
                                </div>
                                <div className="medida">%</div>
                              </div>
                            </FormSection>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </section>
        <section className="footer-botoes">
          <Botao
            texto={"Voltar"}
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN_OUTLINE}
            onClick={() => {
              this.props.passouSegundoStep(valuesForm);
              previousPage();
            }}
          />
          {status_codae_questionado && (
            <Botao
              texto={"Cancelar"}
              type={BUTTON_TYPE.BUTTON}
              className="ms-3"
              style={BUTTON_STYLE.GREEN_OUTLINE}
              onClick={() => {
                this.props.showModal(true);
              }}
            />
          )}
          {temCamposPreenchidos && (
            <Botao
              texto={"Próximo"}
              type={BUTTON_TYPE.SUBMIT}
              className="ms-3"
              style={BUTTON_STYLE.GREEN_OUTLINE}
              onClick={() => {
                this.props.passouSegundoStep(valuesForm);
              }}
            />
          )}
        </section>
      </form>
    );
  }
}

export default reduxForm({
  form: "atualizacaoProduto",
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(WizardFormSegundaPagina);
