import React from "react";
import { render, act, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { KitLancheAvulsaBody } from "../componentes/KitLancheAvulsaBody";

import { mockSolicitacaoKitLancheAvulso } from "mocks/Relatorios/SolicitacoesAlimentacao/mockSolicitacaoKitLancheAvulso";
import { mockItemKitLanche } from "mocks/Relatorios/SolicitacoesAlimentacao/mockItemKitLanche";
import { mockFiltrosSuspensao } from "mocks/Relatorios/SolicitacoesAlimentacao/mockFiltrosSuspensao";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

describe("Teste <KitLancheAvulsaBody>", () => {
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
          <KitLancheAvulsaBody
            solicitacao={mockSolicitacaoKitLancheAvulso}
            item={mockItemKitLanche}
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
    const elementoGenerico = screen.getByText("30/09/2023");

    const botaoExpandir = elementoGenerico
      .closest("tr")
      .querySelector(".fas.fa-angle-down");
    fireEvent.click(botaoExpandir);
  });
});
