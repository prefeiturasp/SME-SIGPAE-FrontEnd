import "@testing-library/jest-dom";
import {
  act,
  render,
  screen,
  waitFor,
  fireEvent,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { DashboardCODAE } from "src/components/screens/DashboardCODAE";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEADMIN } from "src/mocks/meusDados/CODAE/admin";
import {
  getSolicitacoesCanceladasCodae,
  getSolicitacoesNegadasCodae,
  getSolicitacoesAutorizadasCodae,
  getSolicitacoesPendentesAutorizacaoCODAESecaoPendencias,
  getSolicitacoesComQuestionamentoCodae,
  getSolicitacoesPendentesAutorizacaoCodaeSemFiltro,
} from "src/services/painelCODAE.service";
import { TIPOS_SOLICITACAO_LISTA } from "src/constants/shared";

import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockDiretoriaRegionalSimplissima } from "src/mocks/diretoriaRegional.service/mockDiretoriaRegionalSimplissima";
import { mockListaEditais } from "src/mocks/produto.service/mockGetProdutosEditais";
import mock from "src/services/_mock";

jest.mock("src/services/painelCODAE.service");

jest.mock("src/helpers/corrigeDadosDoDashboard", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(true),
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
}));

const mockStore = configureStore([]);

const createMockResumoPendencias = () => {
  const resumo = {};
  TIPOS_SOLICITACAO_LISTA.forEach((card) => {
    if (card.titulo === "Kit Lanche Passeio") {
      resumo[card.titulo] = {
        TOTAL: 1,
        PRIORITARIO: 0,
        LIMITE: 0,
        REGULAR: 1,
      };
    } else {
      resumo[card.titulo] = {};
    }
  });
  return resumo;
};

const mockSolicitacoes = {
  results: [
    {
      id: 196,
      data_log: "22/10/2025",
      descricao: "1FEEF - 3567-3 - Kit Lanche Passeio",
      escola_nome: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
      tipo_doc: "KIT_LANCHE_AVULSA",
      desc_doc: "Kit Lanche Passeio",
      prioridade: "REGULAR",
    },
  ],
};

const formatarLotes = mockLotesSimples.results.map((lote) => ({
  value: lote.uuid,
  label: lote.nome,
}));

const formatarDREs = mockDiretoriaRegionalSimplissima.results.map((dre) => ({
  value: dre.uuid,
  label: dre.nome,
}));

const renderComponent = (props = {}) => {
  const store = mockStore({
    filtersAlimentacao: {
      dreAlimentacao: "",
      loteAlimentacao: "",
      tituloAlimentacao: "",
    },
  });

  const defaultProps = {
    meusDados: mockMeusDadosCODAEADMIN,
    lotes: formatarLotes,
    diretoriasRegionais: formatarDREs,
    cards: TIPOS_SOLICITACAO_LISTA,
    tiposSolicitacao: TIPOS_SOLICITACAO_LISTA,
    updateDREAlimentacao: jest.fn(),
    updateLoteAlimentacao: jest.fn(),
    updateTituloAlimentacao: jest.fn(),
    ...props,
  };

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <MeusDadosContext.Provider
          value={{ meusDados: mockMeusDadosCODAEADMIN }}
        >
          <DashboardCODAE {...defaultProps} />
        </MeusDadosContext.Provider>
      </MemoryRouter>
    </Provider>,
  );
};

const awaitServices = async () => {
  await waitFor(() => {
    expect(
      getSolicitacoesPendentesAutorizacaoCodaeSemFiltro,
    ).toHaveBeenCalled();
    expect(
      getSolicitacoesPendentesAutorizacaoCODAESecaoPendencias,
    ).toHaveBeenCalled();
    expect(getSolicitacoesAutorizadasCodae).toHaveBeenCalled();
    expect(getSolicitacoesCanceladasCodae).toHaveBeenCalled();
    expect(getSolicitacoesNegadasCodae).toHaveBeenCalled();
    expect(getSolicitacoesComQuestionamentoCodae).toHaveBeenCalled();
  });
};

