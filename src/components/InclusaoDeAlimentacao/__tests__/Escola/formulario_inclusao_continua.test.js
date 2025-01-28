import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { Container } from "components/InclusaoDeAlimentacao/Escola/Formulario/componentes/Container";
import { TIPO_SOLICITACAO } from "constants/shared";
import { MeusDadosContext } from "context/MeusDadosContext";
import { mockCreateInclusaoContinua } from "mocks/InclusaoAlimentacao/mockCreateInclusaoContinua";
import { mockInicioPedidoInclusaoContinua } from "mocks/InclusaoAlimentacao/mockInicioPedidoInclusaoContinua";
import { mockMinhasSolicitacoesInclusaoContinua } from "mocks/InclusaoAlimentacao/mockMinhasSolicitacoesInclusaoContinua";
import { mockMotivoInclusaoEspecifico } from "mocks/InclusaoAlimentacao/mockMotivoInclusaoEspecifico";
import { mockMotivosInclusaoContinua } from "mocks/InclusaoAlimentacao/mockMotivosInclusaoContinua";
import { mockMotivosInclusaoNormal } from "mocks/InclusaoAlimentacao/mockMotivosInclusaoNormal";
import { mockPeriodosEscolaresNoite } from "mocks/InclusaoAlimentacao/mockPeriodosEscolaresNoite";
import { mockQuantidadeAlunosPorPeriodo } from "mocks/InclusaoAlimentacao/mockQuantidadeAlunosPorPeriodo";
import { mockTiposAlimentacao } from "mocks/InclusaoAlimentacao/mockTiposAlimentacao";
import { mockVinculosTipoAlimentacaoEPeriodoEscolar } from "mocks/InclusaoAlimentacao/mockVinculosTipoAlimentacaoEPeriodoescolar";
import { mockDiasUteis } from "mocks/diasUseisMock";
import { localStorageMock } from "mocks/localStorageMock";
import { mockMeusDadosEscolaEMEFPericles } from "mocks/meusDados/escolaEMEFPericles";
import React from "react";
import {
  getTiposDeAlimentacao,
  getVinculosTipoAlimentacaoMotivoInclusaoEspecifico,
  getVinculosTipoAlimentacaoPorEscola,
} from "services/cadastroTipoAlimentacao.service";
import { getDiasUteis } from "services/diasUteis.service";
import {
  buscaPeriodosEscolares,
  getQuantidadeAlunosEscola,
} from "services/escola.service";
import {
  createInclusaoAlimentacao,
  getMotivosInclusaoContinua,
  getMotivosInclusaoNormal,
  iniciaFluxoInclusaoAlimentacao,
  obterMinhasSolicitacoesDeInclusaoDeAlimentacao,
} from "services/inclusaoDeAlimentacao";

jest.mock("services/cadastroTipoAlimentacao.service");
jest.mock("services/escola.service");
jest.mock("services/diasUteis.service");
jest.mock("services/inclusaoDeAlimentacao");

const awaitServices = async () => {
  await waitFor(() => {
    expect(getDiasUteis).toHaveBeenCalled();
    expect(getMotivosInclusaoNormal).toHaveBeenCalled();
    expect(getMotivosInclusaoContinua).toHaveBeenCalled();
    expect(buscaPeriodosEscolares).toHaveBeenCalled();
    expect(getQuantidadeAlunosEscola).toHaveBeenCalled();
    expect(getVinculosTipoAlimentacaoPorEscola).toHaveBeenCalled();
    expect(
      getVinculosTipoAlimentacaoMotivoInclusaoEspecifico
    ).toHaveBeenCalled();
    expect(
      obterMinhasSolicitacoesDeInclusaoDeAlimentacao
    ).toHaveBeenCalledTimes(2);
  });
};

