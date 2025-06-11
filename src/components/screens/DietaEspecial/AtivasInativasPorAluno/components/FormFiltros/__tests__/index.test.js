import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import thunk from "redux-thunk";
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

beforeAll(() => {
  Storage.prototype.getItem = jest.fn(() => "ADMIN");
});

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("FormFiltros - Integração completa", () => {
  it('deve permitir selecionar "BUTANTA", clicar em "Consultar" e "Limpar Filtros"', async () => {
    const store = mockStore({
      finalForm: {
        buscaAvancadaProduto: {
          dre: [],
          escola: [],
        },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FormFiltros
            setLoading={jest.fn()}
            setFiltros={jest.fn()}
            setDadosUsuario={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    const optionButanta = await screen.findByRole("option", {
      name: "BUTANTA",
    });
    expect(optionButanta).toBeInTheDocument();

    const seletor = optionButanta.closest("select");
    expect(seletor).toBeInTheDocument();

    fireEvent.change(seletor, { target: { value: "123" } });

    await waitFor(() => {
      expect(seletor.value).toBe("123");
    });

    const botaoConsultar = await screen.findByRole("button", {
      name: /consultar/i,
    });
    fireEvent.click(botaoConsultar);
    expect(botaoConsultar).toBeInTheDocument();

    const botaoLimpar = await screen.findByRole("button", {
      name: /limpar filtros/i,
    });
    fireEvent.click(botaoLimpar);
    expect(botaoLimpar).toBeInTheDocument();
  });
});
