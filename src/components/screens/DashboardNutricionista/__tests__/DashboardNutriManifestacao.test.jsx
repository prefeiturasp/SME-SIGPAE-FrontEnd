import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { combineReducers, legacy_createStore as createStore } from "redux";
import { DashboardNutrimanifestacao } from "src/components/screens/DashboardNutricionista/DashboardNutriManifestacao";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosNutriSupervisao } from "src/mocks/meusDados/nutri-supervisao";
import { mockListaEditais } from "src/mocks/produto.service/mockGetProdutosEditais";
import { mockItemInclusao } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockItens/mockItemInclusao";
import { mockItemInversaoCardapio } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockItens/mockItemInversaoCardapio";
import { mockItemKitLancheCEMEI } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockItens/mockItemKitLancheCEMEI";
import { filtersAlimentacaoReducer } from "src/reducers/filtersAlimentacaoReducer";
import { filtersDietaReducer } from "src/reducers/filtersDietaReducer";
import { filtersProdutoReducer } from "src/reducers/filtersProdutoReducer";
import mock from "src/services/_mock";

const URL_CANCELADAS = "/nutrimanifestacao-solicitacoes/cancelados/";
const URL_NEGADAS = "/nutrimanifestacao-solicitacoes/negados/";
const URL_AUTORIZADAS = "/nutrimanifestacao-solicitacoes/autorizados/";

const mockMeusDados = {
  ...mockMeusDadosNutriSupervisao,
  vinculo_atual: {
    ...mockMeusDadosNutriSupervisao.vinculo_atual,
    instituicao: {
      ...mockMeusDadosNutriSupervisao.vinculo_atual.instituicao,
      quantidade_alunos_terceirizada: 800000,
      quantidade_alunos_parceira: 173573,
    },
  },
};

const mockRespostas = {
  [URL_AUTORIZADAS]: mockItemInclusao,
  [URL_NEGADAS]: mockItemInversaoCardapio,
  [URL_CANCELADAS]: mockItemKitLancheCEMEI,
};

const textoDoCard = (item) => `${item.descricao} / ${item.escola_nome}`;

const requisicoesPara = (url) =>
  mock.history.get.filter((requisicao) => requisicao.url.endsWith(url));

const ultimaRequisicaoPara = (url) => requisicoesPara(url).slice(-1)[0];

const setup = async (meusDados = mockMeusDados) => {
  const store = createStore(
    combineReducers({
      filtersAlimentacao: filtersAlimentacaoReducer,
      filtersDieta: filtersDietaReducer,
      filtersProduto: filtersProdutoReducer,
    }),
  );

  await act(async () => {
    render(
      <Provider store={store}>
        <MemoryRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <MeusDadosContext.Provider value={{ meusDados }}>
            <DashboardNutrimanifestacao />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      </Provider>,
    );
  });
};

const aguardarCarregamento = async () => {
  expect(
    await screen.findByText("Acompanhamento solicitações"),
  ).toBeInTheDocument();
};

