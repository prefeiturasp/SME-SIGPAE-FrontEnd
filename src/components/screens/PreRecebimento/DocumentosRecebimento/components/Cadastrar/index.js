import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import "./styles.scss";
import { Field, Form } from "react-final-form";
import AutoCompleteSelectField from "src/components/Shareable/AutoCompleteSelectField";
import { getListaFiltradaAutoCompleteSelect } from "src/helpers/autoCompleteSelect";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import { required } from "../../../../../../helpers/fieldValidators";
import InputText from "src/components/Shareable/Input/InputText";
import { getListaCronogramasPraCadastro } from "../../../../../../services/cronograma.service";
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
import { OUTROS_DOCUMENTOS_OPTIONS } from "../../constants";
export default () => {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);
  const [cronogramas, setCronogramas] = useState([]);
  const [laudo, setLaudo] = useState([]);
  const [documentos, setDocumentos] = useState({});
  const [showModal, setShowModal] = useState(false);
  const onSubmit = () => {
    setShowModal(true);
  };
  const buscaCronogramas = async () => {
    setCarregando(true);
    try {
      let response = await getListaCronogramasPraCadastro();
      setCronogramas(response.data.results);
    } finally {
      setCarregando(false);
    }
  };
  const removeFileLaudo = (index) => {
    let newFiles = [...laudo];
    newFiles.splice(index, 1);
    setLaudo(newFiles);
  };
  const setFilesLaudo = (files) => {
    const arquivosAtualizados = files.map((arquivo) => {
      return {
        nome: arquivo.nome,
        arquivo: arquivo.base64,
      };
    });
    setLaudo(arquivosAtualizados);
  };
  const removeFileDocumentos = (index, key) => {
    let newFiles = { ...documentos };
    newFiles[key].splice(index, 1);
    setDocumentos(newFiles);
  };
  const setFilesDocumentos = (files, key) => {
    const arquivosAtualizados = files.map((arquivo) => {
      return {
        nome: arquivo.nome,
        arquivo: arquivo.base64,
      };
    });
    const documentosAtualizados = { ...documentos };
    documentosAtualizados[key] = arquivosAtualizados;
    setDocumentos(documentosAtualizados);
  };
  const formataPayload = (values) => {
    let documentoLaudo = {
      tipo_documento: "LAUDO",
      arquivos_do_tipo_de_documento: laudo,
    };
    let outrosDocumentos =
      values.tipos_de_documentos?.map((valor) => {
        return {
          tipo_documento: valor,
          arquivos_do_tipo_de_documento: documentos[valor],
          descricao_documento:
            valor === "OUTROS" ? values.descricao_documento : undefined,
        };
      }) ?? [];
    let documentosPayload = [documentoLaudo, ...outrosDocumentos];
    let payload = {
      cronograma: cronogramas.find(({ numero }) => numero === values.cronograma)
        .uuid,
      numero_laudo: values.numero_laudo,
      tipos_de_documentos: documentosPayload,
    };
    return payload;
  };
  const salvarDocumentosRecebimiento = async (values) => {
    setCarregando(true);
    let payload = formataPayload(values);
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
  const validaArquivos = (values) => {
    let laudoInvalido = laudo.length === 0;
    let documentosValidos = values.tipos_de_documentos
      ? values.tipos_de_documentos?.every((valor) => {
          return documentos[valor]?.length > 0;
        })
      : true;
    return laudoInvalido || !documentosValidos;
  };
  const optionsCronograma = (values) =>
    getListaFiltradaAutoCompleteSelect(
      cronogramas.map(({ numero }) => numero),
      values.cronograma,
      true
    );
  const atualizarCamposDependentes = (value, form) => {
    let cronograma = cronogramas.find((c) => c.numero === value);
    form.change("pregao", cronograma?.pregao_chamada_publica);
    form.change("nome_produto", cronograma?.nome_produto);
  };
  return _jsx(Spin, {
    tip: "Carregando...",
    spinning: carregando,
    children: _jsx("div", {
      className: "card mt-3 card-cadastro-documento-recebimento",
      children: _jsx("div", {
        className: "card-body cadastro-documento-recebimento",
        children: _jsx(Form, {
          onSubmit: onSubmit,
          initialValues: {},
          render: ({ handleSubmit, values, errors, form }) =>
            _jsxs("form", {
              onSubmit: handleSubmit,
              children: [
                _jsx(ModalConfirmarEnvio, {
                  show: showModal,
                  handleClose: () => setShowModal(false),
                  loading: carregando,
                  handleSim: () => salvarDocumentosRecebimiento(values),
                }),
                _jsx("div", {
                  className: "subtitulo",
                  children: "Dados do Laudo",
                }),
                _jsxs("div", {
                  className: "row",
                  children: [
                    _jsx("div", {
                      className: "col-6",
                      children: _jsx(Field, {
                        component: AutoCompleteSelectField,
                        options: optionsCronograma(values),
                        label: "N\u00BA do Cronograma",
                        name: `cronograma`,
                        className: "input-busca-produto",
                        placeholder: "Digite o N\u00BA do Cronograma",
                        required: true,
                        validate: required,
                        onChange: (value) => {
                          atualizarCamposDependentes(value, form);
                        },
                      }),
                    }),
                    _jsx("div", {
                      className: "col-6",
                      children: _jsx(Field, {
                        component: InputText,
                        label: "N\u00BA do Preg\u00E3o/Chamada P\u00FAblica",
                        name: `pregao`,
                        placeholder:
                          "N\u00BA do Preg\u00E3o/Chamada P\u00FAblica",
                        required: true,
                        disabled: true,
                      }),
                    }),
                    _jsx("div", {
                      className: "col-6",
                      children: _jsx(Field, {
                        component: InputText,
                        label: "Nome do Produto",
                        name: `nome_produto`,
                        placeholder: "Nome do Produto",
                        required: true,
                        disabled: true,
                      }),
                    }),
                    _jsx("div", {
                      className: "col-6",
                      children: _jsx(Field, {
                        component: InputText,
                        label: "N\u00BA do Laudo",
                        name: `numero_laudo`,
                        placeholder: "Digite o N\u00BA do Laudo",
                        required: true,
                        validate: required,
                      }),
                    }),
                  ],
                }),
                _jsx("div", {
                  children: _jsx(InserirDocumento, {
                    setFiles: setFilesLaudo,
                    removeFile: removeFileLaudo,
                    formatosAceitos: "PDF",
                    multiplosArquivos: false,
                    concatenarNovosArquivos: false,
                  }),
                }),
                _jsx("hr", {}),
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
                    }),
                  }),
                }),
                values.tipos_de_documentos?.map((value, idx) =>
                  _jsx(
                    InserirDocumento,
                    {
                      setFiles: (files) => setFilesDocumentos(files, value),
                      removeFile: (index) => removeFileDocumentos(index, value),
                      tipoDocumento: value,
                    },
                    idx
                  )
                ),
                _jsx("hr", {}),
                _jsxs("div", {
                  className: "mt-4 mb-4",
                  children: [
                    _jsx(Botao, {
                      texto: "Salvar e Enviar",
                      type: BUTTON_TYPE.SUBMIT,
                      style: BUTTON_STYLE.GREEN,
                      className: "float-end ms-3",
                      disabled:
                        Object.keys(errors).length > 0 ||
                        validaArquivos(values),
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
      }),
    }),
  });
};
