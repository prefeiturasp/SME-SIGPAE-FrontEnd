import React from "react";
import { render, act, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { SuspensaoAlimentacaoCEIBody } from "../componentes/SuspensaoAlimentacaoCEIBody";

import { mockSolicitacaoSuspensaoAlimentacaoCEI } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockSolicitacoes/mockSolicitacaoSuspensaoAlimentacaoCEI";
import { mockItemSuspensao } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockItens/mockItemSuspensao";
import { mockFiltrosSuspensao } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockFiltrosSuspensao";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

describe("Teste <SuspensaoAlimentacaoCEIBody>", () => {
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
          <SuspensaoAlimentacaoCEIBody
            solicitacao={mockSolicitacaoSuspensaoAlimentacaoCEI}
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
    const elementoGenerico = screen.getByText("30/01/2025");

    const botaoExpandir = elementoGenerico
      .closest("tr")
      .querySelector(".fas.fa-angle-down");
    fireEvent.click(botaoExpandir);
  });
});
