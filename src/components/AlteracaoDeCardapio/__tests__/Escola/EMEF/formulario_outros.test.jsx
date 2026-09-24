import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockDiasUteis } from "src/mocks/diasUseisMock";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockRascunhoAlteracaoCardapioEMEF } from "src/mocks/services/alteracaoCardapio.service/EMEF/rascunhoAlteracaoCardapio";
import { mockRascunhosAlteracaoCardapioEMEF } from "src/mocks/services/alteracaoCardapio.service/EMEF/rascunhosAlteracaoCardapio";
import { mockMotivosAlteracaoCardapio } from "src/mocks/services/alteracaoCardapio.service/motivosAlteracaoCardapio";
import { mockVinculosTipoAlimentacaoPeriodoEscolarEMEF } from "src/mocks/services/cadastroTipoAlimentacao.service/EMEF/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockQuantidadeAlunosPorPeriodoEMEF } from "src/mocks/services/escola.service/EMEF/quantidadeAlunosPorPeriodoEMEF";
import AlteracaoDeCardapioPage from "src/pages/Escola/AlteracaoDeCardapioPage";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

jest.mock("react-toastify", () => ({
  success: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  POSITION: {
    TOP_CENTER: "top-center",
  },
}));

const mockRascunhoComPeriodo = {
  ...mockRascunhosAlteracaoCardapioEMEF.results[0],
  id_externo: "9ABC1",
  uuid: "99999999-8888-7777-6666-555555555555",
  data_inicial: "30/01/2025",
  data_final: "01/02/2025",
  criado_em: "14/03/2025 09:00:00",
};

const setupMocks = (
  rascunhos = [
    mockRascunhosAlteracaoCardapioEMEF.results[0],
    mockRascunhoComPeriodo,
  ],
) => {
  const escolaUuid =
    mockMeusDadosEscolaEMEFPericles.vinculo_atual.instituicao.uuid;

  mock
    .onGet("/usuarios/meus-dados/")
    .reply(200, mockMeusDadosEscolaEMEFPericles);
  mock
    .onGet("/motivos-alteracao-cardapio/")
    .reply(200, mockMotivosAlteracaoCardapio);
  mock.onGet("/dias-uteis/").reply(200, mockDiasUteis);
  mock
    .onGet("/alteracoes-cardapio/minhas-solicitacoes/")
    .reply(200, {
      count: rascunhos.length,
      next: null,
      previous: null,
      results: rascunhos,
    });
  mock
    .onGet(
      `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
    )
    .reply(200, mockVinculosTipoAlimentacaoPeriodoEscolarEMEF);
  mock
    .onGet(`/quantidade-alunos-por-periodo/escola/${escolaUuid}/`)
    .reply(200, mockQuantidadeAlunosPorPeriodoEMEF);
  mock
    .onPost("/alteracoes-cardapio/")
    .reply(201, mockRascunhoAlteracaoCardapioEMEF);
  mock
    .onPatch(`/alteracoes-cardapio/${mockRascunhoAlteracaoCardapioEMEF.uuid}/`)
    .reply(200, mockRascunhoAlteracaoCardapioEMEF);
  mock
    .onPatch(
      `/alteracoes-cardapio/${mockRascunhoAlteracaoCardapioEMEF.uuid}/inicio-pedido/`,
    )
    .reply(200, {
      ...mockRascunhoAlteracaoCardapioEMEF,
      status: "DRE_A_VALIDAR",
    });
  mock
    .onDelete(`/alteracoes-cardapio/${mockRascunhoAlteracaoCardapioEMEF.uuid}/`)
    .reply(204, {});

  Object.defineProperty(global, "localStorage", { value: localStorageMock });
  localStorage.setItem(
    "nome_instituicao",
    `"EMEF PERICLES EUGENIO DA SILVA RAMOS"`,
  );
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
            meusDados: mockMeusDadosEscolaEMEFPericles,
            setMeusDados: jest.fn(),
          }}
        >
          <AlteracaoDeCardapioPage />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

describe("Teste Formulário Alteração de Cardápio - Complementos - EMEF", () => {
  beforeEach(async () => {
    process.env.IS_TEST = true;
    setupMocks();
    await renderPagina();
  });

  it("Carrega rascunho com período de dias (data_inicial e data_final)", async () => {
    const botoesCarregarRascunho = screen.getAllByTestId(
      "botao-carregar-rascunho",
    );
    await act(async () => {
      fireEvent.click(botoesCarregarRascunho[1]);
    });

    expect(screen.getByText("Solicitação # 9ABC1")).toBeInTheDocument();
  });
});

describe("Teste Formulário Alteração de Cardápio - Sem IS_TEST - EMEF", () => {
  beforeEach(async () => {
    delete process.env.IS_TEST;
    setupMocks();
    await renderPagina();
  });

  it("Renderiza o formulário sem IS_TEST", () => {
    expect(screen.getByText("Descrição da Alteração")).toBeInTheDocument();
    expect(screen.getAllByText("Nova Solicitação").length).toBeGreaterThan(0);

    const selectMotivoDiv = screen.getByTestId("div-select-motivo");
    const selectElementMotivo = selectMotivoDiv.querySelector("select");
    const uuidRPL = mockMotivosAlteracaoCardapio.results.find((motivo) =>
      motivo.nome.includes("RPL"),
    ).uuid;
    fireEvent.change(selectElementMotivo, {
      target: { value: uuidRPL },
    });

    expect(screen.getByText("Alterar dia")).toBeInTheDocument();
  });
});
