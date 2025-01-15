import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { CODAE } from "configs/constants";
import { MeusDadosContext } from "context/MeusDadosContext";
import { mockDietasPendentesAutorizacao } from "mocks/DietaEspecial/PainelInicial/mockDietasPendentesAutorizacao";
import { mockMeusDadosCODAEGA } from "mocks/DietaEspecial/PainelInicial/mockMeusDadosCODAEGA";
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
import DashboardDietaEspecial from "..";

jest.mock("services/dashBoardDietaEspecial.service");

describe("Test <DashboardDietaEpecial>", () => {
  beforeEach(() => {
    getDietaEspecialPendenteAutorizacaoCODAE.mockResolvedValue({
      data: mockDietasPendentesAutorizacao,
      status: 200,
    });
    getDietaEspecialAutorizadasTemporariamenteCODAE.mockResolvedValue({
      data: mockDietasPendentesAutorizacao,
      status: 200,
    });
    getDietaEspecialAutorizadasCODAE.mockResolvedValue({
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
    getDietaEspecialNegadasCODAE.mockResolvedValue({
      data: mockDietasPendentesAutorizacao,
      status: 200,
    });

    render(
      <MemoryRouter
        initialEntries={[{ pathname: "/" }]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <MeusDadosContext.Provider value={{ meusDados: mockMeusDadosCODAEGA }}>
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

  it("renderiza label `Mês do Lançamento`", async () => {
    await waitFor(() => {
      expect(getDietaEspecialPendenteAutorizacaoCODAE).toHaveBeenCalled();
      expect(getDietaEspecialAutorizadasCODAE).toHaveBeenCalled();
      expect(getDietaEspecialNegadasCODAE).toHaveBeenCalled();
      expect(getDietaEspecialCanceladasCODAE).toHaveBeenCalled();
      expect(
        getDietaEspecialAutorizadasTemporariamenteCODAE
      ).toHaveBeenCalled();
      expect(getDietaEspecialInativasTemporariamenteCODAE).toHaveBeenCalled();
      expect(getDietaEspecialInativasCODAE).toHaveBeenCalled();
    });
    expect(
      screen.getByText("Acompanhamento de solicitações dieta especial")
    ).toBeInTheDocument();
  });
});
