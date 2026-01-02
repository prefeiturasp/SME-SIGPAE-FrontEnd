import React, { useEffect, useState, useRef } from "react";
import { Spin } from "antd";
import { Field, Form } from "react-final-form";
import { useNavigate } from "react-router-dom";

import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import Botao from "src/components/Shareable/Botao";
import InputText from "src/components/Shareable/Input/InputText";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { ASelect } from "src/components/Shareable/MakeField";
import { Select } from "antd";
import { getListaFichasTecnicasSimplesSemLayoutEmbalagem } from "src/services/fichaTecnica.service";
import { cadastraLayoutEmbalagem } from "src/services/layoutEmbalagem.service";
import { required } from "src/helpers/fieldValidators";
import { exibeError } from "src/helpers/utilities";
import { formatarNumeroEProdutoFichaTecnica } from "src/helpers/preRecebimento";
import { LAYOUT_EMBALAGEM, PRE_RECEBIMENTO } from "src/configs/constants";

import ModalConfirmar from "./components/ModalConfirmar";
import ModalCancelar from "./components/ModalCancelar";
import InserirArquivo from "../LayoutEmbalagem/components/InserirArquivo";
import TagLeveLeite from "src/components/Shareable/PreRecebimento/TagLeveLeite";

import "./styles.scss";

const { Option } = Select;

export default () => {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);
  const [fichasTecnicas, setFichasTecnicas] = useState([]);
  const fichaTecnicaSelecionada = useRef("");
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
    payload.ficha_tecnica = fichaTecnicaSelecionada.current;
    payload.observacoes = values.observacoes;

    payload.tipos_de_embalagens = [];

    payload.tipos_de_embalagens.push({
      tipo_embalagem: "PRIMARIA",
      imagens_do_tipo_de_embalagem: gerarImagens(primaria),
    });

    if (secundaria.length > 0) {
      payload.tipos_de_embalagens.push({
        tipo_embalagem: "SECUNDARIA",
        imagens_do_tipo_de_embalagem: gerarImagens(secundaria),
      });
    }

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
                    <span className="required-asterisk">*</span>
                    <label className="col-form-label">
                      Ficha Técnica e Produto
                    </label>
                    <Field
                      name="ficha_tecnica"
                      validate={required}
                      render={({ input, meta }) => (
                        <ASelect
                          {...input}
                          placeholder="Digite o Nº da Ficha Técnica ou nome do Produto"
                          className="input-busca-produto"
                          dataTestId="ficha_tecnica"
                          meta={meta}
                          showSearch
                          onChange={(value) => {
                            input.onChange(value);
                            const numero = value?.split("-")[0].trim();
                            const ficha = fichasTecnicas.find(
                              (f) => f.numero === numero,
                            );
                            values.ficha_tecnica = value;
                            fichaTecnicaSelecionada.current = ficha?.uuid;
                            form.change(
                              "pregao_chamada_publica",
                              ficha?.pregao_chamada_publica,
                            );
                          }}
                        >
                          <Option value="" key="0">
                            Selecione uma Ficha Técnica de Produto
                          </Option>
                          {fichasTecnicas.map((e) => (
                            <Option
                              value={formatarNumeroEProdutoFichaTecnica(e)}
                              key={e.uuid}
                            >
                              <div className="d-flex justify-content-between align-items-center">
                                {formatarNumeroEProdutoFichaTecnica(e)}
                                {e.programa === "LEVE_LEITE" && (
                                  <TagLeveLeite />
                                )}
                              </div>
                            </Option>
                          ))}
                        </ASelect>
                      )}
                    />
                  </div>

                  <div className="col">
                    <Field
                      component={InputText}
                      label="Nº do Pregão/Chamada Pública"
                      name={`pregao_chamada_publica`}
                      dataTestId={"pregao-chamada-publica"}
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
                  dataTestId={"inserir-arquivo-primaria"}
                />

                <hr />

                <InserirArquivo
                  setFiles={setFiles2}
                  removeFile={removeFile2}
                  tipoEmbalagem={"SECUNDARIA"}
                  dataTestId={"inserir-arquivo-secundaria"}
                />

                <hr />

                <InserirArquivo
                  setFiles={setFiles3}
                  removeFile={removeFile3}
                  tipoEmbalagem={"TERCIARIA"}
                  dataTestId={"inserir-arquivo-terciaria"}
                />

                <hr />

                <div className="row">
                  <div className="col-12">
                    <Field
                      component={TextArea}
                      label="Observações"
                      name="observacoes"
                      dataTestId={"observacoes"}
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
                      Object.keys(errors).length > 0 || primaria.length === 0
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
