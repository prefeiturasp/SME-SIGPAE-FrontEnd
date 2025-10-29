import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockRelatorioAlunosMatriculadosCODAEFiltros } from "src/mocks/services/alunosMatriculados.service/CODAE/filtros";
import RelatorioAlunosMatriculadosPage from "src/pages/Relatorios/RelatorioAlunosMatriculadosPage";
import mock from "src/services/_mock";

describe("Teste Relatório Alunos Matriculados - Usuário CODAE - Filtros", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    mock.onGet("/faixas-etarias/").reply(200, mockFaixasEtarias);
    mock
      .onGet(`/relatorio-alunos-matriculados/filtros/`)
      .reply(200, mockRelatorioAlunosMatriculadosCODAEFiltros);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
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
            <ToastContainer />
            <RelatorioAlunosMatriculadosPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("Deve renderizar os filtros corretamente", async () => {
    expect(screen.getByText("DRE")).toBeInTheDocument();
    expect(screen.getByText("Lote")).toBeInTheDocument();
    expect(screen.getByText("Tipo de Unidade")).toBeInTheDocument();
    expect(screen.getByText("Tipo de Turma")).toBeInTheDocument();
    expect(screen.getByText("Unidade Educacional")).toBeInTheDocument();
  });

  it("Deve filtrar tipos de unidade corretamente", async () => {
    const selectDREs = screen.getByTestId("select-dres");
    const selectControlDRE = within(selectDREs).getByRole("combobox");
    fireEvent.mouseDown(selectControlDRE);

    const optionBUTANTA = screen.getByText("BUTANTA");
    fireEvent.click(optionBUTANTA);

    const selectLotes = screen.getByTestId("select-lotes");
    const selectControlLote = within(selectLotes).getByRole("combobox");
    fireEvent.mouseDown(selectControlLote);

    const optionLOTE1 = screen.getByText("LOTE 01");
    fireEvent.click(optionLOTE1);

    const selectUnidadeEducacional = screen.getByTestId(
      "select-unidades-educacionais",
    );
    const selectControlUE = within(selectUnidadeEducacional).getByRole(
      "combobox",
    );
    fireEvent.mouseDown(selectControlUE);

    const optionEMEFARTHURWHITAKERDES = screen.getByText(
      "EMEF ARTHUR WHITAKER, DES.",
    );
    fireEvent.click(optionEMEFARTHURWHITAKERDES);

    const selectTiposTurmas = screen.getByTestId("select-tipos-turmas");
    const selectControlTipoTurma =
      within(selectTiposTurmas).getByRole("combobox");
    fireEvent.mouseDown(selectControlTipoTurma);

    const optionREGULAR = screen.getByText("REGULAR");
    fireEvent.click(optionREGULAR);

    const selectTipoUnidade = screen.getByTestId("select-tipos-unidades");
    const selectControlTipoUnidade =
      within(selectTipoUnidade).getByRole("combobox");
    fireEvent.mouseDown(selectControlTipoUnidade);

    const optionEMEFPFOM = screen.getByText("EMEF P FOM");
    fireEvent.click(optionEMEFPFOM);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Não existem resultados para os filtros selecionados.",
        ),
      ).toBeInTheDocument();
    });
  });
});
