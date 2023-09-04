import React, { useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { Radio } from "antd";
import { Modal } from "react-bootstrap";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import InputFile from "components/Shareable/Input/InputFile";
import { Field, Form } from "react-final-form";
import { OPCOES_AVALIACAO_A_CONTENTO } from "../LancamentoPorPeriodo/helpers";
import { updateSolicitacaoMedicaoInicial } from "services/medicaoInicial/solicitacaoMedicaoInicial.service";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";

export const ModalFinalizarMedicao = ({ ...props }) => {
  const {
    showModal,
    closeModal,
    escolaInstituicao,
    solicitacaoMedicaoInicial,
    setObjSolicitacaoMIFinalizada,
    onClickInfoBasicas,
  } = props;

  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
  const [disableFinalizarMedicao, setDisableFinalizarMedicao] = useState(true);
  const [showButtonAnexarPlanilha, setShowButtonAnexarPlanilha] =
    useState(false);
  const [arquivo, setArquivo] = useState([]);
  const [validationFile, setValidationFile] = useState({ touched: false });

  const handleOnChange = (event) => {
    if (opcaoSelecionada === OPCOES_AVALIACAO_A_CONTENTO.NAO_COM_OCORRENCIAS) {
      setArquivo([]);
    }
    if (
      event.target.value === OPCOES_AVALIACAO_A_CONTENTO.SIM_SEM_OCORRENCIAS
    ) {
      setDisableFinalizarMedicao(false);
      setShowButtonAnexarPlanilha(false);
    } else {
      arquivo.length === 0 && setDisableFinalizarMedicao(true);
      event.target.value === OPCOES_AVALIACAO_A_CONTENTO.NAO_COM_OCORRENCIAS &&
        setShowButtonAnexarPlanilha(true);
    }
    setOpcaoSelecionada(event.target.value);
  };

  const handleHideModal = () => {
    setOpcaoSelecionada(null);
    setDisableFinalizarMedicao(true);
    setShowButtonAnexarPlanilha(false);
    setArquivo([]);
    closeModal();
  };

  const isValidFiles = (files) => {
    let validation = { touched: true };
    files.forEach((element) => {
      const base64Ext = element.base64.split(";")[0];
      if (base64Ext.includes("pdf")) {
        validation = {
          ...validation,
          pdf: true,
        };
      }
      if (base64Ext.includes("spreadsheetml")) {
        validation = {
          ...validation,
          xls: true,
        };
      }
    });
    if (validation.xls && validation.pdf) {
      setDisableFinalizarMedicao(false);
    } else {
      setDisableFinalizarMedicao(true);
    }
    setValidationFile(validation);
  };

  const removeFile = () => {
    let arquivos = arquivo;
    isValidFiles(arquivos);
    setArquivo(arquivos);
  };

  const setFiles = (files) => {
    let arquivos = arquivo;
    arquivos = files;
    isValidFiles(arquivos);
    setArquivo(arquivos);
  };

  const handleFinalizarMedicao = async () => {
    let data = new FormData();
    data.append("escola", String(escolaInstituicao.uuid));
    data.append(
      "tipo_contagem_alimentacoes",
      String(solicitacaoMedicaoInicial.tipo_contagem_alimentacoes.uuid)
    );
    data.append(
      "responsaveis",
      JSON.stringify(solicitacaoMedicaoInicial.responsaveis)
    );
    data.append("com_ocorrencias", String(!opcaoSelecionada));

    if (!opcaoSelecionada) {
      let payloadAnexos = [];
      arquivo.forEach((element) => {
        payloadAnexos.push({
          nome: String(element.nome),
          base64: String(element.base64),
        });
      });
      data.append("anexos", JSON.stringify(payloadAnexos));
    }

    const response = await updateSolicitacaoMedicaoInicial(
      solicitacaoMedicaoInicial.uuid,
      data
    );
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess("Medição Inicial finalizada com sucesso!");
      setObjSolicitacaoMIFinalizada(response.data);
      handleHideModal();
    } else {
      toastError("Não foi possível finalizar as alterações!");
    }
    onClickInfoBasicas();
  };

  return (
    <Modal
      dialogClassName="modal-50w"
      show={showModal}
      onHide={() => handleHideModal()}
    >
      <Modal.Header closeButton>
        <Modal.Title>Avaliação do Serviço</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col">
            <p className="ml-2">
              Neste mês, a direção da Unidade Educacional considera que o
              serviço foi realizado a contento?
            </p>
          </div>
        </div>
        <div className="row">
          <Radio.Group
            onChange={(event) => handleOnChange(event)}
            value={opcaoSelecionada}
          >
            <Radio
              className="radio-opt-positive"
              value={OPCOES_AVALIACAO_A_CONTENTO.SIM_SEM_OCORRENCIAS}
            >
              Sim, sem ocorrências
            </Radio>
            <Radio
              className="radio-opt-negative"
              value={OPCOES_AVALIACAO_A_CONTENTO.NAO_COM_OCORRENCIAS}
            >
              Não, com ocorrências
            </Radio>
          </Radio.Group>
        </div>
        <div className="row pl-2">
          {showButtonAnexarPlanilha && (
            <Form
              onSubmit={() => {}}
              render={() => (
                <Field
                  component={InputFile}
                  className="inputfile"
                  alignLeft={true}
                  texto="Anexar arquivos"
                  name="files"
                  accept=".xls, .xlsx, .pdf"
                  setFiles={setFiles}
                  removeFile={removeFile}
                  toastSuccess={"Arquivos anexados com sucesso!"}
                  ehPlanilhaMedicaoInicial={true}
                  validationFile={validationFile}
                  concatenarNovosArquivos={true}
                  helpText={
                    "É obrigatório anexar o relatório de ocorrências no formato Excel e também no formato PDF"
                  }
                  customHelpTextClassName="custom-style-help-text"
                />
              )}
            />
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="row">
          <div className="col-12">
            <Botao
              texto="Cancelar"
              type={BUTTON_TYPE.BUTTON}
              onClick={() => handleHideModal()}
              style={BUTTON_STYLE.GREEN_OUTLINE_WHITE}
              className="ml-3"
            />
            <Botao
              texto="Finalizar Medição"
              type={BUTTON_TYPE.BUTTON}
              onClick={() => handleFinalizarMedicao()}
              style={BUTTON_STYLE.GREEN}
              className="ml-3"
              disabled={disableFinalizarMedicao}
            />
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
