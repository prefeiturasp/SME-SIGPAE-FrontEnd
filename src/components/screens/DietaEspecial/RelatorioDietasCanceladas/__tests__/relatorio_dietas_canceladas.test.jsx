import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import mock from "src/services/_mock";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockFiltrosRelatorioDietasEspeciais } from "src/mocks/services/dietaEspecial.service/mockGetFiltrosRelatorioDietasEspeciais";
import { mockRelatorioDietasEpeciais } from "src/mocks/services/dietaEspecial.service/relatorioDietasEspeciaisTerceirizada";
import { RelatorioDietasCanceladas } from "..";
import { mockGetUnidadeEducacional } from "src/mocks/services/dietaEspecial.service/mockGetUnidadeEducacional";

describe("Verifica comportamentos do relatório de dietas canceladas", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    mock
      .onGet("/solicitacoes-dieta-especial/filtros-relatorio-dieta-especial/")
      .reply(200, mockFiltrosRelatorioDietasEspeciais);
    mock
      .onPost(
        "/solicitacoes-genericas/filtrar-solicitacoes-cards-totalizadores/"
      )
      .reply(200, { results: [{ "Rede Municipal de Educação": 28 }] });
    mock
      .onGet(
        "/solicitacoes-dieta-especial/relatorio-dieta-especial-terceirizada/"
      )
      .reply(200, mockRelatorioDietasEpeciais);
    mock
      .onPost("/escolas-simplissima-com-eol/terc-total/")
      .reply(200, mockGetUnidadeEducacional);

    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA
    );
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
            <RelatorioDietasCanceladas />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Verifica se o interface foi renderizada", () => {
    expect(screen.getByText("Filtrar Resultados")).toBeInTheDocument();
    expect(screen.getByText("Período de:")).toBeInTheDocument();
    expect(screen.getByText("Até:")).toBeInTheDocument();
    expect(screen.getByText("Filtrar")).toBeInTheDocument();
    expect(screen.getByText("Limpar Filtros")).toBeInTheDocument();
  });

  it("Seleciona Lote, clica em filtrar e verifica se registros foram exibidos", async () => {
    const lotesSelect = screen.getByText("Selecione lotes");
    fireEvent.click(lotesSelect);

    const todosOpcao = screen.getByText("Todos");
    fireEvent.click(todosOpcao);

    const botao = screen.getByText("Filtrar").closest("button");
    fireEvent.click(botao);

    await waitFor(() => {
      expect(
        screen.getByText("RHUAN ANGELLO FERREIRA ABREU")
      ).toBeInTheDocument();
      expect(screen.getByText("MARTIN ABREU GUIMARAES")).toBeInTheDocument();
    });
  });
});
