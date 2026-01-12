import React, { useState } from "react";
import { Link } from "react-router-dom";

import { FiltrosInterface } from "src/interfaces/relatorio_financeiro.interface";

import { Spin } from "antd";
import { Filtros } from "./components/Filtros/Index";
import { Paginacao } from "src/components/Shareable/Paginacao";

import { MESES } from "src/constants/shared";
import { STATUS_RELATORIO_FINANCEIRO } from "../constants";
import {
  MEDICAO_INICIAL,
  RELATORIO_FINANCEIRO,
  RELATORIO_CONSOLIDADO,
} from "src/configs/constants";
import "./styles.scss";
import useView from "./view";
import ModalAnalisar from "./components/ModalAnalisar";

export function RelatorioFinanceiro() {
  const [filtros, setFiltros] = useState<FiltrosInterface>({});
  const [showAnalisar, setShowAnalisar] = useState<boolean>(false);
  const [relatorioUuid, setRelatorioUuid] = useState<string | null>(null);

  const view = useView({ filtros });

  const onChangePage = async (page: number, filtros: FiltrosInterface) => {
    view.setPaginaAtual(page);
    view.setCarregando(true);
    await view.getRelatoriosFinanceirosAsync(page, filtros);
    view.setCarregando(false);
  };

  return (
    <div className="relatorio-financeiro">
      <Spin tip="Carregando..." spinning={view.carregando}>
        <div className="card mt-3">
          <div className="card-body">
            <Filtros
              onSubmit={(values) => {
                setFiltros(values);
                onChangePage(1, values);
              }}
              onClear={() => {
                setFiltros({});
                onChangePage(1, {});
              }}
              lotes={view.lotes}
              gruposUnidadeEscolar={view.gruposUnidadeEscolar}
              mesesAnos={view.mesesAnos}
            />

            <div className="mt-4">
              {view.relatoriosFinanceiros.length === 0 && !view.carregando ? (
                <div className="text-center mt-4 mb-4">
                  Nenhum resultado encontrado
                </div>
              ) : (
                <div className="tabela-relatorios-financeiros mt-4 mb-4">
                  <div className="titulo-tabela mt-5 mb-3">
                    Resultados da Pesquisa
                  </div>

                  <table>
                    <thead>
                      <tr className="row">
                        <th className="col-3">Lote e DRE</th>
                        <th className="col-3">Tipo de Unidade</th>
                        <th className="col-2 text-center">Mês de Referência</th>
                        <th className="col-2 text-center">Status</th>
                        <th className="col-2 text-center">Ações</th>
                      </tr>
                    </thead>

                    <tbody>
                      {view.relatoriosFinanceiros.map((relatorioFinanceiro) => (
                        <tr key={relatorioFinanceiro.uuid} className="row">
                          <td className="col-3">
                            {relatorioFinanceiro.lote.nome} -{" "}
                            {relatorioFinanceiro.lote.diretoria_regional.nome}
                          </td>
                          <td className="col-3">
                            {relatorioFinanceiro.grupo_unidade_escolar.nome} (
                            {relatorioFinanceiro.grupo_unidade_escolar.tipos_unidades
                              .map((unidade) => unidade.iniciais)
                              .join(", ")}
                            )
                          </td>
                          <td className="col-2 text-center">{`${
                            MESES[parseInt(relatorioFinanceiro.mes) - 1]
                          } de ${relatorioFinanceiro.ano}`}</td>
                          <td className="col-2 text-center">
                            {
                              STATUS_RELATORIO_FINANCEIRO[
                                relatorioFinanceiro.status
                              ]
                            }
                          </td>
                          <td className="col-2 text-center">
                            {relatorioFinanceiro.status !==
                            "RELATORIO_FINANCEIRO_GERADO" ? (
                              <>
                                <Link
                                  to={`/${MEDICAO_INICIAL}/${RELATORIO_FINANCEIRO}/${RELATORIO_CONSOLIDADO}/?uuid=${relatorioFinanceiro.uuid}`}
                                >
                                  <span className="px-2">
                                    <i
                                      title="Visualizar"
                                      className="fas fa-eye green"
                                    />
                                  </span>
                                </Link>
                                <span className="px-2">
                                  <i
                                    title="Lançamentos Consolidados"
                                    className="fas fa-file-excel green"
                                  />
                                </span>
                                <span className="px-2">
                                  <i
                                    title="Ateste Financeiro"
                                    className="fas fa-file-pdf red"
                                  />
                                </span>
                              </>
                            ) : (
                              <span
                                className="px-2"
                                onClick={() => {
                                  setRelatorioUuid(relatorioFinanceiro.uuid);
                                  setShowAnalisar(true);
                                }}
                              >
                                <i
                                  title="Analisar"
                                  className="fas fa-file-export green"
                                />
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <Paginacao
                    onChange={(page: number) => onChangePage(page, filtros)}
                    total={view.relatoriosFinanceirosResponse?.count}
                    pageSize={view.relatoriosFinanceirosResponse?.page_size}
                    current={view.paginaAtual}
                  />
                </div>
              )}
            </div>
            <ModalAnalisar
              showModal={showAnalisar}
              setShowModal={setShowAnalisar}
              uuidRelatorio={relatorioUuid}
            />
          </div>
        </div>
      </Spin>
    </div>
  );
}
