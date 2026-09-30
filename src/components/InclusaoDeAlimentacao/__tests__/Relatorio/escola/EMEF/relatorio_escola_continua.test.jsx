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
import { mockInclusaoContinuaAlterada } from "src/mocks/InclusaoAlimentacao/mockInclusaoContinuaAlterada";
import { mockInclusaoContinuaPrazoLimite } from "src/mocks/InclusaoAlimentacao/mockInclusaoContinuaPrazoLimite";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockMotivosDRENaoValida } from "src/mocks/services/relatorios.service/mockMotivosDRENaoValida";
import * as RelatoriosInclusaoDeAlimentacao from "src/pages/InclusaoDeAlimentacao/RelatorioPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import mock from "src/services/_mock";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { getDiasUteis } from "src/services/diasUteis.service";

jest.mock("src/services/diasUteis.service", () => ({
  getDiasUteis: jest.fn().mockResolvedValue({
    status: 200,
    data: {
      proximos_dois_dias_uteis: "2026-05-13",
      proximos_cinco_dias_uteis: "2026-05-15",
    },
  }),
  getFeriadosAno: jest.fn(),
  getFeriadosAnoAtualEProximo: jest.fn(),
}));

jest.mock("src/components/Shareable/DatePicker", () => ({
  InputComData: ({ input, label, dataTestId }) => (
    <div data-testid={dataTestId}>
      {label && <label>{label}</label>}
      <input {...input} />
    </div>
  ),
}));

const mockInclusaoContinuaPrazoLimiteEmAberto = {
  ...mockInclusaoContinuaPrazoLimite,
  data_final: "12/03/2035",
};

