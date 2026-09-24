import HTTP_STATUS from "http-status-codes";
import { useState } from "react";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import RelatorioService from "src/services/medicaoInicial/relatorio.service";
import { montaParamsRelatorioAdesao } from "../../../../helpers";
import { IFiltros } from "../../../../types";

type Args = {
  params: IFiltros;
};

export default ({ params }: Args) => {
  const [exportando, setExportando] = useState(false);
  const [exibirModalCentralDownloads, setExibirModalCentralDownloads] =
    useState(false);

  const exportarXLSX = async () => {
    setExportando(true);
    const response = await RelatorioService.exportarRelatorioAdesaoParaXLSX(
      montaParamsRelatorioAdesao(params),
    );
    if (response.status === HTTP_STATUS.OK) {
      setExibirModalCentralDownloads(true);
    } else {
      toastError("Erro ao exportar xlsx. Tente novamente mais tarde.");
    }
    setExportando(false);
  };

  const exportarPDF = async () => {
    setExportando(true);
    const response = await RelatorioService.exportarRelatorioAdesaoParaPDF(
      montaParamsRelatorioAdesao(params),
    );
    if (response.status === HTTP_STATUS.OK) {
      setExibirModalCentralDownloads(true);
    } else {
      toastError("Erro ao exportar pdf. Tente novamente mais tarde.");
    }
    setExportando(false);
  };

  return {
    exportando,
    exibirModalCentralDownloads,
    setExibirModalCentralDownloads,
    exportarXLSX,
    exportarPDF,
  };
};
