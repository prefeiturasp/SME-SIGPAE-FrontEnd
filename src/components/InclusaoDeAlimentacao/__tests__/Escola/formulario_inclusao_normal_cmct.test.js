import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Container } from "components/InclusaoDeAlimentacao/Escola/Formulario/componentes/Container";
import { MeusDadosContext } from "context/MeusDadosContext";
import { mockGetVinculosMotivoInclusaoEspecificoCMCT } from "mocks/services/cadastroTipoAlimentacao.service/mockGetVinculosMotivoInclusaoEspecificoCMCT";
import { mockMotivosInclusaoContinua } from "mocks/InclusaoAlimentacao/mockMotivosInclusaoContinua";
import { mockMotivosInclusaoNormal } from "mocks/InclusaoAlimentacao/mockMotivosInclusaoNormal";
import { mockQuantidadeAlunosPorPeriodoCMCT } from "mocks/services/escola.service/mockQuantidadeAlunosPorPeriodoCMCT";
import { mockGetVinculosTipoAlimentacaoPorEscolaCMCT } from "mocks/services/cadastroTipoAlimentacao.service/mockGetVinculosTipoAlimentacaoPorEscolaCMCT";
import { mockObterMinhasSolicitacoesDeInclusaoDeAlimentacaoCMCT } from "mocks/services/shared.service/mockObterMinhasSolicitacoesDeInclusaoDeAlimentacaoCMCT";
import { mockCreateInclusaoAlimentacaoCMCT } from "mocks/services/escola.service/mockCreateInclusaoAlimentacaoCMCT";
import { mockIniciaFluxoInclusaoAlimentacaoCMCT } from "mocks/services/escola.service/mockIniciaFluxoInclusaoAlimentacaoCMCT";
import { mockObterMinhasSolicitacoesNormalCMCT } from "mocks/services/shared.service/mockObterMinhasSolicitacoesNormalCMCT";
import { mockDiasUteis } from "mocks/diasUseisMock";
import { localStorageMock } from "mocks/localStorageMock";
import { mockMeusDadosEscolaCMCT } from "mocks/meusDados/escolaCMCT";
import React from "react";
import mock from "services/_mock";

