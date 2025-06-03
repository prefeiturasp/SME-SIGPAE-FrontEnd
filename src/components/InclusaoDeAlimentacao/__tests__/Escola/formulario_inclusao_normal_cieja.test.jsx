import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Container } from "src/components/InclusaoDeAlimentacao/Escola/Formulario/componentes/Container";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockDiasUteis } from "src/mocks/diasUseisMock";
import { mockMotivosInclusaoContinua } from "src/mocks/InclusaoAlimentacao/mockMotivosInclusaoContinua";
import { mockMotivosInclusaoNormal } from "src/mocks/InclusaoAlimentacao/mockMotivosInclusaoNormal";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaCIEJA } from "src/mocks/meusDados/escolaCIEJA";
import { mockGetVinculosMotivoEspecificoCIEJA } from "src/mocks/services/cadastroTipoAlimentacao.service/CIEJA/mockGetVinculosMotivoEspecificoCIEJA";
import { mockGetVinculosTipoAlimentacaoPorEscolaCIEJA } from "src/mocks/services/cadastroTipoAlimentacao.service/CIEJA/mockGetVinculosTipoAlimentacaoPorEscolaCIEJA";
import { mockQuantidadeAlunosPorPeriodoCIEJA } from "src/mocks/services/escola.service/CIEJA/mockQuantidadeAlunosPorPeriodoCIEJA";
import { mockCreateInclusaoAlimentacaoCMCT } from "src/mocks/services/escola.service/CMCT/mockCreateInclusaoAlimentacaoCMCT";
import { mockIniciaFluxoInclusaoAlimentacaoCMCT } from "src/mocks/services/escola.service/CMCT/mockIniciaFluxoInclusaoAlimentacaoCMCT";
import { mockObterMinhasSolicitacoesNormalCIEJA } from "src/mocks/services/shared.service/mockObterMinhasSolicitacoesNormalCIEJA";
import mock from "src/services/_mock";

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
        "/quantidade-alunos-por-periodo/escola/673744fa-1767-4efe-8df2-bcaa6d47223f/"
      )
      .reply(200, mockQuantidadeAlunosPorPeriodoCIEJA);
    mock
      .onGet(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/673744fa-1767-4efe-8df2-bcaa6d47223f/"
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCIEJA);
    mock
      .onGet(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/motivo_inclusao_especifico/"
      )
      .reply(200, mockGetVinculosMotivoEspecificoCIEJA);
    mock
      .onGet("/grupos-inclusao-alimentacao-normal/minhas-solicitacoes/")
      .reply(200, mockObterMinhasSolicitacoesNormalCIEJA);
    mock
      .onGet("/inclusoes-alimentacao-continua/minhas-solicitacoes/")
      .reply(200, mockObterMinhasSolicitacoesNormalCIEJA);

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
    localStorage.setItem(
      "nome_instituicao",
      `"CIEJA ROSA KAZUE INAKAKE DE SOUZA, PROFA"`
    );

    await act(async () => {
      render(
        <MeusDadosContext.Provider
          value={{ meusDados: mockMeusDadosEscolaCIEJA }}
        >
          <Container />
        </MeusDadosContext.Provider>
      );
    });
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
});
