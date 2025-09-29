import "@testing-library/jest-dom";
import { render, waitFor, act, screen } from "@testing-library/react";
import ModalRelatorio from "../../index";
import { ToastContainer } from "react-toastify";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

describe("ModalRelatorio - Erro ao buscar grupos", () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(async () => {
    mock.onGet("/grupos-unidade-escolar/").reply(400, {});

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ModalRelatorio
            show={true}
            onClose={mockOnClose}
            onSubmit={mockOnSubmit}
            nomeRelatorio="Relatório Unificado"
          />
          <ToastContainer />
        </MemoryRouter>
      );
    });
  });

  it("exibe mensagem de erro e fecha modal", async () => {
    await waitFor(() => {
      expect(
        screen.getByText(
          "Erro ao buscar grupos de unidade escolar. Tente novamente mais tarde."
        )
      ).toBeInTheDocument();
    });
    expect(mockOnClose).toHaveBeenCalled();
  });
});
