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
import { ToastContainer } from "react-toastify";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockRascunhosInclusaoAlimentacaoCEMEI } from "src/mocks/InclusaoAlimentacao/CEMEI/rascunhos";
import { mockMotivosInclusaoContinua } from "src/mocks/InclusaoAlimentacao/mockMotivosInclusaoContinua";
import { mockMotivosInclusaoNormal } from "src/mocks/InclusaoAlimentacao/mockMotivosInclusaoNormal";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/meusDados/escola/CEMEI";
import { mockQuantidadeAlunoCEMEIporCEIEMEI } from "src/mocks/services/aluno.service/CEMEI/quantidadeAlunoCEMEIporCEIEMEI";
import { mockGetVinculosMotivoEspecificoCEMEI } from "src/mocks/services/cadastroTipoAlimentacao.service/CEMEI/vinculosMotivoEspecifico";
import { mockGetVinculosTipoAlimentacaoPorEscolaCEMEI } from "src/mocks/services/cadastroTipoAlimentacao.service/CEMEI/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockQuantidadeAlunosPorPeriodoCEMEI } from "src/mocks/services/escola.service/CEMEI/quantidadeAlunosPorPeriodo";
import { InclusaoDeAlimentacaoCEMEIPage } from "src/pages/Escola/InclusaoDeAlimentacaoCEMEIPage";
import mock from "src/services/_mock";

