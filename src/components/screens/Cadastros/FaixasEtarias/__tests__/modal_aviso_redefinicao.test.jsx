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
import ModalAvisoRedefinicao from "../ModalAvisoRedefinicao";

describe("Verifica os comportamento do modal de aviso de redefinição de faixas etárias", () => {
  const closeModal = jest.fn();
  const onCancelar = jest.fn();
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
            <ModalAvisoRedefinicao
              showModal={true}
              closeModal={closeModal}
              onCancelar={onCancelar}
            />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Verifica se o componente foi renderizado", () => {
    expect(
      screen.getByText(
        /as faixas etárias já cadastradas serão alteradas após a finalização/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/redefinição de novas faixas etárias/i)
    ).toBeInTheDocument();
  });

  it("Seleciona botão confirmar e verifica se funções foram chamadas.", async () => {
    const botao = screen.getByText(/continuar/i).closest("button");
    fireEvent.click(botao);
    await waitFor(() => {
      expect(closeModal).toHaveBeenCalled();
    });
  });

  it("Seleciona botão cancelar e verifica se closeModal foi chamado.", async () => {
    const botao = screen.getByText(/cancelar/i).closest("button");
    fireEvent.click(botao);
    await waitFor(() => {
      expect(closeModal).toHaveBeenCalled();
    });
  });
});
