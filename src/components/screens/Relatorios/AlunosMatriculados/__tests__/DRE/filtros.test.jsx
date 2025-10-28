import "@testing-library/jest-dom";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCogestor } from "src/mocks/meusDados/cogestor";
import { mockRelatorioAlunosMatriculadosDREFiltros } from "src/mocks/services/alunosMatriculados.service/DRE/filtros";
import RelatorioAlunosMatriculadosPage from "src/pages/Relatorios/RelatorioAlunosMatriculadosPage";
import mock from "src/services/_mock";

describe("Teste Relatório Alunos Matriculados - Usuário DRE - Filtros", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
    mock.onGet("/faixas-etarias/").reply(200, mockFaixasEtarias);
    mock
      .onGet(`/relatorio-alunos-matriculados/filtros/`)
      .reply(200, mockRelatorioAlunosMatriculadosDREFiltros);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);
    localStorage.setItem("perfil", PERFIL.COGESTOR_DRE);

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
              meusDados: mockMeusDadosCogestor,
              setMeusDados: jest.fn(),
            }}
          >
            <RelatorioAlunosMatriculadosPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("Deve renderizar os filtros corretamente", async () => {
    expect(screen.getByText("Lote")).toBeInTheDocument();
    expect(screen.getByText("Tipo de Unidade")).toBeInTheDocument();
    expect(screen.getByText("Tipo de Turma")).toBeInTheDocument();
    expect(screen.getByText("Unidade Educacional")).toBeInTheDocument();
  });

  it("Deve filtrar tipos de unidade corretamente", async () => {
    const selectTipoUnidade = screen.getByTestId("select-tipos-unidades");
    const selectControlTipoUnidade =
      within(selectTipoUnidade).getByRole("combobox");
    fireEvent.mouseDown(selectControlTipoUnidade);

    const optionCEIDIRET = screen.getByText("CEI DIRET");
    fireEvent.click(optionCEIDIRET);

    const selectUnidadeEducacional = screen.getByTestId(
      "select-unidades-educacionais",
    );
    const selectControlUnidadeEducacional = within(
      selectUnidadeEducacional,
    ).getByRole("combobox");
    fireEvent.mouseDown(selectControlUnidadeEducacional);

    const optionCEIDIRETMONUMENTO = screen.getByText("CEI DIRET MONUMENTO");
    fireEvent.click(optionCEIDIRETMONUMENTO);

    expect(screen.queryByText("EMEI CIDADE DO SOL")).not.toBeInTheDocument();
  });
});
