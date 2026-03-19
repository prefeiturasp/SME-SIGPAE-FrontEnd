import { DadosLiquidacaoEmpenho } from "src/interfaces/relatorio_financeiro.interface";
import "./styles.scss";
import { formataMilharDecimal } from "src/helpers/utilities";

interface Props {
  dados?: DadosLiquidacaoEmpenho[];
}

const DadosLiquidacao = ({ dados = [] }: Props) => {
  const linhas = dados.length > 0 ? dados : [{} as DadosLiquidacaoEmpenho];
  return (
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
              <td>Visualizar Unidades</td>
              <td>R$ {formataMilharDecimal(0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DadosLiquidacao;
