import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { PERFIL, TIPO_SERVICO } from "src/constants/shared";
import { mockListaUnidadesMedidaLogistica } from "src/mocks/cronograma.service/mockGetUnidadesDeMedidaLogistica";
import { mockListaFabricantes } from "src/mocks/produto.service/mockGetNomesFabricantes";
import { mockListaMarcas } from "src/mocks/produto.service/mockGetNomesMarcas";
import { mockListaInformacoesNutricionais } from "src/mocks/produto.service/mockGetInformacoesNutricionaisOrdenadas";
import { mockListaProdutosLogistica } from "src/mocks/produto.service/mockGetListaCompletaProdutosLogistica";
import { mockFichaTecnica } from "src/mocks/services/fichaTecnica.service/mockGetFichaTecnica";
import { mockFichaTecnicaComDetalheFLV } from "src/mocks/services/fichaTecnica.service/mockGetFichaTecnicaComAnalise";
import { mockMeusDadosFornecedor } from "src/mocks/services/perfil.service/mockMeusDados";
import { mockEmpresa } from "src/mocks/terceirizada.service/mockGetTerceirizadaUUID";
import CriarCopiaFichaTecnicaPage from "src/pages/PreRecebimento/FichaTecnica/CriarCopiaFichaTecnicaPage";
import mock from "src/services/_mock";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { exibeError } from "src/helpers/utilities";
import {
  CRIAR_COPIA_FICHA_TECNICA,
  FICHA_TECNICA,
  PRE_RECEBIMENTO,
} from "src/configs/constants";

jest.mock("src/components/Shareable/Toast/dialogs");
jest.mock("src/helpers/utilities", () => ({
  ...jest.requireActual("src/helpers/utilities"),
  exibeError: jest.fn(),
}));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const fichaAprovada = {
  ...mockFichaTecnica,
  tipo_entrega: "ARMAZEM",
  status: "Aprovada",
  fabricante: {
    ...mockFichaTecnica.fabricante,
    email: "fabricante@teste.com",
    telefone: "123456789",
  },
  envasador_distribuidor: {
    ...mockFichaTecnica.envasador_distribuidor,
    email: "envasador@teste.com",
    telefone: "123456789",
  },
};

interface ConfigurarMocksOptions {
  ficha?: Record<string, any>;
  statusAssinatura?: number;
}

const configurarMocks = ({
  ficha = fichaAprovada,
  statusAssinatura = 201,
}: ConfigurarMocksOptions = {}) => {
  mock.reset();

  mock
    .onGet(`/cadastro-produtos-edital/lista-completa-logistica/`)
    .reply(200, mockListaProdutosLogistica);
  mock.onGet(`/marcas/lista-nomes/`).reply(200, mockListaMarcas);
  mock.onGet(`/fabricantes/lista-nomes/`).reply(200, mockListaFabricantes);
  mock
    .onGet(`/informacoes-nutricionais/ordenadas/`)
    .reply(200, mockListaInformacoesNutricionais);
  mock
    .onGet(`/unidades-medida-logistica/lista-nomes-abreviacoes/`)
    .reply(200, mockListaUnidadesMedidaLogistica);
  mock.onGet(/^\/terceirizadas\/.*/).reply(200, mockEmpresa);
  mock.onGet(`/ficha-tecnica/${ficha.uuid}/`).reply(200, ficha);
  mock
    .onGet(ficha.arquivo)
    .reply(200, new Blob(["conteudo do pdf"], { type: "application/pdf" }));
  mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosFornecedor);
  mock.onGet("/api-version/").reply(200, {});
  mock.onGet("/notificacoes/").reply(200, {
    next: null,
    previous: null,
    count: 0,
    page_size: 4,
    results: [],
  });
  mock
    .onGet("/notificacoes/quantidade-nao-lidos/")
    .reply(200, { quantidade_nao_lidos: 0 });
  mock
    .onPost(`/rascunho-ficha-tecnica/`)
    .reply(201, { ...ficha, uuid: "novo-rascunho-uuid" });
  mock
    .onPost(`/ficha-tecnica/`)
    .reply(
      statusAssinatura,
      statusAssinatura === 201
        ? { uuid: "nova-ficha-uuid" }
        : { detail: "Senha inválida" },
    );
};

