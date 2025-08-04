import { Spin } from "antd";
import HTTP_STATUS from "http-status-codes";
import { useEffect, useState } from "react";
import { getNomesUnicosEditais } from "src/services/produto.service";
import { Filtros } from "./components/Filtros";
import { IFiltros } from "./interfaces";

export const RelatorioReclamacaoProduto = () => {
  const [filtros, setFiltros] = useState<IFiltros>();
  const [erroAPI, setErroAPI] = useState("");

  const [loadingFiltros, setLoadingFiltros] = useState<boolean>(false);

  const getEditaisAsync = async () => {
    const response = await getNomesUnicosEditais();
    if (response.status === HTTP_STATUS.OK) {
      setFiltros({
        ...filtros,
        editais: response.data.results.map((element: string) => {
          return { value: element, label: element };
        }),
      });
    } else {
      setErroAPI("Erro ao carregar Editais. Tente novamente mais tarde.");
    }
  };

  useEffect(() => {
    requisicoesPreRender();
  }, []);

  const requisicoesPreRender = async (): Promise<void> => {
    await Promise.all([getEditaisAsync()]).then(() => {
      setLoadingFiltros(false);
    });
  };
  return (
    <div>
      {erroAPI && <div>{erroAPI}</div>}
      {!erroAPI && (
        <>
          <Spin tip="Carregando filtros..." spinning={loadingFiltros}>
            <Filtros filtros={filtros} />
          </Spin>
        </>
      )}
    </div>
  );
};
