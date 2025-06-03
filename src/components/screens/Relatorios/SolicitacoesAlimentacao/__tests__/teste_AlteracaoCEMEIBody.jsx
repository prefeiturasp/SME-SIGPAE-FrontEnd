import React from "react";
import { render, act, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { AlteracaoCEMEIBody } from "../componentes/AlteracaoCEMEIBody";

import { mockItemAlteracaoCEMEI } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockItens/mockItemAlteracaoCEMEI";
import { mockFiltrosSuspensao } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockFiltrosSuspensao";
import { mockSolicitacaoAlteracaoCEMEI } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockSolicitacoes/mockSolicitacaoAlteracaoCEMEI";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

describe("Teste <AlteracaoCEMEIBody>", () => {
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
          <AlteracaoCEMEIBody
            solicitacao={mockSolicitacaoAlteracaoCEMEI}
            item={mockItemAlteracaoCEMEI}
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
    const data = screen.getByText("02/08/2023");

    const botaoExpandir = data
      .closest("tr")
      .querySelector(".fas.fa-angle-down");
    fireEvent.click(botaoExpandir);

    const observacao = screen.getByText("TESTE APRESENTAÇÃO REVIEW 17/07");
    expect(observacao).toBeInTheDocument();
  });
});
