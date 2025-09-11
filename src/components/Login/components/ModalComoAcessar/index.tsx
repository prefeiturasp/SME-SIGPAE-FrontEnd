import { Modal } from "react-bootstrap";
import "./style.scss";

type ModalComoAcessarProps = {
  showModal: boolean;
  closeModal: () => void;
};

export const ModalComoAcessar = ({ ...props }: ModalComoAcessarProps) => {
  const { showModal, closeModal } = props;

  return (
    <Modal
      show={showModal}
      onHide={closeModal}
      dialogClassName="modal-como-acessar"
    >
      <Modal.Header closeButton>
        <Modal.Title>Como acessar o SIGPAE</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-4">
            <div className="flex-card">
              <div className="titulo">Servidor Municipal</div>
              <div className="icone">
                <i className="fas fa-chalkboard-teacher" />
              </div>
              <div className="texto">
                Acesse com seu <strong>RF</strong> de 7 dígitos
              </div>
              <div className="rodape">
                A <strong>senha</strong> é a mesma de acesso ao Plateia e ao SGP
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="flex-card">
              <div className="titulo">Fornecedor ou Distribuidor</div>
              <div className="icone">
                <i className="fas fa-truck" />
              </div>
              <div className="texto">
                Acesse com seu <strong>CPF</strong> de 11 dígitos
              </div>
              <div className="rodape">
                A <strong>senha</strong> é a cadastrada no primeiro acesso
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="flex-card">
              <div className="titulo">Rede Parceira</div>
              <div className="icone">
                <i className="fas fa-hotel" />
              </div>
              <div className="texto">
                Acesse com seu <strong>CPF</strong> de 11 dígitos
              </div>
              <div className="rodape">
                A <strong>senha</strong> é a cadastrada no primeiro acesso
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
