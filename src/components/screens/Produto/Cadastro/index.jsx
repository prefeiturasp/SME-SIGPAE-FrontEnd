import React, { Component, Fragment } from "react";
import HTTP_STATUS from "http-status-codes";
import { reduxForm } from "redux-form";
import Wizard from "../../../Shareable/Wizard";
import Step1 from "./Step1";
import Botao from "../../../Shareable/Botao";
import { BUTTON_TYPE, BUTTON_STYLE } from "../../../Shareable/Botao/constants";
import { loadProduto } from "../../../../reducers/produto.reducer";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  submitProduto,
  getInformacoesGrupo,
  updateProduto,
  getRascunhosDeProduto,
  excluirRascunhoDeProduto,
  excluirImagemDoProduto,
  produtoJaExiste,
} from "../../../../services/produto.service";
import BuscaProduto from "./BuscaProduto";
import validate from "./validate";
import { validaFormularioStep1, retornaPayloadDefault } from "./helpers";
import { toastError, toastSuccess } from "../../../Shareable/Toast/dialogs";
import { getError, deepCopy } from "../../../../helpers/utilities";
import { Rascunhos } from "./Rascunhos";
import "./style.scss";

class cadastroProduto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rascunhos: [],
      currentStep: 0,
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

      payload: {
        uuid: null,
        nome_de_produto_edital: null,
        marca: null,
        fabricante: null,
        imagens: [],
        informacoes_nutricionais: [],
        nome: null,
        eh_para_alunos_com_dieta: false,
        componentes: "",
        tem_aditivos_alergenicos: false,
        aditivos: null,
        tipo: null,
        especificacoes: null,
        embalagem: null,
        prazo_validade: null,
        info_armazenamento: null,
        outras_informacoes: null,
        numero_registro: null,
        porcao: null,
        unidade_caseira: null,
      },
      renderizaFormAlergenicos: false,
      arrayErrosStep1: [],
      concluidoStep1: false,
      defaultNomeDeProdutosEditalStep1: null,
      defaultMarcaStep1: null,
      defaultFabricanteStep1: null,
      informacoesAgrupadas: null,
      renderBuscaProduto: true,
      blockProximoStep3: false,
    };
    this.exibeFormularioInicial = this.exibeFormularioInicial.bind(this);
    this.setaAtributosPrimeiroStep = this.setaAtributosPrimeiroStep.bind(this);
    this.mostrarFormAlergenico = this.mostrarFormAlergenico.bind(this);
    this.setArrayErrosStep1 = this.setArrayErrosStep1.bind(this);
    this.setDefaultNomeDeProdutosEditalStep1 =
      this.setDefaultNomeDeProdutosEditalStep1.bind(this);
    this.setDefaultMarcaStep1 = this.setDefaultMarcaStep1.bind(this);
    this.setDefaultFabricanteStep1 = this.setDefaultFabricanteStep1.bind(this);
    this.setaValoresStep2 = this.setaValoresStep2.bind(this);
    this.removeFile = this.removeFile.bind(this);
    this.setFiles = this.setFiles.bind(this);
    this.removerRascunho = this.removerRascunho.bind(this);
    this.setBlockProximo = this.setBlockProximo.bind(this);
    this.resetModal = this.resetModal.bind(this);
  }

  setaValoresStep2 = ({
    informacoes_nutricionais,
    porcao,
    unidade_caseira,
  }) => {
    const { payload } = this.state;
    payload["informacoes_nutricionais"] = informacoes_nutricionais;
    payload["porcao"] = porcao;
    payload["unidade_caseira"] = unidade_caseira;

    this.setState({ payload, blockProximoStep3: false });
  };

  setArrayErrosStep1 = (erros) => {
    this.setState({
      arrayErrosStep1: erros,
    });
  };

  getRascunhos() {
    getRascunhosDeProduto().then((response) => {
      const rascunhos = response.data.results;
      this.setState({ rascunhos });
    });
  }

  setBlockProximo = () => {
    this.setState({ blockProximoStep3: true });
  };

  removerRascunho = (id_externo, uuid) => {
    if (window.confirm("Deseja remover este rascunho?")) {
      excluirRascunhoDeProduto(uuid).then(
        (res) => {
          if (res.status === HTTP_STATUS.NO_CONTENT) {
            toastSuccess(`Rascunho # ${id_externo} excluído com sucesso`);
            this.getRascunhos();
          } else {
            toastError(`Erro ao remover rascunho`);
          }
        },
        function () {
          toastError("Houve um erro ao excluir o rascunho");
        }
      );
    }
  };

  carregarRascunho(param) {
    const produtoRaw = deepCopy(param.produto);
    const produto = param.produto;
    this.props.reset("cadastroProduto");
    this.props.loadProduto(produto);
    produto.eh_para_alunos_com_dieta = produtoRaw.eh_para_alunos_com_dieta;
    produto.tem_aditivos_alergenicos = produtoRaw.tem_aditivos_alergenicos;
    produto.marca = produtoRaw.marca !== null ? produtoRaw.marca.uuid : null;
    produto.fabricante =
      produtoRaw.fabricante !== null ? produtoRaw.fabricante.uuid : null;
    let informacoes_nutricionais = [];
    produtoRaw.informacoes_nutricionais.forEach((informacaoNutricional) => {
      informacoes_nutricionais.push({
        informacao_nutricional:
          informacaoNutricional.informacao_nutricional.uuid,
        valor_diario: informacaoNutricional.valor_diario,
        quantidade_porcao: informacaoNutricional.quantidade_porcao,
      });
    });
    produto.imagens_salvas = produtoRaw.imagens;
    produto.imagens = produtoRaw.imagens;
    produto.informacoes_nutricionais = informacoes_nutricionais;
    this.setState({
      renderBuscaProduto: false,
      payload: produto,
      renderizaFormAlergenicos: produtoRaw.tem_aditivos_alergenicos,
    });
  }

  removerAnexo = async (uuid, index) => {
    if (window.confirm("Deseja remover este anexo do rascunho?")) {
      excluirImagemDoProduto(uuid)
        .then((response) => {
          if (response.status === HTTP_STATUS.NO_CONTENT) {
            toastSuccess("Arquivo excluído do rascunho com sucesso!");
            let payload = this.state.payload;
            payload.imagens_salvas.splice(index, 1);
            this.setState({ payload });
            this.getRascunhos();
          } else {
            toastError("Erro ao excluir o arquivo");
          }
        })
        .catch(() => {
          toastError("Erro ao excluir o arquivo");
        });
    }
  };

  componentDidMount = async () => {
    const infoAgrupada = await getInformacoesGrupo();
    this.setState({
      informacoesAgrupadas: infoAgrupada.data.results,
    });
    this.getRascunhos();
  };

  exibeFormularioInicial = () => {
    this.props.loadProduto(null);
    this.setState({ renderBuscaProduto: false });
  };

  mostrarFormAlergenico = (value) => {
    this.setState({
      renderizaFormAlergenicos: value,
    });
  };

  setDefaultNomeDeProdutosEditalStep1 = (value) => {
    this.setState({
      defaultNomeDeProdutosEditalStep1: value,
    });
  };

  setDefaultMarcaStep1 = (value) => {
    this.setState({
      defaultMarcaStep1: value,
    });
  };

  setDefaultFabricanteStep1 = (value) => {
    this.setState({
      defaultFabricanteStep1: value,
    });
  };

  removeFile = (index) => {
    let { payload } = this.state;
    payload.imagens.splice(index, 1);
    this.setState({ payload });
  };

  setFiles = (imagens) => {
    if (imagens.length > 0) {
      const img = imagens.map((imagem) => {
        return {
          arquivo: imagem.base64,
          nome: imagem.nome,
        };
      });
      let { payload } = this.state;
      payload.imagens = img;
      this.setState({ payload });
    }
  };

  setaAtributosPrimeiroStep = ({
    nome_de_produto_edital,
    marca,
    fabricante,
    eh_para_alunos_com_dieta,
    detalhes_da_dieta,
    nome,
    componentes,
    tem_aditivos_alergenicos,
    tem_gluten,
    aditivos,
  }) => {
    let { payload } = this.state;

    payload.nome_de_produto_edital = nome_de_produto_edital;
    payload.marca = marca;
    payload.fabricante = fabricante;
    payload.eh_para_alunos_com_dieta = eh_para_alunos_com_dieta;
    payload.detalhes_da_dieta = detalhes_da_dieta;
    payload.nome = nome;
    payload.componentes = componentes;
    payload.tem_aditivos_alergenicos = tem_aditivos_alergenicos;
    payload.tem_gluten = tem_gluten;
    payload.aditivos = aditivos;

    this.setState({ payload, concluidoStep1: true });
  };

  onSubmit = async (values) => {
    let erro = null;
    const { payload } = this.state;
    payload["nome"] = values.nome.split("+")[0];
    payload["tipo"] = values.tipo;
    payload["embalagem"] = values.embalagem;
    payload["prazo_validade"] = values.prazo_validade;
    payload["info_armazenamento"] = values.info_armazenamento;
    payload["outras_informacoes"] = values.outras_informacoes;
    payload["numero_registro"] = values.numero_registro;
    payload["cadastro_finalizado"] = true;
    if (
      values.especificacoes &&
      Object.keys(values.especificacoes[0]).length === 0
    ) {
      payload["especificacoes"] = [];
    } else {
      payload["especificacoes"] = values.especificacoes;
    }
    if (!payload["tem_aditivos_alergenicos"]) {
      delete payload["aditivos"];
    }
    if ([null, undefined].includes(values.tem_gluten)) {
      erro = "O campo contém glúten é obrigatório";
    }
    if ([null, undefined, ""].includes(values.componentes)) {
      erro = "Informe os componentes do produto";
    }
    if (erro !== null) {
      toastError(erro);
      return;
    }
    const endpoint = payload.uuid ? updateProduto : submitProduto;
    const response = await endpoint(payload);
    if (
      response.status === HTTP_STATUS.CREATED ||
      response.status === HTTP_STATUS.OK
    ) {
      toastSuccess("Solicitação de homologação enviada com sucesso.");
      this.setState({
        payload: retornaPayloadDefault(),
        renderizaFormDietaEspecial: false,
        arrayErrosStep1: [],
        concluidoStep1: false,
        defaultNomeDeProdutosEditalStep1: null,
        defaultMarcaStep1: null,
        defaultFabricanteStep1: null,
        renderBuscaProduto: true,
        currentStep: 0,
      });
      this.getRascunhos();
      this.props.reset("cadastroProduto");
    } else if (response.status === HTTP_STATUS.BAD_REQUEST) {
      toastError(getError(response.data));
    } else {
      toastError(`Erro ao criar produto: ${getError(response.data)}`);
    }
  };

  updateOrCreateProduto = async (values) => {
    const { payload, currentStep } = this.state;
    let erro = null;

    payload["nome"] =
      values !== undefined && values.nome ? values.nome.split("+")[0] : "";
    payload["tipo"] = values ? values.tipo : null;
    if (values && values.especificacoes) {
      if (Object.keys(values.especificacoes[0]).length === 0) {
        payload["especificacoes"] = [];
      } else {
        payload["especificacoes"] = values.especificacoes;
      }
    } else {
      payload["especificacoes"] = [];
    }
    payload["embalagem"] = values ? values.embalagem : null;
    payload["prazo_validade"] = values ? values.prazo_validade : null;
    payload["info_armazenamento"] = values ? values.info_armazenamento : null;
    payload["outras_informacoes"] = values ? values.outras_informacoes : null;
    payload["numero_registro"] = values ? values.numero_registro : null;
    if (!payload["porcao"]) {
      delete payload["porcao"];
    }
    if (!payload["unidade_caseira"]) {
      delete payload["unidade_caseira"];
    }
    if (!payload["tem_aditivos_alergenicos"]) {
      delete payload["aditivos"];
    }
    if (values && values.tem_gluten) {
      payload["tem_gluten"] = values.tem_gluten === "1" ? true : false;
    } else {
      delete payload["tem_gluten"];
    }
    if (
      currentStep === 0 &&
      payload["nome"] !== null &&
      payload["marca"] !== null &&
      payload["fabricante"] !== null
    ) {
      const resposta = await produtoJaExiste(
        payload["nome"],
        payload["marca"],
        payload["fabricante"]
      );

      if (resposta.status !== HTTP_STATUS.OK) {
        erro = "Erro ao consultar se produto já existe.";
      } else if (resposta.data.produto_existe) {
        erro = "Produto já existente, não é permitido cadastro em duplicidade.";
      }
    }

    if (erro !== null) {
      toastError(erro);
    } else {
      if (!payload.uuid) {
        submitProduto(payload).then((response) => {
          if (response.status === HTTP_STATUS.CREATED) {
            toastSuccess("Rascunho salvo com sucesso.");
            payload.uuid = response.data.uuid;
            this.setState({ payload });
            setTimeout(function () {
              window.location.reload();
            }, 2000);
          } else if (response.status === HTTP_STATUS.BAD_REQUEST) {
            toastError(getError(response.data));
          } else {
            toastError(`Erro ao salvar rascunho: ${getError(response.data)}`);
          }
        });
      } else {
        const response = await updateProduto(payload);
        if (response.status === HTTP_STATUS.OK) {
          toastSuccess("Rascunho atualizado com sucesso.");
          setTimeout(function () {
            window.location.reload();
          }, 2000);
        } else if (response.status === HTTP_STATUS.BAD_REQUEST) {
          toastError(getError(response.data));
        } else {
          toastError(`Erro ao atualizar rascunho: ${getError(response.data)}`);
        }
      }
    }
  };

  resetModal = () => {
    this.props.change("nome_marca", null);
    this.props.change("nome_fabricante", null);
  };

  validarFormulario = async () => {
    const { payload, currentStep } = this.state;

    let erros = [];
    if (currentStep === 0) {
      erros = await validaFormularioStep1(payload);
    }

    if (erros.length > 0) {
      toastError(erros.join(" - "));
    } else {
      this.setState({ currentStep: currentStep + 1 });
    }
  };

  render() {
    const {
      wizardSteps,
      currentStep,
      informacoesAgrupadas,
      renderBuscaProduto,
      renderizaFormDietaEspecial,
      renderizaFormAlergenicos,
      payload,
      concluidoStep1,
      defaultNomeDeProdutosEditalStep1,
      defaultMarcaStep1,
      defaultFabricanteStep1,
      rascunhos,
      blockProximoStep3,
    } = this.state;
    const { handleSubmit } = this.props;
    return (
      <Fragment>
        {rascunhos.length > 0 && renderBuscaProduto && (
          <div className="mt-3">
            <span className="page-title">Rascunhos</span>
            <Rascunhos
              rascunhos={rascunhos}
              removerRascunho={this.removerRascunho}
              resetForm={() => this.resetForm()}
              carregarRascunho={(params) => this.carregarRascunho(params)}
            />
          </div>
        )}
        <div className="card mt-3">
          <div className="card-body">
            {renderBuscaProduto ? (
              <BuscaProduto
                exibeFormularioInicial={this.exibeFormularioInicial}
              />
            ) : (
              <form onSubmit={handleSubmit}>
                <Wizard
                  arrayOfObjects={wizardSteps}
                  currentStep={currentStep}
                  outerParam="step"
                  nameItem="nome"
                />
                {currentStep === 0 && (
                  <Step1
                    setaAtributosPrimeiroStep={this.setaAtributosPrimeiroStep}
                    renderizaFormDietaEspecial={renderizaFormDietaEspecial}
                    mostrarFormAlergenico={this.mostrarFormAlergenico}
                    renderizaFormAlergenicos={renderizaFormAlergenicos}
                    setArrayErrosStep1={this.setArrayErrosStep1}
                    payload={payload}
                    concluidoStep1={concluidoStep1}
                    setDefaultNomeDeProdutosEditalStep1={
                      this.setDefaultNomeDeProdutosEditalStep1
                    }
                    defaultNomeDeProdutosEditalStep1={
                      defaultNomeDeProdutosEditalStep1
                    }
                    setDefaultMarcaStep1={this.setDefaultMarcaStep1}
                    defaultMarcaStep1={defaultMarcaStep1}
                    setDefaultFabricanteStep1={this.setDefaultFabricanteStep1}
                    defaultFabricanteStep1={defaultFabricanteStep1}
                    resetModal={this.resetModal}
                  />
                )}
                {currentStep === 1 && (
                  <Step2
                    informacoesAgrupadas={informacoesAgrupadas}
                    payload={payload}
                    setaValoresStep2={this.setaValoresStep2}
                    setBlockProximo={this.setBlockProximo}
                  />
                )}
                {currentStep === 2 && (
                  <Step3
                    payload={payload}
                    removeFile={this.removeFile}
                    setFiles={this.setFiles}
                    removerAnexo={this.removerAnexo}
                  />
                )}
                <div className="row">
                  <div className="col-12 mt-3">
                    <hr />
                  </div>
                  <div className="col-12 text-end pt-3">
                    <Botao
                      texto={"Anterior"}
                      className="me-3"
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      disabled={currentStep === 0}
                      onClick={() =>
                        this.setState({ currentStep: currentStep - 1 })
                      }
                    />
                    <Botao
                      texto={"Salvar Rascunho"}
                      className="me-3 salvarRascunho"
                      type={BUTTON_TYPE.SUBMIT}
                      style={BUTTON_STYLE.GREEN}
                      onClick={handleSubmit((values) =>
                        this.updateOrCreateProduto({
                          ...values,
                        })
                      )}
                      disabled={
                        (currentStep === 1 &&
                          payload.informacoes_nutricionais.length === 0) ||
                        blockProximoStep3
                      }
                    />
                    {currentStep !== 2 &&
                      (currentStep === 1 ? (
                        payload.informacoes_nutricionais.length === 0 ||
                        blockProximoStep3 ? (
                          <Botao
                            texto={"Próximo"}
                            type={BUTTON_TYPE.BUTTON}
                            style={BUTTON_STYLE.GREEN_OUTLINE}
                            onClick={() => this.validarFormulario()}
                            disabled
                          />
                        ) : (
                          <Botao
                            texto={"Próximo"}
                            type={BUTTON_TYPE.BUTTON}
                            style={BUTTON_STYLE.GREEN_OUTLINE}
                            onClick={() => this.validarFormulario()}
                          />
                        )
                      ) : (
                        <Botao
                          texto={"Próximo"}
                          type={BUTTON_TYPE.BUTTON}
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                          onClick={() => this.validarFormulario()}
                        />
                      ))}

                    {currentStep === 2 && (
                      <Botao
                        texto={"Enviar"}
                        dataTestId="botao-enviar"
                        type={BUTTON_TYPE.SUBMIT}
                        style={BUTTON_STYLE.GREEN}
                        onClick={handleSubmit((values) =>
                          this.onSubmit({
                            ...values,
                          })
                        )}
                      />
                    )}
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </Fragment>
    );
  }
}

const componentNameForm = reduxForm({
  form: "cadastroProduto",
  validate: validate,
  enableReinitialize: true,
})(cadastroProduto);

const mapStateToProps = (state) => {
  return {
    initialValues: state.cadastroProduto.data,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      loadProduto,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(componentNameForm);