describe("DashboardNutrimanifestacao", () => {
  beforeEach(() => {
    mock.reset();

    Object.entries(mockRespostas).forEach(([url, item]) => {
      mock.onGet(url).reply(200, { results: [item] });
    });
    mock
      .onGet("/produtos-editais/lista-nomes-unicos/")
      .reply(200, mockListaEditais);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.NUTRICAO_MANIFESTACAO);
    localStorage.setItem("perfil", PERFIL.COORDENADOR_SUPERVISAO_NUTRICAO);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
  });

  it("renderiza o card de matriculados e os cards de status com as solicitações", async () => {
    await setup();
    await aguardarCarregamento();

    expect(screen.getByText("Terceirizada Total")).toBeInTheDocument();
    expect(screen.getByText(/^800[.,]000$/)).toBeInTheDocument();
    expect(screen.getByText("Rede Parceira")).toBeInTheDocument();
    expect(screen.getByText(/^173[.,]573$/)).toBeInTheDocument();

    expect(screen.getByText("Autorizadas")).toBeInTheDocument();
    expect(screen.getByText("Negadas")).toBeInTheDocument();
    expect(screen.getByText("Canceladas")).toBeInTheDocument();

    Object.values(mockRespostas).forEach((item) => {
      expect(screen.getByText(textoDoCard(item))).toBeInTheDocument();
    });

    expect(screen.getByText("Tipo de Solicitação")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Data do evento")).toBeInTheDocument();
  });

  it("não renderiza o card de matriculados quando não há dados do usuário", async () => {
    await setup(null);
    await aguardarCarregamento();

    expect(screen.queryByText("Terceirizada Total")).not.toBeInTheDocument();
    expect(screen.queryByText("Rede Parceira")).not.toBeInTheDocument();
  });

  it("envia período de 30 dias nos meses de maior demanda (janeiro, fevereiro, julho e dezembro)", async () => {
    jest.spyOn(Date.prototype, "getMonth").mockReturnValue(0);

    await setup();
    await aguardarCarregamento();

    [URL_CANCELADAS, URL_NEGADAS, URL_AUTORIZADAS].forEach((url) => {
      expect(ultimaRequisicaoPara(url).params).toEqual({
        limit: 6,
        offset: 0,
        periodo: 30,
      });
    });
  });

  it("envia período de 7 dias nos demais meses", async () => {
    jest.spyOn(Date.prototype, "getMonth").mockReturnValue(2);

    await setup();
    await aguardarCarregamento();

    [URL_CANCELADAS, URL_NEGADAS, URL_AUTORIZADAS].forEach((url) => {
      expect(ultimaRequisicaoPara(url).params).toEqual({
        limit: 6,
        offset: 0,
        periodo: 7,
      });
    });
  });

  it.each([
    [URL_CANCELADAS, "Erro ao carregar solicitações canceladas"],
    [URL_NEGADAS, "Erro ao carregar solicitações negadas"],
    [URL_AUTORIZADAS, "Erro ao carregar solicitações autorizadas"],
  ])("exibe mensagem de erro quando a rota %s falha", async (url, mensagem) => {
    mock.onGet(url).reply(400, {});

    await setup();

    expect(await screen.findByText(mensagem)).toBeInTheDocument();
    expect(
      screen.queryByText("Acompanhamento solicitações"),
    ).not.toBeInTheDocument();
  });

  it("pesquisa pelo título quando há mais de 2 caracteres", async () => {
    await setup();
    await aguardarCarregamento();

    fireEvent.change(screen.getByPlaceholderText("Pesquisar"), {
      target: { value: "EMEF" },
    });

    await waitFor(
      () => expect(requisicoesPara(URL_AUTORIZADAS)).toHaveLength(2),
      {
        timeout: 2000,
      },
    );

    [URL_CANCELADAS, URL_NEGADAS, URL_AUTORIZADAS].forEach((url) => {
      expect(ultimaRequisicaoPara(url).params).toEqual({
        busca: "EMEF",
        limit: 6,
        offset: 0,
      });
    });
  });

  it("não envia o título quando há 2 caracteres ou menos e mantém o período padrão", async () => {
    jest.spyOn(Date.prototype, "getMonth").mockReturnValue(2);

    await setup();
    await aguardarCarregamento();

    fireEvent.change(screen.getByPlaceholderText("Pesquisar"), {
      target: { value: "EM" },
    });

    await waitFor(
      () => expect(requisicoesPara(URL_AUTORIZADAS)).toHaveLength(2),
      {
        timeout: 2000,
      },
    );

    [URL_CANCELADAS, URL_NEGADAS, URL_AUTORIZADAS].forEach((url) => {
      expect(ultimaRequisicaoPara(url).params).toEqual({
        limit: 6,
        offset: 0,
        periodo: 7,
      });
    });
  });

  it("filtra pelo tipo de solicitação sem enviar o período padrão", async () => {
    await setup();
    await aguardarCarregamento();

    await userEvent.selectOptions(screen.getByRole("combobox"), "Inversão");

    await waitFor(
      () => expect(requisicoesPara(URL_AUTORIZADAS)).toHaveLength(2),
      {
        timeout: 2000,
      },
    );

    [URL_CANCELADAS, URL_NEGADAS, URL_AUTORIZADAS].forEach((url) => {
      expect(ultimaRequisicaoPara(url).params).toEqual({
        limit: 6,
        offset: 0,
        tipo_solicitacao: "Inversão",
      });
    });
  });

  it("filtra pela data do evento convertendo para o formato da API", async () => {
    await setup();
    await aguardarCarregamento();

    fireEvent.change(screen.getByPlaceholderText("Data do evento"), {
      target: { value: "12/09/2026" },
    });

    await waitFor(
      () => expect(requisicoesPara(URL_AUTORIZADAS)).toHaveLength(2),
      {
        timeout: 2000,
      },
    );

    [URL_CANCELADAS, URL_NEGADAS, URL_AUTORIZADAS].forEach((url) => {
      expect(ultimaRequisicaoPara(url).params).toEqual({
        limit: 6,
        offset: 0,
        data_evento: "2026-09-12",
      });
    });
  });
});
