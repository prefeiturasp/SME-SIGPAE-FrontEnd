import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useEffect, useState } from "react";
export const temas = {
  dark: "dark-content",
  light: "light-content",
};
export const TemaContext = createContext({
  tema: temas.dark,
  mudarTema: () => {},
});
export const TemaContextProvider = ({ children }) => {
  const [tema, setTema] = useState(temas.light);
  function mudarTema() {
    setTema(tema === temas.dark ? temas.light : temas.dark);
  }
  useEffect(() => {
    switch (tema) {
      case temas.light:
        document.body.classList.remove("dark-content");
        document.body.classList.add("light-content");
        break;
      case temas.dark:
        document.body.classList.remove("light-content");
        document.body.classList.add("dark-content");
        break;
      default:
        break;
    }
  }, [tema]);
  return _jsx(TemaContext.Provider, {
    value: { tema, mudarTema },
    children: children,
  });
};
