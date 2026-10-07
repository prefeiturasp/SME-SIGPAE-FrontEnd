import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockDiasCalendarioSetembro2025CMCT } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CMCT/Setembro2025/diasCalendario";
import { mockMeusDadosCogestor } from "src/mocks/meusDados/cogestor";
import { mockGetVinculosTipoAlimentacaoPorEscolaCMCT } from "src/mocks/services/cadastroTipoAlimentacao.service/CMCT/mockGetVinculosTipoAlimentacaoPorEscolaCMCT";
import { mockSolicitacaoMedicaoInicialCMCTSetembro2025 } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/CMCT/Setembro2025/solicitacaoMedicaoInicial";
import { ConferenciaDosLancamentosPage } from "src/pages/LancamentoMedicaoInicial/ConferenciaDosLancamentosPage";
import mock from "src/services/_mock";

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: () => (
    <textarea
      data-testid="ckeditor-mock"
      name="justificativa"
      required={false}
    />
  ),
}));

const GRUPO_EXTRAORDINARIO = "Solicitações de Alimentação Extraordinárias";

const medicaoAprovada = (nome, uuid) => ({
  uuid_medicao_periodo_grupo: uuid,
  nome_periodo_grupo: nome,
  periodo_escolar: nome === "MANHA" ? "MANHA" : null,
  grupo: nome === "MANHA" ? null : nome,
  status: "MEDICAO_APROVADA_PELA_CODAE",
  logs: [],
});

const periodosSemExtraordinaria = {
  results: [
    medicaoAprovada("MANHA", "m1"),
    medicaoAprovada("Solicitações de Alimentação", "s1"),
  ],
};

const periodosComExtraordinariaAprovada = {
  results: [
    medicaoAprovada("MANHA", "m1"),
    medicaoAprovada("Solicitações de Alimentação", "s1"),
    medicaoAprovada(GRUPO_EXTRAORDINARIO, "e1"),
  ],
};

const periodosComExtraordinariaCorrecao = {
  results: [
    medicaoAprovada("MANHA", "m1"),
    medicaoAprovada("Solicitações de Alimentação", "s1"),
    {
      uuid_medicao_periodo_grupo: "e1",
      nome_periodo_grupo: GRUPO_EXTRAORDINARIO,
      periodo_escolar: null,
      grupo: GRUPO_EXTRAORDINARIO,
      status: "MEDICAO_CORRECAO_SOLICITADA_CODAE",
      logs: [
        {
          status_evento_explicacao: "Correção solicitada pela CODAE",
          criado_em: "01/10/2025 10:00:00",
          justificativa: "<p>corrige os dias 2, 3 e 4</p>",
          usuario: {},
        },
      ],
    },
  ],
};

const setup = async ({ solicitacao, periodos }) => {
  process.env.IS_TEST = true;

  mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
  mock
    .onGet(
      "/medicao-inicial/solicitacao-medicao-inicial/periodos-grupos-medicao/",
    )
    .reply(200, periodos);
  mock
    .onGet(`/medicao-inicial/solicitacao-medicao-inicial/${solicitacao.uuid}/`)
    .reply(200, solicitacao);
  mock
    .onGet("/medicao-inicial/medicao/feriados-no-mes-com-nome/")
    .reply(200, { results: [] });
  mock
    .onGet("/dias-calendario/")
    .reply(200, mockDiasCalendarioSetembro2025CMCT);
  mock.onGet("/dias-letivos/calendario/").reply(200, []);
  mock.onGet("dias-suspensao-atividades/lista-dias/").reply(200, []);
  mock.onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/").reply(200, []);
  mock
    .onGet(
      `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${solicitacao.escola_uuid}/`,
    )
    .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCMCT);
  mock
    .onGet(
      "/vinculos-tipo-alimentacao-u-e-periodo-escolar/vinculos-inclusoes-evento-especifico-autorizadas/",
    )
    .reply(200, []);
  mock
    .onGet("/medicao-inicial/categorias-medicao/")
    .reply(200, mockCategoriasMedicao);

  Object.defineProperty(global, "localStorage", { value: localStorageMock });
  localStorage.setItem("tipo_perfil", TIPO_PERFIL.MEDICAO);
  localStorage.setItem("perfil", PERFIL.ADMINITRADOR_MEDICAO);

  window.history.pushState({}, "", `?uuid=${solicitacao.uuid}`);

  await act(async () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/",
            state: {
              ano: "2025",
              mes: "09",
              escolaUuid: solicitacao.escola_uuid,
            },
          },
        ]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ToastContainer />
        <ConferenciaDosLancamentosPage />
      </MemoryRouter>,
    );
  });
};

