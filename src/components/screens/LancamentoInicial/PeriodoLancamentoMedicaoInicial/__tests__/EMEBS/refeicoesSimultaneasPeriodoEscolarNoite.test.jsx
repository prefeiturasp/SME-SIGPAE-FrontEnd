import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
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

import preview from "jest-preview";

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: ({ input, onChange }) => (
    <textarea
      data-testid="ckeditor-mock"
      {...input}
      onChange={(e) => {
        input.onChange(e.target.value);
        onChange && onChange(e.target.value, { getData: () => e.target.value });
      }}
    />
  ),
}));

describe("Teste Refeições Simultâneas período NOITE - EMEBS", () => {
  const escolaUuid = mockMeusDadosEscolaEMEBS.vinculo_atual.instituicao.uuid;

  const diasParaAtualizar = new Set(["02", "03", "04", "05", "06"]);

  const diasCalendario = mockDiasCalendarioEMEBSFevereiro2026.map((dia) => ({
    ...dia,
    dia_letivo: diasParaAtualizar.has(dia.dia) ? true : dia.dia_letivo,
  }));

  const matriculados = mockMatriculadosManha
    .filter((item) => item.infantil_ou_fundamental !== "INFANTIL")
    .map((item) => {
      if (item.infantil_ou_fundamental === "FUNDAMENTAL") {
        return {
          ...item,
          periodo_escolar: {
            ...item.periodo_escolar,
            nome: "NOITE",
          },
        };
      }
      return item;
    });

  const dietas = mockDietasEspeciaisFevereiro2026.filter(
    (item) => item.infantil_ou_fundamental !== "INFANTIL",
  );

  const mockStateNOITEFevereiro2026 = {
    ...mockStateMANHAFevereiro2026,
    periodo: "NOITE",
    tipos_alimentacao: mockStateMANHAFevereiro2026.tipos_alimentacao.map(
      (item) => ({
        ...item,
        nome: item.nome === "Lanche" ? "Lanche 4h" : item.nome,
      }),
    ),
  };

  const mockValoresMedicaoFevereiro2026Atualizado =
    mockValoresMedicaoFevereiro2026.map((item) => ({
      ...item,
      nome_campo: item.nome === "lanche" ? "lanche_4h" : item.nome,
    }));

  const valoresMedicaoComObservacao = [
    ...mockValoresMedicaoFevereiro2026Atualizado,
    {
      categoria_medicao: 1,
      nome_campo: "observacoes",
      valor: "<p>Minha justificativa para alimentações simultâneas.</p>",
      dia: "02",
      medicao_uuid: "27ad556f-835c-470d-bce9-622f1c00d12f",
      faixa_etaria: null,
      faixa_etaria_str: null,
      faixa_etaria_inicio: null,
      uuid: "5bfffe1f-dabb-47a3-9436-0a150fee4825",
      medicao_alterado_em: "17/04/2026, às 11:26:10",
      habilitado_correcao: false,
      infantil_ou_fundamental: "FUNDAMENTAL",
    },
    {
      categoria_medicao: 1,
      nome_campo: "frequencia",
      valor: "83",
      dia: "02",
      medicao_uuid: "27ad556f-835c-470d-bce9-622f1c00d12f",
      faixa_etaria: null,
      faixa_etaria_str: null,
      faixa_etaria_inicio: null,
      uuid: "4e5cb02f-9a33-48c3-b4ac-506323fe04c7",
      medicao_alterado_em: "17/04/2026, às 11:26:10",
      habilitado_correcao: false,
      infantil_ou_fundamental: "FUNDAMENTAL",
    },
    {
      categoria_medicao: 1,
      nome_campo: "lanche_4h",
      valor: "54",
      dia: "02",
      medicao_uuid: "27ad556f-835c-470d-bce9-622f1c00d12f",
      faixa_etaria: null,
      faixa_etaria_str: null,
      faixa_etaria_inicio: null,
      uuid: "ea134c42-967d-4115-9c2d-81c7e99160dc",
      medicao_alterado_em: "17/04/2026, às 11:26:10",
      habilitado_correcao: false,
      infantil_ou_fundamental: "FUNDAMENTAL",
    },
    {
      categoria_medicao: 1,
      nome_campo: "refeicao",
      valor: "61",
      dia: "02",
      medicao_uuid: "27ad556f-835c-470d-bce9-622f1c00d12f",
      faixa_etaria: null,
      faixa_etaria_str: null,
      faixa_etaria_inicio: null,
      uuid: "9a62a24b-2bef-4377-a07a-8972808327a2",
      medicao_alterado_em: "17/04/2026, às 11:26:10",
      habilitado_correcao: false,
      infantil_ou_fundamental: "FUNDAMENTAL",
    },
    {
      categoria_medicao: 3,
      nome_campo: "frequencia",
      valor: "4",
      dia: "02",
      medicao_uuid: "27ad556f-835c-470d-bce9-622f1c00d12f",
      faixa_etaria: null,
      faixa_etaria_str: null,
      faixa_etaria_inicio: null,
      uuid: "20fdad39-9d9b-4d75-9b5e-2f2a47582b4c",
      medicao_alterado_em: "17/04/2026, às 11:26:10",
      habilitado_correcao: false,
      infantil_ou_fundamental: "FUNDAMENTAL",
    },
    {
      categoria_medicao: 3,
      nome_campo: "refeicao",
      valor: "2",
      dia: "02",
      medicao_uuid: "27ad556f-835c-470d-bce9-622f1c00d12f",
      faixa_etaria: null,
      faixa_etaria_str: null,
      faixa_etaria_inicio: null,
      uuid: "8d9f6a33-c446-47a9-9fda-1f8ec8e64d8f",
      medicao_alterado_em: "17/04/2026, às 11:26:10",
      habilitado_correcao: false,
      infantil_ou_fundamental: "FUNDAMENTAL",
    },
    {
      categoria_medicao: 3,
      nome_campo: "lanche_4h",
      valor: "2",
      dia: "02",
      medicao_uuid: "27ad556f-835c-470d-bce9-622f1c00d12f",
      faixa_etaria: null,
      faixa_etaria_str: null,
      faixa_etaria_inicio: null,
      uuid: "0aaee235-50a0-4175-a678-f57685a0656f",
      medicao_alterado_em: "17/04/2026, às 11:26:10",
      habilitado_correcao: false,
      infantil_ou_fundamental: "FUNDAMENTAL",
    },
    {
      categoria_medicao: 3,
      nome_campo: "observacoes",
      valor: "<p>Minha justificativa para dietas simultâneas.</p>",
      dia: "02",
      medicao_uuid: "27ad556f-835c-470d-bce9-622f1c00d12f",
      faixa_etaria: null,
      faixa_etaria_str: null,
      faixa_etaria_inicio: null,
      uuid: "0aaee235-50a0-4175-a678-f57685a0656f",
      medicao_alterado_em: "17/04/2026, às 11:26:10",
      habilitado_correcao: false,
      infantil_ou_fundamental: "FUNDAMENTAL",
    },
  ];

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
    mock.onGet("/log-quantidade-dietas-autorizadas/").reply(200, dietas);
    mock
      .onGet("/medicao-inicial/valores-medicao/")
      .reply(200, valoresMedicaoComObservacao);
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
              state: mockStateNOITEFevereiro2026,
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

    it("renderiza valor `NOITE` no input `Período de Lançamento`", () => {
      const inputElement = screen.getByTestId("input-periodo-lancamento");
      expect(inputElement).toHaveAttribute("value", "NOITE");
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

    it("não renderiza label `Alunos do Infantil (4 a 6 anos)`", async () => {
      expect(
        screen.queryByText("Alunos do Infantil (4 a 6 anos)"),
      ).not.toBeInTheDocument();
    });

    it("renderiza label `Alunos do Fundamental (acima de 6 anos)`", async () => {
      expect(
        screen.getByText("Alunos do Fundamental (acima de 6 anos)"),
      ).toBeInTheDocument();
    });
  });

  describe("Testa o lançamntos do período NOITE", () => {
    const preencherCampo = async (
      campo,
      dia,
      idCategoriaAlimentacao,
      valor = "100",
    ) => {
      const nomeInput = screen.getByTestId(
        `${campo}__dia_${dia}__categoria_${idCategoriaAlimentacao}`,
      );

      await act(async () => {
        fireEvent.change(nomeInput, {
          target: {
            name: nomeInput.getAttribute("name"),
            value: valor,
          },
        });
      });
    };

    const obterValorDoCampo = (campo, dia, idCategoriaAlimentacao) => {
      const nomeInput = screen.getByTestId(
        `${campo}__dia_${dia}__categoria_${idCategoriaAlimentacao}`,
      );
      return nomeInput.value;
    };

    describe("Testa a Alimentação", () => {
      it("Preenche refeição - deve exibir warning, destacar botão de observação e desabilitar o botão salvar quando refeicao for diferente de 0(zero)", async () => {
        const semana2Element = screen.getByText("Semana 2");
        fireEvent.click(semana2Element);

        const dia = "03";
        await preencherCampo("frequencia", dia, 1);
        await preencherCampo("lanche_4h", dia, 1);
        await preencherCampo("refeicao", dia, 1);

        const iconeTooltip = screen.getByTestId("icone-tooltip-warning");
        expect(iconeTooltip).toBeInTheDocument();
        expect(iconeTooltip).toHaveClass("icone-info-warning");

        fireEvent.mouseOver(iconeTooltip);
        const mensagemTooltip = await screen.findByText(
          "Justifique o apontamento de lanche concomitante ao registro de refeição, uma vez que o aluno deve receber apenas um tipo de alimentação.",
        );
        expect(mensagemTooltip).toBeInTheDocument();

        const botaoObservacao = screen.getByTestId(
          `botao-observacao__dia_${dia}__categoria_1`,
        );
        expect(botaoObservacao).toBeInTheDocument();
        expect(botaoObservacao).toHaveClass("red-button-outline");
        expect(botaoObservacao).toHaveTextContent("Adicionar");

        const botaoSalvar = screen
          .getByText("Salvar Lançamentos")
          .closest("button");
        expect(botaoSalvar).toBeDisabled();
      });

      it("Preenche refeição - não deve exigir justificativa quando a o valor de refeicao for zero", async () => {
        const semana2Element = screen.getByText("Semana 2");
        fireEvent.click(semana2Element);

        const dia = "03";
        await preencherCampo("frequencia", dia, 1);
        await preencherCampo("lanche_4h", dia, 1);
        await preencherCampo("refeicao", dia, 1, 0);

        const iconeTooltip = screen.queryByTestId("icone-tooltip-warning");
        expect(iconeTooltip).not.toBeInTheDocument();
        const botaoObservacao = screen.getByTestId(
          `botao-observacao__dia_${dia}__categoria_1`,
        );
        expect(botaoObservacao).toBeInTheDocument();
        expect(botaoObservacao).toHaveClass("green-button-outline-white");
        expect(botaoObservacao).toHaveTextContent("Adicionar");

        const botaoSalvar = screen
          .getByText("Salvar Lançamentos")
          .closest("button");
        expect(botaoSalvar).not.toBeDisabled();
      });

      it("Preenche refeição - não deve exigir justificativa quando a o valor de lanche 4h for zero", async () => {
        const semana2Element = screen.getByText("Semana 2");
        fireEvent.click(semana2Element);

        const dia = "03";
        await preencherCampo("frequencia", dia, 1);
        await preencherCampo("lanche_4h", dia, 1, 0);
        await preencherCampo("refeicao", dia, 1);

        const iconeTooltip = screen.queryByTestId("icone-tooltip-warning");
        expect(iconeTooltip).not.toBeInTheDocument();
        const botaoObservacao = screen.getByTestId(
          `botao-observacao__dia_${dia}__categoria_1`,
        );
        expect(botaoObservacao).toBeInTheDocument();
        expect(botaoObservacao).toHaveClass("green-button-outline-white");
        expect(botaoObservacao).toHaveTextContent("Adicionar");

        const botaoSalvar = screen
          .getByText("Salvar Lançamentos")
          .closest("button");
        expect(botaoSalvar).not.toBeDisabled();
      });

      it("Preenche refeição - e inclui observação", async () => {
        const semana2Element = screen.getByText("Semana 2");
        fireEvent.click(semana2Element);
        const dia = "03";
        await preencherCampo("frequencia", dia, 1);
        await preencherCampo("lanche_4h", dia, 1);
        await preencherCampo("refeicao", dia, 1);

        const botaoSalvar = screen
          .getByText("Salvar Lançamentos")
          .closest("button");
        await waitFor(() => {
          expect(botaoSalvar).toBeDisabled();
        });

        const botaoObservacao = screen.getByTestId(
          `botao-observacao__dia_${dia}__categoria_1`,
        );
        expect(botaoObservacao).toHaveTextContent("Adicionar");
        fireEvent.click(botaoObservacao);

        const modal = await screen.findByRole("dialog");
        expect(modal).toBeInTheDocument();

        expect(screen.getByText("Observação Diária")).toBeInTheDocument();
        expect(screen.getByText("Data do Lançamento")).toBeInTheDocument();
        expect(
          within(modal).getByPlaceholderText("03/02/2026"),
        ).toBeInTheDocument();

        const btnSalvarObservacao = screen.getByTestId("botao-salvar");
        expect(btnSalvarObservacao).toBeDisabled();
        const btnVoltar = screen.getByTestId("botao-voltar");
        expect(btnVoltar).not.toBeDisabled();
        const btnExcluir = screen.queryByTestId("botao-excluir");
        expect(btnExcluir).not.toBeInTheDocument();

        const mensagem = "Minha justificativa para alimentações simultâneas.";
        const ckEditor = screen.getByTestId("ckeditor-mock");
        fireEvent.input(ckEditor, { target: { value: mensagem } });

        const definidorDeValorNativo = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          "value",
        ).set;
        definidorDeValorNativo.call(ckEditor, mensagem);
        ckEditor.dispatchEvent(new Event("input", { bubbles: true }));

        await waitFor(() => {
          expect(ckEditor.value).toBe(mensagem);
          expect(btnSalvarObservacao).not.toBeDisabled();
        });

        fireEvent.click(btnSalvarObservacao);

        await waitFor(() => {
          expect(modal).not.toBeInTheDocument();
        });
      });

      it("Refeição e lanche 4h preenchidos com observação - Verifica botão visualizar", async () => {
        const semana2Element = screen.getByText("Semana 2");
        fireEvent.click(semana2Element);
        const dia = "02";
        const botaoSalvar = screen
          .getByText("Salvar Lançamentos")
          .closest("button");

        await waitFor(() => {
          expect(botaoSalvar).not.toBeDisabled();
        });
        const frequencia = obterValorDoCampo("frequencia", dia, 1);
        expect(frequencia).toBe("83");

        const lanche4h = obterValorDoCampo("lanche_4h", dia, 1);
        expect(lanche4h).toBe("54");

        const refeicao = obterValorDoCampo("refeicao", dia, 1);
        expect(refeicao).toBe("61");

        const botaoObservacao = screen.getByTestId(
          `botao-observacao__dia_${dia}__categoria_1`,
        );
        expect(botaoObservacao).toHaveClass("green-button");
        expect(botaoObservacao).toHaveTextContent("Visualizar");
        fireEvent.click(botaoObservacao);

        const modal = await screen.findByRole("dialog");
        expect(modal).toBeInTheDocument();

        expect(screen.getByText("Observação Diária")).toBeInTheDocument();
        expect(screen.getByText("Data do Lançamento")).toBeInTheDocument();
        expect(
          within(modal).getByPlaceholderText("02/02/2026"),
        ).toBeInTheDocument();

        const btnSalvarObservacao = screen.getByTestId("botao-salvar");
        expect(btnSalvarObservacao).toBeDisabled();
        const btnVoltar = screen.getByTestId("botao-voltar");
        expect(btnVoltar).not.toBeDisabled();
        const btnExcluir = screen.queryByTestId("botao-excluir");
        expect(btnExcluir).not.toBeInTheDocument();

        const mensagem =
          "<p>Minha justificativa para alimentações simultâneas.</p>";
        const ckEditor = screen.getByTestId("ckeditor-mock");

        await waitFor(() => {
          expect(ckEditor.value).toBe(mensagem);
          expect(btnSalvarObservacao).toBeDisabled();
        });
        preview.debug();
        fireEvent.click(btnVoltar);
        await waitFor(() => {
          expect(modal).not.toBeInTheDocument();
        });
      });
    });
  });
});
