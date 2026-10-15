import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
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

const periodosComExtraordinaria = {
  results: [
    medicaoAprovada("MANHA", "m1"),
    medicaoAprovada("Solicitações de Alimentação", "s1"),
    medicaoAprovada(GRUPO_EXTRAORDINARIO, "e1"),
  ],
};

const solicitacao = {
  ...mockSolicitacaoMedicaoInicialCMCTSetembro2025,
  status: "MEDICAO_APROVADA_PELA_DRE",
  lanche_emergencial_extraordinario: true,
};

const setup = async (periodos) => {
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
  localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);
  localStorage.setItem("perfil", PERFIL.COGESTOR_DRE);

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

describe("Conferência de Lançamentos - DRE - bloco extraordinário somente em tela", () => {
  it("NÃO exibe o bloco quando a medição extraordinária não existe no banco", async () => {
    await setup(periodosSemExtraordinaria);

    expect(
      screen.queryByText("Solicitação de Correção pela CODAE"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(GRUPO_EXTRAORDINARIO)).not.toBeInTheDocument();
  });

  it("exibe o bloco quando a medição extraordinária existe no banco", async () => {
    await setup(periodosComExtraordinaria);

    expect(
      screen.getByText("Solicitação de Correção pela CODAE"),
    ).toBeInTheDocument();
    expect(screen.getByText(GRUPO_EXTRAORDINARIO)).toBeInTheDocument();
  });
});
