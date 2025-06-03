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
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCEI } from "src/mocks/meusDados/escola/CEI";
import { mockAlteracaoCardapioCEI } from "src/mocks/services/alteracaoCardapio.service/CEI/alteracaoCardapio";
import { mockMotivosAlteracaoCardapioCEI } from "src/mocks/services/alteracaoCardapio.service/CEI/motivosAlteracaoCardapio";
import { mockRascunhosAlteracaoCEI } from "src/mocks/services/alteracaoCardapio.service/CEI/rascunhos";
import { mockVinculosTipoAlimentacaoPeriodoEscolarCEI } from "src/mocks/services/cadastroTipoAlimentacao.service/CEI/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockFeriadosAno2025 } from "src/mocks/services/diasUteis.service/feriadosAno2025";
import { AlteracaoDeCardapioCEIPage } from "src/pages/Escola/AlteracaoDeCardapioCEIPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: () => (
    <textarea data-testid="ckeditor-mock" name="observacoes" required={false} />
  ),
}));

describe("Teste Formulário Alteração do tipo de Alimentação CEI", () => {
  const escolaUuid = mockMeusDadosCEI.vinculo_atual.instituicao.uuid;

  const responseFaixasEtarias = {
    count: 1,
    results: [
      {
        faixa_etaria: {
          __str__: "01 ano a 03 anos e 11 meses",
          uuid: "e3030bd1-2e85-4676-87b3-96b4032370d4",
          inicio: 12,
          fim: 48,
        },
        count: 50,
      },
    ],
  };

  beforeEach(async () => {
    process.env.IS_TEST = true;

    mock
      .onGet("/motivos-alteracao-cardapio/")
      .reply(200, mockMotivosAlteracaoCardapioCEI);
    mock.onGet("/feriados-ano/").reply(200, mockFeriadosAno2025);
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCEI);
    mock.onGet("/dias-uteis/").reply(200, {
      proximos_cinco_dias_uteis: "2025-04-22",
      proximos_dois_dias_uteis: "2025-04-16",
    });
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`
      )
      .reply(200, mockVinculosTipoAlimentacaoPeriodoEscolarCEI);
    mock
      .onGet(`/periodos-com-matriculados-por-ue/?escola_uuid=${escolaUuid}/`)
      .reply(200, ["INTEGRAL"]);
    mock
      .onGet("/alteracoes-cardapio-cei/minhas-solicitacoes/")
      .reply(200, mockRascunhosAlteracaoCEI);
    mock
      .onGet(
        "/periodos-escolares/e17e2405-36be-4981-a09c-35c89ae0f8b7/alunos-por-faixa-etaria/2025-04-23/"
      )
      .reply(200, responseFaixasEtarias);
    mock
      .onPost("/alteracoes-cardapio-cei/")
      .reply(201, mockAlteracaoCardapioCEI);
    mock
      .onPatch(
        `/alteracoes-cardapio-cei/${mockRascunhosAlteracaoCEI.results[0].uuid}/`
      )
      .reply(200, mockAlteracaoCardapioCEI);
    mock
      .onPatch(
        `/alteracoes-cardapio-cei/${mockAlteracaoCardapioCEI.uuid}/inicio-pedido/`
      )
      .reply(200, mockAlteracaoCardapioCEI);
    mock
      .onDelete(
        `/alteracoes-cardapio-cei/${mockRascunhosAlteracaoCEI.results[0].uuid}/`
      )
      .reply(204);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", `"CEI DIRET MONUMENTO"`);
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
              meusDados: mockMeusDadosCEI,
              setMeusDados: jest.fn(),
            }}
          >
            <AlteracaoDeCardapioCEIPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Renderiza título da página `Alteração do Tipo de Alimentação`", () => {
    expect(screen.getAllByText("Alteração do Tipo de Alimentação").length).toBe(
      2
    );
  });

  it("renderiza bloco com número de matriculados", async () => {
    expect(screen.getByText("Nº de Matriculados")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Informação automática disponibilizada pelo Cadastro da Unidade Escolar"
      )
    ).toBeInTheDocument();
  });

  it("renderiza bloco `Rascunhos`", async () => {
    expect(screen.getByText("Rascunhos")).toBeInTheDocument();
    expect(
      screen.getByText("Alteração do Tipo de Alimentação # 8A5BA")
    ).toBeInTheDocument();
    expect(screen.getByText("Dia: 23/04/2025")).toBeInTheDocument();
    expect(
      screen.getByText("Salvo em: 11/04/2025 10:10:43")
    ).toBeInTheDocument();
  });
  const setMotivoRPL = () => {
    const selectMotivo = screen.getByTestId("select-motivo");
    const selectElement = selectMotivo.querySelector("select");
    const uuidMotivoRPL = mockMotivosAlteracaoCardapioCEI.results.find(
      (motivo) => motivo.nome.includes("RPL")
    ).uuid;
    fireEvent.change(selectElement, {
      target: { value: uuidMotivoRPL },
    });
  };

  it("renderiza modal para dia selecionado ser menor que 5 dias úteis", async () => {
    setMotivoRPL();
    const divDia = screen.getByTestId("data-alterar-dia");
    const inputElement = divDia.querySelector("input");

    expect(screen.queryByText("Atenção")).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        "A solicitação está fora do prazo contratual de cinco dias úteis. Sendo assim, a autorização dependerá de confirmação por parte da empresa terceirizada."
      )
    ).not.toBeInTheDocument();

    fireEvent.change(inputElement, {
      target: { value: "17/04/2025" },
    });

    expect(screen.queryByText("Atenção")).toBeInTheDocument();
    expect(
      screen.queryByText(
        "A solicitação está fora do prazo contratual de cinco dias úteis. Sendo assim, a autorização dependerá de confirmação por parte da empresa terceirizada."
      )
    ).toBeInTheDocument();
  });

  const setTipoAlimentacaoDeAlmoco = () => {
    const selectMotivo = screen.getByTestId("select-tipos-alimentacao-de");
    const selectElement = selectMotivo.querySelector("select");
    const uuidAlmoco = mockVinculosTipoAlimentacaoPeriodoEscolarCEI.results
      .find((vinculo) => vinculo.periodo_escolar.nome === "INTEGRAL")
      .tipos_alimentacao.find((tipo_alimentacao) =>
        tipo_alimentacao.nome.includes("Almoço")
      ).uuid;
    fireEvent.change(selectElement, {
      target: { value: uuidAlmoco },
    });
  };

  const setTipoAlimentacaoParaLanche = () => {
    const selectMotivo = screen.getByTestId("select-tipos-alimentacao-para");
    const selectElement = selectMotivo.querySelector("select");
    const uuidLanche = mockVinculosTipoAlimentacaoPeriodoEscolarCEI.results
      .find((vinculo) => vinculo.periodo_escolar.nome === "INTEGRAL")
      .tipos_alimentacao.find((tipo_alimentacao) =>
        tipo_alimentacao.nome.includes("Lanche")
      ).uuid;
    fireEvent.change(selectElement, {
      target: { value: uuidLanche },
    });
  };

  it("renderiza label `Período` após selecionar um motivo e um dia", async () => {
    setMotivoRPL();

    const divDia = screen.getByTestId("data-alterar-dia");
    const inputElement = divDia.querySelector("input");
    fireEvent.change(inputElement, {
      target: { value: "23/04/2025" },
    });

    expect(screen.getByText("Período")).toBeInTheDocument();
  });

  it("renderiza tabela de faixas etárias após selecionar um período", async () => {
    setMotivoRPL();

    const divDia = screen.getByTestId("data-alterar-dia");
    const inputElementDia = divDia.querySelector("input");
    fireEvent.change(inputElementDia, {
      target: { value: "23/04/2025" },
    });

    expect(screen.getByText("Período")).toBeInTheDocument();
    expect(screen.getByText("INTEGRAL")).toBeInTheDocument();

    const divCheckboxINTEGRAL = screen.getByTestId("div-checkbox-INTEGRAL");
    const spanElement = divCheckboxINTEGRAL.querySelector("span");

    // check período INTEGRAL
    await act(async () => {
      fireEvent.click(spanElement);
    });

    await waitFor(() => {
      expect(screen.getByText("Faixa Etária")).toBeInTheDocument();
      expect(
        screen.getByText("01 ano a 03 anos e 11 meses")
      ).toBeInTheDocument();
    });

    setTipoAlimentacaoDeAlmoco();
    setTipoAlimentacaoParaLanche();

    const divInputQuantidade = screen.getByTestId(
      "substituicoes[0].faixas.e3030bd1-2e85-4676-87b3-96b4032370d4"
    );
    const inputElementQuantidade = divInputQuantidade.querySelector("input");
    fireEvent.change(inputElementQuantidade, {
      target: { value: "50" },
    });

    const textarea = screen.getByTestId("ckeditor-mock");
    fireEvent.change(textarea, {
      target: { value: "teste observacoes" },
    });

    const botaoSalvarRascunho = screen
      .getByText("Salvar rascunho")
      .closest("button");
    fireEvent.click(botaoSalvarRascunho);
  });

  it("Carrega rascunho e envia", async () => {
    const botaoCarregarRascunho = screen.getByTestId("botao-carregar-rascunho");
    await act(async () => {
      fireEvent.click(botaoCarregarRascunho);
    });

    expect(screen.getByText("Solicitação # 8A5BA")).toBeInTheDocument();

    const divInputQuantidade = screen.getByTestId(
      "substituicoes[0].faixas.e3030bd1-2e85-4676-87b3-96b4032370d4"
    );
    const inputElementQuantidade = divInputQuantidade.querySelector("input");
    expect(inputElementQuantidade).toHaveAttribute("value", "50");

    const botaoEnviar = screen.getByText("Enviar").closest("button");
    fireEvent.click(botaoEnviar);
  });

  it("Exclui rascunho", async () => {
    window.confirm = jest.fn().mockImplementation(() => true);
    const botaoRemoverRascunho = screen.getByTestId("botao-remover-rascunho");
    mock.onGet("/alteracoes-cardapio-cei/minhas-solicitacoes/").reply(200, []);
    await act(async () => {
      fireEvent.click(botaoRemoverRascunho);
    });
    expect(screen.queryByText("Rascunhos")).not.toBeInTheDocument();
  });

  it("Erro ao excluir rascunho", async () => {
    mock
      .onDelete(
        `/alteracoes-cardapio/${mockRascunhosAlteracaoCEI.results[0].uuid}/`
      )
      .reply(400, { detail: "Erro ao excluir rascunho" });
    window.confirm = jest.fn().mockImplementation(() => true);
    const botaoRemoverRascunho = screen.getByTestId("botao-remover-rascunho");
    await act(async () => {
      fireEvent.click(botaoRemoverRascunho);
    });
  });
});