describe("Teste Formulário Inclusão de Alimentação - Escola CEMEI", () => {
  const escolaUuid = mockMeusDadosEscolaCEMEI.vinculo_atual.instituicao.uuid;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCEMEI);
    mock
      .onGet("/motivos-inclusao-normal/")
      .reply(200, mockMotivosInclusaoNormal);
    mock
      .onGet("/motivos-inclusao-continua/")
      .reply(200, mockMotivosInclusaoContinua);
    mock
      .onGet(`/quantidade-alunos-por-periodo/escola/${escolaUuid}/`)
      .reply(200, mockQuantidadeAlunosPorPeriodoCEMEI);
    mock
      .onGet("/alunos/quantidade-cemei-por-cei-emei/")
      .reply(200, mockQuantidadeAlunoCEMEIporCEIEMEI);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCEMEI);
    mock.onGet("/dias-uteis/").reply(200, {
      proximos_cinco_dias_uteis: "2025-07-16",
      proximos_dois_dias_uteis: "2025-07-14",
    });
    mock
      .onGet(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/motivo_inclusao_especifico/",
      )
      .reply(200, mockGetVinculosMotivoEspecificoCEMEI);
    mock
      .onGet("/inclusao-alimentacao-cemei/")
      .reply(200, mockRascunhosInclusaoAlimentacaoCEMEI);
    mock
      .onGet("/inclusoes-alimentacao-continua/minhas-solicitacoes/")
      .reply(200, { count: 0, next: null, previous: null, results: [] });

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
            <InclusaoDeAlimentacaoCEMEIPage />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("renderiza título da página e o breadcrumb `Inclusão de Alimentação`", async () => {
    expect(screen.queryAllByText("Inclusão de Alimentação").length).toBe(2);
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
      screen.getByText("Inclusão de Alimentação # 00FA3"),
    ).toBeInTheDocument();
    expect(screen.getByText("1 dia(s)")).toBeInTheDocument();
    expect(
      screen.getByText("Criado em: 08/07/2025 16:02:27"),
    ).toBeInTheDocument();
  });

  const setMotivoValueReposicaoDeAula = () => {
    const selectMotivo = screen.getByTestId("select-motivo-0");
    const selectElement = selectMotivo.querySelector("select");
    const uuidMotivoReposicaoDeAula = mockMotivosInclusaoNormal.results.find(
      (motivo) => motivo.nome === "Reposição de aula",
    ).uuid;
    fireEvent.change(selectElement, {
      target: { value: uuidMotivoReposicaoDeAula },
    });
  };

  const selecionaAlunos = (valor) => {
    const selectAlunosDiv = screen.getByTestId(
      "div-select-alunos-cei-e-ou-emei",
    );
    const selectElementAlunos = selectAlunosDiv.querySelector("select");
    fireEvent.change(selectElementAlunos, {
      target: { value: valor },
    });
  };

  const setupInclusaoNormal = async () => {
    await setMotivoValueReposicaoDeAula();

    const divDia = screen.getByTestId("data-motivo-normal-0");
    const inputElement = divDia.querySelector("input");
    fireEvent.change(inputElement, {
      target: { value: "31/07/2025" },
    });

    selecionaAlunos("TODOS");

    expect(screen.getByText("INTEGRAL")).toBeInTheDocument();

    const divCheckboxINTEGRAL = screen.getByTestId("div-checkbox-INTEGRAL");
    const spanElement = divCheckboxINTEGRAL.querySelector("span");

    await act(async () => {
      fireEvent.click(spanElement);
    });

    expect(screen.getByText("Alunos CEI")).toBeInTheDocument();
    expect(screen.getByText("07 a 11 meses")).toBeInTheDocument();
    expect(screen.getByText("01 ano a 03 anos e 11 meses")).toBeInTheDocument();

    const divInputFaixaEtaria0 = screen.getByTestId(
      "quantidades_periodo[0].faixas.0",
    );
    const inputElementQuantidade0 = divInputFaixaEtaria0.querySelector("input");
    fireEvent.change(inputElementQuantidade0, {
      target: { value: "1" },
    });

    const divInputFaixaEtaria1 = screen.getByTestId(
      "quantidades_periodo[0].faixas.1",
    );
    const inputElementQuantidade1 = divInputFaixaEtaria1.querySelector("input");
    fireEvent.change(inputElementQuantidade1, {
      target: { value: "1" },
    });

    const selectTiposAlimentacaoEMEI = screen.getByTestId(
      "select-tipos-alimentacao",
    );
    const selectControl = within(selectTiposAlimentacaoEMEI).getByRole(
      "combobox",
    );
    fireEvent.mouseDown(selectControl);

    const optionLanche = screen.getByText("Lanche");
    fireEvent.click(optionLanche);

    const divInputAlunosEMEI = screen.getByTestId(
      "quantidades_periodo[0].alunos_emei",
    );
    const inputElementAlunosEMEI = divInputAlunosEMEI.querySelector("input");
    fireEvent.change(inputElementAlunosEMEI, {
      target: { value: "1" },
    });
  };

  it("Salva rascunho inclusão de alimentação CEMEI com sucesso", async () => {
    mock.onPost("/inclusao-alimentacao-cemei/").reply(201, {});
    await setupInclusaoNormal(true);
    const botaoSalvarRascunho = screen
      .getByText("Salvar rascunho")
      .closest("button");
    fireEvent.click(botaoSalvarRascunho);

    await waitFor(() => {
      expect(
        screen.getByText("Solicitação Rascunho criada com sucesso!"),
      ).toBeInTheDocument();
    });
  });

  it("Carrega rascunho e envia", async () => {
    expect(screen.queryByText("INTEGRAL")).not.toBeInTheDocument();

    const botaoCarregarRascunho = screen.getByTestId("botao-carregar-rascunho");
    await act(async () => {
      fireEvent.click(botaoCarregarRascunho);
    });

    expect(screen.getByText("Solicitação # 00FA3")).toBeInTheDocument();

    const divDia = screen.getByTestId("data-motivo-normal-0");
    const inputElement = divDia.querySelector("input");
    expect(inputElement).toHaveAttribute("value", "31/07/2025");

    expect(screen.getByText("INTEGRAL")).toBeInTheDocument();

    mock
      .onPut(
        `/inclusao-alimentacao-cemei/${mockRascunhosInclusaoAlimentacaoCEMEI.results[0].uuid}/`,
      )
      .reply(200, {});
    mock
      .onPatch(
        `/inclusao-alimentacao-cemei/${mockRascunhosInclusaoAlimentacaoCEMEI.results[0].uuid}/inicio-pedido/`,
      )
      .reply(200, {});

    const botaoEnviar = screen.getByText("Enviar inclusão").closest("button");
    fireEvent.click(botaoEnviar);

    await waitFor(() => {
      expect(
        screen.getByText("Inclusão de Alimentação enviada com sucesso!"),
      ).toBeInTheDocument();
    });
  });

  it("Exclui rascunho", async () => {
    mock
      .onDelete(
        `/inclusao-alimentacao-cemei/${mockRascunhosInclusaoAlimentacaoCEMEI.results[0].uuid}/`,
      )
      .reply(204, {});
    window.confirm = jest.fn().mockImplementation(() => true);
    const botaoRemoverRascunho = screen.getByTestId("botao-remover-rascunho");
    await act(async () => {
      fireEvent.click(botaoRemoverRascunho);
    });
    await waitFor(() => {
      expect(
        screen.getByText(
          `Rascunho # ${mockRascunhosInclusaoAlimentacaoCEMEI.results[0].id_externo} excluído com sucesso`,
        ),
      ).toBeInTheDocument();
    });
  });

  it("Erro ao excluir rascunho", async () => {
    mock
      .onDelete(
        `/inclusao-alimentacao-cemei/${mockRascunhosInclusaoAlimentacaoCEMEI.results[0].uuid}/`,
      )
      .reply(400, { detail: "Erro ao excluir rascunho" });
    window.confirm = jest.fn().mockImplementation(() => true);
    const botaoRemoverRascunho = screen.getByTestId("botao-remover-rascunho");
    await act(async () => {
      fireEvent.click(botaoRemoverRascunho);
    });
    await waitFor(() => {
      expect(
        screen.getByText(
          `Houve um erro ao excluir o rascunho: Erro ao excluir rascunho`,
        ),
      ).toBeInTheDocument();
    });
  });

  it("Não exclui rascunho quando a confirmação é negada", async () => {
    window.confirm = jest.fn().mockImplementation(() => false);
    const botaoRemoverRascunho = screen.getByTestId("botao-remover-rascunho");
    await act(async () => {
      fireEvent.click(botaoRemoverRascunho);
    });
    expect(window.confirm).toHaveBeenCalled();
    expect(screen.queryByText(/excluído com sucesso/)).not.toBeInTheDocument();
  });

  it("Exibe erro ao enviar inclusão sem selecionar período", async () => {
    await setMotivoValueReposicaoDeAula();
    const divDia = screen.getByTestId("data-motivo-normal-0");
    const inputElement = divDia.querySelector("input");
    fireEvent.change(inputElement, {
      target: { value: "31/07/2025" },
    });
    selecionaAlunos("TODOS");

    const botaoEnviar = screen.getByText("Enviar inclusão").closest("button");
    fireEvent.click(botaoEnviar);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Necessário selecionar e preencher ao menos um período",
        ),
      ).toBeInTheDocument();
    });
  });

  it("Exibe erro ao enviar inclusão com período selecionado sem quantidades", async () => {
    await setMotivoValueReposicaoDeAula();
    const divDia = screen.getByTestId("data-motivo-normal-0");
    const inputElement = divDia.querySelector("input");
    fireEvent.change(inputElement, {
      target: { value: "31/07/2025" },
    });
    selecionaAlunos("TODOS");

    const divCheckboxINTEGRAL = screen.getByTestId("div-checkbox-INTEGRAL");
    const spanElement = divCheckboxINTEGRAL.querySelector("span");
    await act(async () => {
      fireEvent.click(spanElement);
    });

    const botaoEnviar = screen.getByText("Enviar inclusão").closest("button");
    fireEvent.click(botaoEnviar);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Ao selecionar um período, preencher ao menos uma quantidade de alunos",
        ),
      ).toBeInTheDocument();
    });
  });

  it("Exibe erro ao enviar inclusão com alunos EMEI sem tipo de alimentação", async () => {
    await setMotivoValueReposicaoDeAula();
    const divDia = screen.getByTestId("data-motivo-normal-0");
    const inputElement = divDia.querySelector("input");
    fireEvent.change(inputElement, {
      target: { value: "31/07/2025" },
    });
    selecionaAlunos("TODOS");

    const divCheckboxINTEGRAL = screen.getByTestId("div-checkbox-INTEGRAL");
    const spanElement = divCheckboxINTEGRAL.querySelector("span");
    await act(async () => {
      fireEvent.click(spanElement);
    });

    const divInputAlunosEMEI = screen.getByTestId(
      "quantidades_periodo[0].alunos_emei",
    );
    const inputElementAlunosEMEI = divInputAlunosEMEI.querySelector("input");
    fireEvent.change(inputElementAlunosEMEI, {
      target: { value: "1" },
    });

    const botaoEnviar = screen.getByText("Enviar inclusão").closest("button");
    fireEvent.click(botaoEnviar);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Selecionar alimentação e preencher quantidade de alunos",
        ),
      ).toBeInTheDocument();
    });
  });

  it("Exibe erro ao enviar inclusão com tipo de alimentação sem alunos EMEI", async () => {
    await setMotivoValueReposicaoDeAula();
    const divDia = screen.getByTestId("data-motivo-normal-0");
    const inputElement = divDia.querySelector("input");
    fireEvent.change(inputElement, {
      target: { value: "31/07/2025" },
    });
    selecionaAlunos("TODOS");

    const divCheckboxINTEGRAL = screen.getByTestId("div-checkbox-INTEGRAL");
    const spanElement = divCheckboxINTEGRAL.querySelector("span");
    await act(async () => {
      fireEvent.click(spanElement);
    });

    const selectTiposAlimentacaoEMEI = screen.getByTestId(
      "select-tipos-alimentacao",
    );
    const selectControl = within(selectTiposAlimentacaoEMEI).getByRole(
      "combobox",
    );
    fireEvent.mouseDown(selectControl);
    const optionLanche = screen.getByText("Lanche");
    fireEvent.click(optionLanche);

    const botaoEnviar = screen.getByText("Enviar inclusão").closest("button");
    fireEvent.click(botaoEnviar);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Selecionar alimentação e preencher quantidade de alunos",
        ),
      ).toBeInTheDocument();
    });
  });

  it("Envia inclusão de alimentação CEMEI para validação", async () => {
    mock
      .onPost("/inclusao-alimentacao-cemei/")
      .reply(201, { uuid: "novo-uuid" });
    mock
      .onPatch("/inclusao-alimentacao-cemei/novo-uuid/inicio-pedido/")
      .reply(200, {});

    await setupInclusaoNormal();

    const botaoEnviar = screen.getByText("Enviar inclusão").closest("button");
    fireEvent.click(botaoEnviar);

    await waitFor(() => {
      expect(
        screen.getByText("Inclusão de Alimentação enviada com sucesso!"),
      ).toBeInTheDocument();
    });
  });

  it("Erro ao criar rascunho de inclusão de alimentação CEMEI", async () => {
    mock
      .onPost("/inclusao-alimentacao-cemei/")
      .reply(400, { detail: "Erro ao criar rascunho" });

    await setupInclusaoNormal();

    const botaoSalvarRascunho = screen
      .getByText("Salvar rascunho")
      .closest("button");
    fireEvent.click(botaoSalvarRascunho);

    await waitFor(() => {
      expect(screen.getByText("Erro ao criar rascunho")).toBeInTheDocument();
    });
  });

  it("Atualiza rascunho de inclusão de alimentação CEMEI com sucesso", async () => {
    const botaoCarregarRascunho = screen.getByTestId("botao-carregar-rascunho");
    await act(async () => {
      fireEvent.click(botaoCarregarRascunho);
    });

    mock
      .onPut(
        `/inclusao-alimentacao-cemei/${mockRascunhosInclusaoAlimentacaoCEMEI.results[0].uuid}/`,
      )
      .reply(200, {});

    const botaoAtualizar = screen
      .getByText("Atualizar rascunho")
      .closest("button");
    fireEvent.click(botaoAtualizar);

    await waitFor(() => {
      expect(
        screen.getByText("Rascunho atualizado com sucesso"),
      ).toBeInTheDocument();
    });
  });

  it("Erro ao atualizar rascunho de inclusão de alimentação CEMEI", async () => {
    const botaoCarregarRascunho = screen.getByTestId("botao-carregar-rascunho");
    await act(async () => {
      fireEvent.click(botaoCarregarRascunho);
    });

    mock
      .onPut(
        `/inclusao-alimentacao-cemei/${mockRascunhosInclusaoAlimentacaoCEMEI.results[0].uuid}/`,
      )
      .reply(400, { detail: "Erro ao atualizar rascunho" });

    const botaoAtualizar = screen
      .getByText("Atualizar rascunho")
      .closest("button");
    fireEvent.click(botaoAtualizar);

    await waitFor(() => {
      expect(
        screen.getByText("Erro ao atualizar rascunho"),
      ).toBeInTheDocument();
    });
  });

  it("Erro ao enviar inclusão de alimentação CEMEI para validação", async () => {
    const botaoCarregarRascunho = screen.getByTestId("botao-carregar-rascunho");
    await act(async () => {
      fireEvent.click(botaoCarregarRascunho);
    });

    mock
      .onPut(
        `/inclusao-alimentacao-cemei/${mockRascunhosInclusaoAlimentacaoCEMEI.results[0].uuid}/`,
      )
      .reply(200, {});
    mock
      .onPatch(
        `/inclusao-alimentacao-cemei/${mockRascunhosInclusaoAlimentacaoCEMEI.results[0].uuid}/inicio-pedido/`,
      )
      .reply(400, { detail: "Erro ao iniciar pedido" });

    const botaoEnviar = screen.getByText("Enviar inclusão").closest("button");
    fireEvent.click(botaoEnviar);

    await waitFor(() => {
      expect(screen.getByText("Erro ao iniciar pedido")).toBeInTheDocument();
    });
  });

  it("Exibe modal de data prioritária e fecha", async () => {
    await setMotivoValueReposicaoDeAula();
    const divDia = screen.getByTestId("data-motivo-normal-0");
    const inputElement = divDia.querySelector("input");
    fireEvent.change(inputElement, {
      target: { value: "15/07/2025" },
    });

    await waitFor(() => {
      expect(screen.getByText("Atenção")).toBeInTheDocument();
    });

    const botaoOK = screen.getByText("OK").closest("button");
    fireEvent.click(botaoOK);

    await waitFor(() => {
      expect(screen.queryByText("Atenção")).not.toBeInTheDocument();
    });
  });

  it("Cancela e limpa o formulário", async () => {
    await setMotivoValueReposicaoDeAula();
    expect(screen.getByTestId("data-motivo-normal-0")).toBeInTheDocument();

    const botaoCancelar = screen.getByText("Cancelar").closest("button");
    fireEvent.click(botaoCancelar);

    expect(
      screen.queryByTestId("data-motivo-normal-0"),
    ).not.toBeInTheDocument();
    expect(screen.getAllByText("Nova Solicitação").length).toBeGreaterThan(0);
  });

  it("Salva rascunho com faixa zerada e alunos EMEI", async () => {
    mock.onPost("/inclusao-alimentacao-cemei/").reply(201, {});
    await setMotivoValueReposicaoDeAula();
    const divDia = screen.getByTestId("data-motivo-normal-0");
    const inputElement = divDia.querySelector("input");
    fireEvent.change(inputElement, {
      target: { value: "31/07/2025" },
    });
    selecionaAlunos("TODOS");

    const divCheckboxINTEGRAL = screen.getByTestId("div-checkbox-INTEGRAL");
    const spanElement = divCheckboxINTEGRAL.querySelector("span");
    await act(async () => {
      fireEvent.click(spanElement);
    });

    const divInputFaixaEtaria0 = screen.getByTestId(
      "quantidades_periodo[0].faixas.0",
    );
    const inputElementQuantidade0 = divInputFaixaEtaria0.querySelector("input");
    fireEvent.change(inputElementQuantidade0, {
      target: { value: "0" },
    });

    const selectTiposAlimentacaoEMEI = screen.getByTestId(
      "select-tipos-alimentacao",
    );
    const selectControl = within(selectTiposAlimentacaoEMEI).getByRole(
      "combobox",
    );
    fireEvent.mouseDown(selectControl);
    const optionLanche = screen.getByText("Lanche");
    fireEvent.click(optionLanche);

    const divInputAlunosEMEI = screen.getByTestId(
      "quantidades_periodo[0].alunos_emei",
    );
    const inputElementAlunosEMEI = divInputAlunosEMEI.querySelector("input");
    fireEvent.change(inputElementAlunosEMEI, {
      target: { value: "1" },
    });

    const botaoSalvarRascunho = screen
      .getByText("Salvar rascunho")
      .closest("button");
    fireEvent.click(botaoSalvarRascunho);

    await waitFor(() => {
      expect(
        screen.getByText("Solicitação Rascunho criada com sucesso!"),
      ).toBeInTheDocument();
    });
  });

  it("renderiza campo 'Qual o motivo?' ao selecionar motivo Outro", async () => {
    const selectMotivo = screen.getByTestId("select-motivo-0");
    const selectElement = selectMotivo.querySelector("select");
    const uuidOutro = mockMotivosInclusaoNormal.results.find(
      (motivo) => motivo.nome === "Outro",
    ).uuid;
    fireEvent.change(selectElement, { target: { value: uuidOutro } });

    await waitFor(() => {
      expect(screen.getByText("Qual o motivo?")).toBeInTheDocument();
    });
  });

  it("carrega os períodos ao trocar de motivo específico para normal e selecionar alunos", async () => {
    const selectMotivo = screen.getByTestId("select-motivo-0");
    const selectElement = selectMotivo.querySelector("select");

    const uuidEspecifico = mockMotivosInclusaoNormal.results.find(
      (motivo) => motivo.nome === "Evento Específico",
    ).uuid;
    fireEvent.change(selectElement, {
      target: { value: uuidEspecifico },
    });
    await act(async () => {});

    fireEvent.change(selectElement, {
      target: {
        value: mockMotivosInclusaoNormal.results.find(
          (motivo) => motivo.nome === "Reposição de aula",
        ).uuid,
      },
    });
    await act(async () => {});

    fireEvent.change(
      screen
        .getByTestId("div-select-alunos-cei-e-ou-emei")
        .querySelector("select"),
      { target: { value: "TODOS" } },
    );
    await act(async () => {});

    expect(screen.getByText("INTEGRAL")).toBeInTheDocument();
  });
});

