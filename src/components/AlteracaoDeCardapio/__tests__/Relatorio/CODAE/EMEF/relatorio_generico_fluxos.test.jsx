import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockMeusDadosCogestor } from "src/mocks/meusDados/cogestor";
import { mockMeusDadosTerceirizada } from "src/mocks/meusDados/terceirizada";
import { mockAlteracaoCardapioAValidar } from "src/mocks/services/alteracaoCardapio.service/EMEF/alteracaoCardapioAValidar";
import { mockAlteracaoCardapioValidada } from "src/mocks/services/alteracaoCardapio.service/EMEF/alteracaoCardapioValidada";
import { mockMotivosDRENaoValida } from "src/mocks/services/relatorios.service/mockMotivosDRENaoValida";
import * as Relatorios from "src/pages/AlteracaoDeCardapio/RelatorioPage";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

const solicitacaoQuestionada = {
  ...mockAlteracaoCardapioValidada,
  status: "CODAE_QUESTIONADO",
  prioridade: "LIMITE",
};

const solicitacaoAutorizada = {
  ...mockAlteracaoCardapioValidada,
  status: "CODAE_AUTORIZADO",
  terceirizada_conferiu_gestao: false,
};

const solicitacaoAutorizadaConferida = {
  ...mockAlteracaoCardapioValidada,
  status: "CODAE_AUTORIZADO",
  terceirizada_conferiu_gestao: true,
};

const setup = ({ meusDados, tipoPerfil, perfil, solicitacao, uuid }) => {
  mock.onGet(`/alteracoes-cardapio/${uuid}/`).reply(200, solicitacao);
  mock.onGet("/usuarios/meus-dados/").reply(200, meusDados);
  mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
  Object.defineProperty(global, "localStorage", { value: localStorageMock });
  localStorage.setItem("tipo_perfil", tipoPerfil);
  localStorage.setItem("perfil", perfil);
  window.history.pushState(
    {},
    "",
    `?uuid=${uuid}&tipoSolicitacao=solicitacao-normal&card=undefined`,
  );
};

const renderRelatorio = async (children) => {
  await act(async () => {
    render(
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        {children}
      </MemoryRouter>,
    );
  });
};

