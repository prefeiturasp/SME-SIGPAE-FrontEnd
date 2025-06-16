import React from "react";
import { Field } from "react-final-form";
import { Select as SelectAntd } from "antd";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import { ASelect } from "src/components/Shareable/MakeField";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import { InputComData } from "src/components/Shareable/DatePicker";
import { MESES } from "src/constants/shared";
import { required } from "src/helpers/fieldValidators";
import {
  formatarParaMultiselect,
  maxEntreDatas,
  formataData,
  adicionaDias,
} from "src/helpers/utilities";
import "./styles.scss";
import { FormApi } from "final-form";

type FiltrosProps = {
  onSubmit: (_values: any) => void;
  onClear: () => void;
  mesesAnos: {
    mes: number;
    ano: number;
  }[];
  getOpcoesFiltros: (_mesAno: string) => void;
  periodos: {
    uuid: string;
    nome: string;
  }[];
  dataInicial: string;
  dataFinal: string;
};

export function Filtros({
  onSubmit,
  onClear,
  mesesAnos,
  getOpcoesFiltros,
  periodos,
  dataInicial,
  dataFinal,
}: FiltrosProps) {
  const minDate = new Date(dataInicial.replace(/-/g, "/"));
  const maxDate = new Date(dataFinal.replace(/-/g, "/"));

  const resetForm = (form: FormApi<any, Partial<any>>): void => {
    form.change("periodos", null);
    form.change("data_inicial", null);
    form.change("data_final", null);
  };

  return (
    <div className="filtros-controle-de-frequencia">
      <CollapseFiltros
        onSubmit={onSubmit}
        onClear={onClear}
        titulo="Filtrar Resultados"
      >
        {(values, form) => (
          <div className="row">
            <div className="col-3 d-flex">
              <span className="required-asterisk">*</span>
              <Field
                name="mes_ano"
                label="Filtrar por Mês"
                component={ASelect}
                validate={required}
                onChange={(value: string) => {
                  form.change("mes_ano", value);
                  resetForm(form);
                  if (value) {
                    getOpcoesFiltros(value);
                  }
                }}
              >
                <SelectAntd.Option value="">Selecione um Mês</SelectAntd.Option>

                {mesesAnos.map((mesAno) => (
                  <SelectAntd.Option key={`${mesAno.mes}_${mesAno.ano}`}>
                    {`${MESES[mesAno.mes - 1]} ${mesAno.ano}`}
                  </SelectAntd.Option>
                ))}
              </Field>
            </div>

            <div className="col-3">
              <Field
                name="periodos"
                label="Filtrar por Período"
                nomeDoItemNoPlural="periodos"
                placeholder="Selecione um Período"
                component={MultiSelect}
                options={formatarParaMultiselect(periodos)}
                disabled={!values.mes_ano}
              />
            </div>

            <div className="col-3">
              <Field
                name="data_inicial"
                label="Filtrar por Dia"
                placeholder="De"
                component={InputComData}
                minDate={minDate}
                maxDate={
                  values.data_final
                    ? adicionaDias(values.data_final, "YYYY-MM-DD")
                    : maxDate
                }
                format={(data) =>
                  data ? formataData(data, "YYYY-MM-DD", "DD/MM/YYYY") : null
                }
                parse={(value) =>
                  value && formataData(value, "DD/MM/YYYY", "YYYY-MM-DD")
                }
                disabled={!values.mes_ano}
              />
            </div>

            <div className="col-3 datepicker-data_final">
              <Field
                name="data_final"
                placeholder="Até"
                component={InputComData}
                minDate={maxEntreDatas([
                  minDate,
                  values.data_inicial &&
                    adicionaDias(values.data_inicial, "YYYY-MM-DD"),
                ])}
                maxDate={maxDate}
                format={(data) =>
                  data ? formataData(data, "YYYY-MM-DD", "DD/MM/YYYY") : null
                }
                parse={(value) =>
                  value && formataData(value, "DD/MM/YYYY", "YYYY-MM-DD")
                }
                disabled={!values.mes_ano}
              />
            </div>
          </div>
        )}
      </CollapseFiltros>
    </div>
  );
}
