import { DadosMedicaoFinal } from "src/interfaces/relatorio_financeiro.interface";

type Props = {
  dados: DadosMedicaoFinal | null;
};

const valorOuTraco = (valor?: string | null) => valor || "-";

const Item = ({
  rotulo,
  valor,
  colunas = "col-6",
}: {
  rotulo: string;
  valor: string;
  colunas?: string;
}) => (
  <div className={`${colunas} celula`}>
    <span className="rotulo">{rotulo}</span> <span>{valor}</span>
  </div>
);

export const DadosMedicaoFinalLeitura = ({ dados }: Props) => {
  const periodo =
    dados?.periodo_inicio || dados?.periodo_fim
      ? `${valorOuTraco(dados.periodo_inicio)} a ${valorOuTraco(dados.periodo_fim)}`
      : "-";
  const loteDre = [dados?.lote, dados?.dre].filter(Boolean).join(" - ") || "-";

  return (
    <div className="dados-medicao-final" data-testid="dados-medicao-final">
      <div className="row g-0">
        <Item
          colunas="col-12"
          rotulo="Empresa Contratada:"
          valor={valorOuTraco(dados?.empresa_contratada)}
        />
      </div>
      <div className="row g-0">
        <Item rotulo="Período de Realização do Serviço:" valor={periodo} />
        <Item rotulo="Lote/DRE:" valor={loteDre} />
      </div>
      <div className="row g-0">
        <Item rotulo="Tipo de UE:" valor={valorOuTraco(dados?.tipos_unidade)} />
        <Item
          rotulo="Nº do contrato:"
          valor={valorOuTraco(dados?.numero_contrato)}
        />
      </div>
      <div className="row g-0">
        <Item
          colunas="col-12"
          rotulo="Nº do processo administrativo:"
          valor={valorOuTraco(dados?.numero_processo_administrativo)}
        />
      </div>
    </div>
  );
};
