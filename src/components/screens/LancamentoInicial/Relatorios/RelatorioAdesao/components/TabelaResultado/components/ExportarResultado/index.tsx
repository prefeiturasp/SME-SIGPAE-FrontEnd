import React from "react";

import Botao from "components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import ModalSolicitacaoDownload from "components/Shareable/ModalSolicitacaoDownload";

import useView from "./view";

type Props = {
  className: string;
};

export default ({ className }: Props) => {
  const view = useView();

  return (
    <div className={className}>
      <Botao
        texto="Exportar em XLSX"
        style={BUTTON_STYLE.GREEN_OUTLINE}
        icon={BUTTON_ICON.FILE_EXCEL}
        type={BUTTON_TYPE.BUTTON}
        disabled={view.exportando}
        onClick={view.exportarXLSX}
      />
      <Botao
        className="ms-3"
        texto="Exportar em PDF"
        style={BUTTON_STYLE.GREEN_OUTLINE}
        icon={BUTTON_ICON.FILE_PDF}
        type={BUTTON_TYPE.BUTTON}
        disabled={view.exportando}
        onClick={view.exportarPDF}
      />
      {view.exibirModalCentralDownloads && (
        <ModalSolicitacaoDownload
          show={view.exibirModalCentralDownloads}
          setShow={view.setExibirModalCentralDownloads}
        />
      )}
    </div>
  );
};
