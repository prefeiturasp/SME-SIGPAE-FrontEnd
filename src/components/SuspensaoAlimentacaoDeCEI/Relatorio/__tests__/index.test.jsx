import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { ToastContainer } from "react-toastify";
import Relatorio from "src/components/SuspensaoAlimentacaoDeCEI/Relatorio";
import { CODAE, TERCEIRIZADA } from "src/configs/constants";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockSolicitacaoSuspensaoAlimentacaoCEI } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockSolicitacoes/mockSolicitacaoSuspensaoAlimentacaoCEI";
import mock from "src/services/_mock";

const SOLICITACAO = mockSolicitacaoSuspensaoAlimentacaoCEI;
const UUID = SOLICITACAO.uuid;
const URL_SOLICITACAO = `/suspensao-alimentacao-de-cei/${UUID}/`;
const URL_CANCELA = `/suspensao-alimentacao-de-cei/${UUID}/cancela-suspensao-cei/`;
const URL_MARCAR_CONFERIDA = `/suspensao-alimentacao-de-cei/${UUID}/marcar-conferida/`;

const SOLICITACAO_CANCELADA = { ...SOLICITACAO, status: "ESCOLA_CANCELOU" };
const SOLICITACAO_CONFERIDA = {
  ...SOLICITACAO,
  terceirizada_conferiu_gestao: true,
};

const definirUsuario = ({ perfil, tipoPerfil, moduloGestao }) => {
  localStorage.setItem("perfil", perfil);
  localStorage.setItem("tipo_perfil", tipoPerfil);
  if (moduloGestao) localStorage.setItem("modulo_gestao", moduloGestao);
};

const USUARIO_ESCOLA = {
  perfil: PERFIL.ADMINISTRADOR_UE,
  tipoPerfil: TIPO_PERFIL.ESCOLA,
  moduloGestao: MODULO_GESTAO.TERCEIRIZADA,
};
const USUARIO_DIRETOR_ESCOLA = {
  ...USUARIO_ESCOLA,
  perfil: PERFIL.DIRETOR_UE,
};
const USUARIO_TERCEIRIZADA = {
  perfil: PERFIL.ADMINISTRADOR_EMPRESA,
  tipoPerfil: TIPO_PERFIL.TERCEIRIZADA,
};
const USUARIO_EMPRESA = {
  perfil: PERFIL.USUARIO_EMPRESA,
  tipoPerfil: TIPO_PERFIL.TERCEIRIZADA,
};
const USUARIO_CODAE = {
  perfil: PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
  tipoPerfil: TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
};

const setup = async ({ visao = CODAE, comUuid = true } = {}) => {
  window.history.pushState({}, "", comUuid ? `/?uuid=${UUID}` : "/");

  await act(async () => {
    render(
      <>
        <Relatorio visao={visao} />
        <ToastContainer />
      </>,
    );
  });
};

const aguardarRelatorio = async () => {
  expect(
    await screen.findByText(
      `Suspensão de Alimentação - Solicitação # ${SOLICITACAO.id_externo}`,
    ),
  ).toBeInTheDocument();
};

