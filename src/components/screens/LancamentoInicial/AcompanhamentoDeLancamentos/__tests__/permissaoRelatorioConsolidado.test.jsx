import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL, TIPO_PERFIL, TIPO_SERVICO } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockDiretoriaRegionalSimplissima } from "src/mocks/diretoriaRegional.service/mockDiretoriaRegionalSimplissima";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosSuperUsuarioMedicao } from "src/mocks/meusDados/superUsuarioMedicao";
import { mockGetTiposUnidadeEscolar } from "src/mocks/services/cadastroTipoAlimentacao.service/mockGetTiposUnidadeEscolar";
import { mockGetEscolaTercTotal } from "src/mocks/services/escola.service/mockGetEscolasTercTotal";
import { mockGetLotesSimples } from "src/mocks/services/lote.service/mockGetLotesSimples";
import { mockGetDashboardMedicaoInicialAprovadas } from "src/mocks/services/medicaoInicial/dashboard.service/mockGetDashboardMedicaoInicial";
import { mockGetMesesAnosSolicitacoesMedicaoinicialAprovadas } from "src/mocks/services/medicaoInicial/dashboard.service/mockGetMesesAnosSolicitacoesMedicaoinicial";
import mock from "src/services/_mock";
import { AcompanhamentoDeLancamentos } from "../index";

const selecionarDRE = async () => {
  await act(async () => {
    fireEvent.mouseDown(
      screen
        .getByTestId("select-diretoria-regional")
        .querySelector(".ant-select-selection-search-input"),
    );
  });

  await waitFor(() => screen.getByText("IPIRANGA"));
  await act(async () => {
    fireEvent.click(screen.getByText("IPIRANGA"));
  });
};

const setMesReferencia = () => {
  const divMesReferencia = screen.getByTestId("div-select-mes-referencia");
  const selectMesReferencia = divMesReferencia.querySelector("select");
  fireEvent.change(selectMesReferencia, {
    target: { value: "03_2025" },
  });
  return selectMesReferencia;
};

