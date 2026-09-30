import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockInclusaoAlimentacaoCEIAValidar } from "src/mocks/InclusaoAlimentacao/CEI/inclusaoAlimentacaoAValidar";
import { mockInclusaoAlimentacaoRegular } from "src/mocks/InclusaoAlimentacao/mockInclusaoAlimentacaoRegular";
import { mockInclusaoAlimentacaoValidada } from "src/mocks/InclusaoAlimentacao/mockInclusaoAlimentacaoValidada";
import { mockInclusaoContinuaPrazoLimite } from "src/mocks/InclusaoAlimentacao/mockInclusaoContinuaPrazoLimite";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaCEIcomMANHAeTARDE } from "src/mocks/meusDados/escola/CEIcomMANHAeTARDE";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockVinculosTipoAlimentacaoPeriodoEscolarCEIComManhaTarde } from "src/mocks/services/cadastroTipoAlimentacao.service/CEI/vinculosTipoAlimentacaoPeriodoEscolarComManhaTarde";
import { mockMotivosDRENaoValida } from "src/mocks/services/relatorios.service/mockMotivosDRENaoValida";
import * as RelatoriosInclusaoDeAlimentacao from "src/pages/InclusaoDeAlimentacao/RelatorioPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { getDiasUteis } from "src/services/diasUteis.service";
import mock from "src/services/_mock";
import { saveAs } from "file-saver";

jest.mock("file-saver", () => ({
  saveAs: jest.fn(),
}));

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

const UUID_NORMAL = "d0f4faf0-519b-4a1a-a1bf-ae39c45d1f64";
const UUID_CONTINUA = "a64f5054-873c-46bc-aefa-43966029a1a4";
const UUID_CEI = mockInclusaoAlimentacaoCEIAValidar.uuid;

const usuarioEscola = {
  uuid: "36750ded-5790-433e-b765-0507303828df",
  cpf: null,
  nome: "SUPER USUARIO ESCOLA EMEF",
  email: "escolaemef@admin.com",
  date_joined: "10/07/2020 13:15:23",
  registro_funcional: "8115257",
  tipo_usuario: "escola",
  cargo: "ANALISTA DE SAUDE NIVEL II",
  crn_numero: null,
  nome_fantasia: null,
};

const escolaUuid =
  mockMeusDadosEscolaCEIcomMANHAeTARDE.vinculo_atual.instituicao.uuid;

const mockInclusaoOutroEvento = {
  ...mockInclusaoAlimentacaoRegular,
  inclusoes: [
    {
      motivo: { nome: "Outro", uuid: "uuid-outro" },
      data: "03/04/2025",
      uuid: "uuid-inclusao-outro",
      terceirizada_conferiu_gestao: false,
      cancelado: false,
      cancelado_justificativa: "",
      cancelado_em: null,
      outro_motivo: "Motivo customizado pela escola",
      evento: "",
      cancelado_por: null,
      grupo_inclusao: 630,
    },
    {
      motivo: { nome: "Evento Específico", uuid: "uuid-evento" },
      data: "04/04/2025",
      uuid: "uuid-inclusao-evento",
      terceirizada_conferiu_gestao: false,
      cancelado: false,
      cancelado_justificativa: "",
      cancelado_em: null,
      outro_motivo: "",
      evento: "Feira de ciências da escola",
      cancelado_por: null,
      grupo_inclusao: 630,
    },
  ],
};

const mockInclusaoOutroEventoCancelada = {
  ...mockInclusaoOutroEvento,
  status: "ESCOLA_CANCELOU",
  inclusoes: [
    {
      ...mockInclusaoAlimentacaoRegular.inclusoes[0],
      cancelado: true,
      cancelado_justificativa: "",
    },
    {
      ...mockInclusaoOutroEvento.inclusoes[0],
      cancelado: true,
      cancelado_justificativa: "justificativa do outro",
    },
    mockInclusaoOutroEvento.inclusoes[1],
  ],
  logs: [
    {
      status_evento_explicacao: "Solicitação Realizada",
      usuario: usuarioEscola,
      criado_em: "26/02/2025 19:41:45",
      descricao: "",
      justificativa: "",
      resposta_sim_nao: false,
    },
    {
      status_evento_explicacao: "Escola cancelou",
      usuario: usuarioEscola,
      criado_em: "27/02/2025 09:46:14",
      descricao: "",
      justificativa: "justificativa da escola",
      resposta_sim_nao: false,
    },
  ],
};

