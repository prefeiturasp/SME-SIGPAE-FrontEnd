import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "./style.scss";

const ModalCestasBasicas = () => {
  const [showModal, setShowModal] = useState(
    localStorage.getItem("modalCestas") !== "false"
  );

  const closeModal = () => {
    setShowModal(false);
    localStorage.setItem("modalCestas", false);
  };

  return (
    <Modal dialogClassName="modal-cestas" show={showModal} onHide={closeModal}>
      <>
        <Modal.Header closeButton>
          <Modal.Title>
            <strong>AVISO | Cesta Básica</strong>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row py-2">
            <div className="col-2">
              <div className="text-center">
                <img src="/assets/image/alimentos.svg" alt="Alimentos" />
              </div>
            </div>
            <div className="col-10">
              No dia <span className="green fw-bold">10/06/2024 </span>
              iniciaremos a entrega de{" "}
              <span className="fw-bold">cestas básicas </span>
              nas Unidades Escolares destinadas aos estudantes da
              <span className="fw-bold">
                {" "}
                Rede Municipal de Ensino de São Paulo.{" "}
              </span>
            </div>
          </div>

          <div className="row gray-bg py-2">
            <div className="col-12 ">
              O <span className="fw-bold">Cronograma de Entrega </span>e a{" "}
              <span className="fw-bold">lista dos alunos </span>
              que receberão as cestas serão divulgados pela sua{" "}
              <span className="fw-bold">DRE</span>. Ao receber as cestas, a
              escola deve fazer a conferência da{" "}
              <span className="green fw-bold">Guia de Remessa!</span>
            </div>
          </div>

          <div className="row py-2">
            <div className="col-12">
              <span className="fw-bold">Você receberá um e-mail </span>
              com as datas de entrega e orientações para o recebimento,
              armazenamento e distribuição das cestas para os estudantes.
            </div>
          </div>

          <div className="row gray-bg py-2">
            <div className="col-12">
              Em caso de dúvidas, entre em contato com a{" "}
              <span className="fw-bold">DIAF - DRE </span>
              ou envie e-mail para:{" "}
              <span className="fw-bold">
                smecodaecesta@sme.prefeitura.sp.gov.br
              </span>
            </div>
          </div>
        </Modal.Body>
      </>
    </Modal>
  );
};

export default ModalCestasBasicas;
