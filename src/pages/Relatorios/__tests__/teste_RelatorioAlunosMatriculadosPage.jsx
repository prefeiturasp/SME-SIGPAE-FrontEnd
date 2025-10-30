import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockFiltrarAlunosMatriculadosUnicaEscola } from "src/mocks/services/alunosMatriculados.service/mockFiltrarAlunosMatriculados";
import { mockGetFiltros } from "src/mocks/services/alunosMatriculados.service/mockGetFiltros";
import RelatorioAlunosMatriculadosPage from "src/pages/Relatorios/RelatorioAlunosMatriculadosPage";
import mock from "src/services/_mock";

describe("Testar Relatório de Alunos Matriculados", () => {
  beforeEach(async () => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });

    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);

    mock
      .onGet(`/relatorio-alunos-matriculados/filtros/`)
      .reply(200, mockGetFiltros);

    mock.onGet(`/faixas-etarias/`).reply(200, mockFaixasEtarias);

    mock
      .onGet(`/relatorio-alunos-matriculados/filtrar/`)
      .reply(200, mockFiltrarAlunosMatriculadosUnicaEscola);

    mock.onGet(`/relatorio-alunos-matriculados/gerar-pdf/`).reply(200, {
      detail: "Solicitação de geração de arquivo recebida com sucesso.",
    });

    mock.onGet(`/relatorio-alunos-matriculados/gerar-xlsx/`).reply(200, {
      detail: "Solicitação de geração de arquivo recebida com sucesso.",
    });

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
              meusDados: mockMeusDadosEscolaEMEFPericles,
              setMeusDados: jest.fn(),
            }}
          >
            <RelatorioAlunosMatriculadosPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("Testa se filtros estão selecionados e desabilitados para Escola", async () => {
    expect(
      screen.getByText("EMEF PERICLES EUGENIO DA SILVA RAMOS"),
    ).toBeInTheDocument();

    const selectDRE = screen.getByTestId("select-dres");
    const elementoDesabilitadoDRE = selectDRE.querySelector(
      '[aria-disabled="true"]',
    );
    expect(elementoDesabilitadoDRE).toBeInTheDocument();

    const selectLote = screen.getByTestId("select-lotes");
    const elementoDesabilitadoLote = selectLote.querySelector(
      '[aria-disabled="true"]',
    );
    expect(elementoDesabilitadoLote).toBeInTheDocument();

    const selectTipoUnidade = screen.getByTestId("select-tipos-unidades");
    const elementoDesabilitadoTipoUnidade = selectTipoUnidade.querySelector(
      '[aria-disabled="true"]',
    );
    expect(elementoDesabilitadoTipoUnidade).toBeInTheDocument();

    const selectUE = screen.getByTestId("select-unidades-educacionais");
    const elementoDesabilitadoUE = selectUE.querySelector(
      '[aria-disabled="true"]',
    );
    expect(elementoDesabilitadoUE).toBeInTheDocument();
  });

  it("Testa renderização da tabela e botão de Exportar PDF", async () => {
    const botaoConsultar = screen.getByText("Consultar").closest("button");
    await act(async () => {
      fireEvent.click(botaoConsultar);
    });

    await waitFor(() => {
      expect(screen.getByText("256")).toBeInTheDocument();
      expect(screen.getByText("297")).toBeInTheDocument();
      expect(screen.getByText("42")).toBeInTheDocument();
    });

    const botaoBaixarPdf = screen.getByText("Baixar PDF").closest("button");
    await act(async () => {
      fireEvent.click(botaoBaixarPdf);
    });

    expect(
      screen.getByText("Geração solicitada com sucesso."),
    ).toBeInTheDocument();
  });

  it("Testa renderização da tabela e botão de Exportar XLSX", async () => {
    const botaoConsultar = screen.getByText("Consultar").closest("button");
    await act(async () => {
      fireEvent.click(botaoConsultar);
    });

    await waitFor(() => {
      expect(screen.getByText("256")).toBeInTheDocument();
    });

    const botaoBaixarXlsx = screen.getByText("Baixar EXCEL").closest("button");
    await act(async () => {
      fireEvent.click(botaoBaixarXlsx);
    });

    expect(
      screen.getByText("Geração solicitada com sucesso."),
    ).toBeInTheDocument();
  });
});
