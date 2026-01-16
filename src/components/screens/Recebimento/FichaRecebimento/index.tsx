import React, { useEffect, useState } from "react";
import { Spin } from "antd";

import {
  gerarParametrosConsulta,
  usuarioEhRecebimento,
} from "src/helpers/utilities";
import { listarFichasRecebimentos } from "src/services/fichaRecebimento.service";
import { Paginacao } from "src/components/Shareable/Paginacao";

import Filtros from "./components/Filtros";
import {
  FichaDeRecebimentoItemListagem,
  FiltrosFichaRecebimento,
} from "./interfaces";
import Listagem from "./components/Listagem";

export default () => {
  const [carregando, setCarregando] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosFichaRecebimento>({});
  const [page, setPage] = useState<number>(1);
  const [totalResultados, setTotalResultados] = useState(0);
  const [consultaRealizada, setConsultaRealizada] = useState(false);
  const [fichasRecebimento, setFichasRecebimento] = useState<
    FichaDeRecebimentoItemListagem[]
  >([]);

  const buscarResultados = async (pageNumber: number) => {
    setCarregando(true);

    let _filtros = {
      page: pageNumber,
      ...filtros,
    };

    if (!usuarioEhRecebimento()) _filtros = { ..._filtros, status: "ASSINADA" };

    try {
      const params: URLSearchParams = gerarParametrosConsulta(_filtros);
      const response = await listarFichasRecebimentos(params);

      if (response?.status === 200) {
        setFichasRecebimento(response.data.results);
        setTotalResultados(response.data.count);
        setConsultaRealizada(true);
      }
    } finally {
      setCarregando(false);
    }
  };

  const proximaPagina = (page: number) => {
    buscarResultados(page);
    setPage(page);
  };

  useEffect(() => {
    buscarResultados(1);
    setPage(1);
  }, [filtros]);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-documentos-recebimento">
        <div className="card-body documentos-recebimento">
          <Filtros
            setFiltros={setFiltros}
            setFichasRecebimento={setFichasRecebimento}
            setConsultaRealizada={setConsultaRealizada}
          />
          {consultaRealizada &&
            (fichasRecebimento.length === 0 ? (
              <div className="text-center mt-4 mb-4">
                Nenhum resultado encontrado
              </div>
            ) : (
              <>
                <Listagem
                  objetos={fichasRecebimento}
                  setCarregando={setCarregando}
                />

                <div className="row">
                  <div className="col">
                    <Paginacao
                      current={page}
                      total={totalResultados}
                      onChange={proximaPagina}
                    />
                  </div>
                </div>
              </>
            ))}
        </div>
      </div>
    </Spin>
  );
};
