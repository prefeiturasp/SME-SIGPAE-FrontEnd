import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockGetTipoAlimentacao } from "src/mocks/cadastroTipoAlimentacao.service/mockGetTipoAlimentacao";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockDiasCalendarioEMEFJaneiro2026 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Janeiro2026/diasCalendario";
import { mockLogQuantidadeDietasAutorizadasEMEFJaneiro2026 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Janeiro2026/logQuantidadeDietasAutorizadas";
import { mockMatriculadosNoMesEMEFJaneiro2026 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Janeiro2026/matriculadosNoMes";
import { mockPermissaoLancamentosEspeciaisEMEFJaneiro2026 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Janeiro2026/permissaoLancamentosEspeciais";
import { mockStateMANHAEMEFJaneiro2026 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Janeiro2026/stateMANHA";
import { mockValoresMedicaoEMEFJaneiro2026 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Janeiro2026/valoresMedicao";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockVinculosTipoAlimentacaoPeriodoEscolarEMEF } from "src/mocks/services/cadastroTipoAlimentacao.service/EMEF/vinculosTipoAlimentacaoPeriodoEscolar";
import { PeriodoLancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialPage";
import mock from "src/services/_mock";

describe("Bloqueio de dietas sem log de matriculados - EMEF", () => {
  const escolaUuid =
    mockMeusDadosEscolaEMEFPericles.vinculo_atual.instituicao.uuid;

  const diasParaAtualizar = new Set(["05", "06", "07", "08", "09"]);

  const diasCalendario = mockDiasCalendarioEMEFJaneiro2026.map((dia) => ({
    ...dia,
    dia_letivo: diasParaAtualizar.has(dia.dia) ? true : dia.dia_letivo,
  }));

  const matriculados = mockMatriculadosNoMesEMEFJaneiro2026.filter((item) => {
    const dia = Number(item.dia);
    return dia >= 1 && dia < 9;
  });

  const valoresMedicao = mockValoresMedicaoEMEFJaneiro2026.filter((item) => {
    const dia = Number(item.dia);
    if (dia >= 1 && dia < 9) return true;
    if (dia === 9 && item.nome_campo !== "matriculados") return true;

    return false;
  });

  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockVinculosTipoAlimentacaoPeriodoEscolarEMEF);
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
      .reply(200, mockLogQuantidadeDietasAutorizadasEMEFJaneiro2026);
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
      .reply(200, mockPermissaoLancamentosEspeciaisEMEFJaneiro2026);
    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes/")
      .reply(200, { results: ["01", "25"] });

    const search = `?uuid=a2eed560-2255-4067-a803-4ad6b9f1d26a&ehGrupoSolicitacoesDeAlimentacao=false&ehGrupoETEC=false&ehPeriodoEspecifico=false`;
    window.history.pushState({}, "", search);

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/",
              state: mockStateMANHAEMEFJaneiro2026,
            },
          ]}
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

    it("renderiza valor `Janeiro / 2026` no input `Mês do Lançamento`", () => {
      const inputElement = screen.getByTestId("input-mes-lancamento");
      expect(inputElement).toHaveAttribute("value", "Janeiro / 2026");
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
          "2_lanche_4h",
          "2_lanche_5h",
          "lanche_extra",
          "refeicao",
          "repeticao_refeicao",
          "sobremesa",
          "repeticao_sobremesa",
          "2_refeicao_1_oferta",
          "repeticao_2_refeicao",
          "2_sobremesa_1_oferta",
          "repeticao_2_sobremesa",
        ],
        bloqueados: ["matriculados"],
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
    it("deve habilitar campos dos dias 5 a 8 exceto matriculados e dietas_autorizadas", async () => {
      const semana2Element = screen.getByText("Semana 2");
      fireEvent.click(semana2Element);

      for (let dia = 5; dia <= 8; dia++) {
        for (const categoria of Object.keys(config)) {
          const { habilitados, bloqueados } = config[categoria];
          await assertCampos(bloqueados, dia, categoria, false);
          await assertCampos(habilitados, dia, categoria, true);
        }
      }
    });

    it("deve desabilitar todos os campos do dia 9 e validar valores de matriculados e dietas", async () => {
      const semana2Element = screen.getByText("Semana 2");
      fireEvent.click(semana2Element);

      for (const categoria of Object.keys(config)) {
        const { habilitados, bloqueados } = config[categoria];
        await assertCampos(bloqueados, 9, categoria, false);
        await assertCampos(habilitados, 9, categoria, false);
      }

      const matriculados = await screen.findByTestId(
        `matriculados__dia_09__categoria_1`,
      );
      expect(matriculados).toHaveValue("");

      const dietasTipoA = await screen.findByTestId(
        `dietas_autorizadas__dia_09__categoria_3`,
      );
      expect(dietasTipoA.value).toBe("1");

      const dietasTipoB = await screen.findByTestId(
        `dietas_autorizadas__dia_09__categoria_4`,
      );
      expect(dietasTipoB.value).toBe("1");
    });
  });
});