describe("Relatório Alteração do Tipo de Alimentação - DRE valida pedido", () => {
  beforeEach(async () => {
    setup({
      meusDados: mockMeusDadosCogestor,
      tipoPerfil: TIPO_PERFIL.DIRETORIA_REGIONAL,
      perfil: PERFIL.COGESTOR_DRE,
      solicitacao: mockAlteracaoCardapioAValidar,
      uuid: mockAlteracaoCardapioAValidar.uuid,
    });
    mock
      .onPatch(
        `/alteracoes-cardapio/${mockAlteracaoCardapioAValidar.uuid}/diretoria-regional-valida-pedido/`,
      )
      .reply(200, {});
    await renderRelatorio(<Relatorios.RelatorioDRE />);
  });

  it("valida a solicitação", async () => {
    await waitFor(() => {
      expect(screen.getByText("Validar")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Validar").closest("button"));
    });
  });
});

describe("Relatório Alteração do Tipo de Alimentação - CODAE autoriza pedido regular", () => {
  beforeEach(async () => {
    setup({
      meusDados: mockMeusDadosCODAEGA,
      tipoPerfil: TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
      perfil: PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
      solicitacao: mockAlteracaoCardapioValidada,
      uuid: mockAlteracaoCardapioValidada.uuid,
    });
    await renderRelatorio(<Relatorios.RelatorioCODAE />);
  });

  it("abre e fecha o modal de autorização da CODAE", async () => {
    await waitFor(() => {
      expect(screen.getByText("Autorizar")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Autorizar").closest("button"));
    });

    expect(
      screen.getByText("Deseja autorizar a solicitação?"),
    ).toBeInTheDocument();

    const botaoNao = screen.getAllByText("Não")[0].closest("button");
    await act(async () => {
      fireEvent.click(botaoNao);
    });

    await waitFor(() => {
      expect(
        screen.queryByText("Deseja autorizar a solicitação?"),
      ).not.toBeInTheDocument();
    });
  });
});

describe("Relatório Alteração do Tipo de Alimentação - Terceirizada questiona", () => {
  beforeEach(async () => {
    setup({
      meusDados: mockMeusDadosTerceirizada,
      tipoPerfil: TIPO_PERFIL.TERCEIRIZADA,
      perfil: PERFIL.NUTRI_EMPRESA,
      solicitacao: solicitacaoQuestionada,
      uuid: mockAlteracaoCardapioValidada.uuid,
    });
    await renderRelatorio(<Relatorios.RelatorioTerceirizada />);
  });

  it("abre e fecha o modal de questionamento pelos botões Não e Sim", async () => {
    await waitFor(() => {
      expect(screen.getByText("Sim")).toBeInTheDocument();
    });

    const botoesNao = screen.getAllByText("Não");
    await act(async () => {
      fireEvent.click(botoesNao[botoesNao.length - 1].closest("button"));
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Cancelar").closest("button"));
    });
    await waitFor(() => {
      expect(screen.queryByText("Cancelar")).not.toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Sim").closest("button"));
    });
    await act(async () => {
      fireEvent.click(screen.getByText("Cancelar").closest("button"));
    });
  });
});

describe("Relatório Alteração do Tipo de Alimentação - CODAE questiona", () => {
  beforeEach(async () => {
    setup({
      meusDados: mockMeusDadosCODAEGA,
      tipoPerfil: TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
      perfil: PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
      solicitacao: {
        ...mockAlteracaoCardapioValidada,
        prioridade: "LIMITE",
      },
      uuid: mockAlteracaoCardapioValidada.uuid,
    });
    await renderRelatorio(<Relatorios.RelatorioCODAE />);
  });

  it("abre e fecha o modal de questionamento", async () => {
    await waitFor(() => {
      expect(screen.getByText("Questionar")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Questionar").closest("button"));
    });
    await act(async () => {
      fireEvent.click(screen.getByText("Cancelar").closest("button"));
    });
  });
});

describe("Relatório Alteração do Tipo de Alimentação - Terceirizada marca conferência", () => {
  beforeEach(async () => {
    setup({
      meusDados: mockMeusDadosTerceirizada,
      tipoPerfil: TIPO_PERFIL.TERCEIRIZADA,
      perfil: PERFIL.NUTRI_EMPRESA,
      solicitacao: solicitacaoAutorizada,
      uuid: mockAlteracaoCardapioValidada.uuid,
    });
    mock
      .onPatch(
        `/alteracoes-cardapio/${mockAlteracaoCardapioValidada.uuid}/marcar-conferida/`,
      )
      .reply(200, {});
    await renderRelatorio(<Relatorios.RelatorioTerceirizada />);
  });

  it("abre e fecha o modal de marcar conferência", async () => {
    await waitFor(() => {
      expect(screen.getByText("Marcar Conferência")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Marcar Conferência").closest("button"));
    });

    expect(
      screen.getByText("Marcar Conferência da Solicitação"),
    ).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText("Cancelar").closest("button"));
    });

    await waitFor(() => {
      expect(
        screen.queryByText("Marcar Conferência da Solicitação"),
      ).not.toBeInTheDocument();
    });
  });
});

describe("Relatório Alteração do Tipo de Alimentação - Terceirizada visualiza conferida", () => {
  beforeEach(async () => {
    setup({
      meusDados: mockMeusDadosTerceirizada,
      tipoPerfil: TIPO_PERFIL.TERCEIRIZADA,
      perfil: PERFIL.NUTRI_EMPRESA,
      solicitacao: solicitacaoAutorizadaConferida,
      uuid: mockAlteracaoCardapioValidada.uuid,
    });
    await renderRelatorio(<Relatorios.RelatorioTerceirizada />);
  });

  it("exibe solicitação conferida", async () => {
    await waitFor(() => {
      expect(screen.getByText("Solicitação Conferida")).toBeInTheDocument();
    });
  });
});