const mockInclusaoContinuaTodasEncerradas = {
  ...mockInclusaoContinuaPrazoLimite,
  data_final: "12/03/2035",
  quantidades_periodo: [
    {
      ...mockInclusaoContinuaPrazoLimite.quantidades_periodo[0],
      encerrado_a_partir_de: "12/03/2035",
      cancelado_justificativa: "",
    },
    {
      ...mockInclusaoContinuaPrazoLimite.quantidades_periodo[0],
      uuid: "2c2c2c2c-0000-0000-0000-000000000002",
      periodo_escolar: {
        ...mockInclusaoContinuaPrazoLimite.quantidades_periodo[0]
          .periodo_escolar,
        nome: "TARDE",
        uuid: "20bd9ca9-d499-456a-bd86-fb8f297947d6",
      },
      encerrado_a_partir_de: "12/03/2035",
      cancelado_justificativa: "",
    },
  ],
};

const mockInclusaoContinuaSemObservacao = {
  ...mockInclusaoContinuaPrazoLimite,
  data_final: "12/03/2035",
  quantidades_periodo: [
    {
      ...mockInclusaoContinuaPrazoLimite.quantidades_periodo[0],
      observacao: "",
    },
  ],
};

const mockInclusaoContinuaEscolaCancelou = {
  ...mockInclusaoContinuaPrazoLimite,
  data_final: "12/03/2035",
  status: "ESCOLA_CANCELOU",
  logs: [
    ...mockInclusaoContinuaPrazoLimite.logs,
    {
      status_evento_explicacao: "Escola cancelou",
      usuario: usuarioEscola,
      criado_em: "27/02/2025 16:15:09",
      descricao: "",
      justificativa: "xablau",
      resposta_sim_nao: false,
    },
  ],
  quantidades_periodo: [
    {
      ...mockInclusaoContinuaPrazoLimite.quantidades_periodo[0],
      cancelado: true,
      cancelado_justificativa: "",
    },
  ],
};

const mockInclusaoContinuaAutorizadaSemObservacao = {
  ...mockInclusaoContinuaPrazoLimite,
  data_final: "12/03/2035",
  status: "CODAE_AUTORIZADO",
  logs: [
    ...mockInclusaoContinuaPrazoLimite.logs,
    {
      status_evento_explicacao: "CODAE autorizou",
      criado_em: "01/04/2025 10:00:00",
      descricao: "",
      justificativa: "",
      resposta_sim_nao: true,
    },
  ],
};

const mockInclusaoCEITabela = {
  ...mockInclusaoAlimentacaoCEIAValidar,
  periodo_escolar: {
    nome: "INTEGRAL",
    uuid: "e17e2405-36be-4981-a09c-35c89ae0f8b7",
  },
  tipos_alimentacao: [{ nome: "Lanche" }, { nome: "Almoço" }],
  quantidade_alunos_por_faixas_etarias: [
    {
      ...mockInclusaoAlimentacaoCEIAValidar
        .quantidade_alunos_por_faixas_etarias[0],
      quantidade: 5,
    },
    mockInclusaoAlimentacaoCEIAValidar.quantidade_alunos_por_faixas_etarias[1],
  ],
};

