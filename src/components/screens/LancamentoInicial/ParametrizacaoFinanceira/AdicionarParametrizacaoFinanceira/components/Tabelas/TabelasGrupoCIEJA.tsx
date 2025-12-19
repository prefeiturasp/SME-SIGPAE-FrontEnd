import { FormApi } from "final-form";
import { TipoAlimentacao } from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import TabelaAlimentacao from "./TabelaAlimentacao";
import TabelaDietaTipoA from "./TabelaDietaTipoA";
import TabelaDietaTipoB from "./TabelaDietaTipoB";

type Props = {
  form: FormApi<any, any>;
  tiposAlimentacao: Array<any>;
  grupoSelecionado: string;
};

export default ({ form, tiposAlimentacao, grupoSelecionado }: Props) => {
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
          tiposAlimentacao={_TIPOS_ALIMENTACAO}
          grupoSelecionado={grupoSelecionado}
          pendencias={[
            "Dietas Tipo A e Tipo A Enteral/Restrição de Aminoácidos",
            "Dietas Tipo B",
          ]}
        />
      </div>
      <div>
        <TabelaDietaTipoA
          form={form}
          tiposAlimentacao={tiposAlimentacao}
          grupoSelecionado={grupoSelecionado}
        />
        <TabelaDietaTipoB
          form={form}
          tiposAlimentacao={tiposAlimentacao}
          grupoSelecionado={grupoSelecionado}
        />
      </div>
    </div>
  );
};
