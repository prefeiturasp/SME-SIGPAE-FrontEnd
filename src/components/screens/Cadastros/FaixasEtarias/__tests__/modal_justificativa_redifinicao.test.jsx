import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import ModalJustificativa from "../ModalJustificativa";

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: () => (
    <textarea
      data-testid="redefinicao-justificativa-input"
      name="justificativa"
      required={true}
    />
  ),
}));

describe("Verifica os comportamento do modal de aviso de redefinição de faixas etárias", () => {
  const closeModal = jest.fn();
  const onSubmit = jest.fn();
  beforeEach(async () => {
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA
    );

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosCODAEGA,
              setMeusDados: jest.fn(),
            }}
          >
            <ModalJustificativa
              showModal={true}
              closeModal={closeModal}
              onSubmit={onSubmit}
            />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Verifica se o componente foi renderizado", () => {
    expect(
      screen.getByText(/redefinição de novas faixas etárias/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/sim/i)).toBeInTheDocument();
    expect(screen.getByText(/não/i)).toBeInTheDocument();
  });

  it("Cancela envio da justificativa de redefinição", async () => {
    const botao = screen.getByText(/não/i).closest("button");
    fireEvent.click(botao);
    await waitFor(() => {
      expect(closeModal).toHaveBeenCalled();
    });
  });

  it("Realiza envio da justificativa de redefinição", async () => {
    const textarea = screen.getByTestId("redefinicao-justificativa-input");
    fireEvent.change(textarea, {
      target: { value: "justificativa da alteração" },
    });
    await waitFor(() => {
      expect(textarea.value).toBe("justificativa da alteração");
    });

    const botao = screen.queryByText(/sim/i).closest("button");
    fireEvent.click(botao);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });
});