describe("Relatório Inclusão de Alimentação - Inclusão Contínua - Visão Escola", () => {
  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock
      .onGet("/dias-uteis/")
      .reply(200, { proximos_dois_dias_uteis: "2026-05-13" });
    mock
      .onGet(
        "/inclusoes-alimentacao-continua/a64f5054-873c-46bc-aefa-43966029a1a4/",
      )
      .replyOnce(200, mockInclusaoContinuaPrazoLimiteEmAberto);
    mock
      .onPatch(
        "/inclusoes-alimentacao-continua/a64f5054-873c-46bc-aefa-43966029a1a4/escola-cancela-pedido-48h-antes/",
      )
      .reply(200, mockInclusaoContinuaCancelada);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
    // Prevent Page's useEffect from making the getMeusDados HTTP call so that
    // meusDados arrives synchronously through the Context.Provider below.
    localStorage.setItem("meusDados", "true");

    getDiasUteis.mockClear();

    const search = `?uuid=a64f5054-873c-46bc-aefa-43966029a1a4&ehInclusaoContinua=true&tipoSolicitacao=solicitacao-continua`;
    window.history.pushState({}, "", search);

    await act(async () => {
      render(
        <MeusDadosContext.Provider
          value={{
            meusDados: mockMeusDadosEscolaEMEFPericles,
            setMeusDados: jest.fn(),
          }}
        >
          <MemoryRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <RelatoriosInclusaoDeAlimentacao.RelatorioEscola />
            <ToastContainer />
          </MemoryRouter>
        </MeusDadosContext.Provider>,
      );
    });
    // flush async effects (getDiasUteisAsync → setProximosDoisDiasUteis)
    await act(async () => {});
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
    expect(screen.getByText("12/03/2035")).toBeInTheDocument();
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
    await waitFor(() => expect(getDiasUteis).toHaveBeenCalled());
    const botaoCancelar = screen.getByText("Cancelar").closest("button");
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
    await waitFor(() => expect(getDiasUteis).toHaveBeenCalled());
    const botaoCancelar = screen.getByText("Cancelar").closest("button");
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
    await waitFor(() => expect(getDiasUteis).toHaveBeenCalled());
    const botaoCancelar = screen.getByText("Cancelar").closest("button");
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
    await waitFor(() => expect(getDiasUteis).toHaveBeenCalled());
    const botaoCancelar = screen.getByText("Cancelar").closest("button");
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
    await waitFor(() => expect(getDiasUteis).toHaveBeenCalled());
    const botaoCancelar = screen.getByText("Cancelar").closest("button");
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
    await waitFor(() => expect(getDiasUteis).toHaveBeenCalled());
    const botaoCancelar = screen.getByText("Cancelar").closest("button");
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

    expect(screen.queryByText("Cancelar")).not.toBeInTheDocument();

    expect(screen.getByText("Escola cancelou")).toBeInTheDocument();
    expect(screen.getByText("Histórico de cancelamento")).toBeInTheDocument();
    expect(
      screen.getByText("MANHA - Lanche - 100 - justificativa: xablau"),
    ).toBeInTheDocument();
  });

  it("exibe erro ao cancelar sem selecionar nenhuma data", async () => {
    await waitFor(() => expect(getDiasUteis).toHaveBeenCalled());
    const botaoCancelar = screen.getByText("Cancelar").closest("button");
    fireEvent.click(botaoCancelar);

    await waitFor(() => {
      expect(
        screen.getByText("Cancelar ou Alterar a Solicitação"),
      ).toBeInTheDocument();
    });

    const divEncerrar = screen.getByTestId("encerrar-a-partir-de-div");
    fireEvent.change(divEncerrar.querySelector("input"), {
      target: { value: "07/05/2026" },
    });

    const textarea = screen.getByTestId("textarea-justificativa");
    fireEvent.change(textarea, {
      target: { value: "justificativa de teste" },
    });

    fireEvent.click(screen.getByText("Sim").closest("button"));

    await waitFor(() => {
      expect(
        screen.getByText("Selecione pelo menos uma data"),
      ).toBeInTheDocument();
    });
  });

  it("cancela todas as datas com sucesso", async () => {
    await waitFor(() => expect(getDiasUteis).toHaveBeenCalled());
    const botaoCancelar = screen.getByText("Cancelar").closest("button");
    fireEvent.click(botaoCancelar);

    await waitFor(() => {
      expect(
        screen.getByText("Cancelar ou Alterar a Solicitação"),
      ).toBeInTheDocument();
    });

    const checkboxes = document.querySelectorAll(
      "input[data-testid^='data-cancelamento-continuo']",
    );
    checkboxes.forEach((checkbox) => {
      fireEvent.click(checkbox);
    });

    const divEncerrar = screen.getByTestId("encerrar-a-partir-de-div");
    fireEvent.change(divEncerrar.querySelector("input"), {
      target: { value: "07/05/2026" },
    });

    const textarea = screen.getByTestId("textarea-justificativa");
    fireEvent.change(textarea, {
      target: { value: "quero cancelar a solicitação." },
    });

    fireEvent.click(screen.getByText("Sim").closest("button"));

    await waitFor(() => {
      expect(
        screen.getByText("Solicitação cancelada com sucesso!"),
      ).toBeInTheDocument();
    });
  });

  it("exibe erro ao cancelar a solicitação", async () => {
    mock
      .onPatch(
        "/inclusoes-alimentacao-continua/a64f5054-873c-46bc-aefa-43966029a1a4/escola-cancela-pedido-48h-antes/",
      )
      .reply(400, { detail: "Não foi possível cancelar" });

    await waitFor(() => expect(getDiasUteis).toHaveBeenCalled());
    const botaoCancelar = screen.getByText("Cancelar").closest("button");
    fireEvent.click(botaoCancelar);

    await waitFor(() => {
      expect(
        screen.getByText("Cancelar ou Alterar a Solicitação"),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("data-cancelamento-continuo-0"));

    const divEncerrar = screen.getByTestId("encerrar-a-partir-de-div");
    fireEvent.change(divEncerrar.querySelector("input"), {
      target: { value: "07/05/2026" },
    });

    const textarea = screen.getByTestId("textarea-justificativa");
    fireEvent.change(textarea, {
      target: { value: "quero cancelar a solicitação." },
    });

    fireEvent.click(screen.getByText("Sim").closest("button"));

    await waitFor(() => {
      expect(screen.getByText("Não foi possível cancelar")).toBeInTheDocument();
    });
  });

  it("exibe 'Encerramento previsto para' quando encerrado_a_partir_de está preenchido", async () => {
    mock
      .onGet(
        "/inclusoes-alimentacao-continua/a64f5054-873c-46bc-aefa-43966029a1a4/",
      )
      .replyOnce(200, mockInclusaoContinuaAlterada);

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <RelatoriosInclusaoDeAlimentacao.RelatorioEscola />
          <ToastContainer />
        </MemoryRouter>,
      );
    });

    await waitFor(() => {
      expect(
        screen.getAllByText(/Encerramento previsto para:/).length,
      ).toBeGreaterThan(0);
      expect(screen.getAllByText(/31\/10\/2025/).length).toBeGreaterThan(0);
    });
  });
});

