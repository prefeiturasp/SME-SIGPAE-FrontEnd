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
  handleReprovar(): void;
  errors: Record<string, any>;
}

const ModalJustificativaReprovacao: React.FC<Props> = ({
  show,
  handleClose,
  loading,
  handleReprovar,
  errors,
}) => {
  return (
    <Modal show={show} onHide={handleClose} backdrop={"static"}>
      <Spin tip="Carregando..." spinning={loading}>
        <Modal.Header closeButton>
          <Modal.Title>
            {" "}
            <strong>Justificativa da Reprovação</strong>{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Field
            component={TextArea}
            label="Justificativa da Reprovação"
            name="justificativa_reprovacao"
            placeholder="Informe aqui a justificativa da reprovação"
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
            texto="Reprovar"
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.RED_OUTLINE}
            className="ms-3"
            onClick={() => handleReprovar()}
            disabled={!!errors?.justificativa_reprovacao}
          />
        </Modal.Footer>
      </Spin>
    </Modal>
  );
};

export default ModalJustificativaReprovacao;
