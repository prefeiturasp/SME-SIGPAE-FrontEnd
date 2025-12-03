import TabelaAlimentacao from "./TabelaAlimentacao";
import TabelaDietaTipoA from "./TabelaDietaTipoA";
import TabelaDietaTipoB from "./TabelaDietaTipoB";
import TabelaDietasCEI from "./TabelaDietasCEI";
import { FormApi } from "final-form";
import { TipoAlimentacao } from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { TabelaAlimentacaoCEI } from "./TabelaAlimentacaoCEI";

type Props = {
  form: FormApi<any, any>;
  faixasEtarias: Array<any>;
  tiposAlimentacao: Array<any>;
  grupoSelecionado: string;
};

export default ({
  form,
  faixasEtarias,
  tiposAlimentacao,
  grupoSelecionado,
}: Props) => {
  const TABELA_TIPO_A_CEI =
    "Dietas Tipo A e Tipo A Enteral/Restrição de Aminoácidos";
  const TABELA_TIPO_B_CEI = "Dietas Tipo B";
  const GRUPO_TABELAS_CEI = [TABELA_TIPO_A_CEI, TABELA_TIPO_B_CEI];

  const TABELA_TIPO_A_EMEI =
    "Dietas Tipo A e Tipo A Enteral - Turmas Infantil - EMEI";
  const TABELA_TIP_B_EMEI = "Dietas Tipo B - Turmas Infantil - EMEI";
  const GRUPO_TABELAS_EMEI = [TABELA_TIPO_A_EMEI, TABELA_TIP_B_EMEI];

  const _TIPOS_ALIMENTACAO = tiposAlimentacao.includes(
    (e: TipoAlimentacao) => e.nome === "Kit Lanche",
  )
    ? tiposAlimentacao
    : [...tiposAlimentacao, { uuid: "Kit Lanche", nome: "Kit Lanche" }];

  return (
    <div className="container-tabelas">
      <div>
        <TabelaAlimentacaoCEI
          form={form}
          faixasEtarias={faixasEtarias}
          grupoSelecionado={grupoSelecionado}
          periodo="Integral"
          pendencias={GRUPO_TABELAS_CEI}
        />
        <TabelaDietasCEI
          form={form}
          faixasEtarias={faixasEtarias}
          nomeTabela={TABELA_TIPO_A_CEI}
          periodo="Integral"
          grupoSelecionado={grupoSelecionado}
        />
        <TabelaDietasCEI
          form={form}
          faixasEtarias={faixasEtarias}
          grupoSelecionado={grupoSelecionado}
          nomeTabela={TABELA_TIPO_B_CEI}
          periodo="Integral"
        />
      </div>
      <div>
        <TabelaAlimentacaoCEI
          form={form}
          faixasEtarias={faixasEtarias}
          grupoSelecionado={grupoSelecionado}
          periodo="Parcial"
          pendencias={GRUPO_TABELAS_CEI}
        />
        <TabelaDietasCEI
          form={form}
          faixasEtarias={faixasEtarias}
          grupoSelecionado={grupoSelecionado}
          nomeTabela={TABELA_TIPO_A_CEI}
          periodo="Parcial"
        />
        <TabelaDietasCEI
          form={form}
          faixasEtarias={faixasEtarias}
          grupoSelecionado={grupoSelecionado}
          nomeTabela={TABELA_TIPO_B_CEI}
          periodo="Parcial"
        />
      </div>
      <div>
        <TabelaAlimentacao
          form={form}
          tiposAlimentacao={_TIPOS_ALIMENTACAO}
          grupoSelecionado={grupoSelecionado}
          tipoTurma="Turmas Infantil - EMEI"
          pendencias={GRUPO_TABELAS_EMEI}
        />
      </div>
      <div>
        <TabelaDietaTipoA
          form={form}
          tiposAlimentacao={tiposAlimentacao}
          grupoSelecionado={grupoSelecionado}
          tipoTurma="Turmas Infantil - EMEI"
        />
        <TabelaDietaTipoB
          form={form}
          tiposAlimentacao={tiposAlimentacao}
          grupoSelecionado={grupoSelecionado}
          tipoTurma="Turmas Infantil - EMEI"
        />
      </div>
    </div>
  );
};
