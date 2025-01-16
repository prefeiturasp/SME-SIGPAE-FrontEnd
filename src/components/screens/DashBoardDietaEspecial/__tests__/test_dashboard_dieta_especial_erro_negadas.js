import "@testing-library/jest-dom";
import { act, screen, waitFor } from "@testing-library/react";
import { CODAE } from "configs/constants";
import { MeusDadosContext } from "context/MeusDadosContext";
import { mockDietasPendentesAutorizacao } from "mocks/DietaEspecial/PainelInicial/mockDietasPendentesAutorizacao";
import { mockMeusDadosCODAEGA } from "mocks/meusDados/CODAE-GA";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import {
  getDietaEspecialAutorizadasCODAE,
  getDietaEspecialAutorizadasTemporariamenteCODAE,
  getDietaEspecialCanceladasCODAE,
  getDietaEspecialInativasCODAE,
  getDietaEspecialInativasTemporariamenteCODAE,
  getDietaEspecialNegadasCODAE,
  getDietaEspecialPendenteAutorizacaoCODAE,
} from "services/dashBoardDietaEspecial.service";
import { renderWithProvider } from "utils/test-utils";
import DashboardDietaEspecial from "..";

jest.mock("services/dashBoardDietaEspecial.service");
jest.mock("services/produto.service");

const awaitServices = async () => {
  await waitFor(() => {
    expect(getDietaEspecialPendenteAutorizacaoCODAE).toHaveBeenCalled();
    expect(getDietaEspecialAutorizadasCODAE).toHaveBeenCalled();
    expect(getDietaEspecialNegadasCODAE).toHaveBeenCalled();
    expect(getDietaEspecialCanceladasCODAE).toHaveBeenCalled();
    expect(getDietaEspecialAutorizadasTemporariamenteCODAE).toHaveBeenCalled();
    expect(getDietaEspecialInativasTemporariamenteCODAE).toHaveBeenCalled();
    expect(getDietaEspecialInativasCODAE).toHaveBeenCalled();
  });
};

describe("Test <DashboardDietaEpecial> - erro no endpoint getDietaEspecialNegadas", () => {
  beforeEach(async () => {
    getDietaEspecialPendenteAutorizacaoCODAE.mockResolvedValue({
      data: mockDietasPendentesAutorizacao,
      status: 200,
    });
    getDietaEspecialNegadasCODAE.mockResolvedValue({
      data: [],
      status: 400,
    });
    getDietaEspecialAutorizadasTemporariamenteCODAE.mockResolvedValue({
      data: mockDietasPendentesAutorizacao,
      status: 200,
    });

    getDietaEspecialCanceladasCODAE.mockResolvedValue({
      data: mockDietasPendentesAutorizacao,
      status: 200,
    });
    getDietaEspecialInativasCODAE.mockResolvedValue({
      data: mockDietasPendentesAutorizacao,
      status: 200,
    });
    getDietaEspecialInativasTemporariamenteCODAE.mockResolvedValue({
      data: mockDietasPendentesAutorizacao,
      status: 200,
    });
    getDietaEspecialAutorizadasCODAE.mockResolvedValue({
      data: mockDietasPendentesAutorizacao,
      status: 200,
    });

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
            value={{ meusDados: mockMeusDadosCODAEGA }}
          >
            <DashboardDietaEspecial
              visao={CODAE}
              getDietaEspecialPendenteAutorizacao={
                getDietaEspecialPendenteAutorizacaoCODAE
              }
              getDietaEspecialAutorizadas={getDietaEspecialAutorizadasCODAE}
              getDietaEspecialNegadas={getDietaEspecialNegadasCODAE}
              getDietaEspecialCanceladas={getDietaEspecialCanceladasCODAE}
              getDietaEspecialAutorizadasTemporariamente={
                getDietaEspecialAutorizadasTemporariamenteCODAE
              }
              getDietaEspecialInativasTemporariamente={
                getDietaEspecialInativasTemporariamenteCODAE
              }
              getDietaEspecialInativas={getDietaEspecialInativasCODAE}
            />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("renderiza label `Erro ao carregar solicitações negadas.`", async () => {
    await awaitServices();
    expect(
      screen.getByText("Erro ao carregar solicitações negadas.")
    ).toBeInTheDocument();
  });
});
