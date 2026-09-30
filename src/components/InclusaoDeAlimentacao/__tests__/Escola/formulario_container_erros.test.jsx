import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
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

const setupMocks = ({ falhar }) => {
  getMotivosInclusaoNormal.mockResolvedValue({
    data: mockMotivosInclusaoNormal,
    status: falhar === "motivosNormal" ? 500 : 200,
  });
  getMotivosInclusaoContinua.mockResolvedValue({
    data: mockMotivosInclusaoContinua,
    status: falhar === "motivosContinua" ? 500 : 200,
  });
  buscaPeriodosEscolares.mockResolvedValue({
    data: mockPeriodosEscolaresNoite,
    status: falhar === "periodosEscolares" ? 500 : 200,
  });
  getQuantidaDeAlunosPorPeriodoEEscola.mockResolvedValue({
    data: mockQuantidadeAlunosPorPeriodo,
    status: falhar === "quantidadeAlunos" ? 500 : 200,
  });
  getVinculosTipoAlimentacaoPorEscola.mockResolvedValue({
    data: mockVinculosTipoAlimentacaoEPeriodoEscolar,
    status: falhar === "vinculos" ? 500 : 200,
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
    status: falhar === "diasUteis" ? 500 : 200,
  });
  obterMinhasSolicitacoesDeInclusaoDeAlimentacao.mockImplementation((tipo) =>
    Promise.resolve({
      data:
        tipo === TIPO_SOLICITACAO.SOLICITACAO_NORMAL
          ? mockMinhasSolicitacoesInclusaoNormal
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
};

const renderContainer = async () => {
  Object.defineProperty(global, "localStorage", { value: localStorageMock });
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

describe("Teste Container Formulário Inclusão de Alimentação - erros", () => {
  it("exibe erro ao carregar quantidade de alunos da escola", async () => {
    setupMocks({ falhar: "quantidadeAlunos" });
    await renderContainer();

    await waitFor(() => {
      expect(
        screen.getByText(
          "Erro ao carregar quantidade de alunos da escola. Tente novamente mais tarde.",
        ),
      ).toBeInTheDocument();
    });
  });

  it("exibe erro ao carregar vínculos do tipo de alimentação da escola", async () => {
    setupMocks({ falhar: "vinculos" });
    await renderContainer();

    await waitFor(() => {
      expect(
        screen.getByText(
          "Erro ao carregar vinculos do tipo de alimentação da escola. Tente novamente mais tarde.",
        ),
      ).toBeInTheDocument();
    });
  });

  it("exibe erro ao carregar motivos de inclusão contínua", async () => {
    setupMocks({ falhar: "motivosContinua" });
    await renderContainer();

    await waitFor(() => {
      expect(
        screen.getByText(
          "Erro ao carregar motivos de inclusão normal. Tente novamente mais tarde.",
        ),
      ).toBeInTheDocument();
    });
  });

  it("exibe erro ao carregar motivos de inclusão normal", async () => {
    setupMocks({ falhar: "motivosNormal" });
    await renderContainer();

    await waitFor(() => {
      expect(
        screen.getByText(
          "Erro ao carregar motivos de inclusão contínua. Tente novamente mais tarde.",
        ),
      ).toBeInTheDocument();
    });
  });

  it("exibe erro ao carregar dias úteis", async () => {
    setupMocks({ falhar: "diasUteis" });
    await renderContainer();

    await waitFor(() => {
      expect(
        screen.getByText(
          "Erro ao carregar dias úteis. Tente novamente mais tarde.",
        ),
      ).toBeInTheDocument();
    });
  });

  it("exibe erro ao carregar períodos escolares", async () => {
    setupMocks({ falhar: "periodosEscolares" });
    await renderContainer();

    await waitFor(() => {
      expect(
        screen.getByText(
          "Erro ao carregar períodos escolares. Tente novamente mais tarde.",
        ),
      ).toBeInTheDocument();
    });
  });
});

describe("Teste Container Formulário Inclusão de Alimentação - escola CEI", () => {
  it("inicializa motivos contínuos vazios para escola CEI", async () => {
    setupMocks({ falhar: null });
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", `"CIEJA CLARICE LISPECTOR"`);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("eh_cei", "true");

    await act(async () => {
      render(
        <MeusDadosContext.Provider
          value={{ meusDados: mockMeusDadosEscolaEMEFPericles }}
        >
          <Container />
        </MeusDadosContext.Provider>,
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Motivo")).toBeInTheDocument();
    });
  });

  it("filtra o motivo ETEC para escola que não exibe ETEC", async () => {
    setupMocks({ falhar: null });
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.clear();
    localStorage.setItem("nome_instituicao", `"CIEJA CLARICE LISPECTOR"`);
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

    await waitFor(() => {
      expect(screen.getByText("Motivo")).toBeInTheDocument();
    });
  });
});

describe("Teste Container Formulário Inclusão de Alimentação - sem meusDados", () => {
  it("não dispara as requisições sem meusDados", async () => {
    setupMocks({ falhar: null });
    getDiasUteis.mockClear();
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.clear();
    localStorage.setItem(
      "nome_instituicao",
      `"EMEF PERICLES EUGENIO DA SILVA RAMOS"`,
    );
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);

    await act(async () => {
      render(
        <MeusDadosContext.Provider value={{}}>
          <Container />
        </MeusDadosContext.Provider>,
      );
    });

    expect(getDiasUteis).not.toHaveBeenCalled();
  });
});
