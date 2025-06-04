import React from "react";
import { render, act, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { InversaoCardapioBody } from "../componentes/InversaoCardapioBody";

import { mockItemInversaoCardapio } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockItens/mockItemInversaoCardapio";
import { mockFiltrosSuspensao } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockFiltrosSuspensao";
import { mockSolicitacaoInversaoCardapio } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockSolicitacoes/mockSolicitacaoInversaoCardapio";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

describe("Teste <InversaoCardapioBody>", () => {
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
          <InversaoCardapioBody
            solicitacao={mockSolicitacaoInversaoCardapio}
            item={mockItemInversaoCardapio}
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
    const data = screen.getByText("28/01/2023");

    const botaoExpandir = data
      .closest("tr")
      .querySelector(".fas.fa-angle-down");
    fireEvent.click(botaoExpandir);

    const motivo = screen.getByText("teste ss");
    expect(motivo).toBeInTheDocument();
  });
});
