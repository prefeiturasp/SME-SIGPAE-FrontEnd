import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { combineReducers, createStore } from "redux";
import { reducer as formReducer } from "redux-form";
import * as logisticaService from "src/services/logistica.service";
import Filtros from "../components/Filtros";

jest.mock("src/services/logistica.service");

jest.mock("src/components/Shareable/FinalForm/MultiSelect", () => ({
  __esModule: true,
  default: ({ input, options }: any) => (
    <select
      data-testid={`multiselect-${input.name}`}
      multiple
      value={input.value || []}
      onChange={(e) => {
        const selected = Array.from(e.target.selectedOptions).map(
          (o: any) => o.value,
        );
        input.onChange(selected);
      }}
    >
      {options.map((o: any) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  ),
}));

const rootReducer = combineReducers({ buscaSolicitacaoAlteracao: formReducer });
const store = createStore(rootReducer, {});

describe("Filtros - SolicitacaoAlteracao", () => {
  const mockSetFiltros = jest.fn();
  const mockSetSolicitacoes = jest.fn();
  const mockSetTotal = jest.fn();
  const inicioResultado = { current: null };

  beforeEach(() => {
    jest.clearAllMocks();
    (logisticaService.getNomesDistribuidores as jest.Mock).mockResolvedValue({
      data: { results: [] },
    });
  });

  const renderComponent = (props = {}) => {
    render(
      <Provider store={store}>
        <Filtros
          setFiltros={mockSetFiltros}
          setSolicitacoes={mockSetSolicitacoes}
          setTotal={mockSetTotal}
          inicioResultado={inicioResultado}
          {...props}
        />
      </Provider>,
    );
  };

  it("deve renderizar os campos e botões corretamente", () => {
    renderComponent();
    expect(screen.getByText("Consultar")).toBeInTheDocument();
    expect(screen.getByText("Limpar Filtros")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Digite o Nº da Solicitação"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Digite o Nº da Requisição"),
    ).toBeInTheDocument();
  });

  it("deve preencher o campo com numeroSolicitacaoInicial", () => {
    renderComponent({ numeroSolicitacaoInicial: "SOL-123" });
    expect(screen.getByDisplayValue("SOL-123")).toBeInTheDocument();
  });

  it("deve chamar setFiltros sem motivos ao submeter sem motivos", async () => {
    renderComponent();
    await act(async () => {
      fireEvent.submit(document.querySelector("form")!);
    });
    await waitFor(() => {
      expect(mockSetFiltros).toHaveBeenCalledWith(
        expect.not.objectContaining({ motivos: expect.anything() }),
      );
    });
  });

  it("deve chamar setSolicitacoes e setTotal com undefined ao limpar filtros", async () => {
    renderComponent();
    await act(async () => {
      fireEvent.click(screen.getByText("Limpar Filtros"));
    });
    expect(mockSetSolicitacoes).toHaveBeenCalledWith(undefined);
    expect(mockSetTotal).toHaveBeenCalledWith(undefined);
  });
});
