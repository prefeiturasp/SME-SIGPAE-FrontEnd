import { Spin, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { Collapse } from "react-collapse";
import { NavLink } from "react-router-dom";
import { ToggleExpandir } from "src/components/Shareable/ToggleExpandir";
import { listarEscolaAberta } from "./escolaAberta.service";
import { InputPesquisa } from "../../../Shareable/Input/InputPesquisa/index";
import { toastError } from "../../../Shareable/Toast/dialogs";
import { TabelaUnidades } from "./components/TabelaUnidades";
import { isPeriodoEditavel } from "./helper";
import { CADASTROS, CONFIGURACOES, ESCOLA_ABERTA } from "src/configs/constants";
import "./styles.scss";

const DIAS_SEMANA: Record<string, string> = {
  "0": "Segunda-feira",
  "1": "Terça-feira",
  "2": "Quarta-feira",
  "3": "Quinta-feira",
  "4": "Sexta-feira",
  "5": "Sábado",
  "6": "Domingo",
};

const formatarDias = (dias: string[] = []) =>
  [...dias]
    .sort((a, b) => Number(a) - Number(b))
    .map((d) => DIAS_SEMANA[String(d)] ?? d)
    .join(", ");

const contarUnidades = (escolaAberta: any) =>
  new Set(
    (escolaAberta.unidades_participantes || []).map(
      (u: any) => u.unidade_educacional,
    ),
  ).size;

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
      lista.filter((ea) => {
        const periodo = `${ea.data_inicial} ${ea.data_final}`.toLowerCase();
        const dias = formatarDias(ea.dias_semana).toLowerCase();
        const quantidade = contarUnidades(ea).toString();

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
              {filtradas.map((ea) => {
                const periodoEditavel = isPeriodoEditavel(
                  ea.data_inicial,
                  ea.data_final,
                );
                const count = contarUnidades(ea);

                return (
                  <React.Fragment key={ea.uuid}>
                    <tr>
                      <td className="text-center">
                        {ea.data_inicial} até {ea.data_final}
                      </td>
                      <td className="text-center">
                        {formatarDias(ea.dias_semana)}
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
                                  to={`/${CONFIGURACOES}/${CADASTROS}/${ESCOLA_ABERTA}/${ea.uuid}`}
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
                            ativo={!!expandidos[ea.uuid]}
                            onClick={() => toggleExpandir(ea.uuid)}
                            dataTestId={`toggle-${ea.uuid}`}
                          />
                        </div>
                      </td>
                    </tr>

                    {!!expandidos[ea.uuid] && (
                      <tr className="linha-expandida">
                        <td colSpan={4}>
                          <Collapse isOpened={!!expandidos[ea.uuid]}>
                            <TabelaUnidades
                              editable={false}
                              participantes={ea.unidades_participantes}
                              page={paginas[ea.uuid] || 1}
                              setPage={(page) => setPageFor(ea.uuid, page)}
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
