import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import EmpresasCadastradasPage from "../EmpresasCadastradasPage";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import mock from "src/services/_mock";

import { mockGetTerceirizada } from "src/mocks/services/terceirizada.service/mockGetTerceirizada";
import { mockMeusDadosDilogQualidade } from "src/mocks/meusDados/dilog-qualidade";
import { mockMeusDadosDilogVisualizacao } from "src/mocks/meusDados/dilog-visualizacao";
import { localStorageMock } from "src/mocks/localStorageMock";

describe("Teste da página EmbalagensCadastradas - DILOG_VISUALIZACAO", () => {
  beforeEach(async () => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });

    localStorage.setItem("perfil", PERFIL.DILOG_VISUALIZACAO);
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.PRE_RECEBIMENTO_VISUALIZACAO,
    );

    mock.onGet("/terceirizadas/").reply(200, mockGetTerceirizada);

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
              meusDados: mockMeusDadosDilogVisualizacao,
              setMeusDados: jest.fn(),
            }}
          >
            <EmpresasCadastradasPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("valida se a listagem está renderizando corretamente", async () => {
    await waitFor(() => {
      expect(screen.getByText("Razão Social")).toBeInTheDocument();
      expect(screen.getByText("Nome Fantasia")).toBeInTheDocument();
      expect(screen.getByText("CNPJ")).toBeInTheDocument();
      expect(screen.getByText("Tipo de Serviço")).toBeInTheDocument();
      expect(screen.getByText("Situação")).toBeInTheDocument();
      expect(screen.getByText("Agro Comercial Porto S.A.")).toBeInTheDocument();
    });

    const botoesEditar = screen.queryAllByTitle("Editar");
    expect(botoesEditar.length).toBe(0);

    const linksEditar = document.querySelectorAll(".botao-editar");
    expect(linksEditar.length).toBe(0);

    const iconesEditar = document.querySelectorAll(".fa-edit");
    expect(iconesEditar.length).toBe(0);
  });
});

describe("Teste da página EmbalagensCadastradas - DILOG_QUALIDADE", () => {
  beforeEach(async () => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });

    localStorage.setItem("perfil", PERFIL.DILOG_QUALIDADE);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.PRE_RECEBIMENTO);

    mock.onGet("/terceirizadas/").reply(200, mockGetTerceirizada);

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
              meusDados: mockMeusDadosDilogQualidade,
              setMeusDados: jest.fn(),
            }}
          >
            <EmpresasCadastradasPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("valida se a listagem está renderizando corretamente", async () => {
    await waitFor(() => {
      expect(screen.getByText("Razão Social")).toBeInTheDocument();
      expect(screen.getByText("Nome Fantasia")).toBeInTheDocument();
      expect(screen.getByText("CNPJ")).toBeInTheDocument();
      expect(screen.getByText("Tipo de Serviço")).toBeInTheDocument();
      expect(screen.getByText("Situação")).toBeInTheDocument();
      expect(screen.getByText("Agro Comercial Porto S.A.")).toBeInTheDocument();
    });

    const botoesEditar = screen.queryAllByTitle("Editar");
    expect(botoesEditar.length).toBe(0);

    const linksEditar = document.querySelectorAll(".botao-editar");
    expect(linksEditar.length).toBe(0);

    const iconesEditar = document.querySelectorAll(".fa-edit");
    expect(iconesEditar.length).toBe(0);
  });
});
