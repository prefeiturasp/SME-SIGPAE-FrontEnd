import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { Field, Form } from "react-final-form";

import { formatarNumeroEProdutoFichaTecnica } from "helpers/preRecebimento";
import AutoCompleteSelectField from "components/Shareable/AutoCompleteSelectField";
import { getListaFiltradaAutoCompleteSelect } from "helpers/autoCompleteSelect";
import { required } from "../../../../helpers/fieldValidators";
import InputText from "../../../Shareable/Input/InputText";
import { getListaFichasTecnicasSimplesSemLayoutEmbalagem } from "services/fichaTecnica.service";
import { cadastraLayoutEmbalagem } from "../../../../services/layoutEmbalagem.service";
import Botao from "../../../Shareable/Botao";
import { BUTTON_STYLE, BUTTON_TYPE } from "../../../Shareable/Botao/constants";
import { TextArea } from "components/Shareable/TextArea/TextArea";
import { toastError, toastSuccess } from "../../../Shareable/Toast/dialogs";
import { exibeError } from "helpers/utilities";
import { LAYOUT_EMBALAGEM, PRE_RECEBIMENTO } from "configs/constants";
import ModalConfirmar from "./components/ModalConfirmar";
import { useNavigate } from "react-router-dom";
import ModalCancelar from "./components/ModalCancelar";
import InserirArquivo from "../LayoutEmbalagem/components/InserirArquivo";

import "./styles.scss";

