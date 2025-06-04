import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import {
  getTiposItems,
  cadastrarItem,
  atualizarItem,
} from "src/services/produto.service";
import { Field, Form } from "react-final-form";
import InputText from "src/components/Shareable/Input/InputText";
import { Select } from "src/components/Shareable/Select";
import { Spin } from "antd";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import {
  required,
  selectValidate,
  alphaNumericAndSingleSpaceBetweenCharacters,
  noSpaceStartOrEnd,
} from "src/helpers/fieldValidators";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import {
  composeValidators,
  usuarioEhEmpresaTerceirizada,
} from "src/helpers/utilities";
import "./style.scss";

export default ({
  closeModal,
  showModal,
  item,
  changePage,
  tipoFixo = false,
}) => {
  const [carregando, setCarregando] = useState(true);
  const [tipos, setTipos] = useState(undefined);

  async function fetchData() {
    const respTipos = await getTiposItems();
    const permissao = usuarioEhEmpresaTerceirizada();
    if (permissao) {
      const result = respTipos.data.filter(
        (data) => data.tipo === "MARCA" || data.tipo === "FABRICANTE"
      );
      setTipos(result);
    } else {
      setTipos(respTipos.data);
    }
    setCarregando(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (formValues) => {
    setCarregando(true);
    const payload = {
      nome: formValues.nome,
      tipo: formValues.tipo,
    };
    if (item) {
      await atualizarItem(payload, item.uuid)
        .then(() => {
          toastSuccess("Cadastro atualizado com sucesso");
        })
        .catch((error) => {
          toastError(error.response.data[0]);
        });
    } else {
      await cadastrarItem(payload)
        .then(() => {
          toastSuccess("Cadastro realizado com sucesso");
        })
        .catch((error) => {
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
        <Modal.Title>{item ? "Editar Item" : "Cadastrar Item"}</Modal.Title>
      </Modal.Header>
      <Spin tip="Carregando..." spinning={carregando}>
        <Form
          onSubmit={onSubmit}
          initialValues={tipoFixo ? { tipo: tipoFixo } : {}}
          render={({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Body>
                <div className="row mb-3">
                  <div className="col-4">
                    <label className="col-form-label mb-1">
                      <span className="asterisco">* </span>
                      Tipo
                    </label>
                    <Field
                      name="tipo"
                      component={Select}
                      defaultValue={item ? item.tipo : undefined}
                      disabled={item || tipoFixo ? true : false}
                      options={[
                        { uuid: "", nome: "Selecione uma opção" },
                      ].concat(
                        tipos &&
                          tipos.map((tipo) => {
                            return { uuid: tipo.tipo, nome: tipo.tipo_display };
                          })
                      )}
                      required
                      validate={selectValidate}
                    />
                  </div>
                  <div className="col-8">
                    <label className="col-form-label mb-1">
                      <span className="asterisco">* </span>
                      Nome
                    </label>
                    <Field
                      name="nome"
                      defaultValue={item ? item.nome : undefined}
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
                      className="ms-3"
                    />
                    <Botao
                      texto="Salvar"
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
