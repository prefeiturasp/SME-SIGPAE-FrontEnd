import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockDiasUteis } from "src/mocks/diasUseisMock";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/meusDados/escola/CEMEI";
import { mockMotivosAlteracaoCardapio } from "src/mocks/services/alteracaoCardapio.service/motivosAlteracaoCardapio";
import { mockQuantidadeAlunoCEMEIporCEIEMEI } from "src/mocks/services/aluno.service/CEMEI/quantidadeAlunoCEMEIporCEIEMEI";
import { mockGetVinculosTipoAlimentacaoPorEscolaCEMEI } from "src/mocks/services/cadastroTipoAlimentacao.service/CEMEI/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockAlteracoesCEMEIRascunho } from "src/mocks/services/escola.service/CEMEI/alteracoesCEMEIRascunho";
import { AlteracaoDeCardapioCEMEIPage } from "src/pages/Escola/AlteracaoDeCardapioCEMEIPage";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import mock from "src/services/_mock";

describe("Teste Formulário Alteração de Cardápio - RPL - CEMEI", () => {
  const escolaUuid = mockMeusDadosEscolaCEMEI.vinculo_atual.instituicao.uuid;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCEMEI);
    mock
      .onGet("/motivos-alteracao-cardapio/")
      .reply(200, mockMotivosAlteracaoCardapio);
    mock.onGet("/dias-uteis/").reply(200, mockDiasUteis);
    mock
      .onGet("/alunos/quantidade-cemei-por-cei-emei/")
      .reply(200, mockQuantidadeAlunoCEMEIporCEIEMEI);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCEMEI);
    mock
      .onGet("/alteracoes-cardapio-cemei/")
      .reply(200, mockAlteracoesCEMEIRascunho);
    mock
      .onPost("/alteracoes-cardapio-cemei/")
      .reply(201, { uuid: "475907b7-0b66-436d-a624-e18bffe65eb3" });
    mock
      .onPut(
        `/alteracoes-cardapio-cemei/${mockAlteracoesCEMEIRascunho.results[0].uuid}/`,
      )
      .reply(200, {});
    mock
      .onPatch(
        `/alteracoes-cardapio-cemei/${mockAlteracoesCEMEIRascunho.results[0].uuid}/inicio-pedido/`,
      )
      .reply(200, {});
    mock
      .onPatch(
        "/alteracoes-cardapio-cemei/475907b7-0b66-436d-a624-e18bffe65eb3/inicio-pedido/",
      )
      .reply(200, {});
    mock
      .onDelete(
        `/alteracoes-cardapio-cemei/${mockAlteracoesCEMEIRascunho.results[0].uuid}/`,
      )
      .reply(204, {});

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", `"CEMEI SUZANA CAMPOS TAUIL"`);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
    localStorage.setItem("eh_cemei", "true");

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosEscolaCEMEI,
              setMeusDados: jest.fn(),
            }}
          >
            <AlteracaoDeCardapioCEMEIPage />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("renderiza título da página e o breadcrumb `Alteração do Tipo de Alimentação`", async () => {
    expect(
      screen.queryAllByText("Alteração do Tipo de Alimentação").length,
    ).toBe(2);
  });

  it("renderiza bloco com número de matriculados", async () => {
    expect(screen.getByText("Total de Matriculados")).toBeInTheDocument();
    expect(screen.getByText("187")).toBeInTheDocument();

    expect(screen.getByText("Matriculados CEI")).toBeInTheDocument();
    expect(screen.getByText("79")).toBeInTheDocument();

    expect(screen.getByText("Matriculados EMEI")).toBeInTheDocument();
    expect(screen.getByText("108")).toBeInTheDocument();

    expect(
      screen.getByText(
        "Informação automática disponibilizada pelo Cadastro da Unidade Escolar",
      ),
    ).toBeInTheDocument();
  });

  it("renderiza bloco `Rascunhos`", async () => {
    expect(screen.getByText("Rascunhos")).toBeInTheDocument();
    expect(
      screen.getByText("Alteração do Tipo de Alimentação # BEFB9"),
    ).toBeInTheDocument();
    expect(screen.getByText("Dia: 20/08/2025")).toBeInTheDocument();
    expect(
      screen.getByText("Criado em: 23/05/2025 14:56:51"),
    ).toBeInTheDocument();
  });

  const selecionaAlunosTodos = () => {
    const selectAlunosDiv = screen.getByTestId(
      "div-select-alunos-cei-e-ou-emei",
    );
    const selectElementAlunos = selectAlunosDiv.querySelector("select");
    fireEvent.change(selectElementAlunos, {
      target: { value: "TODOS" },
    });
  };

  const selecionaMotivoRPL = () => {
    const selectMotivoDiv = screen.getByTestId("div-select-motivo");
    const selectElementMotivo = selectMotivoDiv.querySelector("select");
    const uuidRPL = mockMotivosAlteracaoCardapio.results.find((motivo) =>
      motivo.nome.includes("RPL"),
    ).uuid;
    fireEvent.change(selectElementMotivo, {
      target: { value: uuidRPL },
    });
  };

  const selecionaTipoAlimentacaoDeRefeicaoDaTarde = () => {
    const selectAlterarAlimentacaoDeDiv = screen.getByTestId(
      "div-alterar-alimentacao-de",
    );
    const selectElementAlterarAlimentacaoDe =
      selectAlterarAlimentacaoDeDiv.querySelector("select");
    const uuidRefeicaoDaTarde =
      mockGetVinculosTipoAlimentacaoPorEscolaCEMEI.results
        .find(
          (v) =>
            v.periodo_escolar.nome === "INTEGRAL" &&
            v.tipo_unidade_escolar.iniciais === "CEI DIRET",
        )
        .tipos_alimentacao.find((ta) => ta.nome === "Refeição da tarde").uuid;
    fireEvent.change(selectElementAlterarAlimentacaoDe, {
      target: { value: uuidRefeicaoDaTarde },
    });
  };

  const selecionaTipoAlimentacaoParaLanche = () => {
    const selectAlterarAlimentacaoParaDiv = screen.getByTestId(
      "div-alterar-alimentacao-para",
    );
    const selectElementAlterarAlimentacaoPara =
      selectAlterarAlimentacaoParaDiv.querySelector("select");
    const uuidLanche = mockGetVinculosTipoAlimentacaoPorEscolaCEMEI.results
      .find(
        (v) =>
          v.periodo_escolar.nome === "INTEGRAL" &&
          v.tipo_unidade_escolar.iniciais === "CEI DIRET",
      )
      .tipos_alimentacao.find((ta) => ta.nome === "Lanche").uuid;
    fireEvent.change(selectElementAlterarAlimentacaoPara, {
      target: { value: uuidLanche },
    });
  };

  const preencherFormularioRPL = async () => {
    selecionaAlunosTodos();
    selecionaMotivoRPL();

    const divInputAlterarDia = screen.getByTestId("div-input-alterar-dia");
    const inputElement = divInputAlterarDia.querySelector("input");
    fireEvent.change(inputElement, {
      target: { value: "30/01/2025" },
    });

    const divCheckboxINTEGRAL = screen.getByTestId("div-checkbox-INTEGRAL");
    const spanElement = divCheckboxINTEGRAL.querySelector("span");
    const inputCheckboxtElement = spanElement.querySelector("input");
    fireEvent.click(inputCheckboxtElement);

    selecionaTipoAlimentacaoDeRefeicaoDaTarde();
    selecionaTipoAlimentacaoParaLanche();

    const inputElementNumeroAlunosFaixa1 = screen.getByTestId(
      `substituicoes[0][cei][faixas_etarias][2][quantidade_alunos]`,
    );
    fireEvent.change(inputElementNumeroAlunosFaixa1, {
      target: { value: "69" },
    });

    const inputElementNumeroAlunosFaixa2 = screen.getByTestId(
      `substituicoes[0][cei][faixas_etarias][3][quantidade_alunos]`,
    );
    fireEvent.change(inputElementNumeroAlunosFaixa2, {
      target: { value: "1" },
    });

    const selectAlterarAlimentacaoDeEMEI = screen.getByTestId(
      "select-alterar-alimentacao-de-EMEI",
    );
    const selectControlDe = within(selectAlterarAlimentacaoDeEMEI).getByRole(
      "combobox",
    );
    fireEvent.mouseDown(selectControlDe);
    fireEvent.click(screen.getByText("Sobremesa"));

    const selectAlterarAlimentacaoParaEMEI = screen.getByTestId(
      "select-alterar-alimentacao-para-EMEI",
    );
    const selectControlPara = within(
      selectAlterarAlimentacaoParaEMEI,
    ).getByRole("combobox");
    fireEvent.mouseDown(selectControlPara);
    fireEvent.click(screen.getAllByText("Lanche")[1]);

    const inputElementNumeroAlunosEMEI = screen.getByTestId(
      `substituicoes[0][emei][quantidade_alunos]`,
    );
    fireEvent.change(inputElementNumeroAlunosEMEI, {
      target: { value: "1" },
    });
  };

  it("renderiza modal para dia selecionado ser menor que 5 dias úteis", async () => {
    selecionaMotivoRPL();
    const divInputAlterarDia = screen.getByTestId("div-input-alterar-dia");
    const inputElement = divInputAlterarDia.querySelector("input");

    expect(screen.queryByText("Atenção")).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        "A solicitação está fora do prazo contratual de cinco dias úteis. Sendo assim, a autorização dependerá de confirmação por parte da empresa terceirizada.",
      ),
    ).not.toBeInTheDocument();

    fireEvent.change(inputElement, {
      target: { value: "30/01/2025" },
    });

    expect(screen.queryByText("Atenção")).toBeInTheDocument();
    expect(
      screen.queryByText(
        "A solicitação está fora do prazo contratual de cinco dias úteis. Sendo assim, a autorização dependerá de confirmação por parte da empresa terceirizada.",
      ),
    ).toBeInTheDocument();
  });

  it("Testa Alteração - Motivo RPL", async () => {
    selecionaAlunosTodos();
    selecionaMotivoRPL();
    expect(screen.getByText("Alterar dia")).toBeInTheDocument();

    const divInputAlterarDia = screen.getByTestId("div-input-alterar-dia");
    const inputElement = divInputAlterarDia.querySelector("input");
    fireEvent.change(inputElement, {
      target: { value: "30/01/2025" },
    });

    expect(screen.getByText("INTEGRAL")).toBeInTheDocument();

    const divCheckboxINTEGRAL = screen.getByTestId("div-checkbox-INTEGRAL");
    const spanElement = divCheckboxINTEGRAL.querySelector("span");
    const inputCheckboxtElement = spanElement.querySelector("input");

    // check período INTEGRAL

    fireEvent.click(inputCheckboxtElement);

    expect(screen.getByText("Alunos CEI")).toBeInTheDocument();

    selecionaTipoAlimentacaoDeRefeicaoDaTarde();
    selecionaTipoAlimentacaoParaLanche();

    const inputElementNumeroAlunosFaixa1 = screen.getByTestId(
      `substituicoes[0][cei][faixas_etarias][2][quantidade_alunos]`,
    );
    fireEvent.change(inputElementNumeroAlunosFaixa1, {
      target: { value: "69" },
    });

    const inputElementNumeroAlunosFaixa2 = screen.getByTestId(
      `substituicoes[0][cei][faixas_etarias][3][quantidade_alunos]`,
    );
    fireEvent.change(inputElementNumeroAlunosFaixa2, {
      target: { value: "1" },
    });

    expect(screen.getByText("Alunos EMEI")).toBeInTheDocument();

    const selectAlterarAlimentacaoDeEMEI = screen.getByTestId(
      "select-alterar-alimentacao-de-EMEI",
    );
    const selectControlDe = within(selectAlterarAlimentacaoDeEMEI).getByRole(
      "combobox",
    );
    fireEvent.mouseDown(selectControlDe);

    const optionDe = screen.getByText("Sobremesa");
    fireEvent.click(optionDe);

    const selectAlterarAlimentacaoParaEMEI = screen.getByTestId(
      "select-alterar-alimentacao-para-EMEI",
    );
    const selectControlPara = within(
      selectAlterarAlimentacaoParaEMEI,
    ).getByRole("combobox");
    fireEvent.mouseDown(selectControlPara);

    const optionPara = screen.getAllByText("Lanche")[1];
    fireEvent.click(optionPara);

    const inputElementNumeroAlunosEMEI = screen.getByTestId(
      `substituicoes[0][emei][quantidade_alunos]`,
    );
    fireEvent.change(inputElementNumeroAlunosEMEI, {
      target: { value: "1" },
    });

    const botaoSalvarRascunho = screen
      .getByText("Salvar rascunho")
      .closest("button");
    fireEvent.click(botaoSalvarRascunho);
  });

  it("Carrega rascunho e envia", async () => {
    const botaoCarregarRascunho = screen.getByTestId(
      "botao-carregar-rascunho-BEFB9",
    );
    await act(async () => {
      fireEvent.click(botaoCarregarRascunho);
    });

    expect(screen.getByText("Solicitação # BEFB9")).toBeInTheDocument();

    const inputElementNumeroAlunosEMEI = screen.getByTestId(
      `substituicoes[0][emei][quantidade_alunos]`,
    );
    expect(inputElementNumeroAlunosEMEI).toHaveAttribute("value", "1");

    const botaoEnviar = screen.getByText("Enviar").closest("button");
    fireEvent.click(botaoEnviar);
  });

  it("Exclui rascunho", async () => {
    window.confirm = jest.fn().mockImplementation(() => true);
    const botaoRemoverRascunho = screen.getByTestId(
      "botao-remover-rascunho-BEFB9",
    );
    mock.onGet("/alteracoes-cardapio-cemei/").reply(200, []);
    await act(async () => {
      fireEvent.click(botaoRemoverRascunho);
    });
    expect(screen.queryByText("Rascunhos")).not.toBeInTheDocument();
  });

  it("Erro ao excluir rascunho", async () => {
    mock
      .onDelete(
        `/alteracoes-cardapio-cemei/${mockAlteracoesCEMEIRascunho.results[0].uuid}/`,
      )
      .reply(400, { detail: "Erro ao excluir rascunho" });
    window.confirm = jest.fn().mockImplementation(() => true);
    const botaoRemoverRascunho = screen.getByTestId(
      "botao-remover-rascunho-BEFB9",
    );
    await act(async () => {
      fireEvent.click(botaoRemoverRascunho);
    });
  });

  it("Testa Alteração - Motivo RPL - Necessário preencher ao menos um período", async () => {
    selecionaAlunosTodos();
    selecionaMotivoRPL();
    expect(screen.getByText("Alterar dia")).toBeInTheDocument();

    const divInputAlterarDia = screen.getByTestId("div-input-alterar-dia");
    const inputElement = divInputAlterarDia.querySelector("input");
    fireEvent.change(inputElement, {
      target: { value: "30/01/2025" },
    });

    expect(screen.getByText("INTEGRAL")).toBeInTheDocument();

    const botaoSalvarRascunho = screen
      .getByText("Salvar rascunho")
      .closest("button");
    fireEvent.click(botaoSalvarRascunho);

    await waitFor(() => {
      expect(
        screen.getByText("Necessário preencher ao menos um período"),
      ).toBeInTheDocument();
    });
  });

  it("Cria nova solicitação e inicia pedido ao enviar", async () => {
    fireEvent.change(
      screen
        .getByTestId("div-select-alunos-cei-e-ou-emei")
        .querySelector("select"),
      { target: { value: "TODOS" } },
    );
    const uuidRPL = mockMotivosAlteracaoCardapio.results.find((m) =>
      m.nome.includes("RPL"),
    ).uuid;
    fireEvent.change(
      screen.getByTestId("div-select-motivo").querySelector("select"),
      { target: { value: uuidRPL } },
    );
    fireEvent.change(
      screen.getByTestId("div-input-alterar-dia").querySelector("input"),
      { target: { value: "20/02/2025" } },
    );
    const span = screen
      .getByTestId("div-checkbox-INTEGRAL")
      .querySelector("span");
    fireEvent.click(span.querySelector("input"));
    fireEvent.change(
      screen.getByTestId("div-alterar-alimentacao-de").querySelector("select"),
      { target: { value: "5bd9ad5c-e0ab-4812-b2b6-336fc89886b1" } },
    );
    fireEvent.change(
      screen
        .getByTestId("div-alterar-alimentacao-para")
        .querySelector("select"),
      { target: { value: "5d1304c8-77a8-4c96-badb-dd2e8c1b76d5" } },
    );
    fireEvent.change(
      screen.getByTestId(
        "substituicoes[0][cei][faixas_etarias][2][quantidade_alunos]",
      ),
      { target: { value: "69" } },
    );
    fireEvent.change(
      screen.getByTestId(
        "substituicoes[0][cei][faixas_etarias][3][quantidade_alunos]",
      ),
      { target: { value: "1" } },
    );
    const de = screen.getByTestId("select-alterar-alimentacao-de-EMEI");
    fireEvent.mouseDown(within(de).getByRole("combobox"));
    fireEvent.click(screen.getByText("Sobremesa"));
    const para = screen.getByTestId("select-alterar-alimentacao-para-EMEI");
    fireEvent.mouseDown(within(para).getByRole("combobox"));
    fireEvent.click(screen.getAllByText("Lanche")[1]);
    fireEvent.change(
      screen.getByTestId("substituicoes[0][emei][quantidade_alunos]"),
      { target: { value: "1" } },
    );

    const botaoEnviar = screen.getByText("Enviar").closest("button");
    await act(async () => {
      fireEvent.click(botaoEnviar);
    });
  });

  it("Exibe erro ao iniciar pedido", async () => {
    mock
      .onPatch(
        "/alteracoes-cardapio-cemei/475907b7-0b66-436d-a624-e18bffe65eb3/inicio-pedido/",
      )
      .reply(400, { detail: "Erro ao iniciar pedido" });
    fireEvent.change(
      screen
        .getByTestId("div-select-alunos-cei-e-ou-emei")
        .querySelector("select"),
      { target: { value: "TODOS" } },
    );
    const uuidRPL = mockMotivosAlteracaoCardapio.results.find((m) =>
      m.nome.includes("RPL"),
    ).uuid;
    fireEvent.change(
      screen.getByTestId("div-select-motivo").querySelector("select"),
      { target: { value: uuidRPL } },
    );
    fireEvent.change(
      screen.getByTestId("div-input-alterar-dia").querySelector("input"),
      { target: { value: "20/02/2025" } },
    );
    const span = screen
      .getByTestId("div-checkbox-INTEGRAL")
      .querySelector("span");
    fireEvent.click(span.querySelector("input"));
    fireEvent.change(
      screen.getByTestId("div-alterar-alimentacao-de").querySelector("select"),
      { target: { value: "5bd9ad5c-e0ab-4812-b2b6-336fc89886b1" } },
    );
    fireEvent.change(
      screen
        .getByTestId("div-alterar-alimentacao-para")
        .querySelector("select"),
      { target: { value: "5d1304c8-77a8-4c96-badb-dd2e8c1b76d5" } },
    );
    fireEvent.change(
      screen.getByTestId(
        "substituicoes[0][cei][faixas_etarias][2][quantidade_alunos]",
      ),
      { target: { value: "69" } },
    );
    fireEvent.change(
      screen.getByTestId(
        "substituicoes[0][cei][faixas_etarias][3][quantidade_alunos]",
      ),
      { target: { value: "1" } },
    );
    const de = screen.getByTestId("select-alterar-alimentacao-de-EMEI");
    fireEvent.mouseDown(within(de).getByRole("combobox"));
    fireEvent.click(screen.getByText("Sobremesa"));
    const para = screen.getByTestId("select-alterar-alimentacao-para-EMEI");
    fireEvent.mouseDown(within(para).getByRole("combobox"));
    fireEvent.click(screen.getAllByText("Lanche")[1]);
    fireEvent.change(
      screen.getByTestId("substituicoes[0][emei][quantidade_alunos]"),
      { target: { value: "1" } },
    );

    const botaoEnviar = screen.getByText("Enviar").closest("button");
    await act(async () => {
      fireEvent.click(botaoEnviar);
    });
  });

  it("Exibe erro ao criar solicitação", async () => {
    mock
      .onPost("/alteracoes-cardapio-cemei/")
      .reply(400, { detail: "Erro ao criar solicitação" });
    await preencherFormularioRPL();

    const botaoSalvarRascunho = screen
      .getByText("Salvar rascunho")
      .closest("button");
    fireEvent.click(botaoSalvarRascunho);
  });

  it("Atualiza rascunho sem iniciar pedido", async () => {
    const botaoCarregarRascunho = screen.getByTestId(
      "botao-carregar-rascunho-BEFB9",
    );
    await act(async () => {
      fireEvent.click(botaoCarregarRascunho);
    });

    const botaoAtualizar = screen
      .getByText("Atualizar rascunho")
      .closest("button");
    fireEvent.click(botaoAtualizar);
  });

  it("Exibe erro ao alterar solicitação", async () => {
    mock
      .onPut(
        `/alteracoes-cardapio-cemei/${mockAlteracoesCEMEIRascunho.results[0].uuid}/`,
      )
      .reply(400, { detail: "Erro ao alterar solicitação" });
    const botaoCarregarRascunho = screen.getByTestId(
      "botao-carregar-rascunho-BEFB9",
    );
    await act(async () => {
      fireEvent.click(botaoCarregarRascunho);
    });

    const botaoAtualizar = screen
      .getByText("Atualizar rascunho")
      .closest("button");
    fireEvent.click(botaoAtualizar);
  });

  it("Exibe erro ao carregar rascunhos após salvar", async () => {
    mock
      .onGet("/alteracoes-cardapio-cemei/")
      .reply(400, { detail: "Erro ao carregar rascunhos" });
    await preencherFormularioRPL();

    const botaoSalvarRascunho = screen
      .getByText("Salvar rascunho")
      .closest("button");
    fireEvent.click(botaoSalvarRascunho);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Erro ao carregar rascunhos de Inclusão de Alimentação.",
        ),
      ).toBeInTheDocument();
    });
  });

  it("Checa lanche emergencial ao selecionar alunos CEI", () => {
    selecionaMotivoRPL();

    const selectAlunosDiv = screen.getByTestId(
      "div-select-alunos-cei-e-ou-emei",
    );
    const selectElementAlunos = selectAlunosDiv.querySelector("select");
    fireEvent.change(selectElementAlunos, {
      target: { value: "CEI" },
    });
  });

  it("Cancelar reseta o formulário", () => {
    selecionaMotivoRPL();

    const botaoCancelar = screen.getByText("Cancelar").closest("button");
    fireEvent.click(botaoCancelar);
  });

  it("Fecha modal de data prioritária", () => {
    selecionaMotivoRPL();

    const divInputAlterarDia = screen.getByTestId("div-input-alterar-dia");
    const inputElement = divInputAlterarDia.querySelector("input");
    fireEvent.change(inputElement, {
      target: { value: "30/01/2025" },
    });

    expect(screen.getByText("Atenção")).toBeInTheDocument();
    const botaoOk = screen.getByText("OK").closest("button");
    fireEvent.click(botaoOk);
  });

  it("Limpa campos ao selecionar o motivo vazio", () => {
    selecionaMotivoRPL();

    const selectMotivoDiv = screen.getByTestId("div-select-motivo");
    const selectElementMotivo = selectMotivoDiv.querySelector("select");
    fireEvent.change(selectElementMotivo, {
      target: { value: "" },
    });
  });

  it("Não exclui rascunho quando a confirmação é cancelada", async () => {
    window.confirm = jest.fn().mockImplementation(() => false);
    const botaoRemoverRascunho = screen.getByTestId(
      "botao-remover-rascunho-BEFB9",
    );
    await act(async () => {
      fireEvent.click(botaoRemoverRascunho);
    });

    expect(screen.getByText("Rascunhos")).toBeInTheDocument();
  });

  it("Abre modal de lanche emergencial ao selecionar alunos CEI após motivo Lanche Emergencial", () => {
    const selectMotivoDiv = screen.getByTestId("div-select-motivo");
    const selectElementMotivo = selectMotivoDiv.querySelector("select");
    const uuidLancheEmergencial = mockMotivosAlteracaoCardapio.results.find(
      (motivo) => motivo.nome.includes("Lanche Emergencial"),
    ).uuid;
    fireEvent.change(selectElementMotivo, {
      target: { value: uuidLancheEmergencial },
    });

    const selectAlunosDiv = screen.getByTestId(
      "div-select-alunos-cei-e-ou-emei",
    );
    const selectElementAlunos = selectAlunosDiv.querySelector("select");
    fireEvent.change(selectElementAlunos, {
      target: { value: "CEI" },
    });

    expect(
      screen.getByText(
        "O lanche emergencial somente é previsto para os alunos da EMEI da CEMEI.",
      ),
    ).toBeInTheDocument();
  });

  it("Limpa alterar dia", () => {
    selecionaMotivoRPL();

    const divInputAlterarDia = screen.getByTestId("div-input-alterar-dia");
    const inputElement = divInputAlterarDia.querySelector("input");
    fireEvent.change(inputElement, {
      target: { value: "30/01/2025" },
    });

    const botaoLimpar = divInputAlterarDia.querySelector(
      ".react-datepicker__close-icon",
    );
    fireEvent.click(botaoLimpar);
  });
});

