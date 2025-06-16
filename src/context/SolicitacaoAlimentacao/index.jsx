import React, { useState, createContext } from "react";

export const SolicitacaoAlimentacaoContext = createContext({
  solicitacaoAlimentacao: "",
  setSolicitacaoAlimentacao() {},
  updateSolicitacaoAlimentacao() {},
});

export const SolicitacaoAlimentacaoContextProvider = ({ children }) => {
  const [solicitacaoAlimentacao, setSolicitacaoAlimentacao] = useState(null);

  const updateSolicitacaoAlimentacao = (solicitacao) => {
    setSolicitacaoAlimentacao(solicitacao);
    return solicitacao;
  };

  return (
    <SolicitacaoAlimentacaoContext.Provider
      value={{
        solicitacaoAlimentacao,
        setSolicitacaoAlimentacao,
        updateSolicitacaoAlimentacao,
      }}
    >
      {children}
    </SolicitacaoAlimentacaoContext.Provider>
  );
};
