import React from "react";
import { Form } from "react-final-form";

import { Spin } from "antd";
import { FormFields } from "../components/FormFields";

import { TabelaAlimentacaoCEI } from "../components/TabelaAlimentacaoCEI";
import { TabelaDietasCEI } from "../components/TabelaDietasCEI";

import useView from "../view";
import "./styles.scss";

export function RelatorioConsolidado() {
  const view = useView({});

  return (
    <div className="relatorio-consolidado">
      <Spin tip="Carregando..." spinning={view.carregando}>
        <div className="card mt-3">
          <div className="card-body">
            <Form onSubmit={() => {}} initialValues={view.valoresIniciais}>
              {() => (
                <form>
                  <FormFields
                    lotes={view.lotes}
                    gruposUnidadeEscolar={view.gruposUnidadeEscolar}
                    mesesAnos={view.mesesAnos}
                  />
                </form>
              )}
            </Form>

            {!view.carregando && view.relatorioConsolidado ? (
              <div className="tabelas-relatorio-consolidado mt-5 mb-4">
                {view.relatorioConsolidado?.grupo_unidade_escolar.nome ===
                "Grupo 1" ? (
                  <>
                    <TabelaAlimentacaoCEI
                      tabelas={view.relatorioConsolidado.tabelas}
                    />
                    <TabelaDietasCEI
                      tabelas={view.relatorioConsolidado.tabelas}
                      tipoDieta="Dietas Tipo A e Tipo A Enteral"
                    />
                    <TabelaDietasCEI
                      tabelas={view.relatorioConsolidado.tabelas}
                      tipoDieta="Dietas Tipo B"
                    />
                  </>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </Spin>
    </div>
  );
}
