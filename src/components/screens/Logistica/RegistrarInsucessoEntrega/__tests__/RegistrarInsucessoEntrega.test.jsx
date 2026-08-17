import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { combineReducers, createStore } from "redux";
import { reducer as formReducer } from "redux-form";
import * as dialogs from "src/components/Shareable/Toast/dialogs";
import * as utilities from "src/helpers/utilities";
import * as logisticaService from "src/services/logistica.service";
import RegistrarInsucesso from "../index";

jest.mock("src/services/logistica.service");
jest.mock("src/helpers/utilities");
jest.mock("src/components/Shareable/Toast/dialogs");

jest.mock("src/components/Shareable/Input/InputHorario", () => ({
  InputHorario: ({ onChangeFunction, placeholder }) => (
    <input
      placeholder={placeholder}
      data-testid="input-horario"
      onChange={(e) => {
        if (e.target.value) {
          onChangeFunction(new Date("2024-01-01T10:00:00"));
        } else {
          onChangeFunction(null);
        }
      }}
    />
  ),
}));

const mockGuia = {
  numero_guia: "GUIA-001",
  data_entrega: "01/01/2024",
  nome_unidade: "Escola Teste",
  numero_requisicao: "REQ-001",
};

const preencherFormulario = () => {
  fireEvent.change(screen.getByRole("combobox"), {
    target: { value: "UNIDADE_FECHADA" },
  });

  const justificativa = screen
    .getByTestId("textarea-div")
    .querySelector("textarea");

  fireEvent.change(justificativa, {
    target: { value: "Justificativa de teste com texto suficiente." },
  });

  fireEvent.change(document.querySelector("[data-cy='nome_motorista']"), {
    target: { value: "Joao Silva" },
  });

  fireEvent.change(document.querySelector("[data-cy='placa_veiculo']"), {
    target: { value: "ABC1234" },
  });

  fireEvent.change(screen.getByTestId("input-horario"), {
    target: { value: "10:00" },
  });
};

describe("RegistrarInsucesso", () => {
  const mockGetGuia = logisticaService.getGuiaParaInsucesso;
  const mockRegistrar = logisticaService.registraInsucessoDeEntrega;
  const mockGerarParametros = utilities.gerarParametrosConsulta;
  const mockComposeValidators = utilities.composeValidators;

  const rootReducer = combineReducers({
    registrarInsucessoEntrega: formReducer,
  });
  const store = createStore(rootReducer, {});

  const mockNavigate = jest.fn();
  jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
  }));

  beforeEach(() => {
    jest.clearAllMocks();

    mockGerarParametros.mockImplementation((p) => p);
    mockComposeValidators.mockImplementation(
      (...validators) =>
        (value) =>
          validators.reduce(
            (error, validator) => error || validator(value),
            undefined,
          ),
    );

    mockGetGuia.mockResolvedValue({ data: mockGuia });
    mockRegistrar.mockResolvedValue({});

    dialogs.toastSuccess.mockImplementation(() => {});
    dialogs.toastError.mockImplementation(() => {});

    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  const renderComponent = async (route = "") => {
    window.history.pushState({}, "Test", route);

    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <RegistrarInsucesso />
          </MemoryRouter>
        </Provider>,
      );
    });
  };

  it("deve renderizar o formulário corretamente sem query params", async () => {
    await renderComponent();

    expect(screen.getByText("Registrar")).toBeInTheDocument();
    expect(screen.getByText("Voltar")).toBeInTheDocument();
  });

  it("deve carregar dados da guia quando uuid está na URL", async () => {
    await renderComponent("?uuid=abc-123");

    expect(mockGetGuia).toHaveBeenCalledWith({ uuid: "abc-123" });

    await waitFor(() => {
      expect(screen.getByDisplayValue("Escola Teste")).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("GUIA-001")).toBeInTheDocument();
    expect(screen.getByDisplayValue("REQ-001")).toBeInTheDocument();
    expect(screen.getByDisplayValue("01/01/2024")).toBeInTheDocument();
  });

  it("deve exibir toastError quando carregarGuia falha", async () => {
    mockGetGuia.mockRejectedValue({
      response: { data: { detail: "Erro ao carregar guia" } },
    });

    await renderComponent("?uuid=abc-erro");

    await waitFor(() => {
      expect(dialogs.toastError).toHaveBeenCalledWith("Erro ao carregar guia");
    });
  });

  it("deve abrir o modal ao clicar em Registrar", async () => {
    await renderComponent();

    const botaoRegistrar = screen.getByText("Registrar");
    expect(botaoRegistrar).toBeInTheDocument();
  });

  it("deve fechar o modal ao clicar em Não", async () => {
    await renderComponent("?uuid=abc-123");

    await waitFor(() => {
      expect(screen.getByDisplayValue("Escola Teste")).toBeInTheDocument();
    });

    preencherFormulario();

    await waitFor(() => {
      expect(
        screen.getByText("Registrar").closest("button"),
      ).not.toBeDisabled();
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Registrar"));
    });

    await waitFor(() => {
      expect(
        screen.getByText("Deseja registrar o insucesso de entrega?"),
      ).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Não"));
    });

    await waitFor(() => {
      expect(
        screen.queryByText("Deseja registrar o insucesso de entrega?"),
      ).not.toBeInTheDocument();
    });
  });

  it("deve registrar insucesso ao clicar em Sim", async () => {
    await renderComponent("?uuid=abc-123");

    await waitFor(() => {
      expect(screen.getByDisplayValue("Escola Teste")).toBeInTheDocument();
    });

    preencherFormulario();

    await waitFor(() => {
      expect(
        screen.getByText("Registrar").closest("button"),
      ).not.toBeDisabled();
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Registrar"));
    });

    await waitFor(() => {
      expect(
        screen.getByText("Deseja registrar o insucesso de entrega?"),
      ).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Sim"));
    });

    await waitFor(() => {
      expect(mockRegistrar).toHaveBeenCalled();
      expect(dialogs.toastSuccess).toHaveBeenCalledWith(
        "Insucesso de entrega registrado.",
      );
    });
  });

  it("deve exibir toastError quando registrar insucesso falha", async () => {
    mockRegistrar.mockRejectedValue({
      response: { data: { detail: "Erro ao registrar" } },
    });

    await renderComponent("?uuid=abc-123");

    await waitFor(() => {
      expect(screen.getByDisplayValue("Escola Teste")).toBeInTheDocument();
    });

    preencherFormulario();

    await waitFor(() => {
      expect(
        screen.getByText("Registrar").closest("button"),
      ).not.toBeDisabled();
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Registrar"));
    });

    await waitFor(() => {
      expect(
        screen.getByText("Deseja registrar o insucesso de entrega?"),
      ).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Sim"));
    });

    await waitFor(() => {
      expect(dialogs.toastError).toHaveBeenCalledWith("Erro ao registrar");
    });
  });
});
