import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState } from "react";
export const EscolaSimplesContext = createContext({
  escolaSimples: undefined,
  setEscolaSimples: () => {},
});
export const EscolaSimplesContextProvider = ({ children }) => {
  const [escolaSimples, setEscolaSimples] = useState();
  return _jsx(EscolaSimplesContext.Provider, {
    value: { escolaSimples, setEscolaSimples },
    children: children,
  });
};
