import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { Botao } from "../../../../Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "../../../../Shareable/Botao/constants";
import "../../style.scss";

export class ModalCadastroLote extends Component {
  onSubmit() {
    const values = {
      nome: this.props.nome,
      iniciais: this.props.iniciais,
      escolasSelecionadas: this.props.escolasSelecionadas,
    };
    this.props.onSubmit(values);
  }

  render() {
    const {
      atualizando,
      showModal,
      closeModal,
      diretoria_regional,
      subprefeituras = [],
      iniciais,
      nome,
      tipo_gestao,
      escolasSelecionadas = [],
    } = this.props;
    const title = atualizando
      ? "Deseja atualizar o lote?"
      : "Deseja criar um novo lote?";
    return (
      <Modal
        dialogClassName="modal-cadastro-lote modal-90w"
        show={showModal}
        onHide={closeModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-12">
              <p>Resumo</p>
              <p>DRE {diretoria_regional}</p>
              <p>Lote: {iniciais}</p>
              <p>Número: {nome}</p>
              <p>Tipo de Gestão: {tipo_gestao}</p>
            </div>
          </div>
          {subprefeituras.length > 0 && (
            <div className="row pt-3">
              <div className="col-12">
                <label className="label-selected-unities">
                  Subprefeituras Selecionadas
                </label>
                {subprefeituras.map((subprefeitura, indice) => {
                  return (
                    <div className="value-selected-unities" key={indice}>
                      {subprefeitura}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {escolasSelecionadas.length > 0 && (
            <div className="row pt-3">
              <div className="col-12">
                <label className="label-selected-unities">
                  {`( ${escolasSelecionadas.length} ) Unidades Específicas do Lote Selecionadas`}
                </label>
                {escolasSelecionadas.map((escola, indice) => {
                  return (
                    <div className="value-selected-unities" key={indice}>
                      {escola}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Botao
            texto="Não"
            type={BUTTON_TYPE.BUTTON}
            onClick={closeModal}
            style={BUTTON_STYLE.GREEN_OUTLINE}
            className="ms-3"
          />
          <Botao
            texto="Sim"
            type={BUTTON_TYPE.BUTTON}
            onClick={() => this.onSubmit()}
            style={BUTTON_STYLE.GREEN}
            className="ms-3"
          />
        </Modal.Footer>
      </Modal>
    );
  }
}
