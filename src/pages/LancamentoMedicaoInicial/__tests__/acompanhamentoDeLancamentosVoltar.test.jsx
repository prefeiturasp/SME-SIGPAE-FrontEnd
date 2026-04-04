import "@testing-library/jest-dom";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockMeusDadosCogestor } from "src/mocks/meusDados/cogestor";
import { mockGetTiposUnidadeEscolar } from "src/mocks/services/cadastroTipoAlimentacao.service/mockGetTiposUnidadeEscolar";
import { mockGetDashboardMedicaoInicial } from "src/mocks/services/dashboard.service/mockGetDashboardMedicaoInicial";
import { mockGetMesesAnosMedicaoInicial } from "src/mocks/services/dashboard.service/mockGetMesesAnosMedicaoInicial";
import { mockGetDiretoriaRegionalSimplissima } from "src/mocks/services/diretoriaRegional.service/mockGetDiretoriaRegionalSimplissima";
import { mockGetEscolaTercTotal } from "src/mocks/services/escola.service/mockGetEscolasTercTotal";
import {
  mockGetGrupoUnidadeEscolar,
  mockGetGrupoUnidadeEscolarPorDRE,
} from "src/mocks/services/escola.service/mockGetGrupoUnidadeEscolar";
import { AcompanhamentoDeLancamentosPage } from "src/pages/LancamentoMedicaoInicial/AcompanhamentoDeLancamentosPage";
import mock from "src/services/_mock";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Medição Inicial - Retorno da Conferência para Acompanhamento", () => {
  const urlAcompanhamento =
    "/medicao-inicial/acompanhamento-de-lancamentos?mes_ano=09_2023&recreio_nas_ferias=recreio-uuid&status=MEDICAO_APROVADA_PELA_DRE&tipo_unidade=tipo-ue-uuid&ocorrencias=true";
  const mockGetMesesAnosMedicaoInicialComRecreio = {
    results: [
      {
        mes: "09",
        ano: "2023",
        status: ["MEDICAO_APROVADA_PELA_DRE", "MEDICAO_CORRIGIDA_PELA_UE"],
        recreio_nas_ferias: {
          uuid: "recreio-uuid",
          titulo: "Recreio nas Férias - SET 2023",
        },
      },
      ...mockGetMesesAnosMedicaoInicial.results,
    ],
  };

  const configurarMocks = () => {
    mock.reset();
    mockNavigate.mockClear();

    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/meses-anos/")
      .reply(200, mockGetMesesAnosMedicaoInicialComRecreio);
    mock
      .onGet("/diretorias-regionais-simplissima/")
      .reply(200, mockGetDiretoriaRegionalSimplissima);
    mock
      .onGet("/tipos-unidade-escolar/")
      .reply(200, mockGetTiposUnidadeEscolar);
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
    mock.onGet("/notificacoes/").reply(200, { results: [] });
    mock.onGet("/notificacoes/quantidade-nao-lidos/").reply(200, {
      quantidade_nao_lidos: 0,
    });
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimples);
    mock
      .onGet("/escolas-simplissima-com-dre-unpaginated/terc-total/")
      .reply(200, mockGetEscolaTercTotal);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/dashboard-totalizadores/",
      )
      .reply(200, mockGetDashboardMedicaoInicial);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/dashboard-resultados/",
      )
      .reply(200, {
        results: {
          total: 1,
          dados: [
            {
              uuid: "cc078b30-09e2-43ca-a3bc-657d5529897f",
              escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
              escola_uuid: "3c32be8e-f191-468d-a4e2-3dd8751e5e7a",
              mes: "09",
              ano: "2023",
              mes_ano: "Setembro 2023",
              tipo_unidade: "EMEF",
              status: "Aprovado pela DRE",
              log_mais_recente: "14/12/2023 09:58",
              dre_ciencia_correcao_data: null,
              todas_medicoes_e_ocorrencia_aprovados_por_medicao: false,
              escola_cei_com_inclusao_parcial_autorizada: false,
              sem_lancamentos: false,
              recreio_nas_ferias: {
                uuid: "recreio-uuid",
                titulo: "Recreio nas Férias - SET 2023",
              },
            },
          ],
        },
      });

    mock
      .onGet("/grupos-unidade-escolar/")
      .reply(200, mockGetGrupoUnidadeEscolar);
    mock
      .onGet("/grupos-unidade-escolar/por-dre/")
      .reply(200, mockGetGrupoUnidadeEscolarPorDRE);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);
    localStorage.setItem("perfil", PERFIL.COGESTOR_DRE);
  };

  const renderPage = async (url = urlAcompanhamento) => {
    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[url]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AcompanhamentoDeLancamentosPage />
        </MemoryRouter>,
      );
    });
  };

  beforeEach(() => {
    configurarMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("envia a URL atual de acompanhamento no state ao abrir a conferência", async () => {
    await renderPage();

    await waitFor(() => {
      expect(screen.getByText("Resultados")).toBeInTheDocument();
    });

    const linhaResultado = screen
      .getByText("EMEF PERICLES EUGENIO DA SILVA RAMOS")
      .closest("tr");

    const botoesAcao = within(linhaResultado).getAllByRole("button");

    await act(async () => {
      fireEvent.click(botoesAcao[0]);
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      {
        pathname: "/medicao-inicial/conferencia-dos-lancamentos",
        search:
          "uuid=cc078b30-09e2-43ca-a3bc-657d5529897f&recreio_nas_ferias=recreio-uuid",
      },
      {
        state: {
          escolaUuid: "3c32be8e-f191-468d-a4e2-3dd8751e5e7a",
          mes: "09",
          ano: "2023",
          voltarPara: urlAcompanhamento,
        },
      },
    );
  });

  it("reconstroi o mês de referência e carrega os resultados quando a URL volta apenas com recreio_nas_ferias", async () => {
    await renderPage(
      "/medicao-inicial/acompanhamento-de-lancamentos?recreio_nas_ferias=recreio-uuid&status=MEDICAO_APROVADA_PELA_DRE&lotes=lote-1",
    );

    await waitFor(() => {
      expect(screen.getByText("Resultados")).toBeInTheDocument();
    });

    const selectMesReferencia = screen
      .getByTestId("div-select-mes-referencia")
      .querySelector("select");
    expect(selectMesReferencia).toHaveValue("09_2023|recreio-uuid");

    expect(
      screen.getByText("EMEF PERICLES EUGENIO DA SILVA RAMOS"),
    ).toBeInTheDocument();
  });
});
