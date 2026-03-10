import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConsolidadoTotal } from "../ConsolidadoTotal";
import { TabelaAlimentacaoHandle, TabelaDietasHandle } from "../../types";

export default () => {
  const [consolidadoInfantil, setConsolidadoCEI] = useState({
    quantidade: 0,
    valor: 0,
  });

  const [consolidadoFundamental, setConsolidadoEMEI] = useState({
    quantidade: 0,
    valor: 0,
  });

  const refAlimentacaoEMEI = useRef<TabelaAlimentacaoHandle>(null);
  const refDietaAEMEI = useRef<TabelaDietasHandle>(null);
  const refDietaBEMEI = useRef<TabelaDietasHandle>(null);

  const refAlimentacaoCEI = useRef<TabelaAlimentacaoHandle>(null);
  const refDietaACEI = useRef<TabelaDietasHandle>(null);
  const refDietaBCEI = useRef<TabelaDietasHandle>(null);

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
      refAlimentacaoCEI,
      refDietaACEI,
      refDietaBCEI,
    );

    const emei = calcularConsolidado(
      refAlimentacaoEMEI,
      refDietaAEMEI,
      refDietaBEMEI,
    );

    setConsolidadoCEI(cei);
    setConsolidadoEMEI(emei);
  }, []);

  const cards = useMemo(() => {
    return [
      {
        titulo: "CONSOLIDADO INFANTIL (INF. A + INF. B + INF. C)",
        quantidade: consolidadoInfantil.quantidade,
        valor: consolidadoInfantil.valor,
      },
      {
        titulo: "CONSOLIDADO FUNDAMENTAL (FUND. A + FUND. B + FUND. C)",
        quantidade: consolidadoFundamental.quantidade,
        valor: consolidadoFundamental.valor,
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
