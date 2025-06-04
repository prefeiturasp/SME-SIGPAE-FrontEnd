import React from "react";
import { Select as SelectAntd } from "antd";
import { Field } from "react-final-form";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import {
  ASelect,
  AInput,
  AInputNumber,
} from "src/components/Shareable/MakeField";
import {
  formataValorDecimal,
  parserValorDecimal,
} from "../../../../helper.jsx";

type FiltrosProps = {
  onSubmit: (_values: any) => void;
  onClear: () => void;
  editais: {
    uuid: string;
    numero: string;
  }[];
};

export function Filtros({ onSubmit, onClear, editais }: FiltrosProps) {
  return (
    <CollapseFiltros
      onSubmit={onSubmit}
      onClear={onClear}
      titulo="Filtrar Resultados"
    >
      {() => (
        <div className="row">
          <div className="col-4">
            <Field
              name="edital"
              label="Nº do Edital"
              component={ASelect}
              showSearch
              filterOption={(value: string, option: { label: string }) =>
                option!.label.toUpperCase().indexOf(value.toUpperCase()) !== -1
              }
            >
              <SelectAntd.Option value="">Selecione o edital</SelectAntd.Option>

              {editais.map((edital) => (
                <SelectAntd.Option key={edital.uuid}>
                  {edital.numero}
                </SelectAntd.Option>
              ))}
            </Field>
          </div>

          <div className="col-4">
            <Field
              name="numero_clausula"
              label="Cláusulas"
              placeholder="Digite uma cláusula"
              autoComplete="off"
              component={AInput}
            />
          </div>

          <div className="col-4">
            <Field
              name="porcentagem_desconto"
              label="% de Desconto"
              placeholder="Digite uma porcentagem"
              component={AInputNumber}
              min={0}
              formatter={(value: string) => formataValorDecimal(value)}
              parser={(value: string) => parserValorDecimal(value)}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      )}
    </CollapseFiltros>
  );
}
