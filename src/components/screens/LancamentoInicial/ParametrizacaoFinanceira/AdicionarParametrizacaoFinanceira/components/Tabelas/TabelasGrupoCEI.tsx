import React from "react";

import TabelaDietasCEI from "./TabelaDietasCEI";

import { FormApi } from "final-form";
import { TabelaAlimentacaoCEI } from "./TabelaAlimentacaoCEI";

type Props = {
  form: FormApi<any, any>;
  faixasEtarias: Array<any>;
  grupoSelecionado: string | null;
};

export default ({ form, faixasEtarias, grupoSelecionado }: Props) => {
  return (
    <div className="container-tabelas">
      <TabelaAlimentacaoCEI
        form={form}
        faixasEtarias={faixasEtarias}
        grupoSelecionado={grupoSelecionado}
        periodo="Integral"
      />
      <TabelaAlimentacaoCEI
        form={form}
        faixasEtarias={faixasEtarias}
        grupoSelecionado={grupoSelecionado}
        periodo="Parcial"
      />
      <TabelaDietasCEI
        form={form}
        faixasEtarias={faixasEtarias}
        grupoSelecionado={grupoSelecionado}
        nomeTabela="Dietas Tipo A e Tipo A Enteral/Restrição de Aminoácidos"
        periodo="Integral"
      />
      <TabelaDietasCEI
        form={form}
        faixasEtarias={faixasEtarias}
        grupoSelecionado={grupoSelecionado}
        nomeTabela="Dietas Tipo A e Tipo A Enteral/Restrição de Aminoácidos"
        periodo="Parcial"
      />
      <TabelaDietasCEI
        form={form}
        faixasEtarias={faixasEtarias}
        grupoSelecionado={grupoSelecionado}
        nomeTabela="Dietas Tipo B"
        periodo="Integral"
      />
      <TabelaDietasCEI
        form={form}
        faixasEtarias={faixasEtarias}
        grupoSelecionado={grupoSelecionado}
        nomeTabela="Dietas Tipo B"
        periodo="Parcial"
      />
    </div>
  );
};
