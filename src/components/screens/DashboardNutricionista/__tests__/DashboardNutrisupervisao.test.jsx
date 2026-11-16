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
import { DashboardNutrisupervisao } from "src/components/screens/DashboardNutricionista/DashboardNutrisupervisao";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosNutriSupervisao } from "src/mocks/meusDados/nutri-supervisao";
import { mockListaEditais } from "src/mocks/produto.service/mockGetProdutosEditais";
import { mockItemInclusao } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockItens/mockItemInclusao";
import { mockItemInclusaoCEMEI } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockItens/mockItemInclusaoCEMEI";
import { mockItemInversaoCardapio } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockItens/mockItemInversaoCardapio";
import { mockItemKitLanche } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockItens/mockItemKitLanche";
import { mockItemKitLancheCEMEI } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockItens/mockItemKitLancheCEMEI";
import { filtersAlimentacaoReducer } from "src/reducers/filtersAlimentacaoReducer";
import { filtersDietaReducer } from "src/reducers/filtersDietaReducer";
import { filtersProdutoReducer } from "src/reducers/filtersProdutoReducer";
import mock from "src/services/_mock";

const URL_CANCELADAS = "/nutrisupervisao-solicitacoes/cancelados/";
const URL_NEGADAS = "/nutrisupervisao-solicitacoes/negados/";
const URL_AUTORIZADAS = "/nutrisupervisao-solicitacoes/autorizados/";
const URL_PENDENTES = "/nutrisupervisao-solicitacoes/pendentes-autorizacao/";
const URL_QUESTIONAMENTOS = "/nutrisupervisao-solicitacoes/questionamentos/";

const URLS_COM_PERIODO = [URL_CANCELADAS, URL_NEGADAS, URL_AUTORIZADAS];
const URLS_SEM_PERIODO = [URL_PENDENTES, URL_QUESTIONAMENTOS];
const TODAS_URLS = [...URLS_COM_PERIODO, ...URLS_SEM_PERIODO];

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
  [URL_PENDENTES]: mockItemInclusaoCEMEI,
  [URL_QUESTIONAMENTOS]: mockItemKitLanche,
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
            <DashboardNutrisupervisao />
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

const aguardarNovaBusca = async () => {
  await waitFor(
    () => expect(requisicoesPara(URL_AUTORIZADAS)).toHaveLength(2),
    { timeout: 2000 },
  );
};

describe("DashboardNutrisupervisao", () => {
  beforeEach(() => {
    mock.reset();

    TODAS_URLS.forEach((url) => {
      mock.onGet(url).reply(200, { results: [mockRespostas[url]] });
    });
    mock
      .onGet("/produtos-editais/lista-nomes-unicos/")
      .reply(200, mockListaEditais);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.SUPERVISAO_NUTRICAO);
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

    expect(screen.getByText("Aguardando Autorização")).toBeInTheDocument();
    expect(
      screen.getByText("Aguardando Resposta da Empresa"),
    ).toBeInTheDocument();
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
    jest.spyOn(Date.prototype, "getMonth").mockReturnValue(11);

    await setup();
    await aguardarCarregamento();

    URLS_COM_PERIODO.forEach((url) => {
      expect(ultimaRequisicaoPara(url).params).toEqual({
        limit: 6,
        offset: 0,
        periodo: 30,
      });
    });
    URLS_SEM_PERIODO.forEach((url) => {
      expect(ultimaRequisicaoPara(url).params).toEqual({ limit: 6, offset: 0 });
    });
  });

  it("envia período de 7 dias nos demais meses", async () => {
    jest.spyOn(Date.prototype, "getMonth").mockReturnValue(4);

    await setup();
    await aguardarCarregamento();

    URLS_COM_PERIODO.forEach((url) => {
      expect(ultimaRequisicaoPara(url).params).toEqual({
        limit: 6,
        offset: 0,
        periodo: 7,
      });
    });
    URLS_SEM_PERIODO.forEach((url) => {
      expect(ultimaRequisicaoPara(url).params).toEqual({ limit: 6, offset: 0 });
    });
  });

  it.each([
    [URL_CANCELADAS, "Erro ao carregar solicitações canceladas"],
    [URL_NEGADAS, "Erro ao carregar solicitações negadas"],
    [URL_AUTORIZADAS, "Erro ao carregar solicitações autorizadas"],
    [URL_PENDENTES, "Erro ao carregar solicitações aguardando autorização"],
    [
      URL_QUESTIONAMENTOS,
      "Erro ao carregar solicitações aguardando resposta da empresa",
    ],
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

    await aguardarNovaBusca();

    TODAS_URLS.forEach((url) => {
      expect(ultimaRequisicaoPara(url).params).toEqual({
        busca: "EMEF",
        limit: 6,
        offset: 0,
      });
    });
  });

  it("não envia o título quando há 2 caracteres ou menos e mantém o período padrão", async () => {
    jest.spyOn(Date.prototype, "getMonth").mockReturnValue(4);

    await setup();
    await aguardarCarregamento();

    fireEvent.change(screen.getByPlaceholderText("Pesquisar"), {
      target: { value: "EM" },
    });

    await aguardarNovaBusca();

    URLS_COM_PERIODO.forEach((url) => {
      expect(ultimaRequisicaoPara(url).params).toEqual({
        limit: 6,
        offset: 0,
        periodo: 7,
      });
    });
    URLS_SEM_PERIODO.forEach((url) => {
      expect(ultimaRequisicaoPara(url).params).toEqual({ limit: 6, offset: 0 });
    });
  });

  it("filtra pelo tipo de solicitação sem enviar o período padrão", async () => {
    await setup();
    await aguardarCarregamento();

    await userEvent.selectOptions(screen.getByRole("combobox"), "KIT_LANCHE");

    await aguardarNovaBusca();

    TODAS_URLS.forEach((url) => {
      expect(ultimaRequisicaoPara(url).params).toEqual({
        limit: 6,
        offset: 0,
        tipo_solicitacao: "KIT_LANCHE",
      });
    });
  });

  it("filtra pela data do evento convertendo para o formato da API", async () => {
    await setup();
    await aguardarCarregamento();

    fireEvent.change(screen.getByPlaceholderText("Data do evento"), {
      target: { value: "12/09/2026" },
    });

    await aguardarNovaBusca();

    TODAS_URLS.forEach((url) => {
      expect(ultimaRequisicaoPara(url).params).toEqual({
        limit: 6,
        offset: 0,
        data_evento: "2026-09-12",
      });
    });
  });
});
