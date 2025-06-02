import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { TIPO_PERFIL } from "src/constants/shared";
import { mockAguardandoAnaliseReclamacao } from "mocks/dashboardGestaoProduto/mockAguardandoAmostraAnaliseSensorial";
import { mockAguardandoAnaliseSensorial } from "mocks/dashboardGestaoProduto/mockAguardandoAnaliseSensorial";
import { mockCorrecaoDeProduto } from "mocks/dashboardGestaoProduto/mockCorrecaoDeProduto";
import { mockHomologados } from "mocks/dashboardGestaoProduto/mockHomologados";
import { mockNaoHomologados } from "mocks/dashboardGestaoProduto/mockNaoHomologados";
import { mockPendenteHomologacao } from "mocks/dashboardGestaoProduto/mockPendenteHomologacao";
import { mockQuestionamentoDaCODAE } from "mocks/dashboardGestaoProduto/mockQuestionamentoDaCODAE";
import { mockSuspensos } from "mocks/dashboardGestaoProduto/mockSuspensos";
import { localStorageMock } from "mocks/localStorageMock";
import { mockGetNomesUnicosEditais } from "mocks/services/produto.service/mockGetNomesUnicosEditais";
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

jest.mock("services/dashboardGestaoProduto");
jest.mock("services/produto.service");

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

