import { FormApi } from "final-form";
import TabelaAlimentacao from "./TabelaAlimentacao";
import TabelaDietaTipoA from "./TabelaDietaTipoA";
import TabelaDietaTipoB from "./TabelaDietaTipoB";

type Props = {
  form: FormApi<any, any>;
  tiposAlimentacao: Array<any>;
  grupoSelecionado: string;
};

export default ({ form, tiposAlimentacao, grupoSelecionado }: Props) => {
  return (
    <div className="container-tabelas">
      <div>
        <TabelaAlimentacao
          form={form}
          tiposAlimentacao={tiposAlimentacao}
          grupoSelecionado={grupoSelecionado}
          pendencias={[
            "Preço das Dietas Tipo A e Tipo A Enteral/Restrição de Aminoácidos",
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
