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
    <div className="container-tabelas">
      <TabelaAlimentacao
        grupoSelecionado={grupoSelecionado}
        tiposAlimentacao={tiposAlimentacao}
        tipoTurma="EMEBS Fundamental"
      />
      <TabelaAlimentacao
        grupoSelecionado={grupoSelecionado}
        tiposAlimentacao={tiposAlimentacao}
        tipoTurma="EMEBS Infantil"
      />

      <TabelaDietaTipoA
        form={form}
        tiposAlimentacao={tiposAlimentacao}
        grupoSelecionado={grupoSelecionado}
        nomeTabela="Dietas Tipo A e Tipo A Enteral/Restrição de Aminoácidos"
        tipoTurma="EMEBS Fundamental"
      />
      <TabelaDietaTipoB
        form={form}
        tiposAlimentacao={tiposAlimentacao}
        grupoSelecionado={grupoSelecionado}
        tipoTurma="EMEBS Fundamental"
      />

      <TabelaDietaTipoA
        form={form}
        tiposAlimentacao={tiposAlimentacao}
        grupoSelecionado={grupoSelecionado}
        nomeTabela="Dietas Tipo A e Tipo A Enteral/Restrição de Aminoácidos"
        tipoTurma="EMEBS Infantil"
      />
      <TabelaDietaTipoB
        form={form}
        tiposAlimentacao={tiposAlimentacao}
        grupoSelecionado={grupoSelecionado}
        tipoTurma="EMEBS Infantil"
      />
    </div>
  );
};
