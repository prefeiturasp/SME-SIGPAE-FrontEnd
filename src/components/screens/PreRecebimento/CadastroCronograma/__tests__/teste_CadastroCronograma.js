import "@testing-library/jest-dom";
import { render, waitFor, act } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import CadastroCronograma from "..";

// import * as perfilService from "services/perfil.service";
import { getEmpresasCronograma } from "services/terceirizada.service";
import { getNomesDistribuidores } from "services/logistica.service";
import { getListaFichasTecnicasSimplesAprovadas } from "services/fichaTecnica.service";
import {
  getRascunhos,
  getUnidadesDeMedidaLogistica,
} from "services/cronograma.service";

import { mockListaDistribuidores } from "mocks/PreRecebimento/CadastroCronograma/mockListaDistribuidores";
import { mockListaEmpresas } from "mocks/PreRecebimento/CadastroCronograma/mockListaEmpresas";
import { mockListaFichasTecnicasSimplesAprovadas } from "mocks/PreRecebimento/CadastroCronograma/mockListaFichasTecnicasSimplesAprovadas";
import { mockListaUnidadesMedidaLogistica } from "mocks/PreRecebimento/CadastroCronograma/mockListaUnidadesMedidaLogistica";
import { mockListaRascunhos } from "mocks/PreRecebimento/CadastroCronograma/mockListaRascunhos";

jest.mock("services/logistica.service");
jest.mock("services/terceirizada.service");
jest.mock("services/fichaTecnica.service");
jest.mock("services/cronograma.service");

