import { useEffect, useState } from "react";
import { Tabela } from "./components/Tabela";
import { IRelatorioDietaRecreioFerias } from "./interfaces";
import { mockDietas } from "./mock";
import HTTP_STATUS from "http-status-codes";

export const RelatorioRecreioFerias = () => {
  const [dietas, setDietas] = useState<IRelatorioDietaRecreioFerias[]>();
  const [erro, setErro] = useState<string>("");

  const getRelatorioRecreioFerias = async () => {
    return mockDietas;
  };

  const getRelatorioRecreioFeriasAsync = async () => {
    const response = await getRelatorioRecreioFerias();
    if (response.status === HTTP_STATUS.OK) {
      setDietas(
        response.data.map((obj) => ({
          ...obj,
          collapsed: false,
        }))
      );
    } else {
      setErro(
        "Erro ao carregar relatório de dietas recreio nas férias. Tente novamente mais tarde."
      );
    }
  };

  useEffect(() => {
    getRelatorioRecreioFeriasAsync();
  }, []);

  return (
    <div className="relatorio-recreio-nas-ferias">
      {erro && <div>{erro}</div>}
      {!erro && (
        <div className="card">
          <div className="card-body">
            <Tabela dietas={dietas} setDietas={setDietas} />
          </div>
        </div>
      )}
    </div>
  );
};
