import React from "react";

import { FormApi } from "final-form";

import TabelaAlimentacao from "./TabelaAlimentacao";
import TabelaDietaTipoA from "./TabelaDietaTipoA";
import TabelaDietaTipoB from "./TabelaDietaTipoB";

type Props = {
  form: FormApi<any, any>;
  tiposAlimentacao: Array<any>;
  grupoSelecionado: string;
};

export default ({ form, tiposAlimentacao, grupoSelecionado }: Props) => {
  return (
    <div key={grupoSelecionado}>
      <TabelaAlimentacao
        tiposAlimentacao={tiposAlimentacao}
        grupoSelecionado={grupoSelecionado}
      />
      <div className="d-flex gap-4">
        <TabelaDietaTipoA
          form={form}
          tiposAlimentacao={tiposAlimentacao}
          nomeTabela="Dietas Tipo A e Tipo A Enteral"
        />
        <TabelaDietaTipoB form={form} tiposAlimentacao={tiposAlimentacao} />
      </div>
    </div>
  );
};
