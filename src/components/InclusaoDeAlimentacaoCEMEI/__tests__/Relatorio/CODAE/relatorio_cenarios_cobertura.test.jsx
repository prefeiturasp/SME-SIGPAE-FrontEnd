import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockInclusaoMotivoEspecificoAValidarCEMEI } from "src/mocks/InclusaoAlimentacao/CEMEI/MotivoEspecifico/InclusaoMotivoEspecificoAValidar";
import { mockInclusaoMotivoEspecificoAutorizadaCEMEI } from "src/mocks/InclusaoAlimentacao/CEMEI/MotivoEspecifico/inclusaoMotivoEspecificoAutorizada";
import { mockInclusaoMotivoEspecificoValidadaSolicitacoesSimilaresCEMEI } from "src/mocks/InclusaoAlimentacao/CEMEI/MotivoEspecifico/inclusaoMotivoEspecificoValidadaSolicitacoesSimilares";
import { mockInclusaoNormalCEMEIAValidar } from "src/mocks/InclusaoAlimentacao/CEMEI/inclusaoNormalAValidar";
import { mockInclusaoNormalCEMEICancelada } from "src/mocks/InclusaoAlimentacao/CEMEI/inclusaoNormalCancelada";
import { mockMotivosDRENaoValida } from "src/mocks/InclusaoAlimentacao/mockMotivosDRENaoValida";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockGetVinculosMotivoEspecificoCEMEI } from "src/mocks/services/cadastroTipoAlimentacao.service/CEMEI/vinculosMotivoEspecifico";
import { mockGetVinculosTipoAlimentacaoPorEscolaCEMEI } from "src/mocks/services/cadastroTipoAlimentacao.service/CEMEI/vinculosTipoAlimentacaoPeriodoEscolar";
import * as InclusaoDeAlimentacaoCEMEIRelatorios from "src/pages/InclusaoDeAlimentacaoCEMEIRelatorios";
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

const clonar = (obj) => JSON.parse(JSON.stringify(obj));

