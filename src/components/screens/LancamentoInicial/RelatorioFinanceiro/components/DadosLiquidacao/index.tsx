import "./styles.scss";
import { DadosLiquidacaoEmpenho } from "src/interfaces/relatorio_financeiro.interface";
import { formataMilharDecimal } from "src/helpers/utilities";
import UnidadesPagamento from "../../components/UnidadesPagamento";
import { useState } from "react";

interface Props {
  dados?: DadosLiquidacaoEmpenho[];
}

const DadosLiquidacao = ({ dados = [] }: Props) => {
  const [visualizarUnidades, setVisualizarUnidades] = useState<boolean>(false);
  const [dadoSelecionado, setDadoSelecionado] =
    useState<DadosLiquidacaoEmpenho | null>(null);

  const linhas = dados.length > 0 ? dados : [{} as DadosLiquidacaoEmpenho];

  const onVisualizarUnidades = (item: DadosLiquidacaoEmpenho) => {
    setDadoSelecionado(item);
    setVisualizarUnidades(true);
  };

  return (
    <>
      <div className="dados-liquidacao-relatorio">
        <table className="tabela">
          <thead>
            <tr>
              <th colSpan={4} className="titulo">
                DADOS PARA LIQUIDAÇÃO
              </th>
            </tr>
            <tr>
              <th>Nº do Empenho</th>
              <th>Tipo do Empenho</th>
              <th>Unidades para Pagamento</th>
              <th>Total para Pagamento</th>
            </tr>
          </thead>

          <tbody>
            {linhas.map((item, index) => (
              <tr key={index}>
                <td>{item.numero_empenho ?? ""}</td>
                <td>{item.tipo_empenho ?? ""}</td>
                <td
                  className="visualizar-unidades"
                  onClick={() => onVisualizarUnidades(item)}
                >
                  Visualizar Unidades
                </td>
                <td>R$ {formataMilharDecimal(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UnidadesPagamento
        show={visualizarUnidades}
        onClose={() => setVisualizarUnidades(false)}
        numeroEmpenho={dadoSelecionado?.numero_empenho ?? ""}
        tipoEmpenho={dadoSelecionado?.tipo_empenho ?? ""}
        totalUes={dadoSelecionado?.unidades_educacionais?.length ?? 0}
        unidades={dadoSelecionado?.unidades_educacionais ?? []}
      />
    </>
  );
};

export default DadosLiquidacao;
