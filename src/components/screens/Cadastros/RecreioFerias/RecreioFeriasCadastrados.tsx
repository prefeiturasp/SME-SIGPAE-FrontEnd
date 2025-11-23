import { Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { Collapse } from "react-collapse";
import { NavLink } from "react-router-dom";
import { ToggleExpandir } from "src/components/Shareable/ToggleExpandir";
import { listarRecreioNasFerias } from "../../../../services/recreioFerias.service";
import { toastError } from "../../../Shareable/Toast/dialogs";
import { TabelaUnidades } from "./components/TabelaUnidades";
import { isPeriodoEditavel } from "./helper";
import "./style.scss";

export const RecreioFeriasCadastrados = () => {
  const [expandidosRecreios, setExpandidosRecreios] = useState<
    Record<string, boolean>
  >({});
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});
  const [paginasRecreios, setPaginasRecreios] = useState<
    Record<string, number>
  >({});
  const [loading, setLoading] = useState(false);
  const [recreioFerias, setRecreioFerias] = useState([]);
  const [recreioFeriasFiltrados, setRecreioFeriasFiltrados] = useState([]);
  const [pesquisar, setPesquisar] = useState("");

  const toggleExpandir = (id: string) => {
    setExpandidos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExpandirRecreio = (id: string) => {
    setExpandidosRecreios((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const setPageForRecreio = (recreioId: string, page: number) => {
    setPaginasRecreios((prev) => ({ ...prev, [recreioId]: page }));
  };

  const filtrarRecreios = (termoPesquisa: string) => {
    const termo = termoPesquisa.toLowerCase().trim();

    if (!termo) {
      setRecreioFeriasFiltrados(recreioFerias);
      return;
    }

    const filtrados = recreioFerias.filter((recreio) => {
      const tituloMatch = recreio.titulo?.toLowerCase().includes(termo);

      const dataInicioMatch = recreio.data_inicio
        ?.toLowerCase()
        .includes(termo);
      const dataFimMatch = recreio.data_fim?.toLowerCase().includes(termo);

      const quantidade = recreio.unidades_participantes?.length.toString();
      const quantidadeMatch = quantidade?.includes(termo);

      return tituloMatch || dataInicioMatch || dataFimMatch || quantidadeMatch;
    });

    setRecreioFeriasFiltrados(filtrados);
  };

  const onPesquisaChanged = (valor: string) => {
    setPesquisar(valor);
    filtrarRecreios(valor);
  };

  useEffect(() => {
    const fetchRecreio = async () => {
      try {
        setLoading(true);
        const response = await listarRecreioNasFerias();

        const items = response.data.results;
        setRecreioFerias(items);
        setRecreioFeriasFiltrados(items);
      } catch (error) {
        toastError("Erro ao listar recreio nas férias: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecreio();
  }, []);

  return (
    <div className="card pt-3 mt-3">
      <div className="card-body card-table-cadastro">
        <table className="recreios-cadastrados">
          <tr>
            <th className="col">Título do Recreio Cadastrado</th>
            <th className="col">Período de Realização</th>
            <th className="col">Qtde. de Unidades</th>
            <th className="col">
              <div className="">
                <input
                  className="input-search"
                  placeholder="Pesquisar"
                  value={pesquisar}
                  onChange={(e) => onPesquisaChanged(e.target.value)}
                  autoFocus={true}
                />
                <i className="fas fa-search" />
              </div>
            </th>
          </tr>
          {loading ? (
            <div>Carregando...</div>
          ) : (
            recreioFeriasFiltrados.map((recreio) => {
              const periodoEditavel = isPeriodoEditavel(
                recreio.data_inicio,
                recreio.data_fim
              );

              return (
                <React.Fragment key={recreio.id}>
                  <tr>
                    <td className="">{recreio.titulo}</td>
                    <td className="">
                      {recreio.data_inicio} até {recreio.data_fim}
                    </td>
                    <td className="ps-4">
                      {recreio.unidades_participantes.length} UEs
                    </td>
                    <td>
                      {periodoEditavel && (
                        <Tooltip title="Editar">
                          <span>
                            <NavLink
                              className="float-start botao-editar"
                              to={`/configuracoes/cadastros/recreio-nas-ferias/editar?uuid=${recreio.uuid}`}
                            >
                              <i className="fas fa-edit" />
                            </NavLink>
                          </span>
                        </Tooltip>
                      )}
                      <ToggleExpandir
                        className="ms-4"
                        ativo={!!expandidosRecreios[recreio.id]}
                        onClick={() => toggleExpandirRecreio(recreio.id)}
                        dataTestId={`toggle-${recreio.id}`}
                      />
                    </td>
                  </tr>

                  {!!expandidosRecreios[recreio.id] && (
                    <tr>
                      <td colSpan={4}>
                        <Collapse isOpened={!!expandidosRecreios[recreio.id]}>
                          <TabelaUnidades
                            editable={false}
                            participantes={recreio.unidades_participantes}
                            page={paginasRecreios[recreio.id] || 1}
                            setPage={(page) =>
                              setPageForRecreio(recreio.id, page)
                            }
                            loading={false}
                            expandidos={expandidos}
                            toggleExpandir={toggleExpandir}
                          />
                        </Collapse>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          )}
        </table>
      </div>
    </div>
  );
};
