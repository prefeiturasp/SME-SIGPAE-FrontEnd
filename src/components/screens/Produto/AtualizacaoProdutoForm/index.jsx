import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Select, Spin } from "antd";
import Botao from "../../../Shareable/Botao";
import ModalHistorico from "../../../Shareable/ModalHistorico";
import { BUTTON_TYPE, BUTTON_STYLE } from "../../../Shareable/Botao/constants";

import "./styles.scss";
import {
  STATUS_CODAE_SUSPENDEU,
  STATUS_CODAE_QUESTIONADO,
  STATUS_CODAE_AUTORIZOU_RECLAMACAO,
  STATUS_TERCEIRIZADA_CANCELOU_SOLICITACAO,
} from "src/configs/constants";
import WizardFormPrimeiraPagina from "./components/WizardFormPrimeiraPagina";
import WizardFormSegundaPagina from "./components/WizardFormSegundaPagina";
import WizardFormTerceiraPagina from "./components/WizardFormTerceiraPagina";
import Wizard from "src/components/Shareable/Wizard";
import {
  getHomologacao,
  getMarcasProdutos,
  getFabricantesProdutos,
  getInformacoesGrupo,
  TerceirizadaCancelaSoliticaoCorrecao,
} from "../../../../services/produto.service";
import { connect } from "react-redux";
import { getFormValues } from "redux-form";
import MotivoEvento from "src/components/Shareable/MotivoEvento";
import MotivoHomologacao from "../../../Shareable/MotivoHomologacao";
import InformativoReclamacao from "src/components/Shareable/InformativoReclamacao";
import { ModalPadrao } from "src/components/Shareable/ModalPadrao";

const { Option } = Select;

class AtualizacaoProdutoForm extends Component {
  constructor(props) {
    super(props);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.passouPrimeiroStep = this.passouPrimeiroStep.bind(this);
    this.passouSegundoStep = this.passouSegundoStep.bind(this);
    this.passouTerceiroStep = this.passouTerceiroStep.bind(this);
    this.state = {
      arrayMarcas: [],
      arrayFabricantes: [],
      page: 0,
      uuid: null,
      loading: true,
      produto: null,
      homologacao: null,
      logs: [],
      informacoesNutricionais: null,
      erro: false,
      primeiroStep: false,
      segundoStep: false,
      terceiroStep: false,
      valoresPrimeiroForm: null,
      valoresSegundoForm: null,
      valoresterceiroForm: null,
      reclamacaoProduto: null,
      verificado: false,
      visible: false,
      showModal: false,
      wizardSteps: [
        {
          step: {
            nome: "Identificação",
          },
        },
        {
          step: {
            nome: "Informação Nutricional",
          },
        },
        {
          step: {
            nome: "Informação do Produto",
          },
        },
      ],
    };
  }

  passouSegundoStep(values) {
    values["informacoes_nutricionais"] = [];
    const arrayKeys = Object.keys(values);
    let informacoes = [];
    arrayKeys.forEach((item) => {
      item.includes("informacao=") && informacoes.push(item);
    });
    informacoes.forEach((informacao) => {
      const uuid = informacao.split("=")[1];
      values["informacoes_nutricionais"].push({
        informacao_nutricional: uuid,
        quantidade_porcao: values[`${informacao}`].porcao,
        valor_diario: values[`${informacao}`].valor_diario,
      });
    });

    this.setState({ valoresSegundoForm: values, segundoStep: true });
  }

  passouPrimeiroStep(valuesForm, produtoForm) {
    valuesForm["eh_para_alunos_com_dieta"] =
      produtoForm["eh_para_alunos_com_dieta"];
    valuesForm["tem_aditivos_alergenicos"] =
      produtoForm["tem_aditivos_alergenicos"];
    valuesForm["tem_gluten"] = produtoForm["tem_gluten"];
    this.setState({ primeiroStep: true, valoresPrimeiroForm: valuesForm });
  }

  passouTerceiroStep(valuesForm) {
    this.setState({ terceiroStep: true, valoresterceiroForm: valuesForm });
  }

  montaOptions = (options) => {
    let optionsArray = [];
    options.forEach((option) => {
      optionsArray.push(<Option key={option.uuid}>{`${option.nome}`}</Option>);
    });
    return optionsArray;
  };

  showModalHistorico = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  showModal = () => {
    this.setState({
      showModal: true,
    });
  };

  closeModal = () => {
    this.setState({
      showModal: false,
    });
  };

  componentDidMount = async () => {
    let { produto, homologacao, informacoesNutricionais, logs } = this.state;
    let homologacao_dados = null;
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    try {
      homologacao_dados = await getHomologacao(uuid);
      produto = homologacao_dados.data.produto;
      homologacao = homologacao_dados.data;
      logs = homologacao_dados.data.logs;
    } catch {
      this.setState({
        loading: false,
        erro: true,
      });
    }
    let marcas = await getMarcasProdutos();
    let fabricantes = await getFabricantesProdutos();
    let response = await getInformacoesGrupo();
    let arrayMarcas = this.montaOptions(marcas.data.results);
    let arrayFabricantes = this.montaOptions(fabricantes.data.results);
    informacoesNutricionais = response.data.results.map((item) => {
      item["ativo"] = false;
      return item;
    });
    this.setState({
      arrayMarcas,
      arrayFabricantes,
      produto,
      homologacao,
      logs,
      informacoesNutricionais,
    });
  };

