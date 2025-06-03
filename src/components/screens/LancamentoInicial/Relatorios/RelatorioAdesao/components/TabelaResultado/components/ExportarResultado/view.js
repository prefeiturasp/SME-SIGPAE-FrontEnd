import { useState } from "react";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import RelatorioService from "src/services/medicaoInicial/relatorio.service";
export default ({ params }) => {
  const [exportando, setExportando] = useState(false);
  const [exibirModalCentralDownloads, setExibirModalCentralDownloads] =
    useState(false);
  const exportarXLSX = async () => {
    setExportando(true);
    try {
      await RelatorioService.exportarRelatorioAdesaoParaXLSX({
        mes_ano: params.mes,
        diretoria_regional: params.dre,
        lotes: params.lotes,
        escola: params.unidade_educacional,
        periodos_escolares: params.periodos,
        tipos_alimentacao: params.tipos_alimentacao,
      });
      setExibirModalCentralDownloads(true);
    } catch (e) {
      toastError("Erro ao exportar xlsx. Tente novamente mais tarde.");
    }
    setExportando(false);
  };
  const exportarPDF = async () => {
    setExportando(true);
    try {
      await RelatorioService.exportarRelatorioAdesaoParaPDF({
        mes_ano: params.mes,
        diretoria_regional: params.dre,
        lotes: params.lotes,
        escola: params.unidade_educacional,
        periodos_escolares: params.periodos,
        tipos_alimentacao: params.tipos_alimentacao,
      });
      setExibirModalCentralDownloads(true);
    } catch (e) {
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
