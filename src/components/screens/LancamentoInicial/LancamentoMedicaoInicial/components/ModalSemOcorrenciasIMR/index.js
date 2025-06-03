import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Modal } from "react-bootstrap";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import { formataMesNome } from "src/helpers/utilities";
export const ModalSemOcorrenciasIMR = ({ ...props }) => {
  const { show, handleClose, mes, ano, handleFinalizarMedicao } = props;
  return _jsxs(Modal, {
    show: show,
    onHide: handleClose,
    dialogClassName: "modal-cancelar-analise-layout",
    children: [
      _jsx(Modal.Header, {
        closeButton: true,
        children: _jsx(Modal.Title, {
          children: "Finalizar Lan\u00E7amentos da Medi\u00E7\u00E3o Inicial",
        }),
      }),
      _jsxs(Modal.Body, {
        children: [
          _jsxs("b", {
            children: [
              "Voc\u00EA confirma a presta\u00E7\u00E3o de servi\u00E7os da empresa sem ocorr\u00EAncias no m\u00EAs de ",
              formataMesNome(mes),
              "/",
              ano,
              "?",
            ],
          }),
          _jsx("p", {
            children:
              "Ap\u00F3s a finaliza\u00E7\u00E3o da medi\u00E7\u00E3o os dados ser\u00E3o enviados para an\u00E1lise de DRE e CODAE.",
          }),
        ],
      }),
      _jsxs(Modal.Footer, {
        children: [
          _jsx(Botao, {
            texto: "N\u00E3o",
            type: BUTTON_TYPE.BUTTON,
            onClick: () => {
              handleClose();
            },
            style: BUTTON_STYLE.GREEN_OUTLINE,
            className: "ms-3",
          }),
          _jsx(Botao, {
            texto: "Sim",
            type: BUTTON_TYPE.BUTTON,
            onClick: async () => {
              handleClose();
              handleFinalizarMedicao();
            },
            style: BUTTON_STYLE.GREEN,
            className: "ms-3",
          }),
        ],
      }),
    ],
  });
};
