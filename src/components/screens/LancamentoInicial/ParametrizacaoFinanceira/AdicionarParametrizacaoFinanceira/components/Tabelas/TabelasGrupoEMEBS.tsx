import TabelaAlimentacao from "./TabelaAlimentacao";
import TabelaDietaTipoA from "./TabelaDietaTipoA";
import TabelaDietaTipoB from "./TabelaDietaTipoB";
import { TipoAlimentacao } from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { FormApi } from "final-form";

type Props = {
  form: FormApi<any, any>;
  tiposAlimentacao: Array<any>;
  grupoSelecionado: string;
  bloqueiaEdicao?: boolean;
};

export default ({
  form,
  tiposAlimentacao,
  grupoSelecionado,
  bloqueiaEdicao,
}: Props) => {
  const GRUPO_TABELAS = [
    "Dietas Tipo A e Tipo A Enteral/Restrição de Aminoácidos - EMEBS",
    "Dietas Tipo B - EMEBS",
  ];
  const GRUPO_TABELAS_INFANTIL = GRUPO_TABELAS.map((e) => `${e} Infantil`);
  const GRUPO_TABELAS_FUNDAMENTAL = GRUPO_TABELAS.map(
    (e) => `${e} Fundamental`,
  );

  const _TIPOS_ALIMENTACAO = tiposAlimentacao.includes(
    (e: TipoAlimentacao) => e.nome === "Kit Lanche",
  )
    ? tiposAlimentacao
    : [...tiposAlimentacao, { uuid: "Kit Lanche", nome: "Kit Lanche" }];

  return (
    <div className="container-tabelas">
      <div>
        <TabelaAlimentacao
          form={form}
          grupoSelecionado={grupoSelecionado}
          tiposAlimentacao={_TIPOS_ALIMENTACAO}
          tipoTurma="EMEBS Fundamental"
          pendencias={GRUPO_TABELAS_FUNDAMENTAL}
          temaTag="turma-emebs-fundamental"
          bloqueiaEdicao={bloqueiaEdicao}
        />
        <TabelaDietaTipoA
          form={form}
          tiposAlimentacao={tiposAlimentacao}
          grupoSelecionado={grupoSelecionado}
          tipoTurma="EMEBS Fundamental"
          temaTag="turma-emebs-fundamental"
          bloqueiaEdicao={bloqueiaEdicao}
        />
        <TabelaDietaTipoB
          form={form}
          tiposAlimentacao={tiposAlimentacao}
          grupoSelecionado={grupoSelecionado}
          tipoTurma="EMEBS Fundamental"
          temaTag="turma-emebs-fundamental"
          bloqueiaEdicao={bloqueiaEdicao}
        />
      </div>

      <div>
        <TabelaAlimentacao
          form={form}
          grupoSelecionado={grupoSelecionado}
          tiposAlimentacao={_TIPOS_ALIMENTACAO}
          tipoTurma="EMEBS Infantil"
          pendencias={GRUPO_TABELAS_INFANTIL}
          temaTag="turma-emebs-infantil"
          bloqueiaEdicao={bloqueiaEdicao}
        />
        <TabelaDietaTipoA
          form={form}
          tiposAlimentacao={tiposAlimentacao}
          grupoSelecionado={grupoSelecionado}
          tipoTurma="EMEBS Infantil"
          temaTag="turma-emebs-infantil"
          bloqueiaEdicao={bloqueiaEdicao}
        />
        <TabelaDietaTipoB
          form={form}
          tiposAlimentacao={tiposAlimentacao}
          grupoSelecionado={grupoSelecionado}
          tipoTurma="EMEBS Infantil"
          temaTag="turma-emebs-infantil"
          bloqueiaEdicao={bloqueiaEdicao}
        />
      </div>
    </div>
  );
};
