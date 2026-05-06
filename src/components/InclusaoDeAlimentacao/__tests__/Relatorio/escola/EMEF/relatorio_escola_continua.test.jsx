import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { mockInclusaoContinuaCancelada } from "src/mocks/InclusaoAlimentacao/mockInclusaoContinuaCancelada";
import { mockInclusaoContinuaPrazoLimite } from "src/mocks/InclusaoAlimentacao/mockInclusaoContinuaPrazoLimite";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockMotivosDRENaoValida } from "src/mocks/services/relatorios.service/mockMotivosDRENaoValida";
import * as RelatoriosInclusaoDeAlimentacao from "src/pages/InclusaoDeAlimentacao/RelatorioPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

jest.mock("src/components/Shareable/DatePicker", () => ({
  InputComData: ({ input, label, dataTestId }) => (
    <div data-testid={dataTestId}>
      {label && <label>{label}</label>}
      <input {...input} />
    </div>
  ),
}));

describe("Relatório Inclusão de Alimentação - Inclusão Contínua - Visão Escola", () => {
  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock
      .onGet(
        "/inclusoes-alimentacao-continua/a64f5054-873c-46bc-aefa-43966029a1a4/",
      )
      .replyOnce(200, mockInclusaoContinuaPrazoLimite);
    mock
      .onPatch(
        "/inclusoes-alimentacao-continua/a64f5054-873c-46bc-aefa-43966029a1a4/escola-cancela-pedido-48h-antes/",
      )
      .reply(200, mockInclusaoContinuaCancelada);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);

    const search = `?uuid=a64f5054-873c-46bc-aefa-43966029a1a4&ehInclusaoContinua=true&tipoSolicitacao=solicitacao-continua`;
    window.history.pushState({}, "", search);

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <RelatoriosInclusaoDeAlimentacao.RelatorioEscola />
        </MemoryRouter>,
      );
    });
  });

  it("renderiza título da página `Inclusão de Alimentação - Solicitação # A64F5`", async () => {
    expect(
      screen.getByText("Inclusão de Alimentação - Solicitação # A64F5"),
    ).toBeInTheDocument();
  });

  it("renderiza label `Solicitação no prazo limite`", async () => {
    expect(screen.getByText("Solicitação no prazo limite")).toBeInTheDocument();
  });

  it("renderiza motivo e data", async () => {
    expect(screen.getByText("Motivo")).toBeInTheDocument();
    expect(
      screen.getByText("Programas/Projetos Contínuos"),
    ).toBeInTheDocument();

    expect(screen.getByText("De")).toBeInTheDocument();
    expect(screen.getByText("05/03/2025")).toBeInTheDocument();

    expect(screen.getByText("Até")).toBeInTheDocument();
    expect(screen.getByText("12/03/2025")).toBeInTheDocument();
  });

  it("renderiza tabela com período, tipos de alimentação e nº de alunos", async () => {
    expect(screen.getByText("Repetir")).toBeInTheDocument();

    expect(screen.getByText("Período")).toBeInTheDocument();
    expect(screen.getByText("MANHA")).toBeInTheDocument();

    expect(screen.getByText("Tipos de Alimentação")).toBeInTheDocument();
    expect(screen.getByText("Lanche")).toBeInTheDocument();

    expect(screen.getByText("Nº de Alunos")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();

    expect(screen.getByText("Observações:")).toBeInTheDocument();
    expect(screen.getByText("observação da inclusão")).toBeInTheDocument();
  });

  it("exibe modal cancela solicitação", async () => {
    const botaoCancelar = screen
      .getByText("Cancelar/Alterar")
      .closest("button");
    fireEvent.click(botaoCancelar);

    await waitFor(() => {
      expect(
        screen.getByText("Cancelar ou Alterar a Solicitação"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Esta solicitação está aguardando validação pela DRE. Deseja seguir em frente com a alteração ou cancelamento?",
        ),
      ).toBeInTheDocument();
    });
  });

  it("fecha modal cancela solicitação", async () => {
    const botaoCancelar = screen
      .getByText("Cancelar/Alterar")
      .closest("button");
    fireEvent.click(botaoCancelar);

    await waitFor(() => {
      expect(
        screen.getByText("Cancelar ou Alterar a Solicitação"),
      ).toBeInTheDocument();
    });

    const botaoNao = screen.getByText("Não").closest("button");
    fireEvent.click(botaoNao);

    await waitFor(() => {
      expect(
        screen.queryByText("Cancelar ou Alterar a Solicitação"),
      ).not.toBeInTheDocument();
    });
  });

  it("exibe campo 'Encerrar a partir de' na modal de cancelamento/alteração", async () => {
    const botaoCancelar = screen
      .getByText("Cancelar/Alterar")
      .closest("button");
    fireEvent.click(botaoCancelar);

    await waitFor(() => {
      expect(
        screen.getByText("Cancelar ou Alterar a Solicitação"),
      ).toBeInTheDocument();
    });

    expect(screen.getByTestId("encerrar-a-partir-de-div")).toBeInTheDocument();
    expect(screen.getByText("Encerrar a partir de:")).toBeInTheDocument();
  });

  it("exibe novo texto de seleção de datas na modal", async () => {
    const botaoCancelar = screen
      .getByText("Cancelar/Alterar")
      .closest("button");
    fireEvent.click(botaoCancelar);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Selecione a(s) data(s) para solicitar o cancelamento ou alteração:",
        ),
      ).toBeInTheDocument();
    });
  });

  it("não envia formulário sem preencher 'Encerrar a partir de'", async () => {
    const botaoCancelar = screen
      .getByText("Cancelar/Alterar")
      .closest("button");
    fireEvent.click(botaoCancelar);

    await waitFor(() => {
      expect(
        screen.getByText("Cancelar ou Alterar a Solicitação"),
      ).toBeInTheDocument();
    });

    const input = screen.getByTestId("data-cancelamento-continuo-0");
    fireEvent.click(input);

    const textarea = screen.getByTestId("textarea-justificativa");
    fireEvent.change(textarea, {
      target: { value: "justificativa de teste" },
    });

    const botaoSim = screen.getByText("Sim").closest("button");
    fireEvent.click(botaoSim);

    await waitFor(() => {
      expect(
        screen.getByText("Cancelar ou Alterar a Solicitação"),
      ).toBeInTheDocument();
    });
  });

  it("cancela solicitação", async () => {
    const botaoCancelar = screen
      .getByText("Cancelar/Alterar")
      .closest("button");
    fireEvent.click(botaoCancelar);

    await waitFor(() => {
      expect(
        screen.getByText("Cancelar ou Alterar a Solicitação"),
      ).toBeInTheDocument();
    });

    const input = screen.getByTestId("data-cancelamento-continuo-0");
    fireEvent.click(input);

    const divEncerrar = screen.getByTestId("encerrar-a-partir-de-div");
    const inputEncerrar = divEncerrar.querySelector("input");
    fireEvent.change(inputEncerrar, {
      target: { value: "07/05/2026" },
    });

    const textarea = screen.getByTestId("textarea-justificativa");
    fireEvent.change(textarea, {
      target: { value: "quero cancelar a solicitação." },
    });

    const botaoSim = screen.getByText("Sim").closest("button");
    fireEvent.click(botaoSim);

    mock
      .onGet(
        "/inclusoes-alimentacao-continua/a64f5054-873c-46bc-aefa-43966029a1a4/",
      )
      .replyOnce(200, mockInclusaoContinuaCancelada);

    await waitFor(() => {
      expect(
        screen.queryByText("Cancelar ou Alterar a Solicitação"),
      ).not.toBeInTheDocument();
    });

    expect(screen.queryByText("Cancelar/Alterar")).not.toBeInTheDocument();

    expect(screen.getByText("Escola cancelou")).toBeInTheDocument();
    expect(screen.getByText("Histórico de cancelamento")).toBeInTheDocument();
    expect(
      screen.getByText("MANHA - Lanche - 100 - justificativa: xablau"),
    ).toBeInTheDocument();
  });
});
