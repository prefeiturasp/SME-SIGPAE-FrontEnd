import "@testing-library/jest-dom";
import {
  act,
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { TIPO_PERFIL } from "src/constants/shared";
import { mockGetTipoAlimentacao } from "src/mocks/cadastroTipoAlimentacao.service/mockGetTipoAlimentacao";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockDiasCalendarioSetembro2025CMCT } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CMCT/Setembro2025/diasCalendario";
import { mockMeusDadosNutriSupervisao } from "src/mocks/meusDados/nutri-supervisao";
import { mockGetVinculosTipoAlimentacaoPorEscola } from "src/mocks/cadastroTipoAlimentacao.service/mockGetVinculosTipoAlimentacaoPorEscola";
import { mockPeriodosGruposMedicaoCMCTSetembro2025 } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/CMCT/Setembro2025/periodosGruposMedicao";
import { mockSolicitacaoMedicaoInicialCMCTSetembro2025 } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/CMCT/Setembro2025/solicitacaoMedicaoInicial";
import {
  mockOcorrenciaAprovadaPelaDRE,
  mockOcorrenciaAprovadaPelaCODAE,
  mockOcorrenciaDevolvidoParaAjustesPelaCODAE,
} from "src/mocks/medicaoInicial/ConferenciaDeLancamentos/mockOcorrencias";
import { ConferenciaDosLancamentosPage } from "src/pages/LancamentoMedicaoInicial/ConferenciaDosLancamentosPage";
import {
  codaePedeAprovacaoOcorrencia,
  codaePedeCorrecaoOcorrencia,
  geraOcorrenciaParaCorrecao,
} from "src/services/medicaoInicial/solicitacaoMedicaoInicial.service";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import mock from "src/services/_mock";
import { saveAs } from "file-saver";
import preview from "jest-preview";

jest.mock("file-saver", () => ({
  saveAs: jest.fn(),
}));

jest.mock(
  "src/services/medicaoInicial/solicitacaoMedicaoInicial.service",
  () => {
    const actual = jest.requireActual(
      "src/services/medicaoInicial/solicitacaoMedicaoInicial.service",
    );

    return {
      ...actual,
      codaePedeAprovacaoOcorrencia: jest.fn(),
      codaePedeCorrecaoOcorrencia: jest.fn(),
      geraOcorrenciaParaCorrecao: jest.fn(),
    };
  },
);

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastSuccess: jest.fn(),
  toastError: jest.fn(),
}));

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: ({ input }) => (
    <textarea
      data-testid="ckeditor-mock"
      {...input}
      onChange={(e) => input.onChange(e.target.value)}
    />
  ),
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

