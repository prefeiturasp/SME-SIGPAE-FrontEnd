import { useEffect, useMemo, useRef, useState } from "react";
import { TabelaAlimentacao } from "./TabelaAlimentacao";
import { TipoAlimentacao } from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { RelatorioFinanceiroConsolidado } from "src/interfaces/relatorio_financeiro.interface";
import { normalizar } from "src/components/screens/LancamentoInicial/ParametrizacaoFinanceira/AdicionarParametrizacaoFinanceira/helpers";
import { TabelaDietas } from "./TabelaDietas";
import { TabelaAlimentacaoHandle, TabelaDietasHandle } from "../../types";
import { ConsolidadoTotal } from "../ConsolidadoTotal";

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

  const verificaRefeicao = (e: TipoAlimentacao) => {
    return normalizar(e.nome) === "refeicao";
  };

  const REFEICAO = useMemo(
    () => tiposAlimentacao.find((e) => verificaRefeicao(e)),
    [tiposAlimentacao],
  );

  const _TIPOS_SEM_REFEICAO = useMemo(
    () => tiposAlimentacao.filter((e) => !verificaRefeicao(e)),
    [tiposAlimentacao],
  );

  const _TIPOS_ALIMENTACAO = useMemo(() => {
    if (!REFEICAO) return [];

    return [
      {
        uuid: REFEICAO.uuid,
        nome: "Refeição",
      },
      {
        uuid: REFEICAO.uuid,
        nome: "Refeição EJA",
      },
      ..._TIPOS_SEM_REFEICAO,
      { uuid: "Kit Lanche", nome: "Kit Lanche" },
    ];
  }, [REFEICAO, _TIPOS_SEM_REFEICAO]);

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
  }, [relatorioConsolidado, totaisConsumo]);

  return (
    <div className="d-flex flex-column gap-4">
      <TabelaAlimentacao
        ref={refAlimentacao}
        tabelas={relatorioConsolidado.tabelas}
        tiposAlimentacao={_TIPOS_ALIMENTACAO}
        totaisConsumo={totaisConsumo}
        ordem="A"
      />
      <TabelaDietas
        ref={refDietaA}
        tabelas={relatorioConsolidado.tabelas}
        tipoDieta="TIPO A"
        tiposAlimentacao={tiposAlimentacao}
        totaisConsumo={totaisConsumo}
        ordem="B"
        exibeNoturno={true}
      />
      <TabelaDietas
        ref={refDietaB}
        tabelas={relatorioConsolidado.tabelas}
        tipoDieta="TIPO B"
        tiposAlimentacao={tiposAlimentacao}
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
