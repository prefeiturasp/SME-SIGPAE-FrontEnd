import React from "react";
import { Field } from "react-final-form";
import { useSearchParams } from "react-router-dom";

import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import { Select } from "src/components/Shareable/Select";
import { STATUS_RELATORIO_FINANCEIRO } from "../../../constants";

type FieldsProps = {
  lotes: {
    value: string;
    label: string;
  }[];
  gruposUnidadeEscolar: {
    uuid: string;
    nome: string;
  }[];
  mesesAnos: {
    uuid: string;
    nome: string;
  }[];
};

export function FormFields({
  lotes,
  gruposUnidadeEscolar,
  mesesAnos,
}: FieldsProps) {
  const [searchParams] = useSearchParams();
  const uuidRelatorioFinanceiro = searchParams.get("uuid");

  return (
    <div className="row">
      <div className="col-8">
        <Field
          component={MultiSelect}
          name="lote"
          label="Lote e DRE"
          placeholder="Selecione as DREs e lotes"
          nomeDoItemNoPlural="lotes"
          naoDesabilitarPrimeiraOpcao
          options={lotes}
          disabled={uuidRelatorioFinanceiro}
        />
      </div>
      <div className="col-4">
        <Field
          component={MultiSelect}
          name="grupo_unidade_escolar"
          label="Tipo de Unidade"
          placeholder="Selecione os tipos de unidades"
          nomeDoItemNoPlural="grupos de unidades"
          naoDesabilitarPrimeiraOpcao
          options={gruposUnidadeEscolar}
          disabled={uuidRelatorioFinanceiro}
        />
      </div>
      <div className="col-4">
        <Field
          component={Select}
          name="mes_ano"
          label="Mês de Referência"
          naoDesabilitarPrimeiraOpcao
          options={mesesAnos}
          disabled={uuidRelatorioFinanceiro}
        />
      </div>
      <div className="col-4">
        <Field
          component={MultiSelect}
          name="status"
          label="Status"
          placeholder="Selecione os status"
          nomeDoItemNoPlural="status"
          naoDesabilitarPrimeiraOpcao
          options={Object.entries(STATUS_RELATORIO_FINANCEIRO).map(
            ([key, value]) => ({
              value: key,
              label: value,
            }),
          )}
          disabled={uuidRelatorioFinanceiro}
        />
      </div>
    </div>
  );
}
