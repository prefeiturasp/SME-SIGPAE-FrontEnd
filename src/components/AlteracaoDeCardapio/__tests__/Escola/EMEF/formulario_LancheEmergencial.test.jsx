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
import { mockDiasUteis } from "mocks/diasUseisMock";
import { localStorageMock } from "mocks/localStorageMock";
import { mockMeusDadosEscolaEMEFPericles } from "mocks/meusDados/escolaEMEFPericles";
import { mockRascunhoAlteracaoCardapioEMEF } from "mocks/services/alteracaoCardapio.service/EMEF/rascunhoAlteracaoCardapio";
import { mockRascunhosAlteracaoCardapioEMEF } from "mocks/services/alteracaoCardapio.service/EMEF/rascunhosAlteracaoCardapio";
import { mockMotivosAlteracaoCardapio } from "mocks/services/alteracaoCardapio.service/motivosAlteracaoCardapio";
import { mockVinculosTipoAlimentacaoPeriodoEscolarEMEF } from "mocks/services/cadastroTipoAlimentacao.service/EMEF/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockQuantidadeAlunosPorPeriodoEMEF } from "mocks/services/escola.service/EMEF/quantidadeAlunosPorPeriodoEMEF";
import AlteracaoDeCardapioPage from "src/pages/Escola/AlteracaoDeCardapioPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

jest.mock("components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: () => (
    <textarea data-testid="ckeditor-mock" name="observacoes" required={false} />
  ),
}));

jest.mock("react-toastify", () => ({
  success: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  POSITION: {
    TOP_CENTER: "top-center",
  },
}));

describe("Teste Formulário Alteração de Cardápio - Lanche Emergencial - EMEF", () => {
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
      .reply(200, mockVinculosTipoAlimentacaoPeriodoEscolarEMEF);
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

  const selecionaMotivoLancheEmergencial = () => {
    const selectMotivoDiv = screen.getByTestId("div-select-motivo");
    const selectElementMotivo = selectMotivoDiv.querySelector("select");
    const uuidLancheEmergencial = mockMotivosAlteracaoCardapio.results.find(
      (motivo) => motivo.nome.includes("Lanche Emergencial")
    ).uuid;
    fireEvent.change(selectElementMotivo, {
      target: { value: uuidLancheEmergencial },
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

  it("Testa Alteração - Motivo Lanche Emergencial", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-01-30T00:00:00Z"));

    selecionaMotivoLancheEmergencial();
    expect(screen.getByText("Alterar dia")).toBeInTheDocument();

    const divInputDataInicial = screen.getByTestId("div-input-data-inicial");
    const inputElementDataInicial = divInputDataInicial.querySelector("input");
    await waitFor(async () => {
      fireEvent.change(inputElementDataInicial, {
        target: { value: "30/01/2025" },
      });
    });

    const divInputDataFinal = screen.getByTestId("div-input-data-final");
    const inputElementDataFinal = divInputDataFinal.querySelector("input");
    fireEvent.change(inputElementDataFinal, {
      target: { value: "01/02/2025" },
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
      "Lanche Emergencial"
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

    jest.useRealTimers();
  });
});