const setup = async (config = {}) => {
  const { tipo_perfil = null, perfil = null, tipo_servico = null } = config;

  Object.defineProperty(global, "localStorage", { value: localStorageMock });

  localStorageMock.clear();

  if (tipo_perfil) localStorage.setItem("tipo_perfil", tipo_perfil);
  if (perfil) localStorage.setItem("perfil", perfil);
  if (tipo_servico) localStorage.setItem("tipo_servico", tipo_servico);

  await act(async () => {
    render(
      <MemoryRouter>
        <MeusDadosContext.Provider
          value={{ meusDados: mockMeusDadosSuperUsuarioMedicao }}
        >
          <AcompanhamentoDeLancamentos />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

describe("Permissão Relatório Consolidado no módulo de Medição", () => {
  beforeEach(async () => {
    localStorageMock.clear();
    mock
      .onGet("/diretorias-regionais-simplissima/")
      .reply(200, mockDiretoriaRegionalSimplissima);
    mock
      .onGet("/tipos-unidade-escolar/")
      .reply(200, mockGetTiposUnidadeEscolar);
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/meses-anos/")
      .reply(200, mockGetMesesAnosSolicitacoesMedicaoinicialAprovadas);
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosSuperUsuarioMedicao);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/dashboard-totalizadores/",
      )
      .reply(200, mockGetDashboardMedicaoInicialAprovadas);
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
            },
          ],
        },
      });
    mock
      .onGet("/escolas-simplissima-com-dre-unpaginated/terc-total/")
      .reply(200, mockGetEscolaTercTotal);
    mock.onGet("/lotes-simples/").reply(200, mockGetLotesSimples);
  });

  afterEach(() => {
    mock.reset();
    cleanup();
    localStorageMock.clear();
  });

  describe("Usuarios com acesso", () => {
    it("Tipo Perfil MEDICAO", async () => {
      await setup({ tipo_perfil: TIPO_PERFIL.MEDICAO });
      await selecionarDRE();
      const statusCard = screen.getByTestId("MEDICAO_APROVADA_PELA_CODAE");
      fireEvent.click(statusCard);
      setMesReferencia();

      const botaoFiltrar = screen.getByText("Filtrar");
      await act(async () => {
        fireEvent.click(botaoFiltrar);
      });

      const botaoRelatorio = screen.getByText("Relatório Consolidado");
      expect(botaoRelatorio).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(botaoRelatorio);
      });
    });

    it("Tipo Perfil GESTAO_ALIMENTACAO_TERCEIRIZADA", async () => {
      await setup({ tipo_perfil: TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA });
      await selecionarDRE();
      const statusCard = screen.getByTestId("MEDICAO_APROVADA_PELA_CODAE");
      fireEvent.click(statusCard);
      setMesReferencia();

      const botaoFiltrar = screen.getByText("Filtrar");
      await act(async () => {
        fireEvent.click(botaoFiltrar);
      });

      const botaoRelatorio = screen.getByText("Relatório Consolidado");
      expect(botaoRelatorio).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(botaoRelatorio);
      });
    });

    it("Perfil ADMINISTRADOR_EMPRESA", async () => {
      await setup({
        perfil: PERFIL.ADMINISTRADOR_EMPRESA,
        tipo_servico: TIPO_SERVICO.TERCEIRIZADA,
      });
      await selecionarDRE();
      const statusCard = screen.getByTestId("MEDICAO_APROVADA_PELA_CODAE");
      fireEvent.click(statusCard);
      setMesReferencia();

      const botaoFiltrar = screen.getByText("Filtrar");
      await act(async () => {
        fireEvent.click(botaoFiltrar);
      });

      const botaoRelatorio = screen.getByText("Relatório Consolidado");
      expect(botaoRelatorio).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(botaoRelatorio);
      });
    });

    it("Tipo Perfil NUTRICAO_MANIFESTACAO", async () => {
      await setup({ tipo_perfil: TIPO_PERFIL.NUTRICAO_MANIFESTACAO });
      await selecionarDRE();
      const statusCard = screen.getByTestId("MEDICAO_APROVADA_PELA_CODAE");
      fireEvent.click(statusCard);
      setMesReferencia();

      const botaoFiltrar = screen.getByText("Filtrar");
      await act(async () => {
        fireEvent.click(botaoFiltrar);
      });

      const botaoRelatorio = screen.getByText("Relatório Consolidado");
      expect(botaoRelatorio).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(botaoRelatorio);
      });
    });

    it("Perfil DINUTRE_DIRETORIA", async () => {
      await setup({ perfil: PERFIL.DINUTRE_DIRETORIA });
      await selecionarDRE();
      const statusCard = screen.getByTestId("MEDICAO_APROVADA_PELA_CODAE");
      fireEvent.click(statusCard);
      setMesReferencia();

      const botaoFiltrar = screen.getByText("Filtrar");
      await act(async () => {
        fireEvent.click(botaoFiltrar);
      });

      const botaoRelatorio = screen.getByText("Relatório Consolidado");
      expect(botaoRelatorio).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(botaoRelatorio);
      });
    });

    it("Perfil ADMINISTRADOR_CODAE_GABINETE", async () => {
      await setup({ perfil: PERFIL.ADMINISTRADOR_CODAE_GABINETE });
      await selecionarDRE();
      const statusCard = screen.getByTestId("MEDICAO_APROVADA_PELA_CODAE");
      fireEvent.click(statusCard);
      setMesReferencia();

      const botaoFiltrar = screen.getByText("Filtrar");
      await act(async () => {
        fireEvent.click(botaoFiltrar);
      });

      const botaoRelatorio = screen.getByText("Relatório Consolidado");
      expect(botaoRelatorio).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(botaoRelatorio);
      });
    });
  });

  describe("Usuarios sem acesso", () => {
    it("Perfil USUARIO_EMPRESA", async () => {
      await setup({
        perfil: PERFIL.USUARIO_EMPRESA,
        tipo_servico: TIPO_SERVICO.TERCEIRIZADA,
      });
      await selecionarDRE();
      const statusCard = screen.getByTestId("MEDICAO_APROVADA_PELA_CODAE");
      fireEvent.click(statusCard);
      setMesReferencia();

      const botaoFiltrar = screen.getByText("Filtrar");
      await act(async () => {
        fireEvent.click(botaoFiltrar);
      });

      const botaoRelatorio = screen.queryByText("Relatório Consolidado");
      expect(botaoRelatorio).not.toBeInTheDocument();
    });
  });
});
