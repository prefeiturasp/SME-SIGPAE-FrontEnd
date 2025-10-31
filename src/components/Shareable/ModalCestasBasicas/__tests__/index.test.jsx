import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import ModalCestasBasicas from "../index";

describe("Testes de comportamentos do componente - ModalCestasBasicas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-11-03T10:00:00Z"));
    localStorage.clear();
  });

  const setup = async () => {
    await act(async () => render(<ModalCestasBasicas />));
  };

  it("deve renderizar o modal quando localStorage não contém 'false'", () => {
    localStorage.setItem("modalCestas", "true");

    render(<ModalCestasBasicas />);

    expect(screen.getByTestId("modal-cestas")).toBeInTheDocument();
    expect(screen.getByText(/Cesta Básica/i)).toBeInTheDocument();
  });

  it("não deve renderizar o modal quando localStorage contém 'false'", async () => {
    localStorage.setItem("modalCestas", "false");

    await setup();

    expect(screen.queryByTestId("modal-cestas")).not.toBeInTheDocument();
  });

  it("deve fechar o modal ao clicar no botão de fechar e atualizar o localStorage", async () => {
    localStorage.setItem("modalCestas", "true");

    await setup();

    const botao = screen.getByRole("button", { name: /close/i });
    fireEvent.click(botao);

    await waitFor(() => {
      expect(localStorage.getItem("modalCestas")).toBe("false");
      expect(screen.queryByTestId("modal-cestas")).not.toBeInTheDocument();
    });
  });

  it("deve conter o texto informativo completo", async () => {
    await setup();

    expect(screen.getByText(/03\/11\/2025/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Rede Municipal de Ensino de São Paulo/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Cronograma de Entrega/i)).toBeInTheDocument();
    expect(
      screen.getByText(/smecodaecesta@sme.prefeitura.sp.gov.br/i),
    ).toBeInTheDocument();
  });
});