  componentDidUpdate() {
    const { produto, erro, loading, arrayMarcas, arrayFabricantes } =
      this.state;
    if (
      arrayMarcas.length > 0 &&
      arrayFabricantes.length > 0 &&
      produto !== null &&
      !erro &&
      loading
    ) {
      this.setState({ loading: false });
    }
  }

  nextPage() {
    this.setState({ page: this.state.page + 1 });
  }

  previousPage() {
    this.setState({ page: this.state.page - 1 });
  }

  getHistorico = () => {
    return this.state.logs;
  };

  render() {
    const { onSubmit, values } = this.props;
    const {
      page,
      wizardSteps,
      loading,
      erro,
      produto,
      homologacao,
      arrayMarcas,
      arrayFabricantes,
      primeiroStep,
      informacoesNutricionais,
      valoresPrimeiroForm,
      valoresSegundoForm,
      segundoStep,
      valoresterceiroForm,
      terceiroStep,
      logs,
    } = this.state;
    const status = produto ? produto.homologacao.status : null;

    return (
      <div className="card">
        <div className="card-body">
          {!loading && !erro ? (
            <Fragment>
              {!!logs.length &&
                !!status &&
                status === STATUS_CODAE_AUTORIZOU_RECLAMACAO && (
                  <InformativoReclamacao homologacao={produto.homologacao} />
                )}

              {!!logs.length &&
                !!status &&
                status === STATUS_CODAE_SUSPENDEU && (
                  <MotivoEvento
                    logs={logs}
                    titulo="Motivo da suspensão"
                    motivo="CODAE suspendeu o produto"
                  />
                )}

              {!!logs.length &&
                !!status &&
                status === STATUS_CODAE_QUESTIONADO && (
                  <MotivoEvento
                    logs={logs}
                    titulo="Motivo da solicitação de correção do produto"
                    motivo="Questionamento pela CODAE"
                  />
                )}

              {!!logs.length &&
                !!status &&
                status !== STATUS_CODAE_SUSPENDEU &&
                status !== STATUS_CODAE_AUTORIZOU_RECLAMACAO && (
                  <Fragment>
                    <MotivoEvento
                      logs={logs}
                      titulo="Motivo da recusa de homologação"
                      motivo="CODAE não homologou"
                    />
                    <MotivoHomologacao logs={logs} />
                  </Fragment>
                )}

              {!!logs.length &&
                !!status &&
                status === STATUS_TERCEIRIZADA_CANCELOU_SOLICITACAO && (
                  <MotivoEvento
                    logs={logs}
                    titulo="Motivo do cancelamento da homologação"
                    motivo="Terceirizada cancelou solicitação de homologação de produto"
                  />
                )}

              <div className="row mb-2">
                <div className="col-12" style={{ alignItems: "flex-end" }}>
                  <Botao
                    type={BUTTON_TYPE.BUTTON}
                    texto="Histórico"
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    onClick={this.showModalHistorico}
                    className="float-end"
                  />
                </div>
              </div>
              <ModalHistorico
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                logs={logs}
                getHistorico={this.getHistorico}
              />
              <ModalPadrao
                showModal={this.state.showModal}
                closeModal={this.closeModal}
                toastSuccessMessage="Cancelamento enviado com sucesso."
                modalTitle="Envio de Cancelamento da Solicitação de Correção"
                endpoint={TerceirizadaCancelaSoliticaoCorrecao}
                uuid={produto.homologacao.uuid}
                justificativa={produto.homologacao.justificativa}
                labelJustificativa="Justificativa"
                helpText={undefined}
                eAnalise={false}
                status={produto.homologacao.status}
                terceirizada={produto.homologacao.rastro_terceirizada}
                cancelaAnaliseSensorial={homologacao}
              />
              <Wizard
                arrayOfObjects={wizardSteps}
                currentStep={page}
                outerParam="step"
                nameItem="nome"
              />
              {page === 0 && (
                <WizardFormPrimeiraPagina
                  onSubmit={this.nextPage}
                  passouPrimeiroStep={this.passouPrimeiroStep}
                  arrayMarcas={arrayMarcas}
                  arrayFabricantes={arrayFabricantes}
                  produto={produto}
                  loading={loading}
                  primeiroStep={primeiroStep}
                  valoresPrimeiroForm={valoresPrimeiroForm}
                  valuesForm={values}
                  showModal={this.showModal}
                />
              )}
              {page === 1 && (
                <WizardFormSegundaPagina
                  previousPage={this.previousPage}
                  onSubmit={this.nextPage}
                  valuesForm={values}
                  produto={produto}
                  informacoes={informacoesNutricionais}
                  valoresSegundoForm={valoresSegundoForm}
                  segundoStep={segundoStep}
                  passouSegundoStep={this.passouSegundoStep}
                  showModal={this.showModal}
                />
              )}
              {page === 2 && (
                <WizardFormTerceiraPagina
                  previousPage={this.previousPage}
                  onSubmit={onSubmit}
                  valuesForm={values}
                  produto={produto}
                  homologacao={homologacao}
                  valoresSegundoForm={valoresSegundoForm}
                  valoresterceiroForm={valoresterceiroForm}
                  terceiroStep={terceiroStep}
                  passouTerceiroStep={this.passouTerceiroStep}
                  showModal={this.showModal}
                />
              )}
            </Fragment>
          ) : !erro ? (
            <div className="carregando-conteudo">
              <Spin tip="Carregando..." />
            </div>
          ) : (
            <div>Erro ao carregar Produto</div>
          )}
        </div>
      </div>
    );
  }
}

AtualizacaoProdutoForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  values: getFormValues("atualizacaoProduto")(state) || {},
});

export default connect(mapStateToProps)(AtualizacaoProdutoForm);
