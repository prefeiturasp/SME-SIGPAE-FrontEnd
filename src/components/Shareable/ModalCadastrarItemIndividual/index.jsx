import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import {
  cadastrarItem,
  cadastrarProdutoEdital,
} from "services/produto.service";
import { Field, Form } from "react-final-form";
import InputText from "components/Shareable/Input/InputText";
import { Spin } from "antd";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import {
  required,
  alphaNumericAndSingleSpaceBetweenCharacters,
  noSpaceStartOrEnd,
} from "helpers/fieldValidators";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "components/Shareable/Botao/constants";
import { composeValidators } from "helpers/utilities";

const tipoCadastroConfig = {
  MARCA: {
    serviceCadastro: cadastrarItem,
    payloadBase: {
      tipo: "MARCA",
    },
  },
  FABRICANTE: {
    serviceCadastro: cadastrarItem,
    payloadBase: {
      tipo: "FABRICANTE",
    },
  },
  PRODUTO: {
    serviceCadastro: cadastrarProdutoEdital,
    payloadBase: {
      ativo: "Ativo",
      tipo_produto: "LOGISTICA",
    },
  },
  // Adicione outros tipos conforme necessário
};

export default ({
  closeModal,
  showModal,
  atualizarDadosCarregados,
  tipoCadastro,
  tipoCadastroVisualizacao,
}) => {
  const [carregando, setCarregando] = useState(false);

  const onSubmit = async (formValues) => {
    setCarregando(true);

    const { serviceCadastro, payloadBase } = tipoCadastroConfig[tipoCadastro];

    try {
      await serviceCadastro({
        ...payloadBase,
        nome: formValues.nome,
      }).then(() => {
        toastSuccess("Cadastro realizado com sucesso");
      });
      atualizarDadosCarregados();
    } catch (error) {
      toastError(error.response?.data[0] || "Erro ao cadastrar");
    }

    setCarregando(false);
    closeModal();
  };

  return (
    <Modal
      dialogClassName="modal-50w"
      show={showModal}
      onHide={closeModal}
      container={document.body}
    >
      <Modal.Header closeButton>
        <Modal.Title>{`Cadastrar ${tipoCadastroVisualizacao}`}</Modal.Title>
      </Modal.Header>
      <Spin tip="Carregando..." spinning={carregando}>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Body>
                <div className="row mb-3">
                  <div className="mt-2">
                    <Field
                      name="nome"
                      label="Nome"
                      dataTestId="cadastroItem"
                      placeholder="Digite o Nome"
                      component={InputText}
                      required
                      validate={composeValidators(
                        required,
                        alphaNumericAndSingleSpaceBetweenCharacters,
                        noSpaceStartOrEnd
                      )}
                      toUppercaseActive
                    />
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div className="row mt-4">
                  <div className="col-12">
                    <Botao
                      texto="Cancelar"
                      type={BUTTON_TYPE.BUTTON}
                      onClick={closeModal}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      className="ms-3"
                    />
                    <Botao
                      texto="Cadastrar"
                      type={BUTTON_TYPE.SUBMIT}
                      style={BUTTON_STYLE.GREEN}
                      className="ms-3"
                      disabled={submitting}
                    />
                  </div>
                </div>
              </Modal.Footer>
            </form>
          )}
        />
      </Spin>
    </Modal>
  );
};
