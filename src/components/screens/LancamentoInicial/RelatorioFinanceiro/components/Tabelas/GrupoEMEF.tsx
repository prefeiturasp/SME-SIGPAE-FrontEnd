import { TabelaAlimentacao } from "./TabelaAlimentacao";
import { TipoAlimentacao } from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { RelatorioFinanceiroConsolidado } from "src/interfaces/relatorio_financeiro.interface";
import { normalizar } from "src/components/screens/LancamentoInicial/ParametrizacaoFinanceira/AdicionarParametrizacaoFinanceira/helpers";

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
  const REFEICAO = tiposAlimentacao.find((e: TipoAlimentacao) =>
    normalizar(e.nome),
  );
  const _TIPOS_SEM_REFEICAO = tiposAlimentacao.filter(
    (e: TipoAlimentacao) => normalizar(e.nome) !== normalizar("Refeição"),
  );

  const _TIPOS_ALIMENTACAO = [
    {
      uuid: REFEICAO.uuid,
      nome: "Refeição",
    },
    {
      uuid: REFEICAO.uuid,
      nome: "Refeição - EJA",
    },
    ..._TIPOS_SEM_REFEICAO,
    { uuid: "Kit Lanche", nome: "Kit Lanche" },
  ];

  return (
    <div className="d-flex flex-column gap-4">
      <TabelaAlimentacao
        tabelas={relatorioConsolidado.tabelas}
        tiposAlimentacao={_TIPOS_ALIMENTACAO}
        totaisConsumo={totaisConsumo}
        ordem="A"
      />
    </div>
  );
};
