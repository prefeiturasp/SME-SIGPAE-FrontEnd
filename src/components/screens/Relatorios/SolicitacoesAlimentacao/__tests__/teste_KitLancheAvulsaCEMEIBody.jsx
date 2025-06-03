import React from "react";
import { render, act, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { KitLancheAvulsaCEMEIBody } from "../componentes/KitLancheAvulsaCEMEIBody";

import { mockSolicitacaoKitLancheAvulso } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockSolicitacoes/mockSolicitacaoKitLancheAvulso";
import { mockItemKitLancheCEMEI } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockItens/mockItemKitLancheCEMEI";
import { mockFiltrosSuspensao } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockFiltrosSuspensao";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

describe("Teste <KitLancheAvulsaCEMEIBody>", () => {
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
          <KitLancheAvulsaCEMEIBody
            solicitacao={mockSolicitacaoKitLancheAvulso}
            item={mockItemKitLancheCEMEI}
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
    const elementoGenerico = screen.getByText("05/12/2023");

    const botaoExpandir = elementoGenerico
      .closest("tr")
      .querySelector(".fas.fa-angle-down");
    fireEvent.click(botaoExpandir);
  });
});
