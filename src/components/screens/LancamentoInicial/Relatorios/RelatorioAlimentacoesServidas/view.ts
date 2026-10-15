import HTTP_STATUS from "http-status-codes";
import { useRef, useState } from "react";

import { toastError } from "src/components/Shareable/Toast/dialogs";
import { getError } from "src/helpers/utilities";
import RelatorioService from "src/services/medicaoInicial/relatorio.service";

import { montaParamsExportacao } from "./helpers";
import { IFiltros } from "./types";

const MENSAGEM_ERRO_EXPORTACAO =
  "Erro ao exportar o relatório. Tente novamente mais tarde.";

export default () => {
  const exportandoRef = useRef(false);
  const [exportando, setExportando] = useState(false);
  const [exibirModalCentralDownloads, setExibirModalCentralDownloads] =
    useState(false);

  const exportar = async (values: IFiltros) => {
    if (exportandoRef.current || !values.meses?.length || !values.dres?.length)
      return;

    exportandoRef.current = true;
    setExportando(true);

    const response =
      await RelatorioService.exportarRelatorioAlimentacoesServidasParaXLSX(
        montaParamsExportacao(values),
      );

    if (response?.status === HTTP_STATUS.OK) {
      setExibirModalCentralDownloads(true);
    } else {
      const mensagemValidacao =
        response?.status === HTTP_STATUS.BAD_REQUEST
          ? getError(response.data)
          : null;
      toastError(
        mensagemValidacao && mensagemValidacao !== "Erro"
          ? mensagemValidacao
          : MENSAGEM_ERRO_EXPORTACAO,
      );
    }

    exportandoRef.current = false;
    setExportando(false);
  };

  return {
    exportando,
    exibirModalCentralDownloads,
    setExibirModalCentralDownloads,
    exportar,
  };
};
