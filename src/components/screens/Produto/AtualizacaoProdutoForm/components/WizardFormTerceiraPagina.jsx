import React, { Component } from "react";
import HTTP_STATUS from "http-status-codes";
import { Field, FieldArray, reduxForm } from "redux-form";
import InputText from "../../../../Shareable/Input/InputText";
import { required } from "../../../../../helpers/fieldValidators";
import { TextArea } from "../../../../Shareable/TextArea/TextArea";
import TooltipIcone from "src/components/Shareable/TooltipIcone";
import Especificacoes from "./components/Especificacoes";
import { STATUS_CODAE_QUESTIONADO } from "src/configs/constants";
import {
  updateProduto,
  excluirImagemDoProduto,
  alteracaoProdutoHomologado,
} from "src/services/produto.service";
import { getError, ehUsuarioEmpresa } from "src/helpers/utilities";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import "./styles.scss";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import withNavigate from "src/components/Shareable/withNavigate";
import ManagedInputFileField from "src/components/Shareable/Input/InputFile/ManagedField";
import ModalConfirmacaoSimNao from "src/components/Shareable/ModalConfirmacaoSimNao";
import {
  getUnidadesDeMedidaProduto,
  getEmbalagensProduto,
} from "src/services/produto.service";

class WizardFormTerceiraPagina extends Component {
  constructor(props) {
    super(props);
    this.state = {
      produto: null,
      arquivos: [],
      unidades_de_medida: null,
      embalagens: null,
      mostraModalConfimacao: false,
      formValues: undefined,
      especificacoesIniciais: this.props.produto.especificacoes,
      status_codae_questionado: false,
      ehUsuarioEmpresa: ehUsuarioEmpresa(),
    };
    this.setFiles = this.setFiles.bind(this);
    this.removeFile = this.removeFile.bind(this);
  }

  updateOpcoesItensCadastrados = async () => {
    const reponseUnidades = await getUnidadesDeMedidaProduto();
    const responseEmbalagens = await getEmbalagensProduto();
    this.setState({
      unidades_de_medida: reponseUnidades.data.results,
      embalagens: responseEmbalagens.data.results,
    });
  };

  componentDidMount = async () => {
    if (this.props.produto !== this.state.produto) {
      this.setState({ produto: this.props.produto });
    }
    if (this.props.produto.homologacao.status === STATUS_CODAE_QUESTIONADO) {
      this.setState({
        status_codae_questionado: true,
      });
    }
    await this.updateOpcoesItensCadastrados();

    const { change, produto, terceiroStep, valoresterceiroForm } = this.props;
    if (terceiroStep) {
      change("numero_registro", valoresterceiroForm.numero_registro);
      change("tipo", valoresterceiroForm.tipo);
      let especificacoes = valoresterceiroForm.especificacoes.length
        ? valoresterceiroForm.especificacoes.map((especificacao) => {
            return {
              volume: especificacao.volume,
              unidade_de_medida: especificacao.unidade_de_medida
                ? especificacao.unidade_de_medida.uuid ||
                  especificacao.unidade_de_medida
                : undefined,
              embalagem_produto: especificacao.embalagem_produto
                ? especificacao.embalagem_produto.uuid ||
                  especificacao.embalagem_produto
                : undefined,
            };
          })
        : [{}];
      change("especificacoes", especificacoes);
      change("prazo_validade", valoresterceiroForm.prazo_validade);
      change("info_armazenamento", valoresterceiroForm.info_armazenamento);
      change("outras_informacoes", valoresterceiroForm.outras_informacoes);
    } else {
      change("numero_registro", produto.numero_registro);
      change("tipo", produto.tipo);
      let especificacoes = produto.especificacoes.length
        ? produto.especificacoes.map((especificacao) => {
            return {
              volume: especificacao.volume,
              unidade_de_medida: especificacao.unidade_de_medida.uuid,
              embalagem_produto: especificacao.embalagem_produto.uuid,
            };
          })
        : [{}];
      change("especificacoes", especificacoes);
      change("prazo_validade", produto.prazo_validade);
      change("info_armazenamento", produto.info_armazenamento);
      change("outras_informacoes", produto.outras_informacoes);
      change("anexos", produto.imagens);
    }
  };

