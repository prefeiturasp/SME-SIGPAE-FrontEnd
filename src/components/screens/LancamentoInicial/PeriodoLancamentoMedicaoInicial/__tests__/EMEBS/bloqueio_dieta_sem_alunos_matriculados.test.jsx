import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockGetTipoAlimentacao } from "src/mocks/cadastroTipoAlimentacao.service/mockGetTipoAlimentacao";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockMeusDadosEscolaEMEBS } from "src/mocks/meusDados/escola/EMEBS";
import { PeriodoLancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialPage";
import { mockDiasCalendarioEMEBSFevereiro2026 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEBS/Fevereiro2026/diasCalendario";
import { mockGetVinculosTipoAlimentacaoPorEscolaEMEBS } from "src/mocks/services/cadastroTipoAlimentacao.service/EMEBS/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockValoresMedicaoFevereiro2026 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEBS/Fevereiro2026/valoresMedicaoFevereiro2026";
import { mockMatriculadosManha } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEBS/Fevereiro2026/matriculadosManhaFevereiro2026";
import { mockDietasEspeciaisFevereiro2026 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEBS/Fevereiro2026/dietasespeciaisManhaFevereiro2026";
import { mockStateMANHAFevereiro2026 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEBS/Fevereiro2026/stateManhaFevereiro2026";
import { localStorageMock } from "src/mocks/localStorageMock";
import mock from "src/services/_mock";

describe("Bloqueio de dietas sem log de matriculados - EMEBS", () => {
  const escolaUuid = mockMeusDadosEscolaEMEBS.vinculo_atual.instituicao.uuid;

  const diasParaAtualizar = new Set(["02", "03", "04", "05", "06"]);

  const diasCalendario = mockDiasCalendarioEMEBSFevereiro2026.map((dia) => ({
    ...dia,
    dia_letivo: diasParaAtualizar.has(dia.dia) ? true : dia.dia_letivo,
  }));

  const matriculados = mockMatriculadosManha.filter((item) => {
    const dia = Number(item.dia);
    if (item.infantil_ou_fundamental === "INFANTIL") {
      return dia < 5;
    }

    if (item.infantil_ou_fundamental === "FUNDAMENTAL") {
      return dia < 6;
    }
  });

  const valoresMedicao = mockValoresMedicaoFevereiro2026.filter((item) => {
    const dia = Number(item.dia);
    if (item.infantil_ou_fundamental === "INFANTIL") {
      if (dia < 5) return true;
      if ([5, 6].includes(dia) && item.nome_campo !== "matriculados") {
        return true;
      }
    }

    if (item.infantil_ou_fundamental === "FUNDAMENTAL") {
      if (dia < 6) return true;
      if (dia === 6 && item.nome_campo !== "matriculados") {
        return true;
      }
    }

    return false;
  });

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaEMEBS);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaEMEBS);
    mock
      .onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/")
      .reply(200, []);
    mock.onGet("/tipos-alimentacao/").reply(200, mockGetTipoAlimentacao);
    mock
      .onGet("/escola-solicitacoes/inclusoes-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/medicao-inicial/categorias-medicao/")
      .reply(200, mockCategoriasMedicao);
    mock
      .onGet("/log-quantidade-dietas-autorizadas/")
      .reply(200, mockDietasEspeciaisFevereiro2026);
    mock.onGet("/medicao-inicial/valores-medicao/").reply(200, valoresMedicao);
    mock.onGet("/medicao-inicial/dias-para-corrigir/").reply(200, []);
    mock.onGet("/dias-calendario/").reply(200, diasCalendario);
    mock.onGet("/matriculados-no-mes/").reply(200, matriculados);
    mock
      .onGet("/escola-solicitacoes/suspensoes-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet(
        "/medicao-inicial/permissao-lancamentos-especiais/permissoes-lancamentos-especiais-mes-ano-por-periodo/",
      )
      .reply(200, {
        results: {
          alimentacoes_lancamentos_especiais: [],
          permissoes_por_dia: [],
          data_inicio_permissoes: null,
        },
      });
    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes/")
      .reply(200, { results: ["17"] });

    const search = `?uuid=0fbe3ff0-6450-4b93-baa7-c855f9dcea82&ehGrupoSolicitacoesDeAlimentacao=false&ehGrupoETEC=false&ehPeriodoEspecifico=false`;
    window.history.pushState({}, "", search);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("eh_emebs", "true");

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/lancamento/0fbe3ff0-6450-4b93-baa7-c855f9dcea82",
              state: mockStateMANHAFevereiro2026,
            },
          ]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosEscolaEMEBS,
              setMeusDados: jest.fn(),
            }}
          >
            <PeriodoLancamentoMedicaoInicialPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  describe("Testa conteúdo básico da tela", () => {
    it("renderiza label `Mês do Lançamento`", async () => {
      expect(screen.getByText("Mês do Lançamento")).toBeInTheDocument();
    });

    it("renderiza valor `Fevereiro / 2026` no input `Mês do Lançamento`", () => {
      const inputElement = screen.getByTestId("input-mes-lancamento");
      expect(inputElement).toHaveAttribute("value", "Fevereiro / 2026");
    });

    it("renderiza label `Período de Lançamento`", () => {
      expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
    });

    it("renderiza valor `MANHA` no input `Período de Lançamento`", () => {
      const inputElement = screen.getByTestId("input-periodo-lancamento");
      expect(inputElement).toHaveAttribute("value", "MANHA");
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

    it("renderiza label `Alunos do Infantil (4 a 6 anos)`", async () => {
      expect(
        screen.getByText("Alunos do Infantil (4 a 6 anos)"),
      ).toBeInTheDocument();
    });

    it("renderiza label `Alunos do Fundamental (acima de 6 anos)`", async () => {
      expect(
        screen.getByText("Alunos do Fundamental (acima de 6 anos)"),
      ).toBeInTheDocument();
    });
  });

  describe("Testa boqueio de dietas", () => {
    const config = {
      1: {
        habilitados: [
          "frequencia",
          "lanche",
          "refeicao",
          "repeticao_refeicao",
          "sobremesa",
          "repeticao_sobremesa",
        ],
        bloqueados: ["matriculados"],
      },
      2: {
        habilitados: ["frequencia", "lanche"],
        bloqueados: ["dietas_autorizadas"],
      },
      3: {
        habilitados: ["frequencia", "lanche", "refeicao"],
        bloqueados: ["dietas_autorizadas"],
      },
      4: {
        habilitados: ["frequencia", "lanche"],
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

    const aguardarTelaCarregada = async () => {
      await screen.findByText("Semana 1");

      await waitFor(() => {
        expect(screen.getByText("ALIMENTAÇÃO")).toBeInTheDocument();
      });
    };

    const selecionarSemanaEInfantil = async () => {
      fireEvent.click(screen.getByText("Semana 2"));

      const tabInfantil = await screen.findByText((text) =>
        text.includes("Infantil"),
      );

      fireEvent.click(tabInfantil);
    };
    const selecionarSemanaEFundamental = async () => {
      fireEvent.click(screen.getByText("Semana 2"));

      const tabFundamental = await screen.findByText((text) =>
        text.includes("Fundamental"),
      );

      fireEvent.click(tabFundamental);
    };

    describe("Alunos do Infantil", () => {
      it("deve habilitar campos dos dias 2 a 4 exceto matriculados e dietas_autorizadas", async () => {
        await aguardarTelaCarregada();
        await selecionarSemanaEInfantil();
        for (let dia = 2; dia <= 4; dia++) {
          for (const categoria of Object.keys(config)) {
            const { habilitados, bloqueados } = config[categoria];
            await assertCampos(bloqueados, dia, categoria, false);
            await assertCampos(habilitados, dia, categoria, true);
          }
        }
      });

      it("deve desabilitar todos os campos dos dias 5 a 6 e validar valores de matriculados e dietas", async () => {
        await aguardarTelaCarregada();
        await selecionarSemanaEInfantil();

        const diasBloqueados = [5, 6];

        for (const dia of diasBloqueados) {
          for (const categoria of Object.keys(config)) {
            const { habilitados, bloqueados } = config[categoria];
            await assertCampos(bloqueados, dia, categoria, false);
            await assertCampos(habilitados, dia, categoria, false);
          }

          const matriculados = await screen.findByTestId(
            `matriculados__dia_0${dia}__categoria_1`,
          );
          expect(matriculados).toHaveValue("");

          const dietaA = await screen.findByTestId(
            `dietas_autorizadas__dia_0${dia}__categoria_2`,
          );
          expect(dietaA).toHaveValue("2");

          const dietaAEnteralAminoacidos = await screen.findByTestId(
            `dietas_autorizadas__dia_0${dia}__categoria_3`,
          );
          expect(dietaAEnteralAminoacidos).toHaveValue("4");

          const dietaB = await screen.findByTestId(
            `dietas_autorizadas__dia_0${dia}__categoria_4`,
          );
          expect(dietaB).toHaveValue("2");
        }
      });
    });

    describe("Alunos do Fundamental", () => {
      it("deve habilitar campos dos dias 2 a 5 exceto matriculados e dietas_autorizadas", async () => {
        await aguardarTelaCarregada();
        await selecionarSemanaEFundamental();
        for (let dia = 2; dia <= 5; dia++) {
          for (const categoria of Object.keys(config)) {
            const { habilitados, bloqueados } = config[categoria];

            await assertCampos(bloqueados, dia, categoria, false);
            await assertCampos(habilitados, dia, categoria, true);
          }
        }
      });

      it("deve desabilitar todos os campos dos dia 6 e validar valores de matriculados e dietas", async () => {
        await aguardarTelaCarregada();
        await selecionarSemanaEFundamental();
        const dia = 6;

        for (const categoria of Object.keys(config)) {
          const { habilitados, bloqueados } = config[categoria];

          await assertCampos(bloqueados, dia, categoria, false);
          await assertCampos(habilitados, dia, categoria, false);
        }

        const matriculados = await screen.findByTestId(
          "matriculados__dia_06__categoria_1",
        );
        expect(matriculados).toHaveValue("");

        const dietaA = await screen.findByTestId(
          "dietas_autorizadas__dia_06__categoria_2",
        );
        expect(dietaA).toHaveValue("2");

        const dietaAEnteralAminoacidos = await screen.findByTestId(
          "dietas_autorizadas__dia_06__categoria_3",
        );
        expect(dietaAEnteralAminoacidos).toHaveValue("4");

        const dietaB = await screen.findByTestId(
          "dietas_autorizadas__dia_06__categoria_4",
        );
        expect(dietaB).toHaveValue("2");
      });
    });
  });
});
