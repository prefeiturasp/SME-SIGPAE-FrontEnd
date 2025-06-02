import React, { Component } from "react";
import { Field } from "redux-form";
import { TextArea } from "../../../../Shareable/TextArea/TextArea";
import { Select } from "antd";
import {
  getNomeDeProdutosEdital,
  getMarcasProdutos,
  getFabricantesProdutos,
} from "../../../../../services/produto.service";
import "./style.scss";

import Botao from "../../../../Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "../../../../Shareable/Botao/constants";

import ModalCadastrarItem from "src/components/Shareable/ModalCadastrarItem";

import { Step1EstaValido, retornaObjetoRequest } from "../helpers";
import { required, maxLengthProduto } from "src/helpers/fieldValidators";
import { ASelect } from "src/components/Shareable/MakeField";

const { Option } = Select;
const maxLength5000 = maxLengthProduto(5000);

class Step1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      nomeDeProdutosEditalArray: [],
      marcasArray: [],
      fabricantesArray: [],
      showModalCadastrarItem: false,
      payloadStep1: {
        eh_para_alunos_com_dieta: null,
        detalhes_da_dieta: null,
        nome: null,
        nomeDeProdutosEdital: null,
        marca: null,
        fabricante: null,
        componentes: null,
        tem_aditivos_alergenicos: null,
        tem_gluten: null,
        aditivos: null,
      },
      dafaultArrayProtocolo: [],
      retornadoAoStep: false,
      marcaDefault: null,
      fabricantesNomes: [],
      marcasNomes: [],
    };
    this.closeModalCadastrarItem = this.closeModalCadastrarItem.bind(this);
    this.getItensCadastrados = this.getItensCadastrados.bind(this);
    this.setaNomeProduto = this.setaNomeProduto.bind(this);
    this.updateOpcoesItensCadastrados =
      this.updateOpcoesItensCadastrados.bind(this);
    this.produtoTemGluten = this.produtoTemGluten.bind(this);
  }

  abreOuFechaFormDietaEspecial = (value) => {
    let { payloadStep1 } = this.state;
    let condicao = false;
    if (value === 1) {
      condicao = true;
    } else {
      condicao = false;
    }
    payloadStep1.eh_para_alunos_com_dieta = condicao;
    this.setState({
      payloadStep1,
    });
    this.props.setaAtributosPrimeiroStep(payloadStep1);
  };

  abreOuFechaFormAlergenico = (value) => {
    let { payloadStep1 } = this.state;
    let condicao = false;
    if (value === 1) {
      condicao = true;
    } else {
      condicao = false;
    }
    payloadStep1.tem_aditivos_alergenicos = condicao;
    this.props.mostrarFormAlergenico(condicao);
    this.setState({
      payloadStep1,
    });
    this.props.setaAtributosPrimeiroStep(payloadStep1);
  };

  produtoTemGluten = (value) => {
    let { payloadStep1 } = this.state;
    let condicao = false;
    if (value === 1) {
      condicao = true;
    } else {
      condicao = false;
    }
    payloadStep1.tem_gluten = condicao;
    this.setState({
      payloadStep1,
    });
    this.props.setaAtributosPrimeiroStep(payloadStep1);
  };

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
    const itensCadastrados = await this.getItensCadastrados();
    this.setState({
      marcasArray: itensCadastrados.listaMarcas,
      fabricantesArray: itensCadastrados.listaFabricantes,
      loading: false,
      marcasNomes: itensCadastrados.marcasCadastradas,
      fabricantesNomes: itensCadastrados.fabricantesCadastrados,
    });
  };

  getItensCadastrados = async () => {
    let listaMarcas = [];
    let listaFabricantes = [];
    const responseMarcas = await getMarcasProdutos();
    const responseFabricantes = await getFabricantesProdutos();
    responseMarcas.data.results.forEach((marca) => {
      listaMarcas.push(
        <Option key={`${marca.nome}+${marca.uuid}`}>{marca.nome}</Option>
      );
    });
    responseFabricantes.data.results.forEach((fabricante) => {
      listaFabricantes.push(
        <Option key={`${fabricante.nome}+${fabricante.uuid}`}>
          {fabricante.nome}
        </Option>
      );
    });
    return {
      marcasCadastradas: responseMarcas.data.results,
      fabricantesCadastrados: responseFabricantes.data.results,
      listaMarcas: listaMarcas,
      listaFabricantes: listaFabricantes,
    };
  };

  componentDidMount = async () => {
    let { marcasArray, fabricantesArray, dafaultArrayProtocolo } = this.state;
    const { payload } = this.props;
    if (dafaultArrayProtocolo.length === 0) {
      this.setState({
        payloadStep1: retornaObjetoRequest(payload),
        dafaultArrayProtocolo,
        retornadoAoStep: true,
      });
    }

    let listaNomeDeProdutosEdital = [];

    if (marcasArray.length === 0 && fabricantesArray.length === 0) {
      const itensCadastrados = await this.getItensCadastrados();
      const responseNomeDeProdutosEdital = await getNomeDeProdutosEdital();
      responseNomeDeProdutosEdital.data.results.forEach((produtoEdital) => {
        listaNomeDeProdutosEdital.push(
          <Option key={`${produtoEdital.nome}+${produtoEdital.uuid}`}>
            {produtoEdital.nome}
          </Option>
        );
      });

      this.setState({
        nomeDeProdutosEditalArray: listaNomeDeProdutosEdital,
        marcasArray: itensCadastrados.listaMarcas,
        fabricantesArray: itensCadastrados.listaFabricantes,
        loading: false,
        marcasNomes: itensCadastrados.marcasCadastradas,
        fabricantesNomes: itensCadastrados.fabricantesCadastrados,
      });
    }
  };

  componentDidUpdate = async () => {
    const { payload, concluidoStep1 } = this.props;
    const {
      loading,
      marcasArray,
      fabricantesArray,
      dafaultArrayProtocolo,
      retornadoAoStep,
    } = this.state;
    let listaNomeDeProdutosEdital = [];
    let listaMarcas = [];
    let listaFabricantes = [];
    if (Step1EstaValido(payload) && concluidoStep1 && !retornadoAoStep) {
      this.setState({
        payloadStep1: retornaObjetoRequest(payload),
        dafaultArrayProtocolo,
        retornadoAoStep: true,
      });
    }
    if (marcasArray.length === 0 && loading && fabricantesArray.length === 0) {
      const responseNomeDeProdutosEdital = await getNomeDeProdutosEdital();
      const responseMarcas = await getMarcasProdutos();
      const responseFabricantes = await getFabricantesProdutos();

      responseNomeDeProdutosEdital.data.results.forEach((produtoEdital) => {
        listaNomeDeProdutosEdital.push(
          <Option key={`${produtoEdital.nome}+${produtoEdital.uuid}`}>
            {produtoEdital.nome}
          </Option>
        );
      });

      responseMarcas.data.results.forEach((marca) => {
        listaMarcas.push(
          <Option key={`${marca.nome}+${marca.uuid}`}>{marca.nome}</Option>
        );
      });

      responseFabricantes.data.results.forEach((fabricante) => {
        listaFabricantes.push(
          <Option key={`${fabricante.nome}+${fabricante.uuid}`}>
            {fabricante.nome}
          </Option>
        );
      });
      this.setState({
        nomeDeProdutosEditalArray: listaNomeDeProdutosEdital,
        marcasArray: listaMarcas,
        fabricantesArray: listaFabricantes,
        loading: false,
      });
    }
  };

  extrairUuidString = (string) => {
    return string.split("+")[1];
  };

  setaCampoDetalhesDieta = (value) => {
    let { payloadStep1 } = this.state;
    payloadStep1.detalhes_da_dieta = value;
    this.setState({ payloadStep1 });
    this.props.setaAtributosPrimeiroStep(payloadStep1);
  };

  setaCampoDetalheAlergenico = (value) => {
    let { payloadStep1 } = this.state;
    payloadStep1.aditivos = value;
    this.setState({ payloadStep1 });
    this.props.setaAtributosPrimeiroStep(payloadStep1);
  };

  setaNomeProduto = (value) => {
    let { payloadStep1 } = this.state;
    payloadStep1.nome = value.split("+")[0];
    this.setState({ payloadStep1 });
    this.props.setaAtributosPrimeiroStep(payloadStep1);
  };

  setaNomeComponentes = (value) => {
    let { payloadStep1 } = this.state;
    payloadStep1.componentes = value.toUpperCase();
    this.setState({ payloadStep1 });
    this.props.setaAtributosPrimeiroStep(payloadStep1);
  };

  addMarca = (value) => {
    this.props.setDefaultMarcaStep1(value);
    let { payloadStep1 } = this.state;
    const uuid = this.extrairUuidString(value);
    payloadStep1.marca = uuid;
    this.setState({ payloadStep1 });
    this.props.setaAtributosPrimeiroStep(payloadStep1);
  };

  addFabricante = (value) => {
    this.props.setDefaultFabricanteStep1(value);
    let { payloadStep1 } = this.state;
    const uuid = this.extrairUuidString(value);
    payloadStep1.fabricante = uuid;
    this.setState({ payloadStep1 });
    this.props.setaAtributosPrimeiroStep(payloadStep1);
  };

  render() {
    const { nomeDeProdutosEditalArray, marcasArray, fabricantesArray } =
      this.state;
    const {
      renderizaFormAlergenicos,
      defaultNomeDeProdutosEditalStep1,
      defaultMarcaStep1,
      defaultFabricanteStep1,
    } = this.props;
    return (
      <div className="cadastro-produto-step1">
        <div className="card-title">Identificação do Produto</div>
        <div className="row">
          <div className="col-12 pt-3">
            <label className="label-formulario-produto">
              <nav>*</nav>Nome do produto
            </label>
            <Field
              component={ASelect}
              className={"select-form-produto"}
              showSearch
              name="nome"
              filterOption={(inputValue, option) => {
                return option.props.children
                  .toString()
                  .toLowerCase()
                  .includes(inputValue.toLowerCase());
              }}
              onSelect={this.setaNomeProduto}
              defaultValue={defaultNomeDeProdutosEditalStep1}
              onBlur={(e) => {
                e.preventDefault();
              }}
              validate={required}
            >
              {nomeDeProdutosEditalArray}
            </Field>
          </div>
        </div>
        <div className="row pt-3">
          <div className="col-4">
            <label className="label-formulario-produto">
              <nav>*</nav>Marca do produto
            </label>
            <Field
              component={ASelect}
              onBlur={(e) => {
                e.preventDefault();
              }}
              className={"select-form-produto"}
              showSearch
              filterOption={(inputValue, option) => {
                return option.props.children
                  .toString()
                  .toLowerCase()
                  .includes(inputValue.toLowerCase());
              }}
              name="marca"
              onSelect={this.addMarca}
              defaultValue={defaultMarcaStep1}
            >
              {marcasArray}
            </Field>
          </div>
          <div className="col-4">
            <label className="label-formulario-produto">
              <nav>*</nav>Nome do fabricante
            </label>
            <Field
              component={ASelect}
              onBlur={(e) => {
                e.preventDefault();
              }}
              className={"select-form-produto"}
              filterOption={(inputValue, option) => {
                return option.props.children
                  .toString()
                  .toLowerCase()
                  .includes(inputValue.toLowerCase());
              }}
              showSearch
              name="fabricante"
              onSelect={this.addFabricante}
              defaultValue={defaultFabricanteStep1}
            >
              {fabricantesArray}
            </Field>
          </div>
          <div className="col-4 adicionar-marca-fornecedor">
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
        </div>
        <div className="link-with-student">
          <div className="label">
            <span className="required-asterisk">*</span>O produto se destina ao
            atendimento de alunos com dieta especial?
          </div>
          <div className="row">
            <div className="col-3">
              <label className="container-radio">
                Sim
                <Field
                  component={"input"}
                  type="radio"
                  value="1"
                  name="eh_para_alunos_com_dieta"
                  onClick={() => {
                    this.abreOuFechaFormDietaEspecial(1);
                  }}
                  required
                />
                <span className="checkmark" />
              </label>
            </div>
            <div className="col-3">
              <label className="container-radio">
                Não
                <Field
                  component={"input"}
                  type="radio"
                  value="0"
                  name="eh_para_alunos_com_dieta"
                  onClick={() => {
                    this.abreOuFechaFormDietaEspecial(0);
                  }}
                />
                <span className="checkmark" />
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 pt-3">
            <Field
              component={TextArea}
              label="Nome dos componentes do produto"
              name="componentes"
              type="text"
              validate={[maxLength5000]}
              maxLength={5001}
              onChange={(event) => {
                this.setaNomeComponentes(event.target.value);
              }}
              required
            />
          </div>
        </div>
        <div className="link-with-student">
          <div className="label">
            <span className="required-asterisk">*</span>O produto contém ou pode
            conter ingredientes/aditivos alergênicos?
          </div>

          <div className="row">
            <div className="col-3">
              <label className="container-radio">
                Sim
                <Field
                  component={"input"}
                  type="radio"
                  value="1"
                  name="tem_aditivos_alergenicos"
                  onClick={() => {
                    this.abreOuFechaFormAlergenico(1);
                  }}
                />
                <span className="checkmark" />
              </label>
            </div>
            <div className="col-3">
              <label className="container-radio">
                Não
                <Field
                  component={"input"}
                  type="radio"
                  value="0"
                  name="tem_aditivos_alergenicos"
                  onClick={() => {
                    this.abreOuFechaFormAlergenico(0);
                  }}
                />
                <span className="checkmark" />
              </label>
            </div>
          </div>

          {renderizaFormAlergenicos && (
            <div className="row">
              <div className="col-12 pb-5">
                <Field
                  component={TextArea}
                  label={"Quais?"}
                  name="aditivos"
                  onChange={(event) => {
                    this.setaCampoDetalheAlergenico(event.target.value);
                  }}
                  required
                />
              </div>
            </div>
          )}
        </div>
        <div className="row">
          <div className="col-5">
            <div className="card-warning mt-3">
              <strong>IMPORTANTE:</strong> Relacioná-los conforme dispõe a RDC
              nº 26 de 02/07/15
            </div>
          </div>
        </div>
        <div className="link-with-student">
          <div className="label">
            <span className="required-asterisk">*</span>O produto contém glúten?
          </div>

          <div className="row">
            <div className="col-3">
              <label className="container-radio">
                Sim
                <Field
                  component={"input"}
                  type="radio"
                  value="1"
                  name="tem_gluten"
                  onClick={() => {
                    this.produtoTemGluten(1);
                  }}
                />
                <span className="checkmark" />
              </label>
            </div>
            <div className="col-3">
              <label className="container-radio">
                Não
                <Field
                  component={"input"}
                  type="radio"
                  value="0"
                  name="tem_gluten"
                  onClick={() => {
                    this.produtoTemGluten(0);
                  }}
                />
                <span className="checkmark" />
              </label>
            </div>
          </div>
        </div>
        <ModalCadastrarItem
          closeModal={this.closeModalCadastrarItem}
          showModal={this.state.showModalCadastrarItem}
          item={undefined}
          changePage={this.updateOpcoesItensCadastrados}
        />
      </div>
    );
  }
}

export default Step1;
