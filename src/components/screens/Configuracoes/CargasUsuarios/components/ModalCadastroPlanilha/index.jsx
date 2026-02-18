import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Form, Field } from "react-final-form";

import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import "./styles.scss";
import { Radio } from "antd";
import InputFile from "src/components/Shareable/Input/InputFile";

const EXTENSOES_PERMITIDAS = "XLSX, XLS";

const ModalCadastroVinculo = ({ show, setShow, onSubmit, servidores }) => {
  const [tipoPlanilha, setTipoPlanilha] = useState(
    servidores ? "SERVIDOR" : undefined,
  );
  const [arquivo, setArquivo] = useState([]);

  const setFiles = (files) => {
    let arquivos = arquivo;
    arquivos = files;
    setArquivo(arquivos);
  };

  const removeFile = () => {
    setArquivo([]);
  };

  const handleClose = () => {
    removeFile();
    setShow(false);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="modal-cadastro-vinculo"
    >
      <Modal.Header closeButton>
        <Modal.Title>Inserir Carga de Usuários</Modal.Title>
      </Modal.Header>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <>
            <Modal.Body>
              <form onSubmit={handleSubmit} className="">
                {!servidores && (
                  <div className="row mx-0 my-1">
                    <span className="label-radio">
                      Modelo de Planilha a ser Inserido
                    </span>
                    <Radio.Group
                      onChange={(event) => setTipoPlanilha(event.target.value)}
                      value={tipoPlanilha}
                    >
                      <Radio value={"SERVIDOR"}>Planilha Servidores</Radio>
                      <Radio value={"NAO_SERVIDOR"}>
                        Planilha Não Servidores
                      </Radio>
                      <Radio value={"UE_PARCEIRA"}>
                        Planilha UEs Parceiras
                      </Radio>
                    </Radio.Group>
                  </div>
                )}

                {tipoPlanilha && (
                  <div className="row pb-3">
                    <article className="col-9 produto">
                      <Field
                        dataTestId="input-anexar"
                        component={InputFile}
                        className="inputfile"
                        texto="Anexar Planilha"
                        name="files"
                        accept={EXTENSOES_PERMITIDAS}
                        setFiles={setFiles}
                        removeFile={removeFile}
                        toastSuccess={"Planilha incluída com sucesso!"}
                        alignLeft
                        disabled={arquivo.length > 0}
                      />
                      <label className="mb-3">
                        {"IMPORTANTE: Envie um arquivo nos formatos: " +
                          EXTENSOES_PERMITIDAS +
                          ", com até 10MB"}
                      </label>
                    </article>
                  </div>
                )}
              </form>
            </Modal.Body>
            <Modal.Footer>
              <div className="w-100">
                <Botao
                  texto="Inserir"
                  type={BUTTON_TYPE.BUTTON}
                  onClick={() => {
                    onSubmit(tipoPlanilha, arquivo);
                    removeFile();
                  }}
                  disabled={!arquivo[0] || !tipoPlanilha}
                  style={BUTTON_STYLE.GREEN}
                  className="ms-3 float-end"
                />
                <Botao
                  texto="Cancelar"
                  type={BUTTON_TYPE.BUTTON}
                  onClick={handleClose}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  className="ms-3 float-end"
                />
              </div>
            </Modal.Footer>
          </>
        )}
      />
    </Modal>
  );
};

export default ModalCadastroVinculo;
