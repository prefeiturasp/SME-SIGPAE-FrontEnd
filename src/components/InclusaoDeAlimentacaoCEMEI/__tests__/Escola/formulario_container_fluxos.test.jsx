import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockRascunhosInclusaoAlimentacaoCEMEI } from "src/mocks/InclusaoAlimentacao/CEMEI/rascunhos";
import { mockMotivosInclusaoContinua } from "src/mocks/InclusaoAlimentacao/mockMotivosInclusaoContinua";
import { mockMotivosInclusaoNormal } from "src/mocks/InclusaoAlimentacao/mockMotivosInclusaoNormal";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/meusDados/escola/CEMEI";
import { mockQuantidadeAlunoCEMEIporCEIEMEI } from "src/mocks/services/aluno.service/CEMEI/quantidadeAlunoCEMEIporCEIEMEI";
import { mockGetVinculosMotivoEspecificoCEMEI } from "src/mocks/services/cadastroTipoAlimentacao.service/CEMEI/vinculosMotivoEspecifico";
import { mockGetVinculosTipoAlimentacaoPorEscolaCEMEI } from "src/mocks/services/cadastroTipoAlimentacao.service/CEMEI/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockQuantidadeAlunosPorPeriodoCEMEI } from "src/mocks/services/escola.service/CEMEI/quantidadeAlunosPorPeriodo";
import { Container } from "src/components/InclusaoDeAlimentacaoCEMEI/componentes/Container";
import mock from "src/services/_mock";

const escolaUuid = mockMeusDadosEscolaCEMEI.vinculo_atual.instituicao.uuid;

const setupBase = async (meusDados, extras = {}) => {
  mock.onGet("/usuarios/meus-dados/").reply(200, meusDados);
  mock.onGet("/motivos-inclusao-normal/").reply(200, mockMotivosInclusaoNormal);
  mock
    .onGet("/motivos-inclusao-continua/")
    .reply(200, mockMotivosInclusaoContinua);
  mock
    .onGet(`/quantidade-alunos-por-periodo/escola/${escolaUuid}/`)
    .reply(200, mockQuantidadeAlunosPorPeriodoCEMEI);
  mock
    .onGet("/alunos/quantidade-cemei-por-cei-emei/")
    .reply(200, extras.alunos || mockQuantidadeAlunoCEMEIporCEIEMEI);
  mock
    .onGet(
      `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
    )
    .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCEMEI);
  mock.onGet("/dias-uteis/").reply(200, {
    proximos_cinco_dias_uteis: "2025-07-16",
    proximos_dois_dias_uteis: "2025-07-14",
  });
  mock
    .onGet(
      "/vinculos-tipo-alimentacao-u-e-periodo-escolar/motivo_inclusao_especifico/",
    )
    .reply(200, extras.especifico || mockGetVinculosMotivoEspecificoCEMEI);
  mock
    .onGet("/inclusao-alimentacao-cemei/")
    .reply(200, mockRascunhosInclusaoAlimentacaoCEMEI);
  mock
    .onGet("/inclusoes-alimentacao-continua/minhas-solicitacoes/")
    .reply(200, { count: 0, next: null, previous: null, results: [] });

  Object.defineProperty(global, "localStorage", { value: localStorageMock });
  localStorage.setItem("nome_instituicao", `"CEMEI SUZANA CAMPOS TAUIL"`);
  localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
  localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
  localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
  if (extras.ehCemei) localStorage.setItem("eh_cemei", "true");

  await act(async () => {
    render(
      <MeusDadosContext.Provider value={{ meusDados, setMeusDados: jest.fn() }}>
        <Container />
      </MeusDadosContext.Provider>,
    );
  });
};

describe("Teste Container CEMEI - escola sem flag eh_cemei", () => {
  beforeEach(async () => {
    await setupBase(mockMeusDadosEscolaCEMEI);
  });

  it("renderiza o formulário sem filtrar vínculos por EMEI", async () => {
    await waitFor(() => {
      expect(screen.getByText("Nova Solicitação")).toBeInTheDocument();
    });
  });
});

describe("Teste Container CEMEI - período específico sem período normal correspondente", () => {
  beforeEach(async () => {
    const periodosSemIntegral = mockQuantidadeAlunoCEMEIporCEIEMEI.filter(
      (periodo) => periodo.nome !== "INTEGRAL",
    );

    await setupBase(mockMeusDadosEscolaCEMEI, {
      alunos: periodosSemIntegral,
      ehCemei: true,
    });
  });

  it("renderiza o formulário mesmo sem período normal correspondente", async () => {
    await waitFor(() => {
      expect(screen.getByText("Nova Solicitação")).toBeInTheDocument();
    });
  });
});

describe("Teste Container CEMEI - vínculos específicos em ordem descendente", () => {
  beforeEach(async () => {
    await setupBase(mockMeusDadosEscolaCEMEI, {
      especifico: [...mockGetVinculosMotivoEspecificoCEMEI].reverse(),
      ehCemei: true,
    });
  });

  it("renderiza o formulário com vínculos específicos ordenados", async () => {
    await waitFor(() => {
      expect(screen.getByText("Nova Solicitação")).toBeInTheDocument();
    });
  });
});