const mockInclusaoComSimilares = {
  ...mockInclusaoAlimentacaoValidada,
  solicitacoes_similares: [
    {
      id_externo: "SIM01",
      uuid: "uuid-sim-01",
      escola: {
        uuid: "3c32be8e-f191-468d-a4e2-3dd8751e5e7a",
        nome: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
        codigo_eol: "017981",
        diretoria_regional: { nome: "IPIRANGA" },
        lote: { nome: "3567-3" },
      },
      motivo: { nome: "Reposição de aula" },
      logs: [
        {
          status_evento_explicacao: "DRE validou",
          criado_em: "27/02/2025 11:01:05",
          justificativa: "",
        },
      ],
      quantidades_periodo: [
        {
          periodo_escolar: { nome: "MANHA" },
          tipos_alimentacao: [{ nome: "Lanche" }],
          numero_alunos: 50,
          observacao: "<p>obs</p>",
          inclusao_alimentacao_continua: null,
          dias_semana: [],
          cancelado: false,
          cancelado_justificativa: "",
        },
      ],
      inclusoes: [
        {
          data: "03/04/2025",
          motivo: { nome: "Reposição de aula" },
          cancelado: false,
          cancelado_justificativa: "",
        },
      ],
    },
    {
      id_externo: "SIM02",
      uuid: "uuid-sim-02",
      escola: {
        uuid: "3c32be8e-f191-468d-a4e2-3dd8751e5e7a",
        nome: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
        codigo_eol: "017981",
        diretoria_regional: { nome: "IPIRANGA" },
        lote: { nome: "3567-3" },
      },
      dias_motivos_da_inclusao_cemei: [],
      motivo: { nome: "Reposição de aula" },
      logs: [
        {
          status_evento_explicacao: "DRE validou",
          criado_em: "28/02/2025 10:00:00",
          justificativa: "",
        },
      ],
      quantidades_periodo: [
        {
          periodo_escolar: { nome: "MANHA" },
          tipos_alimentacao: [{ nome: "Lanche" }],
          numero_alunos: 40,
          observacao: "<p>obs</p>",
          inclusao_alimentacao_continua: null,
          dias_semana: [],
          cancelado: false,
          cancelado_justificativa: "",
        },
      ],
      inclusoes: [
        {
          data: "04/04/2025",
          motivo: { nome: "Reposição de aula" },
          cancelado: false,
          cancelado_justificativa: "",
        },
      ],
    },
  ],
};

const configLocalStorageEscola = () => {
  Object.defineProperty(global, "localStorage", { value: localStorageMock });
  localStorage.setItem(
    "nome_instituicao",
    `"EMEF PERICLES EUGENIO DA SILVA RAMOS"`,
  );
  localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
  localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
  localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
};

const configLocalStorageEscolaContinua = () => {
  Object.defineProperty(global, "localStorage", { value: localStorageMock });
  localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
  localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
  localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
  localStorage.setItem("meusDados", "true");
};

const configLocalStorageCODAE = () => {
  Object.defineProperty(global, "localStorage", { value: localStorageMock });
  localStorage.setItem(
    "tipo_perfil",
    TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
  );
  localStorage.setItem(
    "perfil",
    PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
  );
};

const configLocalStorageCEI = () => {
  Object.defineProperty(global, "localStorage", { value: localStorageMock });
  localStorage.setItem("nome_instituicao", `"CEI DIRET NEIDE KETELHUT"`);
  localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
  localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
  localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
  localStorage.setItem("eh_cei", "true");
};

const renderRelatorioEscolaNormal = async (solicitacao) => {
  mock
    .onGet("/usuarios/meus-dados/")
    .reply(200, mockMeusDadosEscolaEMEFPericles);
  mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
  mock
    .onGet(`/grupos-inclusao-alimentacao-normal/${UUID_NORMAL}/`)
    .replyOnce(200, solicitacao);
  configLocalStorageEscola();
  window.history.pushState(
    {},
    "",
    `?uuid=${UUID_NORMAL}&ehInclusaoContinua=false&tipoSolicitacao=solicitacao-normal`,
  );
  await act(async () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <RelatoriosInclusaoDeAlimentacao.RelatorioEscola />
      </MemoryRouter>,
    );
  });
};

