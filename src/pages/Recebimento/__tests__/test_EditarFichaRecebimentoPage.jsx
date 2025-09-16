import {
  render,
  act,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import mock from "src/services/_mock";
import { MemoryRouter } from "react-router-dom";
import EditarFichaRecebimentoPage from "src/pages/Recebimento/FichaRecebimento/EditarFichaRecebimentoPage";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosDilogQualidade } from "src/mocks/meusDados/dilog-qualidade";

import { mockListaCronogramasRecebimento } from "src/mocks/cronograma.service/mockGetCronogramasRecebimento";
import { mockCronogramaCadastroRecebimento2 } from "src/mocks/cronograma.service/mockGetCronogramaCadastroRecebimento";
import { mockCadastroFichaRecebimento } from "src/mocks/services/fichaRecebimento.service/mockCadastroFichaRecebimento";
import { mockQuestoesPorCronograma2 } from "src/mocks/services/questoesConferencia.service/mockDetalharQuestoesPorCronograma";
import { mockGetFichaRecebimentoDetalhadaAssinada } from "src/mocks/services/fichaRecebimento.service/mockGetFichaRecebimentoDetalhada";

import { PERFIL, TIPO_PERFIL } from "src/constants/shared";

describe("Testar Edição de Fichas de Recebimento", () => {
  beforeEach(async () => {
    localStorage.setItem("perfil", PERFIL.DILOG_QUALIDADE);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.PRE_RECEBIMENTO);

    const search = `?uuid=${mockGetFichaRecebimentoDetalhadaAssinada.uuid}`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    mock
      .onGet("/cronogramas/lista-cronogramas-ficha-recebimento/")
      .reply(200, mockListaCronogramasRecebimento);

    mock
      .onGet(
        `/cronogramas/${mockListaCronogramasRecebimento.results[3].uuid}/dados-cronograma-ficha-recebimento/`
      )
      .reply(200, mockCronogramaCadastroRecebimento2);

    mock
      .onGet(`/questoes-por-produto/busca-questoes-cronograma/`)
      .reply(200, mockQuestoesPorCronograma2);

    mock.onPost("/rascunho-ficha-de-recebimento/").reply(201);

    mock
      .onPost("/fichas-de-recebimento/")
      .reply(201, mockCadastroFichaRecebimento);

    mock
      .onGet(
        `/fichas-de-recebimento/${mockGetFichaRecebimentoDetalhadaAssinada.uuid}/`
      )
      .reply(200, mockGetFichaRecebimentoDetalhadaAssinada);
    mock.onPut("/rascunho-ficha-de-recebimento/").reply(200);
    mock.onPut("/fichas-de-recebimento/").reply(200);
  });

  const setup = async () => {
    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosDilogQualidade,
              setMeusDados: jest.fn(),
            }}
          >
            <EditarFichaRecebimentoPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  };

  it("Testa a renderização dos elementos básicos da tela", async () => {
    await setup();

    await waitFor(() => {
      expect(
        screen.getByDisplayValue(
          mockGetFichaRecebimentoDetalhadaAssinada.dados_cronograma.numero
        )
      ).toBeInTheDocument();
    });
  });

  it("Valida que os campos cronograma e etapa estão desabilitados em modo de edição", async () => {
    await setup();

    await waitFor(() => {
      const cronogramaInput = screen.getByTestId("cronograma");
      expect(cronogramaInput).toHaveAttribute("disabled");

      const etapaSelect = screen.getByDisplayValue(/Etapa .* - Parte .*/);
      expect(etapaSelect).toHaveAttribute("disabled");
    });
  });

  it("Valida o funcionamento do botão Salvar Rascunho", async () => {
    await setup();

    await waitFor(() => {
      expect(screen.getByText("Salvar Rascunho")).toBeInTheDocument();
    });

    const btnSalvarRascunho = screen
      .getByText("Salvar Rascunho")
      .closest("button");
    fireEvent.click(btnSalvarRascunho);

    await waitFor(() => {
      expect(
        screen.getByText("Deseja salvar o rascunho da Ficha de Recebimento?")
      ).toBeInTheDocument();
    });

    const btnConfirmar = screen.getByText("Sim").closest("button");
    fireEvent.click(btnConfirmar);

    await waitFor(() => {
      expect(
        mock.history.put.some((call) =>
          call.url.includes("/rascunho-ficha-de-recebimento/")
        )
      ).toBe(true);
    });
  });

  it("Valida o funcionamento do botão Salvar e Assinar no step 3", async () => {
    await setup();

    await waitFor(() => {
      expect(screen.getByText("Próximo")).toBeInTheDocument();
    });

    const btnProximo1 = screen.getByText("Próximo").closest("button");
    fireEvent.click(btnProximo1);

    await waitFor(() => {
      expect(screen.getByText("Próximo")).toBeInTheDocument();
    });

    const btnProximo2 = screen.getByText("Próximo").closest("button");
    fireEvent.click(btnProximo2);

    await waitFor(() => {
      expect(screen.getByText("Salvar e Assinar")).toBeInTheDocument();
    });

    const btnSalvarAssinar = screen
      .getByText("Salvar e Assinar")
      .closest("button");
    fireEvent.click(btnSalvarAssinar);

    await waitFor(() => {
      expect(
        screen.getByText("Assinar Ficha de Recebimento")
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Você confirma o preenchimento correto de todas as informações solicitadas na ficha de recebimento?"
        )
      ).toBeInTheDocument();
    });

    const btnAssinar = screen.getByText("Sim, Assinar Ficha").closest("button");
    fireEvent.click(btnAssinar);

    const senhaInput = screen.getByPlaceholderText("Digite sua senha");
    fireEvent.change(senhaInput, { target: { value: "senha123" } });

    const btnConfirmar = screen.getByText("Confirmar").closest("button");
    fireEvent.click(btnConfirmar);

    await waitFor(() => {
      expect(
        mock.history.put.some((call) =>
          call.url.includes("/fichas-de-recebimento/")
        )
      ).toBe(true);
    });
  });
});
