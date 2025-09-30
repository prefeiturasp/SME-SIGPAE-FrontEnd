import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { combineReducers, createStore } from "redux";
import { reducer as formReducer } from "redux-form";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import { getSolicitacaoDietaEspecialListagem } from "src/services/dietaEspecial.service";
import CancelamentoDieta from "../index";

jest.mock("src/services/dietaEspecial.service");
jest.mock("src/helpers/utilities");
jest.mock("../components/FormFiltros", () => {
  const React = require("react");
  return (props: any) => {
    React.useEffect(() => {
      props.setFiltros({
        dre: ["1"],
        escola: ["1"],
        page: 1,
      });
    }, []);
    return <div data-testid="form-filtros-mock" />;
  };
});
jest.mock("../components/ListagemDietas", () => () => <div>Dieta Teste</div>);

jest.mock("src/components/Shareable/Paginacao", () => ({
  Paginacao: (props: any) => (
    <button onClick={() => props.onChange(2)}>2</button>
  ),
}));

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
        <CancelamentoDieta />
      </MemoryRouter>
    </Provider>
  );
}

describe("CancelamentoDieta", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    gerarParametrosConsulta.mockReturnValue({});
    getSolicitacaoDietaEspecialListagem.mockResolvedValue({
      data: { results: [], count: 0 },
    });
  });

  test("renderiza o componente inicial com loading", () => {
    renderWithProviders();
    expect(screen.getByText(/Carregando/)).toBeInTheDocument();
  });

  test("mensagem quando não existem dietas", async () => {
    gerarParametrosConsulta.mockReturnValue({});
    getSolicitacaoDietaEspecialListagem.mockResolvedValue({
      data: { results: [], count: 0 },
    });

    renderWithProviders();

    // `findByText` espera até que o nó apareça no DOM
    expect(
      await screen.findByText(/Não existem dados para filtragem informada/i)
    ).toBeInTheDocument();
  });

  test("renderiza lista de dietas e paginação", async () => {
    gerarParametrosConsulta.mockReturnValue({});
    getSolicitacaoDietaEspecialListagem.mockResolvedValueOnce({
      data: {
        results: [{ id: 1, id_externo: "123", aluno: { nome: "Dieta Teste" } }],
        count: 1,
      },
    });

    renderWithProviders();

    expect(await screen.findByText(/Dieta Teste/)).toBeInTheDocument();
  });

  test("ao trocar de página, chama novamente a API", async () => {
    gerarParametrosConsulta.mockReturnValue({});
    getSolicitacaoDietaEspecialListagem.mockResolvedValue({
      data: {
        results: [
          { id: 1, id_externo: "0001", aluno: { nome: "Aluno Teste" } },
        ],
        count: 15,
      },
    });

    renderWithProviders();

    await waitFor(() =>
      expect(getSolicitacaoDietaEspecialListagem).toHaveBeenCalled()
    );

    const pageBtn = screen.getByRole("button", { name: /2/ });
    await fireEvent.click(pageBtn);

    expect(getSolicitacaoDietaEspecialListagem).toHaveBeenCalledTimes(2);
  });
});