describe("Teste Formulário Alteração de Cardápio - RPL - CEMEI sem quantidade_alunos", () => {
  const escolaUuid = mockMeusDadosEscolaCEMEI.vinculo_atual.instituicao.uuid;

  const meusDadosSemQuantidade = {
    ...mockMeusDadosEscolaCEMEI,
    vinculo_atual: {
      ...mockMeusDadosEscolaCEMEI.vinculo_atual,
      instituicao: {
        ...mockMeusDadosEscolaCEMEI.vinculo_atual.instituicao,
        quantidade_alunos: 0,
      },
    },
  };

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, meusDadosSemQuantidade);
    mock
      .onGet("/motivos-alteracao-cardapio/")
      .reply(200, mockMotivosAlteracaoCardapio);
    mock.onGet("/dias-uteis/").reply(200, mockDiasUteis);
    mock
      .onGet("/alunos/quantidade-cemei-por-cei-emei/")
      .reply(200, mockQuantidadeAlunoCEMEIporCEIEMEI);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCEMEI);
    mock.onGet("/alteracoes-cardapio-cemei/").reply(200, []);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", `"CEMEI SUZANA CAMPOS TAUIL"`);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
    localStorage.setItem("eh_cemei", "true");

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: meusDadosSemQuantidade,
              setMeusDados: jest.fn(),
            }}
          >
            <AlteracaoDeCardapioCEMEIPage />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("renderiza o formulário sem quantidade_alunos", async () => {
    expect(screen.getByText("Total de Matriculados")).toBeInTheDocument();
    expect(screen.getByText("187")).toBeInTheDocument();
  });
});
