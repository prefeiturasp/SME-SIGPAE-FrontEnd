import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConsolidadoTotal } from "../ConsolidadoTotal";
import { TabelaAlimentacaoHandle, TabelaDietasHandle } from "../../types";
import { TabelaAlimentacao } from "./TabelaAlimentacao";
import { TipoAlimentacao } from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { RelatorioFinanceiroConsolidado } from "src/interfaces/relatorio_financeiro.interface";
import { TabelaDietas } from "./TabelaDietas";

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
  const [consolidadoInfantil, setConsolidadoCEI] = useState({
    quantidade: 0,
    valor: 0,
  });

  const [consolidadoFundamental, setConsolidadoEMEI] = useState({
    quantidade: 0,
    valor: 0,
  });

  const refAlimentacaoInfantil = useRef<TabelaAlimentacaoHandle>(null);
  const refDietaAFundamental = useRef<TabelaDietasHandle>(null);
  const refDietaBFundamental = useRef<TabelaDietasHandle>(null);

  const refAlimentacaoFundamental = useRef<TabelaAlimentacaoHandle>(null);
  const refDietaAInfantil = useRef<TabelaDietasHandle>(null);
  const refDietaBInfantil = useRef<TabelaDietasHandle>(null);

  const _TIPOS_ALIMENTACAO = [
    ...tiposAlimentacao,
    { uuid: "Kit Lanche", nome: "Kit Lanche" },
  ];

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

  useEffect(() => {
    const cei = calcularConsolidado(
      refAlimentacaoFundamental,

      refDietaAFundamental,
      refDietaBFundamental,
    );

    const fundamental = calcularConsolidado(
      refAlimentacaoInfantil,
      refDietaAInfantil,
      refDietaBInfantil,
    );

    setConsolidadoCEI(cei);
    setConsolidadoEMEI(fundamental);
  }, []);

  const cards = useMemo(() => {
    return [
      {
        titulo: "CONSOLIDADO INFANTIL (INF. A + INF. B + INF. C)",
        quantidade: consolidadoInfantil.quantidade,
        tituloQuantidade: "QUANTIDADE SERVIDA (INF. A + INF. B + INF. C):",
        valor: consolidadoInfantil.valor,
        tituloValor: "VALOR DO FATURAMENTO TOTAL (INF. A + INF. B + INF. C):",
      },
      {
        titulo: "CONSOLIDADO FUNDAMENTAL (FUND. A + FUND. B + FUND. C)",
        quantidade: consolidadoFundamental.quantidade,
        tituloQuantidade: "QUANTIDADE SERVIDA (FUND. A + FUND. B + FUND. C):",
        valor: consolidadoFundamental.valor,
        tituloValor:
          "VALOR DO FATURAMENTO TOTAL (FUND. A + FUND. B + FUND. C):",
      },
      {
        titulo:
          "CONSOLIDADO TOTAL (INF. A + INF. B + INF. C + FUND. A + FUND. B + FUND. C)",
        quantidade:
          consolidadoFundamental.quantidade + consolidadoInfantil.quantidade,
        tituloQuantidade: "QUANTIDADE SERVIDA:",
        valor: consolidadoFundamental.valor + consolidadoInfantil.valor,
        tituloValor: "VALOR DO FATURAMENTO TOTAL:",
      },
    ];
  }, [consolidadoInfantil, consolidadoFundamental]);

  return (
    <div>
      <h2 className="titulo-relatorio-financeiro">
        Alimentações TURMA INFANTIL da EMEBS
      </h2>
      <div className="d-flex flex-column gap-4">
        <TabelaAlimentacao
          ref={refAlimentacaoInfantil}
          tabelas={relatorioConsolidado.tabelas}
          tiposAlimentacao={_TIPOS_ALIMENTACAO}
          totaisConsumo={totaisConsumo["INFANTIL"]}
          ordem="INF. A"
          unidade="EMEBS Infantil"
        />
        <TabelaDietas
          ref={refDietaAInfantil}
          tabelas={relatorioConsolidado.tabelas}
          tipoDieta="TIPO A"
          tiposAlimentacao={tiposAlimentacao}
          totaisConsumo={totaisConsumo["INFANTIL"]}
          ordem="INF. B"
        />
        <TabelaDietas
          ref={refDietaBInfantil}
          tabelas={relatorioConsolidado.tabelas}
          tipoDieta="TIPO B"
          tiposAlimentacao={tiposAlimentacao}
          totaisConsumo={totaisConsumo["INFANTIL"]}
          ordem="INF. C"
        />
      </div>

      <h2 className="titulo-relatorio-financeiro">
        Alimentações TURMA FUNDAMENTAL da EMEBS
      </h2>
      <div className="d-flex flex-column gap-4">
        <TabelaAlimentacao
          ref={refAlimentacaoFundamental}
          tabelas={relatorioConsolidado.tabelas}
          tiposAlimentacao={_TIPOS_ALIMENTACAO}
          totaisConsumo={totaisConsumo["FUNDAMENTAL"]}
          ordem="FUND. A"
          unidade="EMEBS Fundamental"
        />
        <TabelaDietas
          ref={refDietaAFundamental}
          tabelas={relatorioConsolidado.tabelas}
          tipoDieta="TIPO A"
          tiposAlimentacao={tiposAlimentacao}
          totaisConsumo={totaisConsumo["FUNDAMENTAL"]}
          ordem="FUND. B"
        />
        <TabelaDietas
          ref={refDietaBFundamental}
          tabelas={relatorioConsolidado.tabelas}
          tipoDieta="TIPO B"
          tiposAlimentacao={tiposAlimentacao}
          totaisConsumo={totaisConsumo["FUNDAMENTAL"]}
          ordem="FUND. C"
        />
      </div>

      {cards.map((card, index) => (
        <div className="mt-4" key={index}>
          <ConsolidadoTotal
            titulo={card.titulo}
            quantidade={card.quantidade}
            tituloQuantidade={card.tituloQuantidade}
            valor={card.valor}
            tituloValor={card.tituloValor}
          />
        </div>
      ))}
    </div>
  );
};
