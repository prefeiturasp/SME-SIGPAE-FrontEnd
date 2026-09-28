import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockDiasUteis } from "src/mocks/diasUseisMock";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/meusDados/escola/CEMEI";
import { mockMotivosAlteracaoCardapio } from "src/mocks/services/alteracaoCardapio.service/motivosAlteracaoCardapio";
import { mockQuantidadeAlunoCEMEIporCEIEMEI } from "src/mocks/services/aluno.service/CEMEI/quantidadeAlunoCEMEIporCEIEMEI";
import { mockGetVinculosTipoAlimentacaoPorEscolaCEMEI } from "src/mocks/services/cadastroTipoAlimentacao.service/CEMEI/vinculosTipoAlimentacaoPeriodoEscolar";
import { AlteracaoDeCardapioCEMEIPage } from "src/pages/Escola/AlteracaoDeCardapioCEMEIPage";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

const escolaUuid = mockMeusDadosEscolaCEMEI.vinculo_atual.instituicao.uuid;

const setupMocks = ({
  meusDados = mockMeusDadosEscolaCEMEI,
  statusQuantidade = 200,
  statusVinculos = 200,
  statusMotivos = 200,
  statusDiasUteis = 200,
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
    .onGet("/alunos/quantidade-cemei-por-cei-emei/")
    .reply(
      statusQuantidade,
      statusQuantidade === 200
        ? mockQuantidadeAlunoCEMEIporCEIEMEI
        : { detail: "Erro" },
    );
  mock
    .onGet(
      `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
    )
    .reply(
      statusVinculos,
      statusVinculos === 200
        ? mockGetVinculosTipoAlimentacaoPorEscolaCEMEI
        : { detail: "Erro" },
    );

  Object.defineProperty(global, "localStorage", { value: localStorageMock });
  localStorage.setItem("nome_instituicao", `"CEMEI SUZANA CAMPOS TAUIL"`);
  localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
  localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
  localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
  localStorage.setItem("eh_cemei", "true");
};

const renderPagina = async (meusDados = mockMeusDadosEscolaCEMEI) => {
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
          <AlteracaoDeCardapioCEMEIPage />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

describe("Container CEMEI - erro ao carregar períodos escolares", () => {
  beforeEach(async () => {
    setupMocks({ statusQuantidade: 500 });
    await renderPagina();
  });

  it("exibe erro ao carregar períodos escolares", () => {
    expect(
      screen.getByText(
        "Erro ao carregar períodos escolares. Tente novamente mais tarde.",
      ),
    ).toBeInTheDocument();
  });
});

describe("Container CEMEI - erro ao carregar vínculos", () => {
  beforeEach(async () => {
    setupMocks({ statusVinculos: 500 });
    await renderPagina();
  });

  it("exibe erro ao carregar vínculos do tipo de alimentação", () => {
    expect(
      screen.getByText(
        "Erro ao carregar vinculos do tipo de alimentação. Tente novamente mais tarde.",
      ),
    ).toBeInTheDocument();
  });
});

describe("Container CEMEI - erro ao carregar motivos", () => {
  beforeEach(async () => {
    setupMocks({ statusMotivos: 500 });
    await renderPagina();
  });

  it("exibe erro ao carregar motivos de alteração de cardápio", () => {
    expect(
      screen.getByText(
        "Erro ao carregar motivos de alteração de cardápio. Tente novamente mais tarde.",
      ),
    ).toBeInTheDocument();
  });
});

describe("Container CEMEI - erro ao carregar dias úteis", () => {
  beforeEach(async () => {
    setupMocks({ statusDiasUteis: 500 });
    await renderPagina();
  });

  it("exibe erro ao carregar dias úteis", () => {
    expect(
      screen.getByText(
        "Erro ao carregar dias úteis. Tente novamente mais tarde.",
      ),
    ).toBeInTheDocument();
  });
});

describe("Container CEMEI - sem meusDados", () => {
  beforeEach(async () => {
    setupMocks();
    localStorage.setItem("meusDados", "{}");
    await renderPagina(null);
  });

  it("não renderiza o formulário sem meusDados", () => {
    expect(
      screen.queryByText("Descrição da Alteração"),
    ).not.toBeInTheDocument();
  });
});