describe("SuspensaoAlimentacaoDeCEI - Relatório", () => {
  beforeEach(() => {
    mock.reset();
    mock.onGet(URL_SOLICITACAO).reply(200, SOLICITACAO);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
  });

  afterEach(() => {
    localStorage.clear();
    window.history.pushState({}, "", "/");
  });

  it("não busca a solicitação quando não há uuid na URL", async () => {
    definirUsuario(USUARIO_CODAE);

    await setup({ comUuid: false });

    expect(
      screen.getByText("Suspensão de Alimentação - Solicitação #"),
    ).toBeInTheDocument();
    expect(mock.history.get).toHaveLength(0);
    expect(screen.queryByText(SOLICITACAO.escola.nome)).not.toBeInTheDocument();
  });

  it("exibe os dados da solicitação buscada pelo uuid da URL", async () => {
    definirUsuario(USUARIO_CODAE);

    await setup();
    await aguardarRelatorio();

    expect(screen.getByText(SOLICITACAO.escola.nome)).toBeInTheDocument();
    expect(screen.getByText(SOLICITACAO.escola.codigo_eol)).toBeInTheDocument();
    expect(screen.getByText(SOLICITACAO.motivo.nome)).toBeInTheDocument();
    expect(screen.getByText(SOLICITACAO.data)).toBeInTheDocument();
    expect(screen.queryByText("Cancelar")).not.toBeInTheDocument();
    expect(screen.queryByText("Marcar Conferência")).not.toBeInTheDocument();
  });

  describe("cancelamento pela escola", () => {
    it.each([
      ["administrador", USUARIO_ESCOLA],
      ["diretor", USUARIO_DIRETOR_ESCOLA],
    ])(
      "exibe o botão Cancelar para o %s da escola terceirizada",
      async (_, usuario) => {
        definirUsuario(usuario);

        await setup();
        await aguardarRelatorio();

        expect(screen.getByText("Cancelar")).toBeInTheDocument();
      },
    );

    it("não exibe o botão Cancelar quando a solicitação já foi cancelada pela escola", async () => {
      definirUsuario(USUARIO_ESCOLA);
      mock.onGet(URL_SOLICITACAO).reply(200, SOLICITACAO_CANCELADA);

      await setup();
      await aguardarRelatorio();

      expect(screen.queryByText("Cancelar")).not.toBeInTheDocument();
    });

    it("abre e fecha o modal de cancelamento", async () => {
      definirUsuario(USUARIO_ESCOLA);

      await setup();
      await aguardarRelatorio();

      fireEvent.click(screen.getByText("Cancelar"));
      expect(
        await screen.findByText("Cancelamento de Suspensão de Alimentação"),
      ).toBeInTheDocument();

      fireEvent.click(screen.getByText("Não"));
      await waitFor(() =>
        expect(
          screen.queryByText("Cancelamento de Suspensão de Alimentação"),
        ).not.toBeInTheDocument(),
      );
    });

    it("cancela a solicitação e atualiza o relatório", async () => {
      definirUsuario(USUARIO_ESCOLA);
      mock.onPatch(URL_CANCELA).reply(200, SOLICITACAO_CANCELADA);

      await setup();
      await aguardarRelatorio();

      fireEvent.click(screen.getByText("Cancelar"));
      const modal = await screen.findByRole("dialog");
      fireEvent.change(within(modal).getByRole("textbox"), {
        target: { value: "Unidade voltou a funcionar" },
      });
      await act(async () => {
        fireEvent.click(within(modal).getByText("Sim"));
      });

      expect(
        await screen.findByText(
          "A solicitação de Suspensão de Alimentação foi cancelada com sucesso!",
        ),
      ).toBeInTheDocument();
      expect(JSON.parse(mock.history.patch[0].data)).toEqual({
        justificativa: "Unidade voltou a funcionar",
      });
      await waitFor(() =>
        expect(screen.queryByText("Cancelar")).not.toBeInTheDocument(),
      );
    });
  });

  describe("marcar conferência pela terceirizada", () => {
    it("marca a solicitação como conferida e recarrega o relatório", async () => {
      definirUsuario(USUARIO_TERCEIRIZADA);
      mock.resetHandlers();
      mock
        .onGet(URL_SOLICITACAO)
        .replyOnce(200, SOLICITACAO)
        .onGet(URL_SOLICITACAO)
        .reply(200, SOLICITACAO_CONFERIDA);
      mock.onPatch(URL_MARCAR_CONFERIDA).reply(200, {});

      await setup({ visao: TERCEIRIZADA });
      await aguardarRelatorio();

      fireEvent.click(screen.getByText("Marcar Conferência"));
      expect(
        await screen.findByText("Marcar Conferência da Solicitação"),
      ).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(screen.getByText("Confirmar"));
      });

      expect(
        await screen.findByText("Solicitação conferida com sucesso!"),
      ).toBeInTheDocument();
      expect(
        await screen.findByText("Solicitação Conferida"),
      ).toBeInTheDocument();
      expect(screen.queryByText("Marcar Conferência")).not.toBeInTheDocument();
      expect(mock.history.get).toHaveLength(2);
    });

    it("mantém o botão quando a recarga da solicitação não retorna 200", async () => {
      definirUsuario(USUARIO_TERCEIRIZADA);
      mock.resetHandlers();
      mock
        .onGet(URL_SOLICITACAO)
        .replyOnce(200, SOLICITACAO)
        .onGet(URL_SOLICITACAO)
        .reply(204);
      mock.onPatch(URL_MARCAR_CONFERIDA).reply(200, {});

      await setup({ visao: TERCEIRIZADA });
      await aguardarRelatorio();

      fireEvent.click(screen.getByText("Marcar Conferência"));
      await act(async () => {
        fireEvent.click(await screen.findByText("Confirmar"));
      });

      await waitFor(() => expect(mock.history.get).toHaveLength(2));
      expect(screen.getByText("Marcar Conferência")).toBeInTheDocument();
      expect(
        screen.queryByText("Solicitação Conferida"),
      ).not.toBeInTheDocument();
    });

    it("fecha o modal de conferência ao clicar em Cancelar", async () => {
      definirUsuario(USUARIO_TERCEIRIZADA);

      await setup({ visao: TERCEIRIZADA });
      await aguardarRelatorio();

      fireEvent.click(screen.getByText("Marcar Conferência"));
      const modal = await screen.findByRole("dialog");
      fireEvent.click(within(modal).getByText("Cancelar"));

      await waitFor(() =>
        expect(
          screen.queryByText("Marcar Conferência da Solicitação"),
        ).not.toBeInTheDocument(),
      );
      expect(mock.history.patch).toHaveLength(0);
    });

    it("exibe 'Solicitação Conferida' quando a solicitação já foi conferida", async () => {
      definirUsuario(USUARIO_TERCEIRIZADA);
      mock.onGet(URL_SOLICITACAO).reply(200, SOLICITACAO_CONFERIDA);

      await setup({ visao: TERCEIRIZADA });
      await aguardarRelatorio();

      expect(screen.getByText("Solicitação Conferida")).toBeInTheDocument();
      expect(screen.queryByText("Marcar Conferência")).not.toBeInTheDocument();
    });

    it("exibe o botão para solicitações canceladas pela escola", async () => {
      definirUsuario(USUARIO_TERCEIRIZADA);
      mock.onGet(URL_SOLICITACAO).reply(200, SOLICITACAO_CANCELADA);

      await setup({ visao: TERCEIRIZADA });
      await aguardarRelatorio();

      expect(screen.getByText("Marcar Conferência")).toBeInTheDocument();
    });

    it("não exibe o botão para solicitações com outros status", async () => {
      definirUsuario(USUARIO_TERCEIRIZADA);
      mock
        .onGet(URL_SOLICITACAO)
        .reply(200, { ...SOLICITACAO, status: "RASCUNHO" });

      await setup({ visao: TERCEIRIZADA });
      await aguardarRelatorio();

      expect(screen.queryByText("Marcar Conferência")).not.toBeInTheDocument();
    });

    it("não exibe o botão para o perfil usuário da empresa", async () => {
      definirUsuario(USUARIO_EMPRESA);

      await setup({ visao: TERCEIRIZADA });
      await aguardarRelatorio();

      expect(screen.queryByText("Marcar Conferência")).not.toBeInTheDocument();
    });
  });
});
