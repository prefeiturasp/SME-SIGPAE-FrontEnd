import { Modal } from "react-bootstrap";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import "./styles.scss";

type Props = {
  show: boolean;
  onClose: () => void;
  numeroEmpenho: string;
  tipoEmpenho: string;
  totalUes: number;
  unidades: any[];
};

const UnidadesPagamento = ({
  show,
  onClose,
  numeroEmpenho,
  tipoEmpenho,
  totalUes,
  unidades,
}: Props) => {
  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Unidades para Pagamento</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="unidades-pagamento">
          <div className="cabecalho-informacoes">
            <div className="col">
              <span className="col-titulo">Nº do Empenho:</span> {numeroEmpenho}
            </div>
            <div className="col">
              <span className="col-titulo">Tipo do Empenho:</span> {tipoEmpenho}
            </div>
            <div className="col">
              <span className="col-titulo">Total de UEs:</span> {totalUes}
            </div>
          </div>

          <div className="lista-unidades">
            {unidades.map((unidade, index) => (
              <div key={index} className="item">
                {unidade.nome}
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Botao
          texto="Fechar"
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          onClick={onClose}
        />
      </Modal.Footer>
    </Modal>
  );
};

export default UnidadesPagamento;
