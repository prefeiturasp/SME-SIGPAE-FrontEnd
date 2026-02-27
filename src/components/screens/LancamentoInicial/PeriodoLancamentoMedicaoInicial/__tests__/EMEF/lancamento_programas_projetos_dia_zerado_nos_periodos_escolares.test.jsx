import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockGetTipoAlimentacao } from "src/mocks/cadastroTipoAlimentacao.service/mockGetTipoAlimentacao";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockDiasCalendarioEMEFOutubro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Outubro2025/diasCalendario";
import { mockStateProgramasProjetosEMEFOutubro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Outubro2025/stateProgramasProjetos";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockVinculosTipoAlimentacaoPeriodoEscolarEMEF } from "src/mocks/services/cadastroTipoAlimentacao.service/EMEF/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockLogQuantidadeDietasAutorizadasEMEFOutubro2025 } from "src/mocks/services/medicaoInicial/periodoLancamentoMedicao.service/EMEF/Outubro2025/ProgramasProjetos/logQuantidadeDietasAutorizadas";
import { mockValoresMedicaoProgramasProjetosoEMEFOutubro2025 } from "src/mocks/services/medicaoInicial/periodoLancamentoMedicao.service/EMEF/Outubro2025/ProgramasProjetos/valoresMedicao";
import { PeriodoLancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialPage";
import mock from "src/services/_mock";

describe("Teste <PeriodoLancamentoMedicaoInicial> - Programas e Projetos com periodos escolares zerados - Usuário EMEF", () => {
  const escolaUuid =
    mockMeusDadosEscolaEMEFPericles.vinculo_atual.instituicao.uuid;
  const camposPermitidos = ["dietas_autorizadas", "numero_alunos"];
  const filtrarPorCampos = (dados) => {
    return dados.filter((item) => camposPermitidos.includes(item.nome_campo));
  };
  const mockValoresMedicao = filtrarPorCampos(
    mockValoresMedicaoProgramasProjetosoEMEFOutubro2025,
  );
  const mockInclusoesAutorizadas = [
    {
      dia: "01",
      periodo: "MANHA",
      alimentacoes: "lanche",
      numero_alunos: 100,
      dias_semana: [6, 0, 1, 2, 3, 4, 5],
      inclusao_id_externo: "1F6E2",
    },
    {
      dia: "02",
      periodo: "MANHA",
      alimentacoes: "lanche",
      numero_alunos: 100,
      dias_semana: [6, 0, 1, 2, 3, 4, 5],
      inclusao_id_externo: "1F6E2",
    },
  ];

  const idCategoriaAlimentacao = mockCategoriasMedicao.find(
    (cat) => cat.nome === "ALIMENTAÇÃO",
  )?.id;

  const idCategoriaDietaTipoA = mockCategoriasMedicao.find(
    (cat) => cat.nome === "DIETA ESPECIAL - TIPO A",
  )?.id;

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
      .reply(200, { results: mockInclusoesAutorizadas });
    mock
      .onGet("/medicao-inicial/categorias-medicao/")
      .reply(200, mockCategoriasMedicao);
    mock
      .onGet("/log-quantidade-dietas-autorizadas/")
      .reply(200, mockLogQuantidadeDietasAutorizadasEMEFOutubro2025);
    mock
      .onGet("/medicao-inicial/valores-medicao/")
      .reply(200, mockValoresMedicao);
    mock.onGet("/medicao-inicial/dias-para-corrigir/").reply(200, []);
    mock
      .onGet("/dias-calendario/")
      .reply(200, mockDiasCalendarioEMEFOutubro2025);
    mock.onGet("/matriculados-no-mes/").reply(200, []);
    mock
      .onGet("/escola-solicitacoes/suspensoes-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes/")
      .reply(200, { results: ["12"] });

    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/dias-frequencia-zerada/",
      )
      .reply(200, {
        alimentacoes: ["01"],
        dietas: {
          "DIETA ESPECIAL - TIPO A": ["02"],
          "DIETA ESPECIAL - TIPO A - ENTERAL / RESTRIÇÃO DE AMINOÁCIDOS": [],
          "DIETA ESPECIAL - TIPO B": ["01"],
        },
      });

    const search = `?uuid=b386231a-2a77-488b-b6d5-b016987e55c2&ehGrupoSolicitacoesDeAlimentacao=false&ehGrupoETEC=false&ehPeriodoEspecifico=false`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "nome_instituicao",
      `"EMEF PERICLES EUGENIO DA SILVA RAMOS"`,
    );
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/",
              state: mockStateProgramasProjetosEMEFOutubro2025,
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

  it("renderiza label `Mês do Lançamento`", async () => {
    expect(screen.getByText("Mês do Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `Outubro / 2025` no input `Mês do Lançamento`", () => {
    const inputElement = screen.getByTestId("input-mes-lancamento");
    expect(inputElement).toHaveAttribute("value", "Outubro / 2025");
  });

  it("renderiza label `Período de Lançamento`", () => {
    expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `Programas e Projetos` no input `Período de Lançamento`", () => {
    const inputElement = screen.getByTestId("input-periodo-lancamento");
    expect(inputElement).toHaveAttribute("value", "Programas e Projetos");
  });

  it("Alimentação - deve exibir warning, destacar botão de observação e desabilitar salvar quando há frequência sem justificativa", async () => {
    const dia = "01";
    const nomeInput = screen.getByTestId(
      `frequencia__dia_${dia}__categoria_${idCategoriaAlimentacao}`,
    );
    fireEvent.change(nomeInput, {
      target: { value: "6" },
    });
    const iconeTooltip = screen.getByTestId("icone-tooltip-warning");
    expect(iconeTooltip).toBeInTheDocument();
    expect(iconeTooltip).toHaveClass("icone-info-warning");

    fireEvent.mouseOver(iconeTooltip);
    const mensagemTooltip = await screen.findByText(
      "Não há apontamento de estudantes nos demais períodos. Justifique a frequência nos Programas e Projetos.",
    );
    expect(mensagemTooltip).toBeInTheDocument();

    const botaoObservacao = screen.getByTestId(
      `botao-observacao__dia_${dia}__categoria_${idCategoriaAlimentacao}`,
    );
    expect(botaoObservacao).toBeInTheDocument();
    expect(botaoObservacao).toHaveClass("red-button-outline");
    expect(botaoObservacao).toHaveTextContent("Adicionar");

    const botaoSalvar = screen
      .getByText("Salvar Lançamentos")
      .closest("button");
    expect(botaoSalvar).toBeDisabled();
  });

  it("Alimentação - não deve exigir justificativa quando a frequência for zero", async () => {
    const dia = "01";
    const nomeInput = screen.getByTestId(
      `frequencia__dia_${dia}__categoria_${idCategoriaAlimentacao}`,
    );
    fireEvent.change(nomeInput, {
      target: { value: "0" },
    });
    const iconeTooltip = screen.queryByTestId("icone-tooltip-warning");
    expect(iconeTooltip).not.toBeInTheDocument();
    const botaoObservacao = screen.getByTestId(
      `botao-observacao__dia_${dia}__categoria_${idCategoriaAlimentacao}`,
    );
    expect(botaoObservacao).toBeInTheDocument();
    expect(botaoObservacao).toHaveClass("green-button-outline-white");
    expect(botaoObservacao).toHaveTextContent("Adicionar");

    const botaoSalvar = screen
      .getByText("Salvar Lançamentos")
      .closest("button");
    expect(botaoSalvar).not.toBeDisabled();
  });

  it("Alimentação - não deve exibir warning quando não houver inconsistência entre períodos ", async () => {
    const dia = "02";
    const nomeInput = screen.getByTestId(
      `frequencia__dia_${dia}__categoria_${idCategoriaAlimentacao}`,
    );
    fireEvent.change(nomeInput, {
      target: { value: "6" },
    });
    const iconeTooltip = screen.queryByTestId("icone-tooltip-warning");
    expect(iconeTooltip).not.toBeInTheDocument();
    const botaoObservacao = screen.getByTestId(
      `botao-observacao__dia_${dia}__categoria_${idCategoriaAlimentacao}`,
    );
    expect(botaoObservacao).toBeInTheDocument();
    expect(botaoObservacao).toHaveClass("green-button-outline-white");
    expect(botaoObservacao).toHaveTextContent("Adicionar");

    const botaoSalvar = screen
      .getByText("Salvar Lançamentos")
      .closest("button");
    expect(botaoSalvar).not.toBeDisabled();
  });

  it("Dieta - deve exibir warning, destacar botão de observação e desabilitar salvar quando há frequência sem justificativa", async () => {
    const dia = "02";
    const nomeInput = screen.getByTestId(
      `frequencia__dia_${dia}__categoria_${idCategoriaDietaTipoA}`,
    );
    fireEvent.change(nomeInput, {
      target: { value: "2" },
    });
    const iconeTooltip = screen.getByTestId("icone-tooltip-warning");
    expect(iconeTooltip).toBeInTheDocument();
    expect(iconeTooltip).toHaveClass("icone-info-warning");

    fireEvent.mouseOver(iconeTooltip);
    const mensagemTooltip = await screen.findByText(
      "Não há apontamento de estudantes nos demais períodos. Justifique a frequência nos Programas e Projetos.",
    );
    expect(mensagemTooltip).toBeInTheDocument();

    const botaoObservacao = screen.getByTestId(
      `botao-observacao__dia_${dia}__categoria_${idCategoriaDietaTipoA}`,
    );
    expect(botaoObservacao).toBeInTheDocument();
    expect(botaoObservacao).toHaveClass("red-button-outline");
    expect(botaoObservacao).toHaveTextContent("Adicionar");

    const botaoSalvar = screen
      .getByText("Salvar Lançamentos")
      .closest("button");
    expect(botaoSalvar).toBeDisabled();
  });

  it("Dieta - não deve exigir justificativa quando a frequência for zero", async () => {
    const dia = "02";
    const nomeInput = screen.getByTestId(
      `frequencia__dia_${dia}__categoria_${idCategoriaDietaTipoA}`,
    );
    fireEvent.change(nomeInput, {
      target: { value: "0" },
    });
    const iconeTooltip = screen.queryByTestId("icone-tooltip-warning");
    expect(iconeTooltip).not.toBeInTheDocument();
    const botaoObservacao = screen.getByTestId(
      `botao-observacao__dia_${dia}__categoria_${idCategoriaDietaTipoA}`,
    );
    expect(botaoObservacao).toBeInTheDocument();
    expect(botaoObservacao).toHaveClass("green-button-outline-white");
    expect(botaoObservacao).toHaveTextContent("Adicionar");

    const botaoSalvar = screen
      .getByText("Salvar Lançamentos")
      .closest("button");
    expect(botaoSalvar).not.toBeDisabled();
  });

  it("Dieta - não deve exibir warning quando não houver inconsistência entre períodos ", async () => {
    const dia = "01";
    const nomeInput = screen.getByTestId(
      `frequencia__dia_${dia}__categoria_${idCategoriaDietaTipoA}`,
    );
    fireEvent.change(nomeInput, {
      target: { value: "2" },
    });
    const iconeTooltip = screen.queryByTestId("icone-tooltip-warning");
    expect(iconeTooltip).not.toBeInTheDocument();
    const botaoObservacao = screen.getByTestId(
      `botao-observacao__dia_${dia}__categoria_${idCategoriaDietaTipoA}`,
    );
    expect(botaoObservacao).toBeInTheDocument();
    expect(botaoObservacao).toHaveClass("green-button-outline-white");
    expect(botaoObservacao).toHaveTextContent("Adicionar");

    const botaoSalvar = screen
      .getByText("Salvar Lançamentos")
      .closest("button");
    expect(botaoSalvar).not.toBeDisabled();
  });
});
