import React from "react";
import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosDilogQualidade } from "src/mocks/meusDados/dilog-qualidade";
import DetalharCronogramaSemanalPage from "src/pages/PreRecebimento/DetalharCronogramaSemanalPage";
import { mockCronogramaSemanalDetalhe } from "src/mocks/services/cronogramaSemanal.service";
import {
  getNotificacoes,
  getQtdNaoLidas,
} from "src/services/notificacoes.service";
import { mockGetNotificacoes } from "src/mocks/services/notificacoes.service/mockGetNotificacoes";
import { mockGetQtdNaoLidas } from "src/mocks/services/notificacoes.service/mockGetQtdNaoLidas";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";

jest.mock("src/services/notificacoes.service");

const UUID = mockCronogramaSemanalDetalhe.uuid;

const setup = async () => {
  window.history.pushState({}, "", `?uuid=${UUID}`);
  await act(async () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <MeusDadosContext.Provider
          value={{
            meusDados: mockMeusDadosDilogQualidade,
            setMeusDados: jest.fn(),
          }}
        >
          <DetalharCronogramaSemanalPage />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

describe("DetalharCronogramaSemanalPage - Permissões DILOG_QUALIDADE (somente visualização)", () => {
  beforeEach(() => {
    mock.reset();
    jest.clearAllMocks();

    localStorage.setItem("perfil", PERFIL.DILOG_QUALIDADE);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.PRE_RECEBIMENTO);
    localStorage.setItem(
      "meusDados",
      JSON.stringify(mockMeusDadosDilogQualidade),
    );

    (getNotificacoes as jest.Mock).mockResolvedValue({
      data: mockGetNotificacoes,
      status: 200,
    });
    (getQtdNaoLidas as jest.Mock).mockResolvedValue({
      data: mockGetQtdNaoLidas,
      status: 200,
    });

    mock
      .onGet(`/cronogramas-semanais/${UUID}/`)
      .reply(200, mockCronogramaSemanalDetalhe);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("carrega e exibe o detalhamento do cronograma", async () => {
    await setup();

    await waitFor(() => {
      expect(screen.getByText("Status do Cronograma")).toBeInTheDocument();
    });
    expect(
      screen.getByText(mockCronogramaSemanalDetalhe.numero),
    ).toBeInTheDocument();
  });

  it("não exibe botão 'Ciente da Programação'", async () => {
    await setup();

    await waitFor(() => {
      expect(screen.getByText("Status do Cronograma")).toBeInTheDocument();
    });

    expect(screen.queryByText("Ciente da Programação")).not.toBeInTheDocument();
    expect(screen.getByTestId("voltar")).toBeInTheDocument();
  });

  it("permite Baixar PDF quando o status é Fornecedor Ciente", async () => {
    mock.reset();
    mock.onGet(`/cronogramas-semanais/${UUID}/`).reply(200, {
      ...mockCronogramaSemanalDetalhe,
      status: "Fornecedor Ciente",
    });

    await setup();

    await waitFor(() => {
      expect(screen.getByText("Status do Cronograma")).toBeInTheDocument();
    });

    expect(screen.getByText("Baixar PDF")).toBeInTheDocument();
    expect(screen.queryByText("Ciente da Programação")).not.toBeInTheDocument();
  });
});
