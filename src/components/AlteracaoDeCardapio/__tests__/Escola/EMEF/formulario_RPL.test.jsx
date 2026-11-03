import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockDiasUteis } from "src/mocks/diasUseisMock";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockRascunhoAlteracaoCardapioEMEF } from "src/mocks/services/alteracaoCardapio.service/EMEF/rascunhoAlteracaoCardapio";
import { mockRascunhosAlteracaoCardapioEMEF } from "src/mocks/services/alteracaoCardapio.service/EMEF/rascunhosAlteracaoCardapio";
import { mockMotivosAlteracaoCardapio } from "src/mocks/services/alteracaoCardapio.service/motivosAlteracaoCardapio";
import { mockVinculosTipoAlimentacaoPeriodoEscolarEMEF } from "src/mocks/services/cadastroTipoAlimentacao.service/EMEF/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockQuantidadeAlunosPorPeriodoEMEF } from "src/mocks/services/escola.service/EMEF/quantidadeAlunosPorPeriodoEMEF";
import AlteracaoDeCardapioPage from "src/pages/Escola/AlteracaoDeCardapioPage";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

jest.mock("react-toastify", () => ({
  success: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  POSITION: {
    TOP_CENTER: "top-center",
  },
}));

describe("Teste Formulário Alteração de Cardápio - RPL - EMEF", () => {
  const escolaUuid =
    mockMeusDadosEscolaEMEFPericles.vinculo_atual.instituicao.uuid;

  beforeEach(async () => {
    process.env.IS_TEST = true;

    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock
      .onGet("/motivos-alteracao-cardapio/")
      .reply(200, mockMotivosAlteracaoCardapio);
    mock.onGet("/dias-uteis/").reply(200, mockDiasUteis);
    mock
      .onGet("/alteracoes-cardapio/minhas-solicitacoes/")
      .reply(200, mockRascunhosAlteracaoCardapioEMEF);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockVinculosTipoAlimentacaoPeriodoEscolarEMEF);
    mock
      .onGet(`/quantidade-alunos-por-periodo/escola/${escolaUuid}/`)
      .reply(200, mockQuantidadeAlunosPorPeriodoEMEF);
    mock
      .onPost("/alteracoes-cardapio/")
      .reply(201, mockRascunhoAlteracaoCardapioEMEF);
    mock
      .onPatch(
        `/alteracoes-cardapio/${mockRascunhoAlteracaoCardapioEMEF.uuid}/`,
      )
      .reply(200, mockRascunhoAlteracaoCardapioEMEF);
    mock
      .onPatch(
        `/alteracoes-cardapio/${mockRascunhoAlteracaoCardapioEMEF.uuid}/inicio-pedido/`,
      )
      .reply(200, {
        ...mockRascunhoAlteracaoCardapioEMEF,
        status: "DRE_A_VALIDAR",
      });
    mock
      .onDelete(
        `/alteracoes-cardapio/${mockRascunhoAlteracaoCardapioEMEF.uuid}/`,
      )
      .reply(204, {});

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
            <AlteracaoDeCardapioPage />
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
    expect(screen.getByText("Nº de Matriculados")).toBeInTheDocument();
    expect(screen.getByText("524")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Informação automática disponibilizada pelo Cadastro da Unidade Escolar",
      ),
    ).toBeInTheDocument();
  });

  it("renderiza bloco `Rascunhos`", async () => {
    expect(screen.getByText("Rascunhos")).toBeInTheDocument();
    expect(
      screen.getByText("Alteração do Tipo de Alimentação # 807A8"),
    ).toBeInTheDocument();
    expect(screen.getByText("Dia: 18/06/2025")).toBeInTheDocument();
    expect(
      screen.getByText("Salvo em: 13/03/2025 10:12:31"),
    ).toBeInTheDocument();
  });

  const selecionaMotivoRPL = async () => {
    const selectMotivoDiv = screen.getByTestId("div-select-motivo");
    const selectElementMotivo = selectMotivoDiv.querySelector("select");
    const uuidRPL = mockMotivosAlteracaoCardapio.results.find((motivo) =>
      motivo.nome.includes("RPL"),
    ).uuid;
    await act(async () => {
      fireEvent.change(selectElementMotivo, {
        target: { value: uuidRPL },
      });
    });
  };

  it("renderiza modal para dia selecionado ser menor que 5 dias úteis", async () => {
    await selecionaMotivoRPL();
    const divInputAlterarDia = screen.getByTestId("div-input-alterar-dia");
    const inputElement = divInputAlterarDia.querySelector("input");

    expect(screen.queryByText("Atenção")).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        "A solicitação está fora do prazo contratual de cinco dias úteis. Sendo assim, a autorização dependerá de confirmação por parte da empresa terceirizada.",
      ),
    ).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.change(inputElement, {
        target: { value: "30/01/2025" },
      });
    });

    expect(screen.queryByText("Atenção")).toBeInTheDocument();
    expect(
      screen.queryByText(
        "A solicitação está fora do prazo contratual de cinco dias úteis. Sendo assim, a autorização dependerá de confirmação por parte da empresa terceirizada.",
      ),
    ).toBeInTheDocument();
  });

  const selectOption = async (container, optionText) => {
    const select = container.querySelector("select");
    const option = Array.from(select.options).find(
      (opt) => opt.text === optionText,
    );
    await act(async () => {
      fireEvent.change(select, { target: { value: option.value } });
    });
  };

  const preencherFormularioRPL = async (
    opcaoDe = "Refeição",
    opcaoPara = "Lanche",
  ) => {
    await selecionaMotivoRPL();

    const divInputAlterarDia = screen.getByTestId("div-input-alterar-dia");
    const inputElement = divInputAlterarDia.querySelector("input");
    await act(async () => {
      fireEvent.change(inputElement, {
        target: { value: "30/01/2025" },
      });
    });

    const divCheckboxMANHA = screen.getByTestId("div-checkbox-MANHA");
    const spanElement = divCheckboxMANHA.querySelector("span");
    await act(async () => {
      fireEvent.click(spanElement);
    });

    await selectOption(
      screen.getByTestId("select-tipos-alimentacao-de-MANHA"),
      opcaoDe,
    );
    await selectOption(
      screen.getByTestId("select-tipos-alimentacao-para-MANHA"),
      opcaoPara,
    );

    const divInputNumeroAlunosMANHA = screen.getByTestId(
      "div-input-numero-alunos-MANHA",
    );
    const inputElementNumeroAlunosMANHA =
      divInputNumeroAlunosMANHA.querySelector("input");
    await act(async () => {
      fireEvent.change(inputElementNumeroAlunosMANHA, {
        target: { value: "123" },
      });
    });

    const textarea = screen.getByTestId("ckeditor-mock");
    await act(async () => {
      fireEvent.change(textarea, {
        target: { value: "justificativa da alteração" },
      });
    });
    await waitFor(() => {
      expect(textarea.value).toBe("justificativa da alteração");
    });
  };

  it("Testa Alteração - Motivo RPL", async () => {
    await selecionaMotivoRPL();
    expect(screen.getByText("Alterar dia")).toBeInTheDocument();

    const divInputAlterarDia = screen.getByTestId("div-input-alterar-dia");
    const inputElement = divInputAlterarDia.querySelector("input");
    await act(async () => {
      fireEvent.change(inputElement, {
        target: { value: "30/01/2025" },
      });
    });

    const divCheckboxMANHA = screen.getByTestId("div-checkbox-MANHA");
    const spanElement = divCheckboxMANHA.querySelector("span");
    await act(async () => {
      fireEvent.click(spanElement);
    });

    await selectOption(
      screen.getByTestId("select-tipos-alimentacao-de-MANHA"),
      "Refeição",
    );

    await selectOption(
      screen.getByTestId("select-tipos-alimentacao-para-MANHA"),
      "Lanche",
    );

    const divInputNumeroAlunosMANHA = screen.getByTestId(
      "div-input-numero-alunos-MANHA",
    );
    const inputElementNumeroAlunosMANHA =
      divInputNumeroAlunosMANHA.querySelector("input");
    await act(async () => {
      fireEvent.change(inputElementNumeroAlunosMANHA, {
        target: { value: "123" },
      });
    });

    const textarea = screen.getByTestId("ckeditor-mock");
    await act(async () => {
      fireEvent.change(textarea, {
        target: { value: "justificativa da alteração" },
      });
    });
    await waitFor(() => {
      expect(textarea.value).toBe("justificativa da alteração");
    });

    const botaoSalvarRascunho = screen
      .getByText("Salvar rascunho")
      .closest("button");
    await act(async () => {
      fireEvent.click(botaoSalvarRascunho);
    });
  });

  it("Carrega rascunho e envia", async () => {
    const botaoCarregarRascunho = screen.getByTestId("botao-carregar-rascunho");
    await act(async () => {
      fireEvent.click(botaoCarregarRascunho);
    });

    expect(screen.getByText("Solicitação # 807A8")).toBeInTheDocument();

    const divInputNumeroAlunosMANHA = screen.getByTestId(
      "div-input-numero-alunos-MANHA",
    );
    const inputElementNumeroAlunosMANHA =
      divInputNumeroAlunosMANHA.querySelector("input");
    expect(inputElementNumeroAlunosMANHA).toHaveAttribute("value", "123");

    const botaoEnviar = screen.getByText("Enviar").closest("button");
    await act(async () => {
      fireEvent.click(botaoEnviar);
    });
  });

  it("Exclui rascunho", async () => {
    window.confirm = jest.fn().mockImplementation(() => true);
    const botaoRemoverRascunho = screen.getByTestId("botao-remover-rascunho");
    mock
      .onGet("/alteracoes-cardapio/minhas-solicitacoes/")
      .reply(200, { results: [] });
    await act(async () => {
      fireEvent.click(botaoRemoverRascunho);
    });
    expect(screen.queryByText("Rascunhos")).not.toBeInTheDocument();
  });

  it("Erro ao excluir rascunho", async () => {
    mock
      .onDelete(
        `/alteracoes-cardapio/${mockRascunhoAlteracaoCardapioEMEF.uuid}/`,
      )
      .reply(400, { detail: "Erro ao excluir rascunho" });
    window.confirm = jest.fn().mockImplementation(() => true);
    const botaoRemoverRascunho = screen.getByTestId("botao-remover-rascunho");
    await act(async () => {
      fireEvent.click(botaoRemoverRascunho);
    });
  });

  it("Valida formulário: exibe erro ao submeter sem selecionar período", async () => {
    await selecionaMotivoRPL();

    const botaoSalvarRascunho = screen
      .getByText("Salvar rascunho")
      .closest("button");
    await act(async () => {
      fireEvent.click(botaoSalvarRascunho);
    });
  });

  it("Exibe erro ao submeter sem informar o alterar dia", async () => {
    await selecionaMotivoRPL();

    const divCheckboxMANHA = screen.getByTestId("div-checkbox-MANHA");
    const spanElement = divCheckboxMANHA.querySelector("span");
    await act(async () => {
      fireEvent.click(spanElement);
    });

    await selectOption(
      screen.getByTestId("select-tipos-alimentacao-de-MANHA"),
      "Refeição",
    );
    await selectOption(
      screen.getByTestId("select-tipos-alimentacao-para-MANHA"),
      "Lanche",
    );

    const divInputNumeroAlunosMANHA = screen.getByTestId(
      "div-input-numero-alunos-MANHA",
    );
    const inputElementNumeroAlunosMANHA =
      divInputNumeroAlunosMANHA.querySelector("input");
    await act(async () => {
      fireEvent.change(inputElementNumeroAlunosMANHA, {
        target: { value: "123" },
      });
    });

    const botaoSalvarRascunho = screen
      .getByText("Salvar rascunho")
      .closest("button");
    await act(async () => {
      fireEvent.click(botaoSalvarRascunho);
    });
  });

  it("Cria nova solicitação e inicia pedido ao enviar", async () => {
    await preencherFormularioRPL();

    const botaoEnviar = screen.getByText("Enviar").closest("button");
    await act(async () => {
      fireEvent.click(botaoEnviar);
    });
  });

  it("Exibe erro ao iniciar pedido", async () => {
    mock
      .onPatch(
        `/alteracoes-cardapio/${mockRascunhoAlteracaoCardapioEMEF.uuid}/inicio-pedido/`,
      )
      .reply(400, { detail: "Erro ao iniciar pedido" });
    await preencherFormularioRPL();

    const botaoEnviar = screen.getByText("Enviar").closest("button");
    await act(async () => {
      fireEvent.click(botaoEnviar);
    });
  });

  it("Exibe erro ao criar solicitação", async () => {
    mock
      .onPost("/alteracoes-cardapio/")
      .reply(400, { detail: "Erro ao criar solicitação" });
    await preencherFormularioRPL();

    const botaoSalvarRascunho = screen
      .getByText("Salvar rascunho")
      .closest("button");
    await act(async () => {
      fireEvent.click(botaoSalvarRascunho);
    });
  });

  it("Atualiza rascunho salvo sem iniciar pedido", async () => {
    const botaoCarregarRascunho = screen.getByTestId("botao-carregar-rascunho");
    await act(async () => {
      fireEvent.click(botaoCarregarRascunho);
    });

    const botaoAtualizar = screen
      .getByText("Atualizar rascunho")
      .closest("button");
    await act(async () => {
      fireEvent.click(botaoAtualizar);
    });
  });

  it("Exibe erro ao alterar solicitação", async () => {
    mock
      .onPatch(
        `/alteracoes-cardapio/${mockRascunhoAlteracaoCardapioEMEF.uuid}/`,
      )
      .reply(400, { detail: "Erro ao alterar solicitação" });
    const botaoCarregarRascunho = screen.getByTestId("botao-carregar-rascunho");
    await act(async () => {
      fireEvent.click(botaoCarregarRascunho);
    });

    const botaoAtualizar = screen
      .getByText("Atualizar rascunho")
      .closest("button");
    await act(async () => {
      fireEvent.click(botaoAtualizar);
    });
  });

  it("Não exclui rascunho quando a confirmação é cancelada", async () => {
    window.confirm = jest.fn().mockImplementation(() => false);
    const botaoRemoverRascunho = screen.getByTestId("botao-remover-rascunho");
    await act(async () => {
      fireEvent.click(botaoRemoverRascunho);
    });
    expect(screen.getByText("Rascunhos")).toBeInTheDocument();
  });

  it("Exibe erro ao carregar rascunhos após excluir", async () => {
    window.confirm = jest.fn().mockImplementation(() => true);
    mock
      .onGet("/alteracoes-cardapio/minhas-solicitacoes/")
      .reply(400, { detail: "Erro ao carregar rascunhos" });
    const botaoRemoverRascunho = screen.getByTestId("botao-remover-rascunho");
    await act(async () => {
      fireEvent.click(botaoRemoverRascunho);
    });

    expect(
      screen.getByText(
        "Erro ao carregar rascunhos. Tente novamente mais tarde.",
      ),
    ).toBeInTheDocument();
  });

  it("Cancelar reseta o formulário", async () => {
    await selecionaMotivoRPL();

    const botaoCancelar = screen.getByText("Cancelar").closest("button");
    await act(async () => {
      fireEvent.click(botaoCancelar);
    });
  });

  it("Fecha modal de data prioritária", async () => {
    await selecionaMotivoRPL();
    const divInputAlterarDia = screen.getByTestId("div-input-alterar-dia");
    const inputElement = divInputAlterarDia.querySelector("input");
    await act(async () => {
      fireEvent.change(inputElement, {
        target: { value: "30/01/2025" },
      });
    });

    expect(screen.getByText("Atenção")).toBeInTheDocument();
    const botaoOk = screen.getByText("OK").closest("button");
    await act(async () => {
      fireEvent.click(botaoOk);
    });
  });

  it("renderiza opções de alimentação para um motivo sem classificação RPL/LPR/Lanche Emergencial", async () => {
    const selectMotivoDiv = screen.getByTestId("div-select-motivo");
    const selectElementMotivo = selectMotivoDiv.querySelector("select");
    const uuidNeutro = mockMotivosAlteracaoCardapio.results.find(
      (motivo) => motivo.nome === "Alteração de Cardápio",
    ).uuid;
    await act(async () => {
      fireEvent.change(selectElementMotivo, {
        target: { value: uuidNeutro },
      });
    });

    expect(screen.getByTestId("div-checkbox-MANHA")).toBeInTheDocument();
    expect(screen.getByTestId("div-checkbox-TARDE")).toBeInTheDocument();
  });

  it("renderiza opções de alimentação para o motivo LPR", async () => {
    const selectMotivoDiv = screen.getByTestId("div-select-motivo");
    const selectElementMotivo = selectMotivoDiv.querySelector("select");
    const uuidLPR = mockMotivosAlteracaoCardapio.results.find((motivo) =>
      motivo.nome.includes("LPR"),
    ).uuid;
    await act(async () => {
      fireEvent.change(selectElementMotivo, {
        target: { value: uuidLPR },
      });
    });

    expect(screen.getByTestId("div-checkbox-MANHA")).toBeInTheDocument();
    expect(screen.getByTestId("div-checkbox-TARDE")).toBeInTheDocument();
  });

  it("renderiza select simples com Refeição e Sobremesa e sem a opção Todos", async () => {
    await selecionaMotivoRPL();

    const selectDe = screen
      .getByTestId("select-tipos-alimentacao-de-MANHA")
      .querySelector("select");
    const selectPara = screen
      .getByTestId("select-tipos-alimentacao-para-MANHA")
      .querySelector("select");

    const opcoesDe = Array.from(selectDe.options).map((option) => option.text);
    const opcoesPara = Array.from(selectPara.options).map(
      (option) => option.text,
    );

    expect(selectDe.tagName).toBe("SELECT");
    expect(selectPara.tagName).toBe("SELECT");
    expect(opcoesDe).toContain("Refeição e Sobremesa");
    expect(opcoesDe).toContain("Refeição");
    expect(opcoesDe).not.toContain("Sobremesa");
    expect(opcoesDe).not.toContain("Todos");
    expect(opcoesPara).not.toContain("Todos");
  });

  it("carrega rascunho preenchendo os selects de alimentação", async () => {
    const botaoCarregarRascunho = screen.getByTestId("botao-carregar-rascunho");
    await act(async () => {
      fireEvent.click(botaoCarregarRascunho);
    });

    const selectDe = screen
      .getByTestId("select-tipos-alimentacao-de-MANHA")
      .querySelector("select");
    const selectPara = screen
      .getByTestId("select-tipos-alimentacao-para-MANHA")
      .querySelector("select");

    expect(selectDe.value).toBe("65f11f11-630b-4629-bb17-07c875c548f1");
    expect(selectPara.value).toBe("5d1304c8-77a8-4c96-badb-dd2e8c1b76d5");
  });

  it("expande Refeição e Sobremesa nos uuids de Refeição e Sobremesa ao salvar", async () => {
    mock.resetHistory();
    await preencherFormularioRPL("Refeição e Sobremesa", "Lanche");

    const botaoSalvarRascunho = screen
      .getByText("Salvar rascunho")
      .closest("button");
    await act(async () => {
      fireEvent.click(botaoSalvarRascunho);
    });

    await waitFor(() => {
      expect(mock.history.post.length).toBeGreaterThan(0);
    });
    const payload = JSON.parse(mock.history.post[0].data);
    const substituicao = payload.substituicoes.find(
      (sub) => sub.periodo_escolar,
    );

    expect(substituicao.tipos_alimentacao_de).toEqual([
      "65f11f11-630b-4629-bb17-07c875c548f1",
      "5aa2c32b-1df2-46b6-b2e7-514b885fa9a4",
    ]);
    expect(substituicao.tipos_alimentacao_para).toEqual([
      "5d1304c8-77a8-4c96-badb-dd2e8c1b76d5",
    ]);
  });

  it("Desmarca período selecionado", async () => {
    await selecionaMotivoRPL();

    const divCheckboxMANHA = screen.getByTestId("div-checkbox-MANHA");
    await act(async () => {
      fireEvent.click(divCheckboxMANHA.querySelector("span"));
    });
    await act(async () => {
      fireEvent.click(divCheckboxMANHA.querySelector("span"));
    });
  });

  it("Marca e desmarca período pelo teclado", async () => {
    await selecionaMotivoRPL();

    const divCheckboxMANHA = screen.getByTestId("div-checkbox-MANHA");
    await act(async () => {
      fireEvent.keyDown(divCheckboxMANHA.querySelector("span"), {
        key: "Enter",
      });
    });
    await act(async () => {
      fireEvent.keyDown(divCheckboxMANHA.querySelector("span"), { key: " " });
    });
    await act(async () => {
      fireEvent.keyDown(divCheckboxMANHA.querySelector("span"), { key: "a" });
    });
  });

  it("Valida número de alunos quando a escola não possui alunos regulares", async () => {
    localStorage.setItem("possui_alunos_regulares", "false");
    await preencherFormularioRPL();

    const botaoSalvarRascunho = screen
      .getByText("Salvar rascunho")
      .closest("button");
    await act(async () => {
      fireEvent.click(botaoSalvarRascunho);
    });

    localStorage.removeItem("possui_alunos_regulares");
  });

  it("Remove rascunho pelo teclado", async () => {
    window.confirm = jest.fn().mockImplementation(() => true);
    const botaoRemoverRascunho = screen.getByTestId("botao-remover-rascunho");
    await act(async () => {
      fireEvent.keyDown(botaoRemoverRascunho, { key: "Enter" });
    });
    await act(async () => {
      fireEvent.keyDown(screen.getByTestId("botao-remover-rascunho"), {
        key: " ",
      });
    });
    await act(async () => {
      fireEvent.keyDown(screen.getByTestId("botao-remover-rascunho"), {
        key: "a",
      });
    });
  });

  it("Carrega rascunho pelo teclado", async () => {
    const botaoCarregarRascunho = screen.getByTestId("botao-carregar-rascunho");
    await act(async () => {
      fireEvent.keyDown(botaoCarregarRascunho, { key: "Enter" });
    });
    await act(async () => {
      fireEvent.keyDown(screen.getByTestId("botao-carregar-rascunho"), {
        key: " ",
      });
    });
    await act(async () => {
      fireEvent.keyDown(screen.getByTestId("botao-carregar-rascunho"), {
        key: "a",
      });
    });
  });
});
