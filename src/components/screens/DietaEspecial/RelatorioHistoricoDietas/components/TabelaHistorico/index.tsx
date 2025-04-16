import React, { useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { Paginacao } from "components/Shareable/Paginacao";
import { CollapseContentEMEI } from "../CollapseContentEMEI";
import { CollapseContentCEI } from "../CollapseContentCEI";
import { CollapseContentEMEBS } from "../CollapseContentEMEBS";
import { CollapseContentCEMEI } from "../CollapseContentCEMEI";

import { getSolicitacoesRelatorioHistoricoDietas } from "services/dietaEspecial.service";

import "./styles.scss";
import { toastError } from "components/Shareable/Toast/dialogs";

type RowUnidadeEducacionalTipo = {
  lote: string;
  unidade_educacional: string;
  tipo_unidade: string;
  classificacao: string;
  total: number;
  data: string;
  periodos?: any[];
};

interface TabelaHistoricoProps {
  dietasEspeciais: any;
  setLoadingDietas: any;
  setDietasEspeciais: any;
  count: number;
  setCount: any;
  values: any;
}

interface RowWithCollapseProps {
  unidade: RowUnidadeEducacionalTipo;
  data: string;
  tipoUnidade: string;
}

export const TabelaHistorico: React.FC<TabelaHistoricoProps> = ({
  ...props
}) => {
  const [paginaAtual, setPaginaAtual] = useState(1);

  const {
    dietasEspeciais,
    setDietasEspeciais,
    setLoadingDietas,
    count,
    setCount,
    values,
  } = props;

  const PAGE_SIZE = 10;

  const onChangePage = async (page: number, values) => {
    setPaginaAtual(page);
    setLoadingDietas(true);
    let params = {
      page_size: PAGE_SIZE,
      page: page,
      ...values,
    };
    const response = await getSolicitacoesRelatorioHistoricoDietas(params);
    if (response.status === HTTP_STATUS.OK) {
      setDietasEspeciais(response.data);
      setCount(response.data.count);
    } else {
      toastError(
        "Erro ao carregar dados das dietas especiais. Tente novamente mais tarde."
      );
    }
    setLoadingDietas(false);
  };

  const unidades: RowUnidadeEducacionalTipo[] = dietasEspeciais.results;
  const renderRows = () => {
    return unidades.map((unidade, indexDieta) => {
      return (
        <RowWithCollapse
          key={indexDieta}
          unidade={unidade}
          data={dietasEspeciais.data}
          tipoUnidade={unidade.tipo_unidade}
        />
      );
    });
  };

  return (
    <section className="tabela-historico-dietas">
      <article>
        <div className={`grid-table-rel-dietas header-table`}>
          <div>DRE/Lote</div>
          <div>Unidade Educacional</div>
          <div>Classificação da Dieta</div>
          <div className="centralizar">Dietas Autorizadas</div>
          <div className="centralizar">Data de Referência</div>
          <div></div>
        </div>
        {dietasEspeciais && dietasEspeciais.results.length === 0 && (
          <div className="text-center mt-3">Nenhum resultado encontrado.</div>
        )}
        {renderRows()}
      </article>
      <Paginacao
        onChange={(page) => onChangePage(page, values)}
        total={count}
        pageSize={PAGE_SIZE}
        current={paginaAtual}
      />
    </section>
  );
};

const RowWithCollapse: React.FC<RowWithCollapseProps> = ({
  unidade,
  data,
  tipoUnidade,
}) => {
  const [showDetail, setShowDetail] = useState(false);

  const UNIDADES_CEI = [
    "CEI DIRET",
    "CEU CEI",
    "CEI",
    "CCI",
    "CCI/CIPS",
    "CEI CEU",
  ];

  const UNIDADES_CEMEI = ["CEMEI", "CEU CEMEI"];

  const UNIDADES_EMEI_EMEF_CIEJA = [
    "EMEI",
    "CEU EMEI",
    "CEU EMEI",
    "EMEF",
    "CEU EMEF",
    "EMEFM",
    "CIEJA",
  ];

  const UNIDADES_EMEBS = ["EMEBS"];
  const UNIDADES_SEM_PERIODOS = ["CMCT", "CEU GESTAO"];

  const shouldRenderCollapse =
    !UNIDADES_SEM_PERIODOS.includes(tipoUnidade) && unidade.total > 0;

  const renderCollapseContent = (tipoUnidade: string, periodos: any) => {
    if (UNIDADES_CEI.includes(tipoUnidade)) {
      return <CollapseContentCEI periodos={periodos} />;
    }
    if (UNIDADES_EMEI_EMEF_CIEJA.includes(tipoUnidade)) {
      return <CollapseContentEMEI periodos={periodos} />;
    }
    if (UNIDADES_CEMEI.includes(tipoUnidade)) {
      return <CollapseContentCEMEI periodos={periodos} />;
    }
    if (UNIDADES_EMEBS.includes(tipoUnidade)) {
      return <CollapseContentEMEBS periodos={periodos} />;
    }
  };

  return (
    <>
      <div className={`grid-table-rel-dietas body-table row-dieta`}>
        <div className="div-tabela-historico">{unidade.lote}</div>
        <div className="div-tabela-historico">
          {unidade.unidade_educacional}
        </div>
        <div className="div-tabela-historico">{unidade.classificacao}</div>
        <div className="div-tabela-historico centralizar">{unidade.total}</div>
        <div className="div-tabela-historico centralizar">{data}</div>
        <div className="div-tabela-historico centralizar">
          {shouldRenderCollapse && (
            <i
              className={`fas fa-${showDetail ? "angle-up" : "angle-down"}`}
              onClick={() => setShowDetail(!showDetail)}
              style={{ cursor: "pointer" }}
            />
          )}
        </div>
      </div>
      {shouldRenderCollapse && showDetail && (
        <div>{renderCollapseContent(tipoUnidade, unidade.periodos)}</div>
      )}
    </>
  );
};
