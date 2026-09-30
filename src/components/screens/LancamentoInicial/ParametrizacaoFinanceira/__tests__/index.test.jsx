import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosSuperUsuarioMedicao } from "src/mocks/meusDados/superUsuarioMedicao";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockGetGrupoUnidadeEscolar } from "src/mocks/services/escola.service/mockGetGrupoUnidadeEscolar";
import { mockListaNumeros } from "src/mocks/LancamentoInicial/CadastroDeClausulas/listaDeNumeros";
import { mockParametrizacoesFinanceiras } from "src/mocks/services/parametrizacao_financeira.service/mockGetParametrizacoesFinanceiras";
import ParametrizacaoFinanceira from "../index";
import mock from "src/services/_mock";

jest.mock("src/components/Shareable/DatePicker", () => ({
  InputComData: ({ input, placeholder }) => (
    <input
      data-testid={input.name}
      placeholder={placeholder}
      value={input.value}
      onChange={(e) => input.onChange(e.target.value)}
    />
  ),
}));

describe("Testes da interface de Listagem - Parametrização Financeira", () => {
  beforeEach(async () => {
    mock.onGet("/editais/lista-numeros/").reply(200, mockListaNumeros);
    mock
      .onGet("/grupos-unidade-escolar/")
      .reply(200, mockGetGrupoUnidadeEscolar);
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimples);
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosSuperUsuarioMedicao);
    mock
      .onGet("/medicao-inicial/parametrizacao-financeira/")
      .reply(200, mockParametrizacoesFinanceiras);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("perfil", PERFIL.ADMINITRADOR_MEDICAO);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.MEDICAO);

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
              meusDados: mockMeusDadosSuperUsuarioMedicao,
              setMeusDados: jest.fn(),
            }}
          >
            <ParametrizacaoFinanceira />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    mock.resetHandlers();
  });

  it("verifica se a interface foi renderizada", () => {
    expect(screen.getByText("Nº do Edital")).toBeInTheDocument();
    expect(screen.getByText("Lote e DRE")).toBeInTheDocument();
    expect(screen.getByText("Filtrar")).toBeInTheDocument();
    expect(screen.getByText("Limpar Filtros")).toBeInTheDocument();
    expect(screen.getByText("Adicionar Parametrização")).toBeInTheDocument();
  });

  const setSelect = (id, valor) => {
    const campo = screen.getByTestId(id);
    const select = campo.querySelector("select");
    fireEvent.change(select, {
      target: { value: valor },
    });
    return select;
  };

  const setData = async (placeholder, valor) => {
    const input = screen.getByTestId(placeholder);
    fireEvent.change(input, { target: { value: valor } });
    return input;
  };

  it("deve preencher campos, limpar filtros e verificar valores", async () => {
    const edital = setSelect(
      "edital-select",
      "752c11a3-b4fe-4f1c-b9af-61d42f0a6b56",
    );
    const data = setData("data_inicial", "01/09/2025");

    const botao = screen.getByText("Limpar Filtros").closest("button");
    await waitFor(() => {
      expect(botao).toBeInTheDocument();
      fireEvent.click(botao);
    });

    await waitFor(() => {
      expect(edital.value).toBe("");
      expect(data.value).toBe(undefined);
    });
  });

  it("deve preencher campos, clicar em filtrar e receber resultados", async () => {
    setSelect("edital-select", "752c11a3-b4fe-4f1c-b9af-61d42f0a6b56");
    setSelect("lote-select", "e67daf61-810c-45f0-8eeb-a75dbe4be608");
    setSelect("grupo-unidade-select", "3601dfe6-4dd5-4099-9607-00cbfd04f49e");
    setData("data_inicial", "01/09/2025");
    setData("data_final", "30/09/2025");

    const botao = screen.getByText("Filtrar").closest("button");
    await waitFor(() => {
      expect(botao).toBeInTheDocument();
      fireEvent.click(botao);
    });

    await waitFor(() => {
      expect(
        screen.getAllByText("Edital de Pregão n° 36/SME/2022").length,
      ).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("303030A").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("CEU EMEI, EMEI")).toBeInTheDocument();
      expect(screen.getByText("EMEBS")).toBeInTheDocument();
      expect(
        screen.getAllByText("DIRETORIA REGIONAL DE EDUCACAO CAPELA DO SOCORRO")
          .length,
      ).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("04").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("exibe a etiqueta PARAMETRIZAÇÃO VIGENTE somente na parametrização vigente", async () => {
    await waitFor(() => {
      expect(screen.getAllByText("PARAMETRIZAÇÃO VIGENTE")).toHaveLength(1);
    });

    const linhaDaTabela = (texto) =>
      screen
        .getAllByText(texto)
        .find((elemento) => elemento.closest("tbody"))
        .closest("tr");

    const linhaVigente = linhaDaTabela("Edital de Pregão n° 36/SME/2022");
    const linhaNaoVigente = linhaDaTabela("303030A");

    expect(linhaVigente).toHaveTextContent("PARAMETRIZAÇÃO VIGENTE");
    expect(linhaNaoVigente).not.toHaveTextContent("PARAMETRIZAÇÃO VIGENTE");
  });

  it("deve carregar opções dos selects de filtro", async () => {
    await waitFor(() => {
      const editalSelect = screen
        .getByTestId("edital-select")
        .querySelector("select");
      expect(editalSelect).not.toBeNull();
      expect(editalSelect.options.length).toBeGreaterThan(1);
      expect(editalSelect.options[1].text).toBe("1");

      const loteSelect = screen
        .getByTestId("lote-select")
        .querySelector("select");
      expect(loteSelect).not.toBeNull();
      expect(loteSelect.options.length).toBeGreaterThan(1);

      const grupoSelect = screen
        .getByTestId("grupo-unidade-select")
        .querySelector("select");
      expect(grupoSelect).not.toBeNull();
      expect(grupoSelect.options.length).toBeGreaterThan(1);
    });
  });

  it("ao selecionar edital, deve resetar campo lote", async () => {
    await waitFor(() => {
      const editalSelect = screen
        .getByTestId("edital-select")
        .querySelector("select");
      expect(editalSelect.options.length).toBeGreaterThan(1);
    });

    setSelect("edital-select", "752c11a3-b4fe-4f1c-b9af-61d42f0a6b56");

    await waitFor(() => {
      const loteSelect = screen
        .getByTestId("lote-select")
        .querySelector("select");
      expect(loteSelect.value).toBe("");
    });
  });
});

describe("Fluxos complementares da listagem - Parametrização Financeira", () => {
  const renderLista = async () => {
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
              meusDados: mockMeusDadosSuperUsuarioMedicao,
              setMeusDados: jest.fn(),
            }}
          >
            <ParametrizacaoFinanceira />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  };

  afterEach(() => {
    cleanup();
    mock.reset();
  });

  it("mostra o erro da API e o estado vazio", async () => {
    mock
      .onGet("/medicao-inicial/parametrizacao-financeira/")
      .reply(500, { detail: "falha" });
    await renderLista();

    expect(
      await screen.findByText(
        "Erro ao carregar parametrizações financeiras. Tente novamente mais tarde.",
      ),
    ).toBeInTheDocument();

    cleanup();
    mock.reset();
    mock.onGet("/medicao-inicial/parametrizacao-financeira/").reply(200, {
      count: 0,
      page_size: 10,
      results: [],
    });
    await renderLista();
    expect(
      await screen.findByText("Nenhum resultado encontrado"),
    ).toBeInTheDocument();
  });

  it("pagina os resultados e navega para o cadastro", async () => {
    mock.onGet("/medicao-inicial/parametrizacao-financeira/").reply(200, {
      ...mockParametrizacoesFinanceiras,
      count: 30,
      page_size: 10,
    });
    await renderLista();

    await screen.findByText("Parametrizações Cadastradas");
    const paginaDois = document.querySelector(".ant-pagination-item-2");
    fireEvent.click(paginaDois);

    await waitFor(() => {
      expect(paginaDois).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Adicionar Parametrização"));
  });
});
