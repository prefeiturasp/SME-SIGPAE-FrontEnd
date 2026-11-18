import { formataMilhar, formataMilharDecimal } from "src/helpers/utilities";
import { ResumoDescontos } from "../../types";

type Props = {
  descontos?: ResumoDescontos;
};

const moeda = (valor: number) => `R$ ${formataMilharDecimal(valor)}`;

export const TabelaDescontos = ({ descontos }: Props) => {
  if (!descontos?.linhas.length) return null;

  const { tituloFaixaOuAlimentacao, linhas, total } = descontos;

  return (
    <div data-testid="tabela-descontos">
      <h2 className="titulo-relatorio-financeiro mt-0">TABELA DE DESCONTO</h2>
      <div className="tabela-relatorio-responsiva">
        <table className="tabela-relatorio tabela-detalhada tabela-descontos">
          <thead>
            <tr>
              <th scope="col" className="col-descricao">
                NOME DA UNIDADE
              </th>
              <th scope="col">TIPO DE LANÇAMENTO</th>
              <th scope="col">{tituloFaixaOuAlimentacao}</th>
              <th scope="col">CLÁUSULA DO DESCONTO</th>
              <th scope="col">QUANTIDADE</th>
              <th scope="col">VALOR UNITÁRIO</th>
              <th scope="col" className="col-valor-total">
                TOTAL DO DESCONTO
              </th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((linha) => (
              <tr key={linha.chave}>
                <td className="col-descricao">
                  {linha.unidades.map((unidade) => (
                    <div key={unidade}>{unidade}</div>
                  ))}
                </td>
                <td>{linha.tipoLancamento}</td>
                <td>{linha.faixaOuAlimentacao}</td>
                <td>{linha.clausula}</td>
                <td>{formataMilhar(linha.quantidade)}</td>
                <td>{moeda(linha.valorUnitario)}</td>
                <td className="col-valor-total">{moeda(linha.total)}</td>
              </tr>
            ))}
            <tr className="linha-total">
              <td className="col-descricao">
                TOTAL DE DESCONTOS DOS ITENS (D)
              </td>
              <td />
              <td />
              <td />
              <td />
              <td />
              <td className="col-valor-total">{moeda(total)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
