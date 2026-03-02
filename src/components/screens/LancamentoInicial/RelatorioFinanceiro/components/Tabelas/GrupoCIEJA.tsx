import { useEffect, useRef, useState } from "react";
import { TabelaAlimentacao } from "./TabelaAlimentacao";
import { TipoAlimentacao } from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { TabelaDietas } from "./TabelaDietas";
import { RelatorioFinanceiroConsolidado } from "src/interfaces/relatorio_financeiro.interface";
import { ConsolidadoTotal } from "../ConsolidadoTotal";
import { TabelaAlimentacaoHandle, TabelaDietasHandle } from "../../types";

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
  const [consolidado, setConsolidado] = useState({
    quantidade: 0,
    valor: 0,
  });

  const refAlimentacao = useRef<TabelaAlimentacaoHandle>(null);
  const refDietaA = useRef<TabelaDietasHandle>(null);
  const refDietaB = useRef<TabelaDietasHandle>(null);

  const _TIPOS_COM_KIT_LANCHE = [
    ...tiposAlimentacao,
    { uuid: "Kit Lanche", nome: "Kit Lanche" },
  ];

  useEffect(() => {
    const alimentacao = refAlimentacao.current?.getTotais();
    const dietaA = refDietaA.current?.getTotais();
    const dietaB = refDietaB.current?.getTotais();
    (+(dietaA?.totalConsumoGeral ?? 0) + (dietaB?.totalConsumoGeral ?? 0),
      setConsolidado({
        quantidade:
          (alimentacao?.totalAtendimentosGeral ?? 0) +
          (dietaA?.totalConsumoGeral ?? 0) +
          (dietaB?.totalConsumoGeral ?? 0),
        valor:
          (alimentacao?.valorTotalGeral ?? 0) +
          (dietaA?.valorTotalGeral ?? 0) +
          (dietaB?.valorTotalGeral ?? 0),
      }));
  }, [relatorioConsolidado, tiposAlimentacao, totaisConsumo]);

  return (
    <div className="d-flex flex-column gap-4">
      <TabelaAlimentacao
        ref={refAlimentacao}
        tabelas={relatorioConsolidado.tabelas}
        tiposAlimentacao={_TIPOS_COM_KIT_LANCHE}
        totaisConsumo={totaisConsumo}
        ordem="A"
        cieja
      />
      <TabelaDietas
        ref={refDietaA}
        tabelas={relatorioConsolidado.tabelas}
        tipoDieta="TIPO A"
        tiposAlimentacao={tiposAlimentacao}
        totaisConsumo={totaisConsumo}
        ordem="B"
        cieja
      />
      <TabelaDietas
        ref={refDietaB}
        tabelas={relatorioConsolidado.tabelas}
        tipoDieta="TIPO B"
        tiposAlimentacao={tiposAlimentacao}
        totaisConsumo={totaisConsumo}
        ordem="C"
        cieja
      />
      <ConsolidadoTotal
        titulo="CONSOLIDADO TOTAL (A + B + C)"
        quantidade={consolidado.quantidade}
        valor={consolidado.valor}
      />
    </div>
  );
};
