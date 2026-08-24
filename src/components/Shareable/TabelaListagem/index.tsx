import React, { CSSProperties, ReactNode } from "react";
import "./style.scss";

export interface ColunaTabelaListagem<T> {
  chave: string;
  classe?: string;
  largura?: CSSProperties["width"];
  renderizar: (_item: T) => ReactNode;
  titulo: string;
}

interface TabelaListagemProps<T> {
  colunas: ColunaTabelaListagem<T>[];
  dados: T[];
  larguraMinima?: CSSProperties["minWidth"];
  obterChave: (_item: T) => React.Key;
}

const TabelaListagem = <T,>({
  colunas,
  dados,
  larguraMinima,
  obterChave,
}: TabelaListagemProps<T>) => (
  <div className="tabela-listagem">
    <div className="tabela-listagem__container">
      <table style={{ minWidth: larguraMinima }}>
        <thead>
          <tr>
            {colunas.map((coluna) => (
              <th
                className={coluna.classe}
                key={coluna.chave}
                scope="col"
                style={{ width: coluna.largura }}
              >
                {coluna.titulo}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {dados.map((item) => (
            <tr key={obterChave(item)}>
              {colunas.map((coluna) => (
                <td className={coluna.classe} key={coluna.chave}>
                  {coluna.renderizar(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default TabelaListagem;