describe("Relatório Inclusão de Alimentação - Inclusão Contínua vencida - Visão Escola", () => {
  it("desabilita o botão Cancelar quando a data final já passou", async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock.onGet("/notificacoes/").reply(200, []);
    mock.onGet("/notificacoes/quantidade-nao-lidos/").reply(200, 0);
    mock
      .onGet("/dias-uteis/")
      .reply(200, { proximos_dois_dias_uteis: "2026-05-13" });
    mock
      .onGet(
        "/inclusoes-alimentacao-continua/a64f5054-873c-46bc-aefa-43966029a1a4/",
      )
      .replyOnce(200, mockInclusaoContinuaPrazoLimite);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
    localStorage.setItem("meusDados", "true");

    getDiasUteis.mockClear();

    const search = `?uuid=a64f5054-873c-46bc-aefa-43966029a1a4&ehInclusaoContinua=true&tipoSolicitacao=solicitacao-continua`;
    window.history.pushState({}, "", search);

    await act(async () => {
      render(
        <MeusDadosContext.Provider
          value={{
            meusDados: mockMeusDadosEscolaEMEFPericles,
            setMeusDados: jest.fn(),
          }}
        >
          <MemoryRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <RelatoriosInclusaoDeAlimentacao.RelatorioEscola />
            <ToastContainer />
          </MemoryRouter>
        </MeusDadosContext.Provider>,
      );
    });

    await waitFor(() => expect(getDiasUteis).toHaveBeenCalled());

    expect(screen.getByText("Cancelar").closest("button")).toBeDisabled();
  });
});

describe("HistoricoAlteracao - Inclusão Contínua - Visão Escola", () => {
  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock
      .onGet(
        "/inclusoes-alimentacao-continua/a64f5054-873c-46bc-aefa-43966029a1a4/",
      )
      .replyOnce(200, mockInclusaoContinuaAlterada);

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
          <ToastContainer />
        </MemoryRouter>,
      );
    });
  });

  it("exibe seção 'Histórico de alteração' quando há encerrado_a_partir_de", async () => {
    await waitFor(() => {
      expect(screen.getByText("Histórico de alteração")).toBeInTheDocument();
    });
  });

  it("exibe os dois logs de alteração com data e descrição", async () => {
    await waitFor(() => {
      expect(
        screen.getByText(/07\/10\/2025 15:00:08 - Escola alterou a data fim/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/07\/10\/2025 15:00:18 - Escola alterou a data fim/),
      ).toBeInTheDocument();
    });
  });

  it("exibe linha MANHA com encerramento previsto", async () => {
    await waitFor(() => {
      expect(
        screen.getByText(
          /MANHA - Lanche - 100 - Encerramento previsto para: 31\/10\/2025/,
        ),
      ).toBeInTheDocument();
    });
  });

  it("exibe linha TARDE com encerramento previsto", async () => {
    await waitFor(() => {
      expect(
        screen.getByText(
          /TARDE - Lanche - 100 - Encerramento previsto para: 15\/11\/2025/,
        ),
      ).toBeInTheDocument();
    });
  });

  it("exibe as justificativas de cada alteração", async () => {
    await waitFor(() => {
      expect(
        screen.getByText(
          "O projeto não será mais ofertado no período da manhã.",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Encerramento do projeto no período da tarde."),
      ).toBeInTheDocument();
    });
  });
});

describe("HistoricoAlteracao ausente - Inclusão Contínua sem encerrado_a_partir_de", () => {
  it("não exibe 'Histórico de alteração' quando não há encerrado_a_partir_de", async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock
      .onGet(
        "/inclusoes-alimentacao-continua/a64f5054-873c-46bc-aefa-43966029a1a4/",
      )
      .replyOnce(200, mockInclusaoContinuaPrazoLimite);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);

    window.history.pushState(
      {},
      "",
      `?uuid=a64f5054-873c-46bc-aefa-43966029a1a4&ehInclusaoContinua=true&tipoSolicitacao=solicitacao-continua`,
    );

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <RelatoriosInclusaoDeAlimentacao.RelatorioEscola />
          <ToastContainer />
        </MemoryRouter>,
      );
    });

    await waitFor(() => {
      expect(
        screen.queryByText("Histórico de alteração"),
      ).not.toBeInTheDocument();
    });
  });
});

