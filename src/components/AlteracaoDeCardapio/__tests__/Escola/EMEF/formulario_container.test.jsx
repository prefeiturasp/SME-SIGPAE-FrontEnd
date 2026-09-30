import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockDiasUteis } from "src/mocks/diasUseisMock";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
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

const escolaUuid =
  mockMeusDadosEscolaEMEFPericles.vinculo_atual.instituicao.uuid;

const meusDadosComAlunosRegulares = {
  ...mockMeusDadosEscolaEMEFPericles,
  vinculo_atual: {
    ...mockMeusDadosEscolaEMEFPericles.vinculo_atual,
    instituicao: {
      ...mockMeusDadosEscolaEMEFPericles.vinculo_atual.instituicao,
      possui_alunos_regulares: true,
    },
  },
};

const setupMocks = ({
  meusDados = meusDadosComAlunosRegulares,
  statusMotivos = 200,
  statusVinculos = 200,
  statusDiasUteis = 200,
  statusQuantidade = 200,
} = {}) => {
  mock.onGet("/usuarios/meus-dados/").reply(200, meusDados);
  mock
    .onGet("/motivos-alteracao-cardapio/")
    .reply(
      statusMotivos,
      statusMotivos === 200 ? mockMotivosAlteracaoCardapio : { detail: "Erro" },
    );
  mock
    .onGet("/dias-uteis/")
    .reply(
      statusDiasUteis,
      statusDiasUteis === 200 ? mockDiasUteis : { detail: "Erro" },
    );
  mock
    .onGet("/alteracoes-cardapio/minhas-solicitacoes/")
    .reply(200, mockRascunhosAlteracaoCardapioEMEF);
  mock
    .onGet(
      `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
    )
    .reply(
      statusVinculos,
      statusVinculos === 200
        ? mockVinculosTipoAlimentacaoPeriodoEscolarEMEF
        : { detail: "Erro" },
    );
  mock
    .onGet(`/quantidade-alunos-por-periodo/escola/${escolaUuid}/`)
    .reply(
      statusQuantidade,
      statusQuantidade === 200
        ? mockQuantidadeAlunosPorPeriodoEMEF
        : { detail: "Erro" },
    );

  Object.defineProperty(global, "localStorage", { value: localStorageMock });
  localStorage.setItem(
    "nome_instituicao",
    `"EMEF PERICLES EUGENIO DA SILVA RAMOS"`,
  );
  localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
  localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
  localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
};

const renderPagina = async (meusDados = meusDadosComAlunosRegulares) => {
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
          <AlteracaoDeCardapioPage />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

describe("Container Alteração de Cardápio - fluxo normal com alunos regulares", () => {
  beforeEach(async () => {
    process.env.IS_TEST = true;
    setupMocks();
    await renderPagina();
  });

  it("renderiza o formulário e carrega a quantidade de alunos por período", async () => {
    expect(screen.getByText("Descrição da Alteração")).toBeInTheDocument();
    expect(screen.getAllByText("Nova Solicitação").length).toBeGreaterThan(0);
  });
});

describe("Container Alteração de Cardápio - erro ao carregar motivos", () => {
  beforeEach(async () => {
    process.env.IS_TEST = true;
    setupMocks({ statusMotivos: 500 });
    await renderPagina();
  });

  it("exibe erro ao carregar motivos", async () => {
    await waitFor(() => {
      expect(
        screen.getByText(
          "Erro ao carregar motivos de alteração de cardápio. Tente novamente mais tarde.",
        ),
      ).toBeInTheDocument();
    });
  });
});

describe("Container Alteração de Cardápio - erro ao carregar vínculos", () => {
  beforeEach(async () => {
    process.env.IS_TEST = true;
    setupMocks({ statusVinculos: 500 });
    await renderPagina();
  });

  it("exibe erro ao carregar vínculos dos períodos escolares", async () => {
    await waitFor(() => {
      expect(
        screen.getByText(
          "Erro ao carregar vinculos dos períodos escolares da escola. Tente novamente mais tarde.",
        ),
      ).toBeInTheDocument();
    });
  });
});

describe("Container Alteração de Cardápio - erro ao carregar dias úteis", () => {
  beforeEach(async () => {
    process.env.IS_TEST = true;
    setupMocks({ statusDiasUteis: 500 });
    await renderPagina();
  });

  it("exibe erro ao carregar dias úteis", async () => {
    await waitFor(() => {
      expect(
        screen.getByText(
          "Erro ao carregar quais são os dias úteis deste tipo de unidade. Tente novamente mais tarde.",
        ),
      ).toBeInTheDocument();
    });
  });
});

describe("Container Alteração de Cardápio - erro ao carregar quantidades", () => {
  beforeEach(async () => {
    process.env.IS_TEST = true;
    setupMocks({ statusQuantidade: 500 });
    await renderPagina();
  });

  it("exibe erro ao carregar quantidades de alunos por período", async () => {
    await waitFor(() => {
      expect(
        screen.getByText(
          "Erro ao carregar quantidades de alunos por período escolar. Tente novamente mais tarde.",
        ),
      ).toBeInTheDocument();
    });
  });
});

describe("Container Alteração de Cardápio - sem meusDados", () => {
  beforeEach(async () => {
    process.env.IS_TEST = true;
    setupMocks();
    localStorage.setItem("meusDados", "{}");
    await renderPagina(null);
  });

  it("exibe Carregando... enquanto não há meusDados", () => {
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });
});
