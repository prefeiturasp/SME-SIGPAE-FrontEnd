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

describe("Verifica os comportamentos do formulário de edição de faixas etárias", () => {
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

  const iniciaRedefinicao = async () => {
    const botaoRedefinir = screen.getByText(/redefinir/i).closest("button");
    fireEvent.click(botaoRedefinir);
    await waitFor(() => {
      const botaoContinuar = screen.getByText(/continuar/i).closest("button");
      fireEvent.click(botaoContinuar);
    });
  };

  it("Inicia a redificação das faixas e verifica se a interface foi renderizada", async () => {
    await iniciaRedefinicao();
    expect(
      screen.getByText(/selecione um mês para começar uma faixa/i)
    ).toBeInTheDocument();
  });

  it("Inicia a redificação das faixas, faz o preenchimento do formulário e avança", async () => {
    await iniciaRedefinicao();
    const botaoRedefinir = screen.getByTestId("cancela-edicao-faixas-button");
    fireEvent.click(botaoRedefinir);
    await waitFor(() => {
      expect(screen.getByText(/resumo do cadastro/i)).toBeInTheDocument();
    });
  });

  const selecionaOpcaoFaixa = (valor) => {
    const opcao = screen.getByText(valor);
    fireEvent.click(opcao);
  };

  it("Inicia a redificação das faixas e retorna para tela de resumos", async () => {
    const opcaoesSelecionaveis = [
      { primeira: "00 meses", segunda: "01 ano e 02 meses" },
      { primeira: "01 ano e 03 meses", segunda: "02 anos e 05 meses" },
      { primeira: "02 anos e 06 meses", segunda: "03 anos e 08 meses" },
      { primeira: "03 anos e 09 meses", segunda: "04 anos e 11 meses" },
      { primeira: "05 anos", segunda: "06 anos" },
    ];

    await iniciaRedefinicao();
    opcaoesSelecionaveis.forEach(({ primeira, segunda }) => {
      selecionaOpcaoFaixa(primeira);
      selecionaOpcaoFaixa(segunda);
    });

    const botaoFinalizar = screen.getByTestId("finaliza-edicao-faixas-button");
    fireEvent.click(botaoFinalizar);

    await waitFor(() => {
      expect(
        screen.getByText(/redefinição de novas faixas etárias/i)
      ).toBeInTheDocument();
    });
  });
});
