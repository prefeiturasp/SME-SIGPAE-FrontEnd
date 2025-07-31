import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL } from "src/constants/shared";
import mock from "src/services/_mock";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import FaixasEtariasPage from "src/pages/Cadastros/FaixasEtariasPage";

describe("Verifica os comportamentos da exibição de resumo de faixas etárias", () => {
  beforeEach(async () => {
    mock.onGet("/faixas-etarias/").reply(200, mockFaixasEtarias);
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
            <FaixasEtariasPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Verifica se a interface foi renderizada com os dados corretamente", () => {
    expect(screen.getByText(/resumo do cadastro/i)).toBeInTheDocument();
    expect(screen.getByText(/tipos de faixas etárias/i)).toBeInTheDocument();
    expect(screen.getByText(/01 a 03 meses/i)).toBeInTheDocument();
    expect(
      screen.getByText(/redefinir/i).closest("button")
    ).toBeInTheDocument();
  });

  it("Executa ação de 'redefinir' faixas e recebe o modal de confirmação", async () => {
    const botao = screen.getByText(/redefinir/i).closest("button");
    fireEvent.click(botao);
    await waitFor(() => {
      expect(
        screen.getByText(
          /as faixas etárias já cadastradas serão alteradas após a finalização/i
        )
      ).toBeInTheDocument();
    });
  });
});
