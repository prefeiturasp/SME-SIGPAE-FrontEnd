import React from "react";
import { Select as SelectAntd } from "antd";
import { Field } from "react-final-form";

import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import { AInput, ASelect } from "src/components/Shareable/MakeField";

type FiltrosProps = {
  onSubmit: (_values: any) => void;
  onClear: () => void;
  contratos: {
    uuid: string;
    numero: string;
  }[];
  editais: {
    uuid: string;
    numero: string;
  }[];
};

export function Filtros({
  onSubmit,
  onClear,
  contratos,
  editais,
}: FiltrosProps) {
  const filtrarOpcoes = (value, option) => {
    return option.children
      .toString()
      .toLowerCase()
      .includes(value.toLowerCase());
  };

  return (
    <CollapseFiltros onSubmit={onSubmit} onClear={onClear}>
      {() => (
        <div className="row">
          <div className="col-4">
            <Field
              name="numero"
              label="Filtrar por Nº do Empenho"
              placeholder="Digite o Nº do empenho"
              autoComplete="off"
              component={AInput}
            />
          </div>

          <div className="col-4">
            <Field
              name="contrato"
              label="Filtrar por Contratos"
              component={ASelect}
              showSearch
              filterOption={filtrarOpcoes}
            >
              <SelectAntd.Option value="">
                Selecione um contrato
              </SelectAntd.Option>

              {contratos.map((contrato) => (
                <SelectAntd.Option key={contrato.uuid}>
                  {contrato.numero}
                </SelectAntd.Option>
              ))}
            </Field>
          </div>

          <div className="col-4">
            <Field
              name="edital"
              label="Filtrar por Editais"
              component={ASelect}
              showSearch
              filterOption={filtrarOpcoes}
            >
              <SelectAntd.Option value="">
                Selecione um edital
              </SelectAntd.Option>

              {editais.map((edital) => (
                <SelectAntd.Option key={edital.uuid}>
                  {edital.numero}
                </SelectAntd.Option>
              ))}
            </Field>
          </div>
        </div>
      )}
    </CollapseFiltros>
  );
}
