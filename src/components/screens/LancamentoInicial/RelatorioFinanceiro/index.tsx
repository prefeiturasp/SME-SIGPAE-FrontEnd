import "./styles.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { Filtros } from "./components/Filtros/Index";
import { Paginacao } from "src/components/Shareable/Paginacao";
import { MESES } from "src/constants/shared";
import { STATUS_RELATORIO_FINANCEIRO } from "../constants";
import {
  MEDICAO_INICIAL,
  RELATORIO_FINANCEIRO,
  ANALISAR_RELATORIO_FINANCEIRO,
} from "src/configs/constants";
import { useRelatorioFinanceiro } from "./view";
import ModalAnalisar from "./components/ModalAnalisar";
import { usuarioEhMedicao } from "src/helpers/utilities";

interface RelatorioSelecionado {
  uuid: string;
  lote: string[];
  grupo_unidade_escolar: string[];
  status: string[];
  mes_ano: string;
  visualizar?: boolean;
}

export function RelatorioFinanceiro() {
  const [showAnalisar, setShowAnalisar] = useState(false);
  const [relatorioSelecionado, setRelatorioSelecionado] =
    useState<RelatorioSelecionado | null>(null);
  const navigate = useNavigate();

  const {
    carregando,
    aplicarFiltros,
    lotes,
    gruposUnidadeEscolar,
    mesesAnos,
    relatoriosFinanceiros,
    setPaginaAtual,
    paginaAtual,
    relatoriosFinanceirosResponse,
  } = useRelatorioFinanceiro();

  const onPageRelatorio = (relatorio: RelatorioSelecionado) => {
    navigate(
      `/${MEDICAO_INICIAL}/${RELATORIO_FINANCEIRO}/${ANALISAR_RELATORIO_FINANCEIRO}/?uuid=${relatorio?.uuid}`,
      {
        state: relatorio,
      },
    );
  };

  return (
    <div className="relatorio-financeiro">
      <Spin tip="Carregando..." spinning={carregando}>
        <div className="card mt-3">
          <div className="card-body">
            <Filtros
              onSubmit={aplicarFiltros}
              onClear={() => aplicarFiltros({})}
              lotes={lotes}
              gruposUnidadeEscolar={gruposUnidadeEscolar}
              mesesAnos={mesesAnos}
            />

            <div className="mt-4">
              {relatoriosFinanceiros.length === 0 && !carregando ? (
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
                      {relatoriosFinanceiros.map((relatorio) => (
                        <tr key={relatorio.uuid} className="row">
                          <td className="col-3">
                            {relatorio.lote.nome} -{" "}
                            {relatorio.lote.diretoria_regional.nome}
                          </td>
                          <td className="col-3">
                            {relatorio.grupo_unidade_escolar.nome} (
                            {relatorio.grupo_unidade_escolar.tipos_unidades
                              .map((unidade) => unidade.iniciais)
                              .join(", ")}
                            )
                          </td>
                          <td className="col-2 text-center">
                            {`${MESES[parseInt(relatorio.mes) - 1]} de ${
                              relatorio.ano
                            }`}
                          </td>
                          <td className="col-2 text-center">
                            {STATUS_RELATORIO_FINANCEIRO[relatorio.status]}
                          </td>
                          <td className="col-2 text-center">
                            {relatorio.status !==
                              "RELATORIO_FINANCEIRO_GERADO" ||
                            !usuarioEhMedicao() ? (
                              <>
                                <span
                                  className="px-2 cursor-pointer"
                                  onClick={() => {
                                    onPageRelatorio({
                                      uuid: relatorio.uuid,
                                      mes_ano: `${relatorio.mes}_${relatorio.ano}`,
                                      lote: [relatorio.lote.uuid],
                                      grupo_unidade_escolar: [
                                        relatorio.grupo_unidade_escolar.uuid,
                                      ],
                                      status: [relatorio.status],
                                      visualizar: true,
                                    });
                                  }}
                                >
                                  <i
                                    title="Visualizar"
                                    className="fas fa-eye green"
                                  />
                                </span>
                                <span className="px-2 cursor-pointer">
                                  <i
                                    title="Lançamentos Consolidados"
                                    className="fas fa-file-excel green"
                                  />
                                </span>
                                <span className="px-2 cursor-pointer">
                                  <i
                                    title="Ateste Financeiro"
                                    className="fas fa-file-pdf red"
                                  />
                                </span>
                              </>
                            ) : (
                              <span
                                className="px-2 cursor-pointer"
                                onClick={() => {
                                  setRelatorioSelecionado({
                                    uuid: relatorio.uuid,
                                    mes_ano: `${relatorio.mes}_${relatorio.ano}`,
                                    lote: [relatorio.lote.uuid],
                                    grupo_unidade_escolar: [
                                      relatorio.grupo_unidade_escolar.uuid,
                                    ],
                                    status: [relatorio.status],
                                  });
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
                    onChange={setPaginaAtual}
                    total={relatoriosFinanceirosResponse?.count}
                    pageSize={relatoriosFinanceirosResponse?.page_size}
                    current={paginaAtual}
                  />
                </div>
              )}
            </div>

            <ModalAnalisar
              showModal={showAnalisar}
              setShowModal={setShowAnalisar}
              uuidRelatorio={relatorioSelecionado?.uuid}
              onVisualizar={() =>
                onPageRelatorio({ ...relatorioSelecionado, visualizar: true })
              }
              onAnalisar={() => onPageRelatorio(relatorioSelecionado)}
            />
          </div>
        </div>
      </Spin>
    </div>
  );
}