const solicitacaoAprovadaDRE = {
  ...mockSolicitacaoMedicaoInicialCMCTSetembro2025,
  status: "MEDICAO_APROVADA_PELA_DRE",
  lanche_emergencial_extraordinario: true,
};

const expandirBlocoExtraordinario = async () => {
  fireEvent.click(
    screen.getByTestId(`visualizar-lancamento-${GRUPO_EXTRAORDINARIO}`),
  );
  const titulo = await screen.findByText("Solicitação de Correção pela CODAE");
  return titulo.closest(".row");
};

describe("Conferência de Lançamentos - bloco extraordinário: botões e aprovação", () => {
  it("sem medição: mostra 'Solicitar Correção' e NÃO mostra 'Aprovar Período'", async () => {
    await setup({
      solicitacao: solicitacaoAprovadaDRE,
      periodos: periodosSemExtraordinaria,
    });

    const bloco = await expandirBlocoExtraordinario();

    await waitFor(() => {
      expect(within(bloco).getByText("Solicitar Correção")).toBeInTheDocument();
    });
    expect(
      within(bloco).queryByText("Aprovar Período"),
    ).not.toBeInTheDocument();
  });

  it("modo correção: mostra 'Salvar Solicitação de Correção para UE' e NÃO 'Aprovar Período'", async () => {
    await setup({
      solicitacao: solicitacaoAprovadaDRE,
      periodos: periodosSemExtraordinaria,
    });

    const bloco = await expandirBlocoExtraordinario();
    await waitFor(() => within(bloco).getByText("Solicitar Correção"));
    fireEvent.click(
      within(bloco).getByText("Solicitar Correção").closest("button"),
    );

    await waitFor(() => {
      expect(
        within(bloco).getByText("Salvar Solicitação de Correção para UE"),
      ).toBeInTheDocument();
    });
    expect(
      within(bloco).queryByText("Aprovar Período"),
    ).not.toBeInTheDocument();
    expect(within(bloco).getByText("Cancelar")).toBeInTheDocument();
  });

  it("'Aprovar Medição' fica bloqueado quando o bloco extraordinário não existe/não está aprovado", async () => {
    await setup({
      solicitacao: solicitacaoAprovadaDRE,
      periodos: periodosSemExtraordinaria,
    });

    const botaoAprovar = screen.getByText("Aprovar Medição").closest("button");
    expect(botaoAprovar).toBeDisabled();
  });

  it("'Aprovar Medição' fica habilitado quando o bloco extraordinário está aprovado", async () => {
    await setup({
      solicitacao: solicitacaoAprovadaDRE,
      periodos: periodosComExtraordinariaAprovada,
    });

    const botaoAprovar = screen.getByText("Aprovar Medição").closest("button");
    expect(botaoAprovar).not.toBeDisabled();
  });

  it("'Salvar Solicitação de Correção para UE' envia o PATCH do bloco extraordinário", async () => {
    await setup({
      solicitacao: solicitacaoAprovadaDRE,
      periodos: periodosSemExtraordinaria,
    });

    let chamouEndpoint = false;
    mock
      .onPatch(/codae-solicita-correcao-lanche-emergencial-extraordinario/)
      .reply(() => {
        chamouEndpoint = true;
        return [200, {}];
      });

    const bloco = await expandirBlocoExtraordinario();
    await waitFor(() => within(bloco).getByText("Solicitar Correção"));
    fireEvent.click(
      within(bloco).getByText("Solicitar Correção").closest("button"),
    );

    await waitFor(() =>
      within(bloco).getByText("Salvar Solicitação de Correção para UE"),
    );
    fireEvent.click(
      within(bloco)
        .getByText("Salvar Solicitação de Correção para UE")
        .closest("button"),
    );

    const botaoSim = await screen.findByText("Sim");
    fireEvent.click(botaoSim.closest("button"));

    await waitFor(() => expect(chamouEndpoint).toBe(true));
  });

  it("não renderiza o bloco extraordinário quando a flag é false", async () => {
    await setup({
      solicitacao: {
        ...solicitacaoAprovadaDRE,
        lanche_emergencial_extraordinario: false,
      },
      periodos: periodosSemExtraordinaria,
    });

    expect(
      screen.queryByText("Solicitação de Correção pela CODAE"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(GRUPO_EXTRAORDINARIO)).not.toBeInTheDocument();
  });

  it("renderiza o bloco vindo do backend (dados da medição) em vez do sintético", async () => {
    await setup({
      solicitacao: solicitacaoAprovadaDRE,
      periodos: periodosComExtraordinariaCorrecao,
    });

    expect(screen.getByText(GRUPO_EXTRAORDINARIO)).toBeInTheDocument();
    expect(
      screen.getByText("Devolvido para ajustes pela CODAE"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Solicitação de Correção"),
    ).not.toBeInTheDocument();
  });
});
