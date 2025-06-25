import { EscolaSimplesInterface } from "src/interfaces/escola.interface";
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

type StateEscolaSimplesType = {
  escolaSimples: EscolaSimplesInterface;
  setEscolaSimples: Dispatch<SetStateAction<EscolaSimplesInterface>>;
};

export const EscolaSimplesContext = createContext<StateEscolaSimplesType>({
  escolaSimples: undefined,
  setEscolaSimples: () => {},
});

type ContextProviderType = {
  children?: ReactNode;
};

export const EscolaSimplesContextProvider = ({
  children,
}: ContextProviderType) => {
  const [escolaSimples, setEscolaSimples] = useState<EscolaSimplesInterface>();
  return (
    <EscolaSimplesContext.Provider value={{ escolaSimples, setEscolaSimples }}>
      {children}
    </EscolaSimplesContext.Provider>
  );
};
