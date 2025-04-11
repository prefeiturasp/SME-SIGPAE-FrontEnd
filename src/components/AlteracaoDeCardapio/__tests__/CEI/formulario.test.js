import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "constants/shared";
import { MeusDadosContext } from "context/MeusDadosContext";
import { localStorageMock } from "mocks/localStorageMock";
import { mockMeusDadosCEI } from "mocks/meusDados/escola/CEI";
import { mockMotivosAlteracaoCardapioCEI } from "mocks/services/alteracaoCardapio.service/CEI/motivosAlteracaoCardapio";
import { mockRascunhosAlteracaoCEI } from "mocks/services/alteracaoCardapio.service/CEI/rascunhos";
import { mockVinculosTipoAlimentacaoPeriodoEscolarCEI } from "mocks/services/cadastroTipoAlimentacao.service/CEI/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockFeriadosAno2025 } from "mocks/services/diasUteis.service/feriadosAno2025";
import { AlteracaoDeCardapioCEIPage } from "pages/Escola/AlteracaoDeCardapioCEIPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "services/_mock";

describe("Teste Formulário Alteração do tipo de Alimentação CEI", () => {
  const escolaUuid = mockMeusDadosCEI.vinculo_atual.instituicao.uuid;

  beforeEach(async () => {
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
      .reply(200, {
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
      });

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
    expect(screen.getByText("Dia: 29/04/2025")).toBeInTheDocument();
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
    const inputElement = divDia.querySelector("input");
    fireEvent.change(inputElement, {
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
  });
});
