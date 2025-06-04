import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Form } from "react-final-form";
import { Spin } from "antd";
import { ativarInativarProduto } from "src/services/produto.service";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";

export default ({ closeModal, showModal, item, changePage }) => {
  const [carregando, setCarregando] = useState(false);

  const onSubmit = async () => {
    setCarregando(true);
    await ativarInativarProduto(item.uuid)
      .then(() => {
        toastSuccess(
          `Produto ${item.ativo ? "inativado" : "ativado"} com sucesso`
        );
      })
      .catch((error) => {
        toastError(error.response.data.detail);
      });
    setCarregando(false);
    closeModal();
    changePage();
  };

  return (
    <Modal dialogClassName="modal-50w" show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>
          {item && item.ativo
            ? "Inativar produto vinculado ao edital"
            : "Ativar produto vinculado ao edital"}
        </Modal.Title>
      </Modal.Header>
      <Spin tip="Carregando..." spinning={carregando}>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Body>
                <div className="row">
                  <div className="col-12">
                    <p>
                      {item && item.ativo
                        ? "Deseja inativar este produto vinculado ao edital?"
                        : "Deseja ativar este produto vinculado ao edital?"}
                    </p>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div className="row mt-4">
                  <div className="col-12">
                    <Botao
                      texto="Não"
                      type={BUTTON_TYPE.BUTTON}
                      onClick={closeModal}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      className="ms-3"
                    />
                    <Botao
                      texto="Sim"
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
