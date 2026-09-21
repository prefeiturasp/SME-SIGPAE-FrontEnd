import React from "react";
import "@testing-library/jest-dom";
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosDilogQualidade } from "src/mocks/meusDados/dilog-qualidade";
import RelatorioCronogramaSemanalPage from "src/pages/PreRecebimento/Relatorios/RelatorioCronogramaSemanalPage";
import {
  mockListagemRelatorioCronogramasSemanais,
  mockListagemRelatorioCronogramasSemanaisVazia,
} from "src/mocks/services/cronogramaSemanal.service";
import { mockTerceirizadasEmpresasCronomagramas } from "src/mocks/cronograma.service/mockGetListaTerceirizadasEmpresasCronomagramas";
import { mockCadProdEditalCompletaLog } from "src/mocks/cronograma.service/mockGetListaCadProdEditalCompletaLog";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import {
  getNotificacoes,
  getQtdNaoLidas,
} from "src/services/notificacoes.service";
import { mockGetNotificacoes } from "src/mocks/services/notificacoes.service/mockGetNotificacoes";
import { mockGetQtdNaoLidas } from "src/mocks/services/notificacoes.service/mockGetQtdNaoLidas";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";

jest.mock("src/components/Shareable/Toast/dialogs");
jest.mock("src/services/notificacoes.service");

const URL_LISTAGEM = "/cronogramas-semanais/listagem-relatorio/";
const URL_EMPRESAS = "/terceirizadas/lista-empresas-cronograma/";
const URL_PRODUTOS = "/cadastro-produtos-edital/lista-completa-logistica/";
const URL_EXCEL = "/cronogramas-semanais/gerar-relatorio-xlsx-async/";

