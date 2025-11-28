import "@testing-library/jest-dom";
import { act, screen, waitFor } from "@testing-library/react";
import { ESCOLA } from "src/configs/constants";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockDietasPendentesAutorizacao } from "src/mocks/DietaEspecial/PainelInicial/mockDietasPendentesAutorizacao";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import {
  getDietaEspecialAguardandoVigenciaEscola,
  getDietaEspecialAutorizadasEscola,
  getDietaEspecialAutorizadasTemporariamenteEscola,
  getDietaEspecialCanceladasEscola,
  getDietaEspecialInativasEscola,
  getDietaEspecialInativasTemporariamenteEscola,
  getDietaEspecialNegadasEscola,
  getDietaEspecialPendenteAutorizacaoEscola,
} from "src/services/dashBoardDietaEspecial.service";
import { getNomesUnicosEditais } from "src/services/produto.service";
import { renderWithProvider } from "src/utils/test-utils";
import DashboardDietaEspecial from "../..";

jest.mock("src/services/dashBoardDietaEspecial.service");
jest.mock("src/services/produto.service");

const awaitServices = async () => {
  await waitFor(() => {
    expect(getDietaEspecialPendenteAutorizacaoEscola).toHaveBeenCalled();
    expect(getDietaEspecialAutorizadasEscola).toHaveBeenCalled();
    expect(getDietaEspecialNegadasEscola).toHaveBeenCalled();
    expect(getDietaEspecialCanceladasEscola).toHaveBeenCalled();
    expect(getDietaEspecialAutorizadasTemporariamenteEscola).toHaveBeenCalled();
    expect(getDietaEspecialInativasTemporariamenteEscola).toHaveBeenCalled();
    expect(getDietaEspecialInativasEscola).toHaveBeenCalled();
    expect(getDietaEspecialAguardandoVigenciaEscola).toHaveBeenCalled();
  });
};

describe("Test <DashboardDietaEpecial> - Visão Escola", () => {
  beforeEach(async () => {
    getDietaEspecialPendenteAutorizacaoEscola.mockResolvedValue({
      data: mockDietasPendentesAutorizacao,
      status: 200,
    });
    getDietaEspecialAutorizadasTemporariamenteEscola.mockResolvedValue({
      data: mockDietasPendentesAutorizacao,
      status: 200,
    });
    getDietaEspecialAutorizadasEscola.mockResolvedValue({
      data: mockDietasPendentesAutorizacao,
      status: 200,
    });
    getDietaEspecialCanceladasEscola.mockResolvedValue({
      data: mockDietasPendentesAutorizacao,
      status: 200,
    });
    getDietaEspecialInativasEscola.mockResolvedValue({
      data: mockDietasPendentesAutorizacao,
      status: 200,
    });
    getDietaEspecialInativasTemporariamenteEscola.mockResolvedValue({
      data: mockDietasPendentesAutorizacao,
      status: 200,
    });
    getDietaEspecialNegadasEscola.mockResolvedValue({
      data: mockDietasPendentesAutorizacao,
      status: 200,
    });
    getDietaEspecialAguardandoVigenciaEscola.mockResolvedValue({
      data: [],
      status: 400,
    });

    getNomesUnicosEditais.mockResolvedValue({
      data: { results: [] },
      status: 200,
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("perfil", `"DIRETOR_UE"`);
    localStorage.setItem("modulo_gestao", `"TERCEIRIZADA"`);

    await act(async () => {
      renderWithProvider(
        <MemoryRouter
          initialEntries={[{ pathname: "/" }]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{ meusDados: mockMeusDadosEscolaEMEFPericles }}
          >
            <DashboardDietaEspecial
              visao={ESCOLA}
              getDietaEspecialPendenteAutorizacao={
                getDietaEspecialPendenteAutorizacaoEscola
              }
              getDietaEspecialAutorizadas={getDietaEspecialAutorizadasEscola}
              getDietaEspecialNegadas={getDietaEspecialNegadasEscola}
              getDietaEspecialCanceladas={getDietaEspecialCanceladasEscola}
              getDietaEspecialAutorizadasTemporariamente={
                getDietaEspecialAutorizadasTemporariamenteEscola
              }
              getDietaEspecialAguardandoVigencia={
                getDietaEspecialAguardandoVigenciaEscola
              }
              getDietaEspecialInativasTemporariamente={
                getDietaEspecialInativasTemporariamenteEscola
              }
              getDietaEspecialInativas={getDietaEspecialInativasEscola}
            />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("renderiza label `Erro ao carregar solicitações aguardando início de vigência.`", async () => {
    await awaitServices();
    expect(
      screen.getByText(
        "Erro ao carregar solicitações aguardando início de vigência.",
      ),
    ).toBeInTheDocument();
  });
});
