import { TabelaAlimentacaoCEI } from "./TabelaAlimentacaoCEI";
import {
  FaixaEtaria,
  TipoAlimentacao,
} from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { RelatorioFinanceiroConsolidado } from "src/interfaces/relatorio_financeiro.interface";
import { TabelaAlimentacao } from "./TabelaAlimentacao";

type Props = {
  relatorioConsolidado: RelatorioFinanceiroConsolidado;
  faixasEtarias: Array<FaixaEtaria>;
  tiposAlimentacao: Array<TipoAlimentacao>;
  totaisConsumo: any;
};

export default ({
  relatorioConsolidado,
  faixasEtarias,
  tiposAlimentacao,
  totaisConsumo,
}: Props) => {
  const _TOTAIS_CONSUMO_POR_FAIXA_ETARIA = totaisConsumo["FAIXA"] || {};
  const _TOTAIS_CONSUMO_POR_ALIMENTACAO = totaisConsumo["TIPO"] || {};

  return (
    <div className="d-flex flex-column gap-4">
      <TabelaAlimentacaoCEI
        tabelas={relatorioConsolidado.tabelas}
        faixasEtarias={faixasEtarias}
        totaisConsumo={_TOTAIS_CONSUMO_POR_FAIXA_ETARIA}
        ordem="A"
      />
      <TabelaAlimentacao
        tabelas={relatorioConsolidado.tabelas}
        tiposAlimentacao={tiposAlimentacao}
        totaisConsumo={_TOTAIS_CONSUMO_POR_ALIMENTACAO}
        ordem="A"
        unidade="CEMEI"
      />
    </div>
  );
};
