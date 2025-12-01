import "@testing-library/jest-dom";
import { act, screen, waitFor } from "@testing-library/react";
import { CODAE } from "src/configs/constants";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockDietasPendentesAutorizacao } from "src/mocks/DietaEspecial/PainelInicial/mockDietasPendentesAutorizacao";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
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
} from "src/services/dashBoardDietaEspecial.service";
import { renderWithProvider } from "src/utils/test-utils";
import DashboardDietaEspecial from "../..";

jest.mock("src/services/dashBoardDietaEspecial.service");
jest.mock("src/services/produto.service");

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

describe("Test <DashboardDietaEpecial> - erro no endpoint getDietaEspecialCanceladas", () => {
  beforeEach(async () => {
    getDietaEspecialPendenteAutorizacaoCODAE.mockResolvedValue({
      data: mockDietasPendentesAutorizacao,
      status: 200,
    });
    getDietaEspecialCanceladasCODAE.mockResolvedValue({
      data: [],
      status: 400,
    });
    getDietaEspecialAutorizadasTemporariamenteCODAE.mockResolvedValue({
      data: mockDietasPendentesAutorizacao,
      status: 200,
    });

    getDietaEspecialNegadasCODAE.mockResolvedValue({
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
        </MemoryRouter>,
      );
    });
  });

  it("renderiza label `Erro ao carregar solicitações canceladas.`", async () => {
    await awaitServices();
    expect(
      screen.getByText("Erro ao carregar solicitações canceladas."),
    ).toBeInTheDocument();
  });
});
