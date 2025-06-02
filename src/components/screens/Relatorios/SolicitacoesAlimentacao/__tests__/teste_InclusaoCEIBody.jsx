import React from "react";
import { render, act, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { InclusaoCEIBody } from "../componentes/InclusaoCEIBody";

import { getVinculosTipoAlimentacaoPorEscola } from "src/services/cadastroTipoAlimentacao.service";

import { mockItemInclusaoCEI } from "mocks/Relatorios/SolicitacoesAlimentacao/mockItens/mockItemInclusaoCEI";
import { mockFiltrosInclusao } from "mocks/Relatorios/SolicitacoesAlimentacao/mockFiltrosSuspensao";
import { mockSolicitacaoInclusaoCEI } from "mocks/Relatorios/SolicitacoesAlimentacao/mockSolicitacoes/mockSolicitacaoInclusaoCEI";
import { mockGetVinculosTipoAlimentacaoPorEscola } from "mocks/cadastroTipoAlimentacao.service/mockGetVinculosTipoAlimentacaoPorEscola";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

jest.mock("services/cadastroTipoAlimentacao.service");

describe("Teste <InclusaoCEIBody>", () => {
  const index = 1;

  beforeEach(async () => {
    getVinculosTipoAlimentacaoPorEscola.mockResolvedValue({
      data: mockGetVinculosTipoAlimentacaoPorEscola,
      status: 200,
    });

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <InclusaoCEIBody
            solicitacao={mockSolicitacaoInclusaoCEI}
            item={mockItemInclusaoCEI}
            index={index}
            filtros={mockFiltrosInclusao}
            key={index}
            labelData="Data de Autorização"
          />
        </MemoryRouter>
      );
    });
  });

  it("Testa a renderização dos elementos da Tabela", async () => {
    const numero = screen.getByText("10");

    const botaoExpandir = numero
      .closest("tr")
      .querySelector(".fas.fa-angle-down");
    fireEvent.click(botaoExpandir);

    const headerTabela = screen.getByText("Alunos Matriculados");
    expect(headerTabela).toBeInTheDocument();
  });
});