const setup = async (uuid: string | null = fichaAprovada.uuid) => {
  const query = uuid ? `?uuid=${uuid}` : "";

  window.history.pushState(
    {},
    "",
    `/${PRE_RECEBIMENTO}/${CRIAR_COPIA_FICHA_TECNICA}${query}`,
  );

  await act(async () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <MeusDadosContext.Provider
          value={{
            meusDados: mockMeusDadosFornecedor,
            setMeusDados: jest.fn(),
          }}
        >
          <CriarCopiaFichaTecnicaPage />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });

  await waitFor(() =>
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument(),
  );
};

const clicarBotao = (texto: string) => {
  fireEvent.click(screen.getByText(texto).closest("button") as HTMLElement);
};

const avancarParaUltimaEtapa = async () => {
  clicarBotao("Próximo");

  await screen.findByTestId("unidade_medida_porcao");

  screen.getAllByRole("textbox").forEach((input) => {
    fireEvent.change(input, { target: { value: "10" } });
  });

  const unidadeMedidaPorcao = screen
    .getByTestId("unidade_medida_porcao")
    .querySelector("select") as HTMLSelectElement;
  fireEvent.change(unidadeMedidaPorcao, {
    target: { value: mockListaUnidadesMedidaLogistica.results[0].uuid },
  });

  clicarBotao("Próximo");

  await screen.findByTestId("arquivo");
};

const avancarParaUltimaEtapaFLV = async () => {
  clicarBotao("Próximo");

  await screen.findByTestId("arquivo");
};

const getRotaCopiar = () => {
  let rota: { path: string; tipoUsuario: boolean } | undefined;

  jest.isolateModules(() => {
    const { rotasPreRecebimento } = require("src/configs/rotas/preRecebimento");
    rota = rotasPreRecebimento.find((r: { path: string }) =>
      r.path.endsWith(`/${CRIAR_COPIA_FICHA_TECNICA}`),
    );
  });

  return rota;
};

