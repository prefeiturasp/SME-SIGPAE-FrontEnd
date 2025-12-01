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
import { getNomesUnicosEditais } from "src/services/produto.service";

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

describe("Test <DashboardDietaEpecial>", () => {
  beforeEach(async () => {
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

    getNomesUnicosEditais.mockResolvedValue({
      data: { results: [] },
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

  it("renderiza label `Nº de Matriculados`", async () => {
    await awaitServices();
    expect(screen.getByText("Nº de Matriculados")).toBeInTheDocument();
  });

  it("renderiza texto `Informação automática...`", async () => {
    await awaitServices();
    expect(
      screen.getByText(
        "Informação automática disponibilizada pelo Cadastro da Unidade Escolar",
      ),
    ).toBeInTheDocument();
  });

  it("renderiza texto `Acompanhamento de solicitações dieta especial`", async () => {
    await awaitServices();
    expect(
      screen.getByText("Acompanhamento de solicitações dieta especial"),
    ).toBeInTheDocument();
  });

  it("renderiza label `Aguardando Autorização`", async () => {
    await awaitServices();
    expect(screen.getByText("Aguardando Autorização")).toBeInTheDocument();
  });

  it("renderiza alunos em `Aguardando Autorização`", async () => {
    await awaitServices();
    const cardAguardandoAutorizacao = screen.getByTestId(
      `card-aguardando-autorizacao`,
    );
    expect(cardAguardandoAutorizacao).toHaveTextContent(
      "9999999 - JOAO BATISTA / EMEI EMIR MACEDO NOGUEIRA",
    );
    expect(cardAguardandoAutorizacao).toHaveTextContent(
      "9999998 - MARIA DA SILVA / CEU EMEI PERA MARMELO",
    );
  });
});