const renderRelatorioEscolaContinua = async (solicitacao) => {
  mock
    .onGet("/usuarios/meus-dados/")
    .reply(200, mockMeusDadosEscolaEMEFPericles);
  mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
  mock
    .onGet("/dias-uteis/")
    .reply(200, { proximos_dois_dias_uteis: "2026-05-13" });
  mock
    .onGet(`/inclusoes-alimentacao-continua/${UUID_CONTINUA}/`)
    .replyOnce(200, solicitacao);
  configLocalStorageEscolaContinua();
  getDiasUteis.mockClear();
  window.history.pushState(
    {},
    "",
    `?uuid=${UUID_CONTINUA}&ehInclusaoContinua=true&tipoSolicitacao=solicitacao-continua`,
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
        </MemoryRouter>
      </MeusDadosContext.Provider>,
    );
  });
  await act(async () => {});
};

const renderRelatorioCODAE = async (solicitacao) => {
  mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
  mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
  mock
    .onGet(`/grupos-inclusao-alimentacao-normal/${UUID_NORMAL}/`)
    .replyOnce(200, solicitacao);
  configLocalStorageCODAE();
  window.history.pushState(
    {},
    "",
    `?uuid=${UUID_NORMAL}&ehInclusaoContinua=false&tipoSolicitacao=solicitacao-normal`,
  );
  await act(async () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <RelatoriosInclusaoDeAlimentacao.RelatorioCODAE />
      </MemoryRouter>,
    );
  });
};

