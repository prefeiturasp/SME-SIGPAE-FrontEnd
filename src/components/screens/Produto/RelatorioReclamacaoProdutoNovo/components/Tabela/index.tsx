import { Spin } from "antd";
import { Dispatch } from "react";
import { deepCopy } from "src/helpers/utilities";
import { Reclamacao } from "./components/Reclamacao";
import "./style.scss";

type ITabelaProps = {
  produtos: Array<any>;
  setProdutos: Dispatch<(_prevState: undefined) => undefined>;
  loadingTabela: boolean;
};

export const Tabela = ({ ...props }: ITabelaProps) => {
  const { produtos, setProdutos, loadingTabela } = props;

  const setCollapse = (key: number) => {
    const copyProdutos = deepCopy(produtos);
    copyProdutos[key].collapsed = !copyProdutos[key].collapsed;
    setProdutos(copyProdutos);
  };

  return (
    <div className="tabela-relatorio-reclamacoes-produto">
      <Spin tip="Carregando tabela..." spinning={loadingTabela}>
        {produtos?.length > 0 && (
          <table className="mt-3">
            <thead>
              <tr>
                <th>Editais</th>
                <th>Nome do Produto</th>
                <th>Marca</th>
                <th>Fabricante</th>
                <th>Reclamações</th>
                <th>Status Produto</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto, key: number) => {
                return [
                  <tr key={key}>
                    <td></td>
                    <td>{produto.nome}</td>
                    <td>{produto.marca.nome}</td>
                    <td>{produto.fabricante.nome}</td>
                    <td>{produto.ultima_homologacao.reclamacoes.length}</td>
                    <td>{produto.ultima_homologacao.status_titulo}</td>
                    <td
                      className="text-center"
                      onClick={() => setCollapse(key)}
                    >
                      <i
                        data-testid={`i-collapsed-${key}`}
                        className={
                          produto.collapsed
                            ? "fas fa-chevron-up"
                            : "fas fa-chevron-down"
                        }
                      />
                    </td>
                  </tr>,
                  produto.collapsed &&
                    produto.ultima_homologacao.reclamacoes.map(
                      (reclamacao, index: number) => {
                        return (
                          <tr className="reclamacoes">
                            <td colSpan={7}>
                              <Reclamacao key={index} reclamacao={reclamacao} />
                            </td>
                          </tr>
                        );
                      }
                    ),
                ];
              })}
            </tbody>
          </table>
        )}
        {produtos?.length === 0 && (
          <div className="mt-3">
            Não foram encontrados resultados para estes filtros.
          </div>
        )}
      </Spin>
    </div>
  );
};
