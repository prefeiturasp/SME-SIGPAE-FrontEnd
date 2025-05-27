import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { PERFIL, TIPO_PERFIL } from "constants/shared";
import { MeusDadosContext } from "context/MeusDadosContext";
import { localStorageMock } from "mocks/localStorageMock";
import { mockMeusDadosCODAEGA } from "mocks/meusDados/CODAE-GA";
import { mockAlteracaoCardapioCEMEIAValidar } from "mocks/services/alteracaoCardapio.service/CEMEI/alteracaoCardapioCEMEIAValidar";
import { mockAlteracaoCardapioCEMEINegada } from "mocks/services/alteracaoCardapio.service/CEMEI/alteracaoCardapioCEMEINegada";
import { mockAlteracaoCardapioCEMEIQuestionado } from "mocks/services/alteracaoCardapio.service/CEMEI/alteracaoCardapioCEMEIQuestionado";
import { mockAlteracaoCardapioCEMEIValidada } from "mocks/services/alteracaoCardapio.service/CEMEI/alteracaoCardapioCEMEIValidada";
import { mockQuantidadeAlunoCEMEIporCEIEMEI } from "mocks/services/aluno.service/CEMEI/quantidadeAlunoCEMEIporCEIEMEI";
import { mockMotivosDRENaoValida } from "mocks/services/relatorios.service/mockMotivosDRENaoValida";
import * as RelatoriosAlteracaoDoTipoDeAlimentacaoCEMEI from "pages/AlteracaoDeCardapioCEMEIRelatorios";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import mock from "services/_mock";

jest.mock("components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: ({ data, onChange }) => (
    <textarea
      data-testid="mock-ckeditor"
      value={data}
      onChange={(e) => {
        onChange(null, {
          getData: () => e.target.value,
        });
      }}
    />
  ),
}));

describe("Teste Relatório Alteração de Cardápio CEMEI - Visão CODAE", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock
      .onGet(
        `/alteracoes-cardapio-cemei/${mockAlteracaoCardapioCEMEIValidada.uuid}/`
      )
      .replyOnce(200, mockAlteracaoCardapioCEMEIValidada);
    mock
      .onGet("/alunos/quantidade-cemei-por-cei-emei/")
      .reply(200, mockQuantidadeAlunoCEMEIporCEIEMEI);
    mock
      .onPatch(
        `/alteracoes-cardapio-cemei/${mockAlteracaoCardapioCEMEIValidada.uuid}/codae-cancela-pedido/`
      )
      .reply(200, mockAlteracaoCardapioCEMEINegada);
    mock
      .onPatch(
        `/alteracoes-cardapio-cemei/${mockAlteracaoCardapioCEMEIValidada.uuid}/codae-questiona-pedido/`
      )
      .reply(200, mockAlteracaoCardapioCEMEIQuestionado);

    const search = `?uuid=${mockAlteracaoCardapioCEMEIAValidar.uuid}&ehInclusaoContinua=false&tipoSolicitacao=solicitacao-cemei&card=undefined`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA
    );
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA
    );

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
              meusDados: mockMeusDadosCODAEGA,
              setMeusDados: jest.fn(),
            }}
          >
            <RelatoriosAlteracaoDoTipoDeAlimentacaoCEMEI.RelatorioCODAE />
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

  it("exibe modal negar", async () => {
    const botaoNegar = screen.getByText("Negar").closest("button");
    fireEvent.click(botaoNegar);

    await waitFor(() => {
      expect(
        screen.getByText("Deseja negar a solicitação?")
      ).toBeInTheDocument();
    });
  });

  it("fecha modal negar", async () => {
    const botaoNegar = screen.getByText("Negar").closest("button");
    fireEvent.click(botaoNegar);

    await waitFor(() => {
      expect(
        screen.getByText("Deseja negar a solicitação?")
      ).toBeInTheDocument();
    });

    const botaoNao = screen.getByText("Não").closest("button");
    fireEvent.click(botaoNao);

    await waitFor(() => {
      expect(
        screen.queryByText("Deseja negar a solicitação?")
      ).not.toBeInTheDocument();
    });
  });

  it("nega a solicitação", async () => {
    const botaoNegar = screen.getByText("Negar").closest("button");
    fireEvent.click(botaoNegar);

    await waitFor(() => {
      expect(
        screen.getByText("Deseja negar a solicitação?")
      ).toBeInTheDocument();
    });

    const editor = screen.getByTestId("mock-ckeditor");
    fireEvent.change(editor, { target: { value: "negado." } });

    const botaoSim = screen.getByText("Sim").closest("button");
    fireEvent.click(botaoSim);

    mock
      .onGet(
        `/alteracoes-cardapio-cemei/${mockAlteracaoCardapioCEMEIValidada.uuid}/`
      )
      .replyOnce(200, mockAlteracaoCardapioCEMEINegada);

    await waitFor(() => {
      expect(
        screen.queryByText("Deseja negar a solicitação?")
      ).not.toBeInTheDocument();
      expect(screen.queryByText("Negar")).not.toBeInTheDocument();

      expect(screen.queryByText("Questionar")).not.toBeInTheDocument();

      expect(screen.getByText("CODAE negou")).toBeInTheDocument();
    });
  });

  it("questiona a solicitação", async () => {
    const botaoQuestionar = screen.getByText("Questionar").closest("button");
    fireEvent.click(botaoQuestionar);

    await waitFor(() => {
      expect(
        screen.getByText(
          "É possível atender a solicitação com todos os itens previstos no contrato?"
        )
      ).toBeInTheDocument();
    });

    const botaoEnviar = screen.getByText("Enviar").closest("button");
    fireEvent.click(botaoEnviar);

    mock
      .onGet(
        `/alteracoes-cardapio-cemei/${mockAlteracaoCardapioCEMEIValidada.uuid}/`
      )
      .replyOnce(200, mockAlteracaoCardapioCEMEIQuestionado);

    await waitFor(() => {
      expect(
        screen.getByText("Questionamento enviado com sucesso!")
      ).toBeInTheDocument();

      expect(screen.queryByText("Negar")).not.toBeInTheDocument();

      expect(screen.queryByText("Questionar")).not.toBeInTheDocument();

      expect(screen.getByText("Questionamento pela CODAE")).toBeInTheDocument();
    });
  });
});
