// import { mockCategoriasMedicaoCEI } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockCategoriasMedicaoCEI";
// import { mockDiasCalendarioCEI } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockDiasCalendarioCEI";
// import { mockFeriadosNoMesCEI } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockFeriadosNoMesCEI";
// import { mockInclusoesAutorizadasEscolaCEI } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockInclusoesAutorizadasEscolaCEI.";
// import { mockLogsDietasAutorizadasCEI } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockLogsDietasAutorizadasCEI";
// import { mockLogsMatriculadosCEI } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockLogsMatriculadosCEI";
// import { mockLogsMatriculadosCEIInclusao } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockLogsMatriculadosCEIInclusao";

// import { mockUpdateValoresPeriodosLancamentosCEI } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockUpdateValoresPeriodoLancamentoCEI";
// import { mockValoresMedicaoCEI } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockValoresMedicaoCEI";

// import { getListaDiasSobremesaDoce } from "services/medicaoInicial/diaSobremesaDoce.service";
// import * as periodoLancamentoMedicaoService from "services/medicaoInicial/periodoLancamentoMedicao.service";
// import { getSolicitacoesInclusoesAutorizadasEscola } from "services/medicaoInicial/periodoLancamentoMedicao.service";

// import { PeriodoLancamentoMedicaoInicialCEI } from "..";

import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import CadastroCronograma from "..";

// import * as perfilService from "services/perfil.service";
import { getEmpresasCronograma } from "services/terceirizada.service";
import { getNomesDistribuidores } from "services/logistica.service";

import { mockListaDistribuidores } from "mocks/PreRecebimento/CadastroCronograma/mockListaDistribuidores";
import { mockListaEmpresas } from "mocks/PreRecebimento/CadastroCronograma/mockListaEmpresas";

jest.mock("services/logistica.service");
jest.mock("services/terceirizada.service");
// jest.mock("services/medicaoInicial/diaSobremesaDoce.service.js");
// jest.mock("services/medicaoInicial/periodoLancamentoMedicao.service");

describe("Test <CadastroCronograma>", () => {
  //   const mockLocationState = {
  //     ehEmeiDaCemei: false,
  //     escola: "CEI DIRET VILA BRASILANDIA",
  //     justificativa_periodo: null,
  //     mesAnoSelecionado: new Date("2024-11-01T00:00:00-03:00"),
  //     periodo: "PARCIAL",
  //     periodosInclusaoContinua: undefined,
  //     status_periodo: "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE",
  //     status_solicitacao: "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE",
  //     tiposAlimentacao: [],
  //   };

  beforeEach(() => {
    getNomesDistribuidores.mockResolvedValue({
      data: mockListaDistribuidores,
      status: 200,
    });
    getEmpresasCronograma.mockResolvedValue({
      data: mockListaEmpresas,
      status: 200,
    });
    // getSolicitacoesInclusoesAutorizadasEscola.mockResolvedValue({
    //   data: mockInclusoesAutorizadasEscolaCEI,
    //   status: 200,
    // });
    // periodoLancamentoMedicaoService.getLogMatriculadosPorFaixaEtariaDia.mockResolvedValueOnce(
    //   {
    //     data: mockLogsMatriculadosCEIInclusao,
    //     status: 200,
    //   }
    // );
    // periodoLancamentoMedicaoService.getSolicitacoesAlteracoesAlimentacaoAutorizadasEscola.mockResolvedValue(
    //   { results: [] }
    // );
    // periodoLancamentoMedicaoService.getLogMatriculadosPorFaixaEtariaDia.mockResolvedValueOnce(
    //   {
    //     data: mockLogsMatriculadosCEI,
    //     status: 200,
    //   }
    // );
    // periodoLancamentoMedicaoService.getSolicitacoesSuspensoesAutorizadasEscola.mockResolvedValue(
    //   { results: [] }
    // );
    // periodoLancamentoMedicaoService.getCategoriasDeMedicao.mockResolvedValue({
    //   data: mockCategoriasMedicaoCEI,
    //   status: 200,
    // });
    // periodoLancamentoMedicaoService.getLogDietasAutorizadasCEIPeriodo.mockResolvedValue(
    //   { data: mockLogsDietasAutorizadasCEI, status: 200 }
    // );
    // periodoLancamentoMedicaoService.getValoresPeriodosLancamentos.mockResolvedValue(
    //   { data: mockValoresMedicaoCEI, status: 200 }
    // );
    // periodoLancamentoMedicaoService.getDiasParaCorrecao.mockResolvedValue({
    //   data: [],
    //   status: 200,
    // });
    // periodoLancamentoMedicaoService.getDiasCalendario.mockResolvedValue({
    //   data: mockDiasCalendarioCEI,
    //   status: 200,
    // });
    // periodoLancamentoMedicaoService.getFeriadosNoMes.mockResolvedValue({
    //   data: mockFeriadosNoMesCEI,
    //   status: 200,
    // });
    // periodoLancamentoMedicaoService.updateValoresPeriodosLancamentos.mockResolvedValue(
    //   {
    //     data: mockUpdateValoresPeriodosLancamentosCEI,
    //     status: 200,
    //   }
    // );

    render(
      //   <MemoryRouter
      //     initialEntries={[{ pathname: "/", state: mockLocationState }]}
      //     future={{
      //       v7_startTransition: true,
      //       v7_relativeSplatPath: true,
      //     }}
      //   >
      <MemoryRouter>
        <CadastroCronograma />
      </MemoryRouter>
    );
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
