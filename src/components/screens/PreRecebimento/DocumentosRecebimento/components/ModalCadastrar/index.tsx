import React from "react";
import { Spin } from "antd";
import { Modal } from "react-bootstrap";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "components/Shareable/Botao/constants";

interface Props {
  show: boolean;
  handleClose(): void;
  loading: boolean;
  handleSim(): void;
}

const ModalCadastrar: React.FC<Props> = ({
  show,
  handleClose,
  loading,
  handleSim,
}) => {
  return (
    <Modal show={show} onHide={handleClose} backdrop={"static"}>
      <Spin tip="Carregando..." spinning={loading}>
        <Modal.Header closeButton>
          <Modal.Title>
            {" "}
            <strong>Salvar e Enviar Documentos</strong>{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Deseja enviar os documentos recebidos para{" "}
            <strong>Análise da CODAE?</strong>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Botao
            texto="Não"
            type={BUTTON_TYPE.BUTTON}
            onClick={() => handleClose()}
            style={BUTTON_STYLE.GREEN_OUTLINE}
            className="ml-3"
          />
          <Botao
            texto="Sim"
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN}
            className="ml-3"
            onClick={() => handleSim()}
          />
        </Modal.Footer>
      </Spin>
    </Modal>
  );
};

export default ModalCadastrar;
