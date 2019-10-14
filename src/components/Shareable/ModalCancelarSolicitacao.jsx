import HTTP_STATUS from "http-status-codes";
import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { Field } from "redux-form";
import { cancelaKitLancheAvulsoEscola } from "../../services/solicitacaoDeKitLanche.service";
import { cancelaKitLancheUnificadoDre } from "../../services/solicitacaoUnificada.service";
import { LabelAndTextArea } from "./labelAndInput/labelAndInput";
import { toastError, toastSuccess } from "./Toast/dialogs";
import Botao from "./Botao";
import { BUTTON_TYPE, BUTTON_STYLE } from "./Botao/constants";

export const ORIGEM_SOLICITACAO = {
  ESCOLA: 0,
  DRE: 1
};
export class ModalCancelarSolicitacao extends Component {
  constructor(props) {
    super(props);
    this.state = {
      justificativa: ""
    };
  }

  async cancelarSolicitacaoDaEscola(uuid, origemSolicitacao) {
    const { justificativa } = this.state;
    let resp = "";
    if (origemSolicitacao === ORIGEM_SOLICITACAO.DRE) {
      resp = await cancelaKitLancheUnificadoDre(uuid, justificativa);
    } else {
      resp = await cancelaKitLancheAvulsoEscola(uuid, justificativa);
    }
    if (resp.status === HTTP_STATUS.OK) {
      this.props.closeModal();
      toastSuccess("Solicitação cancelada com sucesso!");
    } else {
      toastError(resp.detail);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.justificativa !== this.props.justificativa) {
      this.setState({ justificativa: this.props.justificativa });
    }
  }
  render() {
    const { showModal, closeModal, uuid, solicitacaoKitLanche } = this.props;
    return (
      <Modal dialogClassName="modal-90w" show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Cancelamento de Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-row">
            <div className="col-12">
              <p className="label--red">
                Este pedido já foi autorizado pela CODAE. Deseja seguir em
                frente com o cancelamento?
              </p>
            </div>
            <div className="col-12 label--gray margin-fix">
              <b>Resumo</b>
              <p>{`Solicitação nº #${solicitacaoKitLanche &&
                solicitacaoKitLanche.id_externo}`}</p>
              <p>{`Solicitante: AGUARDANDO DEFINIÇÃO DE PERFIL`}</p>
              <p>{`Data: ${solicitacaoKitLanche &&
                solicitacaoKitLanche.data}`}</p>
              <p>{`Quantidade de Alimentações: ${solicitacaoKitLanche &&
                solicitacaoKitLanche.quantidade_alimentacoes}`}</p>
            </div>
            <div className="form-group col-12">
              <Field
                component={LabelAndTextArea}
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
              this.cancelarSolicitacaoDaEscola(uuid);
            }}
            style={BUTTON_STYLE.BLUE}
            className="ml-3"
          />
        </Modal.Footer>
      </Modal>
    );
  }
}
