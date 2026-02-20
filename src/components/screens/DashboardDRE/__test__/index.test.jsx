import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import { DashboardDRE } from "src/components/screens/DashboardDRE";
import { TIPOS_SOLICITACAO_LISTA } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosDRE } from "src/mocks/meusDados/diretoria_regional";
import {
  getSolicitacoesAguardandoCODAE,
  getSolicitacoesAutorizadasDRE,
  getSolicitacoesCanceladasDRE,
  getSolicitacoesNegadasDRE,
  getSolicitacoesPendentesDRE,
  getSolicitacoesPendentesValidacaoDRE,
} from "src/services/painelDRE.service";

import { mockDiretoriaRegionalSimplissima } from "src/mocks/diretoriaRegional.service/mockDiretoriaRegionalSimplissima";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockListaEditais } from "src/mocks/produto.service/mockGetProdutosEditais";
import mock from "src/services/_mock";

jest.mock("src/services/painelDRE.service");

jest.mock("src/helpers/corrigeDadosDoDashboard", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(true),
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
}));

const mockStore = configureStore([]);

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

  const mockMeusDados = {
    ...mockMeusDadosDRE,
    vinculo_atual: {
      ...mockMeusDadosDRE.vinculo_atual,
      instituicao: {
        ...mockMeusDadosDRE.vinculo_atual.instituicao,
        quantidade_alunos_terceirizada: 500,
        quantidade_alunos_parceira: 200,
      },
    },
  };

  const defaultProps = {
    meusDados: mockMeusDados,
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
        <MeusDadosContext.Provider value={{ meusDados: mockMeusDadosDRE }}>
          <DashboardDRE {...defaultProps} />
        </MeusDadosContext.Provider>
      </MemoryRouter>
    </Provider>,
  );
};

const awaitServices = async () => {
  await waitFor(() => {
    expect(getSolicitacoesPendentesDRE).toHaveBeenCalled();
    expect(getSolicitacoesCanceladasDRE).toHaveBeenCalled();
    expect(getSolicitacoesNegadasDRE).toHaveBeenCalled();
    expect(getSolicitacoesAutorizadasDRE).toHaveBeenCalled();
    expect(getSolicitacoesAguardandoCODAE).toHaveBeenCalled();
    expect(getSolicitacoesPendentesValidacaoDRE).toHaveBeenCalled();
  });
};

describe("Dashboard CODAE - Gestão Alimentação", () => {
  beforeEach(() => {
    getSolicitacoesPendentesValidacaoDRE.mockResolvedValue({
      data: { results: [] },
      status: 200,
    });

    getSolicitacoesAutorizadasDRE.mockResolvedValue({
      data: mockSolicitacoes,
      status: 200,
    });

    getSolicitacoesCanceladasDRE.mockResolvedValue({
      data: { results: [] },
      status: 200,
    });

    getSolicitacoesNegadasDRE.mockResolvedValue({
      data: { results: [] },
      status: 200,
    });

    getSolicitacoesAguardandoCODAE.mockResolvedValue({
      data: { results: [] },
      status: 200,
    });

    getSolicitacoesPendentesDRE.mockResolvedValue({
      data: { results: [] },
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
    expect(screen.getAllByText("Matriculados")).toHaveLength(2);
    expect(screen.getByText("Terceirizada Total")).toBeInTheDocument();
    expect(screen.getByText("Rede Parceira")).toBeInTheDocument();
    expect(screen.getByText(/informação automática/i)).toBeInTheDocument();
  });

  it("renderiza filtro por Lote", async () => {
    await act(async () => {
      renderComponent();
    });

    await awaitServices();

    expect(screen.getByText("Filtrar por Lote")).toBeInTheDocument();
  });

  it("renderiza a seção de acompanhamento de solicitações", async () => {
    await act(async () => {
      renderComponent();
    });

    await awaitServices();
    expect(screen.getByText("Acompanhamento solicitações")).toBeInTheDocument();
    expect(screen.getByText("Tipo de Solicitação")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Data do evento")).toBeInTheDocument();

    expect(screen.getByText("Aguardando Validação da DRE")).toBeInTheDocument();
    expect(screen.getByText("Aguardando Retorno de CODAE")).toBeInTheDocument();
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
});
