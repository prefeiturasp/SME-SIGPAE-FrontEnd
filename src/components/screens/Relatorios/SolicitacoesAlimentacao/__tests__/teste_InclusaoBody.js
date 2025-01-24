import React from "react";
import { render, act, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { InclusaoBody } from "../componentes/InclusaoBody";

import { mockItemInclusao } from "mocks/Relatorios/SolicitacoesAlimentacao/mockItemInclusao";
import { mockFiltrosSuspensao } from "mocks/Relatorios/SolicitacoesAlimentacao/mockFiltrosSuspensao";
import { mockSolicitacaoInclusao } from "mocks/Relatorios/SolicitacoesAlimentacao/mockSolicitacaoInclusao";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

describe("Teste <SuspensaoAlimentacaoBody>", () => {
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
          <InclusaoBody
            solicitacao={mockSolicitacaoInclusao}
            item={mockItemInclusao}
            index={index}
            filtros={mockFiltrosSuspensao}
            key={index}
            labelData="Data de Autorização"
          />
        </MemoryRouter>
      );
    });
  });

  it("Testa a renderização dos elementos da Tabela", async () => {
    const numero150 = screen.getByText("150");

    const botaoExpandir = numero150
      .closest("tr")
      .querySelector(".fas.fa-angle-down");
    fireEvent.click(botaoExpandir);

    const historico = screen.getByText("Histórico de cancelamento");
    expect(historico).toBeInTheDocument();
  });
});
