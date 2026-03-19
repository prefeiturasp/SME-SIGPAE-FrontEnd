import "./styles.scss";
import { formataMilharDecimal } from "src/helpers/utilities";

interface DadosLiquidacaoItem {
  numero_empenho: string;
  tipo_empenho: string;
  unidades_educacionais: number | string;
  total_pagamento: string;
}

interface DadosLiquidacaoProps {
  dados?: DadosLiquidacaoItem[];
}

const DadosLiquidacao = ({ dados = [] }: DadosLiquidacaoProps) => {
  const linhas = dados.length > 0 ? dados : [{} as DadosLiquidacaoItem];
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
