import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosNutriSupervisao } from "src/mocks/meusDados/nutri-supervisao";
import { mockRelatorioGestaoDietasEspeciais } from "src/mocks/services/dietaEspecial.service/relatorioGestaoDietaEspecial";
import mock from "src/services/_mock";
import ModalRelatorioDietaEspecial from "../../components/ModalRelatorioDietaEspecial";

describe("Verifica comportamento de modal de relatório - Relatório Gestão de Dietas Especiais", () => {
  const closeModal = jest.fn();
  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosNutriSupervisao);
    mock
      .onPost("/solicitacoes-dieta-especial/relatorio-dieta-especial/")
      .reply(200, mockRelatorioGestaoDietasEspeciais);
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_SUPERVISAO_NUTRICAO);

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
              meusDados: mockMeusDadosNutriSupervisao,
              setMeusDados: jest.fn(),
            }}
          >
            <ModalRelatorioDietaEspecial
              showModal={true}
              closeModal={closeModal}
              setExibirModalCentralDownloads={jest.fn()}
              dadosRelatorio={mockRelatorioGestaoDietasEspeciais.results}
              setDadosRelatorio={jest.fn()}
              filtros={{
                dre: "8f1da4a7-11b6-4a09-9eaa-6633d066f26b",
                status: [
                  "CODAE_AUTORIZADO",
                  "CODAE_NEGOU_PEDIDO",
                  "CODAE_A_AUTORIZAR",
                ],
              }}
              totalResultados={
                mockRelatorioGestaoDietasEspeciais.results.length
              }
            />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Verifica renderização do componente de modal", () => {
    expect(screen.getByText("Relatório de dieta especial")).toBeInTheDocument();
    expect(
      screen.getAllByText("CIEJA ALUNA JESSICA NUNES HERCULANO")
    ).toHaveLength(2);
    expect(screen.getAllByText("DIRETORIA REGIONAL - DIRETA")).toHaveLength(2);
    expect(screen.getAllByText("18/12/2023")).toHaveLength(2);
    expect(screen.getByText("Exportar")).toBeInTheDocument();
    expect(screen.getByText("Voltar")).toBeInTheDocument();
  });

  it("Clica no botão voltar e verifica se foi chamado o método closeModal", () => {
    const botao = screen.getByText("Voltar").closest("button");
    fireEvent.click(botao);
    expect(closeModal).toHaveBeenCalled();
  });
});
