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
    <div className="d-flex flex-column gap-4">
      <TabelaAlimentacaoCEI
        tabelas={relatorioConsolidado.tabelas}
        faixasEtarias={faixasEtarias}
        totaisConsumo={totaisConsumo}
        ordem="A"
      />
      <TabelaDietasCEI
        tabelas={relatorioConsolidado.tabelas}
        tipoDieta="TIPO A"
        faixasEtarias={faixasEtarias}
        totaisConsumo={totaisConsumo}
        ordem="B"
      />
      <TabelaDietasCEI
        tabelas={relatorioConsolidado.tabelas}
        tipoDieta="TIPO B"
        faixasEtarias={faixasEtarias}
        totaisConsumo={totaisConsumo}
        ordem="C"
      />
    </div>
  );
};