describe("CriarCopiaFichaTecnicaPage", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    (toastError as jest.Mock).mockClear();
    (exibeError as jest.Mock).mockClear();
    configurarMocks();
  });

  it("carrega a cópia com os dados da ficha aprovada preenchidos", async () => {
    await setup();

    expect(
      screen.getAllByText("Cópia da Ficha Técnica").length,
    ).toBeGreaterThan(0);
    expect(screen.getByTestId("produto")).toHaveValue("DOCE DE BANANA");
    expect(screen.getByTestId("pregao_chamada_publica")).toHaveValue(
      fichaAprovada.pregao_chamada_publica,
    );
    expect(screen.getByText("Cancelar Cópia")).toBeInTheDocument();
    expect(screen.getByText("Salvar Rascunho")).toBeInTheDocument();
  });

  it("cancela a cópia sem gravar ao clicar em Não", async () => {
    await setup();

    clicarBotao("Cancelar Cópia");
    expect(screen.getAllByText("Cancelar Cópia").length).toBeGreaterThan(0);
    expect(
      screen.getByText(
        "Você realmente deseja cancelar a Cópia da Ficha Técnica?",
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Não" }) as HTMLElement);

    expect(mock.history.post).toHaveLength(0);
    expect(mock.history.put).toHaveLength(0);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("confirma o cancelamento e volta para a listagem", async () => {
    await setup();

    clicarBotao("Cancelar Cópia");
    fireEvent.click(screen.getByRole("button", { name: "Sim" }) as HTMLElement);

    expect(mock.history.post).toHaveLength(0);
    expect(mock.history.put).toHaveLength(0);
    expect(mockNavigate).toHaveBeenCalledWith(
      `/${PRE_RECEBIMENTO}/${FICHA_TECNICA}`,
    );
  });

  it("salva a cópia como rascunho criando um novo registro", async () => {
    await setup();

    clicarBotao("Salvar Rascunho");

    await waitFor(() =>
      expect(
        mock.history.post.some((call) =>
          call.url.includes("/rascunho-ficha-tecnica/"),
        ),
      ).toBe(true),
    );

    expect(mock.history.put).toHaveLength(0);
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith(
        `/${PRE_RECEBIMENTO}/${FICHA_TECNICA}`,
      ),
    );
  });

  it("assina e envia a cópia criando um novo registro", async () => {
    await setup();

    await avancarParaUltimaEtapa();

    clicarBotao("Assinar e Enviar");

    expect(screen.getByText("Assinar Ficha Técnica")).toBeInTheDocument();
    clicarBotao("Sim, Assinar Ficha");

    expect(
      screen.getByText(/Confirme sua senha de acesso ao/i),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "123456" },
    });
    clicarBotao("Confirmar");

    await waitFor(() =>
      expect(
        mock.history.post.some((call) => call.url.includes("/ficha-tecnica/")),
      ).toBe(true),
    );

    expect(mock.history.put).toHaveLength(0);
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith(
        `/${PRE_RECEBIMENTO}/${FICHA_TECNICA}`,
      ),
    );
  });

  it("mantém a modal e não navega quando a senha é inválida", async () => {
    configurarMocks({ statusAssinatura: 401 });

    await setup();
    await avancarParaUltimaEtapa();

    clicarBotao("Assinar e Enviar");
    clicarBotao("Sim, Assinar Ficha");

    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "senha-errada" },
    });
    clicarBotao("Confirmar");

    await waitFor(() =>
      expect(
        mock.history.post.some((call) => call.url.includes("/ficha-tecnica/")),
      ).toBe(true),
    );

    await waitFor(() => expect(exibeError).toHaveBeenCalled());
    expect(
      screen.getByText(/Confirme sua senha de acesso ao/i),
    ).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalledWith(
      `/${PRE_RECEBIMENTO}/${FICHA_TECNICA}`,
    );
  });

  it("redireciona quando a ficha de origem não está aprovada", async () => {
    const fichaRascunho = { ...fichaAprovada, status: "Rascunho" };
    configurarMocks({ ficha: fichaRascunho });

    await setup(fichaRascunho.uuid);

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith(
        `/${PRE_RECEBIMENTO}/${FICHA_TECNICA}`,
      ),
    );
    expect(toastError).toHaveBeenCalledWith(
      "Somente fichas aprovadas podem ser copiadas.",
    );
  });

  it("redireciona quando não há uuid de origem", async () => {
    await setup(null);

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith(
        `/${PRE_RECEBIMENTO}/${FICHA_TECNICA}`,
      ),
    );
    expect(toastError).toHaveBeenCalledWith(
      "Selecione uma ficha aprovada para criar a cópia.",
    );
  });

  describe("FLV Ponto a Ponto", () => {
    const fichaFLV = {
      ...mockFichaTecnicaComDetalheFLV,
      status: "Aprovada",
    };

    beforeEach(() => {
      configurarMocks({ ficha: fichaFLV });
    });

    it("copia uma ficha FLV Ponto a Ponto", async () => {
      await setup(fichaFLV.uuid);

      expect(
        screen.getByText(/Fabricante, Produtor, Envasador/),
      ).toBeInTheDocument();
      expect(screen.queryByTestId("numero_registro")).not.toBeInTheDocument();

      await avancarParaUltimaEtapaFLV();

      clicarBotao("Assinar e Enviar");
      expect(screen.getByText("Assinar Ficha Técnica")).toBeInTheDocument();
      clicarBotao("Sim, Assinar Ficha");

      fireEvent.change(screen.getByTestId("password"), {
        target: { value: "123456" },
      });
      clicarBotao("Confirmar");

      await waitFor(() =>
        expect(
          mock.history.post.some((call) =>
            call.url.includes("/ficha-tecnica/"),
          ),
        ).toBe(true),
      );

      expect(mock.history.put).toHaveLength(0);
      await waitFor(() =>
        expect(mockNavigate).toHaveBeenCalledWith(
          `/${PRE_RECEBIMENTO}/${FICHA_TECNICA}`,
        ),
      );
    });
  });

  describe("permissões da rota", () => {
    beforeEach(() => {
      Object.defineProperty(global, "localStorage", {
        value: localStorageMock,
      });
      localStorage.clear();
    });

    afterEach(() => {
      localStorage.clear();
    });

    it("libera a rota para ADMINISTRADOR_EMPRESA", () => {
      localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_EMPRESA);
      localStorage.setItem("tipo_servico", TIPO_SERVICO.FORNECEDOR);

      expect(getRotaCopiar()?.tipoUsuario).toBe(true);
    });

    it("libera a rota para USUARIO_EMPRESA", () => {
      localStorage.setItem("perfil", PERFIL.USUARIO_EMPRESA);
      localStorage.setItem("tipo_servico", TIPO_SERVICO.FORNECEDOR);

      expect(getRotaCopiar()?.tipoUsuario).toBe(true);
    });

    it("bloqueia a rota para DILOG_QUALIDADE", () => {
      localStorage.setItem("perfil", PERFIL.DILOG_QUALIDADE);

      expect(getRotaCopiar()?.tipoUsuario).toBe(false);
    });
  });
});
