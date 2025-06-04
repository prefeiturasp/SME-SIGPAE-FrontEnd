import React from "react";
import { render, act, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { KitLancheUnificadoBody } from "../componentes/KitLancheUnificadoBody";

import { mockItemKitLancheUnificado } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockItens/mockItemKitLancheUnificado";
import { mockFiltrosSuspensao } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockFiltrosSuspensao";
import { mockSolicitacaoKitLancheUnificado } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockSolicitacoes/mockSolicitacaoKitLancheUnificado";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

describe("Teste <InclusaoBody>", () => {
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
          <KitLancheUnificadoBody
            solicitacao={mockSolicitacaoKitLancheUnificado}
            item={mockItemKitLancheUnificado}
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
    const data = screen.getByText("05/02/2022");

    const botaoExpandir = data
      .closest("tr")
      .querySelector(".fas.fa-angle-down");
    fireEvent.click(botaoExpandir);

    const local = screen.getByText("PARQUINHO3");
    expect(local).toBeInTheDocument();
  });
});
