import React from "react";
import {
  render,
  act,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { InclusaoCEMEIBody } from "../componentes/InclusaoCEMEIBody";

import {
  getVinculosTipoAlimentacaoPorEscola,
  getVinculosTipoAlimentacaoMotivoInclusaoEspecifico,
} from "services/cadastroTipoAlimentacao.service";

import { mockItemInclusaoCEMEI } from "mocks/Relatorios/SolicitacoesAlimentacao/mockItens/mockItemInclusaoCEMEI";
import { mockFiltrosInclusao } from "mocks/Relatorios/SolicitacoesAlimentacao/mockFiltrosSuspensao";
import { mockSolicitacaoInclusaoCEMEI } from "mocks/Relatorios/SolicitacoesAlimentacao/mockSolicitacoes/mockSolicitacaoInclusaoCEMEI";
import { mockGetVinculosTipoAlimentacaoPorEscola } from "mocks/cadastroTipoAlimentacao.service/mockGetVinculosTipoAlimentacaoPorEscola";
import { mockGetVinculosTipoAlimentacaoMotivoInclusaoEspecifico } from "mocks/cadastroTipoAlimentacao.service/mockGetVinculosTipoAlimentacaoMotivoInclusaoEspecifico";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

jest.mock("services/cadastroTipoAlimentacao.service");

describe("Teste <InclusaoContinuaBody>", () => {
  const index = 1;

  beforeEach(async () => {
    getVinculosTipoAlimentacaoPorEscola.mockResolvedValue({
      data: mockGetVinculosTipoAlimentacaoPorEscola,
      status: 200,
    });

    getVinculosTipoAlimentacaoMotivoInclusaoEspecifico.mockResolvedValue({
      data: mockGetVinculosTipoAlimentacaoMotivoInclusaoEspecifico,
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
          <InclusaoCEMEIBody
            solicitacao={mockSolicitacaoInclusaoCEMEI}
            item={mockItemInclusaoCEMEI}
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
    await waitFor(() =>
      expect(
        getVinculosTipoAlimentacaoMotivoInclusaoEspecifico
      ).toHaveBeenCalled()
    );
    await waitFor(() =>
      expect(getVinculosTipoAlimentacaoPorEscola).toHaveBeenCalled()
    );

    const numero = screen.getByText("5");

    const botaoExpandir = numero
      .closest("tr")
      .querySelector(".fas.fa-angle-down");
    fireEvent.click(botaoExpandir);

    const headerTabela = screen.getByText("Dia da família");
    expect(headerTabela).toBeInTheDocument();
  });
});
