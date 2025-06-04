import React, { useEffect, useState, Fragment } from "react";
import { getProduto, getInformacoesGrupo } from "src/services/produto.service";
import ResultadoMock from "./components/resultadoMock";
import CorpoRelatorio from "./components/corpoRelatorio";

import { Spin } from "antd";
import { retornaTodosOsLogs } from "./helpers";

const RelatorioProduto = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const uuid = urlParams.get("uuid");
  const [produto, setProduto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [informacoesNutricionais, setInformacoesNutricionais] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (uuid) {
        const responseProduto = await getProduto(uuid);
        const responseInfoNutricionais = await getInformacoesGrupo();
        setProduto(responseProduto.data);
        setInformacoesNutricionais(responseInfoNutricionais.data.results);
        setCarregando(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="card">
      <div className="card-body">
        {carregando && (
          <Spin tip="Carregando...">
            <ResultadoMock />
          </Spin>
        )}
        {produto && informacoesNutricionais && !!produto && (
          <Fragment>
            <CorpoRelatorio
              informacoesNutricionais={informacoesNutricionais}
              produto={{
                ...produto,
                todos_logs: retornaTodosOsLogs(produto.homologacao),
              }}
              historico={produto.ultima_homologacao}
            />
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default RelatorioProduto;
