import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { Spin } from "antd";
import "./styles.scss";
import { Field, Form } from "react-final-form";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import { FluxoDeStatusPreRecebimento } from "src/components/Shareable/FluxoDeStatusPreRecebimento";
import { required } from "../../../../../../helpers/fieldValidators";
import InputText from "src/components/Shareable/Input/InputText";
import { downloadAndConvertToBase64 } from "../../../../../Shareable/Input/InputFile/helper";
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
  atualizarDocumentoRecebimento,
  detalharDocumentoRecebimento,
} from "../../../../../../services/documentosRecebimento.service";
import { OUTROS_DOCUMENTOS_OPTIONS } from "../../constants";
import ArquivosTipoRecebimento from "../ArquivosTipoDocumento";
export default () => {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [objeto, setObjeto] = useState({});
  const [arquivosDocumentosForm, setArquivosDocumentosForm] = useState();
  const initialValues = useRef();
  const [laudo, setLaudo] = useState();
  useEffect(() => {
    carregarDados();
  }, []);
  const carregarDados = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    const response = await detalharDocumentoRecebimento(uuid);
    const objeto = response.data;
    const laudoIndex = objeto.tipos_de_documentos.findIndex(
      (tipo) => tipo.tipo_documento === "LAUDO"
    );
    const _laudo = objeto.tipos_de_documentos.splice(laudoIndex, 1)[0];
    setLaudo(_laudo);
    const documentos = objeto.tipos_de_documentos;
    setObjeto(objeto);
    const arquivosDocumentosForm = await Promise.all(
      documentos.map(async (documento) => {
        return {
          tipoDocumento: documento.tipo_documento,
          arquivosForm: await obterArquivosForm(documento.arquivos),
        };
      })
    );
    setArquivosDocumentosForm(arquivosDocumentosForm);
    initialValues.current = obterInitialValues(documentos);
    setCarregando(false);
  };
  const obterArquivosForm = async (arquivosDocumento) => {
    const arquivosFormDocumento = await Promise.all(
      arquivosDocumento.map(async (arquivo) => {
        try {
          const base64 = await downloadAndConvertToBase64(arquivo.arquivo);
          return {
            nome: arquivo.nome,
            base64: base64,
          };
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Erro ao baixar o arquivo: ${arquivo.nome}`, error);
          return {
            nome: arquivo.nome,
            base64: "", // Retorna um valor padrão ou vazio em caso de erro
          };
        }
      })
    );
    return arquivosFormDocumento;
  };
  const setFilesDocumentos = (files, tipoDocumento) => {
    const arquivosDocumentosFormAtualizado = [...arquivosDocumentosForm];
    try {
      arquivosDocumentosFormAtualizado.find(
        (arquivosDocumentoForm) =>
          arquivosDocumentoForm.tipoDocumento === tipoDocumento
      ).arquivosForm = files;
    } catch {
      arquivosDocumentosFormAtualizado.push({
        tipoDocumento,
        arquivosForm: files,
      });
    }
    setArquivosDocumentosForm(arquivosDocumentosFormAtualizado);
  };
  const removeFileDocumentos = (index, tipoDocumento) => {
    const arquivosDocumentosFormAtualizado = [...arquivosDocumentosForm];
    arquivosDocumentosFormAtualizado
      .find(
        (arquivosDocumentoForm) =>
          arquivosDocumentoForm.tipoDocumento === tipoDocumento
      )
      ?.arquivosForm.splice(index, 1);
    setArquivosDocumentosForm(arquivosDocumentosFormAtualizado);
  };
  const atualizarDocumentosRecebimento = async (values) => {
    setCarregando(true);
    const payload = formataPayload(values);
    const uuid = objeto?.uuid;
    try {
      const response = await atualizarDocumentoRecebimento(payload, uuid);
      if (response.status === 201 || response.status === 200) {
        toastSuccess("Atualização enviada com sucesso!");
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
    const tiposDocumentos = values.tipos_de_documentos?.map(
      (tipoDocumentoSelecionado) => {
        const arquivosTipoDocumento = arquivosDocumentosForm?.find(
          ({ tipoDocumento }) => tipoDocumento === tipoDocumentoSelecionado
        );
        return {
          tipo_documento: tipoDocumentoSelecionado,
          arquivos_do_tipo_de_documento: arquivosTipoDocumento.arquivosForm.map(
            ({ nome, base64 }) => {
              return { nome, arquivo: base64 };
            }
          ),
          descricao_documento:
            tipoDocumentoSelecionado === "OUTROS"
              ? values.descricao_documento
              : "",
        };
      }
    );
    const payload = {
      tipos_de_documentos: tiposDocumentos,
    };
    return payload;
  };
  const voltarPagina = () =>
    navigate(`/${PRE_RECEBIMENTO}/${DOCUMENTOS_RECEBIMENTO}`);
  const obterInitialValues = (documentos) => {
    const tiposDocumentos = documentos?.map(
      ({ tipo_documento }) => tipo_documento
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
    arquivosDocumentosForm,
    tipoDocumento
  ) => {
    return arquivosDocumentosForm?.find(
      (arquivosDocumento) => arquivosDocumento.tipoDocumento === tipoDocumento
    )?.arquivosForm;
  };
  const desabilitarBotaoSalvar = (values) => {
    const nenhumDocumentoSelecionado = values.tipos_de_documentos?.length === 0;
    const documentosValidos = values.tipos_de_documentos?.every(
      (tipoDocumento) => {
        return (
          arquivosDocumentosForm?.find(
            (arquivosDocumentoForm) =>
              arquivosDocumentoForm.tipoDocumento === tipoDocumento
          )?.arquivosForm.length > 0
        );
      }
    );
    return nenhumDocumentoSelecionado || !documentosValidos;
  };
  const filtrarArquivosDocumentosForm = (tiposDocumentosSelecionados) => {
    const arquivosDocumentosFormAtualizado = arquivosDocumentosForm.filter(
      ({ tipoDocumento }) => tiposDocumentosSelecionados.includes(tipoDocumento)
    );
    if (!tiposDocumentosSelecionados.includes("OUTROS"))
      initialValues.current = {
        tipos_de_documentos: tiposDocumentosSelecionados,
        descricao_documento: "",
      };
    setArquivosDocumentosForm(arquivosDocumentosFormAtualizado);
  };
  return _jsx(Spin, {
    tip: "Carregando...",
    spinning: carregando,
    children: _jsx("div", {
      className: "card mt-3 card-corrigir-documentos-recebimento",
      children: _jsxs("div", {
        className: "card-body corrigir-documentos-recebimento",
        children: [
          objeto.logs &&
            _jsx("div", {
              className: "row my-4",
              children: _jsx(FluxoDeStatusPreRecebimento, {
                listaDeStatus: objeto.logs,
              }),
            }),
          _jsxs("div", {
            className: "row",
            children: [
              _jsxs("div", {
                className: "col-6",
                children: [
                  "Data da Cria\u00E7\u00E3o:",
                  _jsxs("span", {
                    className: "green-bold",
                    children: [" ", objeto?.criado_em],
                  }),
                ],
              }),
              _jsxs("div", {
                className: "col-6",
                children: [
                  "Status:",
                  _jsxs("span", {
                    className: "green-bold",
                    children: [" ", objeto?.status],
                  }),
                ],
              }),
            ],
          }),
          _jsx("hr", {}),
          _jsx("div", { className: "subtitulo", children: "Dados do Laudo" }),
          _jsxs("div", {
            className: "row",
            children: [
              _jsx("div", {
                className: "col-6",
                children: _jsx(InputText, {
                  label: "N\u00BA do Cronograma",
                  valorInicial: objeto?.numero_cronograma,
                  disabled: true,
                }),
              }),
              _jsx("div", {
                className: "col-6",
                children: _jsx(InputText, {
                  label: "N\u00BA do Preg\u00E3o/Chamada P\u00FAblica",
                  valorInicial: objeto?.pregao_chamada_publica,
                  disabled: true,
                }),
              }),
              _jsx("div", {
                className: "col-6",
                children: _jsx(InputText, {
                  label: "Nome do Produto",
                  valorInicial: objeto?.nome_produto,
                  disabled: true,
                }),
              }),
              _jsx("div", {
                className: "col-6",
                children: _jsx(InputText, {
                  label: "N\u00BA do Laudo",
                  valorInicial: objeto?.numero_laudo,
                  disabled: true,
                }),
              }),
            ],
          }),
          _jsx(ArquivosTipoRecebimento, { lista: laudo }),
          _jsx("hr", {}),
          _jsx(Form, {
            onSubmit: () => setShowModal(true),
            initialValues: initialValues.current,
            render: ({ handleSubmit, values, errors }) =>
              _jsxs("form", {
                onSubmit: handleSubmit,
                children: [
                  _jsx(ModalConfirmarEnvio, {
                    show: showModal,
                    handleClose: () => setShowModal(false),
                    loading: carregando,
                    handleSim: () => atualizarDocumentosRecebimento(values),
                    correcao: true,
                  }),
                  _jsx("div", {
                    className: "subtitulo",
                    children: "Outros Documentos",
                  }),
                  _jsx("div", {
                    className: "row mb-3",
                    children: _jsx("div", {
                      className: "col-12",
                      children: _jsx(Field, {
                        label: "Selecione o documento",
                        component: MultiSelect,
                        disableSearch: true,
                        name: "tipos_de_documentos",
                        multiple: true,
                        nomeDoItemNoPlural: "documentos",
                        options: OUTROS_DOCUMENTOS_OPTIONS,
                        placeholder: "Selecione o documento",
                        required: true,
                        validate: required,
                        onChangeEffect: () => filtrarArquivosDocumentosForm,
                      }),
                    }),
                  }),
                  arquivosDocumentosForm &&
                    values.tipos_de_documentos?.map((tipoDocumento) =>
                      _jsx(
                        InserirDocumento,
                        {
                          setFiles: (files) =>
                            setFilesDocumentos(files, tipoDocumento),
                          removeFile: (index) =>
                            removeFileDocumentos(index, tipoDocumento),
                          tipoDocumento: tipoDocumento,
                          arquivosIniciais: obterArquivosIniciaisDocumentos(
                            arquivosDocumentosForm,
                            tipoDocumento
                          ),
                        },
                        tipoDocumento
                      )
                    ),
                  _jsxs("div", {
                    className: "my-5",
                    children: [
                      _jsx(Botao, {
                        texto: "Salvar e Enviar",
                        type: BUTTON_TYPE.SUBMIT,
                        style: BUTTON_STYLE.GREEN,
                        className: "float-end ms-3",
                        disabled:
                          Object.keys(errors).length > 0 ||
                          desabilitarBotaoSalvar(values),
                      }),
                      _jsx(Botao, {
                        texto: "Cancelar",
                        type: BUTTON_TYPE.BUTTON,
                        style: BUTTON_STYLE.GREEN_OUTLINE,
                        className: "float-end ms-3",
                        onClick: () => voltarPagina(),
                      }),
                    ],
                  }),
                ],
              }),
          }),
        ],
      }),
    }),
  });
};
