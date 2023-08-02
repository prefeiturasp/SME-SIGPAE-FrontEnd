import React, { useState } from "react";
import { Spin } from "antd";
import HTTP_STATUS from "http-status-codes";
import StatefulMultiSelect from "@khanacademy/react-multi-select";
import { Form, Field } from "react-final-form";
import { Modal } from "react-bootstrap";
import InputText from "components/Shareable/Input/InputText";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE
} from "components/Shareable/Botao/constants";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import { CODAEHomologaProduto } from "services/produto.service";

export const ModalVincularEditais = ({ ...props }) => {
  const {
    showModal,
    closeModal,
    editaisOptions,
    editais,
    onChangeEditais,
    uuid,
    loadSolicitacao,
    produto,
    tituloModal,
    ehSuspensaoFluxoAlteracaoDados
  } = props;

  const [loading, setLoading] = useState(false);

  const renderizarLabelEditais = (selected, options) => {
    if (selected.length === 0) {
      return "Selecione os editais vinculados";
    }
    if (selected.length === options.length) {
      return "Todos os editais estão selecionados";
    }
    if (selected.length === 1) {
      return `${selected.length} edital selecionado`;
    }
    return `${selected.length} editais selecionados`;
  };

  const onSubmit = () => {
    setLoading(true);
    CODAEHomologaProduto(uuid, editais).then(response => {
      if (response.status === HTTP_STATUS.OK) {
        toastSuccess("Solicitação de homologado enviada com sucesso");
        setLoading(false);
        closeModal();
        if (ehSuspensaoFluxoAlteracaoDados) {
          const searchParams = new URLSearchParams(window.location.search);
          searchParams.set("uuid", response.data.uuid);
          const newRelativePathQuery =
            window.location.pathname + "?" + searchParams.toString();
          history.pushState(null, "", newRelativePathQuery);
          loadSolicitacao(response.data.uuid);
        } else {
          loadSolicitacao(uuid);
        }
      } else {
        toastError(response.data.detail);
        setLoading(false);
      }
    });
  };

  return (
    <Form
      initialValues={{
        produto: {
          tipo: produto.eh_para_alunos_com_dieta ? "Dieta Especial" : "Comum",
          nome: produto.nome,
          marca: produto.marca.nome,
          fabricante: produto.fabricante.nome
        }
      }}
      onSubmit={onSubmit}
    >
      {({ handleSubmit, form }) => (
        <form onSubmit={handleSubmit}>
          <Modal
            dialogClassName="modal-90w"
            show={showModal}
            onHide={closeModal}
          >
            <Spin tip="Enviando..." spinning={loading}>
              <Modal.Header closeButton>
                <Modal.Title>
                  {tituloModal || "Homologação do Produto"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="row mb-3">
                  <div className="col-4">
                    <Field
                      name="produto.nome"
                      label="Nome do Produto"
                      component={InputText}
                      disabled
                    />
                  </div>
                  <div className="col-4">
                    <Field
                      name="produto.marca"
                      label="Marca do Produto"
                      component={InputText}
                      disabled
                    />
                  </div>
                  <div className="col-4">
                    <Field
                      name="produto.fabricante"
                      label="Fabricante do Produto"
                      component={InputText}
                      disabled
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-4">
                    <Field
                      name="produto.tipo"
                      label="Tipo do Produto"
                      component={InputText}
                      disabled
                    />
                  </div>
                  <div className="col-4">
                    <div className="mb-2">
                      <label>Editais</label>
                    </div>
                    <Field
                      component={StatefulMultiSelect}
                      name="editais"
                      selected={editais}
                      disableSearch={true}
                      options={editaisOptions.map(edital => ({
                        label: edital.numero,
                        value: edital.uuid
                      }))}
                      valueRenderer={(selected, options) =>
                        renderizarLabelEditais(selected, options)
                      }
                      overrideStrings={{
                        selectAll: "Todos os editais"
                      }}
                      onSelectedChanged={values => onChangeEditais(values)}
                    />
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div className="row mt-4">
                  <div className="col-12">
                    <Botao
                      texto="Voltar"
                      type={BUTTON_TYPE.BUTTON}
                      onClick={closeModal}
                      style={BUTTON_STYLE.GREEN_OUTLINE_WHITE}
                      className="ml-3"
                    />
                    <Botao
                      texto="Homologar"
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.GREEN}
                      className="ml-3"
                      onClick={() => {
                        form.submit();
                      }}
                      disabled={editais.length === 0}
                    />
                  </div>
                </div>
              </Modal.Footer>
            </Spin>
          </Modal>
        </form>
      )}
    </Form>
  );
};