describe("Relatório Inclusão de Alimentação - Cancelamento parcial - Visão Escola", () => {
  const mockInclusaoContinuaDoisPeriodos = {
    ...mockInclusaoContinuaPrazoLimite,
    motivo: {
      nome: "Programas/Projetos Contínuos",
      uuid: "d1ccc288-c941-4ffe-9a19-ff586d971f02",
    },
    data_inicial: "01/01/2020",
    data_final: "12/03/2035",
    quantidades_periodo: [
      {
        uuid: "periodo-1",
        dias_semana: [0, 1, 2, 3, 4],
        encerrado_a_partir_de: null,
        cancelado: false,
        numero_alunos: 100,
        observacao: "<p>observação</p>",
        periodo_escolar: { nome: "MANHA", uuid: "uuid-manha" },
        tipos_alimentacao: [{ nome: "Lanche" }],
      },
      {
        uuid: "periodo-2",
        dias_semana: [0, 2, 4],
        encerrado_a_partir_de: null,
        cancelado: false,
        numero_alunos: 50,
        observacao: "<p>outra</p>",
        periodo_escolar: { nome: "TARDE", uuid: "uuid-tarde" },
        tipos_alimentacao: [{ nome: "Refeição" }],
      },
    ],
  };

  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock
      .onGet("/dias-uteis/")
      .reply(200, { proximos_dois_dias_uteis: "2026-05-13" });
    mock
      .onGet(
        "/inclusoes-alimentacao-continua/a64f5054-873c-46bc-aefa-43966029a1a4/",
      )
      .reply(200, mockInclusaoContinuaDoisPeriodos);
    mock
      .onPatch(
        "/inclusoes-alimentacao-continua/a64f5054-873c-46bc-aefa-43966029a1a4/escola-cancela-pedido-48h-antes/",
      )
      .reply(200, {});

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
    localStorage.setItem("meusDados", "true");
    window.history.pushState(
      {},
      "",
      "?uuid=a64f5054-873c-46bc-aefa-43966029a1a4&ehInclusaoContinua=true&tipoSolicitacao=solicitacao-continua",
    );

    await act(async () => {
      render(
        <MeusDadosContext.Provider
          value={{
            meusDados: mockMeusDadosEscolaEMEFPericles,
            setMeusDados: jest.fn(),
          }}
        >
          <MemoryRouter
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <RelatoriosInclusaoDeAlimentacao.RelatorioEscola />
            <ToastContainer />
          </MemoryRouter>
        </MeusDadosContext.Provider>,
      );
    });
    await act(async () => {});
  });

  it("exibe dias da semana marcados na modal", async () => {
    await waitFor(() => expect(getDiasUteis).toHaveBeenCalled());
    const botaoCancelar = screen.getByText("Cancelar").closest("button");
    fireEvent.click(botaoCancelar);

    await waitFor(() => {
      expect(
        screen.getByText("Cancelar ou Alterar a Solicitação"),
      ).toBeInTheDocument();
    });

    expect(
      document.querySelectorAll(".week-circle-clicked").length,
    ).toBeGreaterThan(0);
  });

  it("cancela parcialmente e exibe o toast de sucesso parcial", async () => {
    await waitFor(() => expect(getDiasUteis).toHaveBeenCalled());
    const botaoCancelar = screen.getByText("Cancelar").closest("button");
    fireEvent.click(botaoCancelar);

    await waitFor(() => {
      expect(
        screen.getByText("Cancelar ou Alterar a Solicitação"),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("data-cancelamento-continuo-0"));

    const divEncerrar = screen.getByTestId("encerrar-a-partir-de-div");
    fireEvent.change(divEncerrar.querySelector("input"), {
      target: { value: "07/05/2026" },
    });

    const textarea = screen.getByTestId("textarea-justificativa");
    fireEvent.change(textarea, {
      target: { value: "quero cancelar parcialmente." },
    });

    fireEvent.click(screen.getByText("Sim").closest("button"));

    await waitFor(() => {
      expect(
        screen.getByText("Solicitação cancelada parcialmente com sucesso"),
      ).toBeInTheDocument();
    });
  });
});