describe("Test <CadastroCronograma>", () => {
  beforeEach(async () => {
    getNomesDistribuidores.mockResolvedValue({
      data: mockListaDistribuidores,
      status: 200,
    });

    getEmpresasCronograma.mockResolvedValue({
      data: mockListaEmpresas,
      status: 200,
    });

    getListaFichasTecnicasSimplesAprovadas.mockResolvedValue({
      data: mockListaFichasTecnicasSimplesAprovadas,
      status: 200,
    });

    getUnidadesDeMedidaLogistica.mockResolvedValue({
      data: mockListaUnidadesMedidaLogistica,
      status: 200,
    });

    getRascunhos.mockResolvedValue({
      data: mockListaRascunhos,
      status: 200,
    });

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <CadastroCronograma />
        </MemoryRouter>
      );
    });
  });

  it("qualquer coisa", async () => {
    expect(true).toBe(true);
  });

  it("teste mock getListaDistribuidores", async () => {
    await waitFor(() => expect(getNomesDistribuidores).toHaveBeenCalled());
    expect(getNomesDistribuidores).toHaveBeenCalledTimes(1);
    expect(getNomesDistribuidores).toHaveReturnedWith(
      Promise.resolve(mockListaDistribuidores)
    );

    const distribuidores = await getNomesDistribuidores();
    expect(distribuidores.data.results).toBeDefined();
    expect(distribuidores.data.results[0]).toBeDefined();
    expect(distribuidores.data.results[0].nome_fantasia).toBe("Castilho Perez");
  });

  it("teste mock getEmpresasCronograma", async () => {
    await waitFor(() => expect(getEmpresasCronograma).toHaveBeenCalled());
    expect(getEmpresasCronograma).toHaveBeenCalledTimes(1);
    expect(getEmpresasCronograma).toHaveReturnedWith(
      Promise.resolve(mockListaEmpresas)
    );
  });

  it("teste mock getListaFichasTecnicasSimplesAprovadas", async () => {
    await waitFor(() =>
      expect(getListaFichasTecnicasSimplesAprovadas).toHaveBeenCalled()
    );
    expect(getListaFichasTecnicasSimplesAprovadas).toHaveBeenCalledTimes(1);
    expect(getListaFichasTecnicasSimplesAprovadas).toHaveReturnedWith(
      Promise.resolve(mockListaFichasTecnicasSimplesAprovadas)
    );
  });

  it("teste mock getUnidadesDeMedidaLogistica", async () => {
    await waitFor(() =>
      expect(getUnidadesDeMedidaLogistica).toHaveBeenCalled()
    );
    expect(getUnidadesDeMedidaLogistica).toHaveBeenCalledTimes(1);
    expect(getUnidadesDeMedidaLogistica).toHaveReturnedWith(
      Promise.resolve(mockListaUnidadesMedidaLogistica)
    );
  });

  it("teste mock getRascunhos", async () => {
    await waitFor(() => expect(getRascunhos).toHaveBeenCalled());
    expect(getRascunhos).toHaveBeenCalledTimes(1);
    expect(getRascunhos).toHaveReturnedWith(
      Promise.resolve(mockListaRascunhos)
    );
  });

  //   it("renderiza label `Mês do Lançamento`", () => {
  //     expect(screen.getByText("Mês do Lançamento")).toBeInTheDocument();
  //   });

  //   it("renderiza valor `Novembro / 2024` no input `Mês do Lançamento`", () => {
  //     const inputElement = screen.getByTestId("input-mes-lancamento");
  //     expect(inputElement).toHaveAttribute("value", "Novembro / 2024");
  //   });

  //   it("renderiza label `Período de Lançamento`", () => {
  //     expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
  //   });

  //   it("renderiza valor `PARCIAL` no input `Período de Lançamento`", () => {
  //     const inputElement = screen.getByTestId("input-periodo-lancamento");
  //     expect(inputElement).toHaveAttribute("value", "PARCIAL");
  //   });

  //   it("renderiza label `Semanas do Período para Lançamento da Medição Inicial`", () => {
  //     expect(
  //       screen.getByText("Semanas do Período para Lançamento da Medição Inicial")
  //     ).toBeInTheDocument();
  //   });

  //   it("renderiza label `Semana 1`", async () => {
  //     await awaitServices();
  //     expect(screen.getByText("Semana 1")).toBeInTheDocument();
  //   });

  //   it("renderiza label `Semana 5`", async () => {
  //     await awaitServices();
  //     expect(screen.getByText("Semana 5")).toBeInTheDocument();
  //   });

  //   it("renderiza label `ALIMENTAÇÃO`", async () => {
  //     await awaitServices();
  //     expect(screen.getByText("ALIMENTAÇÃO")).toBeInTheDocument();
  //   });

  //   it("renderiza label `Matriculados` dentro da seção `ALIMENTAÇÃO`", async () => {
  //     await awaitServices();
  //     const categoriaAlimentacaoUuid = "0e1f14ce-685a-4d4c-b0a7-96efe52b754f";
  //     const myElement = screen.getByTestId(
  //       `div-lancamentos-por-categoria-${categoriaAlimentacaoUuid}`
  //     );
  //     const allMatriculados = screen.getAllByText("Matriculados");
  //     const specificMatriculados = allMatriculados.find((element) =>
  //       myElement.contains(element)
  //     );
  //     expect(specificMatriculados).toBeInTheDocument();
  //   });

  //   it("renderiza label `Seg.` dentro da seção `ALIMENTAÇÃO`", async () => {
  //     await awaitServices();
  //     const categoriaAlimentacaoUuid = "0e1f14ce-685a-4d4c-b0a7-96efe52b754f";
  //     const myElement = screen.getByTestId(
  //       `div-lancamentos-por-categoria-${categoriaAlimentacaoUuid}`
  //     );
  //     const allMatriculados = screen.getAllByText("Seg.");
  //     const specificMatriculados = allMatriculados.find((element) =>
  //       myElement.contains(element)
  //     );
  //     expect(specificMatriculados).toBeInTheDocument();
  //   });

  //   it("renderiza label `DIETA ESPECIAL - TIPO B - LANCHE`", async () => {
  //     await awaitServices();
  //     expect(
  //       screen.getByText("DIETA ESPECIAL - TIPO B - LANCHE")
  //     ).toBeInTheDocument();
  //   });

  //   it("renderiza label `Seg.` dentro da seção `DIETA ESPECIAL - TIPO B - LANCHE`", async () => {
  //     await awaitServices();
  //     const categoriaDietaEspecialTipoBUuid =
  //       "6ad79709-3611-4af3-a567-65fcf34b3d06";
  //     const myElement = screen.getByTestId(
  //       `div-lancamentos-por-categoria-${categoriaDietaEspecialTipoBUuid}`
  //     );
  //     const allMatriculados = screen.getAllByText("Seg.");
  //     const specificMatriculados = allMatriculados.find((element) =>
  //       myElement.contains(element)
  //     );
  //     expect(specificMatriculados).toBeInTheDocument();
  //   });

  //   it("renderiza label `Dietas Autorizadas` dentro da seção `DIETA ESPECIAL - TIPO B - LANCHE`", async () => {
  //     await awaitServices();
  //     const categoriaDietaEspecialTipoBUuid =
  //       "6ad79709-3611-4af3-a567-65fcf34b3d06";
  //     const myElement = screen.getByTestId(
  //       `div-lancamentos-por-categoria-${categoriaDietaEspecialTipoBUuid}`
  //     );
  //     const allMatriculados = screen.getAllByText("Dietas Autorizadas");
  //     const specificMatriculados = allMatriculados.find((element) =>
  //       myElement.contains(element)
  //     );
  //     expect(specificMatriculados).toBeInTheDocument();
  //   });

  //   it("ao clicar na tab `Semana 2`, exibe, no dia 9, o número de matriculados 47 e 17", async () => {
  //     await awaitServices();
  //     const semana2Element = screen.getByText("Semana 2");
  //     fireEvent.click(semana2Element);
  //     const inputElementMatriculados1AnoA3anosE11Meses = screen.getByTestId(
  //       "matriculados__faixa_802ffeb0-3d70-4be9-97fe-20992ee9c0ff__dia_09__categoria_1"
  //     );
  //     expect(inputElementMatriculados1AnoA3anosE11Meses).toHaveAttribute(
  //       "value",
  //       "47"
  //     );
  //     const inputElementMatriculados4a6anos = screen.getByTestId(
  //       "matriculados__faixa_0c914b27-c7cd-4682-a439-a4874745b005__dia_09__categoria_1"
  //     );
  //     expect(inputElementMatriculados4a6anos).toHaveAttribute("value", "17");
  //   });

  //   it("ao clicar na tab `Semana 2`, exibe, no dia 9, nos campos frequência abaixo de 47 e 49 a borda warning", async () => {
  //     await awaitServices();
  //     const semana2Element = screen.getByText("Semana 2");
  //     fireEvent.click(semana2Element);
  //     const inputElementFrequencia1AnoA3anosE11Meses = screen.getByTestId(
  //       "frequencia__faixa_802ffeb0-3d70-4be9-97fe-20992ee9c0ff__dia_09__categoria_1"
  //     );
  //     expect(inputElementFrequencia1AnoA3anosE11Meses).toHaveClass(
  //       "border-warning"
  //     );
  //     const inputElementFrequencia4a6anos = screen.getByTestId(
  //       "frequencia__faixa_0c914b27-c7cd-4682-a439-a4874745b005__dia_09__categoria_1"
  //     );
  //     expect(inputElementFrequencia4a6anos).toHaveClass("border-warning");
  //   });

  //   it("ao clicar na tab `Semana 2`, exibe, no dia 9, botão Adicionar obrigatório", async () => {
  //     await awaitServices();
  //     const semana2Element = screen.getByText("Semana 2");
  //     fireEvent.click(semana2Element);
  //     const botaoAdicionarDivElement = screen.getByTestId(
  //       "div-botao-add-obs-09-1-observacoes"
  //     );
  //     const botaoAdicionar = botaoAdicionarDivElement.querySelector("button");
  //     expect(botaoAdicionar).toHaveClass("red-button-outline");
  //     expect(botaoAdicionar).toHaveTextContent("Adicionar");
  //   });
});
