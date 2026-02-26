import "./style.scss";
import React from "react";
import { Modal } from "react-bootstrap";
import { Radio } from "antd";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { useSearchParams } from "react-router-dom";

type OpcaoConflito = "manter" | "encerrar_copiar" | "encerrar_novo" | null;

type Props = {
  conflito?: string;
  setConflito: (_e: string | null) => void;
  onContinuar?: (_opcao: OpcaoConflito) => void;
};

const ModalConflito = ({ conflito, setConflito, onContinuar }: Props) => {
  const [opcaoSelecionada, setOpcaoSelecionada] =
    React.useState<OpcaoConflito>(null);
  const [searchParams] = useSearchParams();

  const handleContinuar = () => {
    onContinuar?.(opcaoSelecionada);
    setConflito(null);
  };

  return (
    <Modal
      show={!!conflito}
      onHide={() => {
        setConflito(null);
        setOpcaoSelecionada(null);
      }}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Conflito no período de Vigência</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          Já existe uma parametrização vigente para este{" "}
          <strong>Edital, DRE e Grupo de Unidades</strong>, para continuar com o
          cadastro escolha uma das opções a seguir:
        </p>

        <Radio.Group
          className="d-flex flex-column gap-2 mt-3"
          value={opcaoSelecionada}
          onChange={(e) => setOpcaoSelecionada(e.target.value)}
        >
          <Radio value="manter">Manter parametrização anterior vigente.</Radio>

          {!searchParams.get("uuid_origem") && (
            <Radio value="encerrar_copiar">
              Encerrar parametrização anterior e copiar valores para a nova.
            </Radio>
          )}

          <Radio value="encerrar_novo">
            Encerrar parametrização anterior e cadastrar novos valores.
          </Radio>
        </Radio.Group>
      </Modal.Body>

      <Modal.Footer>
        <Botao
          texto="Continuar"
          type={BUTTON_TYPE.BUTTON}
          onClick={handleContinuar}
          style={BUTTON_STYLE.GREEN}
          disabled={!opcaoSelecionada}
        />
      </Modal.Footer>
    </Modal>
  );
};

export default ModalConflito;
