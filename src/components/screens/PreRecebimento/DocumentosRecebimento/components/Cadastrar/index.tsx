import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import "./styles.scss";
import { Field, Form } from "react-final-form";
import AutoCompleteSelectField from "src/components/Shareable/AutoCompleteSelectField";
import { getListaFiltradaAutoCompleteSelect } from "src/helpers/autoCompleteSelect";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import { required } from "../../../../../../helpers/fieldValidators";
import InputText from "src/components/Shareable/Input/InputText";
import { getListaCronogramasPraCadastro } from "../../../../../../services/cronograma.service";
import {
  DocumentosRecebimentoPayload,
  DocumentosState,
  TiposDocumentosPayload,
} from "../../interfaces";
import InserirDocumento from "../InserirDocumento";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "../../../../../Shareable/Botao/constants";
import Botao from "../../../../../Shareable/Botao";
import { useNavigate } from "react-router-dom";
import { DOCUMENTOS_RECEBIMENTO, PRE_RECEBIMENTO } from "src/configs/constants";
import ModalConfirmarEnvio from "../ModalConfirmarEnvio";
import { exibeError } from "src/helpers/utilities";
import {
  toastError,
  toastSuccess,
} from "../../../../../Shareable/Toast/dialogs";
import { cadastraDocumentoRecebimento } from "../../../../../../services/documentosRecebimento.service";
import {
  Arquivo,
  ArquivoForm,
  CronogramaSimples,
  TiposDocumentoChoices,
} from "src/interfaces/pre_recebimento.interface";
import { OUTROS_DOCUMENTOS_OPTIONS } from "../../constants";
import { FormApi } from "final-form";

