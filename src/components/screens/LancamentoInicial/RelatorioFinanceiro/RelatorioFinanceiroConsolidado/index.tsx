import "./styles.scss";
import HTTP_STATUS from "http-status-codes";
import React, { useEffect, useState } from "react";
import { Form } from "react-final-form";
import { Spin } from "antd";
import { FormFields } from "../components/FormFields";
import GrupoCEI from "../components/Tabelas/GrupoCEI";
import { useRelatorioFinanceiro } from "../view";
import { useLocation } from "react-router-dom";
import { getFaixasEtarias } from "src/services/faixaEtaria.service";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { FaixaEtaria } from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { getTotaisAtendimentoConsumo } from "src/services/medicaoInicial/solicitacaoMedicaoInicial.service";
import GrupoEMEI from "../components/Tabelas/GrupoEMEI";
import { getTiposUnidadeEscolarTiposAlimentacao } from "src/services/cadastroTipoAlimentacao.service";
import { SelectOption } from "../types";
import GrupoEMEF from "../components/Tabelas/GrupoEMEF";
import GrupoCIEJA from "../components/Tabelas/GrupoCIEJA";

export function RelatorioFinanceiroConsolidado() {
  const [faixasEtarias, setFaixasEtarias] = useState<FaixaEtaria[]>([]);
  const [totaisConsumo, setTotaisConsumo] = useState<any>([]);
  const [tiposAlimentacao, setTiposAlimentacao] = useState<any[]>([]);
  const [carregando, setCarregando] = useState<boolean>(false);

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

    setCarregando(true);
    const response = await getTotaisAtendimentoConsumo({
      mes: mes,
      ano: ano,
      lote: lote[0],
      grupo_unidade_escolar: grupo_unidade_escolar[0],
      status: status[0],
      tipo_calculo: grupo?.includes("CEI")
        ? "faixa_etaria"
        : "tipo_alimentacao",
    });
    setCarregando(false);

    if (response.status === HTTP_STATUS.OK) setTotaisConsumo(response.data);
    else toastError("Erro ao carregar totais de atendimento e consumo.");
  };

  const getTiposUnidades = async () => {
    const { data } = await getTiposUnidadeEscolarTiposAlimentacao();

    const grupo = gruposUnidadeEscolar.find(
      (e) => e.value === state.grupo_unidade_escolar[0],
    )?.label;

    const match = grupo.match(/\((.*?)\)/);
    let unidades: string[] = [];
    if (match && match[1]) {
      const tipos = match[1].split(",");
      unidades = tipos.map((item) => item.trim());
    }

    const tiposAlimentacaoUnidades: Array<SelectOption> = unidades.reduce(
      (acc, tipoUnidade) => {
        acc.push(
          ...data.results
            .find((t) => t.iniciais === tipoUnidade)
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
    "grupo 6": <GrupoCIEJA />,
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
    </div>
  );
}
