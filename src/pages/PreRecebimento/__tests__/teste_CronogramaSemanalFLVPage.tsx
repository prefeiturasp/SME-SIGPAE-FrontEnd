import React from "react";
import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosDilogQualidade } from "src/mocks/meusDados/dilog-qualidade";
import CronogramaSemanalFLVPage from "src/pages/PreRecebimento/CronogramaSemanalFLVPage";
import { mockGetCronogramasSemanais } from "src/mocks/services/cronogramaSemanal.service/mockGetCronogramasSemanais";
import { mockGetCronogramasMensalAssinados2 } from "src/mocks/services/cronogramaSemanal.service/mockGetCronogramasMensalAssinados";
import { mockListaSimplesTerceirizadas } from "src/mocks/services/terceirizada.service/mockListaSimplesTerceirizadas";
import {
  getNotificacoes,
  getQtdNaoLidas,
} from "src/services/notificacoes.service";
import { mockGetNotificacoes } from "src/mocks/services/notificacoes.service/mockGetNotificacoes";
import { mockGetQtdNaoLidas } from "src/mocks/services/notificacoes.service/mockGetQtdNaoLidas";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";

window.HTMLElement.prototype.scrollIntoView = jest.fn();

jest.mock("src/services/notificacoes.service");

const mockarEndpointsCronograma = () => {
  mock.onGet("/cronogramas-semanais/").reply(200, mockGetCronogramasSemanais);
  mock
    .onGet("/cronogramas-semanais/cronogramas-mensal-assinados/")
    .reply(200, mockGetCronogramasMensalAssinados2);
  mock
    .onGet("/terceirizadas/lista-simples/")
    .reply(200, mockListaSimplesTerceirizadas);
};

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
          <CronogramaSemanalFLVPage />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

describe("CronogramaSemanalFLVPage - Permissões DILOG_QUALIDADE (somente visualização)", () => {
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

    mockarEndpointsCronograma();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("carrega a listagem de cronogramas", async () => {
    await setup();

    await waitFor(() => {
      expect(screen.getAllByText("001/2026P")).toHaveLength(10);
    });
  });

  it("não exibe o botão Cadastrar Cronograma", async () => {
    await setup();

    await waitFor(() => {
      expect(screen.getAllByText("001/2026P")).toHaveLength(10);
    });

    expect(screen.queryByText("Cadastrar Cronograma")).not.toBeInTheDocument();
  });

  it("não exibe a ação Editar nos cronogramas em rascunho", async () => {
    await setup();

    await waitFor(() => {
      expect(screen.getAllByText("Rascunho")).toHaveLength(10);
    });

    expect(screen.queryByTitle("Editar")).not.toBeInTheDocument();
  });

  it("exibe Detalhar e Imprimir, mas não Editar, em cronogramas não-rascunho", async () => {
    const mockCiente = {
      count: 1,
      results: [
        {
          uuid: "cronograma-ciente-1",
          numero: "999/2026P",
          produto: "PRODUTO TESTE",
          quantidade_total: "500.00",
          unidade_medida: "kg",
          empresa: "JP Alimentos",
          status: "Fornecedor Ciente",
        },
      ],
    };

    mock.reset();
    mock.onGet("/cronogramas-semanais/").reply(200, mockCiente);
    mock
      .onGet("/cronogramas-semanais/cronogramas-mensal-assinados/")
      .reply(200, mockGetCronogramasMensalAssinados2);
    mock
      .onGet("/terceirizadas/lista-simples/")
      .reply(200, mockListaSimplesTerceirizadas);

    await setup();

    await waitFor(() => {
      expect(screen.getByText("999/2026P")).toBeInTheDocument();
    });

    expect(screen.getByTitle("Detalhar")).toBeInTheDocument();
    expect(screen.getByTitle("Imprimir")).toBeInTheDocument();
    expect(screen.queryByTitle("Editar")).not.toBeInTheDocument();
  });
});
