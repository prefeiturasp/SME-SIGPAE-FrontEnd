import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import { TIPO_PERFIL } from "src/constants/shared";
import { mockAguardandoAnaliseReclamacao } from "src/mocks/dashboardGestaoProduto/mockAguardandoAmostraAnaliseSensorial";
import { mockCorrecaoDeProduto } from "src/mocks/dashboardGestaoProduto/mockCorrecaoDeProduto";
import { mockHomologados } from "src/mocks/dashboardGestaoProduto/mockHomologados";
import { mockNaoHomologados } from "src/mocks/dashboardGestaoProduto/mockNaoHomologados";
import { mockPendenteHomologacao } from "src/mocks/dashboardGestaoProduto/mockPendenteHomologacao";
import { mockQuestionamentoDaCODAE } from "src/mocks/dashboardGestaoProduto/mockQuestionamentoDaCODAE";
import { mockSuspensos } from "src/mocks/dashboardGestaoProduto/mockSuspensos";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockGetNomesUnicosEditais } from "src/mocks/services/produto.service/mockGetNomesUnicosEditais";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import {
  getProdutosAguardandoAmostraAnaliseSensorial,
  getProdutosAguardandoAnaliseReclamacao,
  getProdutosCorrecaoDeProdutos,
  getProdutosHomologados,
  getProdutosNaoHomologados,
  getProdutosPendenteHomologacao,
  getProdutosQuestionamentoDaCODAE,
  getProdutosSuspensos,
} from "src/services/dashboardGestaoProduto";
import { getNomesUnicosEditais } from "src/services/produto.service";
import { DashboardGestaoProduto } from "..";

jest.mock("src/services/dashboardGestaoProduto");
jest.mock("src/services/produto.service");

const awaitServices = async () => {
  await waitFor(() => {
    expect(getNomesUnicosEditais).toHaveBeenCalled();
    expect(getProdutosPendenteHomologacao).toHaveBeenCalled();
    expect(getProdutosAguardandoAmostraAnaliseSensorial).toHaveBeenCalled();
    expect(getProdutosAguardandoAnaliseReclamacao).toHaveBeenCalled();
    expect(getProdutosCorrecaoDeProdutos).toHaveBeenCalled();
    expect(getProdutosHomologados).toHaveBeenCalled();
    expect(getProdutosNaoHomologados).toHaveBeenCalled();
    expect(getProdutosQuestionamentoDaCODAE).toHaveBeenCalled();
    expect(getProdutosSuspensos).toHaveBeenCalled();
  });
};

describe("Teste Dashboard Gestão Produto - Erro editais", () => {
  beforeEach(async () => {
    getNomesUnicosEditais.mockResolvedValue({
      data: mockGetNomesUnicosEditais,
      status: 200,
    });
    getProdutosPendenteHomologacao.mockResolvedValue({
      data: mockPendenteHomologacao,
      status: 200,
    });
    getProdutosAguardandoAmostraAnaliseSensorial.mockResolvedValue({
      data: {
        detail:
          "Erro ao carregar produtos em aguardando amostra análise sensorial",
      },
      status: 400,
    });
    getProdutosAguardandoAnaliseReclamacao.mockResolvedValue({
      data: mockAguardandoAnaliseReclamacao,
      status: 200,
    });
    getProdutosCorrecaoDeProdutos.mockResolvedValue({
      data: mockCorrecaoDeProduto,
      status: 200,
    });
    getProdutosHomologados.mockResolvedValue({
      data: mockHomologados,
      status: 200,
    });
    getProdutosNaoHomologados.mockResolvedValue({
      data: mockNaoHomologados,
      status: 200,
    });
    getProdutosQuestionamentoDaCODAE.mockResolvedValue({
      data: mockQuestionamentoDaCODAE,
      status: 200,
    });
    getProdutosSuspensos.mockResolvedValue({
      data: mockSuspensos,
      status: 200,
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.TERCEIRIZADA);

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <DashboardGestaoProduto />
        </MemoryRouter>
      );
    });
  });

  it("renderiza erro `Erro ao carregar produtos em aguardando amostra analise sensorial. Tente novamente mais tarde.`", async () => {
    await awaitServices();
    expect(
      screen.getByText(
        "Erro ao carregar produtos em aguardando amostra analise sensorial. Tente novamente mais tarde."
      )
    ).toBeInTheDocument();
  });
});
