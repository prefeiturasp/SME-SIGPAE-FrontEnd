import { useContext, useState } from "react";
import { Filtros } from "./components/Filtros";
import { MeusDadosContext } from "src/context/MeusDadosContext";

export const RelatorioReclamacaoProduto = () => {
  const { meusDados } = useContext(MeusDadosContext);

  const [erroAPI, setErroAPI] = useState("");

  return (
    <div>
      {erroAPI && <div>{erroAPI}</div>}
      {!erroAPI && (
        <>
          <Filtros setErroAPI={setErroAPI} meusDados={meusDados} />
        </>
      )}
    </div>
  );
};
