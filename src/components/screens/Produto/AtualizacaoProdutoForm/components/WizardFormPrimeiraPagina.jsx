import React from "react";
import { Field, reduxForm } from "redux-form";
import { Select } from "antd";
import { ASelect } from "src/components/Shareable/MakeField";
import { required, maxLengthProduto } from "src/helpers/fieldValidators";
import Botao from "src/components/Shareable/Botao";
import {
  getNomeDeProdutosEdital,
  getMarcasProdutos,
  getFabricantesProdutos,
} from "src/services/produto.service";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";

import "./styles.scss";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import ModalCadastrarItem from "src/components/Shareable/ModalCadastrarItem";
import { TIPO_PERFIL } from "src/constants/shared";
import {
  STATUS_CODAE_QUESTIONADO,
  STATUS_CODAE_HOMOLOGADO,
  STATUS_ESCOLA_OU_NUTRICIONISTA_RECLAMOU,
  STATUS_TERCEIRIZADA_RESPONDEU_RECLAMACAO,
} from "src/configs/constants";

const maxLength5000 = maxLengthProduto(5000);
const { Option } = Select;

class WizardFormPrimeiraPagina extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      retificou: false,
      checkDieta: false,
      produtoForm: null,
      protocoloDietas: null,
      nomeDeProdutosEditalArray: [],
      marcasArray: [],
      fabricantesArray: [],
      listNomesProdutos: [],
      listaMarcas: [],
      listaFabricantes: [],
      loading: true,
      completo: false,
      showModalCadastrarItem: false,
      desabilitarNomeDoProdutoField: true,
      desabilitarEhParaAlunosComDietaField: true,
      status_codae_questionado: false,
    };
  }

  componentDidMount() {
    const { produto } = this.props;
    const tipoPerfil = localStorage.getItem("tipo_perfil");

    if (tipoPerfil === TIPO_PERFIL.TERCEIRIZADA) {
      if (produto.homologacao.status === STATUS_CODAE_QUESTIONADO) {
        this.setState({
          desabilitarNomeDoProdutoField: false,
          status_codae_questionado: true,
        });
      }
      if (
        [
          STATUS_CODAE_QUESTIONADO,
          STATUS_CODAE_HOMOLOGADO,
          STATUS_ESCOLA_OU_NUTRICIONISTA_RECLAMOU,
          STATUS_TERCEIRIZADA_RESPONDEU_RECLAMACAO,
        ].includes(produto.homologacao.status)
      ) {
        this.setState({
          desabilitarEhParaAlunosComDietaField: false,
        });
      }
    }

    this.setState({ produtoForm: produto });
  }

  async componentDidUpdate() {
    const {
      retificou,
      produtoForm,
      completo,
      marcasArray,
      fabricantesArray,
      loading,
    } = this.state;

    const { change, protocolos, primeiroStep, valoresPrimeiroForm } =
      this.props;

    let listaNomeDeProdutosEdital = [];
    let listaMarcas = [];
    let listaFabricantes = [];

    if (marcasArray.length === 0 && loading && fabricantesArray.length === 0) {
      const responseNomeDeProdutosEdital = await getNomeDeProdutosEdital();
      const responseMarcas = await getMarcasProdutos();
      const responseFabricantes = await getFabricantesProdutos();

      responseNomeDeProdutosEdital.data.results.forEach((produtoEdital) => {
        listaNomeDeProdutosEdital.push(
          <Option key={`${produtoEdital.uuid}`}>{produtoEdital.nome}</Option>
        );
      });

      responseMarcas.data.results.forEach((marca) => {
        listaMarcas.push(<Option key={`${marca.uuid}`}>{marca.nome}</Option>);
      });

      responseFabricantes.data.results.forEach((fabricante) => {
        listaFabricantes.push(
          <Option key={`${fabricante.uuid}`}>{fabricante.nome}</Option>
        );
      });
      this.setState({
        nomeDeProdutosEditalArray: listaNomeDeProdutosEdital,
        marcasArray: listaMarcas,
        fabricantesArray: listaFabricantes,
        listNomesProdutos: responseNomeDeProdutosEdital.data.results,
        listaMarcas: responseMarcas.data.results,
        listaFabricantes: responseFabricantes.data.results,
        loading: false,
      });
    }

    if (produtoForm !== null && !retificou && !primeiroStep) {
      if (produtoForm.eh_para_alunos_com_dieta) {
        change("eh_para_alunos_com_dieta", "1");
      } else {
        change("eh_para_alunos_com_dieta", "0");
      }

      if (produtoForm.tem_aditivos_alergenicos) {
        change("tem_aditivos_alergenicos", "1");
      } else {
        change("tem_aditivos_alergenicos", "0");
      }

      if (produtoForm.tem_gluten) {
        change("tem_gluten", "1");
      } else {
        change("tem_gluten", "0");
      }

      if (!primeiroStep) {
        change("protocolos", protocolos);
      }
      change("aditivos", produtoForm.aditivos);
      change("nome", produtoForm.nome);
      change("componentes", produtoForm.componentes);
      change("marca", produtoForm.marca.uuid);
      change("fabricante", produtoForm.fabricante.uuid);

      if (produtoForm.eh_para_alunos_com_dieta && !retificou) {
        this.setState({ checkDieta: true, retificou: true });
      } else if (!retificou) {
        this.setState({ retificou: true });
      }
    }

    if (primeiroStep && !completo && valoresPrimeiroForm !== null) {
      if (valoresPrimeiroForm.eh_para_alunos_com_dieta) {
        change("eh_para_alunos_com_dieta", "1");
      } else {
        change("eh_para_alunos_com_dieta", "0");
      }

      if (valoresPrimeiroForm.tem_aditivos_alergenicos) {
        change("tem_aditivos_alergenicos", "1");
      } else {
        change("tem_aditivos_alergenicos", "0");
      }

      if (valoresPrimeiroForm.tem_gluten) {
        change("tem_gluten", "1");
      } else {
        change("tem_gluten", "0");
      }

      change("protocolos", valoresPrimeiroForm.protocolos);
      change("aditivos", valoresPrimeiroForm.aditivos);

      change("nome", valoresPrimeiroForm.nome);
      change("componentes", valoresPrimeiroForm.componentes);
      change("marca", valoresPrimeiroForm.marca);
      change("fabricante", valoresPrimeiroForm.fabricante);

      if (produtoForm.eh_para_alunos_com_dieta && !retificou) {
        this.setState({ checkDieta: true, retificou: true });
      } else if (!retificou) {
        this.setState({ retificou: true });
      }

      this.setState({ completo: true });
    }
  }

  showModalCadastrarItem = () => {
    this.setState({
      showModalCadastrarItem: true,
    });
  };

  closeModalCadastrarItem = () => {
    this.setState({
      showModalCadastrarItem: false,
    });
  };

  updateOpcoesItensCadastrados = async () => {
    const responseMarcas = await getMarcasProdutos();
    const responseFabricantes = await getFabricantesProdutos();

    let listaMarcas = [];
    let listaFabricantes = [];

    responseMarcas.data.results.forEach((marca) => {
      listaMarcas.push(<Option key={`${marca.uuid}`}>{marca.nome}</Option>);
    });

    responseFabricantes.data.results.forEach((fabricante) => {
      listaFabricantes.push(
        <Option key={`${fabricante.uuid}`}>{fabricante.nome}</Option>
      );
    });

    this.setState({
      marcasArray: listaMarcas,
      fabricantesArray: listaFabricantes,
      listaMarcas: responseMarcas.data.results,
      listaFabricantes: responseFabricantes.data.results,
      loading: false,
    });
  };

  dietaEspecialCheck = (valor) => {
    let { produtoForm } = this.state;
    produtoForm.eh_para_alunos_com_dieta = valor === "1" ? true : false;
    if (valor === "0") {
      this.setState({ produtoForm });
    } else if (valor === "1") {
      this.setState({ produtoForm });
    }
  };

  alergenicosCheck = (valor) => {
    let { produtoForm } = this.state;
    const { change } = this.props;
    produtoForm.tem_aditivos_alergenicos = valor === "1" ? true : false;
    if (valor === "0") {
      this.setState({ produtoForm });
      change("aditivos", null);
    } else if (valor === "1") {
      this.setState({ produtoForm });
    }
  };

  temGlutemCheck = (valor) => {
    let { produtoForm } = this.state;
    const { change } = this.props;
    produtoForm.tem_gluten = valor === "1" ? true : false;
    if (valor === "0") {
      this.setState({ produtoForm });
      change("tem_gluten", null);
    } else if (valor === "1") {
      this.setState({ produtoForm });
    }
  };

  addNome = (valor) => {
    let { produtoForm, listNomesProdutos } = this.state;
    const { change } = this.props;
    let nome = listNomesProdutos.filter((nome) => valor === nome.uuid)[0].nome;
    produtoForm.nome = nome;
    change("nome", nome);
    this.setState({ produtoForm });
  };

  addMarca = (valor) => {
    let { produtoForm, listaMarcas } = this.state;
    const { change } = this.props;
    produtoForm.marca = listaMarcas.filter((marca) => valor === marca.uuid)[0];
    change("marca", valor);
    this.setState({ produtoForm });
  };

  addFabricante = (valor) => {
    let { produtoForm, listaFabricantes } = this.state;
    const { change } = this.props;
    produtoForm.fabricante = listaFabricantes.filter(
      (fabricante) => valor === fabricante.uuid
    )[0];
    change("fabricante", valor);
    this.setState({ produtoForm });
  };

  render() {
    const { handleSubmit, valuesForm, produto } = this.props;

    const {
      produtoForm,
      nomeDeProdutosEditalArray,
      marcasArray,
      fabricantesArray,
      desabilitarNomeDoProdutoField,
      desabilitarEhParaAlunosComDietaField,
      status_codae_questionado,
    } = this.state;

    return (
      <form onSubmit={handleSubmit}>
        <section className="identificacao-produto">
          <header>Identificação do Produto</header>

          <div className="section-produto-nome">
            <label className="label-formulario-produto">
              <nav>*</nav>Nome do produto
            </label>
            <Field
              component={ASelect}
              onBlur={(e) => {
                e.preventDefault();
              }}
              className={"select-form-produto"}
              showSearch
              name="nome"
              onSelect={this.addNome}
              validate={required}
              disabled={desabilitarNomeDoProdutoField}
            >
              {nomeDeProdutosEditalArray}
            </Field>
          </div>

          <section className="section-marca-fabricante-produto">
            <div className="">
              <label className="label-formulario-produto">
                <nav>*</nav>Marca do produto
              </label>
              <Field
                component={ASelect}
                onBlur={(e) => {
                  e.preventDefault();
                }}
                disabled={produto}
                className={"select-form-produto"}
                showSearch
                name="marca"
                filterOption={(inputValue, option) => {
                  return option.props.children
                    .toString()
                    .toLowerCase()
                    .includes(inputValue.toLowerCase());
                }}
                onSelect={this.addMarca}
                validate={required}
              >
                {marcasArray}
              </Field>
            </div>
            <div className="">
              <label className="label-formulario-produto">
                <nav>*</nav>Nome do fabricante
              </label>
              <Field
                component={ASelect}
                onBlur={(e) => {
                  e.preventDefault();
                }}
                className={"select-form-produto"}
                showSearch
                name="fabricante"
                filterOption={(inputValue, option) => {
                  return option.props.children
                    .toString()
                    .toLowerCase()
                    .includes(inputValue.toLowerCase());
                }}
                onSelect={this.addFabricante}
                validate={required}
                disabled={produto}
              >
                {fabricantesArray}
              </Field>
            </div>
            {!produto && (
              <div className="mt-4 adicionar-marca-fornecedor">
                <Botao
                  texto="Cadastrar Item"
                  className={"botao-adicionar-marca-fabricante"}
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  onClick={() => {
                    this.showModalCadastrarItem();
                  }}
                />
              </div>
            )}
          </section>

          <section className="dieta-especial-form">
            <article>
              <label className="label-formulario-produto">
                <span>*</span>O produto se destina ao atendimento de alunos com
                dieta especial?
              </label>
              <div className="checks">
                <label className="container-radio">
                  Sim
                  <Field
                    component={"input"}
                    type="radio"
                    value="1"
                    name="eh_para_alunos_com_dieta"
                    onClick={() => {
                      this.dietaEspecialCheck("1");
                    }}
                    disabled={desabilitarEhParaAlunosComDietaField}
                    required
                  />
                  <span className="checkmark" />
                </label>
                <label className="container-radio">
                  Não
                  <Field
                    component={"input"}
                    type="radio"
                    value="0"
                    name="eh_para_alunos_com_dieta"
                    onClick={() => {
                      this.dietaEspecialCheck("0");
                    }}
                    disabled={desabilitarEhParaAlunosComDietaField}
                  />
                  <span className="checkmark" />
                </label>
              </div>
            </article>
          </section>

          <div className="componentes-do-produto">
            <Field
              component={TextArea}
              label="Nome dos componentes do produto"
              name="componentes"
              type="text"
              validate={[maxLength5000]}
              maxLength={5001}
              required
            />
          </div>

          <section className="componentes-alergenicos">
            <article>
              <label className="label-formulario-produto">
                <span>*</span>O produto contém ou pode conter
                ingredientes/aditivos alergênicos?
              </label>
              <div className="checks">
                <label className="container-radio">
                  Sim
                  <Field
                    component={"input"}
                    type="radio"
                    value="1"
                    name="tem_aditivos_alergenicos"
                    onClick={() => {
                      this.alergenicosCheck("1");
                    }}
                    required
                  />
                  <span className="checkmark" />
                </label>
                <label className="container-radio">
                  Não
                  <Field
                    component={"input"}
                    type="radio"
                    value="0"
                    name="tem_aditivos_alergenicos"
                    onClick={() => {
                      this.alergenicosCheck("0");
                    }}
                    required
                  />
                  <span className="checkmark" />
                </label>
              </div>
            </article>
            <article>
              <div className="card-warning mt-3 w-50">
                <strong>IMPORTANTE:</strong> Relacioná-los conforme dispõe a RDC
                nº 26 de 02/07/15
              </div>
            </article>
            {produtoForm !== null && produtoForm.tem_aditivos_alergenicos && (
              <article>
                <label className="label-formulario-produto">
                  <nav>*</nav>Quais?
                </label>
                <Field
                  component={TextArea}
                  className="field-aditivos"
                  name="aditivos"
                  required
                />
              </article>
            )}
          </section>

          <section className="componentes-alergenicos">
            <article>
              <label className="label-formulario-produto">
                <span>*</span>O produto contém glúten?
              </label>
              <div className="checks">
                <label className="container-radio">
                  Sim
                  <Field
                    component={"input"}
                    type="radio"
                    value="1"
                    name="tem_gluten"
                    onClick={() => {
                      this.temGlutemCheck("1");
                    }}
                    required
                  />
                  <span className="checkmark" />
                </label>
                <label className="container-radio">
                  Não
                  <Field
                    component={"input"}
                    type="radio"
                    value="0"
                    name="tem_gluten"
                    onClick={() => {
                      this.temGlutemCheck("0");
                    }}
                    required
                  />
                  <span className="checkmark" />
                </label>
              </div>
            </article>
          </section>
        </section>

        <section className="rodape-botoes-acao">
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
          <Botao
            texto={"Próximo"}
            type={BUTTON_TYPE.SUBMIT}
            className="ms-3"
            style={BUTTON_STYLE.GREEN_OUTLINE}
            onClick={() => {
              this.props.passouPrimeiroStep(valuesForm, produtoForm);
            }}
          />
        </section>
        <ModalCadastrarItem
          closeModal={this.closeModalCadastrarItem}
          showModal={this.state.showModalCadastrarItem}
          item={undefined}
          changePage={this.updateOpcoesItensCadastrados}
        />
      </form>
    );
  }
}

export default reduxForm({
  form: "atualizacaoProduto",
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(WizardFormPrimeiraPagina);