const renderRelatorioEscolaCEI = async (solicitacao) => {
  mock
    .onGet("/usuarios/meus-dados/")
    .reply(200, mockMeusDadosEscolaCEIcomMANHAeTARDE);
  mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
  mock
    .onGet(`/inclusoes-alimentacao-da-cei/${UUID_CEI}/`)
    .replyOnce(200, solicitacao);
  mock
    .onGet(
      `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
    )
    .reply(200, mockVinculosTipoAlimentacaoPeriodoEscolarCEIComManhaTarde);
  configLocalStorageCEI();
  window.history.pushState(
    {},
    "",
    `?uuid=${UUID_CEI}&ehInclusaoContinua=false&tipoSolicitacao=solicitacao-cei&card=undefined`,
  );
  await act(async () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <RelatoriosInclusaoDeAlimentacao.RelatorioEscola />
      </MemoryRouter>,
    );
  });
};

describe("CorpoRelatorio - Motivo Outro e Evento Específico", () => {
  it("renderiza motivo Outro e Evento Específico com suas descrições", async () => {
    await renderRelatorioEscolaNormal(mockInclusaoOutroEvento);

    expect(screen.getByText("Outro")).toBeInTheDocument();
    expect(screen.getByText("Evento Específico")).toBeInTheDocument();
    expect(screen.getByText("Qual o motivo?")).toBeInTheDocument();
    expect(screen.getByText("Descrição do Evento")).toBeInTheDocument();
    expect(
      screen.getByText("Motivo customizado pela escola"),
    ).toBeInTheDocument();
    expect(screen.getByText("Feira de ciências da escola")).toBeInTheDocument();
  });

  it("renderiza justificativas quando status é ESCOLA_CANCELOU", async () => {
    await renderRelatorioEscolaNormal(mockInclusaoOutroEventoCancelada);

    expect(screen.getByText("Qual o motivo?")).toBeInTheDocument();
    expect(screen.getByText("Descrição do Evento")).toBeInTheDocument();
    expect(screen.getByText("justificativa do outro")).toBeInTheDocument();
    expect(
      screen.getAllByText("justificativa da escola").length,
    ).toBeGreaterThan(0);
    expect(screen.getByText("Feira de ciências da escola")).toBeInTheDocument();
  });
});

describe("CorpoRelatorio - Inclusão contínua totalmente encerrada na mesma data", () => {
  it("renderiza data final riscada e a data de encerramento", async () => {
    await renderRelatorioEscolaContinua(mockInclusaoContinuaTodasEncerradas);

    expect(screen.getByText("Solicitação no prazo limite")).toBeInTheDocument();
    const riscado = document.querySelector("s");
    expect(riscado).toBeInTheDocument();
    expect(riscado.textContent).toBe("12/03/2035");
    expect(screen.getAllByText("12/03/2035").length).toBeGreaterThanOrEqual(2);
    expect(
      screen.queryByText(/Encerramento previsto para:/),
    ).not.toBeInTheDocument();
  });
});

describe("CorpoRelatorio - Solicitações similares", () => {
  it("renderiza solicitações similares e expande ao clicar no ToggleExpandir", async () => {
    await renderRelatorioCODAE(mockInclusaoComSimilares);

    expect(screen.getAllByText("Solicitação Similar:").length).toBe(2);
    expect(screen.getAllByText("#SIM01").length).toBeGreaterThan(0);
    expect(screen.getAllByText("#SIM02").length).toBeGreaterThan(0);

    const linkCemei = screen.getAllByText("#SIM02")[0].closest("a");
    expect(linkCemei.getAttribute("href")).toContain(
      "inclusao-de-alimentacao-cemei",
    );

    const toggle = document.querySelector('[data-cy="botao-expandir"]');
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
  });
});

describe("CorpoRelatorio - Baixar PDF", () => {
  it("chama getRelatorioInclusaoAlimentacao ao clicar no botão de impressão", async () => {
    saveAs.mockClear();
    mock
      .onGet(`/grupos-inclusao-alimentacao-normal/${UUID_NORMAL}/relatorio/`)
      .reply(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve([200, new Blob(["pdf"])]), 100),
          ),
      );

    await renderRelatorioEscolaNormal(mockInclusaoAlimentacaoRegular);

    const botaoImprimir = document
      .querySelector("button .fa-print")
      .closest("button");
    fireEvent.click(botaoImprimir);

    expect(screen.getByAltText("ajax-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(saveAs).toHaveBeenCalled();
    });
  });
});

describe("CorpoRelatorio - CEI com período escolar preenchido", () => {
  it("renderiza tabela CEI e TabelaFaixaEtaria", async () => {
    await renderRelatorioEscolaCEI(mockInclusaoCEITabela);

    expect(screen.getAllByText("INTEGRAL").length).toBeGreaterThan(0);
    expect(screen.getByText("Lanche, Almoço")).toBeInTheDocument();
    expect(screen.getAllByText("92").length).toBeGreaterThan(0);
    expect(screen.getByText("07 a 11 meses")).toBeInTheDocument();
    expect(screen.getByText("04 anos a 06 anos")).toBeInTheDocument();
    expect(screen.getByText("Faixa Etária")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
  });
});

describe("CorpoRelatorio - Observações sem valor", () => {
  it("renderiza 'sem observações por parte da escola'", async () => {
    await renderRelatorioEscolaContinua(mockInclusaoContinuaSemObservacao);

    expect(
      screen.getByText("sem observações por parte da escola"),
    ).toBeInTheDocument();
  });
});

describe("CorpoRelatorio - ESCOLA_CANCELOU contínua", () => {
  it("usa justificativa do log 'Escola cancelou' quando cancelado_justificativa é vazio", async () => {
    await renderRelatorioEscolaContinua(mockInclusaoContinuaEscolaCancelou);

    expect(screen.getAllByText("xablau").length).toBeGreaterThan(0);
    expect(screen.getByText("Escola cancelou")).toBeInTheDocument();
  });
});

describe("CorpoRelatorio - CODAE autorizou sem observações", () => {
  it("renderiza 'Sem observações por parte da CODAE'", async () => {
    await renderRelatorioEscolaContinua(
      mockInclusaoContinuaAutorizadaSemObservacao,
    );

    expect(screen.getByText("Autorizou")).toBeInTheDocument();
    expect(
      screen.getByText("Sem observações por parte da CODAE"),
    ).toBeInTheDocument();
  });
});
