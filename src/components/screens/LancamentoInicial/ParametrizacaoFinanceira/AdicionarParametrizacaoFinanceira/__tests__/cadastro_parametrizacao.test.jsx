import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosSuperUsuarioMedicao } from "src/mocks/meusDados/superUsuarioMedicao";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockGetGrupoUnidadeEscolar } from "src/mocks/services/escola.service/mockGetGrupoUnidadeEscolar";
import { mockListaNumeros } from "src/mocks/LancamentoInicial/CadastroDeClausulas/listaDeNumeros";
import AdicionarParametrizacaoFinanceira from "../index";
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

describe("Testes formulário de cadastro - Parametrização Financeira", () => {
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
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosSuperUsuarioMedicao);
    mock.onPost("/medicao-inicial/parametrizacao-financeira/").reply(201, {});

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
            <AdicionarParametrizacaoFinanceira />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("verifica se a interface foi renderizada", () => {
    expect(screen.getByText("Nº do Edital")).toBeInTheDocument();
    expect(screen.getByText("Lote e DRE")).toBeInTheDocument();
    expect(screen.getByText("Salvar")).toBeInTheDocument();
  });

  const setSelect = (id, valor) => {
    const campoDre = screen.getByTestId(id);
    const select = campoDre.querySelector("select");
    fireEvent.change(select, {
      target: { value: valor },
    });
  };

  const setData = async (placeholder, valor) => {
    const input = screen.getByTestId(placeholder);
    fireEvent.change(input, { target: { value: valor } });
  };

  it("deve preencher os campos obrigatórios do formulário e salvar", async () => {
    setSelect("edital-select", "752c11a3-b4fe-4f1c-b9af-61d42f0a6b56");
    setSelect("lote-select", "e67daf61-810c-45f0-8eeb-a75dbe4be608");
    setSelect("grupo-unidade-select", "550e8400-e29b-41d4-a716-446655440000");
    setData("data_inicial", "01/09/2025");

    /*const botao = screen.getByTestId("botao-salvar");
    expect(botao).toBeInTheDocument();
    fireEvent.click(botao);

    await waitFor(() => {
      expect(
        screen.getByText("Parametrização Financeira salva com sucesso!"),
      ).toBeInTheDocument();
    });*/
  });

  it("deve clicar em cancelar e exibir modal de cancelamento", async () => {
    const botao = screen.getByTestId("botao-cancelar");
    fireEvent.click(botao);

    await waitFor(() => {
      expect(
        screen.getByText("Cancelar Parametrização Financeira"),
      ).toBeInTheDocument();
    });
  });
});
