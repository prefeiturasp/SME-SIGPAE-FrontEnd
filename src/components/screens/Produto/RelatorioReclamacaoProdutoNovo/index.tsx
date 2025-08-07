import { FormApi } from "final-form";
import HTTP_STATUS from "http-status-codes";
import { useContext, useState } from "react";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { getProdutosReclamacoes } from "src/services/produto.service";
import { Filtros } from "./components/Filtros";
import { formatarValues } from "./components/Filtros/helpers";
import { Tabela } from "./components/Tabela";
import { IFormValues } from "./interfaces";

export const RelatorioReclamacaoProduto = () => {
  const { meusDados } = useContext(MeusDadosContext);

  const [formInstance, setFormInstance] = useState<FormApi>();

  const [erroAPI, setErroAPI] = useState("");
  const [produtos, setProdutos] = useState();
  const [produtosCount, setProdutosCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingTabela, setLoadingTabela] = useState(false);

  const PAGE_SIZE = 10;

  const consultarProdutos = async (values: IFormValues, page: number) => {
    setLoadingTabela(true);
    const formValues = formatarValues(values);
    const params = {
      ...formValues,
      page,
      page_size: PAGE_SIZE,
    };
    const response = await getProdutosReclamacoes(params);
    if (response.status === HTTP_STATUS.OK) {
      setProdutos(response.data.results);
      setProdutosCount(response.data.count);
    } else {
      setErroAPI("Erro ao carregar produtos. Tente novamente mais tarde.");
      setProdutos(undefined);
      setProdutosCount(0);
      setPage(1);
    }
    setLoadingTabela(false);
  };

  return (
    <div>
      {erroAPI && <div>{erroAPI}</div>}
      {!erroAPI && meusDados && (
        <div className="card mt-3">
          <div className="card-body">
            <Filtros
              setErroAPI={setErroAPI}
              meusDados={meusDados}
              consultarProdutos={consultarProdutos}
              formInstance={formInstance}
              setFormInstance={setFormInstance}
            />
            <Tabela
              produtos={produtos}
              setProdutos={setProdutos}
              loadingTabela={loadingTabela}
              produtosCount={produtosCount}
              page={page}
              setPage={setPage}
              consultarProdutos={consultarProdutos}
              values={formInstance?.getState().values as IFormValues}
            />
          </div>
        </div>
      )}
    </div>
  );
};
