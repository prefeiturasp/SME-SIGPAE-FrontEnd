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
        screen.getAllByText("Edital de Pregão n° 36/SME/2022"),
      ).toHaveLength(2);
      expect(screen.getAllByText("303030A")).toHaveLength(2);
      expect(screen.getByText("CEU EMEI, EMEI")).toBeInTheDocument();
      expect(screen.getByText("EMEBS")).toBeInTheDocument();
      expect(
        screen.getAllByText("DIRETORIA REGIONAL DE EDUCACAO CAPELA DO SOCORRO"),
      ).toHaveLength(2);
      expect(screen.getAllByText("04")).toHaveLength(2);
    });
  });
});
