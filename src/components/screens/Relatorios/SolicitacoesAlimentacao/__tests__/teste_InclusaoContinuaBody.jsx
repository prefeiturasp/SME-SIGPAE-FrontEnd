import React from "react";
import { render, act, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { InclusaoContinuaBody } from "../componentes/InclusaoContinuaBody";

import { mockItemInclusaoContinua } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockItens/mockItemInclusaoContinua";
import { mockFiltrosInclusao } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockFiltrosSuspensao";
import { mockSolicitacaoInclusaoContinua } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockSolicitacoes/mockSolicitacaoInclusaoContinua";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

describe("Teste <InclusaoContinuaBody>", () => {
  const index = 1;

  beforeEach(async () => {
    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <InclusaoContinuaBody
            solicitacao={mockSolicitacaoInclusaoContinua}
            item={mockItemInclusaoContinua}
            index={index}
            filtros={mockFiltrosInclusao}
            key={index}
            labelData="Data de Autorização"
          />
        </MemoryRouter>
      );
    });
  });

  it("Testa a renderização dos elementos da Tabela", async () => {
    const numero = screen.getByText("10");

    const botaoExpandir = numero
      .closest("tr")
      .querySelector(".fas.fa-angle-down");
    fireEvent.click(botaoExpandir);

    const observacao = screen.getByText("TESTE REVIEW");
    expect(observacao).toBeInTheDocument();
  });
});