  removeFile(index) {
    let { arquivos } = this.state;
    arquivos.splice(index, 1);
    this.setState({ arquivos });
  }

  setFiles(files) {
    const img = files.map((imagem) => {
      return {
        arquivo: imagem.base64,
        nome: imagem.nome,
      };
    });
    this.setState({ arquivos: img });
  }

  onSubmit = (values) => {
    this.setState({
      mostraModalConfimacao: true,
      formValues: values,
    });
  };

  enviaDados = async (values) => {
    if (this.state.enviando) return;
    this.setState({ enviando: true });

    const { valoresSegundoForm, produto } = this.props;
    values["uuid"] = produto.uuid;
    values["cadastro_atualizado"] = true;
    values["cadastro_finalizado"] = false;
    if (values.anexos) {
      values["imagens"] = values.anexos.map((imagem) => {
        if (imagem.base64) {
          return {
            arquivo: imagem.base64,
            nome: imagem.nome,
          };
        }
        return imagem;
      });
    }
    values["informacoes_nutricionais"] =
      valoresSegundoForm["informacoes_nutricionais"];
    const arrayKeys = Object.keys(values);
    arrayKeys.forEach((item) => {
      item.includes("informacao=") && delete values[item];
    });
    if (values["eh_para_alunos_com_dieta"] === "1") {
      values["eh_para_alunos_com_dieta"] = true;
    } else {
      values["eh_para_alunos_com_dieta"] = false;
    }
    if (values["outras_informacoes"] === undefined) {
      values["outras_informacoes"] = "";
    }
    if (values["tem_aditivos_alergenicos"] === "1") {
      values["tem_aditivos_alergenicos"] = true;
    } else {
      values["tem_aditivos_alergenicos"] = false;
    }
    if (values["aditivos"] === null) {
      values["aditivos"] = "";
    }
    if (!values["numero_registro"]) {
      values["numero_registro"] = "";
    }
    const endpoint =
      this.props.homologacao.esta_homologado &&
      this.props.homologacao.status !== "CODAE_QUESTIONADO"
        ? alteracaoProdutoHomologado
        : updateProduto;
    const response = await endpoint(values, this.props.homologacao.uuid);
    if (response.status === HTTP_STATUS.OK) {
      if (produto.homologacao.status === STATUS_CODAE_QUESTIONADO)
        toastSuccess("Correção efetuada com sucesso.");
      else toastSuccess("Nova homologação solicitada.");
      this.props.navigate("/painel-gestao-produto");
    } else if (response.status === HTTP_STATUS.BAD_REQUEST) {
      toastError(getError(response.data));
    } else if (response.status === HTTP_STATUS.CONFLICT) {
      toastError(getError(response.data));
      this.props.navigate("/painel-gestao-produto");
    } else {
      toastError(`Erro ao atualizar homologação`);
      this.props.navigate("/painel-gestao-produto");
    }
  };

  removerAnexo = async (uuid, index) => {
    if (window.confirm("Deseja remover este anexo do produto?")) {
      excluirImagemDoProduto(uuid)
        .then((response) => {
          if (response.status === HTTP_STATUS.NO_CONTENT) {
            toastSuccess("Arquivo excluído do produto com sucesso!");
            let produto = this.state.produto;
            produto.imagens.splice(index, 1);
            this.setState({ produto });
          } else {
            toastError("Erro ao excluir o arquivo");
          }
        })
        .catch(() => {
          toastError("Erro ao excluir o arquivo");
        });
    }
  };

