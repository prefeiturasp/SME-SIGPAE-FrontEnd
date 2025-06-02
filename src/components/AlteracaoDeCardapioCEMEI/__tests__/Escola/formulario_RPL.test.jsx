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
import { mockDiasUteis } from "mocks/diasUseisMock";
import { localStorageMock } from "mocks/localStorageMock";
import { mockMeusDadosEscolaCEMEI } from "mocks/meusDados/escola/CEMEI";
import { mockMotivosAlteracaoCardapio } from "mocks/services/alteracaoCardapio.service/motivosAlteracaoCardapio";
import { mockQuantidadeAlunoCEMEIporCEIEMEI } from "mocks/services/aluno.service/CEMEI/quantidadeAlunoCEMEIporCEIEMEI";
import { mockGetVinculosTipoAlimentacaoPorEscolaCEMEI } from "mocks/services/cadastroTipoAlimentacao.service/CEMEI/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockAlteracoesCEMEIRascunho } from "mocks/services/escola.service/CEMEI/alteracoesCEMEIRascunho";
import { AlteracaoDeCardapioCEMEIPage } from "src/pages/Escola/AlteracaoDeCardapioCEMEIPage";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import mock from "src/services/_mock";

jest.setTimeout(10000);

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
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`
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
        `/alteracoes-cardapio-cemei/${mockAlteracoesCEMEIRascunho.results[0].uuid}/`
      )
      .reply(200, {});
    mock
      .onPatch(
        `/alteracoes-cardapio-cemei/${mockAlteracoesCEMEIRascunho.results[0].uuid}/inicio-pedido/`
      )
      .reply(200, {});
    mock
      .onDelete(
        `/alteracoes-cardapio-cemei/${mockAlteracoesCEMEIRascunho.results[0].uuid}/`
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
        </MemoryRouter>
      );
    });
  });

  it("renderiza título da página e o breadcrumb `Alteração do Tipo de Alimentação`", async () => {
    expect(
      screen.queryAllByText("Alteração do Tipo de Alimentação").length
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
        "Informação automática disponibilizada pelo Cadastro da Unidade Escolar"
      )
    ).toBeInTheDocument();
  });

  it("renderiza bloco `Rascunhos`", async () => {
    expect(screen.getByText("Rascunhos")).toBeInTheDocument();
    expect(
      screen.getByText("Alteração do Tipo de Alimentação # BEFB9")
    ).toBeInTheDocument();
    expect(screen.getByText("Dia: 20/08/2025")).toBeInTheDocument();
    expect(
      screen.getByText("Criado em: 23/05/2025 14:56:51")
    ).toBeInTheDocument();
  });

  const selecionaAlunosTodos = () => {
    const selectAlunosDiv = screen.getByTestId(
      "div-select-alunos-cei-e-ou-emei"
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
      motivo.nome.includes("RPL")
    ).uuid;
    fireEvent.change(selectElementMotivo, {
      target: { value: uuidRPL },
    });
  };

  const selecionaTipoAlimentacaoDeRefeicaoDaTarde = () => {
    const selectAlterarAlimentacaoDeDiv = screen.getByTestId(
      "div-alterar-alimentacao-de"
    );
    const selectElementAlterarAlimentacaoDe =
      selectAlterarAlimentacaoDeDiv.querySelector("select");
    const uuidRefeicaoDaTarde =
      mockGetVinculosTipoAlimentacaoPorEscolaCEMEI.results
        .find(
          (v) =>
            v.periodo_escolar.nome === "INTEGRAL" &&
            v.tipo_unidade_escolar.iniciais === "CEI DIRET"
        )
        .tipos_alimentacao.find((ta) => ta.nome === "Refeição da tarde").uuid;
    fireEvent.change(selectElementAlterarAlimentacaoDe, {
      target: { value: uuidRefeicaoDaTarde },
    });
  };

  const selecionaTipoAlimentacaoParaLanche = () => {
    const selectAlterarAlimentacaoParaDiv = screen.getByTestId(
      "div-alterar-alimentacao-para"
    );
    const selectElementAlterarAlimentacaoPara =
      selectAlterarAlimentacaoParaDiv.querySelector("select");
    const uuidLanche = mockGetVinculosTipoAlimentacaoPorEscolaCEMEI.results
      .find(
        (v) =>
          v.periodo_escolar.nome === "INTEGRAL" &&
          v.tipo_unidade_escolar.iniciais === "CEI DIRET"
      )
      .tipos_alimentacao.find((ta) => ta.nome === "Lanche").uuid;
    fireEvent.change(selectElementAlterarAlimentacaoPara, {
      target: { value: uuidLanche },
    });
  };

  it("renderiza modal para dia selecionado ser menor que 5 dias úteis", async () => {
    selecionaMotivoRPL();
    const divInputAlterarDia = screen.getByTestId("div-input-alterar-dia");
    const inputElement = divInputAlterarDia.querySelector("input");

    expect(screen.queryByText("Atenção")).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        "A solicitação está fora do prazo contratual de cinco dias úteis. Sendo assim, a autorização dependerá de confirmação por parte da empresa terceirizada."
      )
    ).not.toBeInTheDocument();

    fireEvent.change(inputElement, {
      target: { value: "30/01/2025" },
    });

    expect(screen.queryByText("Atenção")).toBeInTheDocument();
    expect(
      screen.queryByText(
        "A solicitação está fora do prazo contratual de cinco dias úteis. Sendo assim, a autorização dependerá de confirmação por parte da empresa terceirizada."
      )
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
      `substituicoes[0][cei][faixas_etarias][2][quantidade_alunos]`
    );
    fireEvent.change(inputElementNumeroAlunosFaixa1, {
      target: { value: "69" },
    });

    const inputElementNumeroAlunosFaixa2 = screen.getByTestId(
      `substituicoes[0][cei][faixas_etarias][3][quantidade_alunos]`
    );
    fireEvent.change(inputElementNumeroAlunosFaixa2, {
      target: { value: "1" },
    });

    expect(screen.getByText("Alunos EMEI")).toBeInTheDocument();

    const selectAlterarAlimentacaoDeEMEI = screen.getByTestId(
      "select-alterar-alimentacao-de-EMEI"
    );
    const selectControlDe = within(selectAlterarAlimentacaoDeEMEI).getByRole(
      "combobox"
    );
    fireEvent.mouseDown(selectControlDe);

    const optionDe = screen.getByText("Sobremesa");
    fireEvent.click(optionDe);

    const selectAlterarAlimentacaoParaEMEI = screen.getByTestId(
      "select-alterar-alimentacao-para-EMEI"
    );
    const selectControlPara = within(
      selectAlterarAlimentacaoParaEMEI
    ).getByRole("combobox");
    fireEvent.mouseDown(selectControlPara);

    const optionPara = screen.getAllByText("Lanche")[1];
    fireEvent.click(optionPara);

    const inputElementNumeroAlunosEMEI = screen.getByTestId(
      `substituicoes[0][emei][quantidade_alunos]`
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
      "botao-carregar-rascunho-BEFB9"
    );
    await act(async () => {
      fireEvent.click(botaoCarregarRascunho);
    });

    expect(screen.getByText("Solicitação # BEFB9")).toBeInTheDocument();

    const inputElementNumeroAlunosEMEI = screen.getByTestId(
      `substituicoes[0][emei][quantidade_alunos]`
    );
    expect(inputElementNumeroAlunosEMEI).toHaveAttribute("value", "1");

    const botaoEnviar = screen.getByText("Enviar").closest("button");
    fireEvent.click(botaoEnviar);
  });

  it("Exclui rascunho", async () => {
    window.confirm = jest.fn().mockImplementation(() => true);
    const botaoRemoverRascunho = screen.getByTestId(
      "botao-remover-rascunho-BEFB9"
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
        `/alteracoes-cardapio-cemei/${mockAlteracoesCEMEIRascunho.results[0].uuid}/`
      )
      .reply(400, { detail: "Erro ao excluir rascunho" });
    window.confirm = jest.fn().mockImplementation(() => true);
    const botaoRemoverRascunho = screen.getByTestId(
      "botao-remover-rascunho-BEFB9"
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
        screen.getByText("Necessário preencher ao menos um período")
      ).toBeInTheDocument();
    });
  });
});
