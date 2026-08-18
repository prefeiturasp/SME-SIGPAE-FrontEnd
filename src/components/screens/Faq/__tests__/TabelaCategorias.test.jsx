import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import TabelaCategorias from "../Categorias/components/TabelaCategorias";

const categorias = [
  {
    uuid: "11111111-1111-1111-1111-111111111111",
    nome: "Dieta Especial",
  },
  {
    uuid: "22222222-2222-2222-2222-222222222222",
    nome: "Gestão de Produto",
  },
];

describe("Tabela de categorias", () => {
  it("deve chamar a ação de editar com a categoria selecionada", () => {
    const aoEditar = jest.fn();

    render(
      <TabelaCategorias
        categorias={categorias}
        aoEditar={aoEditar}
        aoExcluir={jest.fn()}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Editar categoria Dieta Especial",
      }),
    );

    expect(aoEditar).toHaveBeenCalledTimes(1);
    expect(aoEditar).toHaveBeenCalledWith(categorias[0]);
  });

  it("deve chamar a ação de excluir com a categoria selecionada", () => {
    const aoExcluir = jest.fn();

    render(
      <TabelaCategorias
        categorias={categorias}
        aoEditar={jest.fn()}
        aoExcluir={aoExcluir}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Excluir categoria Gestão de Produto",
      }),
    );

    expect(aoExcluir).toHaveBeenCalledTimes(1);
    expect(aoExcluir).toHaveBeenCalledWith(categorias[1]);
  });
});
