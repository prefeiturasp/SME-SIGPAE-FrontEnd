import React, { useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { Spin } from "antd";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import { getListRelatoriosVisitaSupervisao } from "src/services/imr/painelGerencial";
import { Paginacao } from "src/components/Shareable/Paginacao";
import { Filtros } from "./components/Filtros";
import {
  FiltrosRelatoriosVisitasInterface,
  RelatorioVisitaItemListagem,
} from "interfaces/imr.interface";
import { Listagem } from "./components/Listagem";
import { getDashboardPainelGerencialSupervisao } from "src/services/imr/painelGerencial";
import { CardPorStatus } from "./components/CardPorStatus";
import "./style.scss";
import { DashboardSupervisaoInterface } from "./interfaces";
import { FormApi } from "final-form";

export const PainelRelatorios = () => {
  const [filtros, setFiltros] = useState<FiltrosRelatoriosVisitasInterface>({});
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
  const [form, setForm] = useState<FormApi>();
  const perfilNutriSupervisao =
    JSON.parse(localStorage.getItem("perfil")) ===
    "COORDENADOR_SUPERVISAO_NUTRICAO";

  const buscarResultados = async (
    filtros_: FiltrosRelatoriosVisitasInterface,
    pageNumber: number
  ) => {
    setCarregandoTabela(true);

    try {
      const params: URLSearchParams = gerarParametrosConsulta({
        page: pageNumber,
        ...filtros_,
      });
      const response = await getListRelatoriosVisitaSupervisao(params);

      if (response.status === HTTP_STATUS.OK) {
        setRelatoriosVisita(response.data.results);
        setTotalResultados(response.data.count);
        setConsultaRealizada(true);
      }
    } finally {
      setCarregandoTabela(false);
    }
  };

  const getDashboardPainelGerencialSupervisaoAsync = async () => {
    const response = await getDashboardPainelGerencialSupervisao(filtros);
    if (response.status === HTTP_STATUS.OK) {
      setDashboard(
        response.data.results.map((item) => {
          if (
            item.status === "NUTRIMANIFESTACAO_A_VALIDAR" &&
            !perfilNutriSupervisao
          ) {
            return { ...item, label: "Enviados pela Supervisão" };
          }
          return item;
        })
      );
    }
  };

  const proximaPagina = (page: number) => {
    buscarResultados(filtros, page);
    setPage(page);
  };

  useEffect(() => {
    getDashboardPainelGerencialSupervisaoAsync();
  }, []);

  return (
    <Spin tip="Carregando..." spinning={!dashboard}>
      <div className="card painel-acompanhamento-supervisao mt-3">
        <div className="card-body">
          {dashboard && (
            <>
              <div className="d-flex row row-cols-1">
                {dashboard.map((cardStatus, index) => {
                  return (
                    <CardPorStatus
                      cardStatus={cardStatus}
                      form={form}
                      key={index}
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
              <div className="mt-3 text-center">
                Selecione um dos status acima para visualizar a listagem de
                relatórios
              </div>
              {statusSelecionado && (
                <Filtros
                  filtros={filtros}
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
