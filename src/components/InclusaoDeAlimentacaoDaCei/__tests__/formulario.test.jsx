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
import { mockMotivosInclusaoNormal } from "mocks/InclusaoAlimentacao/mockMotivosInclusaoNormal";
import { mockDiasUteis } from "mocks/diasUseisMock";
import { localStorageMock } from "mocks/localStorageMock";
import { mockMeusDadosEscolaCEIcomMANHAeTARDE } from "mocks/meusDados/escola/CEIcomMANHAeTARDE";
import { mockVinculosTipoAlimentacaoPeriodoEscolarCEIComManhaTarde } from "mocks/services/cadastroTipoAlimentacao.service/CEI/vinculosTipoAlimentacaoPeriodoEscolarComManhaTarde";
import { mockQuantidadeAlunosFaixaEtariaEscolaCEIINTEGRAL } from "mocks/services/inclusaoDeAlimentacao/escola.service/CEI/quantidadeAlunosFaixaEtariaINTEGRAL";
import { mockQuantidadeAlunosFaixaEtariaEscolaCEIMANHA } from "mocks/services/inclusaoDeAlimentacao/escola.service/CEI/quantidadeAlunosFaixaEtariaMANHA";
import { mockQuantidadeAlunosFaixaEtariaEscolaCEITARDE } from "mocks/services/inclusaoDeAlimentacao/escola.service/CEI/quantidadeAlunosFaixaEtariaTARDE";
import { mockRascunhosInclusaoAlimentacaoEscolaCEIManhaETarde } from "mocks/services/inclusaoDeAlimentacao/escola.service/CEI/rascunhos";
import { MemoryRouter } from "react-router-dom";
import { InclusaoDeAlimentacaoCEIPage } from "src/pages/Escola/InclusaoDeAlimentacaoCEIPage";
import { ToastContainer } from "react-toastify";
import mock from "src/services/_mock";

