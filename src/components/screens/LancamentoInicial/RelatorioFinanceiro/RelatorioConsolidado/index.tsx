import "./styles.scss";
import HTTP_STATUS from "http-status-codes";
import { useEffect, useState } from "react";
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

export function RelatorioConsolidado() {
  const [faixasEtarias, setFaixasEtarias] = useState<FaixaEtaria[]>([]);
  const [totaisConsumo, setTotaisConsumo] = useState<any>([]);

  const {
    carregando,
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

    const response = await getTotaisAtendimentoConsumo({
      mes: mes,
      ano: ano,
      lote: lote[0],
      grupo_unidade_escolar: grupo_unidade_escolar[0],
      status: status[0],
    });

    if (response.status === HTTP_STATUS.OK) setTotaisConsumo(response.data);
    else toastError("Erro ao carregar totais de atendimento e consumo.");
  };

  useEffect(() => {
    getTodasFaixasEtarias();
    if (state) getTotaisConsumo();
  }, [state]);

  return (
    <div className="relatorio-consolidado">
      <Spin tip="Carregando..." spinning={carregando}>
        <div className="card mt-3">
          <div className="card-body">
            <Form key={state} onSubmit={() => {}} initialValues={state}>
              {() => (
                <form>
                  <FormFields
                    lotes={lotes}
                    gruposUnidadeEscolar={gruposUnidadeEscolar}
                    mesesAnos={mesesAnos}
                  />
                </form>
              )}
            </Form>

            {!carregando && relatorioConsolidado ? (
              <div className="tabelas-relatorio-consolidado mt-5 mb-4">
                {relatorioConsolidado?.grupo_unidade_escolar.nome ===
                "Grupo 1" ? (
                  <GrupoCEI
                    relatorioConsolidado={relatorioConsolidado}
                    faixasEtarias={faixasEtarias}
                    totaisConsumo={totaisConsumo}
                  />
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </Spin>
    </div>
  );
}
