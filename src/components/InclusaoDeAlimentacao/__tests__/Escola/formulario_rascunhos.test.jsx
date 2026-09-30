import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { Container } from "src/components/InclusaoDeAlimentacao/Escola/Formulario/componentes/Container";
import { PERFIL, TIPO_SOLICITACAO } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockCreateGrupoInclusaoNormal } from "src/mocks/InclusaoAlimentacao/mockCreateGrupoInclusaoNormal";
import { mockInicioPedidoGrupoInclusaoAlimentacao } from "src/mocks/InclusaoAlimentacao/mockInicioPedidoGrupoInclusaoAlimentacao";
import { mockMinhasSolicitacoesInclusaoNormal } from "src/mocks/InclusaoAlimentacao/mockMinhasSolicitacoesInclusaoNormal";
import { mockMotivoInclusaoEspecifico } from "src/mocks/InclusaoAlimentacao/mockMotivoInclusaoEspecifico";
import { mockMotivosInclusaoContinua } from "src/mocks/InclusaoAlimentacao/mockMotivosInclusaoContinua";
import { mockMotivosInclusaoNormal } from "src/mocks/InclusaoAlimentacao/mockMotivosInclusaoNormal";
import { mockPeriodosEscolaresNoite } from "src/mocks/InclusaoAlimentacao/mockPeriodosEscolaresNoite";
import { mockQuantidadeAlunosPorPeriodo } from "src/mocks/InclusaoAlimentacao/mockQuantidadeAlunosPorPeriodo";
import { mockTiposAlimentacao } from "src/mocks/InclusaoAlimentacao/mockTiposAlimentacao";
import { mockVinculosTipoAlimentacaoEPeriodoEscolar } from "src/mocks/InclusaoAlimentacao/mockVinculosTipoAlimentacaoEPeriodoescolar";
import { mockDiasUteis } from "src/mocks/diasUseisMock";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import React from "react";
import {
  getTiposDeAlimentacao,
  getVinculosTipoAlimentacaoMotivoInclusaoEspecifico,
  getVinculosTipoAlimentacaoPorEscola,
} from "src/services/cadastroTipoAlimentacao.service";
import { filtrarAlunosMatriculados } from "src/services/alunosMatriculados.service";
import { getDiasUteis } from "src/services/diasUteis.service";
import {
  buscaPeriodosEscolares,
  getQuantidaDeAlunosPorPeriodoEEscola,
} from "src/services/escola.service";
import {
  createInclusaoAlimentacao,
  escolaExcluirSolicitacaoDeInclusaoDeAlimentacao,
  getMotivosInclusaoContinua,
  getMotivosInclusaoNormal,
  iniciaFluxoInclusaoAlimentacao,
  obterMinhasSolicitacoesDeInclusaoDeAlimentacao,
  updateInclusaoAlimentacao,
} from "src/services/inclusaoDeAlimentacao";

jest.mock("src/services/cadastroTipoAlimentacao.service");
jest.mock("src/services/escola.service");
jest.mock("src/services/alunosMatriculados.service");
jest.mock("src/services/diasUteis.service");
jest.mock("src/services/inclusaoDeAlimentacao");

let mockRascunhosNormais = mockMinhasSolicitacoesInclusaoNormal;

