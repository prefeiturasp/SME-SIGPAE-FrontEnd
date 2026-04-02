import "./styles.scss";
import HTTP_STATUS from "http-status-codes";
import React, { useEffect, useState } from "react";
import { Form } from "react-final-form";
import { Spin } from "antd";
import { FormFields } from "../components/FormFields";
import { useRelatorioFinanceiro } from "../view";
import { useLocation, useSearchParams } from "react-router-dom";
import { getFaixasEtarias } from "src/services/faixaEtaria.service";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { FaixaEtaria } from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { getTotaisAtendimentoConsumo } from "src/services/medicaoInicial/solicitacaoMedicaoInicial.service";
import { getTiposUnidadeEscolarTiposAlimentacao } from "src/services/cadastroTipoAlimentacao.service";
import { SelectOption } from "../types";
import GrupoCEI from "../components/Tabelas/GrupoCEI";
import GrupoEMEI from "../components/Tabelas/GrupoEMEI";
import GrupoEMEF from "../components/Tabelas/GrupoEMEF";
import GrupoCIEJA from "../components/Tabelas/GrupoCIEJA";
import GrupoCEMEI from "../components/Tabelas/GrupoCEMEI";
import GrupoEMEBS from "../components/Tabelas/GrupoEMEBS";
import DadosLiquidacao from "../components/DadosLiquidacao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import Botao from "src/components/Shareable/Botao";
import ModalEditarEmpenhos from "../components/ModalEditarEmpenhos";
import { getRelatorioDadosLiquidacao } from "src/services/medicaoInicial/relatorioFinanceiro.service";
import { DadosLiquidacaoEmpenho } from "src/interfaces/relatorio_financeiro.interface";

type TotaisParams = {
  mes: string;
  ano: string;
  lote: string;
  grupo_unidade_escolar: string;
  status: string;
  tipo_calculo?: string;
};

