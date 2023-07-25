import React, { useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { Spin } from "antd";
import "./style.scss";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE
} from "components/Shareable/Botao/constants";
import { Field, Form } from "react-final-form";
import InputText from "components/Shareable/Input/InputText";
import { Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import {
  alphaNumericAndSingleSpaceBetweenCharacters,
  noSpaceStartOrEnd,
  required
} from "helpers/fieldValidators";
import {
  cadastrarUnidadeMedida,
  editarUnidadeMedida,
  getUnidadeMedida,
  getNomesEAbreviacoesUnidadesMedida
} from "services/qualidade.service";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import { composeValidators } from "helpers/utilities";
import { CADASTROS, CONFIGURACOES, UNIDADES_MEDIDA } from "configs/constants";

let tituloModalSalvar = "Salvar cadastro da Unidade de Medida";
let tituloModalCancelarSalvar = "Cancelar cadastro da Unidade de Medida";
let tituloModalEditar = "Salvar edição da Unidade de Medida";
let tituloModalCancelarEditar = "Cancelar edição da Unidade de Medida";

let textoModalSalvar = "Confirma o cadastro da Unidade de Medida?";
let textoModalCancelarSalvar = "Deseja cancelar o cadastro?";
let textoModalEditar = "Confirma a edição do cadastro da Unidade de Medida?";
let textoModalCancelarEditar = "Deseja cancelar a edição do cadastro?";

export default () => {
  const [carregando, setCarregando] = useState(false);
  const [showModalSalvar, setShowModalSalvar] = useState(false);
  const [showModalCancelar, setShowModalCancelar] = useState(false);
  const [nomesUnidadesMedida, setNomesUnidadesMedida] = useState(null);
  const [edicao, setEdicao] = useState(false);
  const [uuid, setUuid] = useState(null);
  const [initialValues, setInitialValues] = useState({});

  const history = useHistory();

  const onSubmit = () => {
    setShowModalSalvar(true);
  };

  const salvarDados = async (values, form) => {
    setCarregando(true);

    let payload = montaPayload(values);

    try {
      let response = edicao
        ? await editarUnidadeMedida(payload, uuid)
        : await cadastrarUnidadeMedida(payload);
      if (response.status === HTTP_STATUS.CREATED) {
        toastSuccess("Unidade de Medida cadastrada com sucesso!");
        setShowModalSalvar(false);
        form.restart(initialValues);
        setCarregando(false);
      } else if (response.status === HTTP_STATUS.OK) {
        history.push(`/${CONFIGURACOES}/${CADASTROS}/${UNIDADES_MEDIDA}`);
        toastSuccess("Unidade de Medida atualizada com sucesso!");
        setCarregando(false);
        setShowModalSalvar(false);
      }
    } catch (error) {
      toastError("Ocorreu um erro ao salvar a Unidade de Medida");
      setCarregando(false);
      setShowModalSalvar(false);
    }
  };

  const montaPayload = values => {
    let payload = {};

    payload.nome = values.nome_unidade_medida;
    payload.abreviacao = values.abreviacao;

    return payload;
  };

  const validaNomeJaCadastrado = nome => {
    if (nome !== initialValues.nome_unidade_medida) {
      if (nomesUnidadesMedida && nomesUnidadesMedida.includes(nome))
        return "Unidade de Medida já cadastrada";
      else return undefined;
    } else return undefined;
  };

  const buscaUnidadeMedida = async uuid => {
    let response;
    try {
      response = await getUnidadeMedida(uuid);
      if (response.status === HTTP_STATUS.OK) {
        setInitialValues({
          nome_unidade_medida: response.data.nome,
          abreviacao: response.data.abreviacao,
          data_cadastro: response.data.criado_em.slice(0, 10)
        });
        setCarregando(false);
      }
    } catch (e) {
      console.log(e);
      toastError("Ocorreu um erro ao carregar dados da Unidade de Medida");
      setCarregando(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");

    if (uuid) {
      setUuid(uuid);
      setCarregando(true);
      setEdicao(true);
      buscaUnidadeMedida(uuid);
    } else {
      setInitialValues({
        data_cadastro: new Date().toLocaleDateString()
      });
    }

    const buscaListaNomesUnidadesMedida = async () => {
      const response = await getNomesEAbreviacoesUnidadesMedida();
      const nomes = response.data.results.map(e => e.nome);
      setNomesUnidadesMedida(nomes);
    };

    buscaListaNomesUnidadesMedida();
  }, []);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card card-cadastro mt-3">
        <div className="card-body card-cadastro-body">
          <Form
            onSubmit={onSubmit}
            initialValues={initialValues}
            render={({ form, handleSubmit, values }) => (
              <form onSubmit={handleSubmit}>
                <div className="card-cadastro-title mt-4 mb-3">
                  Dados da Unidade de Medida
                </div>
                <div className="row">
                  <div className="col-6">
                    <Field
                      component={InputText}
                      label="Nome da Unidade de Medida"
                      name="nome_unidade_medida"
                      placeholder="Digite o nome da Unidade de Medida"
                      validate={composeValidators(
                        required,
                        validaNomeJaCadastrado,
                        alphaNumericAndSingleSpaceBetweenCharacters,
                        noSpaceStartOrEnd
                      )}
                      required
                      toUppercaseActive
                    />
                  </div>
                  <div className="col-3">
                    <Field
                      component={InputText}
                      label="Abreviação"
                      name="abreviacao"
                      placeholder="Digite a Abreviação"
                      validate={composeValidators(
                        required,
                        alphaNumericAndSingleSpaceBetweenCharacters,
                        noSpaceStartOrEnd
                      )}
                      required
                      toLowerCaseActive
                    />
                  </div>
                  <div className="col-3">
                    <Field
                      component={InputText}
                      label="Data do Cadastro"
                      name="data_cadastro"
                      disabled={true}
                    />
                  </div>
                </div>

                <div className="mt-5 mb-4">
                  <Botao
                    texto="Salvar"
                    type={BUTTON_TYPE.SUBMIT}
                    style={BUTTON_STYLE.GREEN}
                    className="float-right ml-3"
                  />
                  <Botao
                    texto="Cancelar"
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    className="float-right ml-3"
                    onClick={() => {
                      setShowModalCancelar(true);
                    }}
                  />
                </div>
                <Modal
                  show={showModalCancelar}
                  onHide={() => {
                    setShowModalCancelar(false);
                  }}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>
                      {edicao
                        ? tituloModalCancelarEditar
                        : tituloModalCancelarSalvar}
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {edicao
                      ? textoModalCancelarEditar
                      : textoModalCancelarSalvar}
                  </Modal.Body>
                  <Modal.Footer>
                    <Botao
                      texto="Não"
                      type={BUTTON_TYPE.BUTTON}
                      onClick={() => {
                        setShowModalCancelar(false);
                      }}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      className="ml-3"
                    />
                    <Botao
                      texto="Sim"
                      type={BUTTON_TYPE.BUTTON}
                      onClick={() => {
                        setShowModalCancelar(false);
                        history.push(
                          `/${CONFIGURACOES}/${CADASTROS}/${UNIDADES_MEDIDA}`
                        );
                      }}
                      style={BUTTON_STYLE.GREEN}
                      className="ml-3"
                    />
                  </Modal.Footer>
                </Modal>
                <Modal
                  show={showModalSalvar}
                  onHide={() => {
                    setShowModalSalvar(false);
                  }}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>
                      {edicao ? tituloModalEditar : tituloModalSalvar}
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {edicao ? textoModalEditar : textoModalSalvar}
                  </Modal.Body>
                  <Modal.Footer>
                    <Botao
                      texto="Não"
                      type={BUTTON_TYPE.BUTTON}
                      onClick={() => {
                        setShowModalSalvar(false);
                        setCarregando(false);
                      }}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      className="ml-3"
                    />
                    <Botao
                      texto="Sim"
                      type={BUTTON_TYPE.BUTTON}
                      onClick={() => {
                        salvarDados(values, form);
                      }}
                      style={BUTTON_STYLE.GREEN}
                      className="ml-3"
                    />
                  </Modal.Footer>
                </Modal>
              </form>
            )}
          />
        </div>
      </div>
    </Spin>
  );
};