const setupBase = async () => {
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
  getQuantidaDeAlunosPorPeriodoEEscola.mockResolvedValue({
    data: mockQuantidadeAlunosPorPeriodo,
    status: 200,
  });
  getVinculosTipoAlimentacaoPorEscola.mockResolvedValue({
    data: mockVinculosTipoAlimentacaoEPeriodoEscolar,
    status: 200,
  });
  filtrarAlunosMatriculados.mockResolvedValue({
    data: { results: [] },
    status: 200,
  });
  getVinculosTipoAlimentacaoMotivoInclusaoEspecifico.mockResolvedValue({
    data: mockMotivoInclusaoEspecifico,
    status: 200,
  });
  getTiposDeAlimentacao.mockResolvedValue({
    data: mockTiposAlimentacao,
    status: 200,
  });
  getDiasUteis.mockResolvedValue({
    data: mockDiasUteis,
    status: 200,
  });
  obterMinhasSolicitacoesDeInclusaoDeAlimentacao.mockImplementation((tipo) =>
    Promise.resolve({
      data:
        tipo === TIPO_SOLICITACAO.SOLICITACAO_NORMAL
          ? mockRascunhosNormais
          : { results: [] },
      status: 200,
    }),
  );
  createInclusaoAlimentacao.mockResolvedValue({
    data: mockCreateGrupoInclusaoNormal,
    status: 201,
  });
  updateInclusaoAlimentacao.mockResolvedValue({
    data: mockCreateGrupoInclusaoNormal,
    status: 200,
  });
  iniciaFluxoInclusaoAlimentacao.mockResolvedValue({
    data: mockInicioPedidoGrupoInclusaoAlimentacao,
    status: 200,
  });
  escolaExcluirSolicitacaoDeInclusaoDeAlimentacao.mockResolvedValue({
    data: {},
    status: 204,
  });
  window.confirm = jest.fn(() => true);

  Object.defineProperty(global, "localStorage", { value: localStorageMock });
  localStorage.clear();
  localStorage.setItem(
    "nome_instituicao",
    `"EMEF PERICLES EUGENIO DA SILVA RAMOS"`,
  );
  localStorage.setItem("perfil", PERFIL.DIRETOR_UE);

  await act(async () => {
    render(
      <MeusDadosContext.Provider
        value={{ meusDados: mockMeusDadosEscolaEMEFPericles }}
      >
        <Container />
      </MeusDadosContext.Provider>,
    );
  });
};

describe("Teste Rascunhos do Formulário Inclusão de Alimentação - teclado", () => {
  beforeEach(async () => {
    await setupBase();
  });

  it("remove rascunho pelo teclado com Enter", async () => {
    await waitFor(() => screen.getByTestId("remover-rascunho-06E82"));

    fireEvent.keyDown(screen.getByTestId("remover-rascunho-06E82"), {
      key: "Enter",
    });

    expect(escolaExcluirSolicitacaoDeInclusaoDeAlimentacao).toHaveBeenCalled();
  });

  it("remove rascunho pelo teclado com Espaço", async () => {
    await waitFor(() => screen.getByTestId("remover-rascunho-06E82"));

    fireEvent.keyDown(screen.getByTestId("remover-rascunho-06E82"), {
      key: " ",
    });

    expect(escolaExcluirSolicitacaoDeInclusaoDeAlimentacao).toHaveBeenCalled();
  });

  it("carrega rascunho pelo teclado com Enter", async () => {
    await waitFor(() => screen.getByTestId("rascunho-06E82"));

    fireEvent.keyDown(screen.getByTestId("rascunho-06E82"), { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByText("Solicitação # 06E82")).toBeInTheDocument();
    });
  });

  it("carrega rascunho pelo teclado com Espaço", async () => {
    await waitFor(() => screen.getByTestId("rascunho-06E82"));

    fireEvent.keyDown(screen.getByTestId("rascunho-06E82"), { key: " " });

    await waitFor(() => {
      expect(screen.getByText("Solicitação # 06E82")).toBeInTheDocument();
    });
  });

  it("ignora tecla neutra ao remover rascunho", async () => {
    await waitFor(() => screen.getByTestId("remover-rascunho-06E82"));
    escolaExcluirSolicitacaoDeInclusaoDeAlimentacao.mockClear();

    fireEvent.keyDown(screen.getByTestId("remover-rascunho-06E82"), {
      key: "a",
    });

    expect(
      escolaExcluirSolicitacaoDeInclusaoDeAlimentacao,
    ).not.toHaveBeenCalled();
  });

  it("ignora tecla neutra ao carregar rascunho", async () => {
    await waitFor(() => screen.getByTestId("rascunho-06E82"));

    fireEvent.keyDown(screen.getByTestId("rascunho-06E82"), { key: "a" });

    expect(screen.queryByText("Solicitação # 06E82")).not.toBeInTheDocument();
  });
});

describe("Teste Rascunhos do Formulário Inclusão de Alimentação - sem data nem inclusões", () => {
  it("renderiza zero dias para rascunho sem data e sem inclusões", async () => {
    mockRascunhosNormais = {
      results: [
        {
          prioridade: "REGULAR",
          uuid: "06e77777-7777-4777-8777-777777777777",
          id_externo: "06E77",
          status: "RASCUNHO",
          criado_em: "24/01/2025 09:43:08",
          solicitacoes_similares: [],
          logs: [],
          descricao: "",
        },
      ],
    };

    await setupBase();

    await waitFor(() => screen.getByText("Inclusão de Alimentação # 06E77"));
    expect(screen.getByText("0 dia(s)")).toBeInTheDocument();
  });
});
