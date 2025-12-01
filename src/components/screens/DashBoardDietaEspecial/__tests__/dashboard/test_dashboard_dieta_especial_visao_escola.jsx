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
      data: mockDietasPendentesAutorizacao,
      status: 200,
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
      "9999999 - JOAO BATISTA - 7H",
    );
    expect(cardAguardandoAutorizacao).toHaveTextContent(
      "9999998 - MARIA DA SILVA - 7G",
    );
  });

  it("renderiza label `Aguardando início da vigência`", async () => {
    await awaitServices();
    expect(
      screen.getByText("Aguardando início da vigência"),
    ).toBeInTheDocument();
  });

  it("renderiza alunos em `Aguardando início da vigência`", async () => {
    await awaitServices();
    const cardAguardandoInicioDeVigencia = screen.getByTestId(
      `card-aguardando-inicio-vigencia`,
    );
    expect(cardAguardandoInicioDeVigencia).toHaveTextContent(
      "9999999 - JOAO BATISTA - 7H",
    );
    expect(cardAguardandoInicioDeVigencia).toHaveTextContent(
      "9999998 - MARIA DA SILVA - 7G",
    );
  });

  it("renderiza card `Inclusão de Dieta Especial`", async () => {
    await awaitServices();
    const cardsAtalhosEscola = screen.getByTestId(`cards-atalhos-escola`);

    expect(cardsAtalhosEscola).toHaveTextContent("Inclusão de Dieta Especial");
    expect(cardsAtalhosEscola).toHaveTextContent(
      "Quando houver necessidade de incluir Dieta Especial para os alunos matriculados na unidade.",
    );
  });

  it("renderiza card `Alterar U.E da Dieta Especial`", async () => {
    await awaitServices();
    const cardsAtalhosEscola = screen.getByTestId(`cards-atalhos-escola`);

    expect(cardsAtalhosEscola).toHaveTextContent(
      "Alterar U.E da Dieta Especial",
    );
    expect(cardsAtalhosEscola).toHaveTextContent(
      "Quando houver necessidade de alteração de unidade escolar do aluno para os programas Polo e Recreio nas Férias.",
    );
  });

  it("renderiza card `Cancelar Dieta Especial`", async () => {
    await awaitServices();
    const cardsAtalhosEscola = screen.getByTestId(`cards-atalhos-escola`);

    expect(cardsAtalhosEscola).toHaveTextContent("Cancelar Dieta Especial");
    expect(cardsAtalhosEscola).toHaveTextContent(
      "Quando houver necessidade de cancelamento de dieta devido a existência de laudo de alta.",
    );
  });
});