const setup = async () => {
  await act(async () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <MeusDadosContext.Provider
          value={{
            meusDados: mockMeusDadosDilogQualidade,
            setMeusDados: jest.fn(),
          }}
        >
          <RelatorioCronogramaSemanalPage />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

const clicarFiltrar = async () => {
  await act(async () => {
    fireEvent.click(screen.getByTestId("botao-filtrar"));
  });
};

const chamadasListagem = () =>
  mock.history.get.filter((c) => c.url === URL_LISTAGEM);

const paramsListagem = () => chamadasListagem()[0]?.params as URLSearchParams;

const chamadasExcel = () => mock.history.get.filter((c) => c.url === URL_EXCEL);

const paramsExcel = () => chamadasExcel()[0]?.params as URLSearchParams;

describe("RelatorioCronogramaSemanalPage", () => {
  beforeEach(() => {
    mock.reset();
    jest.clearAllMocks();

    localStorage.setItem("perfil", PERFIL.DILOG_QUALIDADE);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.PRE_RECEBIMENTO);
    // Evita que o Page.jsx busque "meus dados" via API durante o teste.
    localStorage.setItem(
      "meusDados",
      JSON.stringify(mockMeusDadosDilogQualidade),
    );

    (getNotificacoes as jest.Mock).mockResolvedValue({
      data: mockGetNotificacoes,
      status: 200,
    });
    (getQtdNaoLidas as jest.Mock).mockResolvedValue({
      data: mockGetQtdNaoLidas,
      status: 200,
    });

    // Opções dos filtros (empresa/produto) são carregadas ao montar o Filtros.
    mock.onGet(URL_EMPRESAS).reply(200, mockTerceirizadasEmpresasCronomagramas);
    mock.onGet(URL_PRODUTOS).reply(200, mockCadProdEditalCompletaLog);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("Filtros", () => {
    it("apresenta os campos de filtro com labels e placeholders corretos", async () => {
      await setup();
      await screen.findByText("Filtrar por Empresa");

      expect(screen.getByText("Filtrar por Produto")).toBeInTheDocument();
      expect(screen.getByText("Nº do Cronograma Mensal")).toBeInTheDocument();
      expect(screen.getByText("Nº do Cronograma Semanal")).toBeInTheDocument();
      expect(screen.getByText("Filtrar por Status")).toBeInTheDocument();
      expect(
        screen.getByText("Filtrar por Mês de Entrega"),
      ).toBeInTheDocument();

      expect(
        screen.getByPlaceholderText("Digite o nº do Cronograma Mensal"),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Digite o nº do Cronograma Semanal"),
      ).toBeInTheDocument();

      expect(
        screen.getByText("Selecione uma ou mais Empresas"),
      ).toBeInTheDocument();

      expect(screen.getByPlaceholderText("De")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Até")).toBeInTheDocument();
    });

    it("não realiza a busca ao carregar a tela (somente ao aplicar o filtro)", async () => {
      await setup();
      await screen.findByText("Filtrar por Empresa");

      expect(chamadasListagem()).toHaveLength(0);
      expect(
        screen.queryByText("Nenhum resultado encontrado"),
      ).not.toBeInTheDocument();
    });

    it("lista as empresas disponíveis para seleção", async () => {
      await setup();
      await screen.findByText("Filtrar por Empresa");

      await act(async () => {
        fireEvent.click(screen.getByText("Selecione uma ou mais Empresas"));
      });

      expect(await screen.findByText("PETISTICO PET LTDA")).toBeInTheDocument();
    });

    it("disponibiliza as opções de status", async () => {
      await setup();
      await screen.findByText("Filtrar por Status");

      await act(async () => {
        fireEvent.click(screen.getByText("Selecione"));
      });

      expect(await screen.findByText("Rascunho")).toBeInTheDocument();
      expect(screen.getByText("Enviado ao Fornecedor")).toBeInTheDocument();
      expect(screen.getByText("Fornecedor Ciente")).toBeInTheDocument();
    });

    it("aplica o filtro por Nº do Cronograma Semanal", async () => {
      mock
        .onGet(URL_LISTAGEM)
        .reply(200, mockListagemRelatorioCronogramasSemanais);

      await setup();
      await screen.findByText("Filtrar por Empresa");

      fireEvent.change(
        screen.getByPlaceholderText("Digite o nº do Cronograma Semanal"),
        { target: { value: "135/2024" } },
      );
      await clicarFiltrar();

      await waitFor(() => expect(chamadasListagem().length).toBeGreaterThan(0));
      expect(paramsListagem().get("numero_cronograma_semanal")).toBe(
        "135/2024",
      );
    });

    it("realiza nova busca ao limpar os filtros", async () => {
      mock
        .onGet(URL_LISTAGEM)
        .reply(200, mockListagemRelatorioCronogramasSemanais);

      await setup();
      await screen.findByText("Filtrar por Empresa");
      await clicarFiltrar();
      await screen.findByText("Empresa Alfa Alimentos LTDA");

      const antes = chamadasListagem().length;

      await act(async () => {
        fireEvent.click(screen.getByText("Limpar Filtros"));
      });

      await waitFor(() =>
        expect(chamadasListagem().length).toBeGreaterThan(antes),
      );
    });
  });

  describe("Listagem", () => {
    it("renderiza as linhas com os dados formatados após filtrar", async () => {
      mock
        .onGet(URL_LISTAGEM)
        .reply(200, mockListagemRelatorioCronogramasSemanais);

      await setup();
      await screen.findByText("Filtrar por Empresa");
      await clicarFiltrar();

      expect(
        await screen.findByText("Empresa Alfa Alimentos LTDA"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Empresa Beta Comercio LTDA"),
      ).toBeInTheDocument();

      // Produto com mais de 30 caracteres é truncado.
      expect(
        screen.getByText("Arroz Parboilizado Tipo 1 Long..."),
      ).toBeInTheDocument();

      // Quantidade formatada em milhar + unidade de medida.
      expect(screen.getByText("1.500,00 KG")).toBeInTheDocument();
      expect(screen.getByText("800,00 KG")).toBeInTheDocument();

      expect(screen.getByText("Assinado Fornecedor")).toBeInTheDocument();
      expect(screen.getByText("Enviado ao Fornecedor")).toBeInTheDocument();
    });

    it("expande apenas a linha selecionada, mesmo com número repetido", async () => {
      mock
        .onGet(URL_LISTAGEM)
        .reply(200, mockListagemRelatorioCronogramasSemanais);

      await setup();
      await screen.findByText("Filtrar por Empresa");
      await clicarFiltrar();
      await screen.findByText("Empresa Alfa Alimentos LTDA");

      const icones = screen.getAllByTestId("icone-expandir");
      expect(icones).toHaveLength(2);

      await act(async () => {
        fireEvent.click(icones[0]);
      });

      // Custo da 1ª linha aparece; o da 2ª (mesmo número) não.
      expect(await screen.findByText("R$ 12,50")).toBeInTheDocument();
      expect(screen.queryByText("R$ 9,00")).not.toBeInTheDocument();
    });

    it("exibe as programações do cronograma expandido", async () => {
      mock
        .onGet(URL_LISTAGEM)
        .reply(200, mockListagemRelatorioCronogramasSemanais);

      await setup();
      await screen.findByText("Filtrar por Empresa");
      await clicarFiltrar();
      await screen.findByText("Empresa Alfa Alimentos LTDA");

      await act(async () => {
        fireEvent.click(screen.getAllByTestId("icone-expandir")[0]);
      });
      await screen.findByText("R$ 12,50");

      expect(screen.getByText("Quantidade de Entrega")).toBeInTheDocument();
      expect(
        screen.getByText("Período Programado Inicial"),
      ).toBeInTheDocument();
      expect(screen.getByText("Período Programado Final")).toBeInTheDocument();

      expect(screen.getByText("01/01/2025")).toBeInTheDocument();
      expect(screen.getByText("07/01/2025")).toBeInTheDocument();
      expect(screen.getByText("500,00 KG")).toBeInTheDocument();
      expect(screen.getByText("1.000,00 KG")).toBeInTheDocument();

      // Programação da 2ª linha não é exibida (não está expandida).
      expect(screen.queryByText("02/02/2025")).not.toBeInTheDocument();
    });

    it("exibe 'Nenhum resultado encontrado' quando a lista vem vazia", async () => {
      mock
        .onGet(URL_LISTAGEM)
        .reply(200, mockListagemRelatorioCronogramasSemanaisVazia);

      await setup();
      await screen.findByText("Filtrar por Empresa");
      await clicarFiltrar();

      expect(
        await screen.findByText("Nenhum resultado encontrado"),
      ).toBeInTheDocument();
    });

    it("exibe toast de erro e não renderiza a listagem quando a requisição falha", async () => {
      mock.onGet(URL_LISTAGEM).reply(500);

      await setup();
      await screen.findByText("Filtrar por Empresa");
      await clicarFiltrar();

      await waitFor(() => expect(toastError).toHaveBeenCalled());
      expect(screen.queryByTestId("icone-expandir")).not.toBeInTheDocument();
    });

    it("trata resposta 200 sem 'results' sem quebrar a tela", async () => {
      // Backend responde 200 com corpo incorreto (sem results/count).
      mock.onGet(URL_LISTAGEM).reply(200, { count: 5 });

      await setup();
      await screen.findByText("Filtrar por Empresa");
      await clicarFiltrar();

      expect(
        await screen.findByText("Nenhum resultado encontrado"),
      ).toBeInTheDocument();
      expect(toastError).not.toHaveBeenCalled();
    });
  });

  describe("Exportação em Excel", () => {
    const filtrarComResultados = async () => {
      mock
        .onGet(URL_LISTAGEM)
        .reply(200, mockListagemRelatorioCronogramasSemanais);

      await setup();
      await screen.findByText("Filtrar por Empresa");

      fireEvent.change(
        screen.getByPlaceholderText("Digite o nº do Cronograma Semanal"),
        { target: { value: "135/2024" } },
      );
      await clicarFiltrar();
      await screen.findByText("Empresa Alfa Alimentos LTDA");
    };

    it("chama o serviço de exportação com os filtros aplicados e abre o modal da Central de Downloads", async () => {
      mock.onGet(URL_EXCEL).reply(200, { status: 200 });

      await filtrarComResultados();

      await act(async () => {
        fireEvent.click(screen.getByText("Baixar em Excel"));
      });

      await waitFor(() => expect(chamadasExcel().length).toBeGreaterThan(0));
      expect(paramsExcel().get("numero_cronograma_semanal")).toBe("135/2024");
      expect(paramsExcel().has("page")).toBe(false);

      expect(
        await screen.findByText("Geração solicitada com sucesso."),
      ).toBeInTheDocument();
    });

    it("exibe toast de erro quando a exportação falha", async () => {
      mock.onGet(URL_EXCEL).reply(500);

      await filtrarComResultados();

      await act(async () => {
        fireEvent.click(screen.getByText("Baixar em Excel"));
      });

      await waitFor(() =>
        expect(toastError).toHaveBeenCalledWith(
          "Erro ao exportar Excel. Tente novamente mais tarde.",
        ),
      );
      expect(
        screen.queryByText("Geração solicitada com sucesso."),
      ).not.toBeInTheDocument();
    });
  });
});