export default () => {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState<boolean>(true);
  const [cronogramas, setCronogramas] = useState<Array<CronogramaSimples>>([]);
  const [laudo, setLaudo] = useState<Array<Arquivo>>([]);
  const [documentos, setDocumentos] = useState<DocumentosState>({});
  const [showModal, setShowModal] = useState<boolean>(false);

  const onSubmit = (): void => {
    setShowModal(true);
  };

  const buscaCronogramas = async (): Promise<void> => {
    setCarregando(true);

    try {
      let response = await getListaCronogramasPraCadastro();
      setCronogramas(response.data.results);
    } finally {
      setCarregando(false);
    }
  };

  const removeFileLaudo = (index: number): void => {
    let newFiles = [...laudo];
    newFiles.splice(index, 1);
    setLaudo(newFiles);
  };

  const setFilesLaudo = (files: Array<ArquivoForm>): void => {
    const arquivosAtualizados = files.map((arquivo: ArquivoForm) => {
      return {
        nome: arquivo.nome,
        arquivo: arquivo.base64,
      };
    });

    setLaudo(arquivosAtualizados);
  };

  const removeFileDocumentos = (index: number, key: string): void => {
    let newFiles = { ...documentos };
    newFiles[key].splice(index, 1);
    setDocumentos(newFiles);
  };

  const setFilesDocumentos = (files: Array<ArquivoForm>, key: string): void => {
    const arquivosAtualizados = files.map((arquivo: ArquivoForm) => {
      return {
        nome: arquivo.nome,
        arquivo: arquivo.base64,
      };
    });

    const documentosAtualizados = { ...documentos };
    documentosAtualizados[key] = arquivosAtualizados;

    setDocumentos(documentosAtualizados);
  };

  const formataPayload = (values): DocumentosRecebimentoPayload => {
    let documentoLaudo = {
      tipo_documento: "LAUDO",
      arquivos_do_tipo_de_documento: laudo,
    };

    let outrosDocumentos =
      values.tipos_de_documentos?.map(
        (valor: TiposDocumentoChoices): TiposDocumentosPayload => {
          return {
            tipo_documento: valor,
            arquivos_do_tipo_de_documento: documentos[valor],
            descricao_documento:
              valor === "OUTROS" ? values.descricao_documento : undefined,
          };
        },
      ) ?? [];

    let documentosPayload: Array<TiposDocumentosPayload> = [
      documentoLaudo,
      ...outrosDocumentos,
    ];

    let payload: DocumentosRecebimentoPayload = {
      cronograma: cronogramas.find(({ numero }) => numero === values.cronograma)
        .uuid,
      numero_laudo: values.numero_laudo,
      tipos_de_documentos: documentosPayload,
    };

    return payload;
  };

  const salvarDocumentosRecebimiento = async (
    values: Record<string, any>,
  ): Promise<void> => {
    setCarregando(true);

    let payload: DocumentosRecebimentoPayload = formataPayload(values);

    try {
      let response = await cadastraDocumentoRecebimento(payload);
      if (response.status === 201 || response.status === 200) {
        toastSuccess("Documentos enviados com sucesso!");
        voltarPagina();
      } else {
        toastError("Ocorreu um erro ao salvar o Documento de Recebimento");
      }
    } catch (error) {
      exibeError(error, "Ocorreu um erro ao salvar o Documento de Recebimento");
    } finally {
      setShowModal(false);
      setCarregando(false);
    }
  };

  const voltarPagina = () =>
    navigate(`/${PRE_RECEBIMENTO}/${DOCUMENTOS_RECEBIMENTO}`);

  useEffect(() => {
    buscaCronogramas();
  }, []);

  const validaArquivos = (values: Record<string, any>): boolean => {
    let laudoInvalido = laudo.length === 0;

    let documentosValidos = values.tipos_de_documentos
      ? values.tipos_de_documentos?.every((valor: string) => {
          return documentos[valor]?.length > 0;
        })
      : true;

    return laudoInvalido || !documentosValidos;
  };

  const optionsCronograma = (values: Record<string, any>) =>
    getListaFiltradaAutoCompleteSelect(
      cronogramas.map(({ numero }) => numero),
      values.cronograma,
      true,
    );

  const atualizarCamposDependentes = (value: string, form: FormApi) => {
    let cronograma = cronogramas.find((c) => c.numero === value);

    form.change("pregao", cronograma?.pregao_chamada_publica);
    form.change("nome_produto", cronograma?.nome_produto);
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-cadastro-documento-recebimento">
        <div className="card-body cadastro-documento-recebimento">
          <Form
            onSubmit={onSubmit}
            initialValues={{}}
            render={({ handleSubmit, values, errors, form }) => (
              <form onSubmit={handleSubmit}>
                <ModalConfirmarEnvio
                  show={showModal}
                  handleClose={() => setShowModal(false)}
                  loading={carregando}
                  handleSim={() => salvarDocumentosRecebimiento(values)}
                />
                <div className="subtitulo">Dados do Laudo</div>
                <div className="row">
                  <div className="col-6">
                    <Field
                      component={AutoCompleteSelectField}
                      options={optionsCronograma(values)}
                      label="Nº do Cronograma"
                      name={`cronograma`}
                      className="input-busca-produto"
                      placeholder="Digite o Nº do Cronograma"
                      required
                      validate={required}
                      onChange={(value: string) => {
                        atualizarCamposDependentes(value, form);
                      }}
                    />
                  </div>
                  <div className="col-6">
                    <Field
                      component={InputText}
                      label="Nº do Pregão/Chamada Pública"
                      name={`pregao`}
                      placeholder="Nº do Pregão/Chamada Pública"
                      required
                      disabled={true}
                    />
                  </div>
                  <div className="col-6">
                    <Field
                      component={InputText}
                      label="Nome do Produto"
                      name={`nome_produto`}
                      placeholder="Nome do Produto"
                      required
                      disabled={true}
                    />
                  </div>
                  <div className="col-6">
                    <Field
                      component={InputText}
                      label="Nº do Laudo"
                      name={`numero_laudo`}
                      placeholder="Digite o Nº do Laudo"
                      required
                      validate={required}
                    />
                  </div>
                </div>
                <div>
                  <InserirDocumento
                    setFiles={setFilesLaudo}
                    removeFile={removeFileLaudo}
                    formatosAceitos="PDF"
                    multiplosArquivos={false}
                    concatenarNovosArquivos={false}
                  />
                </div>

                <div className="row mt-3">
                  <div className="col-12">
                    <div className="alert alert-warning d-flex align-items-center aviso-documento">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      <span>
                        Caso o laudo contiver múltiplas páginas, elas devem ser
                        reunidas em um único documento.
                      </span>
                    </div>
                  </div>
                </div>

                <hr />

                <div className="subtitulo">Outros Documentos</div>
                <div className="row mb-3">
                  <div className="col-12">
                    <Field
                      label="Selecione o documento"
                      component={MultiSelect}
                      disableSearch
                      name="tipos_de_documentos"
                      multiple
                      nomeDoItemNoPlural="documentos"
                      options={OUTROS_DOCUMENTOS_OPTIONS}
                      placeholder="Selecione o documento"
                    />
                  </div>
                </div>

                {values.tipos_de_documentos?.map(
                  (value: string, idx: number) => (
                    <InserirDocumento
                      setFiles={(files: Array<ArquivoForm>) =>
                        setFilesDocumentos(files, value)
                      }
                      removeFile={(index: number) =>
                        removeFileDocumentos(index, value)
                      }
                      tipoDocumento={value}
                      key={idx}
                    />
                  ),
                )}

                <hr />

                <div className="mt-4 mb-4">
                  <Botao
                    texto="Salvar e Enviar"
                    type={BUTTON_TYPE.SUBMIT}
                    style={BUTTON_STYLE.GREEN}
                    className="float-end ms-3"
                    disabled={
                      Object.keys(errors).length > 0 || validaArquivos(values)
                    }
                  />
                  <Botao
                    texto="Cancelar"
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    className="float-end ms-3"
                    onClick={() => voltarPagina()}
                  />
                </div>
              </form>
            )}
          />
        </div>
      </div>
    </Spin>
  );
};