describe("Teste ConferenciaDosLancamentos - Acessos CODAE Nutri Manifestação", () => {
  const escolaUuid = mockSolicitacaoMedicaoInicialCMCTSetembro2025.escola_uuid;
  const solicitacaoUuid = mockSolicitacaoMedicaoInicialCMCTSetembro2025.uuid;
  const mockMedicaoAprovadaPelaDREComOcorrencia = {
    ...mockSolicitacaoMedicaoInicialCMCTSetembro2025,
    ocorrencia: mockOcorrenciaAprovadaPelaDRE,
    com_ocorrencias: true,
    status: "MEDICAO_APROVADA_PELA_DRE",
  };

  const setupMocks = () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosNutriSupervisao);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/periodos-grupos-medicao/",
      )
      .reply(200, mockPeriodosGruposMedicaoCMCTSetembro2025);
    mock
      .onGet(`/medicao-inicial/solicitacao-medicao-inicial/${solicitacaoUuid}/`)
      .reply(200, mockMedicaoAprovadaPelaDREComOcorrencia);
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
  };

  const renderComponent = async () => {
    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/",
              state: {
                ano: "2025",
                escolaUuid: escolaUuid,
                mes: "09",
              },
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

  beforeEach(() => {
    process.env.IS_TEST = true;
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.NUTRICAO_MANIFESTACAO);
    localStorage.setItem(
      "perfil",
      `"COORDENADOR_SUPERVISAO_NUTRICAO_MANIFESTACAO"`,
    );

    const search = `?uuid=${solicitacaoUuid}`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });
  });

  afterEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  describe("Card APROVADO PELA DRE", () => {
    it("Deve carregar os dados de ocorrência para NUTRIMANIFESTACAO", async () => {
      setupMocks();
      await renderComponent();

      await waitFor(() => {
        expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument();
        expect(screen.getByText(/Avaliação do Serviço:/i)).toBeInTheDocument();
        expect(screen.getByText(/COM OCORRÊNCIAS/i)).toBeInTheDocument();

        const aprovadroDre = document.querySelector(".status-ocorrencia");
        expect(aprovadroDre).toHaveTextContent(/Aprovado pela DRE/i);

        const visualizar = document.querySelector(".visualizar-ocorrencias");
        expect(visualizar).toHaveTextContent(/VISUALIZAR/i);
      });
    });

    it("Deve renderizar os botões referentes a modal ocorrência ao clicar em VISUALIZAR", async () => {
      setupMocks();
      await renderComponent();
      const btnExpandir = document.querySelector(".visualizar-ocorrencias");
      fireEvent.click(btnExpandir);

      const btnAprovarForm = screen.getByRole("button", {
        name: /aprovar formulário/i,
      });
      expect(btnAprovarForm).toBeInTheDocument();
      expect(btnAprovarForm).not.toBeDisabled();

      const btnSolicitarCorrecaoForm = screen.getByRole("button", {
        name: /solicitar correção no formulário/i,
      });
      expect(btnSolicitarCorrecaoForm).toBeInTheDocument();
      expect(btnSolicitarCorrecaoForm).not.toBeDisabled();

      const btnHistorico = screen.getByTestId("botao-historico");
      expect(btnHistorico).toBeInTheDocument();
      expect(btnHistorico).not.toBeDisabled();
      expect(btnHistorico).toHaveTextContent(/histórico/i);

      const btnDownload = screen.getByText(/download de ocorrências/i);
      expect(btnDownload).not.toHaveClass("disabled");
    });

    it("Deve garantir que os botões de ação excluisvos do usurio MEDIÇÃO não aparecem na tela", async () => {
      setupMocks();
      await renderComponent();
      const btnAprovarMedicao = screen.queryByRole("button", {
        name: /Aprovar Medição/i,
      });
      expect(btnAprovarMedicao).not.toBeInTheDocument();

      const btnCiente = screen.queryByRole("button", {
        name: /ciente das correções/i,
      });
      expect(btnCiente).not.toBeInTheDocument();

      const btnAprovarPeriodo = screen.queryByRole("button", {
        name: /aprovar período/i,
      });
      expect(btnAprovarPeriodo).not.toBeInTheDocument();

      const btnSolicitarCorrecao = screen.queryByRole("button", {
        name: /solicitar correcao/i,
      });
      expect(btnSolicitarCorrecao).not.toBeInTheDocument();
    });

    it("Deve enviar a aprovação com sucesso ao clicar em Aprovar Formulário", async () => {
      codaePedeAprovacaoOcorrencia.mockResolvedValue({
        status: 200,
        data: { success: true },
      });

      setupMocks();
      await renderComponent();
      const btnVisualizar = document.querySelector(".visualizar-ocorrencias");
      fireEvent.click(btnVisualizar);
      const btnAprovarForm = await screen.findByRole("button", {
        name: /Aprovar Formulário/i,
      });
      fireEvent.click(btnAprovarForm);

      await waitFor(
        () => {
          expect(screen.queryByText(/Carregando/i)).not.toBeInTheDocument();
          expect(
            screen.getByText(/Deseja aprovar o Formulário de Ocorrências\?/i),
          ).toBeInTheDocument();
        },
        { timeout: 2000 },
      );

      const btnConfirmar = screen.getByTestId("botao-Sim");
      fireEvent.click(btnConfirmar);
      await waitFor(() => {
        expect(toastSuccess).toHaveBeenCalledWith(
          "Solicitação de aprovação no Formulário de Ocorrências salva com sucesso!",
        );
      });
    });

    it("Deve exibir erro se a chamada da API falhar ao Aprovar Formulário", async () => {
      codaePedeAprovacaoOcorrencia.mockResolvedValue({
        status: 500,
        data: { success: false },
      });

      setupMocks();
      await renderComponent();
      const btnVisualizar = document.querySelector(".visualizar-ocorrencias");
      fireEvent.click(btnVisualizar);
      const btnAprovarForm = await screen.findByRole("button", {
        name: /Aprovar Formulário/i,
      });
      fireEvent.click(btnAprovarForm);

      await waitFor(
        () => {
          expect(screen.queryByText(/Carregando/i)).not.toBeInTheDocument();
          expect(
            screen.getByText(/Deseja aprovar o Formulário de Ocorrências\?/i),
          ).toBeInTheDocument();
        },
        { timeout: 2000 },
      );

      const btnConfirmar = screen.getByTestId("botao-Sim");
      fireEvent.click(btnConfirmar);

      await waitFor(() => {
        expect(toastError).toHaveBeenCalledWith(
          "Houve um erro ao salvar aprovação no Formulário de Ocorrências!",
        );
      });
    });

    it("Deve validar o campo obrigatório e enviar a correção com a justificativa preenchida", async () => {
      codaePedeCorrecaoOcorrencia.mockResolvedValue({
        status: 200,
        data: { success: true },
      });

      setupMocks();
      await renderComponent();
      const btnVisualizar = document.querySelector(".visualizar-ocorrencias");
      fireEvent.click(btnVisualizar);
      const btnSolicitarCor = await screen.findByRole("button", {
        name: /Solicitar correção no formulário/i,
      });
      fireEvent.click(btnSolicitarCor);

      await waitFor(
        () => {
          expect(screen.queryByText(/Carregando/i)).not.toBeInTheDocument();
          expect(
            screen.queryByText(
              /Informe quais os pontos necessários de correção no Formulário de Ocorrências/i,
            ),
          ).toBeInTheDocument();
        },
        { timeout: 2000 },
      );

      const btnEnviarCorrecao = screen.getByTestId("botao-Salvar");
      expect(btnEnviarCorrecao).toBeDisabled();
      const btnCancelar = screen.getByTestId("botao-Cancelar");
      expect(btnCancelar).not.toBeDisabled();

      const messagem = "Minha justificativa para correção";
      const ckEditor = screen.getByTestId("ckeditor-mock");
      fireEvent.change(ckEditor, { target: { value: messagem } });
      await waitFor(() => {
        expect(ckEditor.value).toBe(messagem);
        expect(btnEnviarCorrecao).not.toBeDisabled();
      });

      fireEvent.click(btnEnviarCorrecao);
      await waitFor(() => {
        expect(toastSuccess).toHaveBeenCalledWith(
          "Solicitação de correção no Formulário de Ocorrências salva com sucesso!",
        );
      });
    });

    it("Deve exibir erro se a chamada da API falhar ao solicitar correção", async () => {
      codaePedeCorrecaoOcorrencia.mockResolvedValue({
        status: 500,
        data: { success: true },
      });

      setupMocks();
      await renderComponent();
      const btnVisualizar = document.querySelector(".visualizar-ocorrencias");
      fireEvent.click(btnVisualizar);
      const btnSolicitarCor = await screen.findByRole("button", {
        name: /Solicitar correção no formulário/i,
      });
      fireEvent.click(btnSolicitarCor);

      await waitFor(
        () => {
          expect(screen.queryByText(/Carregando/i)).not.toBeInTheDocument();
          expect(
            screen.queryByText(
              /Informe quais os pontos necessários de correção no Formulário de Ocorrências/i,
            ),
          ).toBeInTheDocument();
          preview.debug();
        },
        { timeout: 2000 },
      );

      const btnEnviarCorrecao = screen.getByTestId("botao-Salvar");
      expect(btnEnviarCorrecao).toBeDisabled();
      const btnCancelar = screen.getByTestId("botao-Cancelar");
      expect(btnCancelar).not.toBeDisabled();

      const messagem = "Minha justificativa para correção";
      const ckEditor = screen.getByTestId("ckeditor-mock");
      fireEvent.change(ckEditor, { target: { value: messagem } });
      await waitFor(() => {
        expect(ckEditor.value).toBe(messagem);
        expect(btnEnviarCorrecao).not.toBeDisabled();
      });

      fireEvent.click(btnEnviarCorrecao);
      await waitFor(() => {
        expect(toastError).toHaveBeenCalledWith(
          "Houve um erro ao salvar correção no Formulário de Ocorrências!",
        );
      });
    });

    it("Deve fechar a modal de correção ao clicar em Cancelar sem chamar a API", async () => {
      setupMocks();
      await renderComponent();

      fireEvent.click(document.querySelector(".visualizar-ocorrencias"));
      fireEvent.click(
        await screen.findByRole("button", { name: /Solicitar correção/i }),
      );

      const btnCancelar = screen.getByTestId("botao-Cancelar");
      fireEvent.click(btnCancelar);

      await waitFor(() => {
        expect(
          screen.queryByText(/Informe quais os pontos necessários/i),
        ).not.toBeInTheDocument();
      });
      expect(codaePedeCorrecaoOcorrencia).not.toHaveBeenCalled();
    });

    it("Deve desabilitar o botão Salvar se o usuário apagar a justificativa", async () => {
      setupMocks();
      await renderComponent();

      fireEvent.click(document.querySelector(".visualizar-ocorrencias"));
      fireEvent.click(
        await screen.findByRole("button", { name: /Solicitar correção/i }),
      );

      const ckEditor = screen.getByTestId("ckeditor-mock");
      const btnSalvar = screen.getByTestId("botao-Salvar");

      fireEvent.change(ckEditor, { target: { value: "Teste" } });
      await waitFor(() => expect(btnSalvar).not.toBeDisabled());

      fireEvent.change(ckEditor, { target: { value: "" } });
      await waitFor(() => expect(btnSalvar).toBeDisabled());
    });

    it("Não deve exibir a seção de ocorrências e deve exibir botões padrão quando a medição não possuir ocorrências", async () => {
      const mockSemOcorrencia = {
        ...mockMedicaoAprovadaPelaDREComOcorrencia,
        com_ocorrencias: false,
        ocorrencia: null,
      };
      setupMocks();
      mock
        .onGet(
          `/medicao-inicial/solicitacao-medicao-inicial/${solicitacaoUuid}/`,
        )
        .reply(200, mockSemOcorrencia);

      await renderComponent();
      preview.debug();

      expect(screen.queryByText(/Avaliação do Serviço:/i)).toBeInTheDocument();
      expect(screen.queryByText(/COM OCORRÊNCIAS/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/SEM OCORRÊNCIAS/i)).toBeInTheDocument();

      const btnVisualizar = document.querySelector(".visualizar-ocorrencias");
      expect(btnVisualizar).not.toBeInTheDocument();

      const btnSolicitarCorrecaoForm = screen.getByRole("button", {
        name: /solicitar correção no formulário/i,
      });
      expect(btnSolicitarCorrecaoForm).toBeInTheDocument();
      expect(btnSolicitarCorrecaoForm).not.toBeDisabled();
    });

    it("Sem Ocorrencia - Deve validar o campo obrigatório e enviar a correção com a justificativa preenchida", async () => {
      geraOcorrenciaParaCorrecao.mockResolvedValue({
        status: 200,
        data: { success: true },
      });

      const mockSemOcorrencia = {
        ...mockMedicaoAprovadaPelaDREComOcorrencia,
        com_ocorrencias: false,
        ocorrencia: null,
      };
      setupMocks();
      mock
        .onGet(
          `/medicao-inicial/solicitacao-medicao-inicial/${solicitacaoUuid}/`,
        )
        .reply(200, mockSemOcorrencia);

      await renderComponent();
      const btnSolicitarCor = await screen.findByRole("button", {
        name: /Solicitar correção no formulário/i,
      });
      fireEvent.click(btnSolicitarCor);

      await waitFor(
        () => {
          expect(screen.queryByText(/Carregando/i)).not.toBeInTheDocument();
          expect(
            screen.queryByText(
              /Informe quais os pontos necessários de correção no Formulário de Ocorrências/i,
            ),
          ).toBeInTheDocument();
        },
        { timeout: 2000 },
      );

      const btnEnviarCorrecao = screen.getByTestId("botao-Salvar");
      expect(btnEnviarCorrecao).toBeDisabled();
      const btnCancelar = screen.getByTestId("botao-Cancelar");
      expect(btnCancelar).not.toBeDisabled();

      const messagem = "Minha justificativa para correção";
      const ckEditor = screen.getByTestId("ckeditor-mock");
      fireEvent.change(ckEditor, { target: { value: messagem } });
      await waitFor(() => {
        expect(ckEditor.value).toBe(messagem);
        expect(btnEnviarCorrecao).not.toBeDisabled();
      });

      fireEvent.click(btnEnviarCorrecao);
      await waitFor(() => {
        expect(toastSuccess).toHaveBeenCalledWith(
          "Solicitação de correção no Formulário de Ocorrências salva com sucesso!",
        );
      });
    });

    it("Sem Ocorrencia - Deve exibir erro se a chamada da API falhar ao solicitar correção", async () => {
      geraOcorrenciaParaCorrecao.mockResolvedValue({
        status: 500,
        data: { success: false },
      });

      const mockSemOcorrencia = {
        ...mockMedicaoAprovadaPelaDREComOcorrencia,
        com_ocorrencias: false,
        ocorrencia: null,
      };
      setupMocks();
      mock
        .onGet(
          `/medicao-inicial/solicitacao-medicao-inicial/${solicitacaoUuid}/`,
        )
        .reply(200, mockSemOcorrencia);

      await renderComponent();
      const btnSolicitarCor = await screen.findByRole("button", {
        name: /Solicitar correção no formulário/i,
      });
      fireEvent.click(btnSolicitarCor);

      await waitFor(
        () => {
          expect(screen.queryByText(/Carregando/i)).not.toBeInTheDocument();
          expect(
            screen.queryByText(
              /Informe quais os pontos necessários de correção no Formulário de Ocorrências/i,
            ),
          ).toBeInTheDocument();
        },
        { timeout: 2000 },
      );

      const btnEnviarCorrecao = screen.getByTestId("botao-Salvar");
      expect(btnEnviarCorrecao).toBeDisabled();
      const btnCancelar = screen.getByTestId("botao-Cancelar");
      expect(btnCancelar).not.toBeDisabled();

      const messagem = "Minha justificativa para correção";
      const ckEditor = screen.getByTestId("ckeditor-mock");
      fireEvent.change(ckEditor, { target: { value: messagem } });
      await waitFor(() => {
        expect(ckEditor.value).toBe(messagem);
        expect(btnEnviarCorrecao).not.toBeDisabled();
      });

      fireEvent.click(btnEnviarCorrecao);
      await waitFor(() => {
        expect(toastError).toHaveBeenCalledWith(
          "Houve um erro ao salvar correção no Formulário de Ocorrências!",
        );
      });
    });

    it("Deve permitir o download dos anexos da ocorrência em PDF e Excel", async () => {
      setupMocks();
      const pdfUrl =
        mockMedicaoAprovadaPelaDREComOcorrencia.ocorrencia.ultimo_arquivo;
      mock
        .onGet(pdfUrl)
        .reply(200, new Blob(["test"], { type: "application/pdf" }));
      const ExcelUrl =
        mockMedicaoAprovadaPelaDREComOcorrencia.ocorrencia.ultimo_arquivo_excel;
      mock.onGet(ExcelUrl).reply(
        200,
        new Blob(["test"], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
      );

      await renderComponent();

      const btnVisualizar = document.querySelector(".visualizar-ocorrencias");
      fireEvent.click(btnVisualizar);

      const btnDownloadGeral = document.querySelector(".download-ocorrencias");

      await act(async () => {
        fireEvent.click(btnDownloadGeral);
      });
      await waitFor(() => {
        expect(saveAs).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("Card APROVADO PELA CODAE", () => {
    const mockMedicaoAprovadaPelaCODAEComOcorrencia = {
      ...mockMedicaoAprovadaPelaDREComOcorrencia,
      status: "MEDICAO_APROVADA_PELA_CODAE",
      ocorrencia: mockOcorrenciaAprovadaPelaCODAE,
    };

    it("Deve carregar os dados de ocorrência para NUTRIMANIFESTACAO", async () => {
      setupMocks();
      mock
        .onGet(
          `/medicao-inicial/solicitacao-medicao-inicial/${solicitacaoUuid}/`,
        )
        .reply(200, mockMedicaoAprovadaPelaCODAEComOcorrencia);
      await renderComponent();

      await waitFor(() => {
        expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument();
        expect(screen.getByText(/Avaliação do Serviço:/i)).toBeInTheDocument();
        expect(screen.getByText(/COM OCORRÊNCIAS/i)).toBeInTheDocument();

        const aprovadroDre = document.querySelector(".status-ocorrencia");
        expect(aprovadroDre).toHaveTextContent(/Aprovado pela CODAE/i);

        const container = screen.getByTestId("texto-ocorrencia-com-data");
        const expectedText =
          "Solicitação de correção no Formulário de Ocorrências realizada em 04/02/2026 12:59:59";
        expect(container).toHaveTextContent(expectedText);
        const visualizar = document.querySelector(".visualizar-ocorrencias");
        expect(visualizar).toHaveTextContent(/VISUALIZAR/i);
      });
    });

    it("Deve renderizar os botões referentes a modal ocorrência ao clicar em VISUALIZAR", async () => {
      setupMocks();
      mock
        .onGet(
          `/medicao-inicial/solicitacao-medicao-inicial/${solicitacaoUuid}/`,
        )
        .reply(200, mockMedicaoAprovadaPelaCODAEComOcorrencia);
      await renderComponent();
      const btnExpandir = document.querySelector(".visualizar-ocorrencias");
      fireEvent.click(btnExpandir);

      const btnAprovarForm = screen.queryByRole("button", {
        name: /aprovar formulário/i,
      });
      expect(btnAprovarForm).not.toBeInTheDocument();

      const btnSolicitarCorrecaoForm = screen.queryByRole("button", {
        name: /solicitar correção no formulário/i,
      });
      expect(btnSolicitarCorrecaoForm).not.toBeInTheDocument();

      const btnHistorico = screen.getByTestId("botao-historico");
      expect(btnHistorico).toBeInTheDocument();
      expect(btnHistorico).not.toBeDisabled();
      expect(btnHistorico).toHaveTextContent(/histórico/i);

      const btnDownload = screen.getByText(/download de ocorrências/i);
      expect(btnDownload).not.toHaveClass("disabled");
    });

    it("Sem Ocorrencia - Só deve apercer o texto SEM OCORRÊNCIAS", async () => {
      const mockSemOcorrencia = {
        ...mockMedicaoAprovadaPelaCODAEComOcorrencia,
        com_ocorrencias: false,
        ocorrencia: null,
      };
      setupMocks();
      mock
        .onGet(
          `/medicao-inicial/solicitacao-medicao-inicial/${solicitacaoUuid}/`,
        )
        .reply(200, mockSemOcorrencia);
      await renderComponent();

      await waitFor(() => {
        expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument();
        expect(screen.getByText(/Avaliação do Serviço:/i)).toBeInTheDocument();
        expect(screen.getByText(/SEM OCORRÊNCIAS/i)).toBeInTheDocument();

        const aprovadoCodae = document.querySelector(".status-ocorrencia");
        expect(aprovadoCodae).toBeNull();

        const container = screen.getByTestId("texto-ocorrencia-com-data");
        const expectedText =
          "Solicitação de correção no Formulário de Ocorrências realizada em 04/02/2026 12:59:59";
        expect(container).not.toHaveTextContent(expectedText);

        const visualizar = document.querySelector(".visualizar-ocorrencias");
        expect(visualizar).toBeNull();
      });
    });

    it("Deve permitir o download dos anexos da ocorrência em PDF e Excel", async () => {
      setupMocks();
      const pdfUrl =
        mockMedicaoAprovadaPelaCODAEComOcorrencia.ocorrencia.ultimo_arquivo;
      mock
        .onGet(pdfUrl)
        .reply(200, new Blob(["test"], { type: "application/pdf" }));
      const ExcelUrl =
        mockMedicaoAprovadaPelaCODAEComOcorrencia.ocorrencia
          .ultimo_arquivo_excel;
      mock.onGet(ExcelUrl).reply(
        200,
        new Blob(["test"], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
      );

      await renderComponent();

      const btnVisualizar = document.querySelector(".visualizar-ocorrencias");
      fireEvent.click(btnVisualizar);

      const btnDownloadGeral = document.querySelector(".download-ocorrencias");

      await act(async () => {
        fireEvent.click(btnDownloadGeral);
      });
      await waitFor(() => {
        expect(saveAs).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("Card DEVOLVIDO PARA AJUSTES PELA CODAE", () => {
    const mockMedicaoDevolvidaParaAjustesPelaCODAEComOcorrencia = {
      ...mockMedicaoAprovadaPelaDREComOcorrencia,
      status: "MEDICAO_CORRECAO_SOLICITADA_CODAE",
      ocorrencia: mockOcorrenciaDevolvidoParaAjustesPelaCODAE,
    };

    it("Deve carregar os dados de ocorrência para NUTRIMANIFESTACAO", async () => {
      setupMocks();
      mock
        .onGet(
          `/medicao-inicial/solicitacao-medicao-inicial/${solicitacaoUuid}/`,
        )
        .reply(200, mockMedicaoDevolvidaParaAjustesPelaCODAEComOcorrencia);
      await renderComponent();

      await waitFor(() => {
        expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument();
        expect(screen.getByText(/Avaliação do Serviço:/i)).toBeInTheDocument();
        expect(screen.getByText(/COM OCORRÊNCIAS/i)).toBeInTheDocument();

        const aprovadroDre = document.querySelector(".status-ocorrencia");
        expect(aprovadroDre).toHaveTextContent(
          /Devolvido para ajustes pela CODAE/i,
        );

        const container = screen.getByTestId("texto-ocorrencia-com-data");
        const expectedText =
          "Solicitação de correção no Formulário de Ocorrências realizada em 06/02/2026 09:44:38";
        expect(container).toHaveTextContent(expectedText);
        const visualizar = document.querySelector(".visualizar-ocorrencias");
        expect(visualizar).toHaveTextContent(/VISUALIZAR/i);
      });
    });

    it("Deve renderizar os botões referentes a modal ocorrência ao clicar em VISUALIZAR", async () => {
      setupMocks();
      mock
        .onGet(
          `/medicao-inicial/solicitacao-medicao-inicial/${solicitacaoUuid}/`,
        )
        .reply(200, mockMedicaoDevolvidaParaAjustesPelaCODAEComOcorrencia);
      await renderComponent();
      const btnExpandir = document.querySelector(".visualizar-ocorrencias");
      fireEvent.click(btnExpandir);

      const btnAprovarForm = screen.queryByRole("button", {
        name: /aprovar formulário/i,
      });
      expect(btnAprovarForm).not.toBeInTheDocument();

      const btnSolicitarCorrecaoForm = screen.queryByRole("button", {
        name: /solicitar correção no formulário/i,
      });
      expect(btnSolicitarCorrecaoForm).not.toBeInTheDocument();

      const btnHistorico = screen.getByTestId("botao-historico");
      expect(btnHistorico).toBeInTheDocument();
      expect(btnHistorico).not.toBeDisabled();
      expect(btnHistorico).toHaveTextContent(/histórico/i);

      const btnDownload = screen.getByText(/download de ocorrências/i);
      expect(btnDownload).not.toHaveClass("disabled");
    });

    it("Sem Ocorrencia - Só deve apercer o texto SEM OCORRÊNCIAS", async () => {
      const mockSemOcorrencia = {
        ...mockMedicaoDevolvidaParaAjustesPelaCODAEComOcorrencia,
        com_ocorrencias: false,
        ocorrencia: null,
      };
      setupMocks();
      mock
        .onGet(
          `/medicao-inicial/solicitacao-medicao-inicial/${solicitacaoUuid}/`,
        )
        .reply(200, mockSemOcorrencia);
      await renderComponent();

      await waitFor(() => {
        expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument();
        expect(screen.getByText(/Avaliação do Serviço:/i)).toBeInTheDocument();
        expect(screen.getByText(/SEM OCORRÊNCIAS/i)).toBeInTheDocument();

        const aprovadoCodae = document.querySelector(".status-ocorrencia");
        expect(aprovadoCodae).toBeNull();

        const container = screen.getByTestId("texto-ocorrencia-com-data");
        const expectedText =
          "Solicitação de correção no Formulário de Ocorrências realizada em 04/02/2026 12:59:59";
        expect(container).not.toHaveTextContent(expectedText);

        const visualizar = document.querySelector(".visualizar-ocorrencias");
        expect(visualizar).toBeNull();
      });
    });

    it("Deve permitir o download dos anexos da ocorrência em PDF e Excel", async () => {
      setupMocks();
      const pdfUrl =
        mockMedicaoDevolvidaParaAjustesPelaCODAEComOcorrencia.ocorrencia
          .ultimo_arquivo;
      mock
        .onGet(pdfUrl)
        .reply(200, new Blob(["test"], { type: "application/pdf" }));
      const ExcelUrl =
        mockMedicaoDevolvidaParaAjustesPelaCODAEComOcorrencia.ocorrencia
          .ultimo_arquivo_excel;
      mock.onGet(ExcelUrl).reply(
        200,
        new Blob(["test"], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
      );

      await renderComponent();

      const btnVisualizar = document.querySelector(".visualizar-ocorrencias");
      fireEvent.click(btnVisualizar);

      const btnDownloadGeral = document.querySelector(".download-ocorrencias");

      await act(async () => {
        fireEvent.click(btnDownloadGeral);
      });
      await waitFor(() => {
        expect(saveAs).toHaveBeenCalledTimes(2);
      });
    });
  });
});
