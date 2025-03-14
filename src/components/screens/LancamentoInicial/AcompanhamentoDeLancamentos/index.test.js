import React from "react";
import {
  fireEvent,
  act,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MeusDadosContext } from "context/MeusDadosContext";
import { AcompanhamentoDeLancamentos } from "./index";
import "@testing-library/jest-dom";
import { mockDiretoriaRegionalSimplissima } from "mocks/diretoriaRegional.service/mockDiretoriaRegionalSimplissima";
import { mockGetTiposUnidadeEscolar } from "mocks/services/cadastroTipoAlimentacao.service/mockGetTiposUnidadeEscolar";
import { mockMeusDadosSuperUsuarioMedicao } from "mocks/meusDados/superUsuarioMedicao";
import { mockGetMesesAnosSolicitacoesMedicaoinicial } from "mocks/services/medicaoInicial/dashboard.service/mockGetMesesAnosSolicitacoesMedicaoinicial";
import mock from "services/_mock";
import { mockGetDashboardMedicaoInicial } from "mocks/services/medicaoInicial/dashboard.service/mockGetDashboardMedicaoInicial";
import { mockGetDashboardMedicaoInicialNoresults } from "mocks/services/medicaoInicial/dashboard.service/mockGetDashboardMedicaoInicialNoresults";
import { mockGetEscolaTercTotal } from "mocks/services/escola.service/mockGetEscolasTercTotal";
import { mockGetLotesSimples } from "mocks/services/lote.service/mockGetLotesSimples";
import { localStorageMock } from "mocks/localStorageMock";
import { TIPO_PERFIL } from "constants/shared";

const renderComponent = async (
  mockMeusDados = mockMeusDadosSuperUsuarioMedicao
) => {
  await act(async () => {
    render(
      <MemoryRouter>
        <MeusDadosContext.Provider value={{ meusDados: mockMeusDados }}>
          <AcompanhamentoDeLancamentos />
        </MeusDadosContext.Provider>
      </MemoryRouter>
    );
  });

  await waitFor(() => {
    expect(
      screen.getByText("Selecione a DRE para visualizar os resultados")
    ).toBeInTheDocument();
  });
};

const selecionarDRE = async () => {
  await act(async () => {
    fireEvent.mouseDown(
      screen
        .getByTestId("select-diretoria-regional")
        .querySelector(".ant-select-selection-search-input")
    );
  });

  await waitFor(() => screen.getByText("IPIRANGA"));
  await act(async () => {
    fireEvent.click(screen.getByText("IPIRANGA"));
  });
};

const setupMocks = () => {
  mock
    .onGet("/diretorias-regionais-simplissima/")
    .reply(200, mockDiretoriaRegionalSimplissima);
  mock.onGet("/tipos-unidade-escolar/").reply(200, mockGetTiposUnidadeEscolar);
  mock
    .onGet("/medicao-inicial/solicitacao-medicao-inicial/meses-anos/")
    .reply(200, mockGetMesesAnosSolicitacoesMedicaoinicial);
  mock
    .onGet("/usuarios/meus-dados/")
    .reply(200, mockMeusDadosSuperUsuarioMedicao);
  mock
    .onGet("/medicao-inicial/solicitacao-medicao-inicial/dashboard/")
    .reply(200, mockGetDashboardMedicaoInicial);
  mock
    .onGet("/escolas-simplissima-com-dre-unpaginated/terc-total/")
    .reply(200, mockGetEscolaTercTotal);
  mock.onGet("/lotes-simples/").reply(200, mockGetLotesSimples);
};

const setupErrorMocks = (endpoint) => {
  mock.onGet(endpoint).reply(500);
};

