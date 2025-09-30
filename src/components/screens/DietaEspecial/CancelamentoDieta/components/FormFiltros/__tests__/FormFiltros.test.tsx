import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { combineReducers, createStore } from "redux";
import { reducer as formReducer } from "redux-form";
import {
  formFiltrosObtemDreEEscolasNovo,
  getDadosIniciais,
} from "src/helpers/dietaEspecial";
import {
  getAlunosListagem,
  meusDados,
  obtemDadosAlunoPeloEOL,
} from "src/services/perfil.service";
import FormFiltros from "../index";

jest.mock("src/services/perfil.service");
jest.mock("src/helpers/dietaEspecial");
jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
}));

const setLoading = jest.fn();
const setFiltros = jest.fn();

function renderWithProviders({ store } = {}) {
  const rootReducer = combineReducers({
    loteForm: formReducer,
  });

  const testStore = store || createStore(rootReducer, {});

  return render(
    <Provider store={testStore}>
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <FormFiltros setLoading={setLoading} setFiltros={setFiltros} />
      </MemoryRouter>
    </Provider>
  );
}

describe("FormFiltros", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (meusDados as jest.Mock).mockResolvedValue({ id: 1 });
    (formFiltrosObtemDreEEscolasNovo as jest.Mock).mockImplementation(() => {});
    (getDadosIniciais as jest.Mock).mockResolvedValue({
      escola: ["1"],
      dre: [],
    });
    (getAlunosListagem as jest.Mock).mockResolvedValue({
      data: { results: [], count: 0 },
    });
  });

  it("renderiza campos principais", async () => {
    renderWithProviders();
    expect(await screen.findByText(/Diretoria Regional/i)).toBeInTheDocument();
    expect(screen.getByText(/Unidade Escolar/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Insira o Código/i)).toBeInTheDocument();
    expect(
      screen.getByTestId("input-nome-aluno").querySelector("input")
    ).toBeInTheDocument();
    expect(screen.getByText("Consultar")).toBeInTheDocument();
    expect(screen.getByText("Limpar Filtros")).toBeInTheDocument();
  });

  it("chama setFiltros no submit", async () => {
    renderWithProviders();

    const inputAluno = screen
      .getByTestId("input-nome-aluno")
      .querySelector("input");

    fireEvent.change(inputAluno, {
      target: { value: "João" },
    });

    fireEvent.click(screen.getByText("Consultar"));

    await waitFor(() => {
      expect(setFiltros).toHaveBeenCalledWith(
        expect.objectContaining({ nome_aluno: "João" })
      );
    });
  });

  it("chama form.reset no botão 'Limpar filtros'", async () => {
    renderWithProviders();

    const inputAluno = screen
      .getByTestId("input-nome-aluno")
      .querySelector("input");

    fireEvent.change(inputAluno, { target: { value: "Maria" } });
    expect((inputAluno as HTMLInputElement).value).toBe("Maria");

    fireEvent.click(screen.getByText("Limpar Filtros"));

    await waitFor(() => {
      expect((inputAluno as HTMLInputElement).value).toBe("");
    });
  });

  it("quando código eol inválido (<7 dígitos) não chama obtemDadosAlunoPeloEOL", async () => {
    renderWithProviders();
    const inputEol = screen.getByPlaceholderText("Insira o Código");

    fireEvent.change(inputEol, { target: { value: "123" } });

    await waitFor(() => {
      expect(obtemDadosAlunoPeloEOL).not.toHaveBeenCalled();
    });
  });

  it("quando código eol válido chama obtemDadosAlunoPeloEOL", async () => {
    (obtemDadosAlunoPeloEOL as jest.Mock).mockResolvedValue({
      data: { results: [], count: 0 },
    });

    renderWithProviders();
    const inputEol = screen.getByPlaceholderText("Insira o Código");

    fireEvent.change(inputEol, { target: { value: "1234567" } });

    await waitFor(() => {
      expect(obtemDadosAlunoPeloEOL).toHaveBeenCalledWith("1234567");
    });
  });
});
