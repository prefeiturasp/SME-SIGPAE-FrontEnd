import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockMeusDadosTerceirizada } from "src/mocks/meusDados/terceirizada";
import { mockAlteracaoCardapioCEMEIValidada } from "src/mocks/services/alteracaoCardapio.service/CEMEI/alteracaoCardapioCEMEIValidada";
import { mockQuantidadeAlunoCEMEIporCEIEMEI } from "src/mocks/services/aluno.service/CEMEI/quantidadeAlunoCEMEIporCEIEMEI";
import { mockMotivosDRENaoValida } from "src/mocks/services/relatorios.service/mockMotivosDRENaoValida";
import * as Relatorios from "src/pages/AlteracaoDeCardapioCEMEIRelatorios";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import mock from "src/services/_mock";

jest.mock("src/components/Shareable/CKEditorField", () => ({
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

jest.mock("file-saver", () => ({
  saveAs: jest.fn(),
}));

const base = mockAlteracaoCardapioCEMEIValidada;

const solicitacaoRegular = {
  ...base,
  prioridade: "REGULAR",
};

const solicitacaoRespondeuQuestionamento = {
  ...base,
  prioridade: "LIMITE",
  status: "TERCEIRIZADA_RESPONDEU_QUESTIONAMENTO",
  logs: [
    ...base.logs,
    {
      status_evento_explicacao: "Terceirizada respondeu questionamento",
      resposta_sim_nao: true,
      criado_em: "26/05/2025 18:00:00",
      usuario: {},
      descricao: "",
      justificativa: "",
    },
    {
      status_evento_explicacao: "Questionamento pela CODAE",
      resposta_sim_nao: false,
      criado_em: "26/05/2025 19:00:00",
      usuario: {},
      descricao: "",
      justificativa: "",
    },
  ],
};

const solicitacaoAutorizada = {
  ...base,
  status: "CODAE_AUTORIZADO",
  terceirizada_conferiu_gestao: false,
};

const solicitacaoAutorizadaConferida = {
  ...base,
  status: "CODAE_AUTORIZADO",
  terceirizada_conferiu_gestao: true,
};

const solicitacaoQuestionada = {
  ...base,
  status: "CODAE_QUESTIONADO",
};

const setupMocks = ({ solicitacao = base, meusDados, status = 200 }) => {
  mock.onGet("/usuarios/meus-dados/").reply(200, meusDados);
  mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
  mock
    .onGet(`/alteracoes-cardapio-cemei/${solicitacao.uuid}/`)
    .reply(status, status === 200 ? solicitacao : { detail: "Erro" });
  mock
    .onGet("/alunos/quantidade-cemei-por-cei-emei/")
    .reply(200, mockQuantidadeAlunoCEMEIporCEIEMEI);

  window.history.pushState(
    {},
    "",
    `?uuid=${solicitacao.uuid}&tipoSolicitacao=solicitacao-cemei&card=undefined`,
  );

  Object.defineProperty(global, "localStorage", { value: localStorageMock });
};

const renderRelatorio = async (meusDados, children) => {
  await act(async () => {
    render(
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <MeusDadosContext.Provider
          value={{ meusDados, setMeusDados: jest.fn() }}
        >
          {children}
          <ToastContainer />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

describe("Relatório CEMEI - CODAE autoriza pedido regular", () => {
  beforeEach(async () => {
    setupMocks({
      solicitacao: solicitacaoRegular,
      meusDados: mockMeusDadosCODAEGA,
    });
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );
    await renderRelatorio(mockMeusDadosCODAEGA, <Relatorios.RelatorioCODAE />);
  });

  it("abre e fecha o modal de autorização da CODAE", async () => {
    await waitFor(() => {
      expect(screen.getByText("Autorizar")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Autorizar").closest("button"));
    expect(
      screen.getByText("Deseja autorizar a solicitação?"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Não").closest("button"));
    await waitFor(() => {
      expect(
        screen.queryByText("Deseja autorizar a solicitação?"),
      ).not.toBeInTheDocument();
    });
  });
});

describe("Relatório CEMEI - CODAE autoriza após questionamento", () => {
  beforeEach(async () => {
    setupMocks({
      solicitacao: solicitacaoRespondeuQuestionamento,
      meusDados: mockMeusDadosCODAEGA,
    });
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );
    await renderRelatorio(mockMeusDadosCODAEGA, <Relatorios.RelatorioCODAE />);
  });

  it("abre e fecha o modal de autorização após questionamento", async () => {
    await waitFor(() => {
      expect(screen.getByText("Autorizar")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Autorizar").closest("button"));

    const botaoNao = screen.getAllByText("Não")[0].closest("button");
    fireEvent.click(botaoNao);
  });
});

describe("Relatório CEMEI - Terceirizada marca conferência", () => {
  beforeEach(async () => {
    setupMocks({
      solicitacao: solicitacaoAutorizada,
      meusDados: mockMeusDadosTerceirizada,
    });
    mock
      .onPatch(
        `/alteracoes-cardapio-cemei/${solicitacaoAutorizada.uuid}/marcar-conferida/`,
      )
      .reply(200, {});
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.TERCEIRIZADA);
    localStorage.setItem("perfil", PERFIL.NUTRI_EMPRESA);
    await renderRelatorio(
      mockMeusDadosTerceirizada,
      <Relatorios.RelatorioTerceirizada />,
    );
  });

  it("marca conferência e fecha o modal", async () => {
    await waitFor(() => {
      expect(screen.getByText("Marcar Conferência")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Marcar Conferência").closest("button"));
    expect(
      screen.getByText("Marcar Conferência da Solicitação"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancelar").closest("button"));
    await waitFor(() => {
      expect(
        screen.queryByText("Marcar Conferência da Solicitação"),
      ).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Marcar Conferência").closest("button"));
    fireEvent.click(screen.getByText("Confirmar").closest("button"));
  });
});

describe("Relatório CEMEI - Terceirizada visualiza solicitação conferida", () => {
  beforeEach(async () => {
    setupMocks({
      solicitacao: solicitacaoAutorizadaConferida,
      meusDados: mockMeusDadosTerceirizada,
    });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.TERCEIRIZADA);
    localStorage.setItem("perfil", PERFIL.NUTRI_EMPRESA);
    await renderRelatorio(
      mockMeusDadosTerceirizada,
      <Relatorios.RelatorioTerceirizada />,
    );
  });

  it("exibe solicitação conferida", async () => {
    await waitFor(() => {
      expect(screen.getByText("Solicitação Conferida")).toBeInTheDocument();
    });
  });
});

describe("Relatório CEMEI - Terceirizada questiona", () => {
  beforeEach(async () => {
    setupMocks({
      solicitacao: solicitacaoQuestionada,
      meusDados: mockMeusDadosTerceirizada,
    });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.TERCEIRIZADA);
    localStorage.setItem("perfil", PERFIL.NUTRI_EMPRESA);
    await renderRelatorio(
      mockMeusDadosTerceirizada,
      <Relatorios.RelatorioTerceirizada />,
    );
  });

  it("exibe o botão Sim para a terceirizada", async () => {
    await waitFor(() => {
      expect(screen.getByText("Sim")).toBeInTheDocument();
    });
  });
});

describe("Relatório CEMEI - erros de carregamento", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock
      .onGet(`/alteracoes-cardapio-cemei/${base.uuid}/`)
      .reply(500, { detail: "Erro" });
    mock
      .onGet("/alunos/quantidade-cemei-por-cei-emei/")
      .reply(200, mockQuantidadeAlunoCEMEIporCEIEMEI);
    window.history.pushState(
      {},
      "",
      `?uuid=${base.uuid}&tipoSolicitacao=solicitacao-cemei&card=undefined`,
    );
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );
    await renderRelatorio(mockMeusDadosCODAEGA, <Relatorios.RelatorioCODAE />);
  });

  it("exibe carregando quando a solicitação falha", async () => {
    await waitFor(() => {
      expect(
        screen.queryByText("Alteração do Tipo de Alimentação - Solicitação #"),
      ).not.toBeInTheDocument();
    });
  });
});

describe("Relatório CEMEI - erro ao carregar matriculados", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock.onGet(`/alteracoes-cardapio-cemei/${base.uuid}/`).reply(200, base);
    mock
      .onGet("/alunos/quantidade-cemei-por-cei-emei/")
      .reply(500, { detail: "Erro" });
    window.history.pushState(
      {},
      "",
      `?uuid=${base.uuid}&tipoSolicitacao=solicitacao-cemei&card=undefined`,
    );
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );
    await renderRelatorio(mockMeusDadosCODAEGA, <Relatorios.RelatorioCODAE />);
  });

  it("não renderiza o relatório quando os matriculados falham", async () => {
    await waitFor(() => {
      expect(
        screen.queryByText("Alteração do Tipo de Alimentação - Solicitação #"),
      ).not.toBeInTheDocument();
    });
  });
});
