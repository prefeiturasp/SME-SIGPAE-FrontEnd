import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import ModalSolicitacaoDownload from "src/components/Shareable/ModalSolicitacaoDownload";
import useView from "./view";
export default ({ params, className }) => {
  const view = useView({ params });
  return _jsxs("div", {
    className: className,
    children: [
      _jsx(Botao, {
        texto: "Exportar em XLSX",
        style: BUTTON_STYLE.GREEN_OUTLINE,
        icon: BUTTON_ICON.FILE_EXCEL,
        type: BUTTON_TYPE.BUTTON,
        disabled: view.exportando,
        onClick: view.exportarXLSX,
      }),
      _jsx(Botao, {
        className: "ms-3",
        texto: "Exportar em PDF",
        style: BUTTON_STYLE.GREEN_OUTLINE,
        icon: BUTTON_ICON.FILE_PDF,
        type: BUTTON_TYPE.BUTTON,
        disabled: view.exportando,
        onClick: view.exportarPDF,
      }),
      view.exibirModalCentralDownloads &&
        _jsx(ModalSolicitacaoDownload, {
          show: view.exibirModalCentralDownloads,
          setShow: view.setExibirModalCentralDownloads,
        }),
    ],
  });
};
