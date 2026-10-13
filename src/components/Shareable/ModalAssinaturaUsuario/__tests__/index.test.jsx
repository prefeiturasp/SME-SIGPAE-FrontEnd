import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { ModalAssinaturaUsuario } from "..";

const props = {
  show: true,
  handleClose: jest.fn(),
  handleSim: jest.fn(),
  loading: false,
  titulo: "Assinar Termo",
  texto: "Você confirma?",
};

describe("ModalAssinaturaUsuario", () => {
  it("reabre na etapa de confirmação após fechamento programático", async () => {
    const { rerender } = render(<ModalAssinaturaUsuario {...props} />);

    await act(async () => {
      fireEvent.click(screen.getByText("Sim, assinar cronograma"));
    });
    expect(screen.getByText("Confirme sua senha")).toBeInTheDocument();

    rerender(<ModalAssinaturaUsuario {...props} show={false} />);
    rerender(<ModalAssinaturaUsuario {...props} />);

    expect(screen.getByText("Assinar Termo")).toBeInTheDocument();
    expect(screen.getByText("Você confirma?")).toBeInTheDocument();
    expect(screen.queryByText("Confirme sua senha")).not.toBeInTheDocument();
  });
});
