import React from "react";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import { Spin } from "antd";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import { Field } from "react-final-form";
import { textAreaRequired } from "src/helpers/fieldValidators";

interface Props {
  show: boolean;
  handleClose(): void;
  loading: boolean;
  handleSim(): void;
  errors: Record<string, any>;
}

const ModalCorrecao: React.FC<Props> = ({
  show,
  handleClose,
  loading,
  handleSim,
  errors,
}) => {
  return (
    <Modal show={show} onHide={handleClose} backdrop={"static"}>
      <Spin tip="Carregando..." spinning={loading}>
        <Modal.Header closeButton>
          <Modal.Title>
            {" "}
            <strong>Solicitar Correção ao Fornecedor</strong>{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Field
            component={TextArea}
            label="Correções Necessárias"
            name={`correcao_solicitada`}
            placeholder="Informe aqui as correções necessárias"
            required
            validate={textAreaRequired}
          />
        </Modal.Body>
        <Modal.Footer>
          <Botao
            texto="Cancelar"
            type={BUTTON_TYPE.BUTTON}
            onClick={() => handleClose()}
            style={BUTTON_STYLE.GREEN_OUTLINE}
            className="ms-3"
          />
          <Botao
            texto="Enviar"
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN}
            className="ms-3"
            onClick={() => handleSim()}
            disabled={Object.keys(errors).length > 0}
          />
        </Modal.Footer>
      </Spin>
    </Modal>
  );
};

export default ModalCorrecao;
