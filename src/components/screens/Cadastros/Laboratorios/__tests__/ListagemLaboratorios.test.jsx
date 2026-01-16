import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ListagemLaboratorios from "src/components/screens/Cadastros/Laboratorios/components/ListagemLaboratorios";
import "@testing-library/jest-dom";

describe("Testa o componente ListagemLaboratorios", () => {
  const mockLaboratorios = [
    {
      uuid: "4e4df3a2-088f-40e2-8c33-4bcf8871af58",
      nome: "Laboratório Alpha",
      cnpj: "12345678000199",
      credenciado: true,
    },
    {
      uuid: "f88b8c9e-0476-4b52-a3d9-83873f64cee1",
      nome: "Laboratório Beta",
      cnpj: "98765432000188",
      credenciado: false,
    },
  ];

  const renderComponent = (laboratorios) => {
    return render(
      <MemoryRouter>
        <ListagemLaboratorios laboratorios={laboratorios} />
      </MemoryRouter>,
    );
  };

  it("deve renderizar o cabeçalho da tabela corretamente", () => {
    renderComponent([]);
    expect(screen.getByText("Laboratórios Cadastrados")).toBeInTheDocument();
    expect(screen.getByText("Nome do Laboratório")).toBeInTheDocument();
    expect(screen.getByText("CNPJ")).toBeInTheDocument();
    expect(screen.getByText("Credenciado")).toBeInTheDocument();
    expect(screen.getByText("Ações")).toBeInTheDocument();
  });

  it("deve listar os laboratórios e formatar CNPJ e Credenciamento corretamente", () => {
    renderComponent(mockLaboratorios);

    expect(screen.getByText("Laboratório Alpha")).toBeInTheDocument();
    expect(screen.getByText("Laboratório Beta")).toBeInTheDocument();

    expect(screen.getByText("12.345.678/0001-99")).toBeInTheDocument();
    expect(screen.getByText("98.765.432/0001-88")).toBeInTheDocument();

    expect(screen.getByText("Sim")).toBeInTheDocument();
    expect(screen.getByText("Não")).toBeInTheDocument();
  });

  it("deve construir os links de Detalhar e Editar com o UUID correto", () => {
    renderComponent([mockLaboratorios[0]]);

    const links = screen.getAllByRole("link");

    const linkDetalhar = links.find((l) => l.innerHTML.includes("fa-eye"));
    expect(linkDetalhar).toHaveAttribute(
      "href",
      "/configuracoes/cadastros/cadastro-laboratorio/detalhar?uuid=4e4df3a2-088f-40e2-8c33-4bcf8871af58",
    );

    const linkEditar = links.find((l) => l.innerHTML.includes("fa-edit"));
    expect(linkEditar).toHaveAttribute(
      "href",
      "/configuracoes/cadastros/cadastro-laboratorio/editar?uuid=4e4df3a2-088f-40e2-8c33-4bcf8871af58",
    );
  });

  it("deve renderizar as classes de estilo corretas", () => {
    const { container } = renderComponent(mockLaboratorios);

    expect(
      container.querySelector(".resultado-laboratorios"),
    ).toBeInTheDocument();

    const rows = container.querySelectorAll(".body-table");
    expect(rows.length).toBe(2);
  });
});
