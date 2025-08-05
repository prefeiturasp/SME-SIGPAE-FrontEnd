import HTTP_STATUS from "http-status-codes";
import { useContext, useState } from "react";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { getProdutosReclamacoes } from "src/services/produto.service";
import { Filtros } from "./components/Filtros";
import { getTodosStatusReclamacao } from "./components/Filtros/helpers";
import { Tabela } from "./components/Tabela";
import { IFormValues } from "./interfaces";

export const RelatorioReclamacaoProduto = () => {
  const { meusDados } = useContext(MeusDadosContext);

  const [erroAPI, setErroAPI] = useState("");
  const [produtos, setProdutos] = useState();
  const [, setProdutosCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingTabela, setLoadingTabela] = useState(false);

  const PAGE_SIZE = 10;

  const consultarProdutos = async (values: IFormValues) => {
    setLoadingTabela(true);
    const formValues = { ...values };
    if (!values.status_reclamacao || values.status_reclamacao.length === 0) {
      formValues.status_reclamacao = getTodosStatusReclamacao();
    }
    const params = {
      ...formValues,
      page: page,
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
        <div className="card">
          <div className="card-body">
            <Filtros
              setErroAPI={setErroAPI}
              meusDados={meusDados}
              consultarProdutos={consultarProdutos}
            />
            <Tabela
              produtos={produtos}
              setProdutos={setProdutos}
              loadingTabela={loadingTabela}
            />
          </div>
        </div>
      )}
    </div>
  );
};
