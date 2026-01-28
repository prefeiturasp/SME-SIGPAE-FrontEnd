import React, { useState, createContext } from "react";
import { getQtdNaoVistos } from "../../services/downloads.service";

export const CentralDeDownloadContext = createContext({
  qtdeDownloadsNaoLidas: 0,
  setQtdeDownloadsNaoLidas: () => {},
  getQtdeDownloadsNaoLidas: () => 0,
});

export const CentralDeDownloadContextProvider = ({ children }) => {
  const [qtdeDownloadsNaoLidas, setQtdeDownloadsNaoLidas] = useState(0);

  const getQtdeDownloadsNaoLidas = async () => {
    const qtde = await getQtdNaoVistos();
    const quantidade = qtde?.quantidade_nao_vistos ?? 0;

    setQtdeDownloadsNaoLidas(quantidade);
    return quantidade;
  };

  return (
    <CentralDeDownloadContext.Provider
      value={{
        qtdeDownloadsNaoLidas,
        setQtdeDownloadsNaoLidas,
        getQtdeDownloadsNaoLidas,
      }}
    >
      {children}
    </CentralDeDownloadContext.Provider>
  );
};
