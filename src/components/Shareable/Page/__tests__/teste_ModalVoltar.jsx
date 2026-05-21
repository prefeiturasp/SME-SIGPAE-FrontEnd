import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ModalVoltar from "../ModalVoltar";

describe("Testa componente <ModalVoltar>", () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ModalVoltar
            modalVoltar={true}
            voltarPara="/"
            setModalVoltar={jest.fn()}
          />
        </MemoryRouter>,
      );
    });
  });

  it("Renderiza o modal corretamente", async () => {
    expect(screen.getByText("Voltar a tela anterior")).toBeInTheDocument();
    expect(
      screen.getByText("Deseja voltar para a tela anterior?"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Verifique se todas as informações importantes já foram salvas antes de sair.",
      ),
    ).toBeInTheDocument();
  });
});
