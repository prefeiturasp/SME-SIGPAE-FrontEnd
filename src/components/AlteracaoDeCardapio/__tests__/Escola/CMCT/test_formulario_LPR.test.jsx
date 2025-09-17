import "@testing-library/jest-dom";
import {
  act,
  findByText,
  fireEvent,
  getByText,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockDiasUteis } from "src/mocks/diasUseisMock";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaCMCT } from "src/mocks/meusDados/escolaCMCT";
import { mockRascunhoAlteracaoCardapioCMCT } from "src/mocks/services/alteracaoCardapio.service/CMCT/rascunhoAlteracaoCardapio";
import { mockRascunhosAlteracaoCardapioCMCT } from "src/mocks/services/alteracaoCardapio.service/CMCT/rascunhosAlteracaoCardapio";
import { mockMotivosAlteracaoCardapio } from "src/mocks/services/alteracaoCardapio.service/motivosAlteracaoCardapio";
import { mockGetVinculosTipoAlimentacaoPorEscolaCMCT } from "src/mocks/services/cadastroTipoAlimentacao.service/CMCT/mockGetVinculosTipoAlimentacaoPorEscolaCMCT";
import { mockQuantidadeAlunosPorPeriodoCMCT } from "src/mocks/services/escola.service/CMCT/mockQuantidadeAlunosPorPeriodoCMCT";
import AlteracaoDeCardapioPage from "src/pages/Escola/AlteracaoDeCardapioPage";
import React from "react";
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

describe("Teste Formulário Alteração de Cardápio - LPR - CMCT", () => {
  beforeEach(async () => {
    process.env.IS_TEST = true;
    const uuidEscola = mockMeusDadosEscolaCMCT.vinculo_atual.instituicao.uuid;

    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCMCT);
    mock
      .onGet("/motivos-alteracao-cardapio/")
      .reply(200, mockMotivosAlteracaoCardapio);
    mock.onGet("/dias-uteis/").reply(200, mockDiasUteis);
    mock
      .onGet("/alteracoes-cardapio/minhas-solicitacoes/")
      .reply(200, mockRascunhosAlteracaoCardapioCMCT);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${uuidEscola}/`
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCMCT);
    mock
      .onGet(`/quantidade-alunos-por-periodo/escola/${uuidEscola}/`)
      .reply(200, mockQuantidadeAlunosPorPeriodoCMCT);
    mock
      .onPost("/alteracoes-cardapio/")
      .reply(201, mockRascunhoAlteracaoCardapioCMCT);
    mock
      .onPatch(
        `/alteracoes-cardapio/${mockRascunhoAlteracaoCardapioCMCT.uuid}/`
      )
      .reply(200, mockRascunhoAlteracaoCardapioCMCT);
    mock
      .onPatch(
        `/alteracoes-cardapio/${mockRascunhoAlteracaoCardapioCMCT.uuid}/inicio-pedido/`
      )
      .reply(200, {
        ...mockRascunhoAlteracaoCardapioCMCT,
        status: "DRE_A_VALIDAR",
      });
    mock
      .onDelete(
        `/alteracoes-cardapio/${mockRascunhoAlteracaoCardapioCMCT.uuid}/`
      )
      .reply(204, {});

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", `"CMCT VANDYR DA SILVA, PROF"`);
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
              meusDados: mockMeusDadosEscolaCMCT,
              setMeusDados: jest.fn(),
            }}
          >
            <AlteracaoDeCardapioPage />
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

  it("renderiza bloco `Rascunhos`", async () => {
    expect(screen.getByText("Rascunhos")).toBeInTheDocument();
    expect(
      screen.getByText("Alteração do Tipo de Alimentação # 545D5")
    ).toBeInTheDocument();
    expect(screen.getByText("Dia: 01/04/2025")).toBeInTheDocument();
    expect(
      screen.getByText("Salvo em: 17/03/2025 09:53:31")
    ).toBeInTheDocument();
  });

  const selecionaMotivoLPR = () => {
    const selectMotivoDiv = screen.getByTestId("div-select-motivo");
    const selectElementMotivo = selectMotivoDiv.querySelector("select");
    const uuidLPR = mockMotivosAlteracaoCardapio.results.find((motivo) =>
      motivo.nome.includes("LPR")
    ).uuid;
    fireEvent.change(selectElementMotivo, {
      target: { value: uuidLPR },
    });
  };

  const keyDownEvent = {
    key: "ArrowDown",
  };

  const selectOption = async (container, optionText) => {
    const placeholder = getByText(container, "Selecione tipos de alimentação");
    fireEvent.keyDown(placeholder, keyDownEvent);
    await findByText(container, optionText);
    fireEvent.click(getByText(container, optionText));
  };

  it("Testa Alteração - Motivo LPR", async () => {
    selecionaMotivoLPR();
    expect(screen.getByText("Alterar dia")).toBeInTheDocument();

    const divInputAlterarDia = screen.getByTestId("div-input-alterar-dia");
    const inputElement = divInputAlterarDia.querySelector("input");
    fireEvent.change(inputElement, {
      target: { value: "30/01/2025" },
    });

    const divCheckboxMANHA = screen.getByTestId("div-checkbox-MANHA");
    const spanElement = divCheckboxMANHA.querySelector("span");
    await act(async () => {
      fireEvent.click(spanElement);
    });

    await selectOption(
      screen.getByTestId("select-tipos-alimentacao-de-MANHA"),
      "Lanche 4h"
    );

    await selectOption(
      screen.getByTestId("select-tipos-alimentacao-para-MANHA"),
      "Refeição"
    );

    const divInputNumeroAlunosMANHA = screen.getByTestId(
      "div-input-numero-alunos-MANHA"
    );
    const inputElementNumeroAlunosMANHA =
      divInputNumeroAlunosMANHA.querySelector("input");
    fireEvent.change(inputElementNumeroAlunosMANHA, {
      target: { value: "12345" },
    });

    const textarea = screen.getByTestId("ckeditor-mock");
    fireEvent.change(textarea, {
      target: { value: "justificativa da alteração" },
    });
    await waitFor(() => {
      expect(textarea.value).toBe("justificativa da alteração");
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

    expect(screen.getByText("Solicitação # 545D5")).toBeInTheDocument();

    const divInputNumeroAlunosMANHA = screen.getByTestId(
      "div-input-numero-alunos-MANHA"
    );
    const inputElementNumeroAlunosMANHA =
      divInputNumeroAlunosMANHA.querySelector("input");
    expect(inputElementNumeroAlunosMANHA).toHaveAttribute("value", "123");

    const botaoEnviar = screen.getByText("Enviar").closest("button");
    fireEvent.click(botaoEnviar);
  });

  it("Exclui rascunho", async () => {
    window.confirm = jest.fn().mockImplementation(() => true);
    const botaoRemoverRascunho = screen.getByTestId("botao-remover-rascunho");
    mock.onGet("/alteracoes-cardapio/minhas-solicitacoes/").reply(200, []);
    await act(async () => {
      fireEvent.click(botaoRemoverRascunho);
    });
    expect(screen.queryByText("Rascunhos")).not.toBeInTheDocument();
  });

  it("Erro ao excluir rascunho", async () => {
    mock
      .onDelete(
        `/alteracoes-cardapio/${mockRascunhoAlteracaoCardapioCMCT.uuid}/`
      )
      .reply(400, { detail: "Erro ao excluir rascunho" });
    window.confirm = jest.fn().mockImplementation(() => true);
    const botaoRemoverRascunho = screen.getByTestId("botao-remover-rascunho");
    await act(async () => {
      fireEvent.click(botaoRemoverRascunho);
    });
  });
});
