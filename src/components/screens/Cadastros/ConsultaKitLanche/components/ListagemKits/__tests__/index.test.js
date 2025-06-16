import React from "react";
import { render, screen } from "@testing-library/react";
import ListagemKits from "../index";
import { MemoryRouter } from "react-router-dom";

describe("ListagemKits", () => {
  it("deve renderizar os dados dos kits corretamente", () => {
    const kitsMock = [
      {
        uuid: "1",
        nome: "Kit Escolar",
        descricao: "<p>Descrição do kit escolar</p>",
        edital: { numero: "123/2024" },
        tipos_unidades: [{ iniciais: "CEI" }, { iniciais: "EMEF" }],
        status: "Ativo",
      },
    ];

    render(
      <MemoryRouter>
        <ListagemKits kits={kitsMock} />
      </MemoryRouter>
    );

    expect(screen.getByText("Kit Escolar")).toBeInTheDocument();
    expect(screen.getByText("Descrição do kit escolar")).toBeInTheDocument();
    expect(screen.getByText("123/2024")).toBeInTheDocument();
    expect(screen.getByText("CEI, EMEF")).toBeInTheDocument();
    expect(screen.getByText("Ativo")).toBeInTheDocument();
    expect(screen.getByText("Editar")).toBeInTheDocument();
  });
});
