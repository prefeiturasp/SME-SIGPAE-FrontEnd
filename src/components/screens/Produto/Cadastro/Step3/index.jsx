import React, { Component } from "react";
import { Field, FieldArray } from "redux-form";
import InputText from "../../../../Shareable/Input/InputText";
import Especificacoes from "./components/Especificacoes";
import { required } from "../../../../../helpers/fieldValidators";
import {
  getUnidadesDeMedidaProduto,
  getEmbalagensProduto,
} from "../../../../../services/produto.service";
import "./style.scss";
import { TextArea } from "../../../../Shareable/TextArea/TextArea";
import ManagedInputFileField from "src/components/Shareable/Input/InputFile/ManagedField";
import TooltipIcone from "src/components/Shareable/TooltipIcone";

class Step3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unidades_de_medida: null,
      embalagens: null,
    };
  }

  componentDidMount = async () => {
    await this.updateOpcoesItensCadastrados();
  };

  updateOpcoesItensCadastrados = async () => {
    const reponseUnidades = await getUnidadesDeMedidaProduto();
    const responseEmbalagens = await getEmbalagensProduto();
    this.setState({
      unidades_de_medida: reponseUnidades.data.results,
      embalagens: responseEmbalagens.data.results,
    });
  };

  openFile = (file) => {
    if (file.arquivo && file.arquivo.startsWith("http")) {
      window.open(file.arquivo);
    } else if (file.nome.includes(".doc")) {
      const link = document.createElement("a");
      link.href = file.base64;
      link.download = file.nome;
      link.click();
    } else {
      let pdfWindow = window.open("");
      pdfWindow.document.write(
        "<iframe width='100%' height='100%' src='" + file.base64 + "'></iframe>"
      );
    }
  };

  maxLengthCaracteres = (max) => (value) =>
    value && value.length > max
      ? `Limite máximo de ${max} caracteres`
      : undefined;

  ehRascunho = ({ ultima_homologacao }) => {
    return ultima_homologacao && ultima_homologacao.status === "RASCUNHO";
  };

  temImagensSalvas = ({ imagens_salvas }) => {
    return imagens_salvas && imagens_salvas.length > 0;
  };

  render() {
    const { payload } = this.props;
    return (
      <div className="cadastro-produto-step3">
        <div className="card-title">Informação do Produto (classificação)</div>
        <div className="row">
          <div className="col-6 pt-3">
            <Field
              component={InputText}
              label="N° de registro do produto no órgão competente"
              tooltipText="Campo específico para inserir o registro dos produtos de origem animal, polpas de frutas e sucos"
              name="numero_registro"
              type="text"
              placeholder="Registro no Ministério da Agricultura SP 000499-5.000060"
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
            />
          </div>
        </div>
        <FieldArray
          name="especificacoes"
          component={Especificacoes}
          unidades_de_medida={this.state.unidades_de_medida}
          embalagens={this.state.embalagens}
          especificacoesIniciais={payload.especificacoes}
          updateOpcoesItensCadastrados={() =>
            this.updateOpcoesItensCadastrados()
          }
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
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12 pb-1">
            <Field
              component={TextArea}
              placeholder="Digite as informações"
              label={"Outras informações que a empresa julgar necessário"}
              name="outras_informacoes"
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
              validate={payload && this.ehRascunho(payload) ? [] : [required]}
              toastSuccessMessage="Imagem do produto inclusa com sucesso"
            />
          </div>
        </section>
        {payload && this.ehRascunho(payload) && (
          <div className="section-cards-imagens pb-3">
            {payload.imagens_salvas !== null &&
              payload.imagens_salvas.length > 0 && (
                <>
                  {payload.imagens_salvas
                    .filter((anexo) => anexo.arquivo.includes("media"))
                    .map((anexo, key) => {
                      return (
                        <div
                          key={key}
                          className={`px-1 arquivos-anexados ${
                            key > 0 ? "mt-1" : ""
                          }`}
                        >
                          <span onClick={() => this.openFile(anexo)}>
                            <i className="fas fa-paperclip" />
                          </span>
                          <a
                            rel="noopener noreferrer"
                            target="_blank"
                            href={anexo.arquivo}
                            className="link ms-1 me-5"
                          >
                            {anexo.nome}
                          </a>
                          <span
                            className="float-end"
                            onClick={() =>
                              this.props.removerAnexo(anexo.uuid, key)
                            }
                          >
                            <i className="fas fa-trash-alt" />
                          </span>
                        </div>
                      );
                    })}
                </>
              )}
          </div>
        )}
      </div>
    );
  }
}

export default Step3;
