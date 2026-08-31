import React from "react";
import { render, screen } from "@testing-library/react";
import TabelaListagem, { ColunaTabelaListagem } from "..";

interface ItemTabela {
  nome: string;
  uuid: string;
}

const UUID_ITEM = "5da35a0c-63f5-42d0-82ae-c72a47e88201";

describe("TabelaListagem", () => {
  it("renderiza cabeçalhos, dados e conteúdo personalizado", () => {
    const colunas: ColunaTabelaListagem<ItemTabela>[] = [
      {
        chave: "nome",
        titulo: "Nome",
        renderizar: (item) => item.nome,
      },
      {
        chave: "acoes",
        titulo: "Ações",
        classe: "tabela-listagem__coluna-acoes",
        largura: "80px",
        renderizar: (item) => <button>Editar {item.nome}</button>,
      },
    ];

    render(
      <TabelaListagem
        colunas={colunas}
        dados={[{ nome: "Categoria teste", uuid: UUID_ITEM }]}
        larguraMinima="600px"
        obterChave={(item) => item.uuid}
      />,
    );

    expect(
      screen.getByRole("columnheader", { name: "Nome" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Ações" })).toHaveStyle({
      width: "80px",
    });
    expect(screen.getByText("Categoria teste")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Editar Categoria teste" }),
    ).toBeInTheDocument();
  });

  it("renderiza o corpo da tabela vazio quando não há dados", () => {
    const { container } = render(
      <TabelaListagem<ItemTabela>
        colunas={[
          {
            chave: "nome",
            titulo: "Nome",
            renderizar: (item) => item.nome,
          },
        ]}
        dados={[]}
        obterChave={(item) => item.uuid}
      />,
    );

    expect(container.querySelector("tbody")?.children).toHaveLength(0);
  });
});
