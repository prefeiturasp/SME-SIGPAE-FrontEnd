import { TabelaAlimentacaoCEI } from "./TabelaAlimentacaoCEI";
import { TabelaDietasCEI } from "./TabelaDietasCEI";

type Props = {
  relatorioConsolidado: any;
  faixasEtarias: Array<any>;
  totaisConsumo: any;
};

export default ({
  relatorioConsolidado,
  faixasEtarias,
  totaisConsumo,
}: Props) => {
  return (
    <div>
      <TabelaAlimentacaoCEI
        tabelas={relatorioConsolidado.tabelas}
        faixasEtarias={faixasEtarias}
        totaisConsumo={totaisConsumo}
      />
      <TabelaDietasCEI
        tabelas={relatorioConsolidado.tabelas}
        tipoDieta="TIPO A"
        faixasEtarias={faixasEtarias}
        totaisConsumo={totaisConsumo}
      />
      <TabelaDietasCEI
        tabelas={relatorioConsolidado.tabelas}
        tipoDieta="TIPO B"
        faixasEtarias={faixasEtarias}
        totaisConsumo={totaisConsumo}
      />
    </div>
  );
};
