import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import { Button } from "react-bootstrap";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import { Field, Form } from "react-final-form";
import { getConsolidadoAlimentos } from "src/services/logistica.service";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import TabelaAlimentoConsolidado from "src/components/Logistica/TabelaAlimentoConsolidado";
import { required, requiredMultiselectKhan } from "src/helpers/fieldValidators";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import ConfirmarEnvio from "./ConfirmarEnvio";
import { Spin } from "antd";
import moment from "moment";
import "./styles.scss";

export default ({ solicitacao, updatePage }) => {
  const [show, setShow] = useState(false);
  const [showConfirmarEnvio, setShowConfirmarEnvio] = useState(false);
  const [alimentosConsolidado, setAlimentosConsolidado] = useState();

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (!alimentosConsolidado) getAlimentos();
    setShow(true);
  };

  const getAlimentos = () => {
    getConsolidadoAlimentos(solicitacao.uuid).then((res) => {
      setAlimentosConsolidado(res.data);
    });
  };

  const getDiferencaDiasUteis = (dataEntrega) => {
    const firstDay = moment(new Date(), "DD/MM/YYYY");
    const lastDay = moment(dataEntrega, "DD/MM/YYYY");

    let calcDias =
      1 +
      (lastDay.diff(firstDay, "days") * 5 -
        (firstDay.day() - lastDay.day()) * 2) /
        7;

    if (lastDay.day() === 6) calcDias--;
    if (firstDay.day() === 0) calcDias--;

    return calcDias;
  };

  const isDisabled = () => {
    const dataEntrega = solicitacao.guias[0].data_entrega;
    const diasUteis = getDiferencaDiasUteis(dataEntrega);
    const statusEnable = ["Enviada"];

    if (diasUteis <= 3 || solicitacao.situacao === "ARQUIVADA") return true;
    else if (!statusEnable.includes(solicitacao.status)) return true;

    return false;
  };

  const onSubmit = async () => {
    setShowConfirmarEnvio(true);
  };

  return (
    <>
      <Button
        className="acoes alterar"
        onClick={handleShow}
        variant="link"
        disabled={isDisabled()}
      >
        <i className="fas fa-sync-alt alterar" /> Alterar
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="custom-modal-size"
      >
        <Modal.Header closeButton>
          <Modal.Title> Alterar </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Confira a visão geral da Requisição de Entrega:{" "}
          <b>{solicitacao.numero_solicitacao}</b>.
          <label className="float-end">
            Data de entrega: <b>{solicitacao.guias[0].data_entrega}</b>
          </label>
          <div className="text-center">
            <Spin
              tip="Carregando alimentos..."
              spinning={!alimentosConsolidado}
            />
          </div>
          {alimentosConsolidado && (
            <TabelaAlimentoConsolidado
              alimentosConsolidado={alimentosConsolidado}
              mostrarPesoTotal={true}
            />
          )}
          <Form
            onSubmit={onSubmit}
            subscription={{ submitting: true, values: true }}
            validate={(values) => {
              const errors = {};
              if (
                values.motivo &&
                values.motivo.includes("OUTROS") &&
                !values.justificativa
              ) {
                errors.justificativa = "Campo obrigatório";
              }
              return errors;
            }}
            render={({ handleSubmit, form, values }) => {
              return (
                <>
                  <form
                    onSubmit={handleSubmit}
                    className="filtros-alterar-req-logistica"
                  >
                    <div className="row">
                      <div className="col">
                        <Field
                          label="Motivo"
                          component={MultiSelect}
                          disableSearch
                          name="motivo"
                          multiple
                          nomeDoItemNoPlural="classificações"
                          pluralFeminino
                          required
                          validate={requiredMultiselectKhan}
                          options={[
                            {
                              value: "ALTERAR_DATA_ENTREGA",
                              label: "Alterar data de entrega",
                            },
                            {
                              value: "ALTERAR_QTD_ALIMENTO",
                              label: "Alterar quantidade de alimento",
                            },
                            {
                              value: "ALTERAR_ALIMENTO",
                              label: "Alterar alimento",
                            },
                            { value: "OUTROS", label: "Outros" },
                          ]}
                        />
                      </div>
                    </div>
                    <div className="row mb-5">
                      <div className="col">
                        <Field
                          component={TextArea}
                          label="Justificativa"
                          name="justificativa"
                          required
                          validate={required}
                        />
                      </div>
                    </div>
                    <br />

                    <div className="row mb-3">
                      <div className="col">
                        <ConfirmarEnvio
                          show={showConfirmarEnvio}
                          setShow={setShowConfirmarEnvio}
                          form={form}
                          updatePage={updatePage}
                          handleCloseAll={handleClose}
                          solicitacao={solicitacao}
                          values={values}
                        />
                        <Botao
                          texto="Voltar"
                          type={BUTTON_TYPE.BUTTON}
                          onClick={handleClose}
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                          className="float-end ms-3"
                        />
                      </div>
                    </div>
                  </form>
                </>
              );
            }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};