describe("Teste Formulário Inclusão de Alimentação - Escola CEMEI sem quantidade de alunos", () => {
  const escolaUuid = mockMeusDadosEscolaCEMEI.vinculo_atual.instituicao.uuid;

  beforeEach(async () => {
    const meusDadosSemQuantidade = {
      ...mockMeusDadosEscolaCEMEI,
      vinculo_atual: {
        ...mockMeusDadosEscolaCEMEI.vinculo_atual,
        instituicao: {
          ...mockMeusDadosEscolaCEMEI.vinculo_atual.instituicao,
          quantidade_alunos: null,
        },
      },
    };

    mock.onGet("/usuarios/meus-dados/").reply(200, meusDadosSemQuantidade);
    mock
      .onGet("/motivos-inclusao-normal/")
      .reply(200, mockMotivosInclusaoNormal);
    mock
      .onGet("/motivos-inclusao-continua/")
      .reply(200, mockMotivosInclusaoContinua);
    mock
      .onGet(`/quantidade-alunos-por-periodo/escola/${escolaUuid}/`)
      .reply(200, mockQuantidadeAlunosPorPeriodoCEMEI);
    mock
      .onGet("/alunos/quantidade-cemei-por-cei-emei/")
      .reply(200, mockQuantidadeAlunoCEMEIporCEIEMEI);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCEMEI);
    mock.onGet("/dias-uteis/").reply(200, {
      proximos_cinco_dias_uteis: "2025-07-16",
      proximos_dois_dias_uteis: "2025-07-14",
    });
    mock
      .onGet(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/motivo_inclusao_especifico/",
      )
      .reply(200, mockGetVinculosMotivoEspecificoCEMEI);
    mock
      .onGet("/inclusao-alimentacao-cemei/")
      .reply(200, mockRascunhosInclusaoAlimentacaoCEMEI);
    mock
      .onGet("/inclusoes-alimentacao-continua/minhas-solicitacoes/")
      .reply(200, { count: 0, next: null, previous: null, results: [] });

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
            <InclusaoDeAlimentacaoCEMEIPage />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("renderiza bloco de matriculados quando não há quantidade de alunos", async () => {
    await waitFor(() => {
      expect(screen.getByText("Total de Matriculados")).toBeInTheDocument();
    });
    expect(
      screen.getByText(
        "Informação automática disponibilizada pelo Cadastro da Unidade Escolar",
      ),
    ).toBeInTheDocument();
  });
});