describe("Teste Relatório Inclusão de Alimentação CEMEI - Visão CODAE - Cobertura CorpoRelatorio", () => {
  process.env.IS_TEST = true;

  const escolaUuid = mockInclusaoMotivoEspecificoAValidarCEMEI.escola.uuid;

  const renderRelatorio = async (solicitacao) => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    mock
      .onGet(`/inclusao-alimentacao-cemei/${solicitacao.uuid}/`)
      .replyOnce(200, solicitacao);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCEMEI);
    mock
      .onGet(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/motivo_inclusao_especifico/",
      )
      .reply(200, mockGetVinculosMotivoEspecificoCEMEI);

    const search = `?uuid=${solicitacao.uuid}&ehInclusaoContinua=false&tipoSolicitacao=solicitacao-cemei&card=undefined`;
    window.history.pushState({}, "", search);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );

    let container;
    await act(async () => {
      ({ container } = render(
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
            <InclusaoDeAlimentacaoCEMEIRelatorios.RelatorioCODAE />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      ));
    });
    return container;
  };

  it("EMEI motivo específico sem tipos de alimentação usa vínculos do motivo específico", async () => {
    const solicitacao = clonar(mockInclusaoMotivoEspecificoAValidarCEMEI);
    solicitacao.uuid = "cobertura-especifico-sem-tipos";
    solicitacao.quantidade_alunos_emei_da_inclusao_cemei[0].tipos_alimentacao =
      [];
    solicitacao.solicitacoes_similares = [];

    await renderRelatorio(solicitacao);

    expect(screen.getByText("Alunos EMEI")).toBeInTheDocument();
    expect(screen.getByText(/Lanche 4h, Lanche, Refeição/)).toBeInTheDocument();
  });

  it("EMEI motivo normal sem tipos de alimentação usa vínculos da escola", async () => {
    const solicitacao = clonar(mockInclusaoNormalCEMEIAValidar);
    solicitacao.uuid = "cobertura-normal-sem-tipos";
    solicitacao.quantidade_alunos_emei_da_inclusao_cemei[0].tipos_alimentacao =
      [];
    solicitacao.solicitacoes_similares = [];

    await renderRelatorio(solicitacao);

    expect(
      screen.getByText(/Lanche 4h, Lanche, Refeição, Sobremesa/),
    ).toBeInTheDocument();
  });

  it("dia cancelado sem justificativa usa justificativa do último log quando escola cancelou", async () => {
    const solicitacao = clonar(mockInclusaoNormalCEMEICancelada);
    solicitacao.uuid = "cobertura-dia-cancelado-sem-justificativa";
    solicitacao.dias_motivos_da_inclusao_cemei[0].cancelado_justificativa = "";
    solicitacao.logs[solicitacao.logs.length - 1].justificativa =
      "Cancelamento comunicado pela escola.";
    solicitacao.solicitacoes_similares = [];

    await renderRelatorio(solicitacao);

    expect(
      screen.getAllByText(/Cancelamento comunicado pela escola/).length,
    ).toBeGreaterThan(0);
  });

  it("motivo Outro com cancelamento sem justificativa exibe descrição e outro_motivo", async () => {
    const solicitacao = clonar(mockInclusaoMotivoEspecificoAValidarCEMEI);
    solicitacao.uuid = "cobertura-outro-motivo";
    solicitacao.status = "ESCOLA_CANCELOU";
    solicitacao.dias_motivos_da_inclusao_cemei = [
      {
        motivo: { nome: "Outro", uuid: "outro-uuid" },
        data: "30/07/2025",
        uuid: "outro-1",
        cancelado: true,
        cancelado_justificativa: "",
        cancelado_em: null,
        outro_motivo: "Passeio ao parque municipal",
        descricao_evento: "",
        cancelado_por: null,
        inclusao_alimentacao_cemei: 137,
      },
      {
        motivo: { nome: "Evento Específico", uuid: "evento-uuid" },
        data: "31/07/2025",
        uuid: "evento-1",
        cancelado: false,
        cancelado_justificativa: "",
        cancelado_em: null,
        outro_motivo: "",
        descricao_evento: "Festa junina escolar",
        cancelado_por: null,
        inclusao_alimentacao_cemei: 137,
      },
    ];
    solicitacao.quantidade_alunos_cei_da_inclusao_cemei = [];
    solicitacao.quantidade_alunos_emei_da_inclusao_cemei = [];
    solicitacao.solicitacoes_similares = [];
    solicitacao.logs = [
      {
        status_evento_explicacao: "Solicitação Realizada",
        usuario: mockInclusaoMotivoEspecificoAValidarCEMEI.logs[0].usuario,
        criado_em: "11/07/2025 18:39:28",
        descricao: "Inclusão de Alimentação CEMEI cód: 5A120",
        justificativa: "",
        resposta_sim_nao: false,
      },
      {
        status_evento_explicacao: "Escola cancelou",
        usuario: mockInclusaoMotivoEspecificoAValidarCEMEI.logs[0].usuario,
        criado_em: "11/07/2025 18:40:00",
        descricao: "Inclusão de Alimentação CEMEI cód: 5A120",
        justificativa: "Cancelado pela coordenação.",
        resposta_sim_nao: false,
      },
    ];

    await renderRelatorio(solicitacao);

    expect(screen.getByText("Descrição do motivo:")).toBeInTheDocument();
    expect(screen.getByText("Passeio ao parque municipal")).toBeInTheDocument();
    expect(screen.getByText("Descrição do evento:")).toBeInTheDocument();
    expect(screen.getByText("Festa junina escolar")).toBeInTheDocument();
    expect(
      screen.getAllByText(/Cancelado pela coordenação/).length,
    ).toBeGreaterThan(0);
  });

  it("CODAE autorizou sem observações exibe mensagem padrão", async () => {
    const solicitacao = clonar(mockInclusaoMotivoEspecificoAutorizadaCEMEI);
    solicitacao.uuid = "cobertura-codae-autorizado-sem-observacoes";
    solicitacao.logs = solicitacao.logs.map((log) =>
      log.status_evento_explicacao === "CODAE autorizou"
        ? { ...log, justificativa: "" }
        : log,
    );
    solicitacao.solicitacoes_similares = [];

    await renderRelatorio(solicitacao);

    expect(
      screen.getByText("Sem observações por parte da CODAE"),
    ).toBeInTheDocument();
  });

  it("solicitações similares com e sem dias_motivos_da_inclusao_cemei geram links distintos e expande", async () => {
    const solicitacao = clonar(
      mockInclusaoMotivoEspecificoValidadaSolicitacoesSimilaresCEMEI,
    );
    solicitacao.uuid = "cobertura-similares-links";

    const similarCEMEI = solicitacao.solicitacoes_similares[0];
    const similarCEI = clonar(similarCEMEI);
    similarCEI.id_externo = "F999F";
    similarCEI.uuid = "f999f-cei-uuid";
    delete similarCEI.dias_motivos_da_inclusao_cemei;
    similarCEI.escola = {
      ...similarCEI.escola,
      nome: "CEI TREMEMBE",
      uuid: "cei-tremembe-uuid",
    };
    similarCEI.motivo = { nome: "Reposição de aula", uuid: "reposicao-uuid" };
    similarCEI.quantidade_alunos_por_faixas_etarias = [];

    solicitacao.solicitacoes_similares = [similarCEMEI, similarCEI];

    const container = await renderRelatorio(solicitacao);

    const linkCEMEI = screen.getByRole("link", { name: "#E335E" });
    expect(linkCEMEI.getAttribute("href")).toMatch(
      /^\/inclusao-de-alimentacao-cemei\//,
    );

    const linkCEI = screen.getByRole("link", { name: "#F999F" });
    expect(linkCEI.getAttribute("href")).toMatch(
      /^\/inclusao-de-alimentacao\/relatorio\?/,
    );

    const spanToggle = screen.getByTestId("toggle-expandir-0");
    fireEvent.click(spanToggle);
    const icon = spanToggle.querySelector("i");
    expect(icon).toHaveClass("fa-chevron-up");
    expect(
      container.querySelectorAll("[data-testid^='toggle-expandir-']"),
    ).toHaveLength(2);
  });
});
