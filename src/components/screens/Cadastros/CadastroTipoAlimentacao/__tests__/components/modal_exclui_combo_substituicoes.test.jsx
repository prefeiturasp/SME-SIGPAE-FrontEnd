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
import ModalExcluirComboSubstituicoes from "../../components/ModalExcluirComboSubstituicoes";

describe("Verifica os comportamento do componente de exclusão de combo de substituições", () => {
  const closeModal = jest.fn();
  const deletaComboSubstituicao = jest.fn();
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
            <ModalExcluirComboSubstituicoes
              showModal={true}
              closeModal={closeModal}
              deletaComboSubstituicao={deletaComboSubstituicao}
              combo={{
                label: "teste",
              }}
              indice={1}
            />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Verifica se o componente foi renderizado", () => {
    expect(
      screen.getByText(/tem certeza que deseja excluir essa combinação/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/confirmar/i)).toBeInTheDocument();
    expect(screen.getByText(/cancelar/i)).toBeInTheDocument();
  });

  it("Seleciona botão confirmar e verifica se funções foram chamadas.", async () => {
    const botaoConfirmar = screen.getByText(/confirmar/i).closest("button");
    fireEvent.click(botaoConfirmar);
    await waitFor(() => {
      expect(deletaComboSubstituicao).toHaveBeenCalled();
      expect(closeModal).toHaveBeenCalled();
    });
  });

  it("Seleciona botão cancelar e verifica se closeModal foi chamado.", async () => {
    const botaoConfirmar = screen.getByText(/cancelar/i).closest("button");
    fireEvent.click(botaoConfirmar);
    await waitFor(() => {
      expect(closeModal).toHaveBeenCalled();
    });
  });
});
