import { TabelaAlimentacao } from "./TabelaAlimentacao";
import { TipoAlimentacao } from "src/services/medicaoInicial/parametrizacao_financeira.interface";

type Props = {
  relatorioConsolidado: any;
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
    </div>
  );
};