describe("Teste Formulário Inclusão de Alimentação", () => {
  beforeEach(async () => {
    getMotivosInclusaoNormal.mockResolvedValue({
      data: mockMotivosInclusaoNormal,
      status: 200,
    });
    getMotivosInclusaoContinua.mockResolvedValue({
      data: mockMotivosInclusaoContinua,
      status: 200,
    });
    buscaPeriodosEscolares.mockResolvedValue({
      data: mockPeriodosEscolaresNoite,
      status: 200,
    });
    getQuantidadeAlunosEscola.mockResolvedValue({
      data: mockQuantidadeAlunosPorPeriodo,
      status: 200,
    });
    getVinculosTipoAlimentacaoPorEscola.mockResolvedValue({
      data: mockVinculosTipoAlimentacaoEPeriodoEscolar,
      status: 200,
    });
    getVinculosTipoAlimentacaoMotivoInclusaoEspecifico.mockResolvedValue({
      data: mockMotivoInclusaoEspecifico,
      status: 200,
    });
    getDiasUteis.mockResolvedValue({
      data: mockDiasUteis,
      status: 200,
    });
    obterMinhasSolicitacoesDeInclusaoDeAlimentacao.mockImplementation(
      (tipo) => {
        if (tipo === TIPO_SOLICITACAO.SOLICITACAO_NORMAL) {
          return Promise.resolve({
            data: { results: [] },
            status: 200,
          });
        }
        if (tipo === TIPO_SOLICITACAO.SOLICITACAO_CONTINUA) {
          return Promise.resolve({
            data: mockMinhasSolicitacoesInclusaoContinua,
            status: 200,
          });
        }
        return Promise.resolve({
          data: { results: [] },
          status: 500,
        });
      }
    );
    getTiposDeAlimentacao.mockResolvedValue({
      ...mockTiposAlimentacao,
      status: 200,
    });
    createInclusaoAlimentacao.mockResolvedValue({
      data: mockCreateInclusaoContinua,
      status: 201,
    });
    iniciaFluxoInclusaoAlimentacao.mockResolvedValue({
      data: mockInicioPedidoInclusaoContinua,
      status: 200,
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "nome_instituicao",
      `"EMEF PERICLES EUGENIO DA SILVA RAMOS"`
    );

    global.window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));

    await act(async () => {
      render(
        <MeusDadosContext.Provider
          value={{ meusDados: mockMeusDadosEscolaEMEFPericles }}
        >
          <Container />
        </MeusDadosContext.Provider>
      );
    });
  });

  it("renderiza bloco com número de matriculados", async () => {
    await awaitServices();
    expect(screen.getByText("Nº de Matriculados")).toBeInTheDocument();
    expect(screen.getByText("524")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Informação automática disponibilizada pelo Cadastro da Unidade Escolar"
      )
    ).toBeInTheDocument();
  });

  it("renderiza bloco `Rascunhos`", async () => {
    await awaitServices();
    expect(screen.getByText("Rascunhos")).toBeInTheDocument();
    expect(
      screen.getByText("Inclusão de Alimentação # 12CDB")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Programas/Projetos Contínuos - (12/02/2025 - 27/02/2025)"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("Criado em: 27/01/2025 16:34:09")
    ).toBeInTheDocument();
  });

  it("renderiza label `Motivo`", async () => {
    await awaitServices();
    expect(screen.getByText("Motivo")).toBeInTheDocument();
  });

  const setMotivoValueProgramasProjetosContinuos = () => {
    const selectMotivo = screen.getByTestId("select-motivo");
    const selectElement = selectMotivo.querySelector("select");
    const uuidMotivoProgramasProjetosContinuos =
      mockMotivosInclusaoContinua.results.find(
        (motivo) => motivo.nome === "Programas/Projetos Contínuos"
      ).uuid;
    fireEvent.change(selectElement, {
      target: { value: uuidMotivoProgramasProjetosContinuos },
    });
  };

  const setupInclusaoContinua = async () => {
    setMotivoValueProgramasProjetosContinuos();

    expect(screen.getByText("De")).toBeInTheDocument();
    expect(screen.getByText("Até")).toBeInTheDocument();

    const divDataInicial = screen.getByTestId("data-inicial-div");
    const inputDataInicial = divDataInicial.querySelector("input");
    fireEvent.change(inputDataInicial, {
      target: { value: "30/01/2025" },
    });

    const divDataFinal = screen.getByTestId("data-final-div");
    const inputDataFinal = divDataFinal.querySelector("input");
    fireEvent.change(inputDataFinal, {
      target: { value: "01/12/2025" },
    });

    await waitFor(() => {
      expect(getTiposDeAlimentacao).toHaveBeenCalled();
    });

    expect(screen.getByText("Recorrência e detalhes")).toBeInTheDocument();

    const spanDomingo = screen.getByTestId("dias-semana-0");
    fireEvent.click(spanDomingo);

    const selectPeriodoDiv = screen.getByTestId("div-select-periodo-escolar");
    const selectElement = selectPeriodoDiv.querySelector("select");
    const uuidMANHA = "5067e137-e5f3-4876-a63f-7f58cce93f33";
    fireEvent.change(selectElement, {
      target: { value: uuidMANHA },
    });

    expect(screen.getByText("Lanche 4h")).toBeInTheDocument();
    expect(screen.getByText("Lanche")).toBeInTheDocument();
    expect(screen.getByText("Refeição")).toBeInTheDocument();
    expect(screen.getByText("Sobremesa")).toBeInTheDocument();
    expect(screen.getByText("Refeição e Sobremesa")).toBeInTheDocument();

    const selectTipoAlimentacaoDiv = screen.getByTestId(
      "div-select-tipo-alimentacao"
    );
    const selectElementTipoAlimentacao =
      selectTipoAlimentacaoDiv.querySelector("select");
    fireEvent.change(selectElementTipoAlimentacao, {
      target: { value: "Refeição e Sobremesa" },
    });

    const divNumeroAlunos = screen.getByTestId("numero-alunos");
    const inputElementNumeroAlunos = divNumeroAlunos.querySelector("input");

    await act(async () => {
      fireEvent.change(inputElementNumeroAlunos, {
        target: { value: 100 },
      });
    });

    const botaoAdicionarRecorrencia = screen.getByTestId(
      "botao-adicionar-recorrencia"
    );
    await act(async () => {
      fireEvent.click(botaoAdicionarRecorrencia);
    });
  };

  it("envia inclusão de alimentação continua com sucesso", async () => {
    await awaitServices();
    await setupInclusaoContinua();
    const botaoEnviarSolicitacao = screen.getByTestId("botao-enviar-inclusao");
    await act(async () => {
      fireEvent.click(botaoEnviarSolicitacao);
    });
  });

  /*

  it("salva rascunho com sucesso", async () => {
    await awaitServices();
    await setupInclusaoNormal();
    const botaoSalvarRascunho = screen.getByTestId("botao-salvar-rascunho");
    await act(async () => {
      fireEvent.click(botaoSalvarRascunho);
    });
  });

  it("carrega rascunho e atualiza", async () => {
    await awaitServices();
    const botaoCarregarRascunho = screen.getByTestId("rascunho-06E82");
    await act(async () => {
      fireEvent.click(botaoCarregarRascunho);
    });

    await waitFor(() => {
      expect(screen.getByText("Solicitação # 06E82")).toBeInTheDocument();

      expect(screen.getByText("Período")).toBeInTheDocument();
      expect(screen.getByText("MANHA")).toBeInTheDocument();

      const divNumeroAlunos = screen.getByTestId("numero-alunos-0");
      const inputElementNumeroAlunos = divNumeroAlunos.querySelector("input");
      expect(inputElementNumeroAlunos).toHaveValue(100);
    });

    const botaoSalvarRascunho = screen.getByTestId("botao-salvar-rascunho");
    await act(async () => {
      fireEvent.click(botaoSalvarRascunho);
    });
  });*/
});
