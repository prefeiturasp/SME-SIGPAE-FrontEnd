import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "constants/shared";
import { MeusDadosContext } from "context/MeusDadosContext";
import { localStorageMock } from "mocks/localStorageMock";
import { mockMeusDadosCEI } from "mocks/meusDados/escola/CEI";
import { mockMotivosAlteracaoCardapioCEI } from "mocks/services/alteracaoCardapio.service/CEI/motivosAlteracaoCardapio";
import { mockFeriadosAno2025 } from "mocks/services/diasUteis.service/feriadosAno2025";
import { AlteracaoDeCardapioCEIPage } from "pages/Escola/AlteracaoDeCardapioCEIPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "services/_mock";

jest.mock("components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: () => (
    <textarea data-testid="ckeditor-mock" name="observacoes" required={false} />
  ),
}));

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
      .reply(400, {
        detail: "Erro ao carregar vínculos do tipo de alimentação.",
      });
    mock
      .onGet(`/periodos-com-matriculados-por-ue/?escola_uuid=${escolaUuid}/`)
      .reply(200, ["INTEGRAL"]);

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

  it("Renderiza erro ao carregar vínculos do tipo de alimentação", () => {
    expect(
      screen.getByText(
        "Erro ao carregar vínculos de tipo de alimentação. Tente novamente mais tarde."
      )
    ).toBeInTheDocument();
  });
});
