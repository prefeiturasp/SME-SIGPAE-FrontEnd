import { useState } from "react";
import { Filtros } from "./components/Filtros";

export const RelatorioReclamacaoProduto = () => {
  const [erroAPI, setErroAPI] = useState("");

  return (
    <div>
      {erroAPI && <div>{erroAPI}</div>}
      {!erroAPI && (
        <>
          <Filtros setErroAPI={setErroAPI} />
        </>
      )}
    </div>
  );
};
