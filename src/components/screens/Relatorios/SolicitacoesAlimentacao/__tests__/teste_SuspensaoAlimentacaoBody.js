import React from "react";
import { render, act, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { SuspensaoAlimentacaoBody } from "../componentes/SuspensaoAlimentacaoBody";

import { mockSolicitacaoSuspensaoAlimentacao } from "mocks/Relatorios/SolicitacoesAlimentacao/mockSolicitacaoSuspensaoAlimentacao";
import { mockItemSuspensao } from "mocks/Relatorios/SolicitacoesAlimentacao/mockItemSuspensao";
import { mockFiltrosSuspensao } from "mocks/Relatorios/SolicitacoesAlimentacao/mockFiltrosSuspensao";

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
          <SuspensaoAlimentacaoBody
            solicitacao={mockSolicitacaoSuspensaoAlimentacao}
            item={mockItemSuspensao}
            index={index}
            filtros={mockFiltrosSuspensao}
            key={index}
            labelData="Data de Suspensão"
          />
        </MemoryRouter>
      );
    });
  });

  it("Testa a renderização dos elementos da Tabela", async () => {
    const numero150 = screen.getByText("150");

    // Encontra o elemento <i> mais próximo do número
    const botaoExpandir = numero150
      .closest("tr")
      .querySelector(".fas.fa-angle-down");
    fireEvent.click(botaoExpandir);

    const historico = screen.getByText("Histórico de cancelamento");
    expect(historico).toBeInTheDocument();
  });
});
