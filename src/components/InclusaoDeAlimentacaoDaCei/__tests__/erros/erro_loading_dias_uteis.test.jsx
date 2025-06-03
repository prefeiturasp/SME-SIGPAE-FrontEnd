import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMotivosInclusaoNormal } from "src/mocks/InclusaoAlimentacao/mockMotivosInclusaoNormal";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaCEIcomMANHAeTARDE } from "src/mocks/meusDados/escola/CEIcomMANHAeTARDE";
import { mockVinculosTipoAlimentacaoPeriodoEscolarCEIComManhaTarde } from "src/mocks/services/cadastroTipoAlimentacao.service/CEI/vinculosTipoAlimentacaoPeriodoEscolarComManhaTarde";
import { mockQuantidadeAlunosFaixaEtariaEscolaCEIINTEGRAL } from "src/mocks/services/inclusaoDeAlimentacao/escola.service/CEI/quantidadeAlunosFaixaEtariaINTEGRAL";
import { mockQuantidadeAlunosFaixaEtariaEscolaCEIMANHA } from "src/mocks/services/inclusaoDeAlimentacao/escola.service/CEI/quantidadeAlunosFaixaEtariaMANHA";
import { mockQuantidadeAlunosFaixaEtariaEscolaCEITARDE } from "src/mocks/services/inclusaoDeAlimentacao/escola.service/CEI/quantidadeAlunosFaixaEtariaTARDE";
import { mockRascunhosInclusaoAlimentacaoEscolaCEIManhaETarde } from "src/mocks/services/inclusaoDeAlimentacao/escola.service/CEI/rascunhos";
import { InclusaoDeAlimentacaoCEIPage } from "src/pages/Escola/InclusaoDeAlimentacaoCEIPage";
import { MemoryRouter } from "react-router-dom";
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
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`
      )
      .reply(200, mockVinculosTipoAlimentacaoPeriodoEscolarCEIComManhaTarde);
    mock
      .onGet("/dias-uteis/")
      .reply(400, { detail: "Erro ao carregar dias uteis" });
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

  it("renderiza erro `Erro ao carregar dias úteis. Tente novamente mais tarde.`", async () => {
    expect(
      screen.getByText(
        "Erro ao carregar dias úteis. Tente novamente mais tarde."
      )
    ).toBeInTheDocument();
  });
});
