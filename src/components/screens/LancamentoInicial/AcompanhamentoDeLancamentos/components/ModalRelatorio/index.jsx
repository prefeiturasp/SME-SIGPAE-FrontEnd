import { Radio } from "antd";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import HTTP_STATUS from "http-status-codes";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { getGrupoUnidadeEscolar } from "src/services/escola.service";
import "./styles.scss";

const ModalRelatorio = ({ show, onClose, onSubmit, nomeRelatorio }) => {
  const [gruposUnidadeEscolar, setGruposUnidadeEscolar] = useState([]);
  const [grupoSelecionado, setGrupoSelecionado] = useState(null);

  function handleCloseModal() {
    setGrupoSelecionado(null);
    onClose();
  }

  function desabilitaRadioButton(grupo) {
    const gruposDesabilitados = [];

    if (nomeRelatorio === "Relatório Unificado") {
      gruposDesabilitados.push("Grupo 1");
      gruposDesabilitados.push("Grupo 2");
      gruposDesabilitados.push("Grupo 5");
      gruposDesabilitados.push("Grupo 6");
    }

    return gruposDesabilitados.includes(grupo);
  }

  const getGruposUnidades = async () => {
    const response = await getGrupoUnidadeEscolar();
    if (response.status === HTTP_STATUS.OK) {
      setGruposUnidadeEscolar(response.data.results);
    } else {
      handleCloseModal();
      toastError(
        "Erro ao buscar grupos de unidade escolar. Tente novamente mais tarde.",
      );
    }
  };

  useEffect(() => {
    getGruposUnidades();
  }, []);

  return (
    <Modal
      show={show}
      onHide={handleCloseModal}
      dialogClassName="modal-relatorio-unificado"
    >
      <Modal.Header closeButton>
        <Modal.Title>Impressão de {nomeRelatorio}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>Selecione o grupo de Unidade para impressão do {nomeRelatorio}:</p>

        <Radio.Group
          value={grupoSelecionado}
          onChange={(event) => setGrupoSelecionado(event.target.value)}
          className="d-flex flex-column"
        >
          {gruposUnidadeEscolar.map((grupo, key) => {
            const label = `${grupo.nome} (${grupo.tipos_unidades
              ?.map((unidade) => unidade.iniciais)
              .join(", ")})`;

            return (
              <Radio
                value={grupo.uuid}
                key={key}
                disabled={desabilitaRadioButton(grupo.nome)}
              >
                {label}
              </Radio>
            );
          })}
        </Radio.Group>
      </Modal.Body>

      <Modal.Footer>
        <Botao
          texto="Cancelar"
          type={BUTTON_TYPE.BUTTON}
          onClick={handleCloseModal}
          style={BUTTON_STYLE.GREEN_OUTLINE}
        />

        <Botao
          texto="Gerar Relatório"
          type={BUTTON_TYPE.BUTTON}
          onClick={() => {
            handleCloseModal();
            onSubmit({
              grupoSelecionado,
            });
          }}
          style={BUTTON_STYLE.GREEN}
          disabled={!grupoSelecionado}
        />
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRelatorio;
