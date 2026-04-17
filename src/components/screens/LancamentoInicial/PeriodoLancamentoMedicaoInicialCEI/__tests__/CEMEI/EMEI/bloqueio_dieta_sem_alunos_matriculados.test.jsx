import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockDiasCalendarioCEMEINovembro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/CEMEI/Novembro2025/diasCalendario";
import { mockLogQuantidadeDietasAutorizadasCEMEINovembro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/CEMEI/Novembro2025/logQuantidadeDietasAutorizadas";
import { mockMatriculadosNoMesCEMEINovembro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/CEMEI/Novembro2025/matriculadosNoMes";
import { mockStateInfantilIntegralCEMEINovembro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/CEMEI/Novembro2025/stateInfantilINTEGRAL";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/meusDados/escola/CEMEI";
import { PeriodoLancamentoMedicaoInicialCEIPage } from "src/pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialCEIPage";
import mock from "src/services/_mock";

describe("Bloqueio de dietas sem log de matriculados - EMEI da CEMEI", () => {
  const matriculados = mockMatriculadosNoMesCEMEINovembro2025.filter((item) => {
    const dia = Number(item.dia);
    return dia >= 1 && dia < 7;
  });

  const dietasEspeciais =
    mockLogQuantidadeDietasAutorizadasCEMEINovembro2025.map((item) => ({
      ...item,
      quantidade:
        item.classificacao?.toLowerCase().includes("tipo") &&
        item.quantidade === 0
          ? 1
          : item.quantidade,
    }));

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCEMEI);
    mock.onGet("/faixas-etarias/").reply(200, mockFaixasEtarias);
    mock
      .onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/")
      .reply(200, []);
    mock.onGet("/escola-solicitacoes/inclusoes-autorizadas/").reply(200, {
      results: [],
    });
    mock
      .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/medicao-inicial/categorias-medicao/")
      .reply(200, mockCategoriasMedicao);
    mock
      .onGet("/dias-calendario/")
      .reply(200, mockDiasCalendarioCEMEINovembro2025);
    mock
      .onGet(
        "/medicao-inicial/permissao-lancamentos-especiais/periodos-permissoes-lancamentos-especiais-mes-ano/",
      )
      .reply(200, {
        results: {
          alimentacoes_lancamentos_especiais: [],
          permissoes_por_dia: [],
          data_inicio_permissoes: null,
        },
      });
    mock.onGet("/matriculados-no-mes/").reply(200, matriculados);
    mock
      .onGet("/log-quantidade-dietas-autorizadas/")
      .reply(200, dietasEspeciais);
    mock.onGet("/medicao-inicial/valores-medicao/").reply(200, []);
    mock.onGet("/medicao-inicial/dias-para-corrigir/").reply(200, []);
    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes/")
      .reply(200, { results: ["02", "15", "20"] });

    mock
      .onGet("/escola-solicitacoes/suspensoes-autorizadas/")
      .reply(200, { results: [] });

    mock
      .onGet(
        "/medicao-inicial/permissao-lancamentos-especiais/permissoes-lancamentos-especiais-mes-ano-por-periodo/",
      )
      .reply(200, {
        results: {
          alimentacoes_lancamentos_especiais: [],
          data_inicio_permissoes: null,
        },
      });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", `"CEMEI SUZANA CAMPOS TAUIL"`);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
    localStorage.setItem("eh_cemei", "true");

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/",
              state: mockStateInfantilIntegralCEMEINovembro2025,
            },
          ]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <PeriodoLancamentoMedicaoInicialCEIPage />
          <ToastContainer />
        </MemoryRouter>,
      );
    });

    const search = `?uuid=64c527a2-d724-4b8e-a3bf-c3815ff078b9`;
    window.history.pushState({}, "", search);
  });

  describe("Testa conteúdo básico da tela", () => {
    it("renderiza label `Mês do Lançamento`", async () => {
      expect(screen.getByText("Mês do Lançamento")).toBeInTheDocument();
    });

    it("renderiza valor `Novembro / 2025` no input `Mês do Lançamento`", () => {
      const inputElement = screen.getByTestId("input-mes-lancamento");
      expect(inputElement).toHaveAttribute("value", "Novembro / 2025");
    });

    it("renderiza label `Período de Lançamento`", () => {
      expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
    });

    it("renderiza valor `Infantil INTEGRAL` no input `Período de Lançamento`", () => {
      const inputElement = screen.getByTestId("input-periodo-lancamento");
      expect(inputElement).toHaveAttribute("value", "Infantil INTEGRAL");
    });

    it("renderiza label `Semanas do Período para Lançamento da Medição Inicial`", () => {
      expect(
        screen.getByText(
          "Semanas do Período para Lançamento da Medição Inicial",
        ),
      ).toBeInTheDocument();
    });

    it("renderiza as labels `Semana 1`, `Semana 2`, `Semana 3`, `Semana 4` e `Semana 5`", async () => {
      expect(screen.getByText("Semana 1")).toBeInTheDocument();
      expect(screen.getByText("Semana 2")).toBeInTheDocument();
      expect(screen.getByText("Semana 3")).toBeInTheDocument();
      expect(screen.getByText("Semana 4")).toBeInTheDocument();
      expect(screen.getByText("Semana 5")).toBeInTheDocument();
    });

    it("renderiza label `ALIMENTAÇÃO`", async () => {
      expect(screen.getByText("ALIMENTAÇÃO")).toBeInTheDocument();
    });
    it("renderiza label `DIETA ESPECIAL - TIPO A`", async () => {
      expect(screen.getByText("DIETA ESPECIAL - TIPO A")).toBeInTheDocument();
    });

    it("renderiza label `DIETA ESPECIAL - TIPO A - ENTERAL / RESTRIÇÃO DE AMINOÁCIDOS`", async () => {
      expect(
        screen.getByText(
          "DIETA ESPECIAL - TIPO A - ENTERAL / RESTRIÇÃO DE AMINOÁCIDOS",
        ),
      ).toBeInTheDocument();
    });

    it("renderiza label `DIETA ESPECIAL - TIPO B`", async () => {
      expect(screen.getByText("DIETA ESPECIAL - TIPO B")).toBeInTheDocument();
    });
  });

  describe("Testa boqueio de dietas", () => {
    const config = {
      1: {
        habilitados: [
          "frequencia",
          "lanche",
          "lanche_4h",
          "refeicao",
          "repeticao_refeicao",
          "sobremesa",
          "repeticao_sobremesa",
        ],
        bloqueados: ["matriculados"],
      },
      2: {
        habilitados: ["frequencia", "lanche", "lanche_4h"],
        bloqueados: ["dietas_autorizadas"],
      },
      3: {
        habilitados: ["frequencia", "lanche", "lanche_4h", "refeicao"],
        bloqueados: ["dietas_autorizadas"],
      },
      4: {
        habilitados: ["frequencia", "lanche", "lanche_4h"],
        bloqueados: ["dietas_autorizadas"],
      },
    };

    const obterCampo = (campo, dia, categoria) =>
      screen.findByTestId(
        `${campo}__dia_${String(dia).padStart(2, "0")}__categoria_${categoria}`,
      );

    const assertCampos = async (campos, dia, categoria, habilitado = true) => {
      for (const campo of campos) {
        const input = await obterCampo(campo, dia, categoria);
        habilitado
          ? expect(input).not.toBeDisabled()
          : expect(input).toBeDisabled();
      }
    };
    it("deve habilitar campos dos dias 3 a 6 exceto matriculados e dietas_autorizadas", async () => {
      const semana2Element = screen.getByText("Semana 2");
      fireEvent.click(semana2Element);

      for (let dia = 3; dia <= 6; dia++) {
        for (const categoria of Object.keys(config)) {
          const { habilitados, bloqueados } = config[categoria];
          await assertCampos(bloqueados, dia, categoria, false);
          await assertCampos(habilitados, dia, categoria, true);
        }
      }
    });

    it("deve desabilitar todos os campos do dia 7 e validar valores de matriculados e dietas", async () => {
      const semana2Element = screen.getByText("Semana 2");
      fireEvent.click(semana2Element);

      for (const categoria of Object.keys(config)) {
        const { habilitados, bloqueados } = config[categoria];
        await assertCampos(bloqueados, 7, categoria, false);
        await assertCampos(habilitados, 7, categoria, false);
      }

      const matriculados = await screen.findByTestId(
        `matriculados__dia_07__categoria_1`,
      );
      expect(matriculados).toHaveValue("");

      const dietasTipoA = await screen.findByTestId(
        `dietas_autorizadas__dia_07__categoria_2`,
      );
      expect(dietasTipoA.value).toBe("1");

      const dietasTipoEnteralAminoacidos = await screen.findByTestId(
        `dietas_autorizadas__dia_07__categoria_3`,
      );
      expect(dietasTipoEnteralAminoacidos.value).toBe("4");

      const dietasTipoB = await screen.findByTestId(
        `dietas_autorizadas__dia_07__categoria_4`,
      );
      expect(dietasTipoB.value).toBe("2");
    });
  });
});
