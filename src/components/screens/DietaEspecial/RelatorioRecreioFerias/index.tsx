import { useEffect, useState } from "react";
import { Tabela } from "./components/Tabela";
import { IRelatorioDietaRecreioFerias } from "./interfaces";
import HTTP_STATUS from "http-status-codes";
import { getRelatorioRecreioFerias } from "src/services/dietaEspecial.service";

export const RelatorioRecreioFerias = () => {
  const [dietas, setDietas] = useState<IRelatorioDietaRecreioFerias[]>();
  const [erro, setErro] = useState<string>("");
  const [total, setTotal] = useState(0);

  const getRelatorioRecreioFeriasAsync = async () => {
    const response = await getRelatorioRecreioFerias();
    if (response.status === HTTP_STATUS.OK) {
      setDietas(
        response.data.results.map((obj) => ({
          ...obj,
          collapsed: false,
        }))
      );
      setTotal(response.data.count);
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
            <Tabela dietas={dietas} setDietas={setDietas} total={total} />
          </div>
        </div>
      )}
    </div>
  );
};
