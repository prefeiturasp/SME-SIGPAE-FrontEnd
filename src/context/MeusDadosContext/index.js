import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState } from "react";
export const MeusDadosContext = createContext({
  meusDados: undefined,
  setMeusDados: () => {},
});
export const MeusDadosContextProvider = ({ children }) => {
  const [meusDados, setMeusDados] = useState();
  return _jsx(MeusDadosContext.Provider, {
    value: { meusDados, setMeusDados },
    children: children,
  });
};
