import { FormApi } from "final-form";
import { TipoAlimentacao } from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import TabelaAlimentacao from "./TabelaAlimentacao";
import TabelaDietaTipoA from "./TabelaDietaTipoA";
import TabelaDietaTipoB from "./TabelaDietaTipoB";
import { normalizar } from "../../helpers";

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
  const REFEICAO = tiposAlimentacao.find((e: TipoAlimentacao) =>
    normalizar(e.nome),
  );
  const _TIPOS_SEM_REFEICAO = tiposAlimentacao.filter(
    (e: TipoAlimentacao) => normalizar(e.nome) !== normalizar("Refeição"),
  );

  const _TIPOS_ALIMENTACAO = [
    {
      uuid: REFEICAO.uuid,
      nome: "Refeição - CEU EMEF, CEU GESTÃO, EMEF, EMEFM",
    },
    {
      uuid: REFEICAO.uuid,
      nome: "Refeição - EJA",
    },
    ..._TIPOS_SEM_REFEICAO,
    { uuid: "Kit Lanche", nome: "Kit Lanche" },
  ];

  return (
    <div className="container-tabelas">
      <div>
        <TabelaAlimentacao
          form={form}
          tiposAlimentacao={_TIPOS_ALIMENTACAO}
          grupoSelecionado={grupoSelecionado}
          pendencias={[
            "Dietas Tipo A e Tipo A Enteral/Restrição de Aminoácidos",
            "Dietas Tipo B",
          ]}
          bloqueiaEdicao={bloqueiaEdicao}
        />
      </div>
      <div>
        <TabelaDietaTipoA
          form={form}
          tiposAlimentacao={tiposAlimentacao}
          grupoSelecionado={grupoSelecionado}
          bloqueiaEdicao={bloqueiaEdicao}
        />
        <TabelaDietaTipoB
          form={form}
          tiposAlimentacao={tiposAlimentacao}
          grupoSelecionado={grupoSelecionado}
          bloqueiaEdicao={bloqueiaEdicao}
        />
      </div>
    </div>
  );
};
