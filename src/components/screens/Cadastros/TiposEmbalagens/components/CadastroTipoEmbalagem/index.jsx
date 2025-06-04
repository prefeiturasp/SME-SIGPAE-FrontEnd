import React, { useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { Spin } from "antd";
import "./style.scss";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { Field, Form } from "react-final-form";
import InputText from "src/components/Shareable/Input/InputText";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  alphaNumericAndSingleSpaceBetweenCharacters,
  noSpaceStartOrEnd,
  required,
} from "src/helpers/fieldValidators";
import {
  cadastraTipoEmbalagem,
  editaTipoEmbalagem,
  getTipoEmbalagem,
  getListaNomesTiposEmbalagens,
} from "src/services/qualidade.service";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { composeValidators } from "src/helpers/utilities";
import {
  CADASTROS,
  CONFIGURACOES,
  TIPOS_EMBALAGENS,
} from "src/configs/constants";

let tituloModalSalvar = "Salvar Cadastro do Tipo de Embalagem";
let tituloModalCancelarSalvar = "Cancelar Cadastro do Tipo da Embalagem";
let tituloModalEditar = "Salvar Edição do Tipo da Embalagem";
let tituloModalCancelarEditar = "Cancelar Edição do Tipo da Embalagem";

let textoModalSalvar = "Confirma o cadastro do Tipo da Embalagem?";
let textoModalCancelarSalvar = "Deseja cancelar o Cadastro?";
let textoModalEditar = "Confirma a edição do cadastro do Tipo da Embalagem?";
let textoModalCancelarEditar = "Deseja cancelar a edição do Cadastro?";

export default () => {
  const [carregando, setCarregando] = useState(false);
  const [showModalSalvar, setShowModalSalvar] = useState(false);
  const [showModalCancelar, setShowModalCancelar] = useState(false);
  const [nomesEmbalagens, setNomesEmbalagens] = useState(null);
  const [edicao, setEdicao] = useState(false);
  const [uuid, setUuid] = useState(null);
  const [initialValues, setInitialValues] = useState({});
  const navigate = useNavigate();

  const onSubmit = () => {
    setShowModalSalvar(true);
  };

  const salvarEmbalagem = async (values, form) => {
    setCarregando(true);
    let payload = montaPayload(values);

    try {
      let response = edicao
        ? await editaTipoEmbalagem(payload, uuid)
        : await cadastraTipoEmbalagem(payload);
      if (response.status === HTTP_STATUS.CREATED) {
        toastSuccess("Tipo de Embalagem cadastrado com sucesso!");
        setShowModalSalvar(false);
        form.restart(initialValues);
        setCarregando(false);
      } else if (response.status === HTTP_STATUS.OK) {
        navigate(`/${CONFIGURACOES}/${CADASTROS}/${TIPOS_EMBALAGENS}`);
        toastSuccess("Edição do cadastro realizado com sucesso!");
        setCarregando(false);
        setShowModalSalvar(false);
      }
    } catch (error) {
      toastError("Ocorreu um erro ao salvar a embalagem");
      setCarregando(false);
      setShowModalSalvar(false);
    }
  };

  const montaPayload = (values) => {
    let payload = {};

    payload.nome = values.nome_embalagem;
    payload.abreviacao = values.abreviacao;

    return payload;
  };

  const validaNomeEmbalagem = (value) => {
    if (value !== initialValues.nome_embalagem) {
      if (nomesEmbalagens && nomesEmbalagens.includes(value))
        return "Tipo de Embalagem já cadastrado";
      else return undefined;
    } else return undefined;
  };

  const buscaEmbalagem = async (value) => {
    let response;
    try {
      response = await getTipoEmbalagem(value);
      if (response.status === HTTP_STATUS.OK) {
        setInitialValues({
          nome_embalagem: response.data.nome,
          abreviacao: response.data.abreviacao,
          data_cadastro: response.data.criado_em.slice(0, 10),
        });
        setCarregando(false);
      }
    } catch (e) {
      toastError("Ocorreu um erro ao carregar dados do Tipo de Embalagem");
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
      buscaEmbalagem(uuid);
    } else {
      setInitialValues({
        data_cadastro: new Date().toLocaleDateString(),
      });
    }

    const buscaListaNomesEmbalagens = async () => {
      const response = await getListaNomesTiposEmbalagens();
      setNomesEmbalagens(response.data.results);
    };

    buscaListaNomesEmbalagens();
  }, []);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-cadastro-embalagem">
        <div className="card-body cadastro-embalagem">
          <Form
            onSubmit={onSubmit}
            initialValues={initialValues}
            render={({ form, handleSubmit, values }) => (
              <form onSubmit={handleSubmit}>
                <div className="mt-4 card-title green">
                  Dados do Tipo da Embalagem
                </div>
                <div className="row">
                  <div className="col-6">
                    <Field
                      component={InputText}
                      label="Nome do Tipo da Embalagem"
                      name="nome_embalagem"
                      placeholder="Digite o nome do Tipo da Embalagem"
                      validate={composeValidators(
                        required,
                        validaNomeEmbalagem,
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
                      validate={composeValidators(required)}
                      required
                      toUppercaseActive
                      maxlength="3"
                      proibeNumeros
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
                    className="float-end ms-3"
                  />
                  <Botao
                    texto="Cancelar"
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    className="float-end ms-3"
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
                      className="ms-3"
                    />
                    <Botao
                      texto="Sim"
                      type={BUTTON_TYPE.BUTTON}
                      onClick={() => {
                        setShowModalCancelar(false);
                        navigate(
                          `/${CONFIGURACOES}/${CADASTROS}/${TIPOS_EMBALAGENS}`
                        );
                      }}
                      style={BUTTON_STYLE.GREEN}
                      className="ms-3"
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
                      className="ms-3"
                    />
                    <Botao
                      texto="Sim"
                      type={BUTTON_TYPE.BUTTON}
                      onClick={() => {
                        salvarEmbalagem(values, form);
                      }}
                      style={BUTTON_STYLE.GREEN}
                      className="ms-3"
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