describe("Relatório Inclusão de Alimentação - Cancelamento ETEC - Visão Escola", () => {
  beforeEach(async () => {
    const mockInclusaoContinuaETEC = {
      ...mockInclusaoContinuaPrazoLimite,
      motivo: { nome: "ETEC", uuid: "d1ccc288-c941-4ffe-9a19-ff586d971f02" },
      data_inicial: "01/01/2020",
      data_final: "12/03/2035",
    };

    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock
      .onGet("/dias-uteis/")
      .reply(200, { proximos_dois_dias_uteis: "2026-05-13" });
    mock
      .onGet(
        "/inclusoes-alimentacao-continua/a64f5054-873c-46bc-aefa-43966029a1a4/",
      )
      .reply(200, mockInclusaoContinuaETEC);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
    localStorage.setItem("meusDados", "true");
    window.history.pushState(
      {},
      "",
      "?uuid=a64f5054-873c-46bc-aefa-43966029a1a4&ehInclusaoContinua=true&tipoSolicitacao=solicitacao-continua",
    );

    await act(async () => {
      render(
        <MeusDadosContext.Provider
          value={{
            meusDados: mockMeusDadosEscolaEMEFPericles,
            setMeusDados: jest.fn(),
          }}
        >
          <MemoryRouter
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <RelatoriosInclusaoDeAlimentacao.RelatorioEscola />
            <ToastContainer />
          </MemoryRouter>
        </MeusDadosContext.Provider>,
      );
    });
    await act(async () => {});
  });

  it("não exibe a coluna Repetir para motivo ETEC", async () => {
    await waitFor(() => expect(getDiasUteis).toHaveBeenCalled());
    const botaoCancelar = screen.getByText("Cancelar").closest("button");
    fireEvent.click(botaoCancelar);

    await waitFor(() => {
      expect(
        screen.getByText("Cancelar ou Alterar a Solicitação"),
      ).toBeInTheDocument();
    });

    expect(document.querySelectorAll(".weekly").length).toBe(0);
  });
});

describe("Relatório Inclusão de Alimentação - Cancelamento sem alteração - Visão Escola", () => {
  beforeEach(async () => {
    const mockSemAlteracao = {
      ...mockInclusaoContinuaPrazoLimite,
      data_final: "12/03/2035",
    };
    delete mockSemAlteracao.data_inicial;

    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock
      .onGet("/dias-uteis/")
      .reply(200, { proximos_dois_dias_uteis: "2026-05-13" });
    mock
      .onGet(
        "/inclusoes-alimentacao-continua/a64f5054-873c-46bc-aefa-43966029a1a4/",
      )
      .reply(200, mockSemAlteracao);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
    localStorage.setItem("meusDados", "true");
    window.history.pushState(
      {},
      "",
      "?uuid=a64f5054-873c-46bc-aefa-43966029a1a4&ehInclusaoContinua=true&tipoSolicitacao=solicitacao-continua",
    );

    await act(async () => {
      render(
        <MeusDadosContext.Provider
          value={{
            meusDados: mockMeusDadosEscolaEMEFPericles,
            setMeusDados: jest.fn(),
          }}
        >
          <MemoryRouter
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <RelatoriosInclusaoDeAlimentacao.RelatorioEscola />
            <ToastContainer />
          </MemoryRouter>
        </MeusDadosContext.Provider>,
      );
    });
    await act(async () => {});
  });

  it("exibe título e textos de cancelamento sem alteração", async () => {
    await waitFor(() => expect(getDiasUteis).toHaveBeenCalled());
    const botaoCancelar = screen.getByText("Cancelar").closest("button");
    fireEvent.click(botaoCancelar);

    await waitFor(() => {
      expect(screen.getByText("Cancelar a Solicitação")).toBeInTheDocument();
    });

    expect(
      screen.getByText((content) =>
        content.includes("Deseja seguir em frente com o cancelamento?"),
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Selecione a(s) data(s) para solicitar o cancelamento:"),
    ).toBeInTheDocument();
  });
});
