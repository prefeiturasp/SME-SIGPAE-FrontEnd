import React from "react";
import { render, act, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { AlteracaoBody } from "../componentes/AlteracaoBody";

import { mockItemAlteracao } from "mocks/Relatorios/SolicitacoesAlimentacao/mockItens/mockItemAlteracao";
import { mockFiltrosSuspensao } from "mocks/Relatorios/SolicitacoesAlimentacao/mockFiltrosSuspensao";
import { mockSolicitacaoAlteracao } from "mocks/Relatorios/SolicitacoesAlimentacao/mockSolicitacoes/mockSolicitacaoAlteracao";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

describe("Teste <AlteracaoBody>", () => {
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
          <AlteracaoBody
            solicitacao={mockSolicitacaoAlteracao}
            item={mockItemAlteracao}
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
    const numero = screen.getByText("150");

    const botaoExpandir = numero
      .closest("tr")
      .querySelector(".fas.fa-angle-down");
    fireEvent.click(botaoExpandir);

    const observacao = screen.getByText("teste dani");
    expect(observacao).toBeInTheDocument();
  });
});
