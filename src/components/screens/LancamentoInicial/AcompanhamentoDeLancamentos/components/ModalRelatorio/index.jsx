import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Radio } from "antd";

import { getGrupoUnidadeEscolar } from "services/escola.service";
import HTTP_STATUS from "http-status-codes";

import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "../../../../../Shareable/Botao/constants";
import Botao from "../../../../../Shareable/Botao";
import "./styles.scss";
import { toastError } from "../../../../../Shareable/Toast/dialogs";

const ModalRelatorio = ({ show, onClose, onSubmit, nomeRelatorio }) => {
  const [gruposUnidadeEscolar, setGruposUnidadeEscolar] = useState([]);
  const [grupoSelecionado, setGrupoSelecionado] = useState(null);

  function handleCloseModal() {
    setGrupoSelecionado(null);
    onClose();
  }

  function desabilitaRadioButton(grupo) {
    const gruposDesabilitados = ["Grupo 1", "Grupo 2", "Grupo 5"];

    return gruposDesabilitados.includes(grupo);
  }

  const getGruposUnidades = async () => {
    const response = await getGrupoUnidadeEscolar();
    if (response.status === HTTP_STATUS.OK) {
      setGruposUnidadeEscolar(response.data.results);
    } else {
      handleCloseModal();
      toastError(
        "Erro ao buscar grupos de unidade escolar. Tente novamente mais tarde."
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
