import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { mockGetTipoAlimentacao } from "src/mocks/cadastroTipoAlimentacao.service/mockGetTipoAlimentacao";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockDiasCalendarioSetembro2025CMCT } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CMCT/Setembro2025/diasCalendario";
import { mockMeusDadosSuperUsuarioMedicao } from "src/mocks/meusDados/superUsuarioMedicao";
import { mockGetVinculosTipoAlimentacaoPorEscola } from "src/mocks/cadastroTipoAlimentacao.service/mockGetVinculosTipoAlimentacaoPorEscola";
import { mockPeriodosGruposMedicaoCMCTSetembro2025 } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/CMCT/Setembro2025/periodosGruposMedicao";
import { mockSolicitacaoMedicaoInicialCMCTSetembro2025 } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/CMCT/Setembro2025/solicitacaoMedicaoInicial";
import { mockValoresMedicaoComDietas } from "src/mocks/services/medicaoInicial/valoresMedicao.service/Setembro2025/valoresMedicaoComDietas";
import { mockOcorrenciaAprovadaPelaDRE } from "src/mocks/medicaoInicial/ConferenciaDeLancamentos/mockOcorrencias";
import { ConferenciaDosLancamentosPage } from "src/pages/LancamentoMedicaoInicial/ConferenciaDosLancamentosPage";
import mock from "src/services/_mock";

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: () => <textarea data-testid="ckeditor-mock" name="ckeditor-mock" />,
}));

jest.mock(
  "src/components/screens/LancamentoInicial/PeriodoLancamentoMedicaoInicial/helper",
  () => ({
    ...jest.requireActual(
      "src/components/screens/LancamentoInicial/PeriodoLancamentoMedicaoInicial/helper",
    ),
    getPermissoesLancamentosEspeciaisMesAnoPorPeriodoAsync: jest.fn(() =>
      Promise.resolve({
        alimentacoes_lancamentos_especiais: [
          { name: "ALMOÇO", uuid: "uuid-almoco" },
          { name: "LANCHE", uuid: "uuid-lanche" },
        ],
        data_inicio_permissoes: "2023-10-01",
      }),
    ),
  }),
);

describe("Teste Conferência de Lançamentos - Usuário MEDIÇÃO - Botão Aprovar formulário", () => {
  const escolaUuid = mockSolicitacaoMedicaoInicialCMCTSetembro2025.escola_uuid;
  const solicitacaoUuid = mockSolicitacaoMedicaoInicialCMCTSetembro2025.uuid;

  beforeEach(() => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.MEDICAO);
    localStorage.setItem("perfil", PERFIL.ADMINITRADOR_MEDICAO);

    const search = `?uuid=${solicitacaoUuid}`;
    window.history.pushState({}, "", search);

    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosSuperUsuarioMedicao);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/periodos-grupos-medicao/",
      )
      .reply(200, mockPeriodosGruposMedicaoCMCTSetembro2025);
    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes-com-nome/")
      .reply(200, {
        results: [{ dia: "07", feriado: "Dia da Independência do Brasil" }],
      });
    mock
      .onGet("/dias-calendario/")
      .reply(200, mockDiasCalendarioSetembro2025CMCT);
    mock
      .onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/")
      .reply(200, []);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscola);
    mock
      .onGet(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/vinculos-inclusoes-evento-especifico-autorizadas/",
      )
      .reply(200, []);
    mock
      .onGet("/medicao-inicial/categorias-medicao/")
      .reply(200, mockCategoriasMedicao);
    mock.onGet("/tipos-alimentacao/").reply(200, mockGetTipoAlimentacao);
    mock.onGet("/escola-solicitacoes/inclusoes-autorizadas/").reply(200, {
      results: [],
    });
    mock
      .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
      .reply(200, {
        results: [],
      });
    mock.onGet("/escolas-solicitacoes/suspensoes-autorizadas/").reply(200, {
      results: [],
    });
    mock.onGet("/periodos-escolares/inclusao-continua-por-mes/").reply(200, {
      periodos: { TARDE: "20bd9ca9-d499-456a-bd86-fb8f297947d6" },
    });
    mock
      .onGet("/medicao-inicial/valores-medicao/")
      .reply(200, mockValoresMedicaoComDietas);
  });

  const setup = async () => {
    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/",
              state: { ano: "2025", escolaUuid: escolaUuid, mes: "09" },
            },
          ]}
          future={{
            v7_startTransition: true,
            v7_relativeSpatPath: true,
          }}
        >
          <ToastContainer />
          <ConferenciaDosLancamentosPage />
        </MemoryRouter>,
      );
    });

    await waitFor(() => {
      expect(screen.queryByText(/Carregando/i)).not.toBeInTheDocument();
    });
  };

  it("deve renderizar 'Aprovar formulário' DESABILITADO quando o status da ocorrência está na lista esperada da CODAE", async () => {
    mock
      .onGet(`/medicao-inicial/solicitacao-medicao-inicial/${solicitacaoUuid}/`)
      .reply(200, {
        ...mockSolicitacaoMedicaoInicialCMCTSetembro2025,
        ocorrencia: mockOcorrenciaAprovadaPelaDRE,
        com_ocorrencias: true,
        status: "MEDICAO_APROVADA_PELA_DRE",
      });

    await setup();

    const btnExpandir = document.querySelector(".visualizar-ocorrencias");
    fireEvent.click(btnExpandir);

    const botaoAprovar = screen
      .getByText("Aprovar formulário")
      .closest("button");

    expect(botaoAprovar).toBeInTheDocument();
    expect(botaoAprovar).toBeDisabled();
  });

  it("deve renderizar 'Aprovar formulário' DESABILITADO para Medição em outro status esperado da CODAE", async () => {
    mock
      .onGet(`/medicao-inicial/solicitacao-medicao-inicial/${solicitacaoUuid}/`)
      .reply(200, {
        ...mockSolicitacaoMedicaoInicialCMCTSetembro2025,
        ocorrencia: {
          ...mockOcorrenciaAprovadaPelaDRE,
          status: "MEDICAO_CORRECAO_SOLICITADA_CODAE",
        },
        com_ocorrencias: true,
        status: "MEDICAO_CORRIGIDA_PARA_CODAE",
      });

    await setup();

    const btnExpandir = document.querySelector(".visualizar-ocorrencias");
    fireEvent.click(btnExpandir);

    const botaoAprovar = screen
      .getByText("Aprovar formulário")
      .closest("button");

    expect(botaoAprovar).toBeInTheDocument();
    expect(botaoAprovar).toBeDisabled();
  });
});
