import React from "react";
import "@testing-library/jest-dom";
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosDilogQualidade } from "src/mocks/meusDados/dilog-qualidade";
import RelatorioCronogramaSemanalPage from "src/pages/PreRecebimento/Relatorios/RelatorioCronogramaSemanalPage";
import {
  mockListagemRelatorioCronogramasSemanais,
  mockListagemRelatorioCronogramasSemanaisVazia,
} from "src/mocks/services/cronogramaSemanal.service";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import {
  getNotificacoes,
  getQtdNaoLidas,
} from "src/services/notificacoes.service";
import { mockGetNotificacoes } from "src/mocks/services/notificacoes.service/mockGetNotificacoes";
import { mockGetQtdNaoLidas } from "src/mocks/services/notificacoes.service/mockGetQtdNaoLidas";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";

jest.mock("src/components/Shareable/Toast/dialogs");
jest.mock("src/services/notificacoes.service");

const URL = "/cronogramas-semanais/listagem-relatorio/";

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
          <RelatorioCronogramaSemanalPage />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

describe("RelatorioCronogramaSemanalPage - Listagem", () => {
  beforeEach(() => {
    mock.reset();
    jest.clearAllMocks();

    localStorage.setItem("perfil", PERFIL.DILOG_QUALIDADE);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.PRE_RECEBIMENTO);
    // Evita que o Page.jsx busque "meus dados" via API durante o teste.
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
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("renderiza as linhas da listagem com os dados formatados", async () => {
    mock.onGet(URL).reply(200, mockListagemRelatorioCronogramasSemanais);
    await setup();

    expect(
      await screen.findByText("Empresa Alfa Alimentos LTDA"),
    ).toBeInTheDocument();
    expect(screen.getByText("Empresa Beta Comercio LTDA")).toBeInTheDocument();

    expect(
      screen.getByText("Arroz Parboilizado Tipo 1 Long..."),
    ).toBeInTheDocument();

    expect(screen.getByText("1.500,00 KG")).toBeInTheDocument();
    expect(screen.getByText("800,00 KG")).toBeInTheDocument();

    expect(screen.getByText("Assinado Fornecedor")).toBeInTheDocument();
    expect(screen.getByText("Enviado ao Fornecedor")).toBeInTheDocument();
  });

  it("expande apenas a linha selecionada, mesmo com número de cronograma repetido", async () => {
    mock.onGet(URL).reply(200, mockListagemRelatorioCronogramasSemanais);
    await setup();

    await screen.findByText("Empresa Alfa Alimentos LTDA");

    const icones = screen.getAllByTestId("icone-expandir");
    expect(icones).toHaveLength(2);

    fireEvent.click(icones[0]);

    expect(await screen.findByText("R$ 12,50")).toBeInTheDocument();
    expect(screen.queryByText("R$ 9,00")).not.toBeInTheDocument();
  });

  it("exibe as programações do cronograma expandido com períodos e quantidades", async () => {
    mock.onGet(URL).reply(200, mockListagemRelatorioCronogramasSemanais);
    await setup();

    await screen.findByText("Empresa Alfa Alimentos LTDA");
    fireEvent.click(screen.getAllByTestId("icone-expandir")[0]);

    await screen.findByText("R$ 12,50");

    expect(screen.getByText("Quantidade de Entrega")).toBeInTheDocument();
    expect(screen.getByText("Período Programado Inicial")).toBeInTheDocument();
    expect(screen.getByText("Período Programado Final")).toBeInTheDocument();

    expect(screen.getByText("01/01/2025")).toBeInTheDocument();
    expect(screen.getByText("07/01/2025")).toBeInTheDocument();
    expect(screen.getByText("08/01/2025")).toBeInTheDocument();
    expect(screen.getByText("500,00 KG")).toBeInTheDocument();
    expect(screen.getByText("1.000,00 KG")).toBeInTheDocument();

    // A programação do segundo cronograma não é renderizada.
    expect(screen.queryByText("02/02/2025")).not.toBeInTheDocument();
  });

  it("exibe 'Nenhum resultado encontrado' quando a lista vem vazia", async () => {
    mock.onGet(URL).reply(200, mockListagemRelatorioCronogramasSemanaisVazia);
    await setup();

    expect(
      await screen.findByText("Nenhum resultado encontrado"),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("icone-expandir")).not.toBeInTheDocument();
  });

  it("exibe toast de erro e não renderiza a listagem quando a requisição falha", async () => {
    mock.onGet(URL).reply(500);
    await setup();

    await waitFor(() => expect(toastError).toHaveBeenCalled());

    expect(
      screen.queryByText("Nenhum resultado encontrado"),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("icone-expandir")).not.toBeInTheDocument();
  });

  it("trata resposta 200 sem 'results' sem quebrar a tela", async () => {
    mock.onGet(URL).reply(200, { count: 5 });
    await setup();

    expect(
      await screen.findByText("Nenhum resultado encontrado"),
    ).toBeInTheDocument();
    expect(toastError).not.toHaveBeenCalled();
  });
});
