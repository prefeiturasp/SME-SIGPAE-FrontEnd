import { useEffect, useRef, useState } from "react";
import { TabelaAlimentacao } from "./TabelaAlimentacao";
import { TipoAlimentacao } from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { RelatorioFinanceiroConsolidado } from "src/interfaces/relatorio_financeiro.interface";
import { ConsolidadoTotal } from "../ConsolidadoTotal";
import { TabelaAlimentacaoHandle } from "../../types";

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

  const _TIPOS_COM_KIT_LANCHE = [
    ...tiposAlimentacao,
    { uuid: "Kit Lanche", nome: "Kit Lanche" },
  ];

  useEffect(() => {
    const alimentacao = refAlimentacao.current?.getTotais();

    setConsolidado({
      quantidade: alimentacao?.totalAtendimentosGeral ?? 0,
      valor: alimentacao?.valorTotalGeral ?? 0,
    });
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
      <ConsolidadoTotal
        titulo="CONSOLIDADO TOTAL (A + B + C)"
        quantidade={consolidado.quantidade}
        valor={consolidado.valor}
      />
    </div>
  );
};
