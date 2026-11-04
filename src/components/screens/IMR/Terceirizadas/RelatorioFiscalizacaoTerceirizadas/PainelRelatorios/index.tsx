import React, { useEffect, useRef, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { Spin } from "antd";
import {
  gerarParametrosConsulta,
  usuarioPodeVisualizarRelatorioIMR,
} from "src/helpers/utilities";
import { getListRelatoriosVisitaSupervisao } from "src/services/imr/painelGerencial";
import { Paginacao } from "src/components/Shareable/Paginacao";
import { Filtros } from "./components/Filtros";
import {
  FiltrosRelatoriosVisitasInterface,
  RelatorioVisitaItemListagem,
} from "src/interfaces/imr.interface";
import { Listagem } from "./components/Listagem";
import { getDashboardPainelGerencialSupervisao } from "src/services/imr/painelGerencial";
import { CardPorStatus } from "./components/CardPorStatus";
import "./style.scss";
import { DashboardSupervisaoInterface } from "./interfaces";
import { FormApi } from "final-form";
import { ENVIRONMENT } from "src/constants/config";
import { FiltrosIniciais } from "./components/FiltrosIniciais";

const EXIBIR_NOVO_PAINEL = !ENVIRONMENT.includes("production");

export const PainelRelatorios = () => {
  const [filtros, setFiltros] = useState<FiltrosRelatoriosVisitasInterface>({});
  const [filtrosIniciais, setFiltrosIniciais] =
    useState<FiltrosRelatoriosVisitasInterface>({});
  const [page, setPage] = useState<number>(1);
  const [totalResultados, setTotalResultados] = useState(0);
  const [consultaRealizada, setConsultaRealizada] = useState(false);
  const [relatoriosVisita, setRelatoriosVisita] = useState<
    RelatorioVisitaItemListagem[]
  >([]);
  const [dashboard, setDashboard] =
    useState<Array<DashboardSupervisaoInterface>>();
  const [statusSelecionado, setStatusSelecionado] = useState<string>("");

  const [carregandoTabela, setCarregandoTabela] = useState(false);
  const [carregandoDashboard, setCarregandoDashboard] =
    useState(!EXIBIR_NOVO_PAINEL);
  const consultaDashboardAtual = useRef(0);
  const consultaResultadosAtual = useRef(0);
  const [form, setForm] = useState<FormApi>();
  const perfilNutriSupervisao =
    JSON.parse(localStorage.getItem("perfil")) ===
    "COORDENADOR_SUPERVISAO_NUTRICAO";
  const podeVisualizarRelatorio = usuarioPodeVisualizarRelatorioIMR();

  const buscarResultados = async (
    filtros_: FiltrosRelatoriosVisitasInterface,
    pageNumber: number,
  ) => {
    const consultaAtual = ++consultaResultadosAtual.current;
    setCarregandoTabela(true);

    try {
      const params: URLSearchParams = gerarParametrosConsulta({
        page: pageNumber,
        ...filtros_,
      });
      const response = await getListRelatoriosVisitaSupervisao(params);

      if (
        consultaAtual === consultaResultadosAtual.current &&
        response?.status === HTTP_STATUS.OK
      ) {
        setRelatoriosVisita(response.data.results);
        setTotalResultados(response.data.count);
        setConsultaRealizada(true);
      }
    } finally {
      if (consultaAtual === consultaResultadosAtual.current) {
        setCarregandoTabela(false);
      }
    }
  };

  const getDashboardPainelGerencialSupervisaoAsync = async () => {
    const consultaAtual = ++consultaDashboardAtual.current;
    setCarregandoDashboard(true);

    try {
      const response = await getDashboardPainelGerencialSupervisao(
        EXIBIR_NOVO_PAINEL ? filtrosIniciais : filtros,
      );

      if (
        consultaAtual !== consultaDashboardAtual.current ||
        response?.status !== HTTP_STATUS.OK
      )
        return;

      setDashboard(
        response.data.results.map((item) => {
          if (item.status === "NUTRIMANIFESTACAO_A_VALIDAR") {
            return { ...item, label: "Enviados pela Supervisão" };
          }
          return item;
        }),
      );
    } finally {
      if (consultaAtual === consultaDashboardAtual.current) {
        setCarregandoDashboard(false);
      }
    }
  };

  const alterarFiltrosIniciais = (
    novosFiltros: FiltrosRelatoriosVisitasInterface,
  ) => {
    consultaDashboardAtual.current += 1;
    consultaResultadosAtual.current += 1;
    setFiltrosIniciais(novosFiltros);
    setFiltros(novosFiltros);
    setDashboard(undefined);
    setStatusSelecionado("");
    setRelatoriosVisita([]);
    setTotalResultados(0);
    setConsultaRealizada(false);
    setCarregandoDashboard(false);
    setCarregandoTabela(false);
    setPage(1);
    setForm(undefined);
  };

  const proximaPagina = (page: number) => {
    buscarResultados(filtros, page);
    setPage(page);
  };

  useEffect(() => {
    if (
      EXIBIR_NOVO_PAINEL &&
      (!filtrosIniciais.diretoria_regional ||
        !filtrosIniciais.mes ||
        !filtrosIniciais.ano)
    )
      return;
    getDashboardPainelGerencialSupervisaoAsync();
    return () => {
      consultaDashboardAtual.current += 1;
      consultaResultadosAtual.current += 1;
    };
  }, [filtrosIniciais]);

  return (
    <Spin tip="Carregando..." spinning={carregandoDashboard}>
      <div className="card painel-acompanhamento-supervisao mt-3">
        <div className="card-body">
          {EXIBIR_NOVO_PAINEL && (
            <FiltrosIniciais
              filtros={filtrosIniciais}
              aoAlterarFiltros={alterarFiltrosIniciais}
            />
          )}
          {dashboard && (
            <>
              <div className="d-flex row row-cols-1">
                {dashboard.map((cardStatus) => {
                  return (
                    <CardPorStatus
                      cardStatus={cardStatus}
                      form={form}
                      key={cardStatus.status}
                      filtrosIniciais={
                        EXIBIR_NOVO_PAINEL ? filtrosIniciais : undefined
                      }
                      setConsultaRealizada={setConsultaRealizada}
                      setFiltros={setFiltros}
                      setPage={setPage}
                      setRelatoriosVisita={setRelatoriosVisita}
                      setStatusSelecionado={setStatusSelecionado}
                      statusSelecionado={statusSelecionado}
                    />
                  );
                })}
              </div>
              {!statusSelecionado && (
                <div className="mt-3 text-center">
                  Selecione um dos status acima para visualizar a listagem de
                  relatórios
                </div>
              )}
              {statusSelecionado && (
                <Filtros
                  filtros={filtros}
                  filtrosIniciais={
                    EXIBIR_NOVO_PAINEL ? filtrosIniciais : undefined
                  }
                  setFiltros={setFiltros}
                  setRelatoriosVisita={setRelatoriosVisita}
                  setConsultaRealizada={setConsultaRealizada}
                  perfilNutriSupervisao={perfilNutriSupervisao}
                  buscarResultados={buscarResultados}
                  form_={form}
                  setForm={setForm}
                />
              )}
              <Spin tip="Carregando..." spinning={carregandoTabela}>
                {consultaRealizada &&
                  (relatoriosVisita.length === 0 ? (
                    <div className="text-center mt-4 mb-4">
                      Nenhum resultado encontrado
                    </div>
                  ) : (
                    <>
                      <Listagem
                        objetos={relatoriosVisita}
                        perfilNutriSupervisao={perfilNutriSupervisao}
                        podeVisualizarRelatorio={podeVisualizarRelatorio}
                        getDashboardPainelGerencialSupervisaoAsync={
                          getDashboardPainelGerencialSupervisaoAsync
                        }
                        buscarResultados={buscarResultados}
                        filtros={filtros}
                        pagina={page}
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
              </Spin>
            </>
          )}
        </div>
      </div>
    </Spin>
  );
};