describe("Dashboard CODAE - Gestão Alimentação", () => {
  beforeEach(() => {
    getSolicitacoesPendentesAutorizacaoCodaeSemFiltro.mockResolvedValue({
      data: { results: [] },
      status: 200,
    });

    getSolicitacoesAutorizadasCodae.mockResolvedValue({
      data: mockSolicitacoes,
      status: 200,
    });

    getSolicitacoesCanceladasCodae.mockResolvedValue({
      data: { results: [] },
      status: 200,
    });

    getSolicitacoesNegadasCodae.mockResolvedValue({
      data: { results: [] },
      status: 200,
    });

    getSolicitacoesComQuestionamentoCodae.mockResolvedValue({
      data: { results: [] },
      status: 200,
    });

    getSolicitacoesPendentesAutorizacaoCODAESecaoPendencias.mockResolvedValue({
      data: { results: createMockResumoPendencias() },
      status: 200,
    });

    mock
      .onGet("/produtos-editais/lista-nomes-unicos/")
      .reply(200, mockListaEditais);
  });

  it("renderiza o card de matriculados", async () => {
    await act(async () => {
      renderComponent();
    });

    await awaitServices();
    expect(screen.getByText("Nº de Matriculados")).toBeInTheDocument();
    expect(screen.getByText(/informação automática/i)).toBeInTheDocument();
  });

  it("renderiza a seção de pendências com cards", async () => {
    await act(async () => {
      renderComponent();
    });

    await awaitServices();

    const pendenciasSection = screen
      .getByText("Pendências")
      .closest(".card-body");
    expect(
      within(pendenciasSection).getByText("Inclusão de Alimentação"),
    ).toBeInTheDocument();
    expect(
      within(pendenciasSection).getByText("Alteração do tipo de Alimentação"),
    ).toBeInTheDocument();
    expect(
      within(pendenciasSection).getByText("Kit Lanche Passeio"),
    ).toBeInTheDocument();
    expect(
      within(pendenciasSection).getByText("Kit Lanche Unificado"),
    ).toBeInTheDocument();
    expect(
      within(pendenciasSection).getByText("Inversão de dia de Cardápio"),
    ).toBeInTheDocument();
  });

  it("renderiza filtros DRE e Lote", async () => {
    await act(async () => {
      renderComponent();
    });

    await awaitServices();

    expect(screen.getByText("Filtrar por DRE")).toBeInTheDocument();
    expect(screen.getByText("Filtrar por Lote")).toBeInTheDocument();
  });

  it("renderiza a seção de acompanhamento de solicitações", async () => {
    await act(async () => {
      renderComponent();
    });

    await awaitServices();
    expect(screen.getByText("Acompanhamento solicitações")).toBeInTheDocument();
    expect(screen.getByText("Aguardando Autorização")).toBeInTheDocument();
    expect(
      screen.getByText("Aguardando Resposta da Empresa"),
    ).toBeInTheDocument();
    expect(screen.getByText("Autorizadas")).toBeInTheDocument();
    expect(screen.getByText("Negadas")).toBeInTheDocument();
    expect(screen.getByText("Canceladas")).toBeInTheDocument();
  });

  it("mostra dados de solicitações nos cards", async () => {
    await act(async () => {
      renderComponent();
    });

    await awaitServices();
    expect(
      screen.getByText(
        "1FEEF - 3567-3 - Kit Lanche Passeio / EMEF PERICLES EUGENIO DA SILVA RAMOS",
      ),
    ).toBeInTheDocument();
  });

  it("aplica filtro de busca", async () => {
    jest.useFakeTimers();

    await act(async () => {
      renderComponent();
    });

    await awaitServices();

    const searchInputs = screen.getAllByPlaceholderText(/buscar|pesquisar/i);
    const searchInput = searchInputs[0];

    fireEvent.change(searchInput, { target: { value: "teste" } });
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    await waitFor(() => {
      expect(
        getSolicitacoesPendentesAutorizacaoCodaeSemFiltro,
      ).toHaveBeenCalled();
    });

    jest.useRealTimers();
  });

  it("lida com erro na correção do resumo", async () => {
    const { toastError } = require("src/components/Shareable/Toast/dialogs");
    const corrigeResumo = require("src/helpers/corrigeDadosDoDashboard");
    corrigeResumo.default.mockReturnValue(false);

    await act(async () => {
      renderComponent();
    });

    await awaitServices();
    expect(toastError).toHaveBeenCalledWith("Erro na inclusão de dados da CEI");
  });

  it("renderiza select de DRE vazio quando diretoriasRegionais é null", async () => {
    await act(async () => {
      renderComponent({ diretoriasRegionais: undefined });
    });

    await awaitServices();

    const dreSelect = screen.getByTestId("select-dre");
    expect(dreSelect).toBeInTheDocument();

    const options = within(dreSelect).queryAllByRole("option");
    expect(options.length).toBe(0);

    expect(dreSelect).not.toHaveTextContent(/filtrar por/i);
  });

  it("renderiza select de LOTE vazio quando lotes é null", async () => {
    await act(async () => {
      renderComponent({ lotes: undefined });
    });

    await awaitServices();

    const loteSelect = screen.getByTestId("select-lote");
    expect(loteSelect).toBeInTheDocument();

    const options = within(loteSelect).queryAllByRole("option");
    expect(options.length).toBe(0);

    expect(loteSelect).not.toHaveTextContent(/filtrar por/i);
  });
});