export function RelatorioFinanceiroConsolidado() {
  const [faixasEtarias, setFaixasEtarias] = useState<FaixaEtaria[]>([]);
  const [dadosLiquidacao, setDadosLiquidacao] = useState<
    DadosLiquidacaoEmpenho[]
  >([]);
  const [totaisConsumo, setTotaisConsumo] = useState<any>([]);
  const [tiposAlimentacao, setTiposAlimentacao] = useState<any[]>([]);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [editarEmpenhos, setEditarEmpenhos] = useState<boolean>(false);

  const [searchParams] = useSearchParams();
  const uuidRelatorioFinanceiro = searchParams.get("uuid");

  const {
    carregando: carregandoRelatorio,
    lotes,
    gruposUnidadeEscolar,
    mesesAnos,
    relatorioConsolidado,
  } = useRelatorioFinanceiro();

  const { state } = useLocation();

  const getTodasFaixasEtarias = async () => {
    const response = await getFaixasEtarias();
    if (response.status === HTTP_STATUS.OK)
      setFaixasEtarias(response.data.results);
    else toastError("Erro ao carregar faixas etárias.");
  };

  const getTotaisConsumo = async () => {
    const { mes_ano, lote, grupo_unidade_escolar, status } = state;
    const [mes, ano] = mes_ano.split("_");

    const grupo = gruposUnidadeEscolar.find(
      (e) => e.value === state.grupo_unidade_escolar[0],
    )?.label;

    const params: TotaisParams = {
      mes: mes,
      ano: ano,
      lote: lote[0],
      grupo_unidade_escolar: grupo_unidade_escolar[0],
      status: status[0],
    };

    if (grupo?.includes("CEI")) {
      params.tipo_calculo = "faixa_etaria";
    } else if (!grupo?.includes("CEMEI")) {
      params.tipo_calculo = "tipo_alimentacao";
    }

    setCarregando(true);
    const response = await getTotaisAtendimentoConsumo(params);
    setCarregando(false);

    if (response.status === HTTP_STATUS.OK) setTotaisConsumo(response.data);
    else toastError("Erro ao carregar totais de atendimento e consumo.");
  };

  const getTiposUuid = () => {
    const grupo = gruposUnidadeEscolar.find(
      (e) => e.value === state.grupo_unidade_escolar[0],
    );
    if (grupo) return grupo.tipos_unidades.map(({ uuid }) => uuid);
    return [];
  };

  const getTiposUnidades = async () => {
    const { data } = await getTiposUnidadeEscolarTiposAlimentacao();

    const unidades = getTiposUuid();
    const tiposAlimentacaoUnidades: Array<SelectOption> = unidades.reduce(
      (acc, tipoUnidade) => {
        acc.push(
          ...data.results
            .find((t) => t.uuid === tipoUnidade)
            .periodos_escolares.reduce((acc, periodo) => {
              acc.push(...periodo.tipos_alimentacao);
              return acc;
            }, []),
        );
        return acc;
      },
      [],
    );

    const tiposAlimentacaoUnicos = {};

    tiposAlimentacaoUnidades.forEach((tipoAlimentacao) => {
      tiposAlimentacaoUnicos[tipoAlimentacao.uuid] = tipoAlimentacao.nome;
    });

    const tiposAlimentacao = Object.entries(tiposAlimentacaoUnicos).map(
      ([uuid, nome]) => ({
        uuid,
        nome,
      }),
    );

    setTiposAlimentacao(tiposAlimentacao);
  };

  const getDadosLiquidacao = async () => {
    const response = await getRelatorioDadosLiquidacao({
      relatorio_financeiro: uuidRelatorioFinanceiro,
    });

    if (response.status === HTTP_STATUS.OK)
      setDadosLiquidacao(response.data.results);
    else toastError("Erro ao carregar dados para liquidação.");
  };

  useEffect(() => {
    if (uuidRelatorioFinanceiro) getDadosLiquidacao();
  }, [uuidRelatorioFinanceiro]);

  useEffect(() => {
    getTodasFaixasEtarias();
  }, []);

  useEffect(() => {
    if (!state?.grupo_unidade_escolar?.length || !gruposUnidadeEscolar?.length)
      return;
    getTiposUnidades();
    getTotaisConsumo();
  }, [state, gruposUnidadeEscolar]);

  const grupo =
    relatorioConsolidado?.grupo_unidade_escolar?.nome?.toLowerCase();

  const GRUPOS_POR_COMPONENTE: Record<string, React.ReactNode> = {
    "grupo 1": (
      <GrupoCEI
        relatorioConsolidado={relatorioConsolidado}
        faixasEtarias={faixasEtarias}
        totaisConsumo={totaisConsumo}
      />
    ),
    "grupo 2": (
      <GrupoCEMEI
        relatorioConsolidado={relatorioConsolidado}
        faixasEtarias={faixasEtarias}
        tiposAlimentacao={tiposAlimentacao}
        totaisConsumo={totaisConsumo}
      />
    ),
    "grupo 3": (
      <GrupoEMEI
        relatorioConsolidado={relatorioConsolidado}
        tiposAlimentacao={tiposAlimentacao}
        totaisConsumo={totaisConsumo}
      />
    ),
    "grupo 4": (
      <GrupoEMEF
        relatorioConsolidado={relatorioConsolidado}
        tiposAlimentacao={tiposAlimentacao}
        totaisConsumo={totaisConsumo}
      />
    ),
    "grupo 5": (
      <GrupoEMEBS
        relatorioConsolidado={relatorioConsolidado}
        tiposAlimentacao={tiposAlimentacao}
        totaisConsumo={totaisConsumo}
      />
    ),
    "grupo 6": (
      <GrupoCIEJA
        relatorioConsolidado={relatorioConsolidado}
        tiposAlimentacao={tiposAlimentacao}
        totaisConsumo={totaisConsumo}
      />
    ),
  };

  return (
    <div className="relatorio-consolidado">
      <Spin tip="Carregando..." spinning={carregando || carregandoRelatorio}>
        <div className="card mt-3">
          <div className="card-body">
            <Form key={state} onSubmit={() => {}} initialValues={state}>
              {() => (
                <form>
                  <FormFields
                    lotes={lotes}
                    gruposUnidadeEscolar={gruposUnidadeEscolar}
                    mesesAnos={mesesAnos}
                    exibirReabrirLancamentos
                  />
                </form>
              )}
            </Form>
            <div className="row mt-4 align-items-start">
              <div className="col-8">
                <DadosLiquidacao dados={dadosLiquidacao} />
              </div>
              <div className="col-4">
                <Botao
                  texto="Editar Empenhos"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  onClick={() => setEditarEmpenhos(true)}
                />
              </div>
            </div>
            {!carregando && relatorioConsolidado && (
              <div className="tabelas-relatorio-consolidado mt-5 mb-4">
                {Object.entries(GRUPOS_POR_COMPONENTE).map(
                  ([key, componente]) =>
                    grupo?.includes(key) && (
                      <React.Fragment key={key}>{componente}</React.Fragment>
                    ),
                )}
              </div>
            )}
          </div>
        </div>
      </Spin>
      <ModalEditarEmpenhos
        showModal={editarEmpenhos}
        setShowModal={setEditarEmpenhos}
        empenhos={dadosLiquidacao}
        lote={state?.lote[0]}
        relatorioFinanceiro={uuidRelatorioFinanceiro}
        onSave={(e) => setDadosLiquidacao(e)}
        tiposUnidades={getTiposUuid()}
      />
    </div>
  );
}
