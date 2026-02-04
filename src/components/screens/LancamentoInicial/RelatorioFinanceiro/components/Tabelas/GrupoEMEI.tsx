import { TabelaAlimentacao } from "./TabelaAlimentacao";
import { TipoAlimentacao } from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { TabelaDietas } from "./TabelaDietas";
import { RelatorioFinanceiroConsolidado } from "src/interfaces/relatorio_financeiro.interface";

type Props = {
  relatorioConsolidado: RelatorioFinanceiroConsolidado;
  tiposAlimentacao: Array<TipoAlimentacao>;
  totaisConsumo: any;
};

export default ({
  relatorioConsolidado,
  tiposAlimentacao,
  totaisConsumo,
}: Props) => {
  return (
    <div className="d-flex flex-column gap-4">
      <TabelaAlimentacao
        tabelas={relatorioConsolidado.tabelas}
        tiposAlimentacao={tiposAlimentacao}
        totaisConsumo={totaisConsumo}
        ordem="A"
      />
      <TabelaDietas
        tabelas={relatorioConsolidado.tabelas}
        tipoDieta="TIPO A"
        tiposAlimentacao={tiposAlimentacao}
        totaisConsumo={totaisConsumo}
        ordem="B"
      />
      <TabelaDietas
        tabelas={relatorioConsolidado.tabelas}
        tipoDieta="TIPO B"
        tiposAlimentacao={tiposAlimentacao}
        totaisConsumo={totaisConsumo}
        ordem="C"
      />
    </div>
  );
};
