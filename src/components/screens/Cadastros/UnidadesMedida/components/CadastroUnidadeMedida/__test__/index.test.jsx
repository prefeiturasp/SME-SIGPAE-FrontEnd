import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ToastContainer } from "react-toastify";
import { MemoryRouter } from "react-router-dom";
import HTTP_STATUS from "http-status-codes";
import UnidadeMedidaForm from "../index";
import mock from "src/services/_mock";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Testes de comportamento Cadastro de Unidades de Medida", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mock.resetHistory();
    mock.resetHandlers();
    window.history.pushState({}, "", "/");
  });

  const setup = () =>
    render(
      <MemoryRouter>
        <UnidadeMedidaForm />
        <ToastContainer />
      </MemoryRouter>,
    );

  const preencherFormulario = () => {
    fireEvent.change(
      screen.getByPlaceholderText("Digite o nome da Unidade de Medida"),
      { target: { value: "QUILOGRAMA" } },
    );

    fireEvent.change(screen.getByPlaceholderText("Digite a Abreviação"), {
      target: { value: "kg" },
    });
  };

  it("deve renderizar o formulário corretamente", () => {
    setup();

    expect(screen.getByText("Dados da Unidade de Medida")).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Digite o nome da Unidade de Medida"),
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Digite a Abreviação"),
    ).toBeInTheDocument();
  });

  it("deve abrir modal de salvar", () => {
    setup();

    preencherFormulario();

    fireEvent.click(screen.getByText("Salvar"));

    expect(
      screen.getByText("Confirma o cadastro da Unidade de Medida?"),
    ).toBeInTheDocument();
  });

  it("deve fechar modal de salvar ao clicar em 'Não'", async () => {
    setup();

    preencherFormulario();

    fireEvent.click(screen.getByText("Salvar"));
    fireEvent.click(screen.getByText("Não"));

    await waitFor(() => {
      expect(
        screen.queryByText("Confirma o cadastro da Unidade de Medida?"),
      ).not.toBeInTheDocument();
    });
  });

  it("deve cadastrar com sucesso", async () => {
    mock.onPost("/unidades-medida-logistica/").reply(HTTP_STATUS.CREATED, {});

    setup();

    preencherFormulario();

    fireEvent.click(screen.getByText("Salvar"));
    fireEvent.click(screen.getByText("Sim"));

    await waitFor(() => {
      expect(
        mock.history.post.find((req) =>
          req.url.includes("/unidades-medida-logistica/"),
        ),
      ).toBeTruthy();
    });
  });

  it("deve abrir modal de cancelar", () => {
    setup();

    fireEvent.click(screen.getByText("Cancelar"));

    expect(screen.getByText("Deseja cancelar o cadastro?")).toBeInTheDocument();
  });

  it("deve fechar modal de cancelar ao clicar em 'Não'", async () => {
    setup();

    fireEvent.click(screen.getByText("Cancelar"));
    fireEvent.click(screen.getByText("Não"));

    await waitFor(() => {
      expect(
        screen.queryByText("Deseja cancelar o cadastro?"),
      ).not.toBeInTheDocument();
    });
  });

  it("deve navegar ao confirmar cancelamento", async () => {
    setup();

    fireEvent.click(screen.getByText("Cancelar"));
    fireEvent.click(screen.getByText("Sim"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it("deve entrar em modo edição e carregar dados", async () => {
    window.history.pushState({}, "", "/?uuid=123");

    mock.onGet("/unidades-medida-logistica/123/").reply(HTTP_STATUS.OK, {
      nome: "QUILO",
      abreviacao: "kg",
      criado_em: "2024-01-01T00:00:00",
    });

    setup();

    await waitFor(() => {
      expect(screen.getByDisplayValue("QUILO")).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("kg")).toBeInTheDocument();
  });

  it("deve editar com sucesso", async () => {
    window.history.pushState({}, "", "/?uuid=123");

    mock.onGet("/unidades-medida-logistica/123/").reply(HTTP_STATUS.OK, {
      nome: "QUILO",
      abreviacao: "kg",
      criado_em: "2024-01-01T00:00:00",
    });

    mock.onPatch("/unidades-medida-logistica/123/").reply(HTTP_STATUS.OK, {});

    setup();

    await waitFor(() => {
      expect(screen.getByDisplayValue("QUILO")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Salvar"));
    fireEvent.click(screen.getByText("Sim"));

    await waitFor(() => {
      expect(
        mock.history.patch.find((req) =>
          req.url.includes("/unidades-medida-logistica/123/"),
        ),
      ).toBeTruthy();

      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it("deve tratar erro ao salvar", async () => {
    mock.onPost("/unidades-medida-logistica/").reply(400, {
      non_field_errors: ["erro qualquer"],
    });

    setup();

    preencherFormulario();

    fireEvent.click(screen.getByText("Salvar"));
    fireEvent.click(screen.getByText("Sim"));

    await waitFor(() => {
      expect(
        mock.history.post.find((req) =>
          req.url.includes("/unidades-medida-logistica/"),
        ),
      ).toBeTruthy();
    });
  });
});
