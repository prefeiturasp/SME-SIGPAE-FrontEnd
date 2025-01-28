import React from "react";
import { render, act, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { AlteracaoCEIBody } from "../componentes/AlteracaoCEIBody";

import { mockItemAlteracaoCEI } from "mocks/Relatorios/SolicitacoesAlimentacao/mockItens/mockItemAlteracaoCEI";
import { mockFiltrosSuspensao } from "mocks/Relatorios/SolicitacoesAlimentacao/mockFiltrosSuspensao";
import { mockSolicitacaoAlteracaoCEI } from "mocks/Relatorios/SolicitacoesAlimentacao/mockSolicitacoes/mockSolicitacaoAlteracaoCEI";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

describe("Teste <AlteracaoCEIBody>", () => {
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
          <AlteracaoCEIBody
            solicitacao={mockSolicitacaoAlteracaoCEI}
            item={mockItemAlteracaoCEI}
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
    const data = screen.getByText("01/08/2023");

    const botaoExpandir = data
      .closest("tr")
      .querySelector(".fas.fa-angle-down");
    fireEvent.click(botaoExpandir);

    const observacao = screen.getByText("TESTE APRESENTAÇÃO REVIEW 17/07");
    expect(observacao).toBeInTheDocument();
  });
});
