import { TabelaAlimentacaoCEI } from "./TabelaAlimentacaoCEI";
import { TabelaDietasCEI } from "./TabelaDietasCEI";
import { ConsolidadoTotal } from "../ConsolidadoTotal";
import { useEffect, useRef, useState } from "react";
import { TabelaAlimentacaoCEIHandle, TabelaDietasCEIHandle } from "../../types";
import { FaixaEtaria } from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { RelatorioFinanceiroConsolidado } from "src/interfaces/relatorio_financeiro.interface";

type Props = {
  relatorioConsolidado: RelatorioFinanceiroConsolidado;
  faixasEtarias: Array<FaixaEtaria>;
  totaisConsumo: any;
};

export default ({
  relatorioConsolidado,
  faixasEtarias,
  totaisConsumo,
}: Props) => {
  const [consolidado, setConsolidado] = useState({
    quantidade: 0,
    valor: 0,
  });

  const refAlimentacao = useRef<TabelaAlimentacaoCEIHandle>(null);
  const refDietaA = useRef<TabelaDietasCEIHandle>(null);
  const refDietaB = useRef<TabelaDietasCEIHandle>(null);

  useEffect(() => {
    const alimentacao = refAlimentacao.current?.getTotais();
    const dietaA = refDietaA.current?.getTotais();
    const dietaB = refDietaB.current?.getTotais();

    setConsolidado({
      quantidade:
        (alimentacao?.totalAtendimentosGeral ?? 0) +
        (dietaA?.totalConsumoGeral ?? 0) +
        (dietaB?.totalConsumoGeral ?? 0),

      valor:
        (alimentacao?.valorTotalGeral ?? 0) +
        (dietaA?.valorTotalGeral ?? 0) +
        (dietaB?.valorTotalGeral ?? 0),
    });
  }, [relatorioConsolidado, faixasEtarias, totaisConsumo]);

  return (
    <div className="d-flex flex-column gap-4">
      <TabelaAlimentacaoCEI
        ref={refAlimentacao}
        tabelas={relatorioConsolidado.tabelas}
        faixasEtarias={faixasEtarias}
        totaisConsumo={totaisConsumo}
        ordem="A"
      />
      <TabelaDietasCEI
        ref={refDietaA}
        tabelas={relatorioConsolidado.tabelas}
        tipoDieta="TIPO A"
        faixasEtarias={faixasEtarias}
        totaisConsumo={totaisConsumo}
        ordem="B"
      />
      <TabelaDietasCEI
        ref={refDietaB}
        tabelas={relatorioConsolidado.tabelas}
        tipoDieta="TIPO B"
        faixasEtarias={faixasEtarias}
        totaisConsumo={totaisConsumo}
        ordem="C"
      />
      <ConsolidadoTotal
        titulo="CONSOLIDADO TOTAL (A + B + C)"
        quantidade={consolidado.quantidade}
        valor={consolidado.valor}
      />
    </div>
  );
};
