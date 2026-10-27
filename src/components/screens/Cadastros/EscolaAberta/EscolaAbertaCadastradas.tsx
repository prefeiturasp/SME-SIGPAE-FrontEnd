import { Spin, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { Collapse } from "react-collapse";
import { NavLink } from "react-router-dom";
import { ToggleExpandir } from "src/components/Shareable/ToggleExpandir";
import { listarEscolaAberta } from "./escolaAberta.service";
import { InputPesquisa } from "../../../Shareable/Input/InputPesquisa/index";
import { toastError } from "../../../Shareable/Toast/dialogs";
import { TabelaUnidades } from "./components/TabelaUnidades";
import { contarUnidades, formatarDias, isPeriodoEditavel } from "./helper";
import { CADASTROS, CONFIGURACOES, ESCOLA_ABERTA } from "src/configs/constants";
import "./styles.scss";

export const EscolaAbertaCadastradas = () => {
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});
  const [paginas, setPaginas] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [escolasAbertas, setEscolasAbertas] = useState<any[]>([]);
  const [filtradas, setFiltradas] = useState<any[]>([]);
  const [pesquisar, setPesquisar] = useState("");

  const toggleExpandir = (id: string) =>
    setExpandidos((prev) => ({ ...prev, [id]: !prev[id] }));

  const setPageFor = (id: string, page: number) =>
    setPaginas((prev) => ({ ...prev, [id]: page }));

  const filtrar = (termoPesquisa: string, lista = escolasAbertas) => {
    const termo = termoPesquisa.toLowerCase().trim();

    if (!termo) {
      setFiltradas(lista);
      return;
    }

    setFiltradas(
      lista.filter((escolaAberta) => {
        const periodo =
          `${escolaAberta.data_inicial} ${escolaAberta.data_final}`.toLowerCase();
        const dias = formatarDias(escolaAberta.dias_semana).toLowerCase();
        const quantidade = contarUnidades(escolaAberta).toString();

        return (
          periodo.includes(termo) ||
          dias.includes(termo) ||
          quantidade.includes(termo)
        );
      }),
    );
  };

  const onPesquisaChanged = (valor: string) => {
    setPesquisar(valor);
    filtrar(valor);
  };

  useEffect(() => {
    const fetchEscolasAbertas = async () => {
      try {
        setLoading(true);
        const response = await listarEscolaAberta();
        const items = response.data.results;
        setEscolasAbertas(items);
        setFiltradas(items);
      } catch {
        toastError("Erro ao listar Escola Aberta.");
      } finally {
        setLoading(false);
      }
    };

    fetchEscolasAbertas();
  }, []);

  return (
    <Spin tip="Carregando..." spinning={loading}>
      <div className="card pt-3 mt-3">
        <div className="card-body card-table-cadastro">
          <div className="escola-aberta-filtros">
            <InputPesquisa
              valor={pesquisar}
              onChange={onPesquisaChanged}
              placeholder="Pesquisar"
            />
          </div>

          <table className="tabela-escolas-abertas">
            <thead>
              <tr>
                <th className="periodo-realizacao text-center">
                  Período de Realização
                </th>
                <th className="repeticao text-center">Repetição</th>
                <th className="qtde-unidades text-center">Qtde. de Unidades</th>
                <th className="acoes text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((escolaAberta) => {
                const periodoEditavel = isPeriodoEditavel(
                  escolaAberta.data_inicial,
                  escolaAberta.data_final,
                );
                const count = contarUnidades(escolaAberta);

                return (
                  <React.Fragment key={escolaAberta.uuid}>
                    <tr>
                      <td className="text-center">
                        {escolaAberta.data_inicial} até{" "}
                        {escolaAberta.data_final}
                      </td>
                      <td className="text-center">
                        {formatarDias(escolaAberta.dias_semana)}
                      </td>
                      <td className="text-center">
                        {count} {count === 1 ? "UE" : "UEs"}
                      </td>
                      <td className="text-center">
                        <div className="acoes-celula">
                          {periodoEditavel ? (
                            <Tooltip title="Editar">
                              <span>
                                <NavLink
                                  className="botao-editar"
                                  to={`/${CONFIGURACOES}/${CADASTROS}/${ESCOLA_ABERTA}/${escolaAberta.uuid}`}
                                >
                                  <i className="fas fa-edit icone-edicao" />
                                </NavLink>
                              </span>
                            </Tooltip>
                          ) : (
                            <span className="esconder-icone">
                              <i className="fas fa-edit icone-edicao" />
                            </span>
                          )}
                          <ToggleExpandir
                            ativo={!!expandidos[escolaAberta.uuid]}
                            onClick={() => toggleExpandir(escolaAberta.uuid)}
                            dataTestId={`toggle-${escolaAberta.uuid}`}
                          />
                        </div>
                      </td>
                    </tr>

                    {!!expandidos[escolaAberta.uuid] && (
                      <tr className="linha-expandida">
                        <td colSpan={4}>
                          <Collapse isOpened={!!expandidos[escolaAberta.uuid]}>
                            <TabelaUnidades
                              editable={false}
                              participantes={
                                escolaAberta.unidades_participantes
                              }
                              page={paginas[escolaAberta.uuid] || 1}
                              setPage={(page) =>
                                setPageFor(escolaAberta.uuid, page)
                              }
                              loading={false}
                            />
                          </Collapse>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Spin>
  );
};
