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
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "constants/shared";
import { MeusDadosContext } from "context/MeusDadosContext";
import { mockDiasUteis } from "mocks/diasUseisMock";
import { localStorageMock } from "mocks/localStorageMock";
import { mockMeusDadosEscolaEMEFPericles } from "mocks/meusDados/escolaEMEFPericles";
import { mockRascunhoAlteracaoCardapioEMEF } from "mocks/services/alteracaoCardapio.service/EMEF/rascunhoAlteracaoCardapio";
import { mockRascunhosAlteracaoCardapioEMEF } from "mocks/services/alteracaoCardapio.service/EMEF/rascunhosAlteracaoCardapio";
import { mockMotivosAlteracaoCardapio } from "mocks/services/alteracaoCardapio.service/motivosAlteracaoCardapio";
import { mockGetVinculosMotivoInclusaoEspecificoEMEF } from "mocks/services/cadastroTipoAlimentacao.service/EMEF/mockGetVinculosTipoAlimentacaoPorEscolaEMEF";
import { mockQuantidadeAlunosPorPeriodoEMEF } from "mocks/services/escola.service/EMEF/quantidadeAlunosPorPeriodoEMEF";
import AlteracaoDeCardapioPage from "pages/Escola/AlteracaoDeCardapioPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "services/_mock";

jest.mock("components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: () => (
    <textarea data-testid="ckeditor-mock" name="observacoes" required={false} />
  ),
}));

describe("Teste Formulário Alteração de Cardápio - EMEF", () => {
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
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/3c32be8e-f191-468d-a4e2-3dd8751e5e7a/"
      )
      .reply(200, mockGetVinculosMotivoInclusaoEspecificoEMEF);
    mock
      .onGet(
        "/quantidade-alunos-por-periodo/escola/3c32be8e-f191-468d-a4e2-3dd8751e5e7a/"
      )
      .reply(200, mockQuantidadeAlunosPorPeriodoEMEF);
    mock
      .onPost("/alteracoes-cardapio/")
      .reply(201, mockRascunhoAlteracaoCardapioEMEF);
    mock
      .onPatch(
        `/alteracoes-cardapio/${mockRascunhoAlteracaoCardapioEMEF.uuid}/`
      )
      .reply(200, mockRascunhoAlteracaoCardapioEMEF);
    mock
      .onPatch(
        `/alteracoes-cardapio/${mockRascunhoAlteracaoCardapioEMEF.uuid}/inicio-pedido/`
      )
      .reply(200, {
        ...mockRascunhoAlteracaoCardapioEMEF,
        status: "DRE_A_VALIDAR",
      });
    mock
      .onDelete(
        `/alteracoes-cardapio/${mockRascunhoAlteracaoCardapioEMEF.uuid}/`
      )
      .reply(204, {});

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "nome_instituicao",
      `"EMEF PERICLES EUGENIO DA SILVA RAMOS"`
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
    expect(screen.getByText("Nº de Matriculados")).toBeInTheDocument();
    expect(screen.getByText("524")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Informação automática disponibilizada pelo Cadastro da Unidade Escolar"
      )
    ).toBeInTheDocument();
  });

  it("renderiza bloco `Rascunhos`", async () => {
    expect(screen.getByText("Rascunhos")).toBeInTheDocument();
    expect(
      screen.getByText("Alteração do Tipo de Alimentação # 807A8")
    ).toBeInTheDocument();
    expect(screen.getByText("Dia: 18/06/2025")).toBeInTheDocument();
    expect(
      screen.getByText("Salvo em: 13/03/2025 10:12:31")
    ).toBeInTheDocument();
  });

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

  const keyDownEvent = {
    key: "ArrowDown",
  };

  const selectOption = async (container, optionText) => {
    const placeholder = getByText(container, "Selecione tipos de alimentação");
    fireEvent.keyDown(placeholder, keyDownEvent);
    await findByText(container, optionText);
    fireEvent.click(getByText(container, optionText));
  };

  it("Testa Alteração - Motivo RPL", async () => {
    selecionaMotivoRPL();
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
      "Refeição"
    );

    await selectOption(
      screen.getByTestId("select-tipos-alimentacao-para-MANHA"),
      "Lanche"
    );

    const divInputNumeroAlunosMANHA = screen.getByTestId(
      "div-input-numero-alunos-MANHA"
    );
    const inputElementNumeroAlunosMANHA =
      divInputNumeroAlunosMANHA.querySelector("input");
    fireEvent.change(inputElementNumeroAlunosMANHA, {
      target: { value: "123" },
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

    expect(screen.getByText("Solicitação # 807A8")).toBeInTheDocument();

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
});