  render() {
    const { handleSubmit, pristine, previousPage, submitting, valuesForm } =
      this.props;
    const { mostraModalConfimacao, ehUsuarioEmpresa } = this.state;
    return (
      <form
        onSubmit={handleSubmit}
        data-testid="cadastro-form"
        className="cadastro-produto-step3"
      >
        <ModalConfirmacaoSimNao
          showModal={mostraModalConfimacao}
          closeModal={() => this.setState({ mostraModalConfimacao: false })}
          corpo={
            <p>
              Atenção, ao realizar alterações no cadastro, o produto será
              reenviado para homologação. Deseja continuar?
            </p>
          }
          onSimClick={() => this.enviaDados(this.state.formValues)}
          disableSimBtn={this.state.enviando}
          textoBtnSim={this.state.enviando ? "Enviando..." : "Sim"}
        />
        <div className="header-card-title">
          Informação do Produto (classificação)
        </div>
        <div className="row">
          <div className="col-6 pt-3">
            <Field
              component={InputText}
              label="N° de registro do produto no órgão competente"
              tooltipText="Campo específico para inserir o registro dos produtos de origem animal, polpas de frutas e sucos"
              name="numero_registro"
              type="text"
              placeholder="Registro no Ministério da Agricultura SP 000499-5.000060"
              disabled={ehUsuarioEmpresa}
            />
          </div>
          <div className="col-6 pt-3">
            <Field
              component={InputText}
              label="Prazo de Validade"
              tooltipText="Inserir o período de tempo em Dias, Meses ou Anos conforme descrição do rótulo"
              name="prazo_validade"
              type="text"
              placeholder="Digite o prazo da validade"
              required
              validate={required}
              disabled={ehUsuarioEmpresa}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12 pt-3">
            <Field
              component={InputText}
              label="Classificação de Grãos"
              tooltipText="Campos específico para produtos que contém classificação de grãos"
              name="tipo"
              type="text"
              disabled={ehUsuarioEmpresa}
            />
          </div>
        </div>
        <FieldArray
          name="especificacoes"
          component={Especificacoes}
          unidades_de_medida={this.state.unidades_de_medida}
          embalagens={this.state.embalagens}
          especificacoesIniciais={this.state.especificacoesIniciais}
          updateOpcoesItensCadastrados={() =>
            this.updateOpcoesItensCadastrados()
          }
          desabilitarCampos={ehUsuarioEmpresa}
          required
        />
        <div className="row">
          <div className="col-12 pt-3">
            <Field
              component={InputText}
              label="Condições de armazenamento, conservação e prazo máximo para consumo após a abertura da embalagem"
              name="info_armazenamento"
              type="text"
              placeholder="Digite as informações necessárias"
              required
              validate={required}
              disabled={ehUsuarioEmpresa}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12 pb-5">
            <Field
              component={TextArea}
              placeholder="Digite as informações"
              label={"Outras informações que a empresa julgar necessário"}
              name="outras_informacoes"
              disabled={ehUsuarioEmpresa}
            />
          </div>
        </div>

        <section className="row attachments">
          <div className="col-12 card-title cinza-escuro image-label-cadastro-produto">
            <span className="image-required">*</span>
            <span>Imagens do Produto</span>
            <TooltipIcone tooltipText="Anexe uma ou mais imagens do produto." />
          </div>
          <div className="col-12 btn-produto">
            <Field
              component={ManagedInputFileField}
              concatenarNovosArquivos
              className="inputfile"
              texto="Anexar"
              name="anexos"
              ehCadastroProduto={true}
              accept=".png, .doc, .pdf, .docx, .jpeg, .jpg"
              onChange={this.props.setFiles}
              removeFile={this.props.removeFile}
              toastSuccessMessage="Imagem do produto inclusa com sucesso"
              toastErrorMessage="Arquivo superior a 10 MB não é possível fazer o upload"
              validate={required}
              disabled={ehUsuarioEmpresa}
            />
          </div>
        </section>
        <div className="section-botoes">
          <Botao
            texto={"Voltar"}
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN_OUTLINE}
            onClick={() => {
              previousPage();
              this.props.passouTerceiroStep(valuesForm);
            }}
          />
          {this.state.status_codae_questionado && (
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
          {!ehUsuarioEmpresa && (
            <Botao
              texto={"Enviar"}
              className="ms-3"
              type={BUTTON_TYPE.SUBMIT}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              disabled={pristine || submitting}
              onClick={handleSubmit(() => this.onSubmit(valuesForm))}
            />
          )}
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: "atualizacaoProduto",
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(withNavigate(WizardFormTerceiraPagina));