describe("Teste Dashboard Gestão Produto - Visão Terceirizada", () => {
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
      data: mockAguardandoAnaliseSensorial,
      status: 200,
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

  it("renderiza card `Produtos Suspensos`", async () => {
    await awaitServices();
    expect(screen.getByText("Produtos suspensos")).toBeInTheDocument();
    const divCardProdutosSuspensos = screen.getByTestId("Produtos suspensos");
    expect(divCardProdutosSuspensos).toHaveTextContent(
      "79356 - ARROZ LONGO FINO TIPO 1"
    );
    expect(divCardProdutosSuspensos).toHaveTextContent(
      "6F20A - CARNE BOVINA CONGELADA PATINHO CUBOS"
    );
    expect(divCardProdutosSuspensos).toHaveTextContent("Ver Mais");
  });

  it("renderiza card `Correções de Produtos`", async () => {
    await awaitServices();
    expect(screen.getByText("Correções de Produtos")).toBeInTheDocument();
    const divCardCorrecaoDeProdutos = screen.getByTestId(
      "Correções de Produtos"
    );
    expect(divCardCorrecaoDeProdutos).toHaveTextContent(
      "D4A3C - CARNE BOVINA CONGELADA PATINHO MOÍDO"
    );
    expect(divCardCorrecaoDeProdutos).toHaveTextContent(
      "89287 - QUEIJO FATIADO MUÇARELA"
    );
    expect(divCardCorrecaoDeProdutos).toHaveTextContent("Ver Mais");
  });

  it("renderiza card `Aguardando análise das reclamações`", async () => {
    await awaitServices();
    expect(
      screen.getByText("Aguardando análise das reclamações")
    ).toBeInTheDocument();
    const divCardAnaliseDasReclamacoes = screen.getByTestId(
      "Aguardando análise das reclamações"
    );
    expect(divCardAnaliseDasReclamacoes).toHaveTextContent(
      "79356 - ARROZ LONGO FINO TIPO 1"
    );
    expect(divCardAnaliseDasReclamacoes).toHaveTextContent(
      "13A5D - CARNE BOVINA CONGELADA PATINHO MOÍDO"
    );
    expect(divCardAnaliseDasReclamacoes).not.toHaveTextContent("Ver Mais");
  });

  it("renderiza card `Aguardando amostra para análise sensorial`", async () => {
    await awaitServices();
    expect(
      screen.getByText("Aguardando amostra para análise sensorial")
    ).toBeInTheDocument();
    const divCardAnaliseSensorial = screen.getByTestId(
      "Aguardando amostra para análise sensorial"
    );
    expect(divCardAnaliseSensorial).toHaveTextContent(
      "FA648 - EMPANADO DE FRANGO"
    );
    expect(divCardAnaliseSensorial).toHaveTextContent(
      "C96A5 - BISCOITO DOCE INTEGRAL SEM ADIÇÃO DE AÇÚCARES"
    );
    expect(divCardAnaliseSensorial).not.toHaveTextContent("Ver Mais");
  });

  it("renderiza card `Pendentes de homologação`", async () => {
    await awaitServices();
    expect(screen.getByText("Pendentes de homologação")).toBeInTheDocument();
    const divCardPendenteHomologacao = screen.getByTestId(
      "Pendentes de homologação"
    );
    expect(divCardPendenteHomologacao).toHaveTextContent(
      "0026B - SUCO CONCENTRADO DE MARACUJA"
    );
    expect(divCardPendenteHomologacao).not.toHaveTextContent("Ver Mais");
  });

  it("renderiza card `Homologados`", async () => {
    await awaitServices();
    expect(screen.getByText("Homologados")).toBeInTheDocument();
    const divCardHomologados = screen.getByTestId("Homologados");
    expect(divCardHomologados).toHaveTextContent(
      "53445 - PÃO TIPO HOT DOG INTEGRAL"
    );
    expect(divCardHomologados).toHaveTextContent(
      "31248 - CARNE BOVINA CONGELADA PATINHO MOÍDO"
    );
    expect(divCardHomologados).toHaveTextContent("Ver Mais");
  });

  it("renderiza card `Não homologados`", async () => {
    await awaitServices();
    expect(screen.getByText("Não homologados")).toBeInTheDocument();
    const divCardNaoHomologados = screen.getByTestId("Não homologados");
    expect(divCardNaoHomologados).toHaveTextContent(
      "325AF - SUCO CONCENTRADO DE MARACUJA"
    );
    expect(divCardNaoHomologados).toHaveTextContent(
      "B3170 - BISCOITO DOCE SEM GLÚTEN SEM LACTOSE SABOR"
    );
    expect(divCardNaoHomologados).toHaveTextContent("Ver Mais");
  });

  it("renderiza card `Responder Questionamentos da CODAE`", async () => {
    await awaitServices();
    expect(
      screen.getByText("Responder Questionamentos da CODAE")
    ).toBeInTheDocument();
    const divCardQuestionamentosDaCODAE = screen.getByTestId(
      "Responder Questionamentos da CODAE"
    );
    expect(divCardQuestionamentosDaCODAE).toHaveTextContent(
      "12345 - SUCO DE UVA"
    );
    expect(divCardQuestionamentosDaCODAE).not.toHaveTextContent("Ver Mais");
  });

  it("busca por edital", async () => {
    jest.useFakeTimers();

    await awaitServices();
    await act(async () => {
      fireEvent.mouseDown(
        screen
          .getByTestId("select-edital")
          .querySelector(".ant-select-selection-search-input")
      );
    });

    await waitFor(() =>
      screen.queryAllByText("Edital de Pregão n°70/SME/2022")
    );
    await act(async () => {
      fireEvent.click(
        screen.queryAllByText("Edital de Pregão n°70/SME/2022")[1]
      );
    });

    await act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(getProdutosPendenteHomologacao).toHaveBeenCalledTimes(2);
    });

    jest.useRealTimers();
  });

  it("busca por titulo", async () => {
    jest.useFakeTimers();

    await awaitServices();
    const divInputBuscaPorTitulo = screen.getByTestId("div-input-titulo");
    const inputElement = divInputBuscaPorTitulo.querySelector("input");
    await waitFor(() => {
      fireEvent.change(inputElement, {
        target: { value: "ARROZ" },
      });
    });

    await act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(getProdutosPendenteHomologacao).toHaveBeenCalledTimes(2);
    });

    jest.useRealTimers();
  });

  it("busca por marca", async () => {
    jest.useFakeTimers();

    await awaitServices();
    const divInputBuscaPorMarca = screen.getByTestId("div-input-marca");
    const inputElement = divInputBuscaPorMarca.querySelector("input");
    await waitFor(() => {
      fireEvent.change(inputElement, {
        target: { value: "TIO JOAO" },
      });
    });

    await act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(getProdutosPendenteHomologacao).toHaveBeenCalledTimes(2);
    });

    jest.useRealTimers();
  });
});
