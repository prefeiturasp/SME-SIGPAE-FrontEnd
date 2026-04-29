import "@testing-library/jest-dom";
import {
  act,
  cleanup,
  fireEvent,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockGetClassificacaoDieta } from "src/mocks/services/dietaEspecial.service/mockGetClassificacoesDietas";
import { mockMeusDadosDRE } from "src/mocks/meusDados/diretoria_regional";
import RelatorioQuantitativoClassificacaoDietaEsp from "src/components/screens/DietaEspecial/RelatorioQuantitativoClassificacaoDietaEsp";
import mock from "src/services/_mock";
import { renderWithProvider } from "src/utils/test-utils";
import preview from "jest-preview";

jest.mock(
  "src/components/Shareable/FinalForm/MultiSelect",
  () =>
    ({ label, options, input }) => {
      const normalizedOptions = options.map((opt) => ({
        value: opt.value ?? opt.id,
        label: opt.label ?? opt.nome,
      }));

      return (
        <div>
          <label>{label}</label>
          <select
            data-testid={`multiselect-${label}`}
            value={input?.value?.[0] ?? ""} // 🔥 ESSENCIAL
            onChange={(e) => input?.onChange?.([e.target.value])}
          >
            {normalizedOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );
    },
);

jest.mock("src/services/relatorios", () => ({
  imprimeRelatorioQuantitativoClassificacaoDietaEsp: jest.fn(),
}));

const selectDRE = (dreUuid) => {
  const selectDRE = screen.getByTestId(
    "multiselect-Diretoria Regional de Educação",
  );
  fireEvent.change(selectDRE, {
    target: { value: dreUuid },
  });
};

const selectEscola = (escolaUuid) => {
  const selectEscola = screen.getByTestId("multiselect-Unidade Escolar");
  fireEvent.change(selectEscola, {
    target: { value: escolaUuid },
  });
};

const preencherData = (placeholder, value) => {
  const input = screen.getByPlaceholderText(placeholder);
  fireEvent.change(input, { target: { value } });
  fireEvent.blur(input);
};

const preencherPeriodo = (
  dataInicial = "01/03/2026",
  dataFinal = "29/04/2026",
) => {
  preencherData("De", dataInicial);
  preencherData("Até", dataFinal);
};

const selectClassificacaoDieta = async (value = "5") => {
  const selectClassificacao = screen.getByTestId("multiselect-Classificação");
  fireEvent.change(selectClassificacao, { target: { value: value } });
  await waitFor(() => {
    expect(selectClassificacao.value).toBe(value);
  });
};

const selectStatus = async (value = "ativas") => {
  const selectWrapper = screen.getByTestId("select-status");
  const selectStatus = selectWrapper.querySelector("select");
  fireEvent.change(selectStatus, {
    target: { value: value },
  });

  await waitFor(() => {
    expect(selectStatus.value).toBe(value);
  });
};

describe("Testa Relatório Quantitativo por Classificação da Dieta Especia", () => {
  const escolaUuid =
    mockMeusDadosEscolaEMEFPericles.vinculo_atual.instituicao.uuid;
  const dreUuid =
    mockMeusDadosEscolaEMEFPericles.vinculo_atual.instituicao.diretoria_regional
      .uuid;

  describe("Visão DIRETOR - ESCOLA", () => {
    afterEach(() => {
      mock.reset();
      mock.resetHistory();
      cleanup();
    });
    beforeEach(async () => {
      mock
        .onGet("/usuarios/meus-dados/")
        .reply(200, mockMeusDadosEscolaEMEFPericles);
      mock
        .onGet(`/classificacoes-dieta/`)
        .reply(200, mockGetClassificacaoDieta);

      Object.defineProperty(global, "localStorage", {
        value: localStorageMock,
      });
      localStorage.setItem(
        "nome_instituicao",
        `"EMEF PERICLES EUGENIO DA SILVA RAMOS"`,
      );
      localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
      localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
      localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);

      await act(async () => {
        renderWithProvider(
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
              <ToastContainer />
              <RelatorioQuantitativoClassificacaoDietaEsp />
            </MeusDadosContext.Provider>
          </MemoryRouter>,
        );
      });
    });

    it("renderiza dados iniciais", () => {
      preview.debug();
      expect(
        screen.getByText(/Diretoria Regional de Educação/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/IPIRANGA/i)).toBeInTheDocument();
      expect(screen.getByText(/Unidade Escolar/i)).toBeInTheDocument();
      expect(
        screen.getByText(/EMEF PERICLES EUGENIO DA SILVA RAMOS/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Classificação/i)).toBeInTheDocument();
      expect(screen.getByText(/Status/i)).toBeInTheDocument();
      expect(screen.getByText(/Data da solicitação/i)).toBeInTheDocument();
      expect(screen.getByText(/Limpar Filtros/i)).toBeInTheDocument();
      expect(screen.getByText(/Consultar/i)).toBeInTheDocument();
    });

    it("deve consultar relatório quantitativo com todos os filtros preenchidos", async () => {
      selectDRE(dreUuid);
      selectEscola(escolaUuid);
      selectClassificacaoDieta();
      selectStatus();
      preencherPeriodo();

      mock
        .onPost(
          "/solicitacoes-dieta-especial/relatorio-quantitativo-classificacao-dieta-esp/",
        )
        .reply(200, {
          count: 1,
          results: [
            {
              dre: "IPIRANGA",
              escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
              classificacao: "Tipo A",
              qtde_ativas: 4,
              qtde_pendentes: 0,
              qtde_inativas: 0,
            },
          ],
        });

      const botaoConsultar = screen.getByText(/Consultar/i);

      await act(async () => {
        fireEvent.click(botaoConsultar);
      });

      await waitFor(() => {
        expect(
          screen.getByText(/Veja os resultados para a busca/i),
        ).toBeInTheDocument();
        expect(screen.getByText("4")).toBeInTheDocument();
      });
    });

    it("deve exibir mensagem quando não houver resultados", async () => {
      selectDRE(dreUuid);
      selectEscola(escolaUuid);
      preencherPeriodo();
      mock.onPost(/relatorio-quantitativo-classificacao-dieta-esp/).reply(200, {
        count: 0,
        results: [],
      });

      fireEvent.click(screen.getByText(/Consultar/i));
      await waitFor(() => {
        expect(
          screen.getByText(
            /Não foi encontrado dieta especial para filtragem realizada/i,
          ),
        ).toBeInTheDocument();
      });
    });

    it("deve limpar os filtros ao clicar em Limpar Filtros", async () => {
      await selectClassificacaoDieta();
      const selectClassificacao = screen.getByTestId(
        "multiselect-Classificação",
      );
      fireEvent.click(screen.getByText(/Limpar Filtros/i));
      await waitFor(() => {
        expect(selectClassificacao.value).toBe("1");
      });
    });

    it("deve enviar payload correto na requisição", async () => {
      selectDRE(dreUuid);
      selectEscola(escolaUuid);
      await selectClassificacaoDieta("7");
      await selectStatus("inativas");
      preencherPeriodo("04/05/2025", "28/03/2026");
      mock
        .onPost(
          "/solicitacoes-dieta-especial/relatorio-quantitativo-classificacao-dieta-esp/",
        )
        .reply((config) => {
          const payload = JSON.parse(config.data);

          expect(payload.classificacao).toEqual(["7"]);
          expect(payload.status).toBe("inativas");
          expect(payload.data_inicial).toBe("04/05/2025");
          expect(payload.data_final).toBe("28/03/2026");

          return [200, { count: 1, results: [] }];
        });

      fireEvent.click(screen.getByText(/Consultar/i));
    });

    it("deve exibir loading enquanto carrega", async () => {
      selectDRE(dreUuid);
      selectEscola(escolaUuid);
      await selectClassificacaoDieta();
      await selectStatus();
      preencherPeriodo();
      mock
        .onPost(
          "/solicitacoes-dieta-especial/relatorio-quantitativo-classificacao-dieta-esp/",
        )
        .reply(() => {
          return new Promise((resolve) =>
            setTimeout(() => resolve([200, { count: 0, results: [] }]), 100),
          );
        });

      fireEvent.click(screen.getByText(/Consultar/i));
      expect(await screen.findByText(/Carregando/i)).toBeInTheDocument();
    });

    it("deve mudar página ao usar paginação", async () => {
      selectDRE(dreUuid);
      selectEscola(escolaUuid);
      await selectClassificacaoDieta();
      await selectStatus();
      preencherPeriodo();
      mock
        .onPost(
          "/solicitacoes-dieta-especial/relatorio-quantitativo-classificacao-dieta-esp/",
        )
        .reply(200, {
          count: 20,
          results: [{ classificacao: "Tipo A", qtde_ativas: 4 }],
        });

      fireEvent.click(screen.getByText(/Consultar/i));

      await waitFor(() => {
        expect(screen.getByText("4")).toBeInTheDocument();
      });

      const nextPage = screen.getByText("2");
      fireEvent.click(nextPage);

      await waitFor(() => {
        expect(mock.history.post.length).toBeGreaterThan(1);
      });
    });

    it("deve chamar função de impressão", async () => {
      const {
        imprimeRelatorioQuantitativoClassificacaoDietaEsp,
      } = require("src/services/relatorios");

      selectDRE(dreUuid);
      selectEscola(escolaUuid);
      await selectClassificacaoDieta();
      await selectStatus();
      preencherPeriodo();
      mock
        .onPost(
          "/solicitacoes-dieta-especial/relatorio-quantitativo-classificacao-dieta-esp/",
        )
        .reply(200, {
          count: 1,
          results: [{ classificacao: "Tipo A", qtde_ativas: 4 }],
        });
      fireEvent.click(screen.getByText(/Consultar/i));
      await waitFor(() => {
        expect(screen.getByText(/Imprimir/i)).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText(/Imprimir/i));
      expect(
        imprimeRelatorioQuantitativoClassificacaoDietaEsp,
      ).toHaveBeenCalled();
    });
  });

  describe("Visão COGESTOR - DIRETORIA REGIONAL", () => {
    const diretoriaRegional = {
      uuid: "3972e0e9-2d8e-472a-9dfa-30cd219a6d9a",
      nome: "IPIRANGA",
      codigo_eol: "108600",
      iniciais: "IP",
      acesso_modulo_medicao_inicial: false,
    };

    afterEach(() => {
      mock.reset();
      mock.resetHistory();
      cleanup();
    });
    beforeEach(async () => {
      mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosDRE);

      mock.onGet(`/escolas-simplissima/${dreUuid}/`).reply(200, [
        {
          nome: "EMEI ANTONIO RUBBO MULLER, PROF.",
          uuid: "2b7a2217-1743-4bcd-8879-cf8e16e34fa6",
          diretoria_regional: diretoriaRegional,
        },
        {
          nome: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
          uuid: "3c32be8e-f191-468d-a4e2-3dd8751e5e7a",
          diretoria_regional: diretoriaRegional,
        },
      ]);

      mock
        .onGet(`/classificacoes-dieta/`)
        .reply(200, mockGetClassificacaoDieta);

      Object.defineProperty(global, "localStorage", {
        value: localStorageMock,
      });
      localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);

      await act(async () => {
        renderWithProvider(
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
              <ToastContainer />
              <RelatorioQuantitativoClassificacaoDietaEsp />
            </MeusDadosContext.Provider>
          </MemoryRouter>,
        );
      });
    });

    it("renderiza dados iniciais", () => {
      expect(
        screen.getByText(/Diretoria Regional de Educação/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/IPIRANGA/i)).toBeInTheDocument();
      expect(screen.getByText(/Unidade Escolar/i)).toBeInTheDocument();
      expect(
        screen.getByText(/EMEI ANTONIO RUBBO MULLER, PROF./i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Classificação/i)).toBeInTheDocument();
      expect(screen.getByText(/Status/i)).toBeInTheDocument();
      expect(screen.getByText(/Data da solicitação/i)).toBeInTheDocument();
      expect(screen.getByText(/Limpar Filtros/i)).toBeInTheDocument();
      expect(screen.getByText(/Consultar/i)).toBeInTheDocument();
    });

    it("deve consultar relatório quantitativo com todos os filtros preenchidos", async () => {
      selectDRE(dreUuid);
      selectEscola(escolaUuid);
      selectClassificacaoDieta();
      selectStatus();
      preencherPeriodo();

      mock
        .onPost(
          "/solicitacoes-dieta-especial/relatorio-quantitativo-classificacao-dieta-esp/",
        )
        .reply(200, {
          count: 1,
          results: [
            {
              dre: "IPIRANGA",
              escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
              classificacao: "Tipo A",
              qtde_ativas: 4,
              qtde_pendentes: 0,
              qtde_inativas: 0,
            },
          ],
        });

      const botaoConsultar = screen.getByText(/Consultar/i);

      await act(async () => {
        fireEvent.click(botaoConsultar);
      });

      await waitFor(() => {
        expect(
          screen.getByText(/Veja os resultados para a busca/i),
        ).toBeInTheDocument();
        expect(screen.getByText("4")).toBeInTheDocument();
      });
    });

    it("deve exibir mensagem quando não houver resultados", async () => {
      selectDRE(dreUuid);
      selectEscola(escolaUuid);
      preencherPeriodo();
      mock.onPost(/relatorio-quantitativo-classificacao-dieta-esp/).reply(200, {
        count: 0,
        results: [],
      });

      fireEvent.click(screen.getByText(/Consultar/i));
      await waitFor(() => {
        expect(
          screen.getByText(
            /Não foi encontrado dieta especial para filtragem realizada/i,
          ),
        ).toBeInTheDocument();
      });
    });
    it("deve limpar os filtros ao clicar em Limpar Filtros", async () => {
      await selectClassificacaoDieta();
      const selectClassificacao = screen.getByTestId(
        "multiselect-Classificação",
      );
      fireEvent.click(screen.getByText(/Limpar Filtros/i));
      await waitFor(() => {
        expect(selectClassificacao.value).toBe("1");
      });
    });

    it("deve enviar payload correto na requisição", async () => {
      selectDRE(dreUuid);
      selectEscola(escolaUuid);
      await selectClassificacaoDieta("7");
      await selectStatus("inativas");
      preencherPeriodo("04/05/2025", "28/03/2026");
      mock
        .onPost(
          "/solicitacoes-dieta-especial/relatorio-quantitativo-classificacao-dieta-esp/",
        )
        .reply((config) => {
          const payload = JSON.parse(config.data);

          expect(payload.classificacao).toEqual(["7"]);
          expect(payload.status).toBe("inativas");
          expect(payload.data_inicial).toBe("04/05/2025");
          expect(payload.data_final).toBe("28/03/2026");

          return [200, { count: 1, results: [] }];
        });

      fireEvent.click(screen.getByText(/Consultar/i));
    });

    it("deve exibir loading enquanto carrega", async () => {
      selectDRE(dreUuid);
      selectEscola(escolaUuid);
      await selectClassificacaoDieta();
      await selectStatus();
      preencherPeriodo();
      mock
        .onPost(
          "/solicitacoes-dieta-especial/relatorio-quantitativo-classificacao-dieta-esp/",
        )
        .reply(() => {
          return new Promise((resolve) =>
            setTimeout(() => resolve([200, { count: 0, results: [] }]), 100),
          );
        });

      fireEvent.click(screen.getByText(/Consultar/i));
      expect(await screen.findByText(/Carregando/i)).toBeInTheDocument();
    });

    it("deve mudar página ao usar paginação", async () => {
      selectDRE(dreUuid);
      selectEscola(escolaUuid);
      await selectClassificacaoDieta();
      await selectStatus();
      preencherPeriodo();
      mock
        .onPost(
          "/solicitacoes-dieta-especial/relatorio-quantitativo-classificacao-dieta-esp/",
        )
        .reply(200, {
          count: 20,
          results: [{ classificacao: "Tipo A", qtde_ativas: 4 }],
        });

      fireEvent.click(screen.getByText(/Consultar/i));

      await waitFor(() => {
        expect(screen.getByText("4")).toBeInTheDocument();
      });

      const nextPage = screen.getByText("2");
      fireEvent.click(nextPage);

      await waitFor(() => {
        expect(mock.history.post.length).toBeGreaterThan(1);
      });
    });

    it("deve chamar função de impressão", async () => {
      const {
        imprimeRelatorioQuantitativoClassificacaoDietaEsp,
      } = require("src/services/relatorios");

      selectDRE(dreUuid);
      selectEscola(escolaUuid);
      await selectClassificacaoDieta();
      await selectStatus();
      preencherPeriodo();
      mock
        .onPost(
          "/solicitacoes-dieta-especial/relatorio-quantitativo-classificacao-dieta-esp/",
        )
        .reply(200, {
          count: 1,
          results: [{ classificacao: "Tipo A", qtde_ativas: 4 }],
        });
      fireEvent.click(screen.getByText(/Consultar/i));
      await waitFor(() => {
        expect(screen.getByText(/Imprimir/i)).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText(/Imprimir/i));
      expect(
        imprimeRelatorioQuantitativoClassificacaoDietaEsp,
      ).toHaveBeenCalled();
    });
  });
});
