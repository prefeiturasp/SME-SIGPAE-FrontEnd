import { Skeleton } from "antd";
import { FormApi } from "final-form";
import { Field } from "react-final-form";
import AutoCompleteSelectField from "src/components/Shareable/AutoCompleteSelectField";
import { MultiselectRaw } from "src/components/Shareable/MultiselectRaw";
import Select from "src/components/Shareable/Select";
import {
  usuarioEhDRE,
  usuarioEhEscolaTerceirizadaQualquerPerfil,
} from "src/helpers/utilities";

import useView from "./view";

import { ChangeEvent } from "react";
import { InputComData } from "src/components/Shareable/DatePicker";
import { IFiltros } from "../../types";
import { validateDataFinal, validateDataInicial } from "./helpers";

type Props = {
  form: FormApi;
  // eslint-disable-next-line
  onChange: (values: IFiltros) => void;
};

export default (props: Props) => {
  const { form, onChange } = props;
  const view = useView({ form, onChange });

  const values = form.getState().values;

  return (
    <>
      <div className="row">
        <div className="col-4">
          {view.buscandoOpcoes.buscandoMesesAnos ? (
            <Skeleton paragraph={false} active />
          ) : (
            <Field
              component={Select}
              dataTestId="select-mes-referencia"
              label="Mês de Referência"
              name="mes"
              placeholder="Selecione o mês de referência"
              options={view.mesesAnosOpcoes}
              required
              naoDesabilitarPrimeiraOpcao
              validate={view.validaMesAno}
              onChangeEffect={(e: ChangeEvent<HTMLInputElement>) =>
                view.onChangeMesAno(e, form)
              }
            />
          )}
        </div>
        <div className="col-8">
          {view.buscandoOpcoes.buscandoDiretoriasRegionais ? (
            <Skeleton paragraph={false} active />
          ) : (
            <Field
              component={Select}
              label="DRE"
              dataTestId="select-dre"
              name="dre"
              placeholder="Selecione uma DRE"
              options={view.diretoriasRegionaisOpcoes}
              naoDesabilitarPrimeiraOpcao
              onChangeEffect={view.onChangeDRE}
              disabled={
                usuarioEhDRE() || usuarioEhEscolaTerceirizadaQualquerPerfil()
              }
            />
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-4">
          {view.buscandoOpcoes.buscandoLotes ? (
            <Skeleton paragraph={false} active />
          ) : (
            <Field
              component={MultiselectRaw}
              label="Lotes"
              name="lotes"
              dataTestId="select-lotes"
              selected={values.lotes || []}
              options={view.lotesOpcoes}
              onSelectedChanged={(
                values_: Array<{ label: string; value: string }>
              ) => {
                form.change(
                  `lotes`,
                  values_.map((value_) => value_.value)
                );
                view.onChangeLotes(values_.map((value_) => value_.value));
              }}
              placeholder="Selecione os lotes"
            />
          )}
        </div>
        <div className="col-8">
          {view.buscandoOpcoes.buscandoUnidadesEducacionais ? (
            <Skeleton paragraph={false} active />
          ) : (
            <Field
              component={AutoCompleteSelectField}
              dataTestId="select-unidade-educacional"
              label="Unidade Educacional"
              name="unidade_educacional"
              placeholder="Selecione uma Unidade Educacional"
              options={view.unidadesEducacionaisOpcoes}
              filterOption={view.filtraUnidadesEducacionaisOpcoes}
              onSelect={view.onChangeUnidadeEducacional}
              disabled={usuarioEhEscolaTerceirizadaQualquerPerfil()}
            />
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-4">
          {view.buscandoOpcoes.buscandoPeriodosEscolares ? (
            <Skeleton paragraph={false} active />
          ) : (
            <Field
              component={MultiselectRaw}
              label="Período"
              name="periodos"
              dataTestId="select-periodos-escolares"
              selected={values.periodos || []}
              options={view.periodosEscolaresOpcoes}
              onSelectedChanged={(
                values_: Array<{ label: string; value: string }>
              ) => {
                form.change(
                  `periodos`,
                  values_.map((value_) => value_.value)
                );
              }}
              placeholder="Selecione os períodos"
            />
          )}
        </div>
        <div className="col-4">
          {view.buscandoOpcoes.buscandoTiposAlimentacao ? (
            <Skeleton paragraph={false} active />
          ) : (
            <Field
              component={MultiselectRaw}
              label="Tipo de Alimentação"
              name="tipos_alimentacao"
              dataTestId="select-tipos-alimentacao"
              selected={values.tipos_alimentacao || []}
              options={view.tiposAlimentacaoOpcoes}
              onSelectedChanged={(
                values_: Array<{ label: string; value: string }>
              ) => {
                form.change(
                  `tipos_alimentacao`,
                  values_.map((value_) => value_.value)
                );
              }}
              placeholder="Selecione os períodos"
            />
          )}
        </div>
        <div className="col-2">
          {view.buscandoOpcoes.buscandoTiposAlimentacao ? (
            <Skeleton paragraph={false} active />
          ) : (
            <Field
              component={InputComData}
              dataTestId="div-periodo-lancamento-de"
              name="periodo_lancamento_de"
              label="Período de Lançamento"
              placeholder="De"
              minDate={validateDataInicial(form.getState().values, "de")}
              maxDate={validateDataFinal(form.getState().values)}
              disabled={!form.getState().values.mes}
              inputOnChange={(value: string) => {
                view.onChangePeriodoLancamentoDe(value);
              }}
            />
          )}
        </div>
        <div className="col-2">
          {view.buscandoOpcoes.buscandoTiposAlimentacao ? (
            <Skeleton paragraph={false} active />
          ) : (
            <Field
              component={InputComData}
              dataTestId="div-periodo-lancamento-ate"
              name="periodo_lancamento_ate"
              label="&nbsp;"
              placeholder="Até"
              minDate={validateDataInicial(form.getState().values)}
              maxDate={validateDataFinal(form.getState().values, "ate")}
              disabled={!form.getState().values.mes}
              inputOnChange={(value: string) => {
                view.onChangePeriodoLancamentoAte(value);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};