describe("AcompanhamentoDeLancamentos", () => {
  beforeEach(async () => {
    setupMocks();
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.MEDICAO);
    await renderComponent();
  });

  afterEach(() => {
    mock.reset();
  });

  describe("Erros de API", () => {
    it("deve retornar erro quando falhar ao obter diretorias regionais", async () => {
      setupErrorMocks("/diretorias-regionais-simplissima/");
      await renderComponent();
      await waitFor(() => screen.getByText("Erro ao carregar DREs"));
      expect(screen.getByText("Erro ao carregar DREs")).toBeInTheDocument();
    });

    it("deve retornar erro quando falhar ao obter tipos de unidade escolar", async () => {
      setupErrorMocks("/tipos-unidade-escolar/");
      await renderComponent();
      await waitFor(() =>
        screen.getByText(
          "Erro ao carregar tipos de unidades. Tente novamente mais tarde."
        )
      );
      expect(
        screen.getByText(
          "Erro ao carregar tipos de unidades. Tente novamente mais tarde."
        )
      ).toBeInTheDocument();
    });

    it("deve retornar erro quando falhar ao obter meses e anos para solicitação de medição inicial", async () => {
      setupErrorMocks(
        "/medicao-inicial/solicitacao-medicao-inicial/meses-anos/"
      );
      await renderComponent();
      await waitFor(() =>
        screen.getByText(
          "Erro ao carregar meses/anos das solicitações de medição inicial. Tente novamente mais tarde."
        )
      );
      expect(
        screen.getByText(
          "Erro ao carregar meses/anos das solicitações de medição inicial. Tente novamente mais tarde."
        )
      ).toBeInTheDocument();
    });

    it("deve retornar erro quando falhar ao obter escolas simplificadas com DRE", async () => {
      setupErrorMocks("/escolas-simplissima-com-dre-unpaginated/terc-total/");

      await selecionarDRE();

      await waitFor(() =>
        screen.getByText(
          /Erro ao carregar escolas. Tente novamente mais tarde./
        )
      );
      expect(
        screen.getByText(
          /Erro ao carregar escolas. Tente novamente mais tarde./
        )
      ).toBeInTheDocument();
    });

    it("deve retornar erro quando falhar ao obter lotes simples", async () => {
      setupErrorMocks("/lotes-simples/");

      await selecionarDRE();

      await waitFor(() =>
        screen.getByText(/Erro ao carregar lotes. Tente novamente mais tarde./)
      );
      expect(
        screen.getByText(/Erro ao carregar lotes. Tente novamente mais tarde./)
      ).toBeInTheDocument();
    });

    it("deve retornar erro quando falhar ao obter dashboard de medição inicial", async () => {
      setupErrorMocks(
        "/medicao-inicial/solicitacao-medicao-inicial/dashboard/"
      );

      await selecionarDRE();

      await waitFor(() =>
        screen.getByText(
          /Erro ao carregados dashboard de medição inicial. Tente novamente mais tarde./
        )
      );
      expect(
        screen.getByText(
          /Erro ao carregados dashboard de medição inicial. Tente novamente mais tarde./
        )
      ).toBeInTheDocument();
    });
  });

  describe("Interações com a interface", () => {
    it("selecionar DRE Ipiranga", async () => {
      await selecionarDRE();

      expect(screen.getByText("Aprovado pela DRE")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Selecione os status acima para visualizar a listagem detalhada"
        )
      ).toBeInTheDocument();
    });

    it("deve exibir o modal filtragem com resultados", async () => {
      await selecionarDRE();

      const statusCard = screen.getByTestId("TODOS_OS_LANCAMENTOS");
      fireEvent.click(statusCard);

      const selectMesReferenciaDiv = screen.getByTestId(
        "div-select-mes-referencia"
      );
      const selectElementMesReferencia =
        selectMesReferenciaDiv.querySelector("select");
      fireEvent.change(selectElementMesReferencia, {
        target: { value: "03_2025" },
      });

      const botaoFiltrar = screen.getByText("Filtrar");
      await act(async () => {
        fireEvent.click(botaoFiltrar);
      });

      await waitFor(() => screen.getByText("Resultados"));
      expect(screen.getByText("Resultados")).toBeInTheDocument();
      expect(screen.getByText("Nome da UE")).toBeInTheDocument();
    });

    it("deve exibir o modal filtragem sem resultados", async () => {
      await selecionarDRE();

      const statusCard = screen.getByTestId("TODOS_OS_LANCAMENTOS");
      fireEvent.click(statusCard);

      const selectMesReferenciaDiv = screen.getByTestId(
        "div-select-mes-referencia"
      );
      const selectElementMesReferencia =
        selectMesReferenciaDiv.querySelector("select");
      fireEvent.change(selectElementMesReferencia, {
        target: { value: "03_2025" },
      });

      mock
        .onGet("/medicao-inicial/solicitacao-medicao-inicial/dashboard/")
        .reply(200, mockGetDashboardMedicaoInicialNoresults);

      const botaoFiltrar = screen.getByText("Filtrar");
      await act(async () => {
        fireEvent.click(botaoFiltrar);
      });

      await waitFor(() => screen.getByText("Nenhum resultado encontrado."));
      expect(
        screen.getByText("Nenhum resultado encontrado.")
      ).toBeInTheDocument();
    });

    it("deve limpar os filtros ao clicar no botão Limpar", async () => {
      await selecionarDRE();

      const statusCard = screen.getByTestId("TODOS_OS_LANCAMENTOS");
      fireEvent.click(statusCard);

      const selectMesReferenciaDiv = screen.getByTestId(
        "div-select-mes-referencia"
      );
      const selectElementMesReferencia =
        selectMesReferenciaDiv.querySelector("select");
      fireEvent.change(selectElementMesReferencia, {
        target: { value: "03_2025" },
      });

      const botaoLimpar = screen.getByText("Limpar");
      await act(async () => {
        fireEvent.click(botaoLimpar);
      });

      expect(selectElementMesReferencia.value).toBe("");
    });
  });
});
