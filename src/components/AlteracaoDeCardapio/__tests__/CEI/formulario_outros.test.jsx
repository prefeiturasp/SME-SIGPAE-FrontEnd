import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCEI } from "src/mocks/meusDados/escola/CEI";
import { mockAlteracaoCardapioCEI } from "src/mocks/services/alteracaoCardapio.service/CEI/alteracaoCardapio";
import { mockMotivosAlteracaoCardapioCEI } from "src/mocks/services/alteracaoCardapio.service/CEI/motivosAlteracaoCardapio";
import { mockRascunhosAlteracaoCEI } from "src/mocks/services/alteracaoCardapio.service/CEI/rascunhos";
import { mockVinculosTipoAlimentacaoPeriodoEscolarCEI } from "src/mocks/services/cadastroTipoAlimentacao.service/CEI/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockFeriadosAno2025 } from "src/mocks/services/diasUteis.service/feriadosAno2025";
import { AlteracaoDeCardapioCEIPage } from "src/pages/Escola/AlteracaoDeCardapioCEIPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

const mockRascunhoLPR = {
  escola: mockRascunhosAlteracaoCEI.results[0].escola,
  motivo: {
    nome: "LPR - Lanche por Refeição",
    ativo: true,
    uuid: "a9afd14c-4142-4391-8932-5e36d59b819c",
  },
  foi_solicitado_fora_do_prazo: false,
  eh_alteracao_com_lanche_repetida: false,
  id_externo: "9C6DC",
  logs: [],
  prioridade: "REGULAR",
  substituicoes: [
    {
      periodo_escolar: {
        nome: "INTEGRAL",
        uuid: "e17e2405-36be-4981-a09c-35c89ae0f8b7",
      },
      alteracao_cardapio: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      tipos_alimentacao_de: [
        {
          nome: "Lanche",
          uuid: "5d1304c8-77a8-4c96-badb-dd2e8c1b76d5",
          posicao: 2,
        },
      ],
      tipo_alimentacao_para: {
        nome: "Refeição da tarde",
        uuid: "5bd9ad5c-e0ab-4812-b2b6-336fc89886b1",
        posicao: null,
      },
      faixas_etarias: [
        {
          faixa_etaria: {
            __str__: "01 ano a 03 anos e 11 meses",
            uuid: "e3030bd1-2e85-4676-87b3-96b4032370d4",
            inicio: 12,
            fim: 48,
          },
          uuid: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
          quantidade: 50,
          matriculados_quando_criado: 50,
          substituicao_alimentacao: 152,
          total_alunos_no_periodo: 50,
        },
      ],
      uuid: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    },
  ],
  rastro_terceirizada: null,
  criado_em: "12/04/2025 09:00:00",
  data: "23/04/2025",
  uuid: "dddddddd-dddd-dddd-dddd-dddddddddddd",
  observacao: "<p>teste</p>",
  terceirizada_conferiu_gestao: false,
  status: "RASCUNHO",
  criado_por: 8,
  rastro_escola: null,
  rastro_dre: null,
  rastro_lote: null,
};

const mockRascunhosRPLeLPR = {
  count: 2,
  next: null,
  previous: null,
  results: [mockRascunhosAlteracaoCEI.results[0], mockRascunhoLPR],
};

const mockResponseFaixasEtarias = {
  count: 1,
  results: [
    {
      faixa_etaria: {
        __str__: "01 ano a 03 anos e 11 meses",
        uuid: "e3030bd1-2e85-4676-87b3-96b4032370d4",
        inicio: 12,
        fim: 48,
      },
      count: 50,
    },
  ],
};

