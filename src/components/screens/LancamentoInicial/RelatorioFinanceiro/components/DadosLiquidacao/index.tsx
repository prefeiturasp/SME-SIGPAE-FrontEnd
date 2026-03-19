import React from "react";
import "./styles.scss";

interface DadosLiquidacaoItem {
  numeroEmpenho: string;
  tipoEmpenho: string;
  unidadesPagamento: number | string;
  totalPagamento: string;
}

interface DadosLiquidacaoProps {
  dados?: DadosLiquidacaoItem[];
}

const DadosLiquidacao: React.FC<DadosLiquidacaoProps> = ({ dados = [] }) => {
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
              <td>{item.numeroEmpenho ?? ""}</td>
              <td>{item.tipoEmpenho ?? ""}</td>
              <td>{item.unidadesPagamento ?? ""}</td>
              <td>{item.totalPagamento ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DadosLiquidacao;
