import React, { useState, createContext } from "react";
import { getQtdNaoVistos } from "../../services/downloads.service";

export const CentralDeDownloadContext = createContext({
  qtdeDownloadsNaoLidas: "",
  setQtdeDownloadsNaoLidas() {},

  getQtdeDownloadsNaoLidas() {},
});

export const CentralDeDownloadContextProvider = ({ children }) => {
  const [qtdeDownloadsNaoLidas, setQtdeDownloadsNaoLidas] = useState(0);

  const getQtdeDownloadsNaoLidas = async () => {
    let qtde = await getQtdNaoVistos();
    setQtdeDownloadsNaoLidas(qtde.quantidade_nao_vistos);
    return qtde.quantidade_nao_vistos;
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