describe("Teste Formulário Inclusão de Alimentação", () => {
  beforeEach(async () => {
    mock
      .onGet("/motivos-inclusao-normal/")
      .reply(200, mockMotivosInclusaoNormal);
    mock
      .onGet("/motivos-inclusao-continua/")
      .reply(200, mockMotivosInclusaoContinua);
    mock
      .onGet(
        "/quantidade-alunos-por-periodo/escola/f206b315-fa30-4768-9fa6-07b952800284/"
      )
      .reply(200, mockQuantidadeAlunosPorPeriodoCMCT);
    mock
      .onGet(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/f206b315-fa30-4768-9fa6-07b952800284/"
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCMCT);
    mock
      .onGet(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/motivo_inclusao_especifico/"
      )
      .reply(200, mockGetVinculosMotivoInclusaoEspecificoCMCT);
    mock.onGet("/dias-uteis/").reply(200, mockDiasUteis);
    mock
      .onGet("/grupos-inclusao-alimentacao-normal/minhas-solicitacoes/")
      .reply(200, mockObterMinhasSolicitacoesNormalCMCT);
    mock
      .onGet("/inclusoes-alimentacao-continua/minhas-solicitacoes/")
      .reply(200, mockObterMinhasSolicitacoesDeInclusaoDeAlimentacaoCMCT);
    mock.onGet("/dias-uteis/").reply(200, mockDiasUteis);

    mock
      .onPost("/grupos-inclusao-alimentacao-normal/")
      .reply(201, mockCreateInclusaoAlimentacaoCMCT);
    mock
      .onPatch(
        "/grupos-inclusao-alimentacao-normal/dbaf2a79-a251-4fb3-8576-ef5384b19c3e/inicio-pedido/"
      )
      .reply(200, mockIniciaFluxoInclusaoAlimentacaoCMCT);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", `"CMCT VANDYR DA SILVA, PROF"`);

    await act(async () => {
      render(
        <MeusDadosContext.Provider
          value={{ meusDados: mockMeusDadosEscolaCMCT }}
        >
          <Container />
        </MeusDadosContext.Provider>
      );
    });
  });

  it("renderiza bloco `Rascunhos`", async () => {
    expect(screen.getByText("Rascunhos")).toBeInTheDocument();
    expect(
      screen.getByText("Inclusão de Alimentação # 43029")
    ).toBeInTheDocument();
    expect(screen.getByText("1 dia(s)")).toBeInTheDocument();
    expect(
      screen.getByText("Criado em: 10/03/2025 14:54:30")
    ).toBeInTheDocument();
  });

  it("renderiza label `Motivo`", async () => {
    expect(screen.getByText("Motivo")).toBeInTheDocument();
  });

  const setMotivoValueReposicaoDeAula = () => {
    const selectMotivo = screen.getByTestId("select-motivo-0");
    const selectElement = selectMotivo.querySelector("select");
    const uuidMotivoReposicaoDeAula = mockMotivosInclusaoNormal.results.find(
      (motivo) => motivo.nome === "Reposição de aula"
    ).uuid;
    fireEvent.change(selectElement, {
      target: { value: uuidMotivoReposicaoDeAula },
    });
  };

  it("renderiza label `Dia` após selecionar um motivo", async () => {
    setMotivoValueReposicaoDeAula();
    expect(screen.getByText("Dia")).toBeInTheDocument();
  });

  const setupInclusaoNormal = async (preencheNumero) => {
    setMotivoValueReposicaoDeAula();

    const divDia = screen.getByTestId("data-motivo-normal-0");
    const inputElement = divDia.querySelector("input");
    fireEvent.change(inputElement, {
      target: { value: "24/03/2025" },
    });

    expect(screen.getByText("Período")).toBeInTheDocument();
    expect(screen.getByText("MANHA")).toBeInTheDocument();
    expect(screen.getByText("TARDE")).toBeInTheDocument();

    const divCheckboxMANHA = screen.getByTestId("div-checkbox-MANHA");
    const spanElement = divCheckboxMANHA.querySelector("span");

    await act(async () => {
      fireEvent.click(spanElement);
    });

    const divSelectMANHA = screen.getByTestId("select-simples-div-MANHA");
    const selectElementTipoAlimentacao = divSelectMANHA.querySelector("select");

    expect(screen.queryAllByText("Lanche 4h").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("Refeição").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("Sobremesa").length).toBeGreaterThan(0);
    expect(
      screen.queryAllByText("Refeição e Sobremesa").length
    ).toBeGreaterThan(0);

    fireEvent.change(selectElementTipoAlimentacao, {
      target: { value: "refeicao_e_sobremesa" },
    });

    if (preencheNumero) {
      const divNumeroAlunos = screen.getByTestId("numero-alunos-0");
      const inputElementNumeroAlunos = divNumeroAlunos.querySelector("input");

      await act(async () => {
        fireEvent.change(inputElementNumeroAlunos, {
          target: { value: 100 },
        });
      });
    }
  };

  it("envia inclusão de alimentação com sucesso", async () => {
    await setupInclusaoNormal(true);
    const botaoEnviarSolicitacao = screen.getByTestId("botao-enviar-inclusao");
    await act(async () => {
      fireEvent.click(botaoEnviarSolicitacao);
    });
  });

  it("Testa se a validação de preenchimento de número está funcionando corretamente", async () => {
    await setupInclusaoNormal(false);
    const botaoEnviarSolicitacao = screen.getByTestId("botao-enviar-inclusao");
    await act(async () => {
      fireEvent.click(botaoEnviarSolicitacao);
    });
    expect(screen.getByText("Deve ser maior ou igual a 1")).toBeInTheDocument();
  });
});
