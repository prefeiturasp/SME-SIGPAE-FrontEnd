import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { mockInclusaoAlimentacaoRegular } from "src/mocks/InclusaoAlimentacao/mockInclusaoAlimentacaoRegular";
import { mockInclusaoAlimentacaoValidada } from "src/mocks/InclusaoAlimentacao/mockInclusaoAlimentacaoValidada";
import { mockInclusaoContinuaAlterada } from "src/mocks/InclusaoAlimentacao/mockInclusaoContinuaAlterada";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockMeusDadosCogestor } from "src/mocks/meusDados/cogestor";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockMeusDadosTerceirizada } from "src/mocks/meusDados/terceirizada";
import { mockMotivosDRENaoValida } from "src/mocks/services/relatorios.service/mockMotivosDRENaoValida";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import * as Relatorios from "src/pages/InclusaoDeAlimentacao/RelatorioPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import mock from "src/services/_mock";

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: () => <textarea data-testid="ckeditor-mock" name="justificativa" />,
}));

const UUID = "d0f4faf0-519b-4a1a-a1bf-ae39c45d1f64";
const URL_NORMAL = `/grupos-inclusao-alimentacao-normal/${UUID}/`;

const renderRelatorio = async (children) => {
  await act(async () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        {children}
        <ToastContainer />
      </MemoryRouter>,
    );
  });
};

describe("Relatório Inclusão de Alimentação - CODAE autoriza após questionamento", () => {
  beforeEach(async () => {
    const solicitacao = {
      ...mockInclusaoAlimentacaoValidada,
      prioridade: "LIMITE",
      status: "TERCEIRIZADA_RESPONDEU_QUESTIONAMENTO",
      logs: [
        ...mockInclusaoAlimentacaoValidada.logs,
        {
          status_evento_explicacao: "Terceirizada respondeu questionamento",
          resposta_sim_nao: true,
          criado_em: "27/05/2025 10:00:00",
          usuario: {},
          descricao: "",
          justificativa: "",
        },
        {
          status_evento_explicacao: "Questionamento pela CODAE",
          resposta_sim_nao: false,
          criado_em: "27/05/2025 11:00:00",
          usuario: {},
          descricao: "",
          justificativa: "",
        },
      ],
    };

    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock.onGet(URL_NORMAL).reply(200, solicitacao);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );
    window.history.pushState(
      {},
      "",
      `?uuid=${UUID}&tipoSolicitacao=solicitacao-normal`,
    );

    await renderRelatorio(<Relatorios.RelatorioCODAE />);
  });

  it("abre e fecha o modal de autorização após questionamento", async () => {
    await waitFor(() => {
      expect(screen.getByText("Autorizar")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Autorizar").closest("button"));

    expect(
      screen.queryByText("Deseja autorizar a solicitação?"),
    ).not.toBeInTheDocument();

    const botaoNao = screen.getAllByText("Não")[0].closest("button");
    fireEvent.click(botaoNao);
  });
});

describe("Relatório Inclusão de Alimentação - DRE exibe erro ao validar", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock.onGet(URL_NORMAL).reply(200, mockInclusaoAlimentacaoRegular);
    mock
      .onPatch(`${URL_NORMAL}diretoria-regional-valida-pedido/`)
      .reply(500, {});

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);
    localStorage.setItem("perfil", PERFIL.COGESTOR_DRE);
    window.history.pushState(
      {},
      "",
      `?uuid=${UUID}&tipoSolicitacao=solicitacao-normal`,
    );

    await renderRelatorio(<Relatorios.RelatorioDRE />);
  });

  it("exibe erro ao validar a solicitação no toast", async () => {
    await waitFor(() => {
      expect(screen.getByText("Validar")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Validar").closest("button"));

    await waitFor(() => {
      expect(
        screen.getByText("Houve um erro ao validar a Inclusão de Alimentação"),
      ).toBeInTheDocument();
    });
  });
});

describe("Relatório Inclusão de Alimentação - Terceirizada questiona", () => {
  beforeEach(async () => {
    const solicitacao = {
      ...mockInclusaoAlimentacaoValidada,
      prioridade: "LIMITE",
      status: "CODAE_QUESTIONADO",
    };

    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosTerceirizada);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock.onGet(URL_NORMAL).reply(200, solicitacao);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.TERCEIRIZADA);
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_EMPRESA);
    window.history.pushState(
      {},
      "",
      `?uuid=${UUID}&tipoSolicitacao=solicitacao-normal`,
    );

    await renderRelatorio(<Relatorios.RelatorioTerceirizada />);
  });

  it("abre o modal de questionamento pelos botões Não e Sim", async () => {
    await waitFor(() => {
      expect(screen.getByText("Sim")).toBeInTheDocument();
    });

    const botoesNao = screen.getAllByText("Não");
    fireEvent.click(botoesNao[botoesNao.length - 1].closest("button"));

    fireEvent.click(screen.getByText("Cancelar").closest("button"));
    await waitFor(() => {
      expect(screen.queryByText("Cancelar")).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Sim").closest("button"));
    fireEvent.click(screen.getByText("Cancelar").closest("button"));
  });
});

describe("Relatório Inclusão de Alimentação - Terceirizada com erro nos dias úteis", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosTerceirizada);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock.onGet(URL_NORMAL).reply(200, mockInclusaoAlimentacaoValidada);
    mock.onGet("/dias-uteis/").reply(500, {});

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.TERCEIRIZADA);
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_EMPRESA);
    window.history.pushState(
      {},
      "",
      `?uuid=${UUID}&tipoSolicitacao=solicitacao-normal`,
    );

    await renderRelatorio(<Relatorios.RelatorioTerceirizada />);
  });

  it("renderiza o relatório mesmo com erro ao carregar dias úteis", async () => {
    await waitFor(() => {
      expect(
        screen.getByText("Inclusão de Alimentação - Solicitação # D0F4F"),
      ).toBeInTheDocument();
    });
  });
});

describe("Relatório Inclusão de Alimentação - Escola contínua com alteração", () => {
  beforeEach(async () => {
    const solicitacao = {
      ...mockInclusaoContinuaAlterada,
      data_inicial: "01/01/2020",
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
      .reply(200, solicitacao);

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
            <Relatorios.RelatorioEscola />
          </MemoryRouter>
        </MeusDadosContext.Provider>,
      );
    });
  });

  it("exibe botão Cancelar/Alterar para inclusão contínua autorizada", async () => {
    await waitFor(() => {
      expect(screen.getByText("Cancelar/Alterar")).toBeInTheDocument();
    });
  });
});

describe("Relatório Inclusão de Alimentação - Escola com erro nos dias úteis", () => {
  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock.onGet("/dias-uteis/").reply(500, {});
    mock
      .onGet(
        "/inclusoes-alimentacao-continua/a64f5054-873c-46bc-aefa-43966029a1a4/",
      )
      .reply(200, mockInclusaoContinuaAlterada);

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
            <Relatorios.RelatorioEscola />
          </MemoryRouter>
        </MeusDadosContext.Provider>,
      );
    });
  });

  it("renderiza o relatório mesmo com erro ao carregar dias úteis", async () => {
    await waitFor(() => {
      expect(
        screen.getByText("Inclusão de Alimentação - Solicitação # A64F5"),
      ).toBeInTheDocument();
    });
  });
});
