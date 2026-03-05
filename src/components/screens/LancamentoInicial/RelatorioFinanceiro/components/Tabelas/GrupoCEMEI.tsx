import { TabelaAlimentacaoCEI } from "./TabelaAlimentacaoCEI";
import {
  FaixaEtaria,
  TipoAlimentacao,
} from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { RelatorioFinanceiroConsolidado } from "src/interfaces/relatorio_financeiro.interface";
import { TabelaAlimentacao } from "./TabelaAlimentacao";
import { TabelaDietasCEI } from "./TabelaDietasCEI";
import { TabelaDietas } from "./TabelaDietas";

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
  const _TIPOS_ALIMENTACAO = [
    ...tiposAlimentacao,
    { uuid: "Kit Lanche", nome: "Kit Lanche" },
  ];

  const _TOTAIS_CONSUMO_POR_FAIXA_ETARIA = totaisConsumo["FAIXA"] || {};
  const _TOTAIS_CONSUMO_POR_ALIMENTACAO = totaisConsumo["TIPO"] || {};

  return (
    <div>
      <div className="d-flex flex-column gap-4">
        <TabelaAlimentacaoCEI
          tabelas={relatorioConsolidado.tabelas}
          faixasEtarias={faixasEtarias}
          totaisConsumo={_TOTAIS_CONSUMO_POR_FAIXA_ETARIA}
          ordem="A"
        />
        <TabelaDietasCEI
          tabelas={relatorioConsolidado.tabelas}
          tipoDieta="TIPO A"
          faixasEtarias={faixasEtarias}
          totaisConsumo={_TOTAIS_CONSUMO_POR_FAIXA_ETARIA}
          ordem="B"
        />
        <TabelaDietasCEI
          tabelas={relatorioConsolidado.tabelas}
          tipoDieta="TIPO B"
          faixasEtarias={faixasEtarias}
          totaisConsumo={_TOTAIS_CONSUMO_POR_FAIXA_ETARIA}
          ordem="C"
        />
      </div>
      <h2 className="titulo-relatorio-financeiro">
        Alimentações TURMA INFANTIL da CEMEI
      </h2>
      <div className="d-flex flex-column gap-4">
        <TabelaAlimentacao
          tabelas={relatorioConsolidado.tabelas}
          tiposAlimentacao={_TIPOS_ALIMENTACAO}
          totaisConsumo={_TOTAIS_CONSUMO_POR_ALIMENTACAO}
          ordem="A"
          unidade="CEMEI"
        />
        <TabelaDietas
          tabelas={relatorioConsolidado.tabelas}
          tipoDieta="TIPO A"
          tiposAlimentacao={tiposAlimentacao}
          totaisConsumo={_TOTAIS_CONSUMO_POR_ALIMENTACAO}
          ordem="B"
          unidade="CEMEI"
        />
        <TabelaDietas
          tabelas={relatorioConsolidado.tabelas}
          tipoDieta="TIPO B"
          tiposAlimentacao={tiposAlimentacao}
          totaisConsumo={_TOTAIS_CONSUMO_POR_ALIMENTACAO}
          ordem="C"
          unidade="CEMEI"
        />
      </div>
    </div>
  );
};