const setupMocks = (rascunhos = mockRascunhosRPLeLPR) => {
  const escolaUuid = mockMeusDadosCEI.vinculo_atual.instituicao.uuid;

  mock
    .onGet("/motivos-alteracao-cardapio/")
    .reply(200, mockMotivosAlteracaoCardapioCEI);
  mock.onGet("/feriados-ano/").reply(200, mockFeriadosAno2025);
  mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCEI);
  mock.onGet("/dias-uteis/").reply(200, {
    proximos_cinco_dias_uteis: "2025-04-22",
    proximos_dois_dias_uteis: "2025-04-16",
  });
  mock
    .onGet(
      `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
    )
    .reply(200, mockVinculosTipoAlimentacaoPeriodoEscolarCEI);
  mock
    .onGet(`/periodos-com-matriculados-por-ue/?escola_uuid=${escolaUuid}/`)
    .reply(200, ["INTEGRAL"]);
  mock
    .onGet("/alteracoes-cardapio-cei/minhas-solicitacoes/")
    .reply(200, rascunhos);
  mock
    .onGet(
      "/periodos-escolares/e17e2405-36be-4981-a09c-35c89ae0f8b7/alunos-por-faixa-etaria/2025-04-23/",
    )
    .reply(200, mockResponseFaixasEtarias);
  mock.onPost("/alteracoes-cardapio-cei/").reply(201, mockAlteracaoCardapioCEI);
  mock
    .onPatch(
      `/alteracoes-cardapio-cei/${mockRascunhosAlteracaoCEI.results[0].uuid}/`,
    )
    .reply(200, mockAlteracaoCardapioCEI);
  mock
    .onPatch(
      `/alteracoes-cardapio-cei/${mockAlteracaoCardapioCEI.uuid}/inicio-pedido/`,
    )
    .reply(200, mockAlteracaoCardapioCEI);
  mock
    .onDelete(
      `/alteracoes-cardapio-cei/${mockRascunhosAlteracaoCEI.results[0].uuid}/`,
    )
    .reply(204);

  Object.defineProperty(global, "localStorage", { value: localStorageMock });
  localStorage.setItem("nome_instituicao", `"CEI DIRET MONUMENTO"`);
  localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
  localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
  localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
};

const renderPagina = async () => {
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
            meusDados: mockMeusDadosCEI,
            setMeusDados: jest.fn(),
          }}
        >
          <AlteracaoDeCardapioCEIPage />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

describe("Teste Formulário Alteração do tipo de Alimentação CEI - Complementos", () => {
  beforeEach(async () => {
    process.env.IS_TEST = true;
    setupMocks();
    await renderPagina();
  });

  it("Carrega rascunho de motivo LPR", async () => {
    const botoesCarregarRascunho = screen.getAllByTestId(
      "botao-carregar-rascunho",
    );
    await act(async () => {
      fireEvent.click(botoesCarregarRascunho[1]);
    });

    expect(screen.getByText("Solicitação # 9C6DC")).toBeInTheDocument();
  });

  it("Exibe erro ao carregar faixas etárias", async () => {
    mock
      .onGet(
        "/periodos-escolares/e17e2405-36be-4981-a09c-35c89ae0f8b7/alunos-por-faixa-etaria/2025-04-23/",
      )
      .reply(400, { detail: "Erro ao carregar faixas etárias" });

    const selectMotivo = screen.getByTestId("select-motivo");
    const selectElement = selectMotivo.querySelector("select");
    const uuidMotivoRPL = mockMotivosAlteracaoCardapioCEI.results.find(
      (motivo) => motivo.nome.includes("RPL"),
    ).uuid;
    fireEvent.change(selectElement, {
      target: { value: uuidMotivoRPL },
    });

    const divDia = screen.getByTestId("data-alterar-dia");
    const inputElement = divDia.querySelector("input");
    fireEvent.change(inputElement, {
      target: { value: "23/04/2025" },
    });

    const divCheckboxINTEGRAL = screen.getByTestId("div-checkbox-INTEGRAL");
    const spanElement = divCheckboxINTEGRAL.querySelector("span");
    await act(async () => {
      fireEvent.click(spanElement);
    });
  });
});

describe("Teste Formulário Alteração do tipo de Alimentação CEI - Sem IS_TEST", () => {
  beforeEach(async () => {
    delete process.env.IS_TEST;
    setupMocks();
    await renderPagina();
  });

  it("Renderiza o formulário sem IS_TEST", () => {
    expect(
      screen.getByText("Descrição da Alteração do Tipo de Alimentação"),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Nova Solicitação").length).toBeGreaterThan(0);
  });
});
