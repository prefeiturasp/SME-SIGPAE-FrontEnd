import React from "react";

import TabelaDietasCEI from "./TabelaDietasCEI";

import { FormApi } from "final-form";
import { TabelaAlimentacaoCEI } from "./TabelaAlimentacaoCEI";

type Props = {
  form: FormApi<any, any>;
  faixasEtarias: Array<any>;
  grupoSelecionado: string | null;
  bloqueiaEdicao?: boolean;
};

export default ({
  form,
  faixasEtarias,
  grupoSelecionado,
  bloqueiaEdicao,
}: Props) => {
  const tabelasPendentes = [
    "Dietas Tipo A e Tipo A Enteral/Restrição de Aminoácidos",
    "Dietas Tipo B",
  ];
  return (
    <div className="container-tabelas">
      <TabelaAlimentacaoCEI
        form={form}
        faixasEtarias={faixasEtarias}
        grupoSelecionado={grupoSelecionado}
        periodo="Integral"
        pendencias={tabelasPendentes}
        bloqueiaEdicao={bloqueiaEdicao}
      />
      <TabelaAlimentacaoCEI
        form={form}
        faixasEtarias={faixasEtarias}
        grupoSelecionado={grupoSelecionado}
        periodo="Parcial"
        pendencias={tabelasPendentes}
        bloqueiaEdicao={bloqueiaEdicao}
      />
      <TabelaDietasCEI
        form={form}
        faixasEtarias={faixasEtarias}
        grupoSelecionado={grupoSelecionado}
        nomeTabela="Dietas Tipo A e Tipo A Enteral/Restrição de Aminoácidos"
        periodo="Integral"
        bloqueiaEdicao={bloqueiaEdicao}
      />
      <TabelaDietasCEI
        form={form}
        faixasEtarias={faixasEtarias}
        grupoSelecionado={grupoSelecionado}
        nomeTabela="Dietas Tipo A e Tipo A Enteral/Restrição de Aminoácidos"
        periodo="Parcial"
        bloqueiaEdicao={bloqueiaEdicao}
      />
      <TabelaDietasCEI
        form={form}
        faixasEtarias={faixasEtarias}
        grupoSelecionado={grupoSelecionado}
        nomeTabela="Dietas Tipo B"
        periodo="Integral"
        bloqueiaEdicao={bloqueiaEdicao}
      />
      <TabelaDietasCEI
        form={form}
        faixasEtarias={faixasEtarias}
        grupoSelecionado={grupoSelecionado}
        nomeTabela="Dietas Tipo B"
        periodo="Parcial"
        bloqueiaEdicao={bloqueiaEdicao}
      />
    </div>
  );
};