describe("Teste Formulário Inclusão de Alimentação - CEI", () => {
  const escolaUuid =
    mockMeusDadosEscolaCEIcomMANHAeTARDE.vinculo_atual.instituicao.uuid;
  const hoje = new Date().toISOString().split("T")[0];

  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaCEIcomMANHAeTARDE);
    mock
      .onGet("/motivos-inclusao-normal/")
      .reply(200, mockMotivosInclusaoNormal);
    mock.onGet("/dias-uteis/").reply(200, mockDiasUteis);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`
      )
      .reply(200, mockVinculosTipoAlimentacaoPeriodoEscolarCEIComManhaTarde);
    mock
      .onGet("/inclusoes-alimentacao-da-cei/minhas-solicitacoes/")
      .reply(200, mockRascunhosInclusaoAlimentacaoEscolaCEIManhaETarde);
    mock.onPost("/inclusoes-alimentacao-da-cei/").reply(201, {});
    mock
      .onPut(
        `/inclusoes-alimentacao-da-cei/${mockRascunhosInclusaoAlimentacaoEscolaCEIManhaETarde.results[0].uuid}/`
      )
      .reply(200, {
        uuid: mockRascunhosInclusaoAlimentacaoEscolaCEIManhaETarde.results[0]
          .uuid,
      });
    mock
      .onPatch(
        `/inclusoes-alimentacao-da-cei/${mockRascunhosInclusaoAlimentacaoEscolaCEIManhaETarde.results[0].uuid}/inicio-pedido/`
      )
      .reply(200, {});

    const mocksQuantidadeALunosFaixaEtaria = [
      mockQuantidadeAlunosFaixaEtariaEscolaCEIINTEGRAL,
      mockQuantidadeAlunosFaixaEtariaEscolaCEIMANHA,
      mockQuantidadeAlunosFaixaEtariaEscolaCEITARDE,
    ];
    for (const [
      index,
      uuidPeriodoEscolar,
    ] of mockVinculosTipoAlimentacaoPeriodoEscolarCEIComManhaTarde.results
      .map((res) => res.periodo_escolar.uuid)
      .entries()) {
      mock
        .onGet(
          `/quantidade-alunos-por-periodo/${uuidPeriodoEscolar}/alunos-por-faixa-etaria/${hoje}/`
        )
        .reply(200, mocksQuantidadeALunosFaixaEtaria[index]);
    }

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", `"CEI DIRET NEIDE KETELHUT"`);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
    localStorage.setItem("eh_cei", "true");

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
              meusDados: mockMeusDadosEscolaCEIcomMANHAeTARDE,
              setMeusDados: jest.fn(),
            }}
          >
            <InclusaoDeAlimentacaoCEIPage />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("renderiza título da página e o breadcrumb `Inclusão de Alimentação`", async () => {
    expect(screen.queryAllByText("Inclusão de Alimentação").length).toBe(2);
  });

  it("renderiza bloco com número de matriculados", async () => {
    expect(screen.getByText("Nº de Matriculados")).toBeInTheDocument();
    expect(screen.getByText("229")).toBeInTheDocument();

    expect(
      screen.getByText(
        "Informação automática disponibilizada pelo Cadastro da Unidade Escolar"
      )
    ).toBeInTheDocument();
  });

  it("renderiza bloco `Rascunhos`", async () => {
    expect(screen.getByText("Rascunhos")).toBeInTheDocument();
    expect(
      screen.getByText("Inclusão de Alimentação # A38E6")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Criado em: 27/05/2025 15:58:05")
    ).toBeInTheDocument();
  });

  const selecionaMotivoReposicaoDeAula = () => {
    const selectMotivoDiv = screen.getByTestId("div-select-motivo");
    const selectElementMotivo = selectMotivoDiv.querySelector("select");
    const uuidReposicaoDeAula = mockMotivosInclusaoNormal.results.find(
      (motivo) => motivo.nome.includes("Reposição de aula")
    ).uuid;
    fireEvent.change(selectElementMotivo, {
      target: { value: uuidReposicaoDeAula },
    });
  };

  it("salva rascunho", async () => {
    selecionaMotivoReposicaoDeAula();

    const divDia = screen.getByTestId("data-motivo-normal-0");
    const inputElement = divDia.querySelector("input");
    fireEvent.change(inputElement, {
      target: { value: "30/05/2025" },
    });

    const spanINTEGRALdeFora = screen.getByTestId("span-INTEGRAL");
    fireEvent.click(spanINTEGRALdeFora);

    await waitFor(() => {
      expect(screen.queryAllByText("INTEGRAL")).toHaveLength(2);
    });

    const spanINTEGRALdeDentro = screen.getByTestId("span-dentro-INTEGRAL");
    fireEvent.click(spanINTEGRALdeDentro);

    await waitFor(() => {
      expect(
        screen.getByText("Tipos de Alimentação do período integral:")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("Lanche, Desjejum, Almoço, Colação, Refeição da tarde")
    ).toBeInTheDocument();

    const inputElementNumeroAlunosFaixaIntegral = screen.getByTestId(
      `periodos_e_faixas[0].periodos[0].faixas_etarias[0].quantidade_alunos`
    );
    fireEvent.change(inputElementNumeroAlunosFaixaIntegral, {
      target: { value: "1" },
    });

    const spanMANHAdeFora = screen.getByTestId("span-MANHA");
    fireEvent.click(spanMANHAdeFora);

    await waitFor(() => {
      expect(
        screen.getByText("Tipos de Alimentação do período manha:")
      ).toBeInTheDocument();
    });

    const inputElementNumeroAlunosFaixaManha = screen.getByTestId(
      `periodos_e_faixas[1].faixas_etarias[0].quantidade_alunos`
    );
    fireEvent.change(inputElementNumeroAlunosFaixaManha, {
      target: { value: "88" },
    });

    const botaoSalvarRascunho = screen
      .getByText("Salvar rascunho")
      .closest("button");
    fireEvent.click(botaoSalvarRascunho);

    await waitFor(() => {
      expect(
        screen.getByText("Solicitação Rascunho criada com sucesso!")
      ).toBeInTheDocument();
    });
  });

  it("carrega rascunho e envia", async () => {
    const botaoCarregarRascunho = screen.getByTestId("botao-carregar-rascunho");
    fireEvent.click(botaoCarregarRascunho);

    await waitFor(() => {
      expect(screen.getByText("Solicitação # A38E6")).toBeInTheDocument();
      expect(screen.queryAllByText("INTEGRAL")).toHaveLength(2);
      expect(screen.getByText("Atualizar rascunho")).toBeInTheDocument();
    });

    const botaoEnviar = screen.getByText("Enviar").closest("button");
    fireEvent.click(botaoEnviar);

    await waitFor(() => {
      expect(
        screen.getByText("Inclusão de Alimentação enviada com sucesso!")
      ).toBeInTheDocument();
    });
  });

  it("exibe erro `Necessário selecionar ao menos período e preencher uma faixa etária`", async () => {
    selecionaMotivoReposicaoDeAula();

    const divDia = screen.getByTestId("data-motivo-normal-0");
    const inputElement = divDia.querySelector("input");
    fireEvent.change(inputElement, {
      target: { value: "30/05/2025" },
    });

    const spanINTEGRALdeFora = screen.getByTestId("span-INTEGRAL");
    fireEvent.click(spanINTEGRALdeFora);

    await waitFor(() => {
      expect(screen.queryAllByText("INTEGRAL")).toHaveLength(2);
    });

    const spanINTEGRALdeDentro = screen.getByTestId("span-dentro-INTEGRAL");
    fireEvent.click(spanINTEGRALdeDentro);

    const botaoSalvarRascunho = screen
      .getByText("Salvar rascunho")
      .closest("button");
    fireEvent.click(botaoSalvarRascunho);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Necessário selecionar ao menos período e preencher uma faixa etária"
        )
      ).toBeInTheDocument();
    });
  });

  it("Exclui rascunho", async () => {
    mock
      .onDelete(
        `/inclusoes-alimentacao-da-cei/${mockRascunhosInclusaoAlimentacaoEscolaCEIManhaETarde.results[0].uuid}/`
      )
      .replyOnce(204, {});
    window.confirm = jest.fn().mockImplementation(() => true);
    const botaoRemoverRascunho = screen.getByTestId("botao-remover-rascunho");
    mock
      .onGet("/inclusoes-alimentacao-da-cei/minhas-solicitacoes/")
      .reply(200, []);
    await act(async () => {
      fireEvent.click(botaoRemoverRascunho);
    });
    await waitFor(() => {
      expect(screen.getByText(`Rascunho # A38E6 excluído com sucesso`));
    });
    expect(screen.queryByText("Rascunhos")).not.toBeInTheDocument();
  });

  it("Erro ao excluir rascunho", async () => {
    mock
      .onDelete(
        `/inclusoes-alimentacao-da-cei/${mockRascunhosInclusaoAlimentacaoEscolaCEIManhaETarde.results[0].uuid}/`
      )
      .replyOnce(400, { detail: "Erro ao excluir rascunho" });
    window.confirm = jest.fn().mockImplementation(() => true);
    const botaoRemoverRascunho = screen.getByTestId("botao-remover-rascunho");
    await act(async () => {
      fireEvent.click(botaoRemoverRascunho);
    });
    await waitFor(() => {
      expect(
        screen.getByText(
          "Houve um erro ao excluir o rascunho. Tente novamente mais tarde."
        )
      ).toBeInTheDocument();
    });
  });
});