export default () => {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);
  const [fichasTecnicas, setFichasTecnicas] = useState([]);
  const [primaria, setPrimaria] = useState([]);
  const [secundaria, setSecundaria] = useState([]);
  const [terciaria, setTerciaria] = useState([]);
  const [showModalConfirmar, setShowModalConfirmar] = useState(false);
  const [showModalCancelar, setShowModalCancelar] = useState(false);

  const onSubmit = () => {
    setShowModalConfirmar(true);
  };

  const gerarImagens = (arr) =>
    arr.map((img) => ({
      arquivo: img.arquivo || img.base64,
      nome: img.nome,
    }));

  const salvarLayoutEmbalagem = async (values) => {
    try {
      setCarregando(true);

      let payload = formataPayload(values);
      let response = await cadastraLayoutEmbalagem(payload);
      if (response.status === 201 || response.status === 200) {
        toastSuccess("Layout enviado para análise com sucesso!");
        setShowModalConfirmar(false);
        voltarPagina();
      } else {
        toastError("Ocorreu um erro ao salvar o Layout da Embalagem");
      }
    } catch (error) {
      exibeError(error, "Ocorreu um erro ao salvar o Layout da Embalagem");
    } finally {
      setCarregando(false);
    }
  };

  const formataPayload = (values) => {
    let payload = {};
    payload.ficha_tecnica = values.uuid_ficha_tecnica;
    payload.observacoes = values.observacoes;

    payload.tipos_de_embalagens = [];

    payload.tipos_de_embalagens.push({
      tipo_embalagem: "PRIMARIA",
      imagens_do_tipo_de_embalagem: gerarImagens(primaria),
    });

    payload.tipos_de_embalagens.push({
      tipo_embalagem: "SECUNDARIA",
      imagens_do_tipo_de_embalagem: gerarImagens(secundaria),
    });

    if (terciaria.length > 0) {
      payload.tipos_de_embalagens.push({
        tipo_embalagem: "TERCIARIA",
        imagens_do_tipo_de_embalagem: gerarImagens(terciaria),
      });
    }

    return payload;
  };

  const buscarFichasTecnicas = async () => {
    let response = await getListaFichasTecnicasSimplesSemLayoutEmbalagem();
    let lista = response.data.results.map((ficha) => {
      ficha.value = ficha.numero;
      return ficha;
    });

    setFichasTecnicas(lista);
  };

  const removeFile1 = (index) => {
    let newFiles = [...primaria];
    newFiles.splice(index, 1);
    setPrimaria(newFiles);
  };

  const setFiles1 = (files) => {
    const arquivosAtualizados = files.map((arquivo) => {
      return {
        nome: arquivo.nome,
        base64: arquivo.base64 || arquivo.arquivo,
      };
    });

    setPrimaria(arquivosAtualizados);
  };

  const removeFile2 = (index) => {
    let newFiles = [...secundaria];
    newFiles.splice(index, 1);
    setSecundaria(newFiles);
  };

  const setFiles2 = (files) => {
    const arquivosAtualizados = files.map((arquivo) => {
      return {
        nome: arquivo.nome,
        base64: arquivo.base64 || arquivo.arquivo,
      };
    });

    setSecundaria(arquivosAtualizados);
  };

  const removeFile3 = (index) => {
    let newFiles = [...terciaria];
    newFiles.splice(index, 1);
    setTerciaria(newFiles);
  };

  const setFiles3 = (files) => {
    const arquivosAtualizados = files.map((arquivo) => {
      return {
        nome: arquivo.nome,
        base64: arquivo.base64 || arquivo.arquivo,
      };
    });

    setTerciaria(arquivosAtualizados);
  };

  const voltarPagina = () =>
    navigate(`/${PRE_RECEBIMENTO}/${LAYOUT_EMBALAGEM}`);

  useEffect(() => {
    setCarregando(true);

    buscarFichasTecnicas();

    setCarregando(false);
  }, []);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-cadastro-layout-embalagem">
        <div className="card-body cadastro-layout-embalagem">
          <Form
            onSubmit={onSubmit}
            initialValues={{}}
            validate={() => {}}
            render={({ handleSubmit, values, errors, form }) => (
              <form onSubmit={handleSubmit}>
                <ModalConfirmar
                  show={showModalConfirmar}
                  handleClose={() => setShowModalConfirmar(false)}
                  loading={carregando}
                  handleSim={() => salvarLayoutEmbalagem(values)}
                />
                <ModalCancelar
                  show={showModalCancelar}
                  handleClose={() => setShowModalCancelar(false)}
                  handleSim={() => voltarPagina()}
                />
                <div className="subtitulo">Dados do Produto</div>
                <div className="row">
                  <div className="col">
                    <Field
                      component={AutoCompleteSelectField}
                      options={getListaFiltradaAutoCompleteSelect(
                        fichasTecnicas.map((e) =>
                          formatarNumeroEProdutoFichaTecnica(e)
                        ),
                        values.ficha_tecnica,
                        true
                      )}
                      label="Ficha Técnica e Produto"
                      name={`ficha_tecnica`}
                      className="input-busca-produto"
                      placeholder="Digite o Nº da Ficha Técnica ou nome do Produto"
                      required
                      validate={required}
                      esconderIcone
                      onChange={(value) => {
                        const ficha = fichasTecnicas.find(
                          ({ numero }) => numero === value.split("-")[0].trim()
                        );

                        values.ficha_tecnica = value;
                        values.uuid_ficha_tecnica = ficha?.uuid;

                        form.change(
                          "pregao_chamada_publica",
                          ficha?.pregao_chamada_publica
                        );
                      }}
                    />
                  </div>

                  <div className="col">
                    <Field
                      component={InputText}
                      label="Nº do Pregão/Chamada Pública"
                      name={`pregao_chamada_publica`}
                      placeholder="Nº do Pregão/Chamada Pública"
                      required
                      disabled={true}
                    />
                  </div>
                </div>

                <hr />

                <InserirArquivo
                  setFiles={setFiles1}
                  removeFile={removeFile1}
                  tipoEmbalagem={"PRIMARIA"}
                />

                <hr />

                <InserirArquivo
                  setFiles={setFiles2}
                  removeFile={removeFile2}
                  tipoEmbalagem={"SECUNDARIA"}
                />

                <hr />

                <InserirArquivo
                  setFiles={setFiles3}
                  removeFile={removeFile3}
                  tipoEmbalagem={"TERCIARIA"}
                />

                <hr />

                <div className="row">
                  <div className="col-12">
                    <Field
                      component={TextArea}
                      label="Observações"
                      name="observacoes"
                    />
                  </div>
                </div>

                <hr />

                <div className="mt-4 mb-4">
                  <Botao
                    texto="Enviar Para Análise"
                    type={BUTTON_TYPE.SUBMIT}
                    style={BUTTON_STYLE.GREEN}
                    className="float-end ms-3"
                    disabled={
                      Object.keys(errors).length > 0 ||
                      primaria.length === 0 ||
                      secundaria.length === 0
                    }
                  />
                  <Botao
                    texto="Cancelar"
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    className="float-end ms-3"
                    onClick={() => setShowModalCancelar(true)}
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
