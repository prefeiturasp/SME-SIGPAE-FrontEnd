import React from "react";
import { Field } from "react-final-form";
import { useSearchParams } from "react-router-dom";

import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import { Select } from "src/components/Shareable/Select";

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
          placeholder="Selecione um lote e uma DRE"
          nomeDoItemNoPlural="lotes"
          naoDesabilitarPrimeiraOpcao
          options={lotes}
          disabled={uuidRelatorioFinanceiro}
        />
      </div>

      <div className="col-4">
        <Field
          component={Select}
          name="grupo_unidade_escolar"
          label="Tipo de UE"
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
    </div>
  );
}
