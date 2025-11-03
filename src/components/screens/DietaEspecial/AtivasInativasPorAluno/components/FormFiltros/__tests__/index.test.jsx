import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import * as escolaService from "src/services/escola.service";
import FormFiltros from "../index";

jest.mock("src/services/perfil.service", () => ({
  meusDados: jest.fn().mockResolvedValue({ tipo_perfil: "ADMIN" }),
  getAlunosListagem: jest.fn().mockResolvedValue({
    data: {
      results: [{ nome: "RAFAELLA BATISTA DOS SANTOS" }],
    },
  }),
  dadosDoAluno: jest.fn().mockResolvedValue({ status: 404 }),
}));

jest.mock("src/helpers/dietaEspecial", () => ({
  formFiltrosObtemDreEEscolasDietas: jest.fn(
    (setNomeEscolas, setEscolas, setDiretoriasRegionais) => {
      setNomeEscolas([]);
      setEscolas([]);
      setDiretoriasRegionais([{ value: "123", label: "BUTANTA" }]);
    }
  ),
  getDadosIniciais: jest.fn().mockResolvedValue({
    dre: ["uuid-dre"],
    escola: ["uuid-escola"],
  }),
}));

jest.mock("src/helpers/fieldValidators", () => ({
  length: () => undefined,
  requiredSearchSelectUnidEducDietas: () => () => undefined,
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
}));

jest.mock("src/components/Shareable/FinalFormToRedux", () => () => null);

jest.mock("src/services/escola.service", () => ({
  getEscolasTercTotal: jest.fn(),
}));

beforeAll(() => {
  Storage.prototype.getItem = jest.fn(() => "ADMIN");
});

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("FormFiltros - Integração completa", () => {
  let store;
  const setFiltros = jest.fn();
  beforeEach(async () => {
    store = mockStore({
      finalForm: {
        buscaAvancadaProduto: {
          dre: [],
          escola: [],
        },
      },
    });

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Provider store={store}>
            <MeusDadosContext.Provider
              value={{
                meusDados: mockMeusDadosCODAEGA,
                setMeusDados: jest.fn(),
              }}
            >
              <FormFiltros
                setLoading={jest.fn()}
                setFiltros={setFiltros}
                setDadosUsuario={jest.fn()}
              />
            </MeusDadosContext.Provider>
          </Provider>
        </MemoryRouter>
      );
    });
  });

  it('deve permitir selecionar "BUTANTA", clicar em "Consultar" e verificar chamada de setFiltros', async () => {
    const optionButanta = await screen.findByRole("option", {
      name: "BUTANTA",
    });
    expect(optionButanta).toBeInTheDocument();

    const seletor = optionButanta.closest("select");
    expect(seletor).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(seletor, { target: { value: "123" } });
    });

    await waitFor(() => {
      expect(seletor.value).toBe("123");
    });

    const botaoConsultar = await screen.findByRole("button", {
      name: /consultar/i,
    });
    expect(botaoConsultar).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(botaoConsultar);
    });

    await waitFor(() => {
      expect(setFiltros).toHaveBeenCalled();
    });
  });

  it('deve permitir preencher o código do aluno e clicar em "Limpar Filtros"', async () => {
    const codigoEOL = screen.getByTestId("codigo-eol-aluno");
    fireEvent.change(codigoEOL, {
      target: { value: "8081556" },
    });

    await waitFor(() => {
      expect(codigoEOL.value).toBe("8081556");
    });

    const botaoLimpar = await screen.findByRole("button", {
      name: /limpar filtros/i,
    });
    expect(botaoLimpar).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(botaoLimpar);
    });
  });

  it('não deve submeter o formulário ao clicar em "Limpar Filtros"', async () => {
    const botaoLimpar = await screen.findByRole("button", {
      name: /limpar filtros/i,
    });
    expect(botaoLimpar).toHaveAttribute("type", "button");

    const form = botaoLimpar.closest("form");
    expect(form).not.toBeNull();

    const onSubmitSpy = jest.fn((e) => e.preventDefault());
    form.addEventListener("submit", onSubmitSpy);

    await act(async () => {
      fireEvent.click(botaoLimpar);
    });

    await waitFor(() => {
      expect(onSubmitSpy).not.toHaveBeenCalled();
    });
  });

  it("exibe 'Carregando...' na UI enquanto carrega as escolas por DRE", async () => {
    let resolveRequest;
    const pending = new Promise((resolve) => (resolveRequest = resolve));
    escolaService.getEscolasTercTotal.mockReturnValue(pending);

    const optionButanta = await screen.findByRole("option", {
      name: "BUTANTA",
    });
    const selectDre = optionButanta.closest("select");
    await act(async () => {
      fireEvent.change(selectDre, { target: { value: "123" } });
    });

    const loadingText = await screen.findByText("Carregando...");
    expect(loadingText).toBeInTheDocument();

    await act(async () => {
      resolveRequest({
        data: [
          { uuid: "escola-1", nome: "EMEF ABC", codigo_eol: "000001" },
          { uuid: "escola-2", nome: "EMEF XYZ", codigo_eol: "000002" },
        ],
      });
    });

    await waitFor(() => {
      expect(screen.queryByText("Carregando...")).toBeNull();
    });
    expect(await screen.findByText(/Digite um nome/i)).toBeInTheDocument();
    expect(escolaService.getEscolasTercTotal).toHaveBeenCalledWith({
      dre: "123",
    });
  });
});
