import React, { useEffect, useRef, useState } from "react";
import { Spin } from "antd";
import "./styles.scss";
import { Field, Form } from "react-final-form";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import { FluxoDeStatusPreRecebimento } from "src/components/Shareable/FluxoDeStatusPreRecebimento";
import { required } from "../../../../../../helpers/fieldValidators";
import InputText from "src/components/Shareable/Input/InputText";
import { downloadAndConvertToBase64 } from "../../../../../Shareable/Input/InputFile/helper";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import {
  CorrecaoDocumentoPayload,
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
import {
  corrigirDocumentoRecebimento,
  detalharDocumentoRecebimento,
} from "../../../../../../services/documentosRecebimento.service";
import {
  Arquivo,
  ArquivoForm,
  DocumentosRecebimentoDetalhado,
  TiposDocumentoChoices,
} from "src/interfaces/pre_recebimento.interface";
import { OUTROS_DOCUMENTOS_OPTIONS } from "../../constants";

interface ArquivosDocumentoForm {
  tipoDocumento: TiposDocumentoChoices;
  arquivosForm: ArquivoForm[];
}

interface ValoresIniciaisForm {
  tipos_de_documentos: TiposDocumentoChoices[];
  descricao_documento: string;
}

export default () => {
  const navigate = useNavigate();

  const [carregando, setCarregando] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);

  const [objeto, setObjeto] = useState<DocumentosRecebimentoDetalhado>(
    {} as DocumentosRecebimentoDetalhado,
  );

  const [arquivosLaudoForm, setArquivosLaudoForm] =
    useState<ArquivosDocumentoForm>();
  const [arquivosDocumentosForm, setArquivosDocumentosForm] =
    useState<ArquivosDocumentoForm[]>();

  const initialValues = useRef<ValoresIniciaisForm>();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    const response = await detalharDocumentoRecebimento(uuid);

    const objeto = response.data;

    const laudoIndex = objeto.tipos_de_documentos.findIndex(
      (tipo) => tipo.tipo_documento === "LAUDO",
    );
    const laudo = objeto.tipos_de_documentos.splice(laudoIndex, 1)[0];
    const documentos = objeto.tipos_de_documentos;

    setObjeto(objeto);

    const arquivosLaudoForm = {
      tipoDocumento: laudo.tipo_documento,
      arquivosForm: await obterArquivosForm(laudo.arquivos),
    } as ArquivosDocumentoForm;
    setArquivosLaudoForm(arquivosLaudoForm);

    const arquivosDocumentosForm = await Promise.all(
      documentos.map(async (documento) => {
        return {
          tipoDocumento: documento.tipo_documento,
          arquivosForm: await obterArquivosForm(documento.arquivos),
        } as ArquivosDocumentoForm;
      }),
    );
    setArquivosDocumentosForm(arquivosDocumentosForm);

    initialValues.current = obterInitialValues(documentos);

    setCarregando(false);
  };

  const obterArquivosForm = async (arquivosDocumento: Arquivo[]) => {
    const arquivosFormDocumento = await Promise.all(
      arquivosDocumento.map(async (arquivo) => {
        return {
          nome: arquivo.nome,
          base64: await downloadAndConvertToBase64(arquivo.arquivo),
        } as ArquivoForm;
      }),
    );

    return arquivosFormDocumento;
  };

  const setFilesLaudo = (files: ArquivoForm[]) => {
    const arquivosLaudoFormAtualizado = {
      ...arquivosLaudoForm,
      arquivosForm: files,
    };

    setArquivosLaudoForm(arquivosLaudoFormAtualizado);
  };

  const removeFileLaudo = (index: number) => {
    const arquivosLaudoFormAtualizado = { ...arquivosLaudoForm };
    arquivosLaudoFormAtualizado.arquivosForm.splice(index, 1);

    setArquivosLaudoForm(arquivosLaudoFormAtualizado);
  };

  const setFilesDocumentos = (
    files: ArquivoForm[],
    tipoDocumento: TiposDocumentoChoices,
  ) => {
    const arquivosDocumentosFormAtualizado = [...arquivosDocumentosForm];

    try {
      arquivosDocumentosFormAtualizado.find(
        (arquivosDocumentoForm) =>
          arquivosDocumentoForm.tipoDocumento === tipoDocumento,
      ).arquivosForm = files;
    } catch {
      arquivosDocumentosFormAtualizado.push({
        tipoDocumento,
        arquivosForm: files,
      });
    }

    setArquivosDocumentosForm(arquivosDocumentosFormAtualizado);
  };

  const removeFileDocumentos = (
    index: number,
    tipoDocumento: TiposDocumentoChoices,
  ) => {
    const arquivosDocumentosFormAtualizado = [...arquivosDocumentosForm];
    arquivosDocumentosFormAtualizado
      .find(
        (arquivosDocumentoForm) =>
          arquivosDocumentoForm.tipoDocumento === tipoDocumento,
      )
      ?.arquivosForm.splice(index, 1);

    setArquivosDocumentosForm(arquivosDocumentosFormAtualizado);
  };

  const corrigirDocumentosRecebimento = async (values: Record<string, any>) => {
    setCarregando(true);

    const payload = formataPayload(values);
    const uuid = objeto?.uuid;

    try {
      const response = await corrigirDocumentoRecebimento(payload, uuid);
      if (response.status === 201 || response.status === 200) {
        toastSuccess("Documentos enviados com sucesso!");
        setShowModal(false);
        voltarPagina();
      } else {
        toastError("Ocorreu um erro ao salvar o Documento de Recebimento");
      }
    } catch (error) {
      exibeError(error, "Ocorreu um erro ao salvar o Documento de Recebimento");
    } finally {
      setCarregando(false);
    }
  };

  const formataPayload = (values) => {
    const tiposDocumentos: TiposDocumentosPayload[] =
      values.tipos_de_documentos?.map(
        (
          tipoDocumentoSelecionado: TiposDocumentoChoices,
        ): TiposDocumentosPayload => {
          const arquivosTipoDocumento = arquivosDocumentosForm?.find(
            ({ tipoDocumento }) => tipoDocumento === tipoDocumentoSelecionado,
          );

          return {
            tipo_documento: tipoDocumentoSelecionado,
            arquivos_do_tipo_de_documento:
              arquivosTipoDocumento.arquivosForm.map(({ nome, base64 }) => {
                return { nome, arquivo: base64 };
              }),
            descricao_documento:
              tipoDocumentoSelecionado === "OUTROS"
                ? values.descricao_documento
                : "",
          };
        },
      );

    tiposDocumentos.push({
      tipo_documento: "LAUDO",
      arquivos_do_tipo_de_documento: arquivosLaudoForm.arquivosForm.map(
        ({ nome, base64 }) => {
          return { nome, arquivo: base64 };
        },
      ),
    });

    const payload: CorrecaoDocumentoPayload = {
      tipos_de_documentos: tiposDocumentos,
    };

    return payload;
  };

  const voltarPagina = () =>
    navigate(`/${PRE_RECEBIMENTO}/${DOCUMENTOS_RECEBIMENTO}`);

  const obterInitialValues = (documentos) => {
    const tiposDocumentos = documentos?.map(
      ({ tipo_documento }) => tipo_documento,
    );

    const descricaoDocumentoOutros = tiposDocumentos?.includes("OUTROS")
      ? documentos?.find((documento) => documento.tipo_documento === "OUTROS")
          ?.descricao_documento
      : "";

    return {
      tipos_de_documentos: tiposDocumentos,
      descricao_documento: descricaoDocumentoOutros,
    };
  };

  const obterArquivosIniciaisDocumentos = (
    arquivosDocumentosForm: ArquivosDocumentoForm[],
    tipoDocumento: TiposDocumentoChoices,
  ) => {
    return arquivosDocumentosForm?.find(
      (arquivosDocumento) => arquivosDocumento.tipoDocumento === tipoDocumento,
    )?.arquivosForm;
  };

  const desabilitarBotaoSalvar = (values: Record<string, any>) => {
    const laudoInvalido = arquivosLaudoForm?.arquivosForm.length === 0;

    const nenhumDocumentoSelecionado = values.tipos_de_documentos?.length === 0;

    const documentosValidos = values.tipos_de_documentos?.every(
      (tipoDocumento: TiposDocumentoChoices) => {
        return (
          arquivosDocumentosForm?.find(
            (arquivosDocumentoForm) =>
              arquivosDocumentoForm.tipoDocumento === tipoDocumento,
          )?.arquivosForm.length > 0
        );
      },
    );

    return laudoInvalido || nenhumDocumentoSelecionado || !documentosValidos;
  };

  const filtrarArquivosDocumentosForm = (
    tiposDocumentosSelecionados: TiposDocumentoChoices[],
  ) => {
    const arquivosDocumentosFormAtualizado = arquivosDocumentosForm.filter(
      ({ tipoDocumento }) =>
        tiposDocumentosSelecionados.includes(tipoDocumento),
    );

    if (!tiposDocumentosSelecionados.includes("OUTROS"))
      initialValues.current = {
        tipos_de_documentos: tiposDocumentosSelecionados,
        descricao_documento: "",
      };

    setArquivosDocumentosForm(arquivosDocumentosFormAtualizado);
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-corrigir-documentos-recebimento">
        <div className="card-body corrigir-documentos-recebimento">
          {objeto.logs && (
            <div className="row my-4">
              <FluxoDeStatusPreRecebimento listaDeStatus={objeto.logs} />
            </div>
          )}

          <div className="row">
            <div className="col-6">
              Data da Solicitação:
              <span className="green-bold">
                {" "}
                {objeto?.logs?.slice(-1)[0].criado_em.split(" ")[0]}
              </span>
            </div>

            <div className="col-6">
              Status:
              <span className="orange-bold">
                {" "}
                {objeto?.status === "Enviado para Correção" &&
                  "Solicitada Correção"}
              </span>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-12">
              <TextArea
                label="Correções Necessárias"
                input={{ value: objeto?.correcao_solicitada }}
                disabled
              />
            </div>
          </div>

          <hr className="my-4" />

          <div className="subtitulo">Dados do Laudo</div>

          <div className="row">
            <div className="col-6">
              <InputText
                label="Nº do Cronograma"
                valorInicial={objeto?.numero_cronograma}
                disabled
              />
            </div>
            <div className="col-6">
              <InputText
                label="Nº do Pregão/Chamada Pública"
                valorInicial={objeto?.pregao_chamada_publica}
                disabled
              />
            </div>
            <div className="col-6">
              <InputText
                label="Nome do Produto"
                valorInicial={objeto?.nome_produto}
                disabled
              />
            </div>
            <div className="col-6">
              <InputText
                label="Nº do Laudo"
                valorInicial={objeto?.numero_laudo}
                disabled
              />
            </div>
          </div>

          <Form
            onSubmit={() => setShowModal(true)}
            initialValues={initialValues.current}
            render={({ handleSubmit, values, errors }) => (
              <form onSubmit={handleSubmit}>
                <ModalConfirmarEnvio
                  show={showModal}
                  handleClose={() => setShowModal(false)}
                  loading={carregando}
                  handleSim={() => corrigirDocumentosRecebimento(values)}
                  correcao
                />

                {arquivosLaudoForm && (
                  <div>
                    <InserirDocumento
                      setFiles={setFilesLaudo}
                      removeFile={removeFileLaudo}
                      formatosAceitos="PDF"
                      multiplosArquivos={false}
                      concatenarNovosArquivos={false}
                      arquivosIniciais={arquivosLaudoForm.arquivosForm}
                    />
                  </div>
                )}

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

                <hr className="my-4" />

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
                      required
                      validate={required}
                      onChangeEffect={() => filtrarArquivosDocumentosForm}
                    />
                  </div>
                </div>

                {arquivosDocumentosForm &&
                  values.tipos_de_documentos?.map(
                    (tipoDocumento: TiposDocumentoChoices) => (
                      <InserirDocumento
                        key={tipoDocumento}
                        setFiles={(files) =>
                          setFilesDocumentos(files, tipoDocumento)
                        }
                        removeFile={(index) =>
                          removeFileDocumentos(index, tipoDocumento)
                        }
                        tipoDocumento={tipoDocumento}
                        arquivosIniciais={obterArquivosIniciaisDocumentos(
                          arquivosDocumentosForm,
                          tipoDocumento,
                        )}
                      />
                    ),
                  )}

                <div className="my-5">
                  <Botao
                    texto="Salvar e Enviar"
                    type={BUTTON_TYPE.SUBMIT}
                    style={BUTTON_STYLE.GREEN}
                    className="float-end ms-3"
                    disabled={
                      Object.keys(errors).length > 0 ||
                      desabilitarBotaoSalvar(values)
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
