import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockRelatorioRecreioNasFerias } from "src/mocks/services/dietaEspecial.service/relatorioRecreioNasFerias";
import { RelatorioRecreioFeriasPage } from "src/pages/DietaEspecial/RelatorioRecreioFeriasPage";
import mock from "src/services/_mock";

describe("Teste Relatório Recreio Férias - Usuário CODAE", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    mock
      .onGet("/solicitacoes-dieta-especial/relatorio-recreio-nas-ferias/")
      .reply(200, mockRelatorioRecreioNasFerias);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
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
            <RelatorioRecreioFeriasPage />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Renderiza título e breadcrumb `Relatório de Dietas para Recreio nas Férias`", () => {
    expect(
      screen.queryAllByText("Relatório de Dietas para Recreio nas Férias")
    ).toHaveLength(2);
  });

  it("Renderiza tabela", () => {
    expect(screen.getByText("0000001 - FULANO 01")).toBeInTheDocument();
    expect(screen.getByText("0000010 - FULANO 10")).toBeInTheDocument();
  });

  it("clica no collapse e gera protocolo", async () => {
    const elementICollapsed0 = screen.getByTestId("i-collapsed-0");
    fireEvent.click(elementICollapsed0);
    await waitFor(() => {
      expect(screen.getByText("ALERGIA A OVO")).toBeInTheDocument();
    });

    mock
      .onGet(
        `/solicitacoes-dieta-especial/${mockRelatorioRecreioNasFerias.results[0].uuid}/protocolo/`
      )
      .reply(200, new Blob(["conteúdo do PDF"], { type: "application/pdf" }));

    const botaoGerarProtocolo = screen.getByTestId("botao-gerar-protocolo-0");
    fireEvent.click(botaoGerarProtocolo);
  });
});
