import React, { Fragment } from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import "../../style.scss";
import { FormCadastroEditaisContratosInterface } from "../../../interfaces";
import { LoteRascunhosInterface } from "interfaces/rascunhos.interface";
import { DiretoriaRegionalInterface } from "interfaces/escola.interface";
import { TerceirizadaInterface } from "interfaces/terceirizada.interface";

interface ModalCadastroEditalInterface {
  showModal: boolean;
  closeModal: () => void;
  submitting: boolean;
  values: FormCadastroEditaisContratosInterface;
  onSubmit: (_values: FormCadastroEditaisContratosInterface) => void;
  lotes: Array<LoteRascunhosInterface>;
  DREs: Array<DiretoriaRegionalInterface>;
  empresas: Array<TerceirizadaInterface>;
}

export const ModalCadastroEdital = ({
  showModal,
  closeModal,
  submitting,
  values,
  onSubmit,
  lotes,
  DREs,
  empresas,
}: ModalCadastroEditalInterface) => {
  return (
    <Modal dialogClassName=" modal-90w" show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title className="modal-cadastro-edital">
          Deseja Cadastrar um novo contrato?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <section>
          <article className="modal-cadastro-edital">
            <header>Resumo</header>
            <div className="detalhes">
              <div>
                <span>Tipo de contratação:</span> {values.tipo_contratacao}
              </div>
              <div>
                <span>Nº do edital:</span> {values.numero}
              </div>
              <div>
                <span>Processo administrativo do contrato:</span>{" "}
                {values.processo}
              </div>
              <div>
                <span>Objeto resumido:</span> {values.objeto}
              </div>
            </div>
          </article>
          <hr />

          <article className="modal-cadastro-edital">
            <header className="pb-3">Contratos relacionados</header>
            {values.contratos.map((contrato, key) => {
              return (
                <Fragment key={key}>
                  <section>
                    <div className="detalhes">
                      <div>
                        <span>Contrato n°:</span> {contrato.numero}
                      </div>
                      <div className="vigencias">
                        <span>Vigência: </span>
                        <div className="iteracao-elementos">
                          {contrato.vigencias?.map((vigencia, key) => {
                            return (
                              <div key={key} className="elementos">
                                De {vigencia?.data_inicial} até{" "}
                                {vigencia?.data_final};
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <span>Processo administrativo do contrato:</span>{" "}
                        {contrato.processo}
                      </div>
                      <div>
                        <span>Data da proposta:</span> {contrato.data_proposta}
                      </div>
                      <div className="iteracao-elementos">
                        <span>Lote:</span>
                        <div className="iteracao-elementos">
                          {contrato.lotes?.map((lote, key) => {
                            return (
                              <div key={key} className="elementos">
                                {
                                  lotes.find((lote_) => lote_.uuid === lote)
                                    ?.nome
                                }
                                ;{" "}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="iteracao-elementos">
                        <span>DRE:</span>
                        <div className="iteracao-elementos">
                          {contrato.diretorias_regionais?.map((dre, key) => {
                            return (
                              <div key={key} className="elementos">
                                {DREs.find((dre_) => dre_.uuid === dre)?.nome};{" "}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="iteracao-elementos">
                        <span>Empresa: </span>
                        <div className="iteracao-elementos">
                          {
                            empresas.find(
                              (empresa) =>
                                empresa.uuid === contrato.terceirizada
                            )?.nome_fantasia
                          }
                        </div>
                      </div>
                    </div>
                  </section>
                  <hr />
                </Fragment>
              );
            })}
          </article>
        </section>
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
          disabled={submitting}
          onClick={() => {
            onSubmit(values);
          }}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
        />
      </Modal.Footer>
    </Modal>
  );
};
