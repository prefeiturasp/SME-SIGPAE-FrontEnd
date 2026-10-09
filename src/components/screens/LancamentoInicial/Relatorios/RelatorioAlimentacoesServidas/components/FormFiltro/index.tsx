import { Skeleton, Spin, TreeSelect } from "antd";
import { Field } from "react-final-form";

import { InputComData } from "src/components/Shareable/DatePicker";
import { MultiselectRaw } from "src/components/Shareable/MultiselectRaw";
import { requiredMultiselect } from "src/helpers/fieldValidators";

import {
  diaPertenceAosMeses,
  getLimitesPeriodoAte,
  getLimitesPeriodoDe,
  validaPeriodoAte,
  validaPeriodoDe,
} from "./helpers";
import { Args, MultiSelectOption } from "./types";
import useView from "./view";

const { SHOW_CHILD } = TreeSelect;

export default ({ form, values }: Args) => {
  const view = useView({ form, values });
  const possuiMes = !!values.meses?.length;
  const filtraDiasDosMeses = (data: Date) =>
    diaPertenceAosMeses(data, values.meses);

  const alteraMultiselect =
    (campo: string) => (selecionados: Array<MultiSelectOption>) =>
      form.change(
        campo,
        selecionados.map((selecionado) => selecionado.value),
      );

  return (
    <>
      <div className="row">
        <div className="col-4">
          {view.carregandoOpcoesIniciais ? (
            <Skeleton paragraph={false} active />
          ) : (
            <Field
              component={MultiselectRaw}
              label="Mês de Referência"
              name="meses"
              dataTestId="select-mes-referencia"
              selected={values.meses || []}
              options={view.mesesAnosOpcoes}
              onSelectedChanged={alteraMultiselect("meses")}
              placeholder="Selecione o Mês de Referência"
              required
              validate={requiredMultiselect}
            />
          )}
        </div>
        <div className="col-4">
          {view.carregandoOpcoesIniciais ? (
            <Skeleton paragraph={false} active />
          ) : (
            <Field
              component={MultiselectRaw}
              label="DRE"
              name="dres"
              dataTestId="select-dres"
              selected={values.dres || []}
              options={view.dresOpcoes}
              onSelectedChanged={alteraMultiselect("dres")}
              placeholder="Selecione a DRE"
              required
              validate={requiredMultiselect}
              disabled={!possuiMes}
            />
          )}
        </div>
        <div className="col-4">
          {view.carregandoOpcoesIniciais ? (
            <Skeleton paragraph={false} active />
          ) : (
            <Field
              component={MultiselectRaw}
              label="Lote"
              name="lotes"
              dataTestId="select-lotes"
              selected={values.lotes || []}
              options={view.lotesOpcoes}
              onSelectedChanged={alteraMultiselect("lotes")}
              placeholder="Selecione o Lote"
              disabled={!view.possuiDre}
            />
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-4">
          <Spin spinning={view.carregandoSubprefeituras}>
            <Field
              component={MultiselectRaw}
              label="Subprefeitura"
              name="subprefeituras"
              dataTestId="select-subprefeituras"
              selected={values.subprefeituras || []}
              options={view.subprefeiturasOpcoes}
              onSelectedChanged={alteraMultiselect("subprefeituras")}
              placeholder="Selecione a Subprefeitura"
              disabled={!view.possuiDre || view.possuiLote}
            />
          </Spin>
        </div>
        <div className="col-4">
          {view.carregandoOpcoesIniciais ? (
            <Skeleton paragraph={false} active />
          ) : (
            <Field name="tipos_unidades">
              {({ input }) => (
                <div className="input">
                  <label className="col-form-label">Tipo de Unidade</label>
                  <TreeSelect
                    data-testid="select-tipos-unidades"
                    treeData={view.tiposUnidadesTreeData}
                    value={input.value || []}
                    onChange={(value: Array<string>) => input.onChange(value)}
                    treeCheckable
                    allowClear
                    showCheckedStrategy={SHOW_CHILD}
                    treeNodeFilterProp="title"
                    placeholder="Selecione um grupo"
                    style={{ width: "100%" }}
                    disabled={!view.possuiDre}
                  />
                </div>
              )}
            </Field>
          )}
        </div>
        <div className="col-4">
          <Spin spinning={view.carregandoUnidades}>
            <Field
              component={MultiselectRaw}
              label="Unidades Educacionais"
              name="unidades_educacionais"
              dataTestId="select-unidades-educacionais"
              selected={values.unidades_educacionais || []}
              options={view.unidadesEducacionaisOpcoes}
              onSelectedChanged={alteraMultiselect("unidades_educacionais")}
              placeholder="Selecione a Unidade"
              disabled={!view.possuiDre}
            />
          </Spin>
        </div>
      </div>
      <div className="row">
        <div className="col-4">
          {view.carregandoOpcoesIniciais ? (
            <Skeleton paragraph={false} active />
          ) : (
            <Field
              component={MultiselectRaw}
              label="Tipo de Alimentação"
              name="tipos_alimentacao"
              dataTestId="select-tipos-alimentacao"
              selected={values.tipos_alimentacao || []}
              options={view.tiposAlimentacaoOpcoes}
              onSelectedChanged={alteraMultiselect("tipos_alimentacao")}
              placeholder="Selecione o Tipo de Alimentação"
              disabled={!view.possuiDre || view.tipoAlimentacaoBloqueado}
            />
          )}
        </div>
        <div className="col-4">
          <Spin spinning={view.carregandoFaixasEtarias}>
            <Field
              component={MultiselectRaw}
              label="Faixa Etária"
              name="faixas_etarias"
              dataTestId="select-faixas-etarias"
              selected={values.faixas_etarias || []}
              options={view.faixasEtariasOpcoes}
              onSelectedChanged={alteraMultiselect("faixas_etarias")}
              placeholder="Selecione a Faixa Etária"
              disabled={!view.faixaEtariaHabilitada}
            />
          </Spin>
        </div>
        <div className="col-4">
          <div className="row">
            <div className="col-6">
              <Field
                component={InputComData}
                dataTestId="div-periodo-lancamento-de"
                name="periodo_lancamento_de"
                label="Período"
                placeholder="De"
                {...getLimitesPeriodoDe(values)}
                filterDate={filtraDiasDosMeses}
                validate={validaPeriodoDe}
                disabled={!possuiMes}
                showMonthDropdown={false}
                showYearDropdown={false}
              />
            </div>
            <div className="col-6">
              <Field
                component={InputComData}
                dataTestId="div-periodo-lancamento-ate"
                name="periodo_lancamento_ate"
                label="&nbsp;"
                placeholder="Até"
                {...getLimitesPeriodoAte(values)}
                filterDate={filtraDiasDosMeses}
                validate={validaPeriodoAte}
                disabled={!possuiMes}
                showMonthDropdown={false}
                showYearDropdown={false}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
