import HTTP_STATUS from "http-status-codes";
import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { Field } from "redux-form";
import { required } from "../../helpers/fieldValidators";
import {
  DRENaoValidaAlteracaoCardapio,
  CODAENegaAlteracaoCardapio
} from "../../services/alteracaoDeCardapio";
import { toastError, toastSuccess } from "./Toast/dialogs";
import { statusEnum } from "../../constants/shared";
import Botao from "./Botao";
import { BUTTON_TYPE, BUTTON_STYLE } from "./Botao/constants";
import Select from "./Select";
import { TextArea } from "./TextArea/TextArea";

export class ModalNegarAlteracaoCardapio extends Component {
  constructor(props) {
    super(props);
    this.state = { justificativa: "", motivoCancelamento: "" };
  }

  async negarAlteracaoCardapio(uuid) {
    const { justificativa, motivoCancelamento } = this.state;
    const { alteracaoDeCardapio } = this.props;

    const functionCancelaAlteracaoCardapio =
      alteracaoDeCardapio &&
      alteracaoDeCardapio.status === statusEnum.DRE_A_VALIDAR
        ? DRENaoValidaAlteracaoCardapio
        : CODAENegaAlteracaoCardapio;

    const resp = await functionCancelaAlteracaoCardapio(
      uuid,
      `${motivoCancelamento} - ${justificativa}`
    );
    if (resp.status === HTTP_STATUS.OK) {
      this.props.closeModal();
      toastSuccess("Alteração do Tipo de Alimentação recusado com sucesso!");
      this.props.setRedirect();
    } else {
      toastError(resp.detail);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.justificativa !== this.props.justificativa) {
      this.setState({ justificativa: this.props.justificativa });
    }
    if (prevProps.motivoCancelamento !== this.props.motivoCancelamento) {
      this.setState({ motivoCancelamento: this.props.motivoCancelamento });
    }
  }

  render() {
    const { showModal, closeModal, uuid, alteracaoDeCardapio } = this.props;
    let negarOuNaoValidarStr = "negar";
    if (
      alteracaoDeCardapio &&
      alteracaoDeCardapio.status === statusEnum.DRE_A_VALIDAR
    )
      negarOuNaoValidarStr = "não validar";
    return (
      <Modal dialogClassName="modal-90w" show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{`Deseja ${negarOuNaoValidarStr} a solicitação?`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-row">
            <div className="form-group col-12">
              <Field
                component={Select}
                name="motivo_cancelamento"
                label="Motivo"
                //TODO: criar campos a mais no backend?
                options={[
                  {
                    nome: "Sem motivo",
                    uuid: "Sem motivo"
                  },
                  {
                    nome: "Em desacordo com o contrato",
                    uuid: "Em desacordo com o contrato"
                  }
                ]}
                validate={required}
              />
            </div>
            <div className="form-group col-12">
              <Field
                component={TextArea}
                placeholder="Obrigatório"
                label="Justificativa"
                name="justificativa"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Botao
            texto="Não"
            type={BUTTON_TYPE.BUTTON}
            onClick={closeModal}
            style={BUTTON_STYLE.BLUE_OUTLINE}
            className="ml-3"
          />
          <Botao
            texto="Sim"
            type={BUTTON_TYPE.BUTTON}
            onClick={() => {
              this.negarAlteracaoCardapio(uuid);
            }}
            style={BUTTON_STYLE.BLUE}
            className="ml-3"
          />
        </Modal.Footer>
      </Modal>
    );
  }
}
