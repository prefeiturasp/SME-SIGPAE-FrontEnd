import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import {
  cadastrarProdutoEdital,
  atualizarProdutoEdital
} from "services/produto.service";
import { Field, Form } from "react-final-form";
import InputText from "components/Shareable/Input/InputText";
import { Select } from "components/Shareable/Select";
import { Spin } from "antd";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import {
  required,
  selectValidate,
  alphaNumericAndSingleSpaceBetweenCharacters,
  noSpaceStartOrEnd
} from "helpers/fieldValidators";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE
} from "components/Shareable/Botao/constants";
import { composeValidators } from "helpers/utilities";
import "./style.scss";
import { tipoStatus } from "helpers/utilities";

export default ({ closeModal, showModal, produto, changePage }) => {
  const [carregando, setCarregando] = useState(true);
  const [tipos, setTipos] = useState(undefined);

  async function fetchData() {
    setTipos(tipoStatus);
    setCarregando(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async formValues => {
    setCarregando(true);
    const payload = {
      nome: formValues.nome,
      ativo: formValues.status
    };
    if (produto) {
      await atualizarProdutoEdital(payload, produto.uuid)
        .then(() => {
          toastSuccess("Alterações salvas com sucesso.");
        })
        .catch(error => {
          toastError(error.response.data[0]);
        });
    } else {
      await cadastrarProdutoEdital(payload)
        .then(() => {
          toastSuccess(
            "Cadastro de Produto Proveniente de Edital efetuado com sucesso."
          );
        })
        .catch(error => {
          toastError(error.response.data[0]);
        });
    }

    setCarregando(false);
    closeModal();
    changePage();
  };

  return (
    <Modal dialogClassName="modal-90w" show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>
          {produto ? "Editar Produto" : "Cadastrar Produto"}
        </Modal.Title>
      </Modal.Header>
      <Spin tip="Carregando..." spinning={carregando}>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Body>
                <div className="row mb-3">
                  <div className="col-4">
                    <label className="col-form-label mb-1">
                      <span className="asterisco">* </span>
                      Status
                    </label>
                    <Field
                      name="status"
                      component={Select}
                      defaultValue={produto ? produto.status : undefined}
                      //disabled={item ? true : false}
                      options={[
                        { uuid: "", nome: "Selecione uma opção" }
                      ].concat(
                        tipos &&
                          tipos.map(tipo => {
                            return { uuid: tipo.uuid, nome: tipo.status };
                          })
                      )}
                      required
                      validate={selectValidate}
                      onChange
                    />
                  </div>
                  <div className="col-8">
                    <label className="col-form-label mb-1">
                      <span className="asterisco">* </span>
                      Nome
                    </label>
                    <Field
                      name="nome"
                      defaultValue={produto ? produto.nome : undefined}
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
                      style={BUTTON_STYLE.DARK_OUTLINE}
                      className="ml-3"
                    />
                    <Botao
                      texto="Salvar"
                      type={BUTTON_TYPE.SUBMIT}
                      style={BUTTON_STYLE.GREEN}
                      className="ml-3"
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
