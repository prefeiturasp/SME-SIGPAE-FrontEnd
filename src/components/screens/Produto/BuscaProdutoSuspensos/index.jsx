import HTTP_STATUS from "http-status-codes";
import "./styles.scss";
import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import { getNomesUnicosEditais } from "src/services/produto.service";
import { getProdutosRelatorioSuspenso } from "src/services/produto.service";
import FormBuscaProduto from "./components/FormBuscaProduto";
import ContadorResultado from "./components/ContadorResultado";
import TabelaResultado from "./components/TabelaResultado";
import {
  STATUS_CODAE_SUSPENDEU,
  STATUS_CODAE_AUTORIZOU_RECLAMACAO,
} from "src/configs/constants";
import "./styles.scss";
import { getMeusDados } from "src/services/perfil.service";

const BuscaProdutoSuspensos = () => {
  const [produtos, setProdutos] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [filtros, setFiltros] = useState(null);
  const [produtosCount, setProdutosCount] = useState(0);
  const [totalSuspensos, setTotalSuspensos] = useState(0);
  const [page, setPage] = useState(1);
  const [meusDados, setMeusDados] = useState(undefined);
  const [bloquearEdital, setBloquearEdital] = useState(false);
  const [initialStateForm, setInitialStateForm] = useState({});
  const PAGE_SIZE = 10;

  useEffect(() => {
    async function getDadosUsuario() {
      setCarregando(true);
      const response = await getMeusDados();
      if (response.status === HTTP_STATUS.OK) {
        let params = {};
        if (response.data.tipo_usuario === "escola") {
          let responseEditais = await getNomesUnicosEditais();
          params = { nome_edital: responseEditais.data.results[0] };
          setInitialStateForm(params);
          setBloquearEdital(true);
        } else {
          params = {};
          setInitialStateForm(params);
          setBloquearEdital(false);
        }
        setMeusDados(response.data);
        const paramsConsultaTotal = gerarParametrosConsulta({
          status: [STATUS_CODAE_SUSPENDEU, STATUS_CODAE_AUTORIZOU_RECLAMACAO],
          page: page,
          page_size: PAGE_SIZE,
        });
        const responseTotalSuspensos = await getProdutosRelatorioSuspenso(
          paramsConsultaTotal
        );
        setTotalSuspensos(responseTotalSuspensos.data.count);
      }
      setCarregando(false);
    }

    async function fetchData() {
      setCarregando(true);
      setProdutos(null);
      const params = gerarParametrosConsulta({
        ...filtros,
        page: page,
        page_size: PAGE_SIZE,
      });
      const response = await getProdutosRelatorioSuspenso(params);
      setProdutos(response.data.results);
      setProdutosCount(response.data.count);
      setTotalSuspensos(response.data.count);
      setCarregando(false);
    }

    if (!meusDados) getDadosUsuario();
    if (filtros) fetchData();
  }, [filtros, meusDados]);

  const onSubmitForm = (formValues) => {
    setPage(1);
    setFiltros({
      ...formValues,
      status: [STATUS_CODAE_SUSPENDEU, STATUS_CODAE_AUTORIZOU_RECLAMACAO],
    });
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 margem-da-pagina">
        <div className="card-body ">
          <FormBuscaProduto
            onSubmit={onSubmitForm}
            bloquearEdital={bloquearEdital}
            initialStateForm={initialStateForm}
          />
        </div>
        {produtos && !produtos.length && (
          <div className="text-center mt-5 mb-5">
            Não existem dados para filtragem informada
          </div>
        )}
        {produtos && produtos.length !== 0 && (
          <>
            <ContadorResultado
              filtros={filtros}
              produtosCount={produtosCount}
              totalSuspensos={totalSuspensos}
            />
            <TabelaResultado
              filtros={filtros}
              produtosCount={produtosCount}
              produtos={produtos}
              pageSize={PAGE_SIZE}
              setProdutos={setProdutos}
              setPage={setPage}
              page={page}
              bloquearEdital={bloquearEdital}
            />
          </>
        )}
      </div>
    </Spin>
  );
};

export default BuscaProdutoSuspensos;
