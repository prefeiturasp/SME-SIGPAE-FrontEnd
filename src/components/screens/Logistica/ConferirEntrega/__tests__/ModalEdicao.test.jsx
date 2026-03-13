import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ModalEdicao from "../components/ModalEdicao";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Testes comportamentos Modal Edição - Conferir Entrega", () => {
  const uuid = "550e8400-e29b-41d4-a716-446655440000";

  const setup = () => {
    render(<ModalEdicao uuid={uuid} />);
  };

  it("deve abrir o modal ao clicar em Editar Conferência", async () => {
    setup();

    await userEvent.click(screen.getByText("Editar Conferência"));

    expect(
      screen.getByText(/Ao editar a conferência desta Guia de Remessa/i),
    ).toBeInTheDocument();
  });

  it("botão Não deve fechar o modal", async () => {
    setup();

    await userEvent.click(screen.getByText("Editar Conferência"));
    await userEvent.click(screen.getByRole("button", { name: "Não" }));

    await waitFor(() => {
      expect(
        screen.queryByText(/Ao editar a conferência desta Guia de Remessa/i),
      ).not.toBeInTheDocument();
    });
  });

  it("botão Sim deve navegar para edição da conferência", async () => {
    setup();

    await userEvent.click(screen.getByText("Editar Conferência"));
    await userEvent.click(screen.getByRole("button", { name: "Sim" }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      `/logistica/conferencia-guia?uuid=${uuid}&editar=true`,
    );
  });
});
