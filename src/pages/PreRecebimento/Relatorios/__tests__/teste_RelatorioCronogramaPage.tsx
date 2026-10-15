import React from "react";
import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosDilogQualidade } from "src/mocks/meusDados/dilog-qualidade";
import RelatorioCronogramaPage from "src/pages/PreRecebimento/Relatorios/RelatorioCronogramaPage";
import { mockTerceirizadasEmpresasCronomagramas } from "src/mocks/cronograma.service/mockGetListaTerceirizadasEmpresasCronomagramas";
import { mockCadProdEditalCompletaLog } from "src/mocks/cronograma.service/mockGetListaCadProdEditalCompletaLog";
import { mockListaCronomagramasCadastro } from "src/mocks/cronograma.service/mockGetListaCronomagramasCadastro";
import {
  getNotificacoes,
  getQtdNaoLidas,
} from "src/services/notificacoes.service";
import { mockGetNotificacoes } from "src/mocks/services/notificacoes.service/mockGetNotificacoes";
import { mockGetQtdNaoLidas } from "src/mocks/services/notificacoes.service/mockGetQtdNaoLidas";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";

jest.mock("src/services/notificacoes.service");

const setup = async () => {
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
          <RelatorioCronogramaPage />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

describe("RelatorioCronogramaPage - Acesso DILOG_QUALIDADE", () => {
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
      .onGet("/terceirizadas/lista-empresas-cronograma/")
      .reply(200, mockTerceirizadasEmpresasCronomagramas);
    mock
      .onGet("/cadastro-produtos-edital/lista-completa-logistica/")
      .reply(200, mockCadProdEditalCompletaLog);
    mock
      .onGet("/cronogramas/lista-cronogramas-cadastro/")
      .reply(200, mockListaCronomagramasCadastro);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("permite o acesso ao relatório para o perfil DILOG_QUALIDADE", async () => {
    await setup();

    expect(await screen.findByText("Filtrar por Produto")).toBeInTheDocument();
    expect(screen.getByTestId("botao-filtrar")).toBeInTheDocument();
  });
});
