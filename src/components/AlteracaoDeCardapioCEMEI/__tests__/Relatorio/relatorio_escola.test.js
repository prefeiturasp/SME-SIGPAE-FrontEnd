import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "constants/shared";
import { MeusDadosContext } from "context/MeusDadosContext";
import { localStorageMock } from "mocks/localStorageMock";
import { mockMeusDadosEscolaCEMEI } from "mocks/meusDados/escola/CEMEI";
import { mockAlteracaoCardapioCEMEIAValidar } from "mocks/services/alteracaoCardapio.service/CEMEI/alteracaoCardapioCEMEIAValidar";
import { mockAlteracaoCardapioCEMEICancelada } from "mocks/services/alteracaoCardapio.service/CEMEI/alteracaoCardapioCEMEICancelada";
import { mockQuantidadeAlunoCEMEIporCEIEMEI } from "mocks/services/aluno.service/CEMEI/quantidadeAlunoCEMEIporCEIEMEI";
import { mockMotivosDRENaoValida } from "mocks/services/relatorios.service/mockMotivosDRENaoValida";
import * as RelatoriosAlteracaoDoTipoDeAlimentacaoCEMEI from "pages/AlteracaoDeCardapioCEMEIRelatorios";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import mock from "services/_mock";

describe("Teste Relatório Alteração de Cardápio CEMEI - Visão Escola", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCEMEI);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock
      .onGet(
        `/alteracoes-cardapio-cemei/${mockAlteracaoCardapioCEMEIAValidar.uuid}/`
      )
      .reply(200, mockAlteracaoCardapioCEMEIAValidar);
    mock
      .onGet("/alunos/quantidade-cemei-por-cei-emei/")
      .reply(200, mockQuantidadeAlunoCEMEIporCEIEMEI);
    mock
      .onPatch(
        `/alteracoes-cardapio-cemei/${mockAlteracaoCardapioCEMEIAValidar.uuid}/escola-cancela-pedido-48h-antes/`
      )
      .reply(200, mockAlteracaoCardapioCEMEICancelada);

    const search = `?uuid=${mockAlteracaoCardapioCEMEIAValidar.uuid}&ehInclusaoContinua=false&tipoSolicitacao=solicitacao-cemei&card=undefined`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", `"CEMEI SUZANA CAMPOS TAUIL"`);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
    localStorage.setItem("eh_cemei", "true");

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosEscolaCEMEI,
              setMeusDados: jest.fn(),
            }}
          >
            <RelatoriosAlteracaoDoTipoDeAlimentacaoCEMEI.RelatorioEscola />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("renderiza título da página `Alteração do Tipo de Alimentação - Solicitação # 8AA0A`", async () => {
    expect(
      screen.getByText("Alteração do Tipo de Alimentação - Solicitação # 8AA0A")
    ).toBeInTheDocument();
  });

  it("renderiza bloco com dados do solicitante", async () => {
    expect(screen.getByText("Solicitação no prazo limite")).toBeInTheDocument();

    expect(screen.getByText("Nº da Solicitação")).toBeInTheDocument();

    expect(screen.getByText("Escola Solicitante:")).toBeInTheDocument();
    expect(screen.queryAllByText("CEMEI SUZANA CAMPOS TAUIL")).toHaveLength(2);

    expect(screen.getByText("Código EOL:")).toBeInTheDocument();
    expect(screen.getByText("400232")).toBeInTheDocument();

    expect(screen.getByText("DRE:")).toBeInTheDocument();
    expect(screen.getByText("IPIRANGA")).toBeInTheDocument();

    expect(screen.getByText("Lote:")).toBeInTheDocument();
    expect(screen.getByText("3567-3")).toBeInTheDocument();

    expect(screen.getByText("Tipo de Gestão:")).toBeInTheDocument();
    expect(screen.getByText("TERC TOTAL")).toBeInTheDocument();

    expect(screen.getByText("Empresa:")).toBeInTheDocument();
    expect(screen.getByText("ALIMENTAR")).toBeInTheDocument();
  });

  it("renderiza dados da solicitação - motivo e data", async () => {
    expect(screen.getByText("Solicitação de Alteração")).toBeInTheDocument();

    expect(screen.getByText("Tipo de Alteração")).toBeInTheDocument();
    expect(screen.getByText("LPR - Lanche por Refeição")).toBeInTheDocument();

    expect(screen.getByText("Alterar dia")).toBeInTheDocument();
    expect(screen.getByText("29/05/2025")).toBeInTheDocument();
  });

  it("renderiza dados da solicitação - Alunos CEI", async () => {
    expect(screen.getByText("INTEGRAL")).toBeInTheDocument();

    expect(screen.getByText("Alunos CEI")).toBeInTheDocument();

    expect(
      screen.queryAllByText("Alteração do tipo de Alimentação de:")
    ).toHaveLength(2);
    expect(screen.queryAllByText("Lanche")).toHaveLength(2);

    expect(screen.queryAllByText("Para o tipo de Alimentação:")).toHaveLength(
      2
    );
    expect(screen.getByText("Almoço")).toBeInTheDocument();

    expect(screen.getByText("Faixa Etária")).toBeInTheDocument();
    expect(screen.getByText("01 ano a 03 anos e 11 meses")).toBeInTheDocument();
    expect(screen.getByText("04 anos a 06 anos")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();

    expect(screen.queryAllByText("Alunos matriculados")).toHaveLength(2);
    expect(screen.getByText("70")).toBeInTheDocument();
    expect(screen.getByText("72")).toBeInTheDocument();
  });

  it("renderiza dados da solicitação - Alunos EMEI", async () => {
    expect(screen.getByText("Alunos EMEI")).toBeInTheDocument();

    expect(screen.getByText("Refeição")).toBeInTheDocument();
  });

  it("cancela solicitação", async () => {
    const botaoCancelar = screen.getByText("Cancelar").closest("button");
    fireEvent.click(botaoCancelar);

    await waitFor(() => {
      expect(
        screen.getByText("Cancelamento de Solicitação")
      ).toBeInTheDocument();
    });

    const inputDia29_05_2025 = screen.getByTestId("data_29/05/2025");
    fireEvent.click(inputDia29_05_2025);

    const textarea = screen.getByTestId("textarea-justificativa");
    fireEvent.change(textarea, {
      target: { value: "quero cancelar a solicitação." },
    });

    const botaoSim = screen.getByText("Sim").closest("button");
    fireEvent.click(botaoSim);

    mock
      .onGet(
        `/alteracoes-cardapio-cemei/${mockAlteracaoCardapioCEMEIAValidar.uuid}/`
      )
      .reply(200, mockAlteracaoCardapioCEMEICancelada);

    await waitFor(() => {
      expect(
        screen.queryByText("Cancelamento de Solicitação")
      ).not.toBeInTheDocument();
    });

    expect(screen.queryByText("Cancelar")).not.toBeInTheDocument();

    expect(screen.getByText("Escola cancelou")).toBeInTheDocument();
    expect(screen.getByText("Histórico de cancelamento")).toBeInTheDocument();
    expect(
      screen.getByText(
        "29/05/2025 - justificativa: quero cancelar a solicitação."
      )
    ).toBeInTheDocument();
  });
});
