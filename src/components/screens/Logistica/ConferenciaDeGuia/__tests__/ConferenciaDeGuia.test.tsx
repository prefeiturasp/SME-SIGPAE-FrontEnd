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
import * as toastDialogs from "src/components/Shareable/Toast/dialogs";
import * as logisticaService from "src/services/logistica.service";
import ConferenciaGuia from "..";

jest.mock("src/services/logistica.service");
jest.mock("src/components/Shareable/Toast/dialogs");

const rootReducer = combineReducers({ form: formReducer });
const store = createStore(rootReducer);

const mockAlimentos = [
  {
    nome_alimento: "Arroz",
    embalagens: [
      {
        tipo_embalagem: "FECHADA",
        qtd_volume: 10,
        capacidade_completa: "10kg",
      },
      {
        tipo_embalagem: "FRACIONADA",
        qtd_volume: 5,
        capacidade_completa: "5kg",
      },
    ],
  },
  {
    nome_alimento: "Feijão",
    embalagens: [
      { tipo_embalagem: "FECHADA", qtd_volume: 8, capacidade_completa: "8kg" },
      {
        tipo_embalagem: "FRACIONADA",
        qtd_volume: 3,
        capacidade_completa: "3kg",
      },
    ],
  },
];

const mockGuia = {
  uuid: "uuid-123",
  numero_guia: "12345",
  data_entrega: "10/04/2026",
  status: "Pendente",
  alimentos: mockAlimentos,
};

const mockEdicao = {
  uuid: "uuid-edicao",
  hora_recebimento: "14:30",
  placa_veiculo: "ABC1234",
  data_recebimento: "09/04/2026",
  nome_motorista: "João Silva",
  guia: { ...mockGuia, status: "Recebida" },
};

describe("ConferenciaDeGuia", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    window.history.pushState({}, "", "/");
  });

  const renderComponent = async (url = "/?uuid=uuid-123") => {
    window.history.pushState({}, "", url);
    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <ConferenciaGuia />
          </MemoryRouter>
        </Provider>,
      );
    });
  };

  it("deve renderizar sem query params", async () => {
    await renderComponent("/");
    expect(screen.getByText(/A entrega foi bem sucedida/i)).toBeInTheDocument();
  });

  it("deve carregar guia para conferencia (fluxo novo)", async () => {
    (logisticaService.getGuiaParaConferencia as jest.Mock).mockResolvedValue({
      data: mockGuia,
    });
    await renderComponent();
    await waitFor(() => {
      expect(screen.getByDisplayValue("12345")).toBeInTheDocument();
    });
  });

  it("deve carregar conferencia para edicao (fluxo editar)", async () => {
    (logisticaService.getConferenciaParaEdicao as jest.Mock).mockResolvedValue({
      data: { results: mockEdicao },
    });
    await renderComponent("/?uuid=uuid-123&editar=true");
    await waitFor(() => {
      expect(screen.getByDisplayValue("João Silva")).toBeInTheDocument();
      expect(localStorage.getItem("conferenciaEdicao")).not.toBeNull();
    });
  });

  it("deve tratar erro ao carregar guia", async () => {
    (logisticaService.getGuiaParaConferencia as jest.Mock).mockRejectedValue({
      response: { data: { detail: "Erro ao carregar" } },
    });
    await renderComponent();
    await waitFor(() => {
      expect(toastDialogs.toastError).toHaveBeenCalledWith("Erro ao carregar");
    });
  });

  it("deve tratar erro ao carregar conferencia para edicao", async () => {
    (logisticaService.getConferenciaParaEdicao as jest.Mock).mockRejectedValue({
      response: { data: { detail: "Erro edição" } },
    });
    await renderComponent("/?uuid=uuid-123&editar=true");
    await waitFor(() => {
      expect(toastDialogs.toastError).toHaveBeenCalledWith("Erro edição");
    });
  });

  it("deve exibir campos de sucesso quando for 'Sim'", async () => {
    (logisticaService.getGuiaParaConferencia as jest.Mock).mockResolvedValue({
      data: mockGuia,
    });
    await renderComponent();
    await waitFor(() =>
      expect(screen.getByDisplayValue("12345")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText(/Sim, alimentos recebidos corretamente/i));
    expect(screen.getByText(/Nome do Motorista/i)).toBeInTheDocument();
  });

  it("deve gerenciar checkbox Todos (marcar e desmarcar)", async () => {
    (logisticaService.getGuiaParaConferencia as jest.Mock).mockResolvedValue({
      data: mockGuia,
    });
    await renderComponent();
    await waitFor(() =>
      expect(screen.getByDisplayValue("12345")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText(/Não. Há alimentos com problemas/i));

    const checkTodos = screen.getByLabelText("Todos");

    // Marcar todos
    fireEvent.click(checkTodos);
    expect(JSON.parse(localStorage.alimentosConferencia)).toHaveLength(2);

    // Desmarcar todos
    fireEvent.click(checkTodos);
    expect(JSON.parse(localStorage.alimentosConferencia)).toHaveLength(0);
  });

  it("deve gerenciar checkbox individual de alimento", async () => {
    (logisticaService.getGuiaParaConferencia as jest.Mock).mockResolvedValue({
      data: mockGuia,
    });
    await renderComponent();
    await waitFor(() =>
      expect(screen.getByDisplayValue("12345")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText(/Não. Há alimentos com problemas/i));

    const checkArroz = screen.getByLabelText("Arroz");
    fireEvent.click(checkArroz);
    expect(JSON.parse(localStorage.alimentosConferencia)).toContain("Arroz");
  });

  it("deve exibir link Continuar desabilitado quando nenhum alimento selecionado", async () => {
    (logisticaService.getGuiaParaConferencia as jest.Mock).mockResolvedValue({
      data: mockGuia,
    });
    await renderComponent();
    await waitFor(() =>
      expect(screen.getByDisplayValue("12345")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText(/Não. Há alimentos com problemas/i));

    const btnContinuar = screen.getByText("Continuar").closest("button")!;
    expect(btnContinuar).toBeDisabled();
  });

  it("deve habilitar link Continuar quando alimento selecionado", async () => {
    (logisticaService.getGuiaParaConferencia as jest.Mock).mockResolvedValue({
      data: mockGuia,
    });
    await renderComponent();
    await waitFor(() =>
      expect(screen.getByDisplayValue("12345")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText(/Não. Há alimentos com problemas/i));
    fireEvent.click(screen.getByLabelText("Arroz"));

    const btnContinuar = screen.getByText("Continuar").closest("button")!;
    expect(btnContinuar).not.toBeDisabled();
  });

  it("deve exibir uuidEdicao no link Continuar quando em modo edicao", async () => {
    (logisticaService.getConferenciaParaEdicao as jest.Mock).mockResolvedValue({
      data: {
        results: { ...mockEdicao, guia: { ...mockGuia, status: "Recebida" } },
      },
    });
    await renderComponent("/?uuid=uuid-123&editar=true");
    await waitFor(() =>
      expect(screen.getByDisplayValue("João Silva")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText(/Não. Há alimentos com problemas/i));
    fireEvent.click(screen.getByLabelText("Arroz"));

    const link = screen.getByText("Continuar").closest("a")!;
    expect(link.getAttribute("href")).toContain("editar=true");
  });
});
