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
import { mockGetMotivoAlteracaoUE } from "src/mocks/services/dietaEspecial.service/mockGetMotivoAlteracaoUE";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/meusDados/escola/CEMEI";
import { AlteracaoUEPage } from "src/pages/Escola/DietaEspecial/AlteracaoUEPage";
import mock from "src/services/_mock";

describe("Erro dietas ativas do aluno - Alteração UE", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCEMEI);
    mock.onGet("/motivo-alteracao-ue/").reply(200, mockGetMotivoAlteracaoUE);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA
    );
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA
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
              meusDados: mockMeusDadosEscolaCEMEI,
              setMeusDados: jest.fn(),
            }}
          >
            <AlteracaoUEPage />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Renderiza título e breadcrumb `Solicitação de alteração de U.E da dieta especial`", () => {
    expect(
      screen.queryAllByText("Solicitação de alteração de U.E da dieta especial")
    ).toHaveLength(2);
  });

  it("Preenche código EOL do aluno e recebe a informação de que não possui dietas ativas", async () => {
    mock
      .onGet("/solicitacoes-dieta-especial/")
      .reply(200, { count: 0, next: null, previous: null, results: [] });

    const codigoEOL = screen.getByTestId("codigo-eol-aluno");
    fireEvent.change(codigoEOL, {
      target: { value: "6577549" },
    });

    await waitFor(() => {
      expect(
        screen.getByText("Aluno informado não tem dieta ativa.")
      ).toBeInTheDocument();
    });
  });
});
