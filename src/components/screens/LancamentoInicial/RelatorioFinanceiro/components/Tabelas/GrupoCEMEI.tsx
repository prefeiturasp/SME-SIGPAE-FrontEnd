import React, { useMemo, useRef } from "react";
import { TabelaAlimentacaoCEI } from "./TabelaAlimentacaoCEI";
import {
  FaixaEtaria,
  TipoAlimentacao,
} from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { RelatorioFinanceiroConsolidado } from "src/interfaces/relatorio_financeiro.interface";
import { TabelaAlimentacao } from "./TabelaAlimentacao";
import { TabelaDietasCEI } from "./TabelaDietasCEI";
import { TabelaDietas } from "./TabelaDietas";
import { ConsolidadoTotal } from "../ConsolidadoTotal";
import { TabelaAlimentacaoHandle, TabelaDietasHandle } from "../../types";

type Props = {
  relatorioConsolidado: RelatorioFinanceiroConsolidado;
  faixasEtarias: Array<FaixaEtaria>;
  tiposAlimentacao: Array<TipoAlimentacao>;
  totaisConsumo: any;
};

export default function RelatorioFinanceiro({
  relatorioConsolidado,
  faixasEtarias,
  tiposAlimentacao,
  totaisConsumo,
}: Props) {
  const refAlimentacaoEMEI = useRef<TabelaAlimentacaoHandle>(null);
  const refDietaAEMEI = useRef<TabelaDietasHandle>(null);
  const refDietaBEMEI = useRef<TabelaDietasHandle>(null);

  const refAlimentacaoCEI = useRef<TabelaAlimentacaoHandle>(null);
  const refDietaACEI = useRef<TabelaDietasHandle>(null);
  const refDietaBCEI = useRef<TabelaDietasHandle>(null);

  const _TIPOS_ALIMENTACAO = useMemo(() => {
    return [...tiposAlimentacao, { uuid: "Kit Lanche", nome: "Kit Lanche" }];
  }, [tiposAlimentacao]);

  const _TOTAIS_CONSUMO_POR_FAIXA_ETARIA = useMemo(() => {
    return totaisConsumo?.["FAIXA"] || {};
  }, [totaisConsumo]);

  const _TOTAIS_CONSUMO_POR_ALIMENTACAO = useMemo(() => {
    return totaisConsumo?.["TIPO"] || {};
  }, [totaisConsumo]);

  const calcularConsolidado = (
    refAlimentacao: React.RefObject<TabelaAlimentacaoHandle>,
    refDietaA: React.RefObject<TabelaDietasHandle>,
    refDietaB: React.RefObject<TabelaDietasHandle>,
  ) => {
    const alimentacao = refAlimentacao.current?.getTotais();
    const dietaA = refDietaA.current?.getTotais();
    const dietaB = refDietaB.current?.getTotais();

    return {
      quantidade:
        (alimentacao?.totalAtendimentosGeral ?? 0) +
        (dietaA?.totalConsumoGeral ?? 0) +
        (dietaB?.totalConsumoGeral ?? 0),

      valor:
        (alimentacao?.valorTotalGeral ?? 0) +
        (dietaA?.valorTotalGeral ?? 0) +
        (dietaB?.valorTotalGeral ?? 0),
    };
  };

  const consolidadoCEI = useMemo(() => {
    return calcularConsolidado(refAlimentacaoCEI, refDietaACEI, refDietaBCEI);
  }, [relatorioConsolidado, faixasEtarias, totaisConsumo]);

  const consolidadoEMEI = useMemo(() => {
    return calcularConsolidado(
      refAlimentacaoEMEI,
      refDietaAEMEI,
      refDietaBEMEI,
    );
  }, [relatorioConsolidado, tiposAlimentacao, totaisConsumo]);

  const cards = useMemo(() => {
    return [
      {
        titulo: "CONSOLIDADO CEI (A + B + C)",
        quantidade: consolidadoCEI.quantidade,
        valor: consolidadoCEI.valor,
      },
      {
        titulo: "CONSOLIDADO INFANTIL - EMEI (INF. A + INF. B + INF. C)",
        quantidade: consolidadoEMEI.quantidade,
        valor: consolidadoEMEI.valor,
      },
      {
        titulo: "CONSOLIDADO TOTAL (A + B + C + INF. A + INF. B + INF. C)",
        quantidade: consolidadoEMEI.quantidade + consolidadoCEI.quantidade,
        valor: consolidadoEMEI.valor + consolidadoCEI.valor,
      },
    ];
  }, [consolidadoCEI, consolidadoEMEI]);

  return (
    <div>
      <div className="d-flex flex-column gap-4">
        <TabelaAlimentacaoCEI
          ref={refAlimentacaoCEI}
          tabelas={relatorioConsolidado.tabelas}
          faixasEtarias={faixasEtarias}
          totaisConsumo={_TOTAIS_CONSUMO_POR_FAIXA_ETARIA}
          ordem="A"
        />

        <TabelaDietasCEI
          ref={refDietaACEI}
          tabelas={relatorioConsolidado.tabelas}
          tipoDieta="TIPO A"
          faixasEtarias={faixasEtarias}
          totaisConsumo={_TOTAIS_CONSUMO_POR_FAIXA_ETARIA}
          ordem="B"
        />

        <TabelaDietasCEI
          ref={refDietaBCEI}
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
          ref={refAlimentacaoEMEI}
          tabelas={relatorioConsolidado.tabelas}
          tiposAlimentacao={_TIPOS_ALIMENTACAO}
          totaisConsumo={_TOTAIS_CONSUMO_POR_ALIMENTACAO}
          ordem="INF. A"
          unidade="CEMEI"
        />

        <TabelaDietas
          ref={refDietaAEMEI}
          tabelas={relatorioConsolidado.tabelas}
          tipoDieta="TIPO A"
          tiposAlimentacao={tiposAlimentacao}
          totaisConsumo={_TOTAIS_CONSUMO_POR_ALIMENTACAO}
          ordem="INF. B"
          unidade="CEMEI"
        />

        <TabelaDietas
          ref={refDietaBEMEI}
          tabelas={relatorioConsolidado.tabelas}
          tipoDieta="TIPO B"
          tiposAlimentacao={tiposAlimentacao}
          totaisConsumo={_TOTAIS_CONSUMO_POR_ALIMENTACAO}
          ordem="INF. C"
          unidade="CEMEI"
        />
      </div>

      {cards.map((card, index) => (
        <div className="mt-4" key={index}>
          <ConsolidadoTotal
            titulo={card.titulo}
            quantidade={card.quantidade}
            valor={card.valor}
          />
        </div>
      ))}
    </div>
  );
}
