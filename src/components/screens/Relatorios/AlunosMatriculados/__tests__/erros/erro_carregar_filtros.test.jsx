import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCogestor } from "src/mocks/meusDados/cogestor";
import RelatorioAlunosMatriculadosPage from "src/pages/Relatorios/RelatorioAlunosMatriculadosPage";
import mock from "src/services/_mock";

describe("Teste Relatório Alunos Matriculados - Usuário DRE - Filtros", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
    mock.onGet("/faixas-etarias/").reply(400, {});
    mock.onGet(`/relatorio-alunos-matriculados/filtros/`).reply(400, {});

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
            <ToastContainer />
            <RelatorioAlunosMatriculadosPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("Deve renderizar o erro `Erro ao carregar filtros.`", async () => {
    expect(screen.getByText("Erro ao carregar filtros.")).toBeInTheDocument();
  });

  it("Deve renderizar o erro `Erro ao carregar faixas etárias.`", async () => {
    expect(
      screen.getByText("Erro ao carregar faixas etárias."),
    ).toBeInTheDocument();
  });
});
