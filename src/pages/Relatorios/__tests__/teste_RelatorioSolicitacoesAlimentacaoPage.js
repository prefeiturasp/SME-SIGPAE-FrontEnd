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
import RelatorioSolicitacoesAlimentacaoPage from "pages/Relatorios/RelatorioSolicitacoesAlimentacaoPage";
import { MeusDadosContext } from "context/MeusDadosContext";

import { getTiposUnidadeEscolar } from "services/cadastroTipoAlimentacao.service";
import { getEscolasTercTotal } from "services/escola.service";
import { getLotesSimples } from "services/lote.service";
import { getNomesTerceirizadas } from "services/produto.service";
import { getTotalizadoresRelatorioSolicitacoes } from "services/relatorios.service";

import { getNotificacoes, getQtdNaoLidas } from "services/notificacoes.service";

import { mockGetTiposUnidadeEscolar } from "mocks/cadastroTipoAlimentacao.service/mockGetTiposUnidadeEscolar";
import { mockGetEscolaTercTotal } from "mocks/services/escola.service/mockGetEscolasTercTotal";
import { mockGetLotesSimples } from "mocks/services/lote.service/mockGetLotesSimples";
import { mockGetNomesTerceirizadas } from "mocks/services/produto.service/mockGetNomesTerceirizadas";
import { mockGetTotalizadoresRelatorioSolicitacoes } from "mocks/services/relatorios.service/mockGetTotalizadoresRelatorioSolicitacoes";
import { mockGetNotificacoes } from "mocks/services/notificacoes.service/mockGetNotificacoes";
import { mockGetQtdNaoLidas } from "mocks/services/notificacoes.service/mockGetQtdNaoLidas";
import { mockMeusDadosCODAEGA } from "mocks/meusDados/CODAE-GA";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

jest.mock("services/relatorios.service");
jest.mock("services/produto.service");
jest.mock("services/lote.service");
jest.mock("services/escola.service");
jest.mock("services/cadastroTipoAlimentacao.service");
jest.mock("services/notificacoes.service");

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
