import React from "react";
import {
  render,
  act,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import RelatorioSolicitacoesAlimentacaoPage from "src/pages/Relatorios/RelatorioSolicitacoesAlimentacaoPage";
import { MeusDadosContext } from "src/context/MeusDadosContext";

import { getTiposUnidadeEscolar } from "src/services/cadastroTipoAlimentacao.service";
import { getEscolasTercTotal } from "src/services/escola.service";
import { getLotesSimples } from "src/services/lote.service";
import { getNomesTerceirizadas } from "src/services/produto.service";
import { getTotalizadoresRelatorioSolicitacoes } from "src/services/relatorios.service";

import {
  getNotificacoes,
  getQtdNaoLidas,
} from "src/services/notificacoes.service";

import { mockGetTiposUnidadeEscolar } from "src/mocks/cadastroTipoAlimentacao.service/mockGetTiposUnidadeEscolar";
import { mockGetEscolaTercTotal } from "src/mocks/services/escola.service/mockGetEscolasTercTotal";
import { mockGetLotesSimples } from "src/mocks/services/lote.service/mockGetLotesSimples";
import { mockGetNomesTerceirizadas } from "src/mocks/services/produto.service/mockGetNomesTerceirizadas";
import { mockGetTotalizadoresRelatorioSolicitacoes } from "src/mocks/services/relatorios.service/mockGetTotalizadoresRelatorioSolicitacoes";
import { mockGetNotificacoes } from "src/mocks/services/notificacoes.service/mockGetNotificacoes";
import { mockGetQtdNaoLidas } from "src/mocks/services/notificacoes.service/mockGetQtdNaoLidas";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

jest.mock("src/services/relatorios.service");
jest.mock("src/services/produto.service");
jest.mock("src/services/lote.service");
jest.mock("src/services/escola.service");
jest.mock("src/services/cadastroTipoAlimentacao.service");
jest.mock("src/services/notificacoes.service");

const awaitServices = async () => {
  await waitFor(() => {
    expect(getTiposUnidadeEscolar).toHaveBeenCalled();
    expect(getEscolasTercTotal).toHaveBeenCalled();
    expect(getNomesTerceirizadas).toHaveBeenCalled();
  });
};

describe("Teste <SolicitacoesAlimentacao> (RelatorioSolicitacoesAlimentacao)", () => {
  beforeEach(async () => {
    getTiposUnidadeEscolar.mockResolvedValue({
      data: mockGetTiposUnidadeEscolar,
      status: 200,
    });

    getEscolasTercTotal.mockResolvedValue({
      data: mockGetEscolaTercTotal,
      status: 200,
    });

    getLotesSimples.mockResolvedValue({
      data: mockGetLotesSimples,
      status: 200,
    });

    getNomesTerceirizadas.mockResolvedValue({
      data: mockGetNomesTerceirizadas,
      status: 200,
    });

    getTotalizadoresRelatorioSolicitacoes.mockResolvedValue({
      data: mockGetTotalizadoresRelatorioSolicitacoes,
      status: 200,
    });

    getNotificacoes.mockResolvedValue({
      data: mockGetNotificacoes,
      status: 200,
    });

    getQtdNaoLidas.mockResolvedValue({
      data: mockGetQtdNaoLidas,
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
          <MeusDadosContext.Provider
            value={{ meusDados: mockMeusDadosCODAEGA, setMeusDados: jest.fn() }}
          >
            <RelatorioSolicitacoesAlimentacaoPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Testa a renderização dos elementos básicos do relatório", async () => {
    await awaitServices();

    expect(
      screen.getByText("Relatório de Solicitações de Alimentação")
    ).toBeInTheDocument();
    expect(screen.getByText("Filtrar")).toBeInTheDocument();

    const labelSelect = screen.getByText("Status da Solicitação");

    const selectElement = labelSelect.nextElementSibling;
    expect(selectElement).toBeInTheDocument();

    fireEvent.change(selectElement, {
      target: { value: "AUTORIZADOS" },
    });
  });
});
